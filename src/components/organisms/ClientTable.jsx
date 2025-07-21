import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "@/components/atoms/Modal";
import ClientForm from "@/components/molecules/ClientForm";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Projects from "@/components/pages/Projects";
import Clients from "@/components/pages/Clients";
import SearchBar from "@/components/molecules/SearchBar";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { clientService } from "@/services/api/clientService";
import { projectService } from "@/services/api/projectService";
const ClientTable = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [clientsData, projectsData] = await Promise.all([
        clientService.getAll(),
        projectService.getAll()
      ]);
      
      setClients(clientsData);
      setProjects(projectsData);
    } catch (err) {
      setError("Failed to load clients. Please try again.");
    } finally {
      setLoading(false);
    }
};

const handleAddClient = (newClient) => {
    setClients(prev => [...prev, newClient]);
    setShowAddModal(false);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowEditModal(true);
  };

  const handleUpdateClient = (updatedClient) => {
    setClients(prev => prev.map(c => c.Id === updatedClient.Id ? updatedClient : c));
    setShowEditModal(false);
    setEditingClient(null);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      try {
        await clientService.delete(clientId);
        setClients(prev => prev.filter(c => c.Id !== clientId));
        toast.success("Client deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete client. Please try again.");
      }
    }
  };

const getClientProjectCount = (clientId) => {
    return projects.filter(p => (p.clientId_c?.Id || p.clientId_c) === clientId).length;
  };

const filteredClients = clients.filter(client =>
    client.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email_c?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (clients.length === 0) {
    return (
      <Empty 
        title="No clients yet"
        description="Start building your client base by adding your first client."
        actionText="Add Client"
onAction={() => setShowAddModal(true)}
      />
    );
  }

  return (
    <div className="space-y-6">
<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search clients..."
            className="sm:w-80"
          />
          <Button 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
            className="whitespace-nowrap"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      <Card variant="glass" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-surface-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Added
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.map((client, index) => (
                <motion.tr
                  key={client.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-surface-700/30 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
<div className="flex items-center">
                       <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-medium">
                         {client.Name?.charAt(0)}
                       </div>
                       <div className="ml-4">
                         <div className="text-sm font-medium text-gray-900 dark:text-white">
                           {client.Name}
                         </div>
                         <div className="text-sm text-gray-500 dark:text-gray-400">
                           {client.email_c}
                         </div>
                       </div>
                     </div>
                   </td>
<td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900 dark:text-white">
                       {client.company_c}
                     </div>
                     <div className="text-sm text-gray-500 dark:text-gray-400">
                       {client.phone_c}
                     </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="primary">
                      {getClientProjectCount(client.Id)} projects
                    </Badge>
                  </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                     {format(new Date(client.createdAt_c), "MMM dd, yyyy")}
                   </td>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => navigate(`/clients/${client.Id}`)}
                        className="text-primary-600 hover:text-primary-700 p-1 rounded"
                        title="View Details"
                      >
                        <ApperIcon name="Eye" className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClient(client)}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded"
                        title="Edit Client"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.Id)}
                        className="text-red-600 hover:text-red-700 p-1 rounded"
                        title="Delete Client"
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

{filteredClients.length === 0 && searchTerm && (
        <Empty 
          title="No clients found"
          description={`No clients match "${searchTerm}". Try adjusting your search.`}
          actionText="Clear Search"
          onAction={() => setSearchTerm("")}
        />
      )}

<Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Client"
        className="max-w-lg"
      >
        <ClientForm
          onSubmit={handleAddClient}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingClient(null);
        }}
        title="Edit Client"
        className="max-w-lg"
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleUpdateClient}
          onCancel={() => {
            setShowEditModal(false);
            setEditingClient(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default ClientTable;