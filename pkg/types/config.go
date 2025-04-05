package types

import (
	"os"
	"path/filepath"
	"runtime"
)

var configBase string

func GetConfigBase() string {
	if configBase != "" {
		return configBase
	}

	if xdg := os.Getenv("XDG_CONFIG_HOME"); xdg != "" {
		return filepath.Join(xdg, "TrueBlocks", "codeGen")
	}

	home, err := os.UserHomeDir()
	if err != nil {
		panic("Unable to determine user home directory")
	}

	switch runtime.GOOS {
	case "darwin":
		return filepath.Join(home, "Library", "Application Support", "TrueBlocks", "codeGen")
	case "windows":
		return filepath.Join(os.Getenv("AppData"), "TrueBlocks", "codeGen")
	default:
		return filepath.Join(home, ".config", "TrueBlocks", "codeGen")
	}
}

func SetConfigBaseForTest(path string) func() {
	original := configBase
	configBase = path
	return func() {
		configBase = original
	}
}
