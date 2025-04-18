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

	s.Project.Name = strings.ToLower(GetAppId().OrgName) + "-project"
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

func (s *State) SetLastFile(path string) {
	newList := append([]string{path}, s.App.RecentlyUsedFiles...)
	s.App.RecentlyUsedFiles = newList[:min(10, len(newList))]
}

func (s *State) GetLastFile() string {
	if len(s.App.RecentlyUsedFiles) == 0 {
		return ""
	}
	return s.App.RecentlyUsedFiles[0]
}

func (s *State) SetLastView(view string) {
	if s.App.LastView != view {
		s.App.LastView = view
		if view != "/wizard" {
			s.App.LastViewNoWizard = view
		}
		s.Dirty = true
	}
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
		tag := strings.ReplaceAll(field.Tag.Get("json"), ",omitempty", "")
		if tag == fieldName {
			fieldVal := val.Field(i)
			if fieldVal.Kind() == reflect.String {
				return fieldVal.String()
			}
		}
	}

	return ""
}

type KV struct {
	Key   string
	Value string
}

func (s *State) SetPreferences(pairs []KV, persist ...bool) error {
	doPersist := len(persist) > 0 && persist[0]
	for i, pair := range pairs {
		isLast := i == len(pairs)-1
		persistNow := doPersist && isLast
		if err := s.SetPreference(pair.Key, pair.Value, persistNow); err != nil {
			return err
		}
	}
	return nil
}

func (s *State) SetPreference(key, value string, persist ...bool) error {
	shouldPersist := len(persist) > 0 && persist[0]

	if s.Project.Preferences == nil {
		s.Project.Preferences = make(map[string]string)
	}

	switch {
	case strings.HasPrefix(key, "project."):
		if s.Project.Preferences[key] != value {
			s.Project.Preferences[key] = value
			s.Dirty = true
		}

	case strings.HasPrefix(key, "org."):
		kk := strings.TrimPrefix(key, "org.")
		_ = setStructField(reflect.ValueOf(&s.Org).Elem(), kk, value)
		if shouldPersist {
			return SetOrgPreferences(&s.Org)
		}

	case strings.HasPrefix(key, "user."):
		kk := strings.TrimPrefix(key, "user.")
		_ = setStructField(reflect.ValueOf(&s.User).Elem(), kk, value)
		if shouldPersist {
			return SetUserPreferences(&s.User)
		}

	case strings.HasPrefix(key, "app."):
		kk := strings.TrimPrefix(key, "app.")
		_ = setStructField(reflect.ValueOf(&s.App).Elem(), kk, value)
		if shouldPersist {
			return SetAppPreferences(&s.App)
		}
	}

	return nil
}

func setStructField(v reflect.Value, key, value string) bool {
	t := v.Type()
	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		tag := strings.ReplaceAll(field.Tag.Get("json"), ",omitempty", "")
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

func (s *State) SavePreferences() error {
	if err := SetOrgPreferences(&s.Org); err != nil {
		return err
	}
	if err := SetUserPreferences(&s.User); err != nil {
		return err
	}
	if err := SetAppPreferences(&s.App); err != nil {
		return err
	}
	return nil
}

type FileStatus struct {
	Name  string `json:"name"`
	Dirty bool   `json:"dirty"`
}

func (s *State) emitFileStatus(ctx context.Context) {
	fs := FileStatus{
		Name:  filepath.Base(s.Path),
		Dirty: s.Dirty,
	}
	runtime.EventsEmit(ctx, "file:status", fs)
}
