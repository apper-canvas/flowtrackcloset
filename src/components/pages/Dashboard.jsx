import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { recentActivityService } from "@/services/api/recentActivityService";
import ApperIcon from "@/components/ApperIcon";
import DashboardStats from "@/components/organisms/DashboardStats";
import TaskForm from "@/components/organisms/TaskForm";
import ClientForm from "@/components/molecules/ClientForm";
import ProjectForm from "@/components/molecules/ProjectForm";
import InvoiceForm from "@/components/molecules/InvoiceForm";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import { taskService } from "@/services/api/taskService";
import { invoiceService } from "@/services/api/invoiceService";
import { clientService } from "@/services/api/clientService";
import { projectService } from "@/services/api/projectService";
const Dashboard = () => {
  const navigate = useNavigate();
  const [showClientModal, setShowClientModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);

  const loadRecentActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      const activities = await recentActivityService.getAll();
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading recent activities:', error);
      setActivitiesError('Failed to load recent activities');
      toast.error('Failed to load recent activities');
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const handleOpenClientModal = () => {
    setShowClientModal(true);
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
  };

  const handleClientSubmit = async (clientData) => {
    try {
      setLoading(true);
      await clientService.create(clientData);
      toast.success('Client created successfully!');
      handleCloseClientModal();
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTaskModal = async () => {
    try {
      setLoading(true);
      const [clientsData, projectsData] = await Promise.all([
        clientService.getAll(),
        projectService.getAll()
      ]);
      setClients(clientsData);
      setProjects(projectsData);
      setShowTaskModal(true);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load required data');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setClients([]);
    setProjects([]);
  };

  const handleTaskSubmit = async (taskData) => {
    try {
      setLoading(true);
      await taskService.create(taskData);
      toast.success('Task created successfully!');
      handleCloseTaskModal();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInvoiceModal = async () => {
    try {
      setLoading(true);
      const [clientsData, projectsData] = await Promise.all([
        clientService.getAll(),
        projectService.getAll()
      ]);
      setClients(clientsData);
      setProjects(projectsData);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load required data');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setClients([]);
    setProjects([]);
  };

  const handleInvoiceSubmit = async (invoiceData) => {
    try {
      setLoading(true);
      await invoiceService.create(invoiceData);
      toast.success('Invoice created successfully!');
      handleCloseInvoiceModal();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
setLoading(false);
    }
  };
  const handleOpenProjectModal = async () => {
    try {
      setLoading(true);
      const clientsData = await clientService.getAll();
      setClients(clientsData);
      setShowProjectModal(true);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setClients([]);
  };

  const handleProjectSubmit = async (projectData) => {
    try {
      setLoading(true);
      await projectService.create(projectData);
      toast.success('Project created successfully!');
      handleCloseProjectModal();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "New Client",
      description: "Add a new client to your portfolio",
      icon: "UserPlus",
      color: "primary",
      action: handleOpenClientModal
    },
    {
      title: "Create Project",
      description: "Start a new project for existing clients",
      icon: "FolderPlus",
      color: "info",
      action: handleOpenProjectModal
    },
    {
      title: "Add Task",
      description: "Break down projects into manageable tasks",
      icon: "Plus",
      color: "warning",
      action: handleOpenTaskModal
    },
    {
      title: "Generate Invoice",
      description: "Bill clients for completed work",
      icon: "FileText",
      color: "success",
action: handleOpenInvoiceModal
    }
  ];

  const formatActivityTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const activityDate = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - activityDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    return activityDate.toLocaleDateString();
  };

  const getActivityIcon = (activityType) => {
    switch (activityType?.toLowerCase()) {
      case 'project_created':
      case 'project_updated':
        return 'FolderOpen';
      case 'task_created':
      case 'task_completed':
        return 'CheckSquare';
      case 'invoice_created':
      case 'invoice_sent':
        return 'FileText';
      case 'client_created':
        return 'UserPlus';
      default:
        return 'Activity';
    }
  };

  const getActivityTitle = (activity) => {
    if (activity.project_c?.Name) return activity.project_c.Name;
    if (activity.task_c?.Name) return activity.task_c.Name;
    if (activity.invoice_c?.Name) return activity.invoice_c.Name;
    if (activity.client_c?.Name) return activity.client_c.Name;
    return activity.Name || 'Unknown Activity';
  };

  const getActivityDescription = (activity) => {
    const type = activity.activityType_c || 'Activity performed';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="glass" className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Here's what's happening with your projects today.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
                <p className="text-xl font-semibold text-gradient">
                  {new Date().toLocaleDateString("en-US", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Statistics */}
      <DashboardStats />

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card variant="glass" className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  onClick={action.action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 text-left group"
                >
                  <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                    action.color === "primary" ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600" :
                    action.color === "info" ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600" :
                    action.color === "warning" ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600" :
                    "bg-green-100 dark:bg-green-900/20 text-green-600"
                  }`}>
                    <ApperIcon name={action.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {action.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card variant="glass" className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
Recent Activity
            </h2>
            <div className="space-y-4">
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : activitiesError ? (
                <div className="text-center py-8">
                  <p className="text-sm text-red-600 dark:text-red-400">{activitiesError}</p>
                  <button 
                    onClick={loadRecentActivities}
                    className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  >
                    Try again
                  </button>
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">No recent activities</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-700/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                      <ApperIcon name={getActivityIcon(activity.activityType_c)} className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getActivityTitle(activity)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {getActivityDescription(activity)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatActivityTime(activity.timestamp_c)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
</div>
          </Card>
        </motion.div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showClientModal}
        onClose={handleCloseClientModal}
        title="Create New Client"
        size="lg"
      >
        <ClientForm
          onSubmit={handleClientSubmit}
          onCancel={handleCloseClientModal}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={showTaskModal}
        onClose={handleCloseTaskModal}
        title="Create New Task"
        size="lg"
      >
        <TaskForm
          clients={clients}
          projects={projects}
          onSubmit={handleTaskSubmit}
          onCancel={handleCloseTaskModal}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={showInvoiceModal}
        onClose={handleCloseInvoiceModal}
        title="Generate Invoice"
        size="lg"
      >
        <InvoiceForm
          clients={clients}
          projects={projects}
          onSubmit={handleInvoiceSubmit}
          onCancel={handleCloseInvoiceModal}
loading={loading}
        />
      </Modal>
      <Modal
        isOpen={showProjectModal}
        onClose={handleCloseProjectModal}
        title="Create New Project"
        size="lg"
      >
        <ProjectForm
          clients={clients}
          onSubmit={handleProjectSubmit}
          onCancel={handleCloseProjectModal}
          loading={loading}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;