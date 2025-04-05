package types

import (
	"encoding/json"
	"os"
	"testing"
)

func TestLoadUserPreferences(t *testing.T) {
	t.Run("CreatesDefaultsWhenMissing", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		userPrefs, err := LoadUserPreferences()
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}
		if userPrefs.Theme != "dark" {
			t.Errorf("Expected default theme 'dark', got %q", userPrefs.Theme)
		}
	})

	t.Run("LoadsExistingPreferences", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		path := getUserPrefsPath()
		expected := UserPreferences{
			Version:  "1.0",
			Theme:    "light",
			Language: "fr",
		}

		data, _ := json.MarshalIndent(expected, "", "  ")
		if err := os.WriteFile(path, data, 0644); err != nil {
			t.Fatalf("Failed to write test file: %v", err)
		}

		userPrefs, err := LoadUserPreferences()
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if userPrefs != expected {
			t.Errorf("Expected %v, got %v", expected, userPrefs)
		}
	})
}
