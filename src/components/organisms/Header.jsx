import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import ThemeToggle from "@/components/molecules/ThemeToggle";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle, title = "Dashboard" }) => {
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
              onClick={() => navigate('/projects')}
              className="hidden sm:flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>New Project</span>
            </Button>
            
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Freelancer
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Project Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;