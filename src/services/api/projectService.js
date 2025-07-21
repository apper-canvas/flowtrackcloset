const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'project_c';

export const projectService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "startDate_c" } },
          { field: { Name: "endDate_c" } },
          { field: { Name: "budget_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "clientId_c" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching projects:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
      } else {
        console.error("Error fetching projects:", error.message);
      }
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "startDate_c" } },
          { field: { Name: "endDate_c" } },
          { field: { Name: "budget_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "clientId_c" } },
          { field: { Name: "Tags" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(`Error fetching project with ID ${id}:`, response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching project with ID ${id}:`, error.message);
      }
      return null;
    }
  },

  getByClientId: async (clientId) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "startDate_c" } },
          { field: { Name: "endDate_c" } },
          { field: { Name: "budget_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "clientId_c" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "clientId_c",
            Operator: "EqualTo",
            Values: [parseInt(clientId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching projects by client ID:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects by client ID:", error?.response?.data?.message);
      } else {
        console.error("Error fetching projects by client ID:", error.message);
      }
      return [];
    }
  },

  create: async (projectData) => {
    try {
      const params = {
        records: [{
          Name: projectData.name,
          description_c: projectData.description,
          status_c: projectData.status,
          startDate_c: projectData.startDate,
          endDate_c: projectData.endDate,
          budget_c: projectData.budget,
          clientId_c: parseInt(projectData.clientId),
          Tags: projectData.tags || ""
        }]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error creating project:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create project ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating project:", error?.response?.data?.message);
      } else {
        console.error("Error creating project:", error.message);
      }
      throw error;
    }
  },

  update: async (id, projectData) => {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: projectData.name,
          description_c: projectData.description,
          status_c: projectData.status,
          startDate_c: projectData.startDate,
          endDate_c: projectData.endDate,
          budget_c: projectData.budget,
          clientId_c: parseInt(projectData.clientId),
          Tags: projectData.tags || ""
        }]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error updating project:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update project ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating project:", error?.response?.data?.message);
      } else {
        console.error("Error updating project:", error.message);
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
        console.error("Error deleting project:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete project ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error("Error deleting project:", error.message);
      }
      throw error;
    }
  }
};