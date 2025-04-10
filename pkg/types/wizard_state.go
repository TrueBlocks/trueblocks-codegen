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
	if !missingNameEmail && len(s.User.RPCs) > 0 {
		_, err := s.CheckRPCStatus()
		rpcUnavailable = err != nil
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

	return SaveUserPreferences(&s.User)
}

func (s *State) SetRPC(rpcURL string) error {
	rpcURL = strings.TrimSpace(rpcURL)

	if rpcURL == "" {
		return fmt.Errorf("RPC URL cannot be empty")
	}

	if !strings.HasPrefix(rpcURL, "http://") && !strings.HasPrefix(rpcURL, "https://") {
		return fmt.Errorf("RPC URL must start with http:// or https://")
	}

	for _, existingRPC := range s.User.RPCs {
		if existingRPC == rpcURL {
			return nil
		}
	}

	s.User.RPCs = append([]string{rpcURL}, s.User.RPCs...)

	if len(s.User.RPCs) > 5 {
		s.User.RPCs = s.User.RPCs[:5]
	}

	return SaveUserPreferences(&s.User)
}

func (s *State) CheckRPCStatus() (string, error) {
	var lastErr error = fmt.Errorf("no RPCs configured")
	for _, rpc := range s.User.RPCs {
		if err := sdk.PingRpc(rpc); err == nil {
			// we found one
			return rpc, nil
		} else {
			lastErr = err
		}
	}

	return "", lastErr
}
