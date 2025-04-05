package config

import "gopkg.in/yaml.v3"

type Preferences struct {
	X             int    `json:"x" yaml:"x" koanf:"x"`
	Y             int    `json:"y" yaml:"y" koanf:"y"`
	Width         int    `json:"width" yaml:"width" koanf:"width"`
	Height        int    `json:"height" yaml:"height" koanf:"height"`
	LastFile      string `json:"lastFile" yaml:"lastFile" koanf:"lastFile"`
	LastView      string `json:"lastView" yaml:"lastView" koanf:"lastView"`
	MenuCollapsed bool   `json:"menuCollapsed" yaml:"menuCollapsed" koanf:"menuCollapsed"`
	HelpCollapsed bool   `json:"helpCollapsed" yaml:"helpCollapsed" koanf:"helpCollapsed"`
}

func (p *Preferences) String() string {
	bytes, _ := yaml.Marshal(p)
	return string(bytes)
}
