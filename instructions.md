# Project Requirements

## General Project Setup

- **Type of Project:**
  - Desktop app using **Wails**
  - Frontend: **React**, **Mantine UI**, **TypeScript**
  - Backend: **GoLang**

- **Repository:**
  - Existing GitHub repository at:
    ```
    ~/Development/trueblocks-codeGen
    ```
  - Currently contains only `.git`.

- **Package Management:**
  - Use **Yarn exclusively** (never npm).

- **Root Directory Yarn Commands:**
  - `yarn lint`:
    - Runs React linting via ESLint (TypeScript aware, ESLint v9 compatible).
    - Runs Go linting via golangci-lint.
    - Explicitly prints `✅ No issues found.` after linting passes.
  - `yarn dev`:
    - Runs `wails dev` with a debounce of `100ms`.
    - Captures both `stdout` and `stderr`.
    - Filters out any line containing `AssetHandler`.
    - Outputs simultaneously to terminal and a `run.log` file.
  - `yarn build`:
    - Runs `wails build`.

## React Frontend Requirements

- **Technologies & Libraries:**
  - React with TypeScript
  - Mantine UI
  - Mantine's built-in CSS-in-JS and theme system exclusively for styling.

- **UI Component Structure:**
  - Header
  - Footer
  - Left Sidebar (extensible Menu)
  - Right Sidebar (Help)

- **Styling Approach:**
  - Use Mantine's theme system (`MantineProvider`) for global and component-level styles.
  - Avoid separate CSS files unless for essential global resets.

- **Linting & Formatting:**
  - ESLint v9 (`eslint.config.js`)
  - Prettier integrated with ESLint
  - Ignored linting for `wailsjs/*`

- **Auto-formatting on Save:**
  - Automatically format:
    - TypeScript (`.ts`, `.tsx`)
    - JavaScript (`.js`, `.jsx`)
    - TOML (`.toml`)
    - YAML (`.yaml`, `.yml`)

- **Frontend Formatting Configuration (`.prettierrc`):**
  ```json
  {
    "singleQuote": true,
    "semi": true,
    "tabWidth": 2
  }
  ```

## GoLang Backend Requirements

- **Linting & Formatting:**
  - `golangci-lint` with existing customized `.golangci.yml`.
  - Go formatted via standard `gofmt`.

- **Auto-formatting on Save:**
  - Automatically format:
    - Go (`.go`)
    - TOML (`.toml`)
    - YAML (`.yaml`, `.yml`)

- **Backend Formatting Configuration:**
  - Standard Go formatting (`gofmt` defaults):
    - Tabs for indentation.

- **Code Structure:**
  - Explicit and clear directory layout (`services`, `handlers`, `utils`, etc.).

## Application Build & Distribution Requirements

- Generate a downloadable Mac installer (DMG or similar).

## Testing & Continuous Integration Requirements

- Robust Testing Environment:
  - Frontend (React/Mantine/TypeScript).
  - Backend (GoLang unit/integration tests).
  - No mocks unless explicitly requested.

- Continuous Integration (CI):
  - Run linting checks automatically.
  - Execute tests automatically on commits/PRs.
  - Verify build process automatically.
  - Optionally, publish Mac installer automatically.

## Additional Project Requirements

- **Internationalization (i18n):**
  - Default English language.
  - Extendable via additional language files.

- **Documentation:**
  - Detailed setup instructions.
  - Clear guides for adding components/features.
  - Preferred tooling explicitly chosen later.

- **Extensible Menu System:**
  - Easily configurable/extendable menu structure.

## Workflow & Interaction Requirements

- **Step-by-step Development:**
  - Tasks managed via ToDo list (always shown on request "show me the list").
  - Tasks completed sequentially.
  - No jumping ahead without explicit consent.

- **ToDo List Format:**
  ```
  | #   | Task                             | Status     |
  | --- | -------------------------------- | ---------- |
  | 1   | Example Task                     | Incomplete |
  | 2   | ~~Completed Task (crossed out)~~ | ~~Done~~   |
  ```
  - Explicit confirmation ("Done") before moving forward.

- **Minimal Commentary:**
  - Concise explanations.
  - No comments included in provided code or test examples.
