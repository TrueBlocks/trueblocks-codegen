package types

import "github.com/TrueBlocks/trueblocks-codeGen/pkg/config"

type State struct {
	value string
	dirty bool
	prefs config.Preferences
}

func (s *State) SetValue(v string) {
	if s.value != v {
		s.value = v
		s.dirty = true
	}
}

func (s *State) GetValue() string {
	return s.value
}

func (s *State) SetLastFile(path string) {
	if s.prefs.LastFile != path {
		s.prefs.LastFile = path
		s.dirty = true
	}
}

func (s *State) GetLastFile() string {
	return s.prefs.LastFile
}

func (s *State) SetLastView(view string) {
	if s.prefs.LastView != view {
		s.prefs.LastView = view
		s.dirty = true
	}
}

func (s *State) GetLastView() string {
	return s.prefs.LastView
}

func (s *State) SetMenuCollapsed(val bool) {
	if s.prefs.MenuCollapsed != val {
		s.prefs.MenuCollapsed = val
		s.dirty = true
	}
}

func (s *State) GetMenuCollapsed() bool {
	return s.prefs.MenuCollapsed
}

func (s *State) SetHelpCollapsed(val bool) {
	if s.prefs.HelpCollapsed != val {
		s.prefs.HelpCollapsed = val
		s.dirty = true
	}
}

func (s *State) GetHelpCollapsed() bool {
	return s.prefs.HelpCollapsed
}

func (s *State) SetWindow(x, y, w, h int) {
	if s.prefs.X != x || s.prefs.Y != y || s.prefs.Width != w || s.prefs.Height != h {
		s.prefs.X = x
		s.prefs.Y = y
		s.prefs.Width = w
		s.prefs.Height = h
		s.dirty = true
	}
}

func (s *State) GetWindow() (int, int, int, int) {
	return s.prefs.X, s.prefs.Y, s.prefs.Width, s.prefs.Height
}
