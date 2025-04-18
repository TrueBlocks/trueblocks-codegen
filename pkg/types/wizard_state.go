package types

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-codeGen/pkg/validation"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

type WizardState struct {
	MissingNameEmail      bool `json:"missingNameEmail"`
	RPCUnavailable        bool `json:"rpcUnavailable"`
	MissingLastOpenedFile bool `json:"missingLastOpenedFile"`
}

func (s *State) GetWizardState() WizardState {
	missingNameEmail := s.User.Name == "" || s.User.Email == ""

	rpcUnavailable := true
	if !missingNameEmail {
		hasRpcs := false
		for _, chain := range s.User.Chains {
			if len(chain.RpcProviders) > 0 {
				hasRpcs = true
				break
			}
		}

		if hasRpcs {
			_, err := s.CheckRPCStatus()
			rpcUnavailable = err != nil
		}
	}

	missingLastOpenedFile := len(s.App.RecentlyUsedFiles) == 0 || s.App.RecentlyUsedFiles[0] == ""

	return WizardState{
		MissingNameEmail:      missingNameEmail,
		RPCUnavailable:        rpcUnavailable,
		MissingLastOpenedFile: missingLastOpenedFile,
	}
}

func (s *State) SetUserInfo(name, email string) error {
	name = strings.TrimSpace(name)
	email = strings.TrimSpace(email)

	if name == "" {
		return fmt.Errorf("name cannot be empty")
	}

	if err := validation.ValidEmail(email); err != nil {
		return fmt.Errorf("invalid email: %w", err)
	}

	s.User.Name = name
	s.User.Email = email

	return SetUserPreferences(&s.User)
}

func (s *State) SetRPC(rpcURL string) error {
	rpcURL = strings.TrimSpace(rpcURL)

	if rpcURL == "" {
		return fmt.Errorf("RPC URL cannot be empty")
	}

	if !strings.HasPrefix(rpcURL, "http://") && !strings.HasPrefix(rpcURL, "https://") {
		return fmt.Errorf("RPC URL must start with http:// or https://")
	}

	chainID := uint64(1)
	chainName := "mainnet"
	symbol := "ETH"
	explorer := "https://etherscan.io"

	foundInChain := false
	for i, chain := range s.User.Chains {
		if chain.ChainId == chainID {
			for _, existingRpc := range chain.RpcProviders {
				if existingRpc == rpcURL {
					return nil
				}
			}

			s.User.Chains[i].RpcProviders = append([]string{rpcURL}, chain.RpcProviders...)

			if len(s.User.Chains[i].RpcProviders) > 5 {
				s.User.Chains[i].RpcProviders = s.User.Chains[i].RpcProviders[:5]
			}

			foundInChain = true
			break
		}
	}

	if !foundInChain {
		newChain := Chain{
			Chain:          chainName,
			ChainId:        chainID,
			RemoteExplorer: explorer,
			RpcProviders:   []string{rpcURL},
			Symbol:         symbol,
		}
		s.User.Chains = append([]Chain{newChain}, s.User.Chains...)
	}

	return SetUserPreferences(&s.User)
}

func (s *State) CheckRPCStatus() (string, error) {
	var lastErr error = fmt.Errorf("no RPCs configured")

	for _, chain := range s.User.Chains {
		for _, rpc := range chain.RpcProviders {
			if err := sdk.PingRpc(rpc); err == nil {
				return rpc, nil
			} else {
				lastErr = err
			}
		}
	}

	return "", lastErr
}
