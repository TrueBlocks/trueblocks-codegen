package types

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestProjectSerialization(t *testing.T) {
	project := Project{}
	data, err := json.Marshal(project)
	if err != nil {
		t.Fatalf("Failed to serialize project: %v", err)
	}

	var deserializedProject Project
	err = json.Unmarshal(data, &deserializedProject)
	if err != nil {
		t.Fatalf("Failed to deserialize project: %v", err)
	}
}

func TestLoadProjectPreferences(t *testing.T) {
	tmp := t.TempDir()
	defer SetConfigBaseForTest(t, tmp)()

	t.Run("ReturnsEmptyProjectIfNoFiles", func(t *testing.T) {
		project, err := LoadProjectPreferences(nil)
		if err != nil {
			t.Fatalf("Unexpected error: %v", err)
		}
		if project.Preferences == nil || len(project.Preferences) != 0 {
			t.Errorf("Expected empty preferences, got %v", project.Preferences)
		}
	})

	t.Run("ReturnsEmptyProjectIfFilesDoNotExist", func(t *testing.T) {
		files := []string{filepath.Join(tmp, "nonexistent.tbproj")}
		project, err := LoadProjectPreferences(files)
		if err != nil {
			t.Fatalf("Unexpected error: %v", err)
		}
		if len(project.Preferences) != 0 {
			t.Errorf("Expected empty preferences for nonexistent file, got %v", project.Preferences)
		}
	})

	t.Run("LoadsPreferencesFromFirstValidFile", func(t *testing.T) {
		path := filepath.Join(tmp, "project.tbproj")
		content := `{"preferences": {"theme": "blue", "layout": "grid"}}`
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			t.Fatalf("Failed to write temp project file: %v", err)
		}

		files := []string{path}
		project, err := LoadProjectPreferences(files)
		if err != nil {
			t.Fatalf("Unexpected error: %v", err)
		}
		if got := project.Preferences["theme"]; got != "blue" {
			t.Errorf("Expected theme 'blue', got '%s'", got)
		}
	})
}
