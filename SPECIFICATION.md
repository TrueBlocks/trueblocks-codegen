TrueBlocks CodeGen Requirements Specification (Very Detailed)
Date: April 02, 2025

Purpose: Specify the TrueBlocks CodeGen desktop application (Wails v2, React frontend) for Ethereum mainnet blockchain data management via TrueBlocks SDK, enabling a prototype with robust UI, data handling, file operations, and keyboard navigation.

1. Overview
Narrative
What It Covers: This section sets the stage, describing TrueBlocks CodeGen as a Wails-based desktop app (Go backend, React frontend) for managing Ethereum blockchain data (12 datasets like Names, transactions). It outlines the spec’s goal: enhancing the prototype based on Tasks 1-9, tackling past issues (e.g., stale data), and aligning with your priorities—speed, simplicity, freshness.
Considerations: We started broad—your initial code and To Do list hinted at UI tweaks (Tasks 1-3), data woes (Tasks 4-5), file ops (Task 7), and keyboard needs (Task 9). I assumed partial implementation (e.g., file ops) and aimed to synthesize our 100+ message journey into a cohesive spec. We debated depth—initially high-level, but you pushed for "very detailed" to regenerate the To Do list precisely.
Final Thoughts: This is a living spec—comprehensive yet prototype-focused, assuming Tasks 1-5 and 7-9 are partly done. It’s detailed enough to guide coding and review, leaving Task 6 skipped and Task 10 delayed as per your list. Tomorrow, you’ll extend/question it, and this sets that foundation.
Details
TrueBlocks CodeGen is a desktop app built with Wails (Go backend, React frontend via WebView) to manage Ethereum blockchain data (12 datasets, e.g., Names, transactions). This spec details enhancements from Tasks 1-9, addressing past stale data issues, optimizing data flow, implementing file operations, and improving keyboard navigation. It assumes partial implementation (e.g., file ops in app.go, State in pkg/state) and provides a comprehensive guide for regeneration and review.

2. Past Pitfalls (Task 4, Step 1)
Narrative
What It Covers: This section pinpoints why past versions failed—stale data from frontend state mismanagement—drawing from Task 4, Step 1. It’s the "why" behind our data strategy fixes.
Considerations: We dug into your history—initially, I focused on useEffect polling (e.g., App.tsx), but you clarified stale data was the real beast, not initialization. You described deep, convoluted state (e.g., page data in tables) and no unified AppState, causing sync issues despite backend freshness. We debated examples (e.g., polling loops) and impacts (e.g., UI lag, save failures), refining it to your core pain: frontend-backend disconnect.
Final Thoughts: Stale data was a beast of fragmented state, not just useEffect. Our fix—centralized AppContext, localized ViewContext, and a unified State—nails it. This is detailed enough to explain past woes and justify our approach, ready for tomorrow’s scrutiny.
Details
2.1 Stale Data from Frontend State Mismanagement
Issue: Previous versions stored page state (e.g., current page, filters) deep in the React component tree (e.g., local useState in table components), unsynced with the backend’s 6-second updates. No cohesive AppState unified 12 datasets, view configs, and prefs, causing fragmentation.
Impact:
UI: Tables showed stale data (e.g., old page after backend refresh), confusing users.
File Save: No single state snapshot—saving omitted runtime data (e.g., page number).
Evidence: Polling loops (e.g., App.tsx’s 200x 50ms IsReady check) hinted at sync struggles; requirements noted “overuse of useEffect” and “refreshing challenges.”
Resolution: Centralize shared data in AppContext, localize view data in ViewContext, unify runtime state in State with file ops.
3. Data Strategy (Tasks 4 & 5)
Narrative
What It Covers: This section defines how data flows—backend ownership, updates, and frontend fetching—merging Tasks 4 (discussion) and 5 (design). It’s the backbone of your app’s speed and freshness.
Considerations: We wrestled with stale data roots (Task 4)—you clarified backend freshness (6s updates) wasn’t the issue; frontend state was. We explored AppContext vs. ViewContext (Task 4, Steps 2-3), debating granularity (e.g., global vs. local data) and performance (useMemo). For the backend (Task 5), we nailed 6s updates, SDK concurrency, and locking—considering snapshots (rejected for memory) and polling (minimized). The flow diagram evolved from abstract to Mermaid, ensuring clarity.
Final Thoughts: This is your data heartbeat—backend owns it, frontend asks smartly. We landed on a lean, fast system leveraging Wails’ zero latency and SDK’s streaming, with detailed code snippets to lock it in. It’s ready for tomorrow’s deep dive—every choice is justified.
Details
3.1 Backend Data Strategy
Ownership:
Datasets: 12 independent sets (e.g., Names, transactions, logs) in a binary cache, managed by app.go’s App struct.
Source: TrueBlocks SDK streams raw blockchain data (no JSON, Go channels), ~0.1s per update for 10-20 addresses.
Periodic Updates:
Schedule: Goroutines per dataset run every 6s (half Ethereum’s 12s block time), metered—skip if prior update exceeds 6s (e.g., network delay).
Concurrency: SDK handles parallel streaming (e.g., GetTransactions(), GetLogs()), no throttling/queuing needed—Go scheduler suffices.
Consistency: sync.Mutex locks each dataset during update (~0.1s), no snapshots—frontend waits briefly (Wails’ zero latency mitigates).
Code:
go

