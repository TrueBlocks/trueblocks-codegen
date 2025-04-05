package types

import (
	"strings"
	"testing"
)

func TestState_GetPreference(t *testing.T) {
	tmp := t.TempDir()
	defer SetConfigBaseForTest(t, tmp)()

	state := &State{
		Org: OrgPreferences{
			Theme:      "org-dark",
			Language:   "org-en",
			LogLevel:   "debug",
			SupportURL: "https://org.example.com",
		},
		User: UserPreferences{
			Theme:    "user-light",
			Language: "user-fr",
		},
		App: AppPreferences{
			Version:           "1.0",
			RecentlyUsedFiles: []string{"recent1", "recent2"},
		},
		Project: Project{
			Preferences: map[string]string{
				"theme":   "project-blue",
				"layout":  "grid",
				"support": "https://project.help",
			},
		},
	}

	t.Run("Qualified project key", func(t *testing.T) {
		got := state.GetPreference("project.theme")
		want := "project-blue"
		if got != want {
			t.Errorf("Expected %q, got %q", want, got)
		}
	})

	t.Run("More tests", func(t *testing.T) {
		tests := []struct {
			name     string
			key      string
			expected string
		}{
			{"Project domain explicit", "project.theme", "project-blue"},
			{"User domain explicit", "user.theme", "user-light"},
			{"Org domain explicit", "org.theme", "org-dark"},
			{"Unqualified key preferring Project", "theme", "project-blue"},
			{"Unqualified key only in Org", "support_url", "https://org.example.com"},
			{"Unqualified key only in Project", "layout", "grid"},
			{"Unqualified missing key", "unknown", ""},
		}

		for _, tc := range tests {
			t.Run(tc.name, func(t *testing.T) {
				got := state.GetPreference(tc.key)
				if got != tc.expected {
					t.Errorf("GetPreference(%q) = %q; want %q", tc.key, got, tc.expected)
				}
			})
		}
	})

	t.Run("Unqualified fallback order", func(t *testing.T) {
		delete(state.Project.Preferences, "theme")
		got := state.GetPreference("theme")
		want := "user-light"
		if got != want {
			t.Errorf("Expected %q, got %q", want, got)
		}
	})
}

func TestSetPreference(t *testing.T) {
	tmp := t.TempDir()
	defer SetConfigBaseForTest(t, tmp)()

	// Initialize the structs before running tests to avoid overwriting
	state := NewState(OrgPreferences{}, UserPreferences{}, AppPreferences{})
	state.User.Theme = "dark"
	state.User.Language = "en"
	state.App.Version = "1.0"
	state.App.RecentlyUsedFiles = []string{"test1", "test2"}

	t.Run("SetsProjectPreference", func(t *testing.T) {
		state.SetPreference("project.layout", "grid", true)

		if got := state.Project.Preferences["layout"]; got != "grid" {
			t.Errorf("Expected project preference layout to be 'grid', got '%s'", got)
		}
		if !state.Dirty {
			t.Error("Expected dirty flag to be true after setting project preference")
		}
	})

	t.Run("SetsOrgPreferenceAndWrites", func(t *testing.T) {
		state.SetPreference("org.language", "en", true)

		orgPrefs, _ := LoadOrgPreferences()
		if orgPrefs.Language != "en" {
			t.Errorf("Expected org.language to be 'en', got '%s'", orgPrefs.Language)
		}
	})

	t.Run("SetsUserPreferenceAndWrites", func(t *testing.T) {
		state.SetPreference("user.theme", "light", true)

		orgPrefs, _ := LoadUserPreferences()
		if orgPrefs.Theme != "light" {
			t.Errorf("Expected user.theme to be 'light', got '%s'", orgPrefs.Theme)
		}
	})

	t.Run("SetsAppPreferenceAndWrites", func(t *testing.T) {
		state.SetPreference("app.recently_used_files", "demo1.tbproj,demo2.tbproj", true)

		orgPrefs, _ := LoadAppPreferences()
		got := strings.Join(orgPrefs.RecentlyUsedFiles, ",")
		if got != "demo1.tbproj,demo2.tbproj" {
			t.Errorf("Expected app.recently_used_files to be 'demo1.tbproj,demo2.tbproj', got '%s'", got)
		}
	})

	t.Run("InvalidDomainIsIgnored", func(t *testing.T) {
		state = NewState(OrgPreferences{}, UserPreferences{}, AppPreferences{})
		state.SetPreference("unknown.key", "value", true)

		if state.Dirty {
			t.Error("Expected dirty to be false for unknown domain")
		}
	})
}
