import {
  createTask,
  deleteTask,
  getTasks,
  setTaskIsCompleted,
  getList,
  createList,
} from "./api.js";

let ourTasks = [];
let ourLists = [];

const CONTAINER = {
  LOADING: "tasks-loading",
  TASKS_LIST: "tasks-list",
  TASKS_EMPTY: "tasks-empty",
  NEW_TASK: "tasks-new",

  LISTS_LIST: "lists-list",
  LISTS_EMPTY: "lists-empty",
  NEW_LIST: "lists-new",
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
  for(let key in CONTAINER) {
    managePanelVisibility(CONTAINER[key], panelId);
  }

  switch (panelId){
    case CONTAINER.LOADING:
    case CONTAINER.NEW_TASK:
    case CONTAINER.NEW_LIST:
      document.getElementById("task-new").classList.add("uk-hidden");
      document.getElementById("list-new").classList.add("uk-hidden");
      break;
    default:
      document.getElementById("task-new").classList.remove("uk-hidden");
      document.getElementById("list-new").classList.remove("uk-hidden");
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
  if(!title) {
    alert("Veuillez compléter tous les champs");
    return false;
  }

  const listName = document.getElementById("task-dropDownList").value;
  let newList = {};
  ourLists.forEach(list => {
    if (list.title===listName)
    {
      newList=list;
    }
  });

  const task = {
    title: title,
    list: newList,
  };

  createTask(task)
    .then((result) => {
      const newTask = result.data;
      ourTasks.push(newTask);
      refreshOrder();
      showPanel(CONTAINER.TASKS_LIST);
    })
    .catch((err) => {
      alert("Impossible de créer la tâche !");
      console.error("Could not create task!", err);
    });
};

const renderList = (list) => {
  const li = document.createElement("li");
  const title = document.createElement("label");
  title.innerText = list.title;
  li.appendChild(title);
  document.getElementById("lists").appendChild(li);
};

const addList = () => {
  const title = document.getElementById("list-title").value;
  const color = document.getElementById("list-color").value;

  if(!title || !color) {
    alert("Veuillez compléter tous les champs");
    return false;
  } else if (color.length !== 6) {
    alert("La couleur doit contenir 6 caractères. Ex: E63946");
    return false;
  }

  const list = {
    title: title,
    color: color
  }

  createList(list).then((result) => {
    ourLists.push(result.data);
    showPanel(CONTAINER.TASKS_EMPTY);
  }).catch((err) => {
    alert("Impossible de créer la liste !");
    console.error("Could not create list!", err);
  });
}

export const initTasks = () => {
  showPanel(CONTAINER.LOADING);
  getTasks().then((tasks) => {
    ourTasks = tasks;
    console.debug("ourTasks:");
    console.debug(ourTasks);
    refreshOrder();
    if (ourTasks.length > 0) {
      showPanel(CONTAINER.TASKS_LIST);
    } else {
      showPanel(CONTAINER.TASKS_EMPTY);
    }
    document
      .getElementById("task-new")
      .addEventListener("click", () => showPanel(CONTAINER.NEW_TASK));
    document
      .getElementById("task-add")
      .addEventListener("click", addTask);

    initLists();
  });
};

const initLists = () => {
  getList().then((lists) => {
    ourLists = lists;
    console.debug("ourLists:");
    console.debug(ourLists);

    if (ourLists.length > 0) {
      document.getElementById(CONTAINER.LISTS_LIST).classList.remove("uk-hidden");
      document.getElementById(CONTAINER.LISTS_EMPTY).classList.add("uk-hidden");
    } else {
      document.getElementById(CONTAINER.LISTS_LIST).classList.add("uk-hidden");
      document.getElementById(CONTAINER.LISTS_EMPTY).classList.remove("uk-hidden");
    }

    ourLists.forEach((list) => renderList(list));

    document
      .getElementById("list-new")
      .addEventListener("click", () => showPanel(CONTAINER.NEW_LIST));

    document
      .getElementById("list-add")
      .addEventListener("click", addList);

    const dropdownlist = document.getElementById("task-dropDownList")
    ourLists.forEach(list => {
        const option = document.createElement("option");
        option.setAttribute("value", list.title);
        option.innerText=list.title;
        dropdownlist.appendChild(option);
      });
  })
}