Collapse

Wrap

Copy
func (a *App) startDataUpdates() {
    for _, dataset := range []string{"names", "txs", "logs"} {
        go func(ds string) {
            ticker := time.NewTicker(6 * time.Second)
            defer ticker.Stop()
            for range ticker.C {
                a.mu.Lock()
                // SDK call (e.g., sdk.GetTransactions(ds))
                a.mu.Unlock()
            }
        }(dataset)
    }
}
Frontend Interaction:
Page Limit: One page (user-defined, e.g., 10-100 records) fetched via Wails calls (e.g., fetchData(ds, pageNum, pageSize)), old pages discarded.
Aggregation: During 6s updates, backend sorts/filters (e.g., 10-20 addresses), caches pages—fetch returns prepped slice.
Code:
go

Collapse

Wrap

Copy
func (a *App) FetchData(ds string, pageNum, pageSize int) ([]Record, error) {
    a.mu.Lock()
    defer a.mu.Unlock()
    start := (pageNum - 1) * pageSize
    end := start + pageSize
    if end > len(a.cache[ds]) { end = len(a.cache[ds]) }
    return a.cache[ds][start:end], nil
}
3.2 Frontend Data Management
AppContext:
Purpose: Shared, editable data (e.g., EditableButNotChangingOtherwise—Names).
Fetch: On demand (e.g., fetchNames(pageNum)), updates state.data.
Optimization: useMemo ({data, fetchData}, [data]) limits re-renders.
Code:
tsx

Collapse

Wrap

