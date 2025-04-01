package config

import (
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

func SavePreferences(prefs *Preferences) error {
	path := filepath.Join(GetConfigBase(), "preferences.yml")
	data, err := yaml.Marshal(prefs)
	if err != nil {
		return err
	}
	err = os.MkdirAll(filepath.Dir(path), 0755)
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

func SaveSettings(settings *Settings) error {
	path := filepath.Join(GetConfigBase(), "settings.yml")
	data, err := yaml.Marshal(settings)
	if err != nil {
		return err
	}
	err = os.MkdirAll(filepath.Dir(path), 0755)
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}
