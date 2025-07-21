import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import ThemeToggle from "@/components/molecules/ThemeToggle";
import Button from "@/components/atoms/Button";
import { AuthContext } from "@/App";

const UserProfile = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="hidden sm:flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
        <ApperIcon name="User" className="w-4 h-4 text-white" />
      </div>
      <div className="hidden md:block">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user.emailAddress}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        title="Logout"
      >
        <ApperIcon name="LogOut" className="w-4 h-4" />
      </Button>
    </div>
  );
};

const Header = ({ onMenuToggle, title = "Dashboard", onNewProject }) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 glass dark:glass-dark border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="lg:hidden mr-3"
            >
              <ApperIcon name="Menu" className="w-5 h-5" />
            </Button>
            
            <div className="lg:hidden flex items-center">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mr-3">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gradient">FlowTrack</h1>
            </div>
            
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <Button
              variant="primary"
              size="sm"
              onClick={onNewProject}
              className="hidden sm:flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>New Project</span>
            </Button>
            
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
<div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <Button
              variant="primary"
              size="sm"
              onClick={onNewProject}
              className="hidden sm:flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>New Project</span>
            </Button>
            
            <UserProfile />
          </div>