import {
  deleteTask,
  getTasks,
  postTask,
  setTaskIsCompleted,
  patchTask,
} from "./api.js";

let ourTasks = [];
let ourListId = "";
let ourTaskId = "";

const showPanel = (panelId) => {
  // Hide all panels
  const panels = document.getElementsByClassName("panel");
  for (let i = 0; i < panels.length; i++) {
    panels[i].setAttribute("hidden", "true");
  }
  // Show the panel with panelId
  document.getElementById(panelId).removeAttribute("hidden");
  if (panelId === "tasks-loading" || panelId === "tasks-new" || panelId === "tasks-edit") {
    document
      .getElementById("task-new-link")
      .setAttribute("hidden", "true");
  } else {
    document
      .getElementById("task-new-link")
      .removeAttribute("hidden");
  }
};

const setTaskCompletion = (taskId, isChecked) => {
  setTaskIsCompleted(taskId, isChecked)
    .then((newTaskState) => {
      // Replace task in ourTasks by its new state
      for (let i = 0; i < ourTasks.length; i++) {
        if (ourTasks[i].id === taskId) {
          ourTasks[i] = newTaskState;
          break;
        }
      }
      buildList(ourTasks);
    })
    .catch((err) => {
      console.error(
        "Something happened when setting task completion",
        err
      );
      alert("Une erreur est survenue côté serveur");
      buildList(ourTasks);
    });
};

const deleteButtonClicked = (taskId) => {
  deleteTask(taskId)
    .then(() => {
      // Delete task from ourTasks
      ourTasks = ourTasks.filter((task) => task.id !== taskId);
      buildList(ourTasks);
    })
    .catch((err) => {
      console.error("Something happened when deleting a task", err);
      alert("Une erreur est survenue côté serveur");
    });
};

const createTask = (task, ul) => {
  const li = document.createElement("li");
  li.className = "task-li";
  const checkbox = document.createElement("input");
  checkbox.id = `checkbox_${task.id}`;
  checkbox.type = "checkbox";
  checkbox.checked = task.isCompleted;
  checkbox.addEventListener("change", (evt) =>
    setTaskCompletion(task.id, evt.target.checked)
  );
  li.appendChild(checkbox);
  const title = document.createElement("label");
  title.setAttribute("for", `checkbox_${task.id}`);
  title.innerText = task.title;
  if (task.isCompleted) {
    title.className = "striked";
  }
  li.appendChild(title);
  const details = document.createElement("label");
  details.innerText = task.details;
  li.appendChild(details);
  const due = document.createElement("label");
  const dueDate = new Date(task.due)
  due.innerText = dueDate.toLocaleString();
  li.appendChild(due);
  if (new Date().getTime() > dueDate.getTime())
  {
    li.style.border= "1px solid red";
  } else {
    li.style.border= "1px solid green";

  }
  const deleteButton = document.createElement("a");
  deleteButton.setAttribute("uk-icon", "trash");
  deleteButton.addEventListener("click", () =>
    deleteButtonClicked(task.id)
  );
  li.appendChild(deleteButton);
  const editButton = document.createElement("a");
  editButton.setAttribute("uk-icon", "pencil");
  editButton.addEventListener("click", () => editButtonClicked(task));
  li.appendChild(editButton);
  ul.appendChild(li);
};

const editButtonClicked = (task) => {
  showPanel("tasks-edit");
  document.getElementById("task-edit-title").value = task.title;
  document.getElementById("task-edit-details").value = task.details;
  document.getElementById("task-edit-due").valueAsNumber = new Date(task.due);
  ourTaskId = task.id;
};

const buildList = (tasks) => {
  if (tasks.length === 0) {
    showPanel("tasks-empty");
  } else {
    // Build the list
    const ul = document.getElementById("tasks-ul");
    ul.innerText = "";
    tasks.forEach((task) => createTask(task, ul));
    showPanel("tasks-list");
  }
};

const addNewTask = () => {
  const title = document.getElementById("task-new-title").value;
  const details = document.getElementById("task-new-details").value;
  const due = document.getElementById("task-new-due").value;


  const taskData ={
    title: title,
    details: details,
    due: new Date(due).toISOString()
  }

  // Create task
  postTask(taskData, ourListId)
    .then((task) => {
      // Update ourTasks
      ourTasks.push(task);
      buildList(ourTasks);
      showPanel("tasks-list");
      document.getElementById("task-new-title").value = "";
    })
    .catch((err) => {
      console.error("Could not create task", err);
      alert("Une erreur est survenue côté serveur");
    });
};
const editTask = () => {
  const title = document.getElementById("task-edit-title").value;
  const details = document.getElementById("task-edit-details").value;
  const due = document.getElementById("task-edit-due").value;

  const taskData = {
    id: ourTaskId,
    title: title,
    details: details,
    due: new Date(due).toISOString()
  }

  // Create task
  patchTask(taskData, ourListId)
    .then(() => {
      // Update ourTasks
      refreshAllTasks(ourListId);
      showPanel("tasks-list");
      document.getElementById("task-new-title").value = "";
    })
    .catch((err) => {
      console.error("Could not create task", err);
      alert("Une erreur est survenue côté serveur");
    });
};

export const refreshAllTasks = (listId) => {
  showPanel("tasks-loading");
  ourListId = listId;
  getTasks(listId).then((tasks) => {
    ourTasks = tasks;
    buildList(tasks);
  });
};

const initTasks = () => {
  document
    .getElementById("task-new-link")
    .addEventListener("click", () => showPanel("tasks-new"));
  document
    .getElementById("task-new-button")
    .addEventListener("click", addNewTask);
  document
    .getElementById("task-cancel")
    .addEventListener("click", () => showPanel("tasks-list"));
  document
    .getElementById("task-edit-button")
    .addEventListener("click", editTask);
};

export default initTasks;
