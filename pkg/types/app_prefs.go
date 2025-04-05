package types

import (
	"encoding/json"
	"os"
	"path/filepath"

	"github.com/kbinani/screenshot"
)

type Bounds struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"width"`
	Height int `json:"height"`
}

type AppPreferences struct {
	Version           string   `json:"version"`
	Name              string   `json:"name"`
	Bounds            Bounds   `json:"bounds"`
	RecentlyUsedFiles []string `json:"recently_used_files"`
	LastFile          string   `json:"lastFile"`
	LastView          string   `json:"lastView"`
	MenuCollapsed     bool     `json:"menuCollapsed"`
	HelpCollapsed     bool     `json:"helpCollapsed"`
}

func (p *AppPreferences) String() string {
	bytes, _ := json.Marshal(p)
	return string(bytes)
}

func LoadAppPreferences() (AppPreferences, error) {
	path := getAppPrefsPath()

	if _, err := os.Stat(path); os.IsNotExist(err) {
		defaults := AppPreferences{
			Version:           "1.0",
			RecentlyUsedFiles: []string{},
			LastView:          "/",
			Bounds:            getDefaultBounds(),
		}

		if err := SaveAppPreferences(&defaults); err != nil {
			return AppPreferences{}, err
		}

		return defaults, nil
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return AppPreferences{}, err
	}

	var appPrefs AppPreferences
	if err := json.Unmarshal(data, &appPrefs); err != nil {
		return AppPreferences{}, err
	}

	return appPrefs, nil
}

func SaveAppPreferences(appPrefs *AppPreferences) error {
	path := getAppPrefsPath()

	data, err := json.MarshalIndent(appPrefs, "", "  ")
	if err != nil {
		return err
	}

	err = os.MkdirAll(filepath.Dir(path), 0755)
	if err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}

func getDefaultBounds() Bounds {
	bounds := screenshot.GetDisplayBounds(0)
	screenW := bounds.Dx()
	screenH := bounds.Dy()

	ret := Bounds{}
	ret.Width = screenW * 3 / 4
	ret.Height = screenH * 3 / 4
	ret.X = (screenW - ret.Width) / 2
	ret.Y = (screenH - ret.Height) / 2
	return ret
}

func getAppPrefsPath() string {
	return filepath.Join(GetConfigBase(), "codeGen", "app_prefs.json")
}
