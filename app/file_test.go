package app

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/TrueBlocks/trueblocks-codeGen/pkg/types"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
)

func TestFileNew(t *testing.T) {
	t.Run("DirtyStatePreventsNewFile", func(t *testing.T) {
		app, dir, _ := getTestApp(t, true /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		err := app.fileNew()
		if err == nil {
			t.Fatalf("Expected error due to unsaved changes, but got none")
		}
		if !errors.Is(err, ErrUnsavedChanges) {
			t.Fatalf("Expected ErrUnsavedChanges, got: %v", err)
		}
	})

	t.Run("CleanStateAllowsNewFile", func(t *testing.T) {
		app, dir, _ := getTestApp(t, false /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		err := app.fileNew()
		if err != nil {
			t.Fatalf("Expected no error for clean state, got: %v", err)
		}
		if app.State.Path != "" {
			t.Fatalf("Expected empty path, got %s", app.State.Path)
		}
		if app.State.Dirty {
			t.Fatalf("Expected dirty flag to be false after new file, but it was true")
		}
	})
}

func TestFileSave(t *testing.T) {
	t.Run("BasicSaveCreatesFile", func(t *testing.T) {
		app, dir, filePath := getTestApp(t, true /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		if err := app.fileSave(); err != nil {
			t.Fatalf("fileSave() returned an error: %v", err)
		}

		if app.State.Dirty {
			t.Fatalf("Expected dirty flag to be false, but it was true")
		}

		if !file.FileExists(filePath) {
			t.Fatalf("Expected file %s to be created, but it wasn’t", filePath)
		}

		fileInfo, err := os.Stat(filePath)
		if err != nil {
			t.Fatalf("Failed to stat file: %v", err)
		}

		if fileInfo.Mode().Perm() != 0644 {
			t.Fatalf("Expected file permissions to be 0644, got: %v", fileInfo.Mode().Perm())
		}

		content, err := os.ReadFile(filePath)
		if err != nil || len(content) == 0 {
			t.Fatalf("Expected non-empty file content, got: %v", err)
		}
	})

	// New test for empty path
	t.Run("EmptyPathFails", func(t *testing.T) {
		app, dir, _ := getTestApp(t, true /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()
		app.State.Path = ""

		err := app.fileSave()
		if !errors.Is(err, ErrEmptyFilePath) {
			t.Fatalf("Expected ErrEmptyFilePath, got: %v", err)
		}
	})

	// New test for non-dirty state
	t.Run("NotDirtyNoOp", func(t *testing.T) {
		app, dir, _ := getTestApp(t, false /* not dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		err := app.fileSave()
		if err != nil {
			t.Fatalf("Expected no error for non-dirty state, got: %v", err)
		}
	})
}

func TestFileSaveAs(t *testing.T) {
	t.Run("CreatesNewFile", func(t *testing.T) {
		app, dir, filePath := getTestApp(t, true /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		err := app.fileSaveAs(filePath, true)
		if err != nil {
			t.Fatalf("fileSaveAs() returned an error: %v", err)
		}

		if !file.FileExists(filePath) {
			t.Fatalf("Expected file %s to be created, but it wasn’t", filePath)
		}
		if app.State.Path != filePath {
			t.Fatalf("Expected file path %s, got %s", filePath, app.State.Path)
		}
		if app.State.Dirty {
			t.Fatalf("Expected dirty flag to be false, but it was true")
		}
	})

	// New test for empty path
	t.Run("EmptyPathFails", func(t *testing.T) {
		app, dir, _ := getTestApp(t, true /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		err := app.fileSaveAs("", true)
		if !errors.Is(err, ErrEmptyFilePath) {
			t.Fatalf("Expected ErrEmptyFilePath, got: %v", err)
		}
	})

	// New test for overwrite protection
	t.Run("OverwriteNotConfirmedFails", func(t *testing.T) {
		app, dir, filePath := getTestApp(t, true /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		os.WriteFile(filePath, []byte("{}"), 0644)

		err := app.fileSaveAs(filePath, false)
		if !errors.Is(err, ErrOverwriteNotConfirmed) {
			t.Fatalf("Expected ErrOverwriteNotConfirmed, got: %v", err)
		}
	})
}

func TestFileOpen(t *testing.T) {
	t.Run("ValidProjectFile", func(t *testing.T) {
		app, dir, filePath := getTestApp(t, false /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		proj := types.Project{
			Version: "1.0",
			Data:    1,
			Name:    "trueblocks-project",
		}
		data, _ := json.Marshal(proj)
		os.WriteFile(filePath, data, 0644)

		err := app.fileOpen(filePath)
		if err != nil {
			t.Fatalf("fileOpen() returned an error: %v", err)
		}

		if app.State.Path != filePath {
			t.Fatalf("Expected file path %s, got %s", filePath, app.State.Path)
		}

		if app.State.Project.Version != "1.0" {
			t.Fatalf("Expected version '1.0', got %s", app.State.Project.Version)
		}

		if app.State.Project.Data.(float64) != 1 {
			t.Fatalf("Expected Project.Data 1, got %v", app.State.Project.Data)
		}
	})

	t.Run("NonexistentFile", func(t *testing.T) {
		app, dir, _ := getTestApp(t, false /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		err := app.fileOpen("./nonexistent_project.json")
		if !errors.Is(err, ErrFileNotFound) {
			t.Fatalf("Expected ErrFileNotFound, got: %v", err)
		}
	})

	// New test for dirty state
	t.Run("DirtyStatePreventsOpen", func(t *testing.T) {
		app, dir, filePath := getTestApp(t, true /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		err := app.fileOpen(filePath)
		if !errors.Is(err, ErrUnsavedChanges) {
			t.Fatalf("Expected ErrUnsavedChanges, got: %v", err)
		}
	})

	// New test for empty path
	t.Run("EmptyPathFails", func(t *testing.T) {
		app, dir, _ := getTestApp(t, false /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		err := app.fileOpen("")
		if !errors.Is(err, ErrEmptyFilePath) {
			t.Fatalf("Expected ErrEmptyFilePath, got: %v", err)
		}
	})

	// New test for invalid JSON
	t.Run("InvalidJSONFails", func(t *testing.T) {
		app, dir, filePath := getTestApp(t, false /* dirty */)
		defer types.SetConfigBaseForTest(t, dir)()

		os.WriteFile(filePath, []byte("{invalid json"), 0644)
		err := app.fileOpen(filePath)
		if !errors.Is(err, ErrDeserializeFailed) {
			t.Fatalf("Expected ErrDeserializeFailed, got: %v", err)
		}
	})
}

func TestUpdateRecentlyUsedFiles(t *testing.T) {
	app, dir, _ := getTestApp(t, true /* dirty */)
	defer types.SetConfigBaseForTest(t, dir)()

	_ = app.fileSave()
	if len(app.State.App.RecentlyUsedFiles) == 0 {
		t.Fatalf("Expected recently used files list to contain entries, but it was empty")
	}

	ruf := strings.Replace(app.State.App.RecentlyUsedFiles[0], dir, ".", -1)
	if ruf != "./test_project.json" {
		t.Fatalf("Expected recently used file at position 0 to be './test_project.json', got %s", ruf)
	}
}

// Helper functions remain unchanged
func getTestApp(t *testing.T, dirty bool) (*App, string, string) {
	t.Helper()

	dir := t.TempDir()
	filePath := filepath.Join(dir, "test_project.json")

	app := &App{
		State: &types.State{
			Path:    filePath,
			Project: types.Project{},
			Dirty:   dirty,
		},
	}

	return app, dir, filePath
}
