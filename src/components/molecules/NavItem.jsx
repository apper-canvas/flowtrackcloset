import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, children, collapsed = false }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          isActive
            ? "gradient-primary text-white shadow-lg shadow-primary-500/25"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 hover:text-gray-900 dark:hover:text-white"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-0 rounded-lg gradient-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
          <div className="relative flex items-center">
            <ApperIcon name={icon} className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <motion.span
                className="ml-3 font-medium"
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.span>
            )}
          </div>
        </>
      )}
    </NavLink>
  );
};

export default NavItem;