package types

import (
	"os"
	"path/filepath"
	"runtime"
	"testing"
)

var configBase string

func GetConfigBase() string {
	if configBase != "" {
		return configBase
	}

	if xdg := os.Getenv("XDG_CONFIG_HOME"); xdg != "" {
		return filepath.Join(xdg, "TrueBlocks")
	}

	home, err := os.UserHomeDir()
	if err != nil {
		panic("Unable to determine user home directory")
	}

	switch runtime.GOOS {
	case "darwin":
		return filepath.Join(home, "Library", "Application Support", "TrueBlocks")
	case "windows":
		return filepath.Join(os.Getenv("AppData"), "TrueBlocks")
	default:
		return filepath.Join(home, ".config", "TrueBlocks")
	}
}

func SetConfigBaseForTest(t *testing.T, path string) func() {
	t.Helper()
	original := configBase
	configBase = path
	return func() {
		configBase = original
	}
}
