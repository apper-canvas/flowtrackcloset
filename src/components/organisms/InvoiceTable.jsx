import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Invoices from "@/components/pages/Invoices";
import SearchBar from "@/components/molecules/SearchBar";
import InvoiceForm from "@/components/molecules/InvoiceForm";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { invoiceService } from "@/services/api/invoiceService";
import { projectService } from "@/services/api/projectService";
const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
const [editingInvoice, setEditingInvoice] = useState(null);
  const [creating, setCreating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [paymentDate, setPaymentDate] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [downloading, setDownloading] = useState(false);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [invoicesData, projectsData] = await Promise.all([
        invoiceService.getAll(),
        projectService.getAll()
      ]);
      
      setInvoices(invoicesData);
      setProjects(projectsData);
    } catch (err) {
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
};

  const handleCreateInvoice = async (invoiceData) => {
    try {
      setCreating(true);
      const newInvoice = await invoiceService.create(invoiceData);
      setInvoices(prev => [...prev, newInvoice]);
      setShowCreateModal(false);
      toast.success("Invoice created successfully");
    } catch (err) {
      toast.error("Failed to create invoice. Please try again.");
    } finally {
      setCreating(false);
    }
};

const handleStatusUpdate = async (invoiceId, newStatus, paymentDate = null) => {
    try {
      setUpdatingStatus(true);
      const updateData = { status: newStatus };
      if (paymentDate) {
        updateData.paymentDate = paymentDate;
      }
      
      const updatedInvoice = await invoiceService.updateStatus(invoiceId, updateData);
      if (updatedInvoice) {
        setInvoices(prev => prev.map(invoice => {
          if (invoice.Id === invoiceId) {
            const updated = { ...invoice };
            updated.status_c = newStatus;
            if (paymentDate) {
              updated.paymentDate_c = paymentDate;
            }
            return updated;
          }
          return invoice;
        }));
        toast.success(`Invoice marked as ${newStatus.toLowerCase()}`);
      }
    } catch (err) {
      toast.error("Failed to update invoice status. Please try again.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleMarkAsSent = (invoiceId) => {
    handleStatusUpdate(invoiceId, "Sent");
  };

  const handleMarkAsPaid = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = () => {
    if (selectedInvoiceId && paymentDate) {
      handleStatusUpdate(selectedInvoiceId, "Paid", paymentDate);
      setShowPaymentModal(false);
      setSelectedInvoiceId(null);
      setPaymentDate("");
    }
};

  const handleViewInvoice = (invoice) => {
    toast.info("Invoice view functionality will be implemented in a future update.");
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowEditModal(true);
  };

  const handleUpdateInvoice = async (invoiceData) => {
    try {
      const updatedInvoice = await invoiceService.update(editingInvoice.Id, invoiceData);
      setInvoices(prev => prev.map(inv => inv.Id === editingInvoice.Id ? updatedInvoice : inv));
      setShowEditModal(false);
      setEditingInvoice(null);
      toast.success("Invoice updated successfully");
    } catch (err) {
      toast.error("Failed to update invoice. Please try again.");
}
  };
  const handleDownloadInvoice = async (invoice) => {
    if (downloading) return;
    
    try {
      setDownloading(true);
      
      // Dynamic import for jsPDF to reduce bundle size
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Get project name for the invoice
      const projectName = getProjectName(invoice.projectId_c);
      
      // Company Header with gradient-like styling
      doc.setFillColor(91, 79, 232); // Primary color
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('FlowTrack', 20, 25);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Professional Invoice Management', 20, 32);
      
      // Invoice Header
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', 150, 60);
      
      // Invoice Details Box
      doc.setDrawColor(91, 79, 232);
      doc.setLineWidth(1);
      doc.rect(140, 70, 60, 40, 'S');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Invoice Number:', 145, 80);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.invoiceNumber_c || 'N/A', 145, 87);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Invoice Date:', 145, 95);
      doc.setFont('helvetica', 'normal');
      doc.text(format(new Date(), "MMM dd, yyyy"), 145, 102);
      
      // Client Information
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 20, 80);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Project: ${projectName}`, 20, 90);
      doc.text(`Due Date: ${format(new Date(invoice.dueDate_c), "MMM dd, yyyy")}`, 20, 98);
      doc.text(`Status: ${invoice.status_c}`, 20, 106);
      
      // Payment Date if paid
      if (invoice.status_c === 'Paid' && invoice.paymentDate_c) {
        doc.text(`Payment Date: ${format(new Date(invoice.paymentDate_c), "MMM dd, yyyy")}`, 20, 114);
      }
      
      // Invoice Items Table Header
      const tableStartY = 130;
      doc.setFillColor(248, 249, 252); // Light gray background
      doc.rect(20, tableStartY, 170, 12, 'F');
      
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(20, tableStartY, 190, tableStartY);
      doc.line(20, tableStartY + 12, 190, tableStartY + 12);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 25, tableStartY + 8);
      doc.text('Amount', 160, tableStartY + 8);
      
      // Invoice Item
      const itemY = tableStartY + 20;
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice for ${projectName}`, 25, itemY);
      doc.text(`$${invoice.amount_c?.toLocaleString() || '0.00'}`, 160, itemY);
      
      // Table borders
      doc.line(20, itemY + 5, 190, itemY + 5);
      doc.line(20, tableStartY, 20, itemY + 5);
      doc.line(190, tableStartY, 190, itemY + 5);
      
      // Total Section
      const totalY = itemY + 20;
      doc.setFillColor(91, 79, 232);
      doc.rect(130, totalY, 60, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total Amount:', 135, totalY + 6);
      doc.text(`$${invoice.amount_c?.toLocaleString() || '0.00'}`, 135, totalY + 12);
      
      // Status Badge
      const statusY = totalY + 25;
      let statusColor;
      switch (invoice.status_c) {
        case 'Paid':
          statusColor = [16, 185, 129]; // Green
          break;
        case 'Sent':
          statusColor = [59, 130, 246]; // Blue
          break;
        case 'Overdue':
          statusColor = [239, 68, 68]; // Red
          break;
        default:
          statusColor = [156, 163, 175]; // Gray
      }
      
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(20, statusY, 30, 10, 2, 2, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const statusText = doc.getTextWidth(invoice.status_c);
      doc.text(invoice.status_c, 35 - (statusText / 2), statusY + 6.5);
      
      // Footer
      doc.setTextColor(156, 163, 175);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated by FlowTrack - Professional Invoice Management', 105, 280, { align: 'center' });
      doc.text(`Generated on ${format(new Date(), "MMM dd, yyyy 'at' h:mm a")}`, 105, 287, { align: 'center' });
      
      // Create filename
      const safeProjectName = projectName.replace(/[^a-z0-9]/gi, '_');
      const safeInvoiceNumber = (invoice.invoiceNumber_c || 'invoice').replace(/[^a-z0-9]/gi, '_');
      const filename = `Invoice_${safeInvoiceNumber}_${safeProjectName}.pdf`;
      
      // Download the PDF
      doc.save(filename);
      toast.success(`Invoice downloaded successfully as ${filename}`);
      
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
      try {
        await invoiceService.delete(invoiceId);
        setInvoices(prev => prev.filter(inv => inv.Id !== invoiceId));
        toast.success("Invoice deleted successfully");
      } catch (err) {
        toast.error("Failed to delete invoice. Please try again.");
      }
    }
  };

const calculateOutstandingAmount = () => {
    return invoices
      .filter(invoice => invoice.status_c !== "Paid")
      .reduce((total, invoice) => total + (invoice.amount_c || 0), 0);
  };

const getProjectName = (projectId) => {
    const project = projects.find(p => p.Id === (projectId?.Id || projectId));
    return project ? project.Name : "Unknown Project";
  };
  const getStatusVariant = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Sent":
        return "info";
      case "Draft":
        return "secondary";
      case "Overdue":
        return "danger";
      default:
        return "secondary";
    }
  };