Copy
const AppContext = createContext({ data: [], fetchData: async (page: number) => {} });
const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const fetchData = async (page) => { setData(await window.go.main.App.FetchData("names", page, 100)); };
  const value = useMemo(() => ({ data, fetchData }), [data]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
ViewContext:
Purpose: Local data per view (e.g., Data.tsx).
Types:
NeverChangingDataType1 (e.g., Index): Fetch once, cache in useState.
FrequentlyUpdatingNeverEdited (e.g., Transactions): Fetch on demand or poll (12s max lag).
Code:
tsx

Collapse

Wrap

Copy
const ViewContext = createContext({ data: [], fetchData: async (page: number) => {} });
const Data = () => {
  const [data, setData] = useState([]);
  const fetchData = async (page) => { setData(await window.go.main.App.FetchData("txs", page, 100)); };
  const value = useMemo(() => ({ data, fetchData }), [data]);
  return <ViewContext.Provider value={value}>...</ViewContext.Provider>;
};
3.3 Data Flow
Mermaid Diagram:
mermaid

Collapse

Wrap

Copy
graph TD
    A[Backend: TrueBlocks SDK] -->|Streams updates| B[In-Memory Cache<br>12 Datasets]
    C[Scheduled Go Routines<br>6s] -->|Refreshes concurrently| B
    B -->|Locked per update| D[Wails: Zero Latency]
    D -->|Serves page| E[Frontend: AppContext<br>Shared Data]
    D -->|Serves page| F[Frontend: ViewContext<br>Local Data]
    E -->|Fetches on demand| D
    F -->|Fetches on demand or polls| D
Details:
Backend: SDK streams to cache (e.g., GetNames()), goroutines refresh every 6s, locks ensure consistency.
Wails: Zero-latency bridge—frontend calls (e.g., FetchData) get instant pages.
Frontend: AppContext for Names, ViewContext for view data (e.g., txs in Data).
Trade-Offs:
Latency: 0.1s lock delay vs. guaranteed freshness (max 12s lag).
Memory: Full cache (~5000 records/dataset) vs. sub-second fetches.
4. Application State and File Operations (Task 7)
Narrative
What It Covers: This section details State and file operations (FileSave, FileSaveAs, FileOpen, FileNew), plus the Recently Used Files (RUF) list—Task 7’s core. It’s how your app persists and manages its runtime state.
Considerations: We skipped Task #6 (state vs. file format) but dove deep into Task #7. Initially, I proposed a full AppState (e.g., LastAddress), but you pivoted to a prototype-focused State with prefs, filePath, and dirty. We debated mutexes (dropped—caller handles), pointers vs. copies (chose copies), and struct vs. field-level access (settled on field setters saving prefs). File ops evolved—FileSave went from erroring to calling FileSaveAs, RUF shifted from State to Preferences. FileNew emerged as a bonus, reflecting your flow.
Final Thoughts: This nails your prototype needs—lean State, robust file ops, app-wide RUF. It’s detailed with code, edge cases (e.g., dirty prompts), and caller-controlled atomicity. Tomorrow, you might extend State (e.g., LastAddress) or formalize FileNew—it’s ready for that.
Details
4.1 State (pkg/state/state.go)
Code:
go

Collapse

Wrap

Copy
package state

type State struct {
    prefs     config.Preferences
    filePath  string
    dirty     bool
}

func NewState() *State {
    prefs, _ := config.EnsurePreferencesFile()
    return &State{prefs: *prefs, filePath: "", dirty: false}
}

func (s *State) SetX(x int) {
    s.prefs.X = x
    s.dirty = true
    s.savePrefsToFile()
}
func (s *State) GetX() int { return s.prefs.X }
// ... (SetY, GetWidth, etc.)
func (s *State) SetFilePath(path string) {
    s.filePath = path
    s.dirty = true
}
func (s *State) GetFilePath() string { return s.filePath }
func (s *State) IsDirty() bool { return s.dirty }
func (s *State) ClearDirty() { s.dirty = false }
func (s *State) savePrefsToFile() {
    path := filepath.Join(config.GetConfigBase(), "preferences.yml")
    data, _ := yaml.Marshal(&s.prefs)
    os.MkdirAll(filepath.Dir(path), 0755)
    os.WriteFile(path, data, 0644)
}
Fields: x, y, width, height, lastView, menuCollapsed, helpCollapsed, filePath, dirty.
Behavior: Setters mark dirty, save prefs to preferences.yml—unsaved changes persist separate from file saves.
4.2 File Operations (app.go)
App Struct:
go

Collapse

Wrap

Copy
type App struct {
    ctx         context.Context
    state       *state.State
    settings    *config.Settings
    mu          sync.Mutex
    progressChan chan Progress
}
FileSave:
go

Collapse

Wrap

Copy
func (a *App) FileSave() error {
    a.mu.Lock()
    defer a.mu.Unlock()
    if !a.state.IsDirty() { return nil }
    filePath := a.state.GetFilePath()
    if filePath == "" {
        saved, err := a.FileSaveAs()
        if err != nil { return err }
        if !saved { return nil }
        return nil
    }
    data, err := yaml.Marshal(a.state)
    if err != nil { return err }
    os.MkdirAll(filepath.Dir(filePath), 0755)
    os.WriteFile(filePath, data, 0644)
    a.state.ClearDirty()
    config.updateRecentFiles(&a.state.prefs, filePath)
    return nil
}
FileSaveAs:
go

Collapse

Wrap

Copy
func (a *App) FileSaveAs() (bool, error) {
    a.mu.Lock()
    defer a.mu.Unlock()
    filePath, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
        DefaultFilename: "project.yml",
        Filters: []runtime.FileFilter{{DisplayName: "YAML Files (*.yml)", Pattern: "*.yml"}},
    })
    if err != nil { return false, err }
    if filePath == "" { return false, nil }
    data, err := yaml.Marshal(a.state)
    if err != nil { return false, err }
    os.MkdirAll(filepath.Dir(filePath), 0755)
    os.WriteFile(filePath, data, 0644)
    a.state.SetFilePath(filePath)
    config.updateRecentFiles(&a.state.prefs, filePath)
    a.state.ClearDirty()
    return true, nil
}
FileOpen: As per Step 7.3, with FileSaveAs on empty filePath.
FileNew: Bonus Step 7.6, resets after save prompt.
4.3 RUF
In Preferences: RecentFiles []string, max 5, in preferences.yml.
Getter: func (a *App) GetRecentFiles() []string { return a.state.GetPrefs().RecentFiles }.
5. Progress Reporting (Task 8)
Narrative
What It Covers: This section specifies the backend progress reporting system (Task 8)—throttled updates from mock data to StatusBar, ensuring no performance hit.
Considerations: We designed a 250ms throttle (Step 8.1) to avoid "bouncing," debating intervals (250ms stuck—fast enough, not too frequent). The mock CSV (Step 8.2) went from vague to 5000 txs with 4 fields, balancing realism and testability. StatusBar (Step 8.3) evolved from static to event-driven, and the test (Step 8.4) set a 1s cap—tight but fair for 5000 records. We skipped error recovery (deferred to implementation).
Final Thoughts: This is a tight, practical system—throttled, testable, and frontend-ready. Code details lock in the how, leaving room to tweak intervals or fields tomorrow.
Details
Reporter:
go

