package app

import (
	"context"
	"embed"
	"fmt"
	"os"
	"path/filepath"
	"sync/atomic"
	"time"

	"github.com/TrueBlocks/trueblocks-codegen/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-codegen/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-codegen/pkg/project"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/config"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/utils"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx         context.Context
	Assets      embed.FS
	Preferences *preferences.Preferences
	Projects    *project.Manager
	locked      int32
	ChainList   *utils.ChainList
}

func NewApp(assets embed.FS) (*App, *menu.Menu) {
	preferences := &preferences.Preferences{
		Org:  preferences.OrgPreferences{},
		User: preferences.UserPreferences{},
		App:  preferences.AppPreferences{},
	}

	projectManager := project.NewManager()

	app := &App{
		Assets:      assets,
		Preferences: preferences,
		Projects:    projectManager,
	}
	app.ChainList, _ = utils.UpdateChainList(config.PathToRootConfig())
	appMenu := app.buildAppMenu()
	return app, appMenu
}

func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	// Initialize the msgs context
	msgs.InitializeContext(ctx)

	org, err := preferences.GetOrgPreferences()
	if err != nil {
		msgs.EmitError("Loading org preferences failed", err)
		return
	}

	user, err := preferences.GetUserPreferences()
	if err != nil {
		msgs.EmitError("Loading user preferences failed", err)
		return
	}

	appPrefs, err := preferences.GetAppPreferences()
	if err != nil {
		msgs.EmitError("Loading app preferences failed", err)
		return
	}

	a.Preferences.Org = org
	a.Preferences.User = user
	a.Preferences.App = appPrefs

	if len(a.Preferences.App.RecentProjects) > 0 {
		mostRecentPath := a.Preferences.App.RecentProjects[0]
		if file.FileExists(mostRecentPath) {
			_, err := a.Projects.Open(mostRecentPath)
			if err != nil {
				msgs.EmitError("Failed to open recent project", err)
			}
		}
	}
}

