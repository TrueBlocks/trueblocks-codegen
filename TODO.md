# To Do List

| Num | Task                                           | Step                                                                  | Status |
| --- | ---------------------------------------------- | --------------------------------------------------------------------- | ------ |
| 1   | Dynamic Help Window Header and Collapsed State | Extract route location logic to generate headers (e.g., "Home View")  | Done   |
|     |                                                | Remove headers from .md files                                         | Done   |
|     |                                                | Implement vertical text display for collapsed state                   | Done   |
| 2   | Evaluate Terminology for Toggleable Bars       | List pros/cons of "collapse," "expand," and 2-3 other terms           | Done   |
|     |                                                | Select and justify the best term                                      | Done   |
|     |                                                | Update codebase with the chosen term (including ToggleChevron rename) | Done   |
| 3   | Enhance and Rename ToggleChevron               | Research standard chevron styles for a simple, clean design           | Done   |
|     |                                                | Update ToggleChevron styling to match MenuBar icons (Fa*)             | Done   |
|     |                                                | Propose 3-5 new names for ToggleChevron based on its purpose          | Done   |
|     |                                                | Apply the chosen name across the codebase (we chose ToggleButton)     | Done   |
| 4   | Discuss Data Strategy                          | Document past data management pitfalls (e.g., useEffect, refreshing)  |        |
|     |                                                | Discuss concurrency in the backend (e.g., async ops, consistency)     |        |
|     |                                                | Summarize findings and recommendations                                |        |
| 5   | Discuss React AppContext for Data Mgmt         | Research best practices for AppContext in React apps                  |        |
|     |                                                | Evaluate ViewContext for localized data management                    |        |
|     |                                                | Summarize pros/cons and best practice recommendations                 |        |
| 6   | Design Backend Data Strategy                   | Define backend data ownership and periodic update logic               |        |
|     |                                                | Limit frontend to one page of data with backend aggregation           |        |
|     |                                                | Discuss TrueBlocks SDK streaming contexts integration                 |        |
|     |                                                | Document the proposed backend data strategy                           |        |
| 7   | Evaluate App State vs. File Format             | Compare AppState to file format for equivalence                       |        |
|     |                                                | Decide placement of Transactional Histories (file vs. cache)          |        |
|     |                                                | Document conclusions and rationale                                    |        |
| 8   | Introduce App State with File-Like Ops         | Define AppState struct with window, view, prefs, and toggle states    |        |
|     |                                                | Implement File Save to serialize AppState to a file                   |        |
|     |                                                | Implement File Open to deserialize and restore AppState               |        |
|     |                                                | Implement File Save As functionality                                  |        |
|     |                                                | Add Recent File List storage and display logic                        |        |
| 9   | Backend Progress Reporting in StatusBar        | Design a throttled progress reporting mechanism for the backend       |        |
|     |                                                | Create a mock CSV database (~5000 records) in test folders            |        |
|     |                                                | Update StatusBar to display throttled progress updates                |        |
|     |                                                | Test performance with mock data to ensure no slowdown                 |        |
| 10  | Improve Keyboard Navigation                    | Document table navigation needs (e.g., arrow keys, Home/End)          |        |
|     |                                                | Discuss "Enter" behavior and editing/validation options               |        |
|     |                                                | Summarize keyboard navigation recommendations                         |        |
| 11  | Leverage Wails 3.0 for Multi-Window Apps       | Research Wails 3.0 multi-window API and capabilities                  |        |
|     |                                                | Propose 2-3 use cases for multiple windows (e.g., settings, help)     |        |
|     |                                                | Outline a plan to implement multi-window support                      |
