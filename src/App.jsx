import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Dashboard from "@/components/pages/Dashboard";
import Clients from "@/components/pages/Clients";
import ClientDetail from "@/components/pages/ClientDetail";
import Projects from "@/components/pages/Projects";
import ProjectDetail from "@/components/pages/ProjectDetail";
import Tasks from "@/components/pages/Tasks";
import Invoices from "@/components/pages/Invoices";
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

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
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
<Routes>
          <Route path="/" element={<Dashboard />} />
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