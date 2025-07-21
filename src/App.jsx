import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import Invoices from "@/components/pages/Invoices";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import ClientDetail from "@/components/pages/ClientDetail";
import Clients from "@/components/pages/Clients";
import ProjectDetail from "@/components/pages/ProjectDetail";
import Dashboard from "@/components/pages/Dashboard";
import ProjectForm from "@/components/molecules/ProjectForm";
import Modal from "@/components/atoms/Modal";
import { clientService } from "@/services/api/clientService";
import { projectService } from "@/services/api/projectService";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  
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
const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/clients":
        return "Clients";
      case "/projects":
        return "Projects";
      case "/tasks":
        return "Tasks";
      case "/invoices":
        return "Invoices";
      default:
        if (pathname.startsWith("/clients/")) {
          return "Client Details";
        }
        if (pathname.startsWith("/projects/")) {
          return "Project Details";
        }
        return "Dashboard";
    }
  };
return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        collapsed={sidebarCollapsed}
        onCollapse={toggleSidebarCollapse}
      />
      
      <div className={`lg:flex lg:flex-col ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"} transition-all duration-300`}>
        <Header 
          onMenuToggle={toggleSidebar}
          title={getPageTitle(location.pathname)}
          onNewProject={handleOpenProjectModal}
        />
<main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard onNewProject={handleOpenProjectModal} />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/clients/:id/edit" element={<ClientDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/:id/edit" element={<ProjectDetail />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/invoices" element={<Invoices />} />
          </Routes>
        </main>
      </div>

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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="!top-4 !right-4"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;