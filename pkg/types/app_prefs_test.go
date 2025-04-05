package types

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
)

func TestSaveAndLoadAppPreferences(t *testing.T) {
	tmp := t.TempDir()
	defer SetConfigBaseForTest(t, tmp)()

	expected := AppPreferences{
		Version:           "1.0",
		RecentlyUsedFiles: []string{"file1", "file2"},
	}

	err := SaveAppPreferences(&expected)
	if err != nil {
		t.Fatalf("Failed to save preferences: %v", err)
	}

	actual, err := LoadAppPreferences()
	if err != nil {
		t.Fatalf("Failed to load preferences: %v", err)
	}

	if actual.Version != expected.Version {
		t.Errorf("Expected Version %q, got %q", expected.Version, actual.Version)
	}

	if len(actual.RecentlyUsedFiles) != len(expected.RecentlyUsedFiles) {
		t.Fatalf("Expected %d recently used files, got %d", len(expected.RecentlyUsedFiles), len(actual.RecentlyUsedFiles))
	}

	for i := range expected.RecentlyUsedFiles {
		if actual.RecentlyUsedFiles[i] != expected.RecentlyUsedFiles[i] {
			t.Errorf("Mismatch at index %d: expected %q, got %q", i, expected.RecentlyUsedFiles[i], actual.RecentlyUsedFiles[i])
		}
	}
}

func TestLoadAppPreferences(t *testing.T) {
	t.Run("CreatesDefaultAppPreferencesIfMissing", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		path := filepath.Join(tmp, "app_prefs.json")
		if _, err := os.Stat(path); err == nil {
			t.Fatal("app_prefs.json should not exist yet")
		}

		appPrefs, err := LoadAppPreferences()
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if appPrefs.Version != "1.0" {
			t.Errorf("Expected version '1.0', got %s", appPrefs.Version)
		}
	})

	t.Run("LoadsExistingAppPreferences", func(t *testing.T) {
		tmp := t.TempDir()
		defer SetConfigBaseForTest(t, tmp)()

		expected := AppPreferences{
			Version:           "1.0",
			RecentlyUsedFiles: []string{"/tmp/one", "/tmp/two"},
		}

		file.EstablishFolder(filepath.Join(tmp, "codeGen"))
		path := filepath.Join(tmp, "codeGen", "app_prefs.json")
		data, _ := json.MarshalIndent(expected, "", "  ")
		if err := os.WriteFile(path, data, 0644); err != nil {
			t.Fatalf("Failed to write appPrefs file: %v", err)
		}

		_, err := LoadAppPreferences()
		if err != nil {
			t.Fatalf("Expected no error loading existing appPrefs, got %v", err)
		}
	})
}
