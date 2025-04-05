package types

type Project struct {
	Version     string            `json:"version"`
	Name        string            `json:"name"`
	LastOpened  string            `json:"last_opened"`
	Preferences map[string]string `json:"preferences"`
	Data        any               `json:"data"`
}

func LoadProjectPreferences(recent []string) (Project, error) {
	var project Project
	return project, nil
}
