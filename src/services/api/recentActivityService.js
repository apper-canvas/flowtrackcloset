const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'recent_activity_c';

export const recentActivityService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "activityType_c" } },
          { field: { Name: "userId_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "client_c" } },
          { field: { Name: "project_c" } },
          { field: { Name: "task_c" } },
          { field: { Name: "invoice_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "timestamp_c", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 10,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching recent activities:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent activities:", error?.response?.data?.message);
      } else {
        console.error("Error fetching recent activities:", error.message);
      }
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "activityType_c" } },
          { field: { Name: "userId_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "client_c" } },
          { field: { Name: "project_c" } },
          { field: { Name: "task_c" } },
          { field: { Name: "invoice_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching activity with ID ${id}:`, response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching activity with ID ${id}:`, error.message);
      }
      return null;
    }
  },

  create: async (activityData) => {
    try {
      const params = {
        records: [{
          Name: activityData.name || `Activity-${Date.now()}`,
          activityType_c: activityData.activityType,
          userId_c: parseInt(activityData.userId),
          timestamp_c: activityData.timestamp || new Date().toISOString(),
          client_c: activityData.clientId ? parseInt(activityData.clientId) : null,
          project_c: activityData.projectId ? parseInt(activityData.projectId) : null,
          task_c: activityData.taskId ? parseInt(activityData.taskId) : null,
          invoice_c: activityData.invoiceId ? parseInt(activityData.invoiceId) : null,
          Tags: activityData.tags || ""
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error creating activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating activity:", error?.response?.data?.message);
      } else {
        console.error("Error creating activity:", error.message);
      }
      throw error;
    }
  },

  update: async (id, activityData) => {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          activityType_c: activityData.activityType,
          userId_c: parseInt(activityData.userId),
          timestamp_c: activityData.timestamp,
          client_c: activityData.clientId ? parseInt(activityData.clientId) : null,
          project_c: activityData.projectId ? parseInt(activityData.projectId) : null,
          task_c: activityData.taskId ? parseInt(activityData.taskId) : null,
          invoice_c: activityData.invoiceId ? parseInt(activityData.invoiceId) : null,
          Tags: activityData.tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error updating activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update activity ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating activity:", error?.response?.data?.message);
      } else {
        console.error("Error updating activity:", error.message);
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
        console.error("Error deleting activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete activity ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message);
      } else {
        console.error("Error deleting activity:", error.message);
      }
      throw error;
    }
  }
};