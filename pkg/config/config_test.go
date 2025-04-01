package config

import "testing"

func TestEnsurePreferencesFile_CreatesFileAndDefaults(t *testing.T) {
	tmp := t.TempDir()
	defer SetConfigBaseForTest(tmp)()

	prefs, err := EnsurePreferencesFile()
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if prefs == nil {
		t.Fatal("Expected non-nil preferences")
	}
	if prefs.Width == 0 || prefs.Height == 0 {
		t.Fatal("Expected non-zero window size in defaults")
	}

	// Run again to confirm it loads an existing file
	prefs2, err := EnsurePreferencesFile()
	if err != nil || prefs2 == nil {
		t.Fatal("Expected to load existing preferences without error")
	}
}

func TestEnsureSettingsFile_CreatesFileAndDefaults(t *testing.T) {
	tmp := t.TempDir()
	defer SetConfigBaseForTest(tmp)()

	settings, err := EnsureSettingsFile()
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if settings == nil {
		t.Fatal("Expected non-nil settings")
	}
	if settings.TemplateFolder == "" {
		t.Fatal("Expected default TemplateFolder to be set")
	}

	// Run again to confirm it loads the file
	settings2, err := EnsureSettingsFile()
	if err != nil || settings2 == nil {
		t.Fatal("Expected to load existing settings without error")
	}
}
