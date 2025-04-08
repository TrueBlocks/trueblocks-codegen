package app

import (
	"io/fs"
	"path/filepath"
	"strings"
)

func (a *App) GetMarkdown(folder, route string) string {
	helpFS, err := fs.Sub(a.Assets, filepath.Join("frontend", "src", "assets", folder))
	if err != nil {
		return err.Error()
	}
	data, err := fs.ReadFile(helpFS, strings.ToLower(route)+".md")
	if err != nil {
		return err.Error()
	}
	return string(data)
}
