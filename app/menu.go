package app

import (
	"github.com/wailsapp/wails/v2/pkg/menu"
)

func (a *App) FileNew(data *menu.CallbackData) {
}

func (a *App) FileOpen(data *menu.CallbackData) {
}

func (a *App) FileSave(data *menu.CallbackData) {
}

func (a *App) FileSaveAs(data *menu.CallbackData) {
}

func (a *App) AppQuit(_ *menu.CallbackData) {
}

func (a *App) buildAppMenu() *menu.Menu {
	appMenu := menu.NewMenu()
	return appMenu
}

// func (a *App) emitError(ctx context.Context, source string, err error) {
// 	msg := "Error: " + source + ": " + err.Error()
// 	runtime.EventsEmit(ctx, "statusbar:log", msg)
// }

// func (a *App) emitStatus(ctx context.Context, msg string) {
// 	log.Println(msg)
// 	runtime.EventsEmit(ctx, "statusbar:log", msg)
// }
