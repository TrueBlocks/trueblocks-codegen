TrueBlocks CodeGen Requirements Document (Slightly Outdated)

Overview
This document outlines the high-level requirements for enhancing the TrueBlocks CodeGen desktop application built with Wails and React. The focus is on improving UI components, data management, application state, and leveraging modern frameworks like Wails 3.0, while addressing lessons learned from previous iterations.

Requirements

1. Enhance and Rename ToggleChevron Component
Description: Improve the visual design of the ToggleChevron component to match a standard, unremarkable style (e.g., simple, clean, and consistent with common UI patterns).
Details:
Ensure the chevron uses the same icon set as the existing MenuBar icons (e.g., react-icons/fa such as FaHome, FaCog) for visual consistency.
Rename ToggleChevron to a more descriptive or intuitive name that reflects its purpose (e.g., toggling visibility of bars).

2. Dynamic Help Window Header and Collapsed State
Description: Dynamically generate the help page header in the HelpBar component and adjust its collapsed state display.
Details:
Use the current route’s location (e.g., "home", "settings", "data") to create headers like "Home View", "Settings View", "Data View", etc., removing headers from .md files.
When collapsed, display the same text (e.g., "Home View") rotated 90 degrees (vertical text) in the help bar.

3. Evaluate Terminology for Toggleable Bars
Description: Identify and standardize a better term than "open" for toggleable bars.
Details:
Determine a more intuitive term (e.g., "collapse," "expand") by consulting the AI.
Apply the chosen term consistently across the codebase (e.g., variable names, props, UI).
Rename ToggleChevron as it seems a misnomer, aligning the new name with the selected terminology.

4. Discuss Data Strategy (No Implementation)
Description: Explore potential data management strategies without implementing changes, prioritizing a robust approach.
Details:
Focus on avoiding past pitfalls from three previous app versions:
Overuse/misuse of useEffect causing complexity or performance issues.
Poor performance from inefficient data fetching/rendering.
Challenges with refreshing data without overwhelming the app.
Include "Concurrency in the backend" as a key topic, examining simultaneous operations, data consistency, and updates.
Aim to prevent data management from becoming a bottleneck or failure point.

5. Introduce App State with File-Like Operations
Description: Define an "App State" concept where the application state mirrors a file saved to the hard drive.
Details:
Include comprehensive details in the "App State":
Window states (e.g., position, size).
Current views (e.g., last viewed route/screen).
User preferences (e.g., from Preferences struct).
Toggle states (e.g., menu/help bar visibility).
Support operations:
File Save: Save the current app state to a file with all elements.
File Open: Load an app state from a file, restoring the application fully.
File Save As: Save the current app state to a new file.
Recent File List: Maintain/display a list of recently opened files.

6. Backend Progress Reporting in StatusBar
Description: Enable backend progress reporting with efficient frontend display.
Details:
Report progress (e.g., initialization, processing ~5000 records in 0.5 seconds) to the StatusBar in real-time.
Implement throttled/batched reporting to avoid excessive updates ("bouncing") that degrade performance.
Develop a mock CSV database in test folders to simulate a large dataset for testing progress reporting and performance.

7. Improve Keyboard Navigation
Description: Enhance keyboard accessibility, focusing on discussion for now.
Details:
Ensure all interactive elements are keyboard-operable, emphasizing table-based data:
Down Arrow/Up Arrow for row movement.
Page Up/Page Down for larger jumps.
Home to first record; End to last record.
Discuss "Enter" key behavior (e.g., new view, edit record) and editing/validation implications.
Keep as a high-level discussion without implementation.

8. Discuss React AppContext for Data Management
Description: Explore using React Context for data propagation, seeking best practices.
Details:
Use AppContext to propagate data to descendant components.
Consider ViewContext to localize data at the view level, complementing AppContext.
Discuss:
Structuring/updating context data.
Performance (e.g., avoiding unnecessary re-renders).
Maintainability/scalability.
Seek advice on industry-standard best practices.

9. Design Backend Data Strategy
Description: Define a backend-centric data strategy with frontend limitations.
Details:
Backend owns/maintains all data, keeping it fresh with periodic updates.
Frontend displays only one page/screen of data at a time.
Most/all aggregation occurs in the backend.
Discuss the TrueBlocks SDK, focusing on streaming contexts and their integration.

10. Evaluate App State vs. File Format
Description: Determine the relationship between application state and file format.
Details:
Decide if the app state is exactly equivalent to the file format.
Assess whether elements like Transactional Histories belong in the file or a cache.

11. Leverage Wails 3.0 for Multi-Window Applications
Description: Utilize Wails 3.0’s multi-window capabilities to enhance the app.
Details:
Support creating/managing multiple independent windows (e.g., main interface, settings, help, auxiliary views) within one instance.
Explore how multi-window functionality improves user experience.

End of Document
Feel free to copy and paste this into your backup. Let me know when you’re ready to proceed with building the ToDo list!
