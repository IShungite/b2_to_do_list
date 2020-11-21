import {
  createTask,
  deleteTask,
  getTasks,
  setTaskIsCompleted,
  getList,
  createList,
} from "./api.js";

let ourTasks = [];

const TASKS = {
  LOADING: "tasks-loading",
  LIST: "tasks-list",
  EMPTY: "tasks-empty",
  NEW: "tasks-new",
};

const managePanelVisibility = (panelId, visiblePanelId) => {
  const panel = document.getElementById(panelId);
  if (panelId === visiblePanelId) {
    panel.classList.remove("uk-hidden");
  } else {
    panel.classList.add("uk-hidden");
  }
};

const showPanel = (panelId) => {
  for(let key in TASKS) {
    managePanelVisibility(TASKS[key], panelId);
  }
  if (panelId === TASKS.LOADING || panelId === TASKS.NEW) {
    document.getElementById("task-new").classList.add("uk-hidden");
  } else {
    document.getElementById("task-new").classList.remove("uk-hidden");
  }
};

const checkboxChanged = (isChecked, taskId) => {
  setTaskIsCompleted(taskId, isChecked)
    .then((result) => {
      const newTaskState = result.data;
      for (let i = 0; i < ourTasks.length; i++) {
        if (ourTasks[i].id === taskId) {
          ourTasks[i] = newTaskState;
          break;
        }
      }
      refreshOrder();
    })
    .catch((err) => {
      console.error(
        "Something went wrong when setting task is completed",
        err
      );
      alert("Une erreur est survenue sur le serveur");
      refreshOrder();
    });
};

const deleteButtonClicked = (taskId) => {
  console.log("Delete task", taskId);
  deleteTask(taskId)
    .then(() => {
      const newOurTasks = [];
      ourTasks.forEach(task => {
        if(task.id !== taskId) {
          newOurTasks.push(task);
        }
      });
      ourTasks = newOurTasks;
      refreshOrder();
    })
    .catch((err) => {
      console.error("Something went wrong when deleting task", err);
      alert("Une erreur est survenue sur le serveur");
    });
};

const renderTask = (task) => {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox_${task.id}`;
  checkbox.checked = task.isCompleted;
  li.appendChild(checkbox);
  const title = document.createElement("label");
  title.innerText = task.title;
  title.setAttribute("for", `checkbox_${task.id}`);
  title.style.textDecoration = task.isCompleted ? "line-through" : "";
  li.appendChild(title);
  checkbox.addEventListener("change", (evt) =>
    checkboxChanged(evt.target.checked, task.id)
  );
  const deleteButton = document.createElement("a");
  deleteButton.href = "#";
  deleteButton.setAttribute("uk-icon", "trash");
  deleteButton.addEventListener("click", () =>
    deleteButtonClicked(task.id, li)
  );
  li.appendChild(deleteButton);
  document.getElementById("tasks").appendChild(li);
};

const refreshOrder = () => {
  document.getElementById("tasks").innerText = "";
  const tasks = ourTasks.sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) {
      return 1;
    } else {
      return -1;
    }
  });
  tasks.forEach((task) => renderTask(task));
};

const addTask = () => {
  const title = document.getElementById("task-title").value;
  const color = document.getElementById("task-color").value;
  if(!title || !color) {
    alert("Veuillez compléter tous les champs");
    return false;
  } else if (color.length !== 6) {
    alert("La couleur doit contenir 6 caractères. Ex: E63946");
    return false;
  }
  
  // const list = {title:"Titre de la liste", color:color};
  // createList(list).then((result) => {
  //   console.debug(result);
  // }).catch((err) => {
  //   alert("Impossible de créer la liste !");
  //   console.error("Could not create list!", err);
  // });

  getList().then((lists) => {
    console.log("allList:")
    console.log(lists);
    const newList = lists[0];
    console.log("new list:")
    console.log(newList);

    const task = {
      title: title,
      list: newList,
    };

  createTask(task)
    .then((result) => {
      const newTask = result.data;
      ourTasks.push(newTask);
      refreshOrder();
      showPanel("tasks-list");
    })
    .catch((err) => {
      alert("Impossible de créer la tâche !");
      console.error("Could not create task!", err);
    });
  });
};

export const initTasks = () => {
  showPanel(TASKS.LOADING);
  getTasks().then((tasks) => {
    ourTasks = tasks;
    console.debug("ourTasks:");
    console.debug(ourTasks);
    console.debug("list")
    getList().then((lists) => {
      console.log(lists)
    });
    refreshOrder();
    if (tasks.length > 0) {
      showPanel(TASKS.LIST);
    } else {
      showPanel(TASKS.EMPTY);
    }
    document
      .getElementById("task-new")
      .addEventListener("click", () => showPanel(TASKS.NEW));
    document
      .getElementById("task-add")
      .addEventListener("click", addTask);
  });
};
