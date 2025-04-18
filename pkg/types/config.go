package types

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func SetConfigBaseForTest(t *testing.T, path string) func() {
	t.Helper()
	original := configBase
	configBase = path
	return func() {
		configBase = original
	}
}

var configBase string

func getConfigBase() string {
	if configBase != "" {
		return configBase
	}

	if xdg := os.Getenv("XDG_CONFIG_HOME"); xdg != "" {
		return filepath.Join(xdg, theOrg.DeveloperName)
	}

	home, err := os.UserHomeDir()
	if err != nil {
		panic("Unable to determine user home directory")
	}

	switch runtime.GOOS {
	case "darwin":
		return filepath.Join(home, "Library", "Application Support", theOrg.DeveloperName)
	case "windows":
		return filepath.Join(os.Getenv("AppData"), theOrg.DeveloperName)
	default:
		return filepath.Join(home, ".config", theOrg.DeveloperName)
	}
}

func GetConfigFolders() (string, string) {
	return getConfigBase(), filepath.Join(getConfigBase(), ToCamel(configBaseApp))
}

func ToProper(s string) string {
	c := cases.Title(language.English)
	return c.String(s)
}

func ToCamel(s string) string {
	// Replace hyphens and underscores with spaces
	s = strings.ReplaceAll(s, "-", " ")
	s = strings.ReplaceAll(s, "_", " ")

	// Split into words and trim whitespace
	words := strings.Fields(strings.TrimSpace(s))
	if len(words) == 0 {
		return ""
	}

	// Initialize title case converter
	titleCaser := cases.Title(language.English)
	lowerCaser := cases.Lower(language.English)

	// Convert first word to lowercase, others to title case
	result := lowerCaser.String(words[0])
	for _, word := range words[1:] {
		result += titleCaser.String(word)
	}

	return result
}

type Id struct {
	AppName string `json:"appName"`
	OrgName string `json:"orgName"`
	Github  string `json:"github"`
	Domain  string `json:"domain"`
	Twitter string `json:"twitter"`
}

func GetAppId() Id {
	return Id{
		AppName: strings.Join([]string{theOrg.DeveloperName, configBaseApp}, " "),
		OrgName: theOrg.DeveloperName,
		Github:  configBaseGithub,
		Domain:  configBaseDomain,
		Twitter: strings.ToLower(theOrg.DeveloperName),
	}
}

const configBaseApp = "CodeGen"
const configBaseGithub = "github.com/TrueBlocks/trueblocks-core"
const configBaseDomain = "trueblocks.io"

var theOrg = &OrgPreferences{
	Version:       "1.0",
	Telemetry:     false,
	Theme:         "dark",
	Language:      "en",
	DeveloperName: "TrueBlocks",
	LogLevel:      "info",
	Experimental:  false,
	SupportURL:    "https://" + configBaseDomain + "/support",
}
