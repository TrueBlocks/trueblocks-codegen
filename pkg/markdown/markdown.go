package markdown

import (
	"embed"
	"errors"
	"io/fs"
	"strings"
)

// LoadMarkdown loads a Markdown file from the embedded filesystem based on the provided
// route and language. It first attempts to load a localized version of the file. If the
// localized file does not exist, it falls back to the default file.
func LoadMarkdown(assets embed.FS, basePath, route, language string) (string, error) {
	subFS, err := fs.Sub(assets, basePath)
	if err != nil {
		return "", err
	}

	route = strings.ToLower(route)
	filenameLocalized := route + "." + language + ".md"
	filenameDefault := route + ".md"

	if data, err := fs.ReadFile(subFS, filenameLocalized); err == nil {
		return string(data), nil
	} else if errors.Is(err, fs.ErrNotExist) {
		if data, err := fs.ReadFile(subFS, filenameDefault); err == nil {
			return string(data), nil
		}
		return "", err
	} else {
		return "", err
	}
}
