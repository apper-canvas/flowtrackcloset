import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import { clientService } from "@/services/api/clientService";
import { toast } from "react-toastify";

const ClientForm = ({ client, onSubmit, onCancel, loading: externalLoading = false }) => {
  const [formData, setFormData] = useState({
    name: client?.name || "",
    email: client?.email || "",
    company: client?.company || "",
    phone: client?.phone || "",
    notes: client?.notes || ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
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

    try {
      setLoading(true);
      if (client) {
        // Edit mode
        const updatedClient = await clientService.update(client.Id, formData);
        toast.success("Client updated successfully!");
        onSubmit(updatedClient);
      } else {
        // Create mode
        const newClient = await clientService.create(formData);
        toast.success("Client created successfully!");
        onSubmit(newClient);
      }
    } catch (error) {
      toast.error(`Failed to ${client ? 'update' : 'create'} client. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || externalLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" required>
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter client's full name"
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
        <Label htmlFor="email" required>
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter email address"
          error={!!errors.email}
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="company" required>
          Company
        </Label>
        <Input
          id="company"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleInputChange}
          placeholder="Enter company name"
          error={!!errors.company}
          disabled={isLoading}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.company}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
          disabled={isLoading}
        />
      </div>

      <div>
        <Label htmlFor="notes">
          Notes
        </Label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Add any additional notes about this client..."
          disabled={isLoading}
          rows={3}
          className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-surface-800 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 dark:placeholder:text-gray-500 hover:border-gray-300 dark:hover:border-gray-500 resize-none"
        />
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
            ? (client ? "Updating..." : "Creating...") 
            : (client ? "Update Client" : "Create Client")
          }
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;