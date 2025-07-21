import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/store/userSlice";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import Invoices from "@/components/pages/Invoices";
import Projects from "@/components/pages/Projects";
import Tasks from "@/components/pages/Tasks";
import ClientDetail from "@/components/pages/ClientDetail";
import Clients from "@/components/pages/Clients";
import ProjectDetail from "@/components/pages/ProjectDetail";
import Dashboard from "@/components/pages/Dashboard";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import ProjectForm from "@/components/molecules/ProjectForm";
import Modal from "@/components/atoms/Modal";
import { clientService } from "@/services/api/clientService";
import { projectService } from "@/services/api/projectService";

export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

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

  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-full w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
        <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
        <Route path="/*" element={
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
          </div>
        } />
      </Routes>

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
    </AuthContext.Provider>
  );
}

export default App;