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

type UserPreferences struct {
	Version  string `json:"version"`
	Theme    string `json:"theme"`
	Language string `json:"language"`
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

type Project struct {
	Version     string            `json:"version"`
	Name        string            `json:"name"`
	LastOpened  string            `json:"last_opened"`
	Preferences map[string]string `json:"preferences"`
	Data        any               `json:"data"`
}

type State struct {
	Org     OrgPreferences  `json:"org"`
	User    UserPreferences `json:"user"`
	App     AppPreferences  `json:"app"`
	Project Project         `json:"project"`
	Dirty   bool            `json:"dirty"`
	Path    string          `json:"path"`
}

type Bounds struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Width  int `json:"width"`
	Height int `json:"height"`
}
