package app

import (
	"context"
	"testing"

	"github.com/TrueBlocks/trueblocks-codeGen/pkg/config"
)

func TestIsReady(t *testing.T) {
	app := &App{}

	if app.IsReady() {
		t.Fatal("Expected IsReady() to be false when ctx and prefs are nil")
	}

	app.ctx = context.Background()
	if app.IsReady() {
		t.Fatal("Expected IsReady() to be false when prefs is nil")
	}

	app.prefs = &config.Preferences{}
	if !app.IsReady() {
		t.Fatal("Expected IsReady() to be true when ctx and prefs are set")
	}
}

func TestSaveBounds_SavesToPreferences(t *testing.T) {
	tmp := t.TempDir()
	defer config.SetConfigBaseForTest(tmp)()

	app := &App{
		ctx:   context.Background(),
		prefs: &config.Preferences{},
	}

	app.SaveBounds(111, 222, 333, 444)

	loaded, err := config.LoadPreferences()
	if err != nil {
		t.Fatalf("Failed to load saved preferences: %v", err)
	}

	if loaded.X != 111 || loaded.Y != 222 || loaded.Width != 333 || loaded.Height != 444 {
		t.Fatalf("Unexpected saved bounds: %+v", loaded)
	}
}
