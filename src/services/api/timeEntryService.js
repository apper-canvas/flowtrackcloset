import timeEntriesData from "@/services/mockData/timeEntries.json";

let timeEntries = [...timeEntriesData];

export const timeEntryService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...timeEntries];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const entry = timeEntries.find(t => t.Id === parseInt(id));
    return entry ? { ...entry } : null;
  },

  getByProjectId: async (projectId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return timeEntries.filter(t => t.projectId === parseInt(projectId)).map(t => ({ ...t }));
  },

  getByTaskId: async (taskId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return timeEntries.filter(t => t.taskId === parseInt(taskId)).map(t => ({ ...t }));
  },

  create: async (entryData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...timeEntries.map(t => t.Id)) + 1;
    const newEntry = {
      Id: newId,
      ...entryData,
      createdAt: new Date().toISOString()
    };
    timeEntries.push(newEntry);
    return { ...newEntry };
  },

  update: async (id, entryData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = timeEntries.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      timeEntries[index] = { ...timeEntries[index], ...entryData };
      return { ...timeEntries[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = timeEntries.findIndex(t => t.Id === parseInt(id));
    if (index !== -1) {
      const deleted = timeEntries.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};