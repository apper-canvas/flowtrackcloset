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
import { taskService } from "@/services/api/taskService";
import { projectService } from "@/services/api/projectService";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    return project ? project.name : "Unknown Project";
  };

  const getStatusVariant = (status) => {
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

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "High":
        return "danger";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "secondary";
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getProjectName(task.projectId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (tasks.length === 0) {
    return (
      <Empty 
        title="No tasks yet"
        description="Break down your projects into manageable tasks to track progress."
        actionText="Create Task"
        onAction={() => console.log("Create task clicked")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search tasks..."
            className="sm:w-80"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-surface-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <Card variant="glass" className="overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-surface-700/30 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        task.status === "Completed" 
                          ? "bg-green-500 border-green-500" 
                          : "border-gray-300 dark:border-gray-600"
                      }`}>
                        {task.status === "Completed" && (
                          <ApperIcon name="Check" className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-medium ${
                        task.status === "Completed" 
                          ? "line-through text-gray-500 dark:text-gray-400" 
                          : "text-gray-900 dark:text-white"
                      }`}>
                        {task.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Project: {getProjectName(task.projectId)}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <Badge variant={getStatusVariant(task.status)}>
                          {task.status}
                        </Badge>
                        
                        <Badge variant={getPriorityVariant(task.priority)}>
                          {task.priority} Priority
                        </Badge>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                          <span>Due {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
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
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {filteredTasks.length === 0 && (searchTerm || filterStatus !== "all") && (
        <Empty 
          title="No tasks found"
          description="No tasks match your current filters. Try adjusting your search or filter criteria."
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm("");
            setFilterStatus("all");
          }}
        />
      )}
    </div>
  );
};

export default TaskList;