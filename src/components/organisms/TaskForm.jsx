import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";

const TaskForm = ({ task, projects = [], projectId = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: projectId || "",
    priority: "Medium",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    status: "Pending"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
    if (task) {
      setFormData({
        title: task.title_c || task.Name || "",
        description: task.description || "",
        projectId: task.projectId_c?.Id || task.projectId_c || projectId || "",
        priority: task.priority_c || "Medium",
        dueDate: task.dueDate_c ? format(new Date(task.dueDate_c), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        status: task.status_c || "Pending"
      });
    }
  }, [task, projectId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        projectId: parseInt(formData.projectId),
        dueDate: new Date(formData.dueDate).toISOString()
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title" required>
          Task Title
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter task title"
          error={errors.title}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">
          Description
        </Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter task description (optional)"
          rows={3}
          className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-surface-800 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
        />
      </div>

      {!projectId && (
        <div>
          <Label htmlFor="projectId" required>
            Project
          </Label>
          <select
            id="projectId"
            value={formData.projectId}
            onChange={(e) => handleChange("projectId", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-surface-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
<option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.Id} value={project.Id}>
                {project.Name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="text-sm text-red-600 mt-1">{errors.projectId}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">
            Priority Level
          </Label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-surface-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <Label htmlFor="dueDate" required>
            Due Date
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            error={errors.dueDate}
          />
          {errors.dueDate && (
            <p className="text-sm text-red-600 mt-1">{errors.dueDate}</p>
          )}
        </div>
      </div>

      {task && (
        <div>
<Label htmlFor="status">
            Status
          </Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-surface-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;