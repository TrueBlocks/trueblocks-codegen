package types

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type UserPreferences struct {
	Version  string `json:"version"`
	Theme    string `json:"theme"`
	Language string `json:"language"`
}

func LoadUserPreferences() (UserPreferences, error) {
	path := getUserPrefsPath()

	if _, err := os.Stat(path); os.IsNotExist(err) {
		defaults := UserPreferences{
			Version:  "1.0",
			Theme:    "dark",
			Language: "en",
		}

		if err := SaveUserPreferences(&defaults); err != nil {
			return UserPreferences{}, err
		}

		return defaults, nil
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return UserPreferences{}, err
	}

	var userPrefs UserPreferences
	if err := json.Unmarshal(data, &userPrefs); err != nil {
		return UserPreferences{}, err
	}

	return userPrefs, nil
}

func SaveUserPreferences(userPrefs *UserPreferences) error {
	path := getUserPrefsPath()

	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return err
	}

	data, err := json.MarshalIndent(userPrefs, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}

func getUserPrefsPath() string {
	return filepath.Join(GetConfigBase(), "user_prefs.json")
}
