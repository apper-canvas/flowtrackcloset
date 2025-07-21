import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";
import { clientService } from "@/services/api/clientService";

const ProjectGrid = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [projectsData, clientsData] = await Promise.all([
        projectService.getAll(),
        clientService.getAll()
      ]);
      
      setProjects(projectsData);
      setClients(clientsData);
    } catch (err) {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.Id === clientId);
    return client ? client.name : "Unknown Client";
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "info";
      case "Planning":
        return "warning";
      default:
        return "secondary";
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClientName(project.clientId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (projects.length === 0) {
    return (
      <Empty 
        title="No projects yet"
        description="Create your first project to start tracking progress and deliverables."
        actionText="Create Project"
        onAction={() => console.log("Create project clicked")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
        <div className="w-full sm:w-auto">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search projects..."
            className="sm:w-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card variant="glass" className="p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Client: {getClientName(project.clientId)}
                  </p>
                </div>
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(project.startDate), "MMM dd")} - {format(new Date(project.endDate), "MMM dd, yyyy")}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <ApperIcon name="DollarSign" className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-gradient">
                    ${project.budget.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="text-primary-600 hover:text-primary-700 p-1 rounded">
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded">
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-700 p-1 rounded">
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                  <span>
                    {Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && searchTerm && (
        <Empty 
          title="No projects found"
          description={`No projects match "${searchTerm}". Try adjusting your search.`}
          actionText="Clear Search"
          onAction={() => setSearchTerm("")}
        />
      )}
    </div>
  );
};

export default ProjectGrid;