const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProjectName(invoice.projectId_c).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (invoices.length === 0) {
    return (
      <Empty 
        title="No invoices yet"
        description="Create invoices to bill your clients for completed work."
        actionText="Create Invoice"
        onAction={() => setShowCreateModal(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h2>
          <div className="mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Outstanding: </span>
            <span className="text-lg font-semibold text-gradient">
              ${calculateOutstandingAmount().toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
          <div className="w-full sm:w-auto">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search invoices..."
              className="sm:w-80"
            />
          </div>
        </div>
      </div>
      <Card variant="glass" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-surface-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map((invoice, index) => (
                <motion.tr
                  key={invoice.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-surface-700/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                        <ApperIcon name="FileText" className="w-4 h-4 text-primary-600" />
                      </div>
<div className="ml-3">
                         <div className="text-sm font-medium text-gray-900 dark:text-white">
                           {invoice.invoiceNumber_c}
                         </div>
                       </div>
                    </div>
                  </td>
<td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900 dark:text-white">
                       {getProjectName(invoice.projectId_c)}
                    </div>
                  </td>
<td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm font-semibold text-gradient">
                       ${invoice.amount_c?.toLocaleString()}
                     </div>
                  </td>
<td className="px-6 py-4 whitespace-nowrap">
                     <Badge variant={getStatusVariant(invoice.status_c)}>
                       {invoice.status_c}
                     </Badge>
                  </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                     {format(new Date(invoice.dueDate_c), "MMM dd, yyyy")}
                   </td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewInvoice(invoice)}
                        className="text-primary-600 hover:text-primary-700 p-1 rounded"
                        title="View Invoice"
                      >
                        <ApperIcon name="Eye" className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditInvoice(invoice)}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded"
                        title="Edit Invoice"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
{invoice.status_c === "Draft" && (
                         <button 
                           onClick={() => handleMarkAsSent(invoice.Id)}
                           disabled={updatingStatus}
                           className="text-blue-600 hover:text-blue-700 p-1 rounded disabled:opacity-50"
                           title="Mark as Sent"
                         >
                           <ApperIcon name="Send" className="w-4 h-4" />
                         </button>
                       )}
{(invoice.status_c === "Sent" || invoice.status_c === "Overdue") && (
                         <button 
                           onClick={() => handleMarkAsPaid(invoice.Id)}
                           disabled={updatingStatus}
                           className="text-green-600 hover:text-green-700 p-1 rounded disabled:opacity-50"
                           title="Mark as Paid"
                         >
                           <ApperIcon name="DollarSign" className="w-4 h-4" />
                         </button>
                       )}
<button 
                        onClick={() => handleDownloadInvoice(invoice)}
                        disabled={downloading}
                        className="text-green-600 hover:text-green-700 p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title={downloading ? "Generating PDF..." : "Download Invoice"}
                      >
                        <ApperIcon 
                          name={downloading ? "Loader2" : "Download"} 
                          className={`w-4 h-4 ${downloading ? 'animate-spin' : ''}`} 
                        />
                      </button>
                      <button 
                        onClick={() => handleDeleteInvoice(invoice.Id)}
                        className="text-red-600 hover:text-red-700 p-1 rounded"
                        title="Delete Invoice"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredInvoices.length === 0 && searchTerm && (
        <Empty 
          title="No invoices found"
          description={`No invoices match "${searchTerm}". Try adjusting your search.`}
          actionText="Clear Search"
onAction={() => setSearchTerm("")}
        />
      )}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Invoice"
      >
        <InvoiceForm
          projects={projects}
          onSubmit={handleCreateInvoice}
          onCancel={() => setShowCreateModal(false)}
loading={creating}
        />
      </Modal>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Mark Invoice as Paid"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input
              id="paymentDate"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              disabled={updatingStatus}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              disabled={!paymentDate || updatingStatus}
              loading={updatingStatus}
            >
              Mark as Paid
            </Button>
          </div>
        </div>
</Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingInvoice(null);
        }}
        title="Edit Invoice"
      >
        <InvoiceForm
          invoice={editingInvoice}
          projects={projects}
          onSubmit={handleUpdateInvoice}
          onCancel={() => {
            setShowEditModal(false);
            setEditingInvoice(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default InvoiceTable;