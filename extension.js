const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

let tasks = [];
const tasksFilePath = path.join(__dirname, "tasks.json");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "waitList" is now active!');

  // 加载任务列表
  loadTasks();

  const taskProvider = new TaskProvider();
  vscode.window.registerTreeDataProvider("waitListView", taskProvider);

  let createTaskCommand = vscode.commands.registerCommand(
    "waitList.createTask",
    async function () {
      const taskDescription = await vscode.window.showInputBox({
        prompt: "Enter task description",
      });
      if (!taskDescription) return;

      const taskPriority = await vscode.window.showInputBox({
        prompt: "Enter task priority (e.g., low, medium, high)",
      });

      let taskDueDate;
      do {
        taskDueDate = await vscode.window.showInputBox({
          prompt: "Enter task due date (YYYY-MM-DD)",
        });

        if (!isValidDate(taskDueDate)) {
          vscode.window.showErrorMessage(
            "Invalid date format. Please enter a valid date (YYYY-MM-DD)."
          );
        }
      } while (!isValidDate(taskDueDate));

      tasks.push({
        description: taskDescription,
        completed: false,
        priority: taskPriority,
        dueDate: taskDueDate,
      });
      saveTasks();
      taskProvider.refresh();
      vscode.window.showInformationMessage(
        `Task "${taskDescription}" created!`
      );
    }
  );

  let showTasksCommand = vscode.commands.registerCommand(
    "waitList.showTasks",
    function () {
      let taskList = tasks
        .map(
          (task, index) =>
            `${index + 1}. ${task.description} [${
              task.completed ? "x" : " "
            }] - Priority: ${task.priority}, Due: ${task.dueDate}`
        )
        .join("\n");
      vscode.window.showInformationMessage(taskList || "No tasks available.");
    }
  );

  let editTaskCommand = vscode.commands.registerCommand(
    "waitList.editTask",
    async function () {
      const taskNumber = await vscode.window.showInputBox({
        prompt: "Enter task number to edit",
      });
      let index = parseInt(taskNumber) - 1;
      if (index < 0 || index >= tasks.length) {
        vscode.window.showErrorMessage("Invalid task number");
        return;
      }

      const newDescription = await vscode.window.showInputBox({
        prompt: "Enter new task description",
        value: tasks[index].description,
      });
      const newPriority = await vscode.window.showInputBox({
        prompt: "Enter new task priority",
        value: tasks[index].priority,
      });

      let newDueDate;
      do {
        newDueDate = await vscode.window.showInputBox({
          prompt: "Enter new task due date",
          value: tasks[index].dueDate,
        });

        if (!isValidDate(newDueDate)) {
          vscode.window.showErrorMessage(
            "Invalid date format. Please enter a valid date (YYYY-MM-DD)."
          );
        }
      } while (!isValidDate(newDueDate));

      tasks[index].description = newDescription || tasks[index].description;
      tasks[index].priority = newPriority || tasks[index].priority;
      tasks[index].dueDate = newDueDate || tasks[index].dueDate;

      saveTasks();
      taskProvider.refresh();
      vscode.window.showInformationMessage(`Task ${taskNumber} updated!`);
    }
  );

  let deleteTaskCommand = vscode.commands.registerCommand(
    "waitList.deleteTask",
    async function () {
      const taskNumber = await vscode.window.showInputBox({
        prompt: "Enter task number to delete",
      });
      let index = parseInt(taskNumber) - 1;
      if (index < 0 || index >= tasks.length) {
        vscode.window.showErrorMessage("Invalid task number");
        return;
      }

      tasks.splice(index, 1);
      saveTasks();
      taskProvider.refresh();
      vscode.window.showInformationMessage(`Task ${taskNumber} deleted!`);
    }
  );

  let toggleTaskCompletionCommand = vscode.commands.registerCommand(
    "waitList.toggleTaskCompletion",
    async function () {
      const taskNumber = await vscode.window.showInputBox({
        prompt: "Enter task number to toggle completion",
      });
      let index = parseInt(taskNumber) - 1;
      if (index < 0 || index >= tasks.length) {
        vscode.window.showErrorMessage("Invalid task number");
        return;
      }

      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      taskProvider.refresh();
      vscode.window.showInformationMessage(
        `Task ${taskNumber} marked as ${
          tasks[index].completed ? "completed" : "incomplete"
        }!`
      );
    }
  );

  let sortTasksCommand = vscode.commands.registerCommand(
    "waitList.sortTasks",
    async function () {
      const sortBy = await vscode.window.showQuickPick(
        ["priority", "due date"],
        { placeHolder: "Sort tasks by" }
      );
      if (sortBy === "priority") {
        tasks.sort((a, b) => (a.priority > b.priority ? 1 : -1));
      } else if (sortBy === "due date") {
        tasks.sort((a, b) =>
          new Date(a.dueDate) > new Date(b.dueDate) ? 1 : -1
        );
      }
      saveTasks();
      taskProvider.refresh();
      vscode.window.showInformationMessage("Tasks sorted!");
    }
  );

  let searchTasksCommand = vscode.commands.registerCommand(
    "waitList.searchTasks",
    async function () {
      const searchTerm = await vscode.window.showInputBox({
        prompt: "Enter search term",
      });
      if (!searchTerm) return;

      let searchResults = tasks.filter((task) =>
        task.description.includes(searchTerm)
      );
      let searchResultsList = searchResults
        .map(
          (task, index) =>
            `${index + 1}. ${task.description} [${
              task.completed ? "x" : " "
            }] - Priority: ${task.priority}, Due: ${task.dueDate}`
        )
        .join("\n");
      vscode.window.showInformationMessage(
        searchResultsList || "No matching tasks found."
      );
    }
  );

  // 定时检查任务截止日期并提醒用户
  setInterval(() => {
    const now = new Date();
    tasks.forEach((task) => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const oneDay = 24 * 60 * 60 * 1000;
        if (timeDiff > 0 && timeDiff < oneDay) {
          vscode.window.showWarningMessage(
            `Task "${task.description}" is due soon!`
          );
        }
      }
    });
  }, 60 * 60 * 1000); // 每小时检查一次

  context.subscriptions.push(
    createTaskCommand,
    showTasksCommand,
    editTaskCommand,
    deleteTaskCommand,
    toggleTaskCompletionCommand,
    sortTasksCommand,
    searchTasksCommand
  );
}

function deactivate() {}

// 加载任务列表
function loadTasks() {
  if (fs.existsSync(tasksFilePath)) {
    const data = fs.readFileSync(tasksFilePath, "utf8");
    tasks = JSON.parse(data);
  }
}

// 保存任务列表
function saveTasks() {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

// 验证日期格式
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;
  const date = new Date(dateString);
  const timestamp = date.getTime();
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) return false;
  return dateString === date.toISOString().split("T")[0];
}

class TaskProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren() {
    return tasks.map((task, index) => {
      return new TaskItem(
        `${index + 1}. ${task.description} [${
          task.completed ? "x" : " "
        }] - Priority: ${task.priority}, Due: ${task.dueDate}`
      );
    });
  }
}

class TaskItem extends vscode.TreeItem {
  constructor(label) {
    super(label);
    this.contextValue = "taskItem";
  }
}

module.exports = {
  activate,
  deactivate,
};
