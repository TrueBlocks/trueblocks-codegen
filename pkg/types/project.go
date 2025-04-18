package types

import (
	"encoding/json"
	"os"
)

type Project struct {
	Version     string            `json:"version"`
	Name        string            `json:"name"`
	LastOpened  string            `json:"last_opened"`
	Preferences map[string]string `json:"preferences"`
	Data        any               `json:"data"`
}

func LoadProjectPreferences(recent []string) (Project, error) {
	if len(recent) == 0 {
		return Project{Preferences: map[string]string{}}, nil
	}

	path := recent[0]
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return Project{Preferences: map[string]string{}}, nil
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return Project{Preferences: map[string]string{}}, err
	}

	var project Project
	if err := json.Unmarshal(data, &project); err != nil {
		return Project{Preferences: map[string]string{}}, err
	}

	if project.Preferences == nil {
		project.Preferences = map[string]string{}
	}

	return project, nil
}
