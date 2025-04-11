package app

import (
	"fmt"
	"strings"

	"github.com/TrueBlocks/trueblocks-codeGen/pkg/types"
	"github.com/TrueBlocks/trueblocks-codeGen/pkg/validation"
)

func (a *App) GetWizardState() types.WizardState {
	return a.State.GetWizardState()
}

func (a *App) SetUserInfo(name, email string) error {
	name = strings.TrimSpace(name)
	email = strings.TrimSpace(email)

	if err := validation.ValidEmail(email); err != nil {
		return fmt.Errorf("SetUserInfo failed: %w", err)
	} else if name == "" {
		err = validation.ValidationError{Field: "name", Problem: "cannot be empty"}
		return fmt.Errorf("SetUserInfo failed: %w", err)
	}

	prefs := []types.KV{
		{Key: "user.name", Value: name},
		{Key: "user.email", Value: email},
	}
	return a.State.SetPreferences(prefs, true)
}

func (a *App) SetRPC(rpc string) error {
	rpc = strings.TrimSpace(rpc)

	if err := validation.ValidRPC(rpc); err != nil {
		return fmt.Errorf("SetRPC failed: %w", err)
	}

	for _, existing := range a.State.User.RPCs {
		if existing == rpc {
			return nil
		}
	}

	newList := append([]string{rpc}, a.State.User.RPCs...)
	a.State.User.RPCs = newList[:min(5, len(newList))]

	value := strings.Join(a.State.User.RPCs, ",")
	_ = a.State.SetPreferences([]types.KV{{Key: "user.rpcs", Value: value}}, true)

	return nil
}

func (a *App) CheckRPCStatus() (string, error) {
	return a.State.CheckRPCStatus()
}

func (a *App) ResetWizardState() {
	a.State.App.RecentlyUsedFiles = []string{}
	a.State.User.RPCs = []string{}
	_ = a.State.SavePreferences()
}

// IsInitialized returns whether the app has been initialized
func (a *App) IsInitialized() bool {
	prefs := a.GetAppPreferences()
	return prefs.IsInitialized
}

// SetInitialized sets the app initialization status
func (a *App) SetInitialized(state bool) error {
	prefs := a.GetAppPreferences()
	prefs.IsInitialized = state
	return a.State.SavePreferences()
}
