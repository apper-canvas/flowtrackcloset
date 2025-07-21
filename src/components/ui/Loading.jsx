import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";

const Loading = () => {
  return (
    <div className="animate-fade-in">
      {/* Stats Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded shimmer w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
            </div>
            <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-700 rounded shimmer w-20"></div>
          </Card>
        ))}
      </div>

      {/* Content Loading */}
      <Card variant="glass" className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded shimmer w-48"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded shimmer w-64"></div>
          </div>

          {/* Table/Grid Items */}
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded shimmer w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer w-20"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded shimmer w-16"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Loading;