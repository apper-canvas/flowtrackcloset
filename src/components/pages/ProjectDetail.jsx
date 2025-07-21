import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { differenceInDays, format, isAfter, isBefore } from "date-fns";
import { toast } from "react-toastify";
import { KanbanBoard } from "@/components/organisms/TaskList";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Tasks from "@/components/pages/Tasks";
import ProjectForm from "@/components/molecules/ProjectForm";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { taskService } from "@/services/api/taskService";
import { clientService } from "@/services/api/clientService";
import { projectService } from "@/services/api/projectService";
import { timeEntryService } from "@/services/api/timeEntryService";
export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate();
const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError("");

      const projectData = await projectService.getById(parseInt(id));
      
      if (!projectData) {
        setError("Project not found");
        return;
      }

const [clientData, tasksData, timeEntriesData] = await Promise.all([
        clientService.getById(projectData.clientId),
        taskService.getByProjectId(parseInt(id)),
        timeEntryService.getByProjectId(parseInt(id))
      ]);

      setProject(projectData);
      setClient(clientData);
      setTasks(tasksData);
      setTotalTime(calculateTotalTime(timeEntriesData));
    } catch (err) {
      setError("Failed to load project details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async (updatedProject) => {
    try {
      const result = await projectService.update(parseInt(id), updatedProject);
      setProject(result);
      setShowEditModal(false);
      toast.success("Project updated successfully!");
    } catch (error) {
      toast.error("Failed to update project. Please try again.");
    }
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

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getTaskStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "info";
      case "Pending":
        return "warning";
      default:
        return "secondary";
    }
  };

  const calculateProjectProgress = () => {
    if (!project) return { progress: 0, daysLeft: 0, isOverdue: false };
    
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const currentDate = new Date();
    
    const totalDays = differenceInDays(endDate, startDate);
    const daysElapsed = differenceInDays(currentDate, startDate);
    const daysLeft = differenceInDays(endDate, currentDate);
    
    const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
    const isOverdue = isAfter(currentDate, endDate);
    
    return { progress: Math.round(progress), daysLeft, isOverdue };
  };

  const calculateBudgetAnalysis = () => {
    if (!project) return { spent: 0, remaining: 0, percentageSpent: 0 };
    
    // Simulate actual spending based on project progress and tasks
    const completedTasks = tasks.filter(task => task.status === "Completed").length;
    const totalTasks = tasks.length || 1;
    const taskProgress = (completedTasks / totalTasks) * 100;
    
    // Estimate spent amount based on task completion (with some variance)
    const estimatedSpent = (project.budget * taskProgress / 100) * (0.8 + Math.random() * 0.4);
    const spent = Math.min(estimatedSpent, project.budget);
    const remaining = project.budget - spent;
    const percentageSpent = (spent / project.budget) * 100;
    
    return {
      spent: Math.round(spent),
      remaining: Math.round(remaining),
      percentageSpent: Math.round(percentageSpent)
    };
};

  const calculateTotalTime = (timeEntries) => {
    return timeEntries.reduce((total, entry) => total + entry.duration, 0);
  };

  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProjectData} />;
  }

  if (!project) {
    return <Error message="Project not found" />;
  }

  const { progress, daysLeft, isOverdue } = calculateProjectProgress();
  const { spent, remaining, percentageSpent } = calculateBudgetAnalysis();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/projects')}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {client ? `Client: ${client.name}` : "Loading client..."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(project.status)}>
            {project.status}
          </Badge>
          <Button
            variant="primary"
            onClick={() => setShowEditModal(true)}
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
            Edit Project
          </Button>
        </div>
      </div>

{/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Budget
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${project.budget.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progress}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tasks.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {isOverdue ? "Overdue" : "Days Left"}
                </p>
                <p className={`text-2xl font-bold ${isOverdue ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                  {isOverdue ? Math.abs(daysLeft) : daysLeft}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full ${isOverdue ? "bg-red-500" : "bg-orange-500"} flex items-center justify-center`}>
                <ApperIcon name="Clock" className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
</motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatTotalTime(totalTime)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                <ApperIcon name="Clock" className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Project Information & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card variant="glass" className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Project Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </h3>
                <p className="text-gray-900 dark:text-white">
                  {project.description || "No description provided"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Start Date
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {format(new Date(project.startDate), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    End Date
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {format(new Date(project.endDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              {client && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Client
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{client.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{client.company}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card variant="glass" className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Timeline Progress
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(project.startDate), "MMM dd")}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(project.endDate), "MMM dd, yyyy")}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    isOverdue ? "bg-red-500" : "bg-gradient-to-r from-primary-500 to-secondary-500"
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {progress}% Complete
                </span>
                <span className={`font-medium ${isOverdue ? "text-red-500" : "text-green-500"}`}>
                  {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}
                </span>
              </div>
              
              {/* Timeline Milestones */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Key Milestones
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-900 dark:text-white">Project Started</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(project.startDate), "MMM dd")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${progress >= 50 ? "bg-blue-500" : "bg-gray-300"}`}></div>
                    <span className="text-sm text-gray-900 dark:text-white">Mid-point</span>
                    <span className="text-xs text-gray-500">50% Complete</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${progress >= 100 ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <span className="text-sm text-gray-900 dark:text-white">Project Completion</span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(project.endDate), "MMM dd")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Budget Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Budget Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                ${spent.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Spent ({percentageSpent}%)
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                ${remaining.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Remaining ({100 - percentageSpent}%)
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                ${project.budget.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Budget
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div 
                className="h-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                style={{ width: `${percentageSpent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
              <span>$0</span>
              <span>{percentageSpent}% utilized</span>
              <span>${project.budget.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </motion.div>

{/* Project Tasks Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <KanbanBoard projectId={parseInt(id)} />
      </motion.div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
        size="lg"
      >
        <ProjectForm
          project={project}
          clients={client ? [client] : []}
          onSubmit={handleEditProject}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};