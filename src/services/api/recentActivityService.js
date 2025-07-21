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
          { field: { Name: "invoice_c" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent activities:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getById: async (recordId) => {
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
          { field: { Name: "invoice_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, recordId, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching recent activity with ID ${recordId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (records) => {
    try {
      const params = {
        records: Array.isArray(records) ? records : [records]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} recent activity records:${JSON.stringify(failedRecords)}`);
        }
        
        return successfulRecords.map(result => result.data);
      }
      
      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating recent activity records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  update: async (records) => {
    try {
      const params = {
        records: Array.isArray(records) ? records : [records]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} recent activity records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.map(result => result.data);
      }
      
      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating recent activity records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  delete: async (recordIds) => {
    try {
      const params = {
        RecordIds: Array.isArray(recordIds) ? recordIds : [recordIds]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} recent activity records:${JSON.stringify(failedDeletions)}`);
        }
        
        return successfulDeletions.length === params.RecordIds.length;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting recent activity records:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
return false;
    }
  }
};