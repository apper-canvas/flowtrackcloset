import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/atoms/Modal'
import TaskForm from '@/components/organisms/TaskForm'
import { Clock, User, Calendar, Plus, MoreVertical } from 'lucide-react'

const TaskList = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Design Homepage',
      description: 'Create wireframes and mockups for the new homepage',
      status: 'todo',
      priority: 'high',
      assignee: 'John Doe',
      dueDate: '2024-01-15',
      tags: ['design', 'ui/ux']
    },
    {
      id: '2',
      title: 'API Integration',
      description: 'Integrate payment gateway API',
      status: 'in-progress',
      priority: 'medium',
      assignee: 'Jane Smith',
      dueDate: '2024-01-20',
      tags: ['backend', 'api']
    },
    {
      id: '3',
      title: 'User Testing',
      description: 'Conduct user testing sessions',
      status: 'completed',
      priority: 'low',
      assignee: 'Mike Johnson',
      dueDate: '2024-01-10',
      tags: ['testing', 'ux']
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const columns = {
    todo: { title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
    'in-progress': { title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
    completed: { title: 'Completed', color: 'bg-green-100 dark:bg-green-900/20' }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId !== destination.droppableId) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggableId
            ? { ...task, status: destination.droppableId }
            : task
        )
      )
    }
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        )
      )
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...taskData
      }
      setTasks(prevTasks => [...prevTasks, newTask])
    }
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 ${snapshot.isDragging ? 'rotate-3 shadow-lg' : ''}`}
        >
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {task.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditTask(task)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {task.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{task.assignee}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{task.dueDate}</span>
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>2 days left</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Task Management
        </h1>
        <Button onClick={handleAddTask} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, column]) => {
            const columnTasks = tasks.filter(task => task.status === columnId)
            
            return (
              <div key={columnId} className="flex flex-col">
                <div className={`${column.color} rounded-lg p-4 mb-4`}>
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                      {column.title}
                    </h2>
                    <Badge variant="secondary" className="text-sm">
                      {columnTasks.length}
                    </Badge>
                  </div>
                </div>
                
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[200px] rounded-lg p-2 transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-700' 
                          : 'bg-gray-50 dark:bg-gray-900/50'
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <TaskCard key={task.id} task={task} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default TaskList