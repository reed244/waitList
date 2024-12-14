# waitList README

`waitList` is a VSCode extension for managing daily to-do tasks. It allows users to create, edit, delete, mark tasks as completed or incomplete, and provides task sorting, searching, and reminder functions.

## Features

- **Create Task**: Allows users to create new to-do tasks, including description, priority, and due date.
- **Display Tasks**: Displays all to-do tasks in the sidebar.
- **Edit Task**: Allows users to edit the description, priority, and due date of existing tasks.
- **Delete Task**: Allows users to delete existing tasks.
- **Mark Task as Completed/Incomplete**: Allows users to mark tasks as completed or incomplete.
- **Sort Tasks**: Sorts tasks by priority or due date.
- **Search Tasks**: Quickly searches for specific tasks.
- **Task Reminders**: Reminds users when the task due date is approaching.
- **Sidebar View**: Integrates a view in the sidebar for displaying and managing to-do tasks.
- **Shortcuts**: Sets shortcuts for common operations to improve efficiency.

## Dependencies

- VSCode version 1.60.0 and above

## Installation

1. Open VSCode.
2. Go to the Extensions view (press `Ctrl+Shift+X`).
3. Search for `waitList` and click Install.

## Usage

1. Open the command palette (press `Ctrl+Shift+P`).
2. Enter and select one of the following commands:
   - `waitList.createTask`: Create Task
   - `waitList.showTasks`: Display Tasks
   - `waitList.editTask`: Edit Task
   - `waitList.deleteTask`: Delete Task
   - `waitList.toggleTaskCompletion`: Mark Task as Completed/Incomplete
   - `waitList.sortTasks`: Sort Tasks
   - `waitList.searchTasks`: Search Tasks

## Shortcuts

- `Ctrl+Alt+C`: Create Task
- `Ctrl+Alt+S`: Display Tasks
- `Ctrl+Alt+E`: Edit Task
- `Ctrl+Alt+D`: Delete Task
- `Ctrl+Alt+T`: Mark Task as Completed/Incomplete
- `Ctrl+Alt+O`: Sort Tasks
- `Ctrl+Alt+F`: Search Tasks

## Development Process

1. Use `yo code` to generate a new VSCode extension project.
2. Define commands and views in `package.json`.
3. Implement task creation, editing, deletion, marking as completed/incomplete, sorting, searching, and reminder functions in `extension.js`.
4. Use VSCode's TreeView API to integrate a view in the sidebar.
5. Use VSCode's notification API to implement task reminder functionality.
6. Use JSON files to persist task records.

## Possible Future Additions

- **Task Sync**: Sync tasks across multiple devices.
- **Task Tags**: Add tags to tasks for better classification and management.
- **Task Export/Import**: Allow users to export and import task lists.
- **Task Statistics**: Provide statistics on task completion.
- **Custom Reminders**: Allow users to set custom reminder times.

## Contribution

If you have any suggestions or find any issues, please submit an issue or pull request.

## License

MIT License
