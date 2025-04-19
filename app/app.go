package app

import (
	"context"
	"embed"
	"fmt"
	"os"
	"path/filepath"
	"sync/atomic"
	"time"

	"github.com/TrueBlocks/trueblocks-codeGen/pkg/types"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx    context.Context
	Assets embed.FS
	State  *types.State
	locked int32
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

	org, err := types.GetOrgPreferences()
	if err != nil {
		a.emitError(a.ctx, "Loading org preferences failed", err)
		return
	}

	user, err := types.GetUserPreferences()
	if err != nil {
		a.emitError(a.ctx, "Loading user preferences failed", err)
		return
	}

	appPrefs, err := types.GetAppPreferences()
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

	_ = types.SetAppPreferences(&a.State.App)
}

func (a *App) IsReady() bool {
	return a.ctx != nil
}

func (a *App) IsInitialized() bool {
	_, appFolder := types.GetConfigFolders()
	fn := filepath.Join(appFolder, ".initialized")
	return file.FileExists(fn)
}

func (a *App) SetInitialized(isInit bool) error {
	_, appFolder := types.GetConfigFolders()
	fn := filepath.Join(appFolder, ".initialized")
	if isInit {
		if !file.Touch(fn) {
			return fmt.Errorf("failed to create " + fn + " file")
		} else {
			return nil
		}
	} else {
		return os.Remove(fn)
	}
}

func (a *App) GetOrgPreferences() *types.OrgPreferences {
	return &a.State.Org
}

func (a *App) SetOrgPreferences(orgPrefs *types.OrgPreferences) error {
	a.State.Org = *orgPrefs
	return types.SetOrgPreferences(orgPrefs)
}

func (a *App) SetUserPreferences(userPrefs *types.UserPreferences) error {
	a.State.User = *userPrefs
	return types.SetUserPreferences(userPrefs)
}

func (a *App) GetUserPreferences() *types.UserPreferences {
	return &a.State.User
}

func (a *App) SetAppPreferences(appPrefs *types.AppPreferences) error {
	a.State.App = *appPrefs
	return types.SetAppPreferences(appPrefs)
}

func (a *App) GetAppPreferences() *types.AppPreferences {
	return &a.State.App
}

func (a *App) SetMenuCollapsed(collapse bool) {
	a.State.App.MenuCollapsed = collapse
	_ = types.SetAppPreferences(&a.State.App)
}

func (a *App) SetHelpCollapsed(collapse bool) {
	a.State.App.HelpCollapsed = collapse
	_ = types.SetAppPreferences(&a.State.App)
}

func (a *App) SetLastView(view string) {
	a.State.App.LastView = view
	if view != "/wizard" {
		a.State.App.LastViewNoWizard = view
	}
	_ = types.SetAppPreferences(&a.State.App)
}

func (a *App) GetWizardReturn() string {
	if a.State.App.LastViewNoWizard == "" {
		return "/"
	}
	return a.State.App.LastViewNoWizard
}

func (a *App) GetPreference(key string) string {
	return a.State.GetPreference(key)
}

func (a *App) GetAppId() types.Id {
	return types.GetAppId()
}

func (a *App) SetLastTab(route string, tab string) {
	if !atomic.CompareAndSwapInt32(&a.locked, 0, 1) {
		return
	}
	defer atomic.StoreInt32(&a.locked, 0)

	a.State.App.LastTab[route] = tab
	_ = types.SetAppPreferences(&a.State.App)
}

func (a *App) GetLastTab(route string) string {
	return a.State.App.LastTab[route]
}
