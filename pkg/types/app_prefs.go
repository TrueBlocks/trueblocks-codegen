package types

import (
	"os"
	"path/filepath"

	"github.com/kbinani/screenshot"
	"gopkg.in/yaml.v3"
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

func LoadAppPreferences() (*AppPreferences, error) {
	var prefs AppPreferences
	return &prefs, nil
}

func (p *AppPreferences) String() string {
	bytes, _ := yaml.Marshal(p)
	return string(bytes)
}

func SaveAppPreferences(prefs *AppPreferences) error {
	path := filepath.Join(GetConfigBase(), "codeGen", "preferences.yml")
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

func EnsurePreferencesFile() (*AppPreferences, error) {
	path := filepath.Join(GetConfigBase(), "codeGen", "preferences.yml")
	if _, err := os.Stat(path); err == nil {
		return LoadAppPreferences()
	}

	bounds := screenshot.GetDisplayBounds(0)
	screenW := bounds.Dx()
	screenH := bounds.Dy()

	w := screenW * 3 / 4
	h := screenH * 3 / 4
	x := (screenW - w) / 2
	y := (screenH - h) / 2

	defaults := &AppPreferences{
		Bounds: Bounds{
			X:      x,
			Y:      y,
			Width:  w,
			Height: h,
		},
		LastView: "/",
	}

	err := SaveAppPreferences(defaults)
	if err != nil {
		return nil, err
	}
	return defaults, nil
}
