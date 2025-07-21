import React, { useState } from 'react'
import { motion } from 'framer-motion'
import TaskList, { KanbanBoard } from '@/components/organisms/TaskList'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

function Tasks() {
  const [viewMode, setViewMode] = useState('list')

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your tasks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3 py-2"
            >
              <ApperIcon name="List" className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="px-3 py-2"
            >
              <ApperIcon name="Columns" className="w-4 h-4 mr-2" />
              Kanban
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === 'list' ? (
          <TaskList />
        ) : (
          <KanbanBoard />
        )}
      </motion.div>
    </div>
  )
}

export default Tasks