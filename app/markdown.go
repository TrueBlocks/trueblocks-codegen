package app

import (
	"path/filepath"

	"github.com/TrueBlocks/trueblocks-codeGen/pkg/markdown"
)

func (a *App) GetMarkdown(folder, route string) string {
	lang := a.GetPreference("user.language")
	if md, err := markdown.LoadMarkdown(a.Assets, filepath.Join("frontend", "src", "assets", folder), route, lang); err != nil {
		return err.Error()
	} else {
		return md
	}
}
