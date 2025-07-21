import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

export const taskService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tasks];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = tasks.find(t => t.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  getByProjectId: async (projectId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return tasks.filter(t => t.projectId === parseInt(projectId)).map(t => ({ ...t }));
  },

create: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...tasks.map(t => t.Id)) + 1;
    const newTask = {
      Id: newId,
      ...taskData,
      status: taskData.status || "Pending"
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  update: async (id, taskData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      return { ...tasks[index] };
    }
    return null;
  },

  updateStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      tasks[index] = { ...tasks[index], status };
      return { ...tasks[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      const deleted = tasks.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};