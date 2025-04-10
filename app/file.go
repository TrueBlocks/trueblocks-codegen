package app

import (
	"encoding/json"
	"errors"
	"os"

	"github.com/TrueBlocks/trueblocks-codeGen/pkg/types"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
)

// Generic errors
var ErrEmptyFilePath = errors.New("empty file path")
var ErrUnsavedChanges = errors.New("unsaved changes")
var ErrFileNotFound = errors.New("file not found")
var ErrOverwriteNotConfirmed = errors.New("file exists, overwrite not confirmed")

// File operation errors
var ErrReadFileFailed = errors.New("failed to read file")
var ErrWriteFileFailed = errors.New("failed to write file")
var ErrSerializeFailed = errors.New("failed to serialize data")
var ErrDeserializeFailed = errors.New("failed to deserialize data")

func (a *App) fileNew() error {
	if a.State.Dirty {
		return ErrUnsavedChanges
	}

	a.State.Project = types.Project{}
	a.State.Path = ""
	a.updateRecentlyUsedFiles()
	return nil
}

func (a *App) fileSave() error {
	if a.State.Path == "" {
		return ErrEmptyFilePath
	}

	if !a.State.Dirty {
		return nil
	}

	if err := a.State.Save(); err != nil {
		return err
	}

	a.updateRecentlyUsedFiles()
	return nil
}

func (a *App) fileSaveAs(newPath string, overwriteConfirmed bool) error {
	if newPath == "" {
		return ErrEmptyFilePath
	}

	if file.FileExists(newPath) && !overwriteConfirmed {
		return ErrOverwriteNotConfirmed
	}

	a.State.Path = newPath

	if err := a.State.Save(); err != nil {
		return err
	}

	a.updateRecentlyUsedFiles()
	return nil
}

func (a *App) fileOpen(newPath string) error {
	if a.State.Dirty {
		return ErrUnsavedChanges
	}

	if newPath == "" {
		return ErrEmptyFilePath
	}

	data, err := os.ReadFile(newPath)
	if err != nil {
		if os.IsNotExist(err) {
			return ErrFileNotFound
		}
		return ErrReadFileFailed
	}

	var project types.Project
	if err := json.Unmarshal(data, &project); err != nil {
		return ErrDeserializeFailed
	}

	if project.Name != "trueblocks-project" {
		return errors.New("invalid project file: missing or incorrect name")
	}

	a.State.Project = project
	a.State.Path = newPath
	a.State.Dirty = false

	a.updateRecentlyUsedFiles()
	return nil
}

func (a *App) updateRecentlyUsedFiles() {
	const maxRecentFiles = 10
	updatedFiles := []string{a.State.Path}
	for _, item := range a.State.App.RecentlyUsedFiles {
		if item != a.State.Path && len(updatedFiles) < maxRecentFiles {
			updatedFiles = append(updatedFiles, item)
		}
	}
	a.State.App.RecentlyUsedFiles = updatedFiles

	if err := types.SaveAppPreferences(&a.State.App); err != nil {
		a.emitStatus(a.ctx, "Error saving app preferences")
	}
}

func (a *App) GetFilename() types.FileStatus {
	return types.FileStatus{
		Name:  "example.txt",
		Dirty: a.State.Dirty,
	}
}

func (a *App) GetFilenameOld() string {
	return "example.txt"
}
