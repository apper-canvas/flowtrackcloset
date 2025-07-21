import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";

const Sidebar = ({ isOpen, onToggle, collapsed = false }) => {
  const navItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/clients", icon: "Users", label: "Clients" },
    { to: "/projects", icon: "FolderOpen", label: "Projects" },
    { to: "/tasks", icon: "CheckSquare", label: "Tasks" },
    { to: "/invoices", icon: "FileText", label: "Invoices" }
  ];

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 ${collapsed ? "lg:w-16" : "lg:w-64"} transition-all duration-300`}>
      <div className="flex flex-col flex-1 min-h-0 glass dark:glass-dark border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <motion.div
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
                transition={{ duration: 0.2 }}
                className="ml-3 overflow-hidden"
              >
                <h1 className="text-xl font-bold text-gradient whitespace-nowrap">FlowTrack</h1>
              </motion.div>
            )}
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              collapsed={collapsed}
            >
              {item.label}
            </NavItem>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors duration-200"
          >
            <ApperIcon 
              name={collapsed ? "ChevronRight" : "ChevronLeft"} 
              className="w-5 h-5" 
            />
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onToggle}
        />
      )}
      
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 glass dark:glass-dark border-r border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gradient">FlowTrack</h1>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
              >
                {item.label}
              </NavItem>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;