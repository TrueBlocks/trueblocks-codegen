package config

import "gopkg.in/yaml.v3"

type Preferences struct {
	X        int    `json:"x" yaml:"x" koanf:"x"`
	Y        int    `json:"y" yaml:"y" koanf:"y"`
	Width    int    `json:"width" yaml:"width" koanf:"width"`
	Height   int    `json:"height" yaml:"height" koanf:"height"`
	LastView string `json:"lastView" yaml:"lastView" koanf:"lastView"`
	MenuOpen bool   `json:"menuOpen" yaml:"menuOpen" koanf:"menuOpen"`
	HelpOpen bool   `json:"helpOpen" yaml:"helpOpen" koanf:"helpOpen"`
}

func (p *Preferences) String() string {
	bytes, _ := yaml.Marshal(p)
	return string(bytes)
}

type Settings struct {
	TemplateFolder string `yaml:"template_folder"`
}

func (s *Settings) String() string {
	bytes, _ := yaml.Marshal(s)
	return string(bytes)
}
