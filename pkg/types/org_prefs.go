package types

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
	var orgPrefs OrgPreferences
	return orgPrefs, nil
}

func SaveOrgPreferences(orgPrefs *OrgPreferences) error {
	return nil
}

// func getOrgPrefsPath() string {
// 	return filepath.Join(GetConfigBase(), "org_prefs.json")
// }
