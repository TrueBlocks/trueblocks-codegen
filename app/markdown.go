package app

import (
	"path/filepath"

	"github.com/TrueBlocks/trueblocks-codegen/pkg/markdown"
)

func (a *App) GetMarkdown(folder, route, tab string) string {
	lang := a.Preferences.User.Language
	if md, err := markdown.LoadMarkdown(a.Assets, filepath.Join("frontend", "src", "assets", folder), lang, route, tab); err != nil {
		return err.Error()
	} else {
		return md
	}
}
