import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  actionText = "Add Item",
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card variant="glass" className="p-8 max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary bg-opacity-10 flex items-center justify-center"
        >
          <ApperIcon name={icon} className="w-12 h-12 text-primary-600" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button 
              onClick={onAction}
              variant="accent"
              size="lg"
              className="w-full"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              {actionText}
            </Button>
          </motion.div>
        )}
        
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Start building your project portfolio today
        </div>
      </Card>
    </motion.div>
  );
};

export default Empty;