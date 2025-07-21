import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import ThemeToggle from "@/components/molecules/ThemeToggle";
import Button from "@/components/atoms/Button";

function Header({ onMenuToggle, title = "Dashboard", onNewProject }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
function Header({ onMenuToggle, title, onNewProject }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  function UserProfile() {
    if (!isAuthenticated || !user) {
      return null;
    }

    const handleLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    return (
      <div className="relative group">
        <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user.firstName?.[0] || user.emailAddress?.[0] || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-surface-900 dark:text-surface-100">
              {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.emailAddress}
            </div>
            <div className="text-xs text-surface-500 dark:text-surface-400">
              {user.accounts?.[0]?.companyName || 'Personal'}
            </div>
          </div>
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-surface-500 dark:text-surface-400" />
        </button>
        
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg border border-surface-200 dark:border-surface-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-md transition-colors"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-md text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-200 dark:hover:bg-surface-700 transition-colors"
            >
              <ApperIcon name="Menu" className="w-6 h-6" />
            </button>
            
            <div>
              <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
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
}

export default Header;