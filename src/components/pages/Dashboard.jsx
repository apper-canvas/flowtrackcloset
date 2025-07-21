import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import ProjectForm from "@/components/molecules/ProjectForm";
import ClientForm from "@/components/molecules/ClientForm";
import TaskForm from "@/components/organisms/TaskForm";
import InvoiceForm from "@/components/molecules/InvoiceForm";
import DashboardStats from "@/components/organisms/DashboardStats";
import clientService from "@/services/api/clientService";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";
import invoiceService from "@/services/api/invoiceService";
import { toast } from "react-toastify";
const Dashboard = ({ onNewProject }) => {
  const navigate = useNavigate();
  const [showClientModal, setShowClientModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

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
      action: onNewProject
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

  const recentActivity = [
    {
      id: 1,
      type: "project",
      title: "E-commerce Platform Redesign",
      description: "Status updated to In Progress",
      time: "2 hours ago",
      icon: "FolderOpen"
    },
    {
      id: 2,
      type: "task",
      title: "Frontend Development",
      description: "Task completed by team",
      time: "4 hours ago",
      icon: "CheckSquare"
    },
    {
      id: 3,
      type: "invoice",
      title: "Invoice INV-2024-002",
      description: "Sent to TechStartup Inc",
      time: "1 day ago",
      icon: "FileText"
    },
    {
      id: 4,
      type: "client",
      title: "Lisa Thompson",
      description: "New client added",
      time: "2 days ago",
      icon: "UserPlus"
    }
  ];

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
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-700/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={activity.icon} className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
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
    </div>
  );
};

export default Dashboard;