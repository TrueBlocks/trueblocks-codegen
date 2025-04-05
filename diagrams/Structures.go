package types

type OrgPreferences struct {
	Version            string `json:"version" yaml:"version"`
	TelemetryEnabled   bool   `json:"telemetry_enabled" yaml:"telemetry_enabled"`
	Theme              string `json:"theme" yaml:"theme"`
	Language           string `json:"language" yaml:"language"`
	DeveloperName      string `json:"developer_name" yaml:"developer_name"`
	LogLevel           string `json:"log_level" yaml:"log_level"`
	EnableExperimental bool   `json:"enable_experimental" yaml:"enable_experimental"`
	SupportURL         string `json:"support_url" yaml:"support_url"`
}

type UserPreferences struct {
	Version  string `json:"version" yaml:"version"`
	Theme    string `json:"theme" yaml:"theme"`
	Language string `json:"language" yaml:"language"`
}

type AppPreferences struct {
	Version           string   `json:"version" yaml:"version"`
	LastProjectFolder string   `json:"last_project_folder" yaml:"last_project_folder"`
	LastProject       string   `json:"last_project" yaml:"last_project"`
	RecentlyUsedFiles []string `json:"recently_used_files" yaml:"recently_used_files"`
}

type Project struct {
	Version     string            `json:"version" yaml:"version"`
	LastOpened  string            `json:"last_opened" yaml:"last_opened"`
	Preferences map[string]string `json:"preferences" yaml:"preferences"`
	Data        any               `json:"data" yaml:"data"`
}

type State struct {
	Org     OrgPreferences    // Loaded from org_prefs.yaml
	User    UserPreferences   // Loaded from user_prefs.yaml
	App     AppPreferences    // Loaded from app-specific prefs.yaml
	Project Project           // Loaded from user-saved project file
	Merged  map[string]string // Flattened final preferences
	Dirty   bool              // True if project was modified
	Path    string            // Path to the current project file
}
