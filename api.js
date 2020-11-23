const crudfulConfig = {
  headers: {
    cfAccessKey: "41ba3af3de735376992091782edd844578fec330",
  },
};

export const getTasks = (listId) =>
  axios
    .get(`https://todo.crudful.com/tasks?listId=${listId}`, crudfulConfig)
    .then((result) => result.data.results);

export const setTaskIsCompleted = (taskId, isCompleted) =>
  axios
    .patch(
      `https://todo.crudful.com/tasks/${taskId}`,
      {
        isCompleted: isCompleted,
      },
      crudfulConfig
    )
    .then((result) => result.data);

export const deleteTask = (taskId) =>
  axios.delete(
    `https://todo.crudful.com/tasks/${taskId}`,
    crudfulConfig
  );

export const postTask = (title, listId) =>
  axios
    .post(
      "https://todo.crudful.com/tasks",
      { title: title, listId: listId },
      crudfulConfig
    )
    .then((result) => result.data);

export const getLists = () =>
  axios
    .get("https://todo.crudful.com/lists", crudfulConfig)
    .then((result) => result.data.results);

export const deleteList = (listId) =>
  axios.delete(
    `https://todo.crudful.com/lists/${listId}`,
    crudfulConfig
  );

export const postList = (title) =>
  axios
    .post(
      "https://todo.crudful.com/lists",
      { title: title },
      crudfulConfig
    )
    .then((result) => result.data);
