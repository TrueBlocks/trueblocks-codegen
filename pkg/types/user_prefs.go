package types

type UserPreferences struct {
	Version  string `json:"version"`
	Theme    string `json:"theme"`
	Language string `json:"language"`
}

func LoadUserPreferences() (UserPreferences, error) {
	var userPrefs UserPreferences
	return userPrefs, nil
}

func SaveUserPreferences(userPrefs *UserPreferences) error {
	return nil
}

// func getUserPrefsPath() string {
// 	return filepath.Join(GetConfigBase(), "user_prefs.json")
// }
