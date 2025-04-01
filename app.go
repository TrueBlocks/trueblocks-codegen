package main

import (
	"context"
	"time"

	"github.com/TrueBlocks/trueblocks-codeGen/pkg/config"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx      context.Context
	prefs    *config.Preferences
	settings *config.Settings
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	prefs, err := config.EnsurePreferencesFile()
	if err == nil {
		a.prefs = prefs
	}

	settings, err := config.EnsureSettingsFile()
	if err == nil {
		a.settings = settings
	}
}

func (a *App) domReady(ctx context.Context) {
	a.ctx = ctx
	if a.IsReady() {
		runtime.WindowSetSize(ctx, a.prefs.Width, a.prefs.Height)
		runtime.WindowSetPosition(ctx, a.prefs.X, a.prefs.Y)
		runtime.WindowShow(ctx)
		go a.watchWindowBounds() // if the window moves or resizes, we want to know
	}
}

func (a *App) beforeClose(ctx context.Context) bool {
	x, y := runtime.WindowGetPosition(ctx)
	w, h := runtime.WindowGetSize(ctx)
	if a.IsReady() {
		a.prefs.X = x
		a.prefs.Y = y
		a.prefs.Width = w
		a.prefs.Height = h
		_ = config.SavePreferences(a.prefs)
	}
	return false // false = allow window to close
}

func (a *App) watchWindowBounds() {
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	var lastX, lastY, lastW, lastH int
	for range ticker.C {
		if !a.IsReady() {
			continue
		}
		x, y := runtime.WindowGetPosition(a.ctx)
		w, h := runtime.WindowGetSize(a.ctx)
		if x != lastX || y != lastY || w != lastW || h != lastH {
			a.SaveBounds(x, y, w, h)
			lastX, lastY, lastW, lastH = x, y, w, h
		}
	}
}

func (a *App) SaveBounds(x, y, w, h int) {
	if a.IsReady() {
		a.prefs.X = x
		a.prefs.Y = y
		a.prefs.Width = w
		a.prefs.Height = h
		_ = config.SavePreferences(a.prefs)
	}
}

func (a *App) IsReady() bool {
	return a.ctx != nil && a.prefs != nil
}

func (a *App) GetTemplateFolder() string {
	if a.settings != nil {
		return a.settings.TemplateFolder
	}
	return ""
}

func (a *App) GetPreferences() *config.Preferences {
	return a.prefs
}

func (a *App) SetMenuOpen(open bool) {
	if a.prefs == nil {
		return
	}
	a.prefs.MenuOpen = open
	_ = config.SavePreferences(a.prefs)
	// fmt.Println("SetMenuOpen called with:", open)
}

func (a *App) SetHelpOpen(open bool) {
	if a.prefs == nil {
		return
	}
	a.prefs.HelpOpen = open
	_ = config.SavePreferences(a.prefs)
	// fmt.Println("SetHelpOpen called with:", open)
}

func (a *App) SetLastView(view string) {
	if a.prefs == nil {
		return
	}
	a.prefs.LastView = view
	_ = config.SavePreferences(a.prefs)
	// fmt.Println("SetLastView called with:", view)
}
