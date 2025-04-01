package config

import (
	"path/filepath"

	"github.com/knadh/koanf/parsers/yaml"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

func LoadPreferences() (*Preferences, error) {
	k := koanf.New(".")
	path := filepath.Join(GetConfigBase(), "preferences.yml")
	err := k.Load(file.Provider(path), yaml.Parser())
	if err != nil {
		return nil, err
	}
	var prefs Preferences
	err = k.Unmarshal("", &prefs)
	if err != nil {
		return nil, err
	}
	return &prefs, nil
}

func LoadSettings() (*Settings, error) {
	k := koanf.New(".")
	path := filepath.Join(GetConfigBase(), "settings.yml")
	err := k.Load(file.Provider(path), yaml.Parser())
	if err != nil {
		return nil, err
	}
	var settings Settings
	err = k.Unmarshal("", &settings)
	if err != nil {
		return nil, err
	}
	return &settings, nil
}
