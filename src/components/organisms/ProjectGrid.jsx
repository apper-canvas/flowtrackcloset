import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Projects from "@/components/pages/Projects";
import SearchBar from "@/components/molecules/SearchBar";
import ProjectForm from "@/components/molecules/ProjectForm";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { clientService } from "@/services/api/clientService";
import { projectService } from "@/services/api/projectService";
const ProjectGrid = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
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

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      setShowProjectModal(false);
      toast.success("Project created successfully!");
      loadData(); // Refresh to ensure data consistency
    } catch (error) {
      toast.error("Failed to create project. Please try again.");
    }
};

  const handleEditProject = async (projectData) => {
    try {
      const updatedProject = await projectService.update(editingProject.Id, projectData);
      setProjects(prev => prev.map(p => p.Id === editingProject.Id ? updatedProject : p));
      setEditingProject(null);
      setShowProjectModal(false);
      toast.success("Project updated successfully!");
    } catch (error) {
      toast.error("Failed to update project. Please try again.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await projectService.delete(projectId);
        setProjects(prev => prev.filter(p => p.Id !== projectId));
        toast.success("Project deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete project. Please try again.");
      }
    }
  };

  const handleViewProject = (project) => {
    navigate(`/projects/${project.Id}`);
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

const getClientName = (clientId) => {
    const client = clients.find(c => c.Id === (clientId?.Id || clientId));
    return client ? client.Name : "Unknown Client";
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
    project.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClientName(project.clientId_c).toLowerCase().includes(searchTerm.toLowerCase())
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
        onAction={() => setShowProjectModal(true)}
      />
    );
  }

return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button
            variant="primary"
            onClick={() => setShowProjectModal(true)}
            className="sm:w-auto"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Project
          </Button>
          <div className="w-full sm:w-auto">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search projects..."
              className="sm:w-80"
            />
          </div>
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
                     {project.Name}
                   </h3>
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     Client: {getClientName(project.clientId_c)}
                   </p>
                 </div>
                 <Badge variant={getStatusVariant(project.status_c)}>
                   {project.status_c}
                 </Badge>
               </div>

<div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                  <span>
                    {format(new Date(project.startDate_c), "MMM dd")} - {format(new Date(project.endDate_c), "MMM dd, yyyy")}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                   <ApperIcon name="DollarSign" className="w-4 h-4 mr-2" />
                   <span className="font-semibold text-gradient">
${project.budget_c?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleViewProject(project)}
                    className="text-primary-600 hover:text-primary-700 p-1 rounded transition-colors"
                    title="View Details"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleEditClick(project)}
                    className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded transition-colors"
                    title="Edit Project"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.Id)}
                    className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                    title="Delete Project"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
                
<div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                  <span>
                    {Math.ceil((new Date(project.endDate_c) - new Date()) / (1000 * 60 * 60 * 24))} days left
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

<Modal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        title={editingProject ? "Edit Project" : "Create New Project"}
        size="lg"
      >
        <ProjectForm
          project={editingProject}
          clients={clients}
          onSubmit={editingProject ? handleEditProject : handleCreateProject}
          onCancel={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ProjectGrid;