import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

export const projectService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...projects];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const project = projects.find(p => p.Id === parseInt(id));
    return project ? { ...project } : null;
  },

  getByClientId: async (clientId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return projects.filter(p => p.clientId === parseInt(clientId)).map(p => ({ ...p }));
  },

  create: async (projectData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...projects.map(p => p.Id)) + 1;
    const newProject = {
      Id: newId,
      ...projectData,
      startDate: new Date().toISOString()
    };
    projects.push(newProject);
    return { ...newProject };
  },

  update: async (id, projectData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      projects[index] = { ...projects[index], ...projectData };
      return { ...projects[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = projects.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      const deleted = projects.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};