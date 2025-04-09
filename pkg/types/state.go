package types

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"strings"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type State struct {
	Org     OrgPreferences  `json:"org"`
	User    UserPreferences `json:"user"`
	App     AppPreferences  `json:"app"`
	Project Project         `json:"project"`
	Dirty   bool            `json:"dirty"`
	Path    string          `json:"path"`
}

func NewState(org OrgPreferences, user UserPreferences, app AppPreferences) *State {
	return &State{
		Org:     org,
		User:    user,
		App:     app,
		Project: Project{},
		Dirty:   false,
		Path:    "",
	}
}

func (s *State) Save() error {
	dir := filepath.Dir(s.Path)
	if err := file.EstablishFolder(dir); err != nil {
		return fmt.Errorf("failed to ensure directory exists: %w", err)
	}

	s.Project.Name = "trueblocks-project"
	s.Project.Version = "1.0"

	data, err := json.MarshalIndent(s.Project, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to serialize project: %w", err)
	}

	if err := os.WriteFile(s.Path, data, 0644); err != nil {
		return fmt.Errorf("failed to write project file: %w", err)
	}

	s.Dirty = false
	return nil
}

func (s *State) SetLastView(view string) {
	if s.App.LastView != view {
		s.App.LastView = view
		s.Dirty = true
	}
}

func (s *State) GetLastView() string {
	return s.App.LastView
}

func (s *State) SetMenuCollapsed(val bool) {
	if s.App.MenuCollapsed != val {
		s.App.MenuCollapsed = val
		s.Dirty = true
	}
}

func (s *State) GetMenuCollapsed() bool {
	return s.App.MenuCollapsed
}

func (s *State) SetHelpCollapsed(val bool) {
	if s.App.HelpCollapsed != val {
		s.App.HelpCollapsed = val
		s.Dirty = true
	}
}

func (s *State) GetHelpCollapsed() bool {
	return s.App.HelpCollapsed
}

func (s *State) SetWindow(x, y, w, h int) {
	if s.App.Bounds.X != x || s.App.Bounds.Y != y || s.App.Bounds.Width != w || s.App.Bounds.Height != h {
		s.App.Bounds.X = x
		s.App.Bounds.Y = y
		s.App.Bounds.Width = w
		s.App.Bounds.Height = h
		s.Dirty = true
	}
}

func (s *State) GetWindow() (int, int, int, int) {
	return s.App.Bounds.X, s.App.Bounds.Y, s.App.Bounds.Width, s.App.Bounds.Height
}

func (s *State) SetPath(ctx context.Context, path string) {
	s.Path = path
	s.Dirty = true
	s.emitFileStatus(ctx)
}

func (s *State) SetDirty(ctx context.Context, dirty bool) {
	s.Dirty = dirty
	s.emitFileStatus(ctx)
}

func (s *State) GetPreference(key string) string {
	// Handle explicit domain keys
	switch {
	case strings.HasPrefix(key, "project."):
		return s.Project.Preferences[strings.TrimPrefix(key, "project.")]
	case strings.HasPrefix(key, "app."):
		return getFieldValue(s.App, strings.TrimPrefix(key, "app."))
	case strings.HasPrefix(key, "user."):
		return getFieldValue(s.User, strings.TrimPrefix(key, "user."))
	case strings.HasPrefix(key, "org."):
		return getFieldValue(s.Org, strings.TrimPrefix(key, "org."))
	}

	// If unqualified, search in domain order
	if val := s.Project.Preferences[key]; val != "" {
		return val
	}
	if val := getFieldValue(s.App, key); val != "" {
		return val
	}
	if val := getFieldValue(s.User, key); val != "" {
		return val
	}
	if val := getFieldValue(s.Org, key); val != "" {
		return val
	}

	return ""
}

func getFieldValue(prefStruct any, fieldName string) string {
	val := reflect.ValueOf(prefStruct)
	typ := val.Type()

	for i := 0; i < typ.NumField(); i++ {
		field := typ.Field(i)
		tag := field.Tag.Get("json")
		if tag == fieldName {
			fieldVal := val.Field(i)
			if fieldVal.Kind() == reflect.String {
				return fieldVal.String()
			}
		}
	}

	return ""
}

func (s *State) SetPreference(key, value string, persist ...bool) {
	shouldPersist := len(persist) > 0 && persist[0]

	if s.Project.Preferences == nil {
		s.Project.Preferences = make(map[string]string)
	}

	switch {
	case strings.HasPrefix(key, "project."):
		innerKey := strings.TrimPrefix(key, "project.")
		if s.Project.Preferences[innerKey] != value {
			s.Project.Preferences[innerKey] = value
			s.Dirty = true
		}

	case strings.HasPrefix(key, "org."):
		innerKey := strings.TrimPrefix(key, "org.")
		if changed := setStructField(reflect.ValueOf(&s.Org).Elem(), innerKey, value); changed {
			s.Dirty = true
			if shouldPersist {
				_ = SaveOrgPreferences(&s.Org)
			}
		}

	case strings.HasPrefix(key, "user."):
		innerKey := strings.TrimPrefix(key, "user.")
		if changed := setStructField(reflect.ValueOf(&s.User).Elem(), innerKey, value); changed {
			s.Dirty = true
			if shouldPersist {
				_ = SaveUserPreferences(&s.User)
			}
		}

	case strings.HasPrefix(key, "app."):
		innerKey := strings.TrimPrefix(key, "app.")
		if changed := setStructField(reflect.ValueOf(&s.App).Elem(), innerKey, value); changed {
			s.Dirty = true
			if shouldPersist {
				_ = SaveAppPreferences(&s.App)
			}
		}
	}
}

func setStructField(v reflect.Value, key, value string) bool {
	t := v.Type()
	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		tag := field.Tag.Get("json")
		if tag != key {
			continue
		}

		fv := v.Field(i)
		if !fv.IsValid() || !fv.CanSet() {
			return false
		}

		switch fv.Kind() {
		case reflect.String:
			if fv.String() != value {
				fv.SetString(value)
				return true
			}
		case reflect.Slice:
			if fv.Type().Elem().Kind() == reflect.String {
				parts := strings.Split(value, ",")
				current, ok := fv.Interface().([]string)
				if !ok {
					return false
				}
				if !reflect.DeepEqual(current, parts) {
					fv.Set(reflect.ValueOf(parts))
					return true
				}
			}
		default:
			// Handle other types if needed
			return false
		}
	}

	return false
}

func (s *State) Preferences() *AppPreferences {
	return &s.App
}

func (s *State) SavePreferences() error {
	if err := SaveOrgPreferences(&s.Org); err != nil {
		return err
	}
	if err := SaveUserPreferences(&s.User); err != nil {
		return err
	}
	if err := SaveAppPreferences(&s.App); err != nil {
		return err
	}
	return nil
}

func (s *State) emitFileStatus(ctx context.Context) {
	status := map[string]any{
		"name":  filepath.Base(s.Path),
		"dirty": s.Dirty,
	}
	runtime.EventsEmit(ctx, "file:status", status)
}
