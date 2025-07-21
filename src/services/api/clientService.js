import clientsData from "@/services/mockData/clients.json";

let clients = [...clientsData];

export const clientService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...clients];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const client = clients.find(c => c.Id === parseInt(id));
    return client ? { ...client } : null;
  },

  create: async (clientData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...clients.map(c => c.Id)) + 1;
    const newClient = {
      Id: newId,
      ...clientData,
      createdAt: new Date().toISOString()
    };
    clients.push(newClient);
    return { ...newClient };
  },

  update: async (id, clientData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = clients.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      clients[index] = { ...clients[index], ...clientData };
      return { ...clients[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = clients.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      const deleted = clients.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};