func (a *App) DomReady(ctx context.Context) {
	a.ctx = ctx
	if a.IsReady() {
		runtime.WindowSetSize(ctx, a.Preferences.App.Bounds.Width, a.Preferences.App.Bounds.Height)
		runtime.WindowSetPosition(ctx, a.Preferences.App.Bounds.X, a.Preferences.App.Bounds.Y)
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

	a.Preferences.App.Bounds = preferences.Bounds{
		X:      x,
		Y:      y,
		Width:  w,
		Height: h,
	}

	_ = preferences.SetAppPreferences(&a.Preferences.App)
}

func (a *App) IsReady() bool {
	return a.ctx != nil
}

func (a *App) IsInitialized() bool {
	_, appFolder := preferences.GetConfigFolders()
	fn := filepath.Join(appFolder, ".initialized")
	return file.FileExists(fn)
}

func (a *App) SetInitialized(isInit bool) error {
	_, appFolder := preferences.GetConfigFolders()
	fn := filepath.Join(appFolder, ".initialized")
	if isInit {
		if !file.Touch(fn) {
			return fmt.Errorf("failed to create " + fn + " file")
		} else {
			return nil
		}
	} else {
		_ = os.Remove(fn)
		return nil // do not fail even if not found
	}
}

func (a *App) SetAppPreferences(appPrefs *preferences.AppPreferences) error {
	a.Preferences.App = *appPrefs
	return preferences.SetAppPreferences(appPrefs)
}

func (a *App) GetAppPreferences() *preferences.AppPreferences {
	return &a.Preferences.App
}

func (a *App) SetMenuCollapsed(collapse bool) {
	a.Preferences.App.MenuCollapsed = collapse
	_ = preferences.SetAppPreferences(&a.Preferences.App)
}

func (a *App) SetHelpCollapsed(collapse bool) {
	a.Preferences.App.HelpCollapsed = collapse
	_ = preferences.SetAppPreferences(&a.Preferences.App)
}

func (a *App) SetLastView(view string) {
	a.Preferences.App.LastView = view
	if view != "/wizard" {
		a.Preferences.App.LastViewNoWizard = view
	}
	_ = preferences.SetAppPreferences(&a.Preferences.App)
}

func (a *App) GetWizardReturn() string {
	if a.Preferences.App.LastViewNoWizard == "" {
		return "/"
	}
	return a.Preferences.App.LastViewNoWizard
}

func (a *App) GetAppId() preferences.Id {
	return preferences.GetAppId()
}

func (a *App) SetLastTab(route string, tab string) {
	if !atomic.CompareAndSwapInt32(&a.locked, 0, 1) {
		return
	}
	defer atomic.StoreInt32(&a.locked, 0)

	a.Preferences.App.LastTab[route] = tab
	_ = preferences.SetAppPreferences(&a.Preferences.App)
}

func (a *App) GetLastTab(route string) string {
	return a.Preferences.App.LastTab[route]
}

func (a *App) GetOpenProjects() []map[string]interface{} {
	projectIDs := a.Projects.GetOpenProjectIDs()
	result := make([]map[string]interface{}, 0, len(projectIDs))

	for _, id := range projectIDs {
		project := a.Projects.GetProjectByID(id)
		if project == nil {
			continue
		}

		projectInfo := map[string]interface{}{
			"id":         id,
			"name":       project.GetName(),
			"path":       project.GetPath(),
			"isActive":   id == a.Projects.ActiveID,
			"isDirty":    project.IsDirty(),
			"lastOpened": project.LastOpened,
			// "createdAt":  project.CreatedAt,
		}

		result = append(result, projectInfo)
	}

	return result
}

func (a *App) SwitchToProject(id string) error {
	if a.Projects.GetProjectByID(id) == nil {
		return fmt.Errorf("no project with ID %s exists", id)
	}
	return a.Projects.SetActive(id)
}

func (a *App) CloseProject(id string) error {
	project := a.Projects.GetProjectByID(id)
	if project == nil {
		return fmt.Errorf("no project with ID %s exists", id)
	}

	// Check if project has unsaved changes
	if project.IsDirty() {
		response, err := runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Title:   "Unsaved Changes",
			Message: fmt.Sprintf("Do you want to save changes to project '%s' before closing?", project.GetName()),
			Buttons: []string{"Yes", "No", "Cancel"},
		})

		if err != nil {
			return err
		}

		switch response {
		case "Yes":
			// Save the project before closing
			if project.GetPath() == "" {
				// Project hasn't been saved before, need to use SaveAs
				path, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
					Title: "Save Project Before Closing",
				})
				if err != nil || path == "" {
					return fmt.Errorf("save canceled")
				}

				// Use project's SaveAs method instead of SaveProjectAs
				if err := project.SaveAs(path); err != nil {
					return err
				}
			} else {
				// Project has a path, use normal save
				// Use project's Save method instead of SaveProject
				if err := project.Save(); err != nil {
					return err
				}
			}
		case "Cancel":
			return fmt.Errorf("close canceled")
		}
	}

	return a.Projects.Close(id)
}

func (a *App) Logger(msg string) {
	fmt.Println(msg)
}

func (a *App) GetUserPreferences() *preferences.UserPreferences {
	return &a.Preferences.User
}

func (a *App) SetUserPreferences(userPrefs *preferences.UserPreferences) error {
	a.Preferences.User = *userPrefs
	return preferences.SetUserPreferences(userPrefs)
}

func (a *App) GetOrgPreferences() *preferences.OrgPreferences {
	return &a.Preferences.Org
}

func (a *App) SetOrgPreferences(orgPrefs *preferences.OrgPreferences) error {
	a.Preferences.Org = *orgPrefs
	return preferences.SetOrgPreferences(orgPrefs)
}

func (app *App) GetChainList() *utils.ChainList {
	return app.ChainList
}
