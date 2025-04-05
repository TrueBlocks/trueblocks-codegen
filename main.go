package main

import (
	"embed"
	"fmt"

	"github.com/TrueBlocks/trueblocks-codeGen/app"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	a, menu := app.NewApp()

	err := wails.Run(&options.App{
		Title:         "TrueBlocks codeGen",
		Width:         1024,
		Height:        768,
		Menu:          menu,
		StartHidden:   true,
		OnStartup:     a.Startup,
		OnDomReady:    a.DomReady,
		OnBeforeClose: a.BeforeClose,
		LogLevel:      logger.INFO,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		Bind: []interface{}{
			a,
		},
	})

	if err != nil {
		fmt.Println("Error:", err)
	}
}
