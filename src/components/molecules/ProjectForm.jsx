import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";

const ProjectForm = ({ project, clients = [], onSubmit, onCancel, loading: externalLoading = false }) => {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    clientId: project?.clientId || "",
    status: project?.status || "planning",
    startDate: project?.startDate ? project.startDate.split('T')[0] : "",
    endDate: project?.endDate ? project.endDate.split('T')[0] : "",
    budget: project?.budget || ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: "planning", label: "Planning" },
    { value: "active", label: "Active" },
    { value: "on-hold", label: "On Hold" },
    { value: "completed", label: "Completed" }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.clientId) {
      newErrors.clientId = "Client selection is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!formData.budget || formData.budget <= 0) {
      newErrors.budget = "Budget must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      clientId: parseInt(formData.clientId),
      budget: parseFloat(formData.budget),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString()
    };

    onSubmit(submissionData);
  };

  const isLoading = loading || externalLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" required>
          Project Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter project name"
          error={!!errors.name}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description" required>
          Description
        </Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter project description"
          disabled={isLoading}
          rows={3}
          className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-surface-800 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 dark:placeholder:text-gray-500 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="clientId" required>
          Client
        </Label>
        <select
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleInputChange}
          disabled={isLoading}
          className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-surface-800 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 dark:hover:border-gray-500"
        >
          <option value="">Select a client</option>
          {clients.map(client => (
            <option key={client.Id} value={client.Id}>
              {client.name} - {client.company}
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.clientId}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="status" required>
          Status
        </Label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          disabled={isLoading}
          className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-surface-800 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 dark:hover:border-gray-500"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" required>
            Start Date
          </Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            error={!!errors.startDate}
            disabled={isLoading}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.startDate}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="endDate" required>
            End Date
          </Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            error={!!errors.endDate}
            disabled={isLoading}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.endDate}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="budget" required>
          Budget ($)
        </Label>
        <Input
          id="budget"
          name="budget"
          type="number"
          min="0"
          step="0.01"
          value={formData.budget}
          onChange={handleInputChange}
          placeholder="Enter project budget"
          error={!!errors.budget}
          disabled={isLoading}
        />
        {errors.budget && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.budget}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading 
            ? (project ? "Updating..." : "Creating...") 
            : (project ? "Update Project" : "Create Project")
          }
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;