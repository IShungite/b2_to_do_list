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

export const postTask = (taskData, listId) =>
  axios
    .post(
      "https://todo.crudful.com/tasks",
      { title: taskData.title, details: taskData.details, due: taskData.due, listId: listId },
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

export const postList = (listData) =>
  axios
    .post(
      "https://todo.crudful.com/lists",
      { title: listData.title, color:listData.color },
      crudfulConfig
    )
    .then((result) => result.data);
