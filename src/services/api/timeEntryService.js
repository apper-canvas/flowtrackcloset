const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'time_entry_c';

export const timeEntryService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "taskId_c" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "startTime_c" } },
          { field: { Name: "endTime_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "startTime_c", sorttype: "DESC" }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching time entries:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching time entries:", error?.response?.data?.message);
      } else {
        console.error("Error fetching time entries:", error.message);
      }
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "taskId_c" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "startTime_c" } },
          { field: { Name: "endTime_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching time entry with ID ${id}:`, response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching time entry with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching time entry with ID ${id}:`, error.message);
      }
      return null;
    }
  },

  getByProjectId: async (projectId) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "taskId_c" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "startTime_c" } },
          { field: { Name: "endTime_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "createdAt_c" } },
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
        console.error("Error fetching time entries by project ID:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching time entries by project ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching time entries by project ID:", error.message);
      }
      return [];
    }
  },

  getByTaskId: async (taskId) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "taskId_c" } },
          { field: { Name: "projectId_c" } },
          { field: { Name: "startTime_c" } },
          { field: { Name: "endTime_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "taskId_c",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching time entries by task ID:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching time entries by task ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching time entries by task ID:", error.message);
      }
      return [];
    }
  },

  create: async (entryData) => {
    try {
      const params = {
        records: [{
          Name: `Time Entry - ${new Date(entryData.startTime).toLocaleString()}`,
          taskId_c: parseInt(entryData.taskId),
          projectId_c: parseInt(entryData.projectId),
          startTime_c: entryData.startTime,
          endTime_c: entryData.endTime,
          duration_c: entryData.duration,
          Tags: entryData.tags || ""
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error creating time entry:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create time entry ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating time entry:", error?.response?.data?.message);
      } else {
        console.error("Error creating time entry:", error.message);
      }
      throw error;
    }
  },

  update: async (id, entryData) => {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          taskId_c: parseInt(entryData.taskId),
          projectId_c: parseInt(entryData.projectId),
          startTime_c: entryData.startTime,
          endTime_c: entryData.endTime,
          duration_c: entryData.duration,
          Tags: entryData.tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error updating time entry:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update time entry ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating time entry:", error?.response?.data?.message);
      } else {
        console.error("Error updating time entry:", error.message);
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
        console.error("Error deleting time entry:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete time entry ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting time entry:", error?.response?.data?.message);
      } else {
        console.error("Error deleting time entry:", error.message);
      }
      throw error;
    }
  }
};