import invoicesData from "@/services/mockData/invoices.json";

let invoices = [...invoicesData];

export const invoiceService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 320));
    return [...invoices];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const invoice = invoices.find(i => i.Id === parseInt(id));
    return invoice ? { ...invoice } : null;
  },

  getByProjectId: async (projectId) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return invoices.filter(i => i.projectId === parseInt(projectId)).map(i => ({ ...i }));
  },

  create: async (invoiceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...invoices.map(i => i.Id)) + 1;
    const currentYear = new Date().getFullYear();
    const invoiceCount = invoices.filter(i => i.invoiceNumber.includes(currentYear)).length + 1;
    
    const newInvoice = {
      Id: newId,
      ...invoiceData,
      invoiceNumber: `INV-${currentYear}-${invoiceCount.toString().padStart(3, "0")}`,
      status: "Draft"
    };
    invoices.push(newInvoice);
    return { ...newInvoice };
  },

  update: async (id, invoiceData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = invoices.findIndex(i => i.Id === parseInt(id));
    if (index !== -1) {
      invoices[index] = { ...invoices[index], ...invoiceData };
      return { ...invoices[index] };
    }
    return null;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = invoices.findIndex(i => i.Id === parseInt(id));
    if (index !== -1) {
      const deleted = invoices.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
};