package types

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type OrgPreferences struct {
	Version            string `json:"version"`
	TelemetryEnabled   bool   `json:"telemetry_enabled"`
	Theme              string `json:"theme"`
	Language           string `json:"language"`
	DeveloperName      string `json:"developer_name"`
	LogLevel           string `json:"log_level"`
	EnableExperimental bool   `json:"enable_experimental"`
	SupportURL         string `json:"support_url"`
}

func LoadOrgPreferences() (OrgPreferences, error) {
	path := getOrgPrefsPath()

	if _, err := os.Stat(path); os.IsNotExist(err) {
		defaults := OrgPreferences{
			Version:            "1.0",
			TelemetryEnabled:   false,
			Theme:              "dark",
			Language:           "en",
			DeveloperName:      "TrueBlocks, LLC",
			LogLevel:           "info",
			EnableExperimental: false,
			SupportURL:         "https://trueblocks.io/support",
		}

		if err := SaveOrgPreferences(&defaults); err != nil {
			return OrgPreferences{}, err
		}

		return defaults, nil
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return OrgPreferences{}, err
	}

	var orgPrefs OrgPreferences
	if err := json.Unmarshal(data, &orgPrefs); err != nil {
		return OrgPreferences{}, err
	}

	return orgPrefs, nil
}

func SaveOrgPreferences(orgPrefs *OrgPreferences) error {
	path := getOrgPrefsPath()

	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
		return err
	}

	data, err := json.MarshalIndent(orgPrefs, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}

func getOrgPrefsPath() string {
	return filepath.Join(GetConfigBase(), "org_prefs.json")
}
