import React, { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";

const InvoiceForm = ({ invoice, projects, onSubmit, onCancel, loading }) => {
const [formData, setFormData] = useState({
    projectId: invoice?.projectId_c?.Id || invoice?.projectId_c || "",
    invoiceTitle: invoice?.invoiceTitle_c || "",
    status: invoice?.status_c || "Draft",
    dueDate: invoice?.dueDate_c ? invoice.dueDate_c.split('T')[0] : "",
    lineItems: invoice?.lineItems || [{ description: "", amount: "" }]
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...formData.lineItems];
    updatedLineItems[index] = { ...updatedLineItems[index], [field]: value };
    setFormData(prev => ({ ...prev, lineItems: updatedLineItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: "", amount: "" }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      const updatedLineItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, lineItems: updatedLineItems }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date must be in the future";
      }
    }

    const hasValidLineItems = formData.lineItems.some(item => 
      item.description.trim() && parseFloat(item.amount) > 0
    );

    if (!hasValidLineItems) {
      newErrors.lineItems = "At least one line item with description and amount is required";
    }

    formData.lineItems.forEach((item, index) => {
      if (item.description.trim() && (!item.amount || parseFloat(item.amount) <= 0)) {
        newErrors[`lineItem${index}Amount`] = "Amount must be greater than 0";
      }
      if (parseFloat(item.amount) > 0 && !item.description.trim()) {
        newErrors[`lineItem${index}Description`] = "Description is required when amount is provided";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const validLineItems = formData.lineItems.filter(item => 
      item.description.trim() && parseFloat(item.amount) > 0
    );

    const totalAmount = validLineItems.reduce((sum, item) => sum + parseFloat(item.amount), 0);

const submitData = {
      projectId: parseInt(formData.projectId),
      invoiceTitle: formData.invoiceTitle.trim(),
      status: formData.status,
      dueDate: formData.dueDate,
      amount: totalAmount,
      lineItems: validLineItems.map(item => ({
        description: item.description.trim(),
        amount: parseFloat(item.amount)
      }))
    };

    onSubmit(submitData);
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Tomorrow as minimum
    return format(today, "yyyy-MM-dd");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="projectId">Project *</Label>
          <select
            id="projectId"
            value={formData.projectId}
            onChange={(e) => handleInputChange("projectId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a project</option>
{projects.map(project => (
              <option key={project.Id} value={project.Id}>
                {project.Name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
          )}
</div>

        <div>
          <Label htmlFor="invoiceTitle">Invoice Title</Label>
          <Input
            id="invoiceTitle"
            type="text"
            placeholder="Enter invoice title (optional)"
            value={formData.invoiceTitle}
            onChange={(e) => handleInputChange("invoiceTitle", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        <div>
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            min={getTodayDate()}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Label>Line Items *</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLineItem}
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.lineItems.map((item, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                  />
                  {errors[`lineItem${index}Description`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`lineItem${index}Description`]}
                    </p>
                  )}
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="Amount"
                    step="0.01"
                    min="0"
                    value={item.amount}
                    onChange={(e) => handleLineItemChange(index, "amount", e.target.value)}
                  />
                  {errors[`lineItem${index}Amount`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`lineItem${index}Amount`]}
                    </p>
                  )}
                </div>
                {formData.lineItems.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLineItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {errors.lineItems && (
            <p className="mt-2 text-sm text-red-600">{errors.lineItems}</p>
          )}
        </div>

        {formData.lineItems.some(item => item.amount && parseFloat(item.amount) > 0) && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">Total Amount:</span>
              <span className="text-lg font-bold text-primary-600">
                ${formData.lineItems.reduce((sum, item) => {
                  const amount = parseFloat(item.amount) || 0;
                  return sum + amount;
                }, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
<Button
          type="submit"
          className="flex-1"
          disabled={loading}
        >
          {loading 
            ? (invoice ? "Updating..." : "Creating...") 
            : (invoice ? "Update Invoice" : "Create Invoice")
          }
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;