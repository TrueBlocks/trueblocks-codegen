## 1. Form View

Purpose: Enable users to input and edit structured data (e.g., settings, registration) with a robust, interactive, and secure interface, showcasing advanced form handling for the TrueBlocks platform.

### Features

- Data Loading: Fetches initial values from the backend using `GetPreference` or a new API, populating a reusable `Form` component built with Mantine primitives.
  - Rationale: Backend-driven data ensures consistency with app state, while a reusable component promotes modularity.
- Navigation:
  - Keyboard: Tab navigates between fields; Shift+Tab reverses.
  - Optional: “Next”/“Previous” buttons or a multi-step wizard for complex forms.
  - Rationale: Keyboard support enhances accessibility and efficiency; optional wizard accommodates multi-page forms like registration.
- Per-Field Help: Displays tooltips or help icons next to fields, optionally linking to `HelpBar` or providing inline descriptions.
  - Rationale: Contextual help improves usability, especially for complex forms, without cluttering the UI.
- Validation:
  - Real-time, field-level validation (e.g., email regex, required fields) with visual feedback (red borders, error messages below fields).
  - Required fields marked with an asterisk (*).
  - Constraints checked (e.g., numeric ranges, string lengths).
  - Rationale: Immediate feedback at the field level guides users effectively, aligning with modern UX standards.
- Security: Sanitizes inputs to prevent injection attacks (e.g., strip scripts); ensures secure transmission to the backend.
  - Rationale: Essential for a production-ready app, protecting both users and the system.
- Persistence: Saves changes via `SetPreference` or a new method, with a traditional prompt dialog (“Save,” “Discard,” “Cancel”) for unsaved changes before navigation.
  - Rationale: Desktop-style prompts fit the app’s Wails-based paradigm, giving users explicit control over saving.
- UI Components: Builds a reusable `Form` component (`frontend/src/components/ui/Form.tsx`) using Mantine components (e.g., `TextInput`, `Checkbox`, `Select`, `Textarea`).
  - Rationale: Mantine provides a consistent, polished look; reusability reduces duplication across views.
- Dynamic Fields: Supports adding/removing items (e.g., list of emails), with backend updates for array data.
  - Rationale: Flexibility accommodates varied use cases, enhancing the component’s utility.
- Reset to Defaults: Includes an optional “Reset to Defaults” button in `Form`, disabled by default, enabled where defaults are defined (e.g., settings).
  - Rationale: Offers a safety net for reverting changes, with opt-in flexibility for different forms.

### Implementation Goal

- Create one full-featured example (`FullForm.tsx`) using `Form.tsx`, showcasing (even if mocked): grouping (e.g., `Fieldset`), shadow text (placeholders), validation, scrollable inputs (e.g., `Textarea`), dropdowns (`Select`), checkboxes, radio buttons, and other Mantine options.
  - Rationale: A comprehensive example demonstrates the platform’s form capabilities, inspiring developers with a feature-rich template.

---

## 3. Table View

Purpose: Display and manage tabular data with extensive interactivity, keyboard control, and customization, providing a powerful data exploration tool for the TrueBlocks platform.

### Features

- Data Display:
  - Renders a grid with sortable columns (click header to toggle ascending/descending).
  - Supports filtering (e.g., text search, column-specific dropdowns).
  - Rationale: Sorting and filtering are core table functionalities, enabling users to organize and find data efficiently.
- Inline Editing:
  - Editable cells update inline (click or double-click to enter edit mode).
  - Tab cycles through editable fields in a row, looping to the first field after the last.
  - Validation matches Form View (real-time, field-level).
  - Commits changes to the backend on Enter or blur.
  - Rationale: Inline editing streamlines data updates, with Tab cycling enhancing keyboard usability.
- Navigation and Interaction:
  - Row navigation: Up/Down arrows highlight next/previous row; Home to first row; End to last row; Page Up/Down for previous/next page.
  - Edit mode: Enter starts editing (if enabled); arrow keys move between fields only during editing.
  - Selection: Single row with click; multiple rows with Shift/Ctrl.
  - Rationale: Spreadsheet-like navigation ensures intuitive control, especially for keyboard-centric users.
- Links: Cells can include hyperlinks to other views or modals for detailed editing.
  - Rationale: Links extend functionality, connecting table data to related actions or views.
- Features:
  - Pagination: Fetches one page at a time (e.g., 10-50 rows).
  - Column customization: Resize (drag handles), reorder (drag columns), show/hide via config.
  - Export: CSV and JSON download options.
  - Context Menus: Right-click menus with Mantine `Menu` (e.g., “Edit,” “Delete,” “Copy”).
  - Conditional Formatting: Color-codes cells based on values (e.g., red for negatives).
  - Rationale: These features make the table versatile and user-friendly, with context menus adding polish.
- Data Sourcing: Fetches all data from the backend (e.g., new API `GetTablePage(tableName, page, size)`), one page at a time, leveraging Wails’ speed (no frontend cache).
  - Rationale: Backend-driven data ensures consistency and scalability, with pagination optimizing performance.
- Field Types: Supports diverse types in a reusable `Table` component (`frontend/src/components/ui/Table.tsx`): “boolean” (checkbox), “integer,” “float,” “string,” “color” (picker), “Ether,” “Wei,” “Hash,” “Address” (formatted), “editButton,” “deleteButton,” “undeleteButton” (actions), with more TBD.
  - Rationale: Custom types showcase blockchain-specific features and interactivity, enhancing the template’s appeal.
- Table Definition: Uses inline JSON (e.g., `{ columns: [{ name, type, editable }], pageSize }`) to define structure, with potential file-based switch later.
  - Rationale: Inline JSON is simple to start with, offering flexibility for future expansion.
- Performance: Optimizes rendering for large datasets (e.g., TanStack Table’s virtualization).
  - Rationale: Ensures scalability, critical for a data-heavy app.
- Technology: Builds `Table.tsx` with TanStack Table for headless logic (sorting, filtering, pagination), styled with Mantine.
  - Rationale: TanStack Table provides robust features out of the box, saving time while Mantine maintains UI consistency.

### Implementation Goals

- Create one full-featured example (`FullTable.tsx`) using `Table.tsx`, showcasing sorting, filtering, inline editing, keyboard navigation, context menus, and diverse field types.
  - Rationale: A rich example highlights the platform’s data management capabilities, serving as a powerful template.

---

## Reasoning Summary

- Modularity: Reusable `Form` and `Table` components separate concerns, making the codebase extensible and maintainable—key for a platform template.
- Consistency: Mantine’s theme and components ensure a unified look, while TanStack Table adds advanced table functionality without reinventing the wheel.
- Usability: Keyboard navigation, validation, and navigation features (e.g., Breadcrumbs) prioritize user experience, aligning with desktop app conventions where appropriate.
- Showcase Focus: Full-featured examples with diverse options (e.g., bold text, dynamic fields, custom types) demonstrate the platform’s potential, inspiring developers.
