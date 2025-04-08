package app

import (
	"context"
	"embed"
	"time"

	"github.com/TrueBlocks/trueblocks-codeGen/pkg/types"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx    context.Context
	Assets embed.FS
	State  *types.State
}

func NewApp(assets embed.FS) (*App, *menu.Menu) {
	app := &App{
		Assets: assets,
		State: &types.State{
			Org:     types.OrgPreferences{},
			User:    types.UserPreferences{},
			App:     types.AppPreferences{},
			Project: types.Project{},
			Dirty:   false,
		},
	}
	return app, app.buildAppMenu()
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	org, err := types.LoadOrgPreferences()
	if err != nil {
		a.emitError(a.ctx, "Loading org preferences failed", err)
		return
	}

	user, err := types.LoadUserPreferences()
	if err != nil {
		a.emitError(a.ctx, "Loading user preferences failed", err)
		return
	}

	appPrefs, err := types.LoadAppPreferences()
	if err != nil {
		a.emitError(a.ctx, "Loading app preferences failed", err)
		return
	}

	project, err := types.LoadProjectPreferences(appPrefs.RecentlyUsedFiles)
	if err != nil {
		a.emitError(a.ctx, "Loading project preferences failed", err)
		return
	}

	a.State.Org = org
	a.State.User = user
	a.State.App = appPrefs
	a.State.Project = project
}

func (a *App) DomReady(ctx context.Context) {
	a.ctx = ctx
	if a.IsReady() {
		runtime.WindowSetSize(ctx, a.State.App.Bounds.Width, a.State.App.Bounds.Height)
		runtime.WindowSetPosition(ctx, a.State.App.Bounds.X, a.State.App.Bounds.Y)
		runtime.WindowShow(ctx)
		go a.watchWindowBounds() // if the window moves or resizes, we want to know
	}
}

func (a *App) BeforeClose(ctx context.Context) bool {
	x, y := runtime.WindowGetPosition(ctx)
	w, h := runtime.WindowGetSize(ctx)
	a.SaveBounds(x, y, w, h)
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
	if !a.IsReady() {
		return
	}

	a.State.App.Bounds = types.Bounds{
		X:      x,
		Y:      y,
		Width:  w,
		Height: h,
	}

	_ = types.SaveAppPreferences(&a.State.App)
}

func (a *App) IsReady() bool {
	return a.ctx != nil
}

func (a *App) GetAppPreferences() *types.AppPreferences {
	return &a.State.App
}

func (a *App) CollapseMenu(collapse bool) {
	a.State.App.MenuCollapsed = collapse
	_ = types.SaveAppPreferences(&a.State.App)
}

func (a *App) CollapseHelp(collapsed bool) {
	a.State.App.HelpCollapsed = collapsed
	_ = types.SaveAppPreferences(&a.State.App)
}

func (a *App) SetLastView(view string) {
	a.State.App.LastView = view
	_ = types.SaveAppPreferences(&a.State.App)
}

func (a *App) IsReadyStr() string {
	if a.IsReady() {
		return "true"
	}
	return "false"
}

func (a *App) GetPreference(key string) string {
	return a.State.GetPreference(key)
}