Collapse

Wrap

Copy
func (a *App) startProgressReporter() {
    a.progressChan = make(chan Progress, 100)
    go func() {
        ticker := time.NewTicker(250 * time.Millisecond)
        defer ticker.Stop()
        var latest Progress
        for {
            select {
            case p := <-a.progressChan:
                latest = p
            case <-ticker.C:
                if latest.Records > 0 {
                    runtime.EventsEmit(a.ctx, "progress", latest)
                    latest = Progress{}
                }
            }
        }
    }()
}
Mock: testdata/mock_database.csv—5000 txs, 4 fields (tx_id, address, amount, timestamp).
StatusBar:
tsx

Collapse

Wrap

Copy
useEffect(() => {
    EventsOn('progress', (data: Progress) => setProgress(data));
}, []);
Test: <1s for 5000 records, throttled updates.
6. Keyboard Navigation (Task 9)
Narrative
What It Covers: This section maps out keyboard navigation—current state, standards, focus, and table/editing needs (Task 9)—to make Data usable.
Considerations: We detailed your six hotkeys (Step 9.1), matched them to standards (Step 9.2, e.g., Ctrl+S), and untangled focus (Steps 9.3-9.4)—Wails pauses when lost, React needs table refs. Table nav (Step 9.5) added Arrow, Page, Home/End, and Enter (Step 9.6) settled on inline editing with client-first validation—debating view vs. confirm options. Step 9.7 tied it into recommendations, balancing prototype needs with future scalability.
Final Thoughts: This is your keyboard roadmap—global hotkeys stay, table nav and Enter editing are next. It’s detailed with code and UX logic, primed for tomorrow’s comb-through to add or refine (e.g., Tab).
Details
Current: mod+1-4, mod+h/m, global via react-hotkeys-hook.
Table: Arrow Up/Down, Page Up/Down, Home/End—needs Data.tsx focus.
Enter: Inline edit—Enter toggles edit, save/cancel.
Validation: Client-side (e.g., numeric), backend sync.
7. Next Steps
Narrative
What It Covers: A quick look at what’s done, skipped, and pending—our roadmap forward.
Considerations: Tasks 1-5 and 7-9 are “done” (some implemented), Task 6 skipped (state vs. file format—too early), Task 10 delayed (multi-window—future). We debated FileNew (bonus vs. formal) and table nav (implement now or later)—settling on a complete spec with clear next steps.
Final Thoughts: This sets you up—implement table nav, revisit skipped tasks, or extend State. It’s a detailed launchpad for tomorrow’s review.
Details
Done: Data strategy (Tasks 4-5), file ops (Task 7), progress reporting (Task 8), keyboard analysis (Task 9).
Skipped: AppState vs. file format (Task 6)—revisit later.
Pending: Full table nav/editing in Data.tsx, FileNew as a formal step.
This is now very detailed—narratives add our journey, code and specifics give teeth. Ready for your comb tomorrow—let me know if you want more tonight!
