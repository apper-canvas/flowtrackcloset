import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection, 
  color = "primary",
  loading = false 
}) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50 dark:bg-primary-900/20",
    success: "text-green-600 bg-green-50 dark:bg-green-900/20",
    warning: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
    danger: "text-red-600 bg-red-50 dark:bg-red-900/20",
    info: "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
  };

  if (loading) {
    return (
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded shimmer w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
        </div>
        <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-700 rounded shimmer w-20"></div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="glass" className="p-6 hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <motion.p 
              className="text-3xl font-bold text-gray-900 dark:text-white text-gradient"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {value}
            </motion.p>
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            colorClasses[color]
          )}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center">
            <ApperIcon 
              name={trendDirection === "up" ? "TrendingUp" : "TrendingDown"} 
              className={cn(
                "w-4 h-4 mr-1",
                trendDirection === "up" ? "text-green-500" : "text-red-500"
              )}
            />
            <span className={cn(
              "text-sm font-medium",
              trendDirection === "up" ? "text-green-600" : "text-red-600"
            )}>
              {trend}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default StatCard;