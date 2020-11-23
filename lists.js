import { deleteList, getLists, postList, patchList } from "./api.js";

let ourLists = [];
let ourlistId = "";

const showPanel = (panelId) => {
  // Hide all panels
  const panels = document.getElementsByClassName("panel");
  for (let i = 0; i < panels.length; i++) {
    panels[i].setAttribute("hidden", "true");
  }
  // Show the panel with panelId
  document.getElementById(panelId).removeAttribute("hidden");
  if (panelId === "lists-loading" || panelId === "lists-new" || panelId === "lists-edit") {
    document
      .getElementById("list-new-link")
      .setAttribute("hidden", "true");
  } else {
    document
      .getElementById("list-new-link")
      .removeAttribute("hidden");
  }
};

const deleteButtonClicked = (listId) => {
  deleteList(listId)
    .then(() => {
      // Delete list from ourLists
      ourLists = ourLists.filter((list) => list.id !== listId);
      buildList(ourLists);
    })
    .catch((err) => {
      console.error("Something happened when deleting a list", err);
      alert("Une erreur est survenue côté serveur");
    });
};

const createList = (list, ul) => {
  const li = document.createElement("li");
  li.className = "list-li";
  const link = document.createElement("a");
  link.innerText = list.title;
  link.href = `#tasks/${list.id}`;
  link.className = "list-tasks-link";
  li.appendChild(link);
  const deleteButton = document.createElement("a");
  deleteButton.setAttribute("uk-icon", "trash");
  deleteButton.addEventListener("click", () =>
    deleteButtonClicked(list.id)
  );
  li.appendChild(deleteButton);

  li.style.border = `1px solid #${list.color}`;

  const editButton = document.createElement("a");
  editButton.setAttribute("uk-icon", "pencil");
  editButton.addEventListener("click", () => editButtonClicked(list));
  li.appendChild(editButton);

  ul.appendChild(li);
};

const editButtonClicked = (list) => {
  ourlistId = list.id;
  document.getElementById("list-edit-title").value = list.title;
  document.getElementById("list-edit-color").value = `#${list.color}`;
  showPanel("lists-edit");
};

const buildList = (lists) => {
  if (lists.length === 0) {
    showPanel("lists-empty");
  } else {
    // Build the list
    const ul = document.getElementById("lists-ul");
    ul.innerText = "";
    lists.forEach((list) => createList(list, ul));
    showPanel("lists-list");
  }
};

const addNewList = () => {
  const listData = getlistData();

  // Create list
  postList(listData)
    .then((list) => {
      // Update ourLists
      ourLists.push(list);
      buildList(ourLists);
      showPanel("lists-list");
      document.getElementById("list-new-title").value = "";
    })
    .catch((err) => {
      console.error("Could not create list", err);
      alert("Une erreur est survenue côté serveur");
    });
};
const editList = () => {
  const listData = getlistData();

  // Edit list
  patchList(listData, ourlistId)
    .then(() => {
      // Update ourLists
      refreshAllLists();
      showPanel("lists-list");
      document.getElementById("list-new-title").value = "";
    })
    .catch((err) => {
      console.error("Could not create list", err);
      alert("Une erreur est survenue côté serveur");
    });
};

const getlistData = () => {
  const title = document.getElementById("list-edit-title").value;
  const color = document.getElementById("list-edit-color").value.substr(1);

  return {
    title: title,
    color: color,
  };
};

export const refreshAllLists = () => {
  showPanel("lists-loading");
  getLists().then((lists) => {
    ourLists = lists;
    buildList(lists);
  });
};

const initLists = () => {
  document
    .getElementById("list-new-link")
    .addEventListener("click", () => showPanel("lists-new"));
  document
    .getElementById("list-new-button")
    .addEventListener("click", addNewList);
  document
    .getElementById("list-new-cancel")
    .addEventListener("click", () => showPanel("lists-list"));
  document
    .getElementById("list-edit-button")
    .addEventListener("click", editList);
  document
    .getElementById("list-edit-cancel")
    .addEventListener("click", () => showPanel("lists-list"));
};

export default initLists;
