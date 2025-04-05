package config

import (
	"os"
	"path/filepath"

	"github.com/kbinani/screenshot"
)

func EnsurePreferencesFile() (*Preferences, error) {
	path := filepath.Join(GetConfigBase(), "preferences.yml")
	if _, err := os.Stat(path); err == nil {
		return LoadPreferences()
	}

	bounds := screenshot.GetDisplayBounds(0)
	screenW := bounds.Dx()
	screenH := bounds.Dy()

	w := screenW * 3 / 4
	h := screenH * 3 / 4
	x := (screenW - w) / 2
	y := (screenH - h) / 2

	defaults := &Preferences{
		X:        x,
		Y:        y,
		Width:    w,
		Height:   h,
		LastView: "/",
	}

	err := SavePreferences(defaults)
	if err != nil {
		return nil, err
	}
	return defaults, nil
}
