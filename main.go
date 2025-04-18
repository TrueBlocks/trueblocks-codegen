package main

import (
	"embed"
	"fmt"

	"github.com/TrueBlocks/trueblocks-codeGen/app"
	"github.com/TrueBlocks/trueblocks-codeGen/pkg/types"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist all:frontend/src/assets/help all:frontend/src/assets/views
var assets embed.FS

func main() {
	a, menu := app.NewApp(assets)

	err := wails.Run(&options.App{
		Title:         types.GetAppId().AppName,
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
