const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'app_invoice_c';

export const invoiceService = {
  getAll: async () => {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "projectId_c" } },
{ field: { Name: "invoiceNumber_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "paymentDate_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "dueDate_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching invoices:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching invoices:", error?.response?.data?.message);
      } else {
        console.error("Error fetching invoices:", error.message);
      }
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
{ field: { Name: "projectId_c" } },
          { field: { Name: "invoiceNumber_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "paymentDate_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching invoice with ID ${id}:`, response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching invoice with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching invoice with ID ${id}:`, error.message);
      }
      return null;
    }
  },

  getByProjectId: async (projectId) => {
    try {
      const params = {
fields: [
          { field: { Name: "Name" } },
{ field: { Name: "projectId_c" } },
          { field: { Name: "invoiceNumber_c" } },
          { field: { Name: "amount_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "dueDate_c" } },
          { field: { Name: "paymentDate_c" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "projectId_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching invoices by project ID:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching invoices by project ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching invoices by project ID:", error.message);
      }
      return [];
    }
  },

  create: async (invoiceData) => {
    try {
      const currentYear = new Date().getFullYear();
      const invoiceNumber = `INV-${currentYear}-${Date.now().toString().slice(-6)}`;
      
const params = {
records: [{
          Name: invoiceNumber,
          projectId_c: parseInt(invoiceData.projectId),
          invoiceNumber_c: invoiceNumber,
          amount_c: invoiceData.amount,
          status_c: "Draft",
          dueDate_c: invoiceData.dueDate,
          Tags: invoiceData.tags || ""
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error creating invoice:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create invoice ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating invoice:", error?.response?.data?.message);
      } else {
        console.error("Error creating invoice:", error.message);
      }
      throw error;
    }
  },

update: async (id, invoiceData) => {
    try {
const params = {
records: [{
          Id: parseInt(id),
          projectId_c: parseInt(invoiceData.projectId),
          amount_c: invoiceData.amount,
          status_c: invoiceData.status,
          dueDate_c: invoiceData.dueDate,
          Tags: invoiceData.tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error updating invoice:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update invoice ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating invoice:", error?.response?.data?.message);
      } else {
        console.error("Error updating invoice:", error.message);
      }
      throw error;
    }
  },

  updateStatus: async (id, statusData) => {
    try {
      const updateRecord = {
        Id: parseInt(id),
        status_c: statusData.status
      };
      
      if (statusData.paymentDate) {
        updateRecord.paymentDate_c = statusData.paymentDate;
      }
      
      const params = {
        records: [updateRecord]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error updating invoice status:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update invoice status ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating invoice status:", error?.response?.data?.message);
      } else {
        console.error("Error updating invoice status:", error.message);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error deleting invoice:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete invoice ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting invoice:", error?.response?.data?.message);
      } else {
        console.error("Error deleting invoice:", error.message);
      }
      throw error;
    }
  }
};