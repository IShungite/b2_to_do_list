const crudfulConfig = {
  headers: {
    cfAccessKey: "41ba3af3de735376992091782edd844578fec330",
  },
};

export const getTasks = () =>
  axios
    .get("https://todo.crudful.com/tasks", crudfulConfig)
    .then((result) => result.data.results);

export const setTaskIsCompleted = (taskId, isCompleted) =>
  axios.patch(
    `https://todo.crudful.com/tasks/${taskId}`,
    { isCompleted: isCompleted },
    crudfulConfig
  );

export const deleteTask = (taskId) =>
  axios.delete(
    `https://todo.crudful.com/tasks/${taskId}`,
    crudfulConfig
  );

export const createTask = (title) =>
  axios.post(
    "https://todo.crudful.com/tasks",
    { title: title },
    crudfulConfig
  );
