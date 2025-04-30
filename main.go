package main

import (
	"embed"
	"fmt"

	"github.com/TrueBlocks/trueblocks-codegen/app"
	"github.com/TrueBlocks/trueblocks-codegen/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-codegen/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-codegen/pkg/project"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist all:frontend/src/assets/help all:frontend/src/assets/views wails.json
var assets embed.FS

func main() {
	preferences.LoadIdentifiers(assets)
	a, menu := app.NewApp(assets)

	err := wails.Run(&options.App{
		Title:         preferences.GetAppId().AppName,
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
			&project.Project{},
		},
		EnumBind: []interface{}{
			msgs.AllEventTypes,
		},
	})

	if err != nil {
		fmt.Println("Error:", err)
	}
}
