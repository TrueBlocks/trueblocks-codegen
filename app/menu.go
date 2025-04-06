package app

import (
	"context"
	"log"
	"os"

	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) FileNew(data *menu.CallbackData) {
	if !a.State.Dirty {
		if err := a.fileNew(); err != nil {
			a.emitError(a.ctx, "File → New failed: ", err)
		}
		a.emitStatus(a.ctx, "New file created")
		return
	}

	response, err := runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Title:   "Unsaved Changes",
		Message: "Do you want to save changes to the current project before creating a new one?",
		Buttons: []string{"Yes", "No", "Cancel"},
	})

	if err != nil {
		a.emitError(a.ctx, "Dialog error: ", err)
		return
	}

	switch response {
	case "Yes":
		if err := a.fileSave(); err != nil {
			a.emitError(a.ctx, "Save error: ", err)
			return
		}
		if err := a.fileNew(); err != nil {
			a.emitError(a.ctx, "File → New failed: ", err)
			return
		}
	case "No":
		if err := a.fileNew(); err != nil {
			a.emitError(a.ctx, "File → New failed: ", err)
			return
		}
	case "Cancel":
		a.emitStatus(a.ctx, "File not saved")
		return
	}

	a.emitStatus(a.ctx, "New file created")
}

func (a *App) FileOpen(data *menu.CallbackData) {
	if a.State.Dirty {
		response, err := runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Title:   "Unsaved Changes",
			Message: "Do you want to save changes before opening another file?",
			Buttons: []string{"Yes", "No", "Cancel"},
		})

		if err != nil {
			a.emitError(a.ctx, "Dialog error", err)
			return
		}

		switch response {
		case "Yes":
			if err := a.fileSave(); err != nil {
				a.emitError(a.ctx, "Save failed", err)
				return
			}
		case "Cancel":
			a.emitStatus(a.ctx, "Open canceled")
			return
		}
	}

	path, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open TrueBlocks Project File",
	})
	if err != nil || path == "" {
		a.emitStatus(a.ctx, "No file selected")
		return
	}

	if err := a.fileOpen(path); err != nil {
		a.emitError(a.ctx, "Open failed", err)
		return
	}

	a.emitStatus(a.ctx, "File opened")
}

func (a *App) FileSave(data *menu.CallbackData) {
	if err := a.fileSave(); err != nil {
		a.emitError(a.ctx, "Save failed", err)
		return
	}
	a.emitStatus(a.ctx, "File saved")
}

func (a *App) FileSaveAs(data *menu.CallbackData) {
	path, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title: "Save TrueBlocks Project As",
	})
	if err != nil || path == "" {
		a.emitStatus(a.ctx, "Save As canceled")
		return
	}

	if err := a.fileSaveAs(path, true); err != nil {
		a.emitError(a.ctx, "Save As failed", err)
		return
	}

	a.emitStatus(a.ctx, "File saved as")
}

func (a *App) AppQuit(_ *menu.CallbackData) {
	// if a.State.Dirty {
	// a.ShowUnsavedChangesDialog()
	// return
	// }
	os.Exit(0)
}

func (a *App) buildAppMenu() *menu.Menu {
	appMenu := menu.NewMenu()

	// File Menu
	file := appMenu.AddSubmenu("File")
	file.AddText("New", keys.CmdOrCtrl("n"), a.FileNew)
	file.AddText("Open", keys.CmdOrCtrl("o"), a.FileOpen)
	file.AddText("Save", keys.CmdOrCtrl("s"), a.FileSave)
	file.AddText("Save As", keys.CmdOrCtrl("shift+s"), a.FileSaveAs)
	file.AddSeparator()
	file.AddText("Quit", keys.CmdOrCtrl("q"), a.AppQuit)

	// Edit Menu
	edit := appMenu.AddSubmenu("Edit")
	edit.AddText("Undo", keys.CmdOrCtrl("z"), nil)       // menu.EditUndo)
	edit.AddText("Redo", keys.CmdOrCtrl("shift+z"), nil) // menu.EditRedo)
	edit.AddSeparator()
	edit.AddText("Cut", keys.CmdOrCtrl("x"), nil)        // menu.EditCut)
	edit.AddText("Copy", keys.CmdOrCtrl("c"), nil)       // menu.EditCopy)
	edit.AddText("Paste", keys.CmdOrCtrl("v"), nil)      // menu.EditPaste)
	edit.AddText("Select All", keys.CmdOrCtrl("a"), nil) // menu.EditSelectAll)

	// Window Menu
	window := appMenu.AddSubmenu("Window")
	window.AddText("Minimize", keys.CmdOrCtrl("m"), nil) // menu.WindowMinimize)
	window.AddText("Zoom", nil, nil)                     // menu.WindowZoom)

	// Help Menu
	help := appMenu.AddSubmenu("Help")
	help.AddText("About", nil, func(_ *menu.CallbackData) {
		runtime.BrowserOpenURL(a.ctx, "https://trueblocks.io/about")
	})
	help.AddText("Report Issue", nil, func(_ *menu.CallbackData) {
		runtime.BrowserOpenURL(a.ctx, "https://github.com/TrueBlocks/trueblocks-codeGen/issues")
	})

	return appMenu
}

func (a *App) emitError(ctx context.Context, source string, err error) {
	msg := "Error: " + source + ": " + err.Error()
	runtime.EventsEmit(ctx, "statusbar:log", msg)
}

func (a *App) emitStatus(ctx context.Context, msg string) {
	log.Println(msg)
	runtime.EventsEmit(ctx, "statusbar:log", msg)
}
