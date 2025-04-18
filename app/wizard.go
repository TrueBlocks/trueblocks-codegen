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

	return a.State.SetRPC(rpc)
}

func (a *App) CheckRPCStatus() (string, error) {
	return a.State.CheckRPCStatus()
}
