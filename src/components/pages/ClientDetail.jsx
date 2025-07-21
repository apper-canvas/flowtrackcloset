import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/atoms/Modal";
import ClientForm from "@/components/molecules/ClientForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { clientService } from "@/services/api/clientService";
import { projectService } from "@/services/api/projectService";
import { invoiceService } from "@/services/api/invoiceService";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadClientData();
  }, [id]);

const loadClientData = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate client ID parameter
      const clientId = parseInt(id);
      if (!id || isNaN(clientId) || clientId <= 0) {
        setError("Invalid client ID. Please check the URL and try again.");
        return;
      }

      const [clientData, projectsData, invoicesData] = await Promise.all([
        clientService.getById(clientId),
        projectService.getByClientId(clientId),
        invoiceService.getAll()
      ]);

      if (!clientData) {
        setError("Client not found. The client may have been deleted or the ID is incorrect.");
        return;
      }

      setClient(clientData);
      setProjects(projectsData);
      setInvoices(invoicesData);
    } catch (err) {
      console.error("Error loading client data:", err);
      if (err.message && err.message.includes("does not exist")) {
        setError("Client not found. Please verify the client ID and try again.");
      } else {
        setError("Failed to load client details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = async (updatedClient) => {
    try {
      const result = await clientService.update(parseInt(id), updatedClient);
      setClient(result);
      setShowEditModal(false);
      toast.success("Client updated successfully!");
    } catch (error) {
      toast.error("Failed to update client. Please try again.");
    }
  };

  const getClientStats = () => {
const totalProjects = projects.length;
     const activeProjects = projects.filter(p => p.status_c === "In Progress").length;
    
    // Calculate total revenue from client's project invoices
const clientProjectIds = projects.map(p => p.Id);
     const clientInvoices = invoices.filter(i => 
       clientProjectIds.includes(i.projectId_c?.Id || i.projectId_c) && i.status_c === "Paid"
     );
     const totalRevenue = clientInvoices.reduce((sum, invoice) => sum + (invoice.amount_c || 0), 0);

    return { totalProjects, activeProjects, totalRevenue };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "primary";
      case "Planning":
        return "warning";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClientData} />;
  }

  if (!client) {
    return <Error message="Client not found" />;
  }

  const { totalProjects, activeProjects, totalRevenue } = getClientStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/clients')}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          </Button>
          <div>
<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
               {client.Name}
             </h1>
             <p className="text-gray-600 dark:text-gray-400">{client.company_c}</p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowEditModal(true)}
        >
          <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
          Edit Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalProjects}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                <ApperIcon name="FolderOpen" className="w-6 h-6 text-white" />
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
                  Active Projects
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeProjects}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
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
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Client Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card variant="glass" className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Client Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
<div className="flex items-center mb-4">
                 <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xl mr-4">
                   {client.Name?.charAt(0)}
                 </div>
                 <div>
                   <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                     {client.Name}
                   </h3>
                   <p className="text-gray-600 dark:text-gray-400">{client.company_c}</p>
                 </div>
               </div>
             </div>
             <div className="space-y-3">
               <div className="flex items-center">
                 <ApperIcon name="Mail" className="w-4 h-4 text-gray-400 mr-3" />
                 <span className="text-gray-600 dark:text-gray-400">{client.email_c}</span>
               </div>
{client.phone_c && (
                 <div className="flex items-center">
                   <ApperIcon name="Phone" className="w-4 h-4 text-gray-400 mr-3" />
                   <span className="text-gray-600 dark:text-gray-400">{client.phone_c}</span>
                 </div>
               )}
              <div className="flex items-center">
<ApperIcon name="Calendar" className="w-4 h-4 text-gray-400 mr-3" />
                 <span className="text-gray-600 dark:text-gray-400">
                   Client since {format(new Date(client.createdAt_c), "MMM dd, yyyy")}
                 </span>
              </div>
            </div>
          </div>
          {client.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
              <p className="text-gray-600 dark:text-gray-400">{client.notes}</p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Projects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card variant="glass" className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Projects ({projects.length})
            </h2>
          </div>
          
          {projects.length === 0 ? (
            <Empty
              title="No projects yet"
              description="This client doesn't have any projects assigned."
              actionText="View All Projects"
              onAction={() => navigate('/projects')}
            />
          ) : (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-700/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
<div className="flex-1">
                       <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                         {project.Name}
                       </h3>
                       <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                         <span>Budget: ${project.budget_c?.toLocaleString()}</span>
                         <span>Start: {format(new Date(project.startDate_c), "MMM dd, yyyy")}</span>
                         <span>End: {format(new Date(project.endDate_c), "MMM dd, yyyy")}</span>
                       </div>
                     </div>
                     <Badge variant={getStatusColor(project.status_c)}>
                       {project.status_c}
                     </Badge>
                   </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Client"
        className="max-w-lg"
      >
        <ClientForm
          client={client}
          onSubmit={handleEditClient}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ClientDetail;