package types

type State struct {
	Org     OrgPreferences  `json:"org"`
	User    UserPreferences `json:"user"`
	App     AppPreferences  `json:"app"`
	Project Project         `json:"project"`
	Dirty   bool            `json:"dirty"`
	Path    string          `json:"path"`
}

func (s *State) SetLastFile(path string) {
	if s.App.LastFile != path {
		s.App.LastFile = path
		s.Dirty = true
	}
}

func (s *State) GetLastFile() string {
	return s.App.LastFile
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
