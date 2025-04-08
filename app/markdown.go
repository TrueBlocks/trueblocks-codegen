package app

import (
	"errors"
	"io/fs"
	"path/filepath"
	"strings"
)

func (a *App) GetMarkdown(folder, route string) string {
	helpFS, err := fs.Sub(a.Assets, filepath.Join("frontend", "src", "assets", folder))
	if err != nil {
		return err.Error()
	}

	lan := a.GetPreference("user.language")
	if data, err := fs.ReadFile(helpFS, strings.ToLower(route)+"."+lan+".md"); err == nil {
		return string(data)
	} else if errors.Is(err, fs.ErrNotExist) {
		if data, err = fs.ReadFile(helpFS, strings.ToLower(route)+".md"); err == nil {
			return string(data)
		}
		return err.Error()
	} else {
		return err.Error()
	}
}
