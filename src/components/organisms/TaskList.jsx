import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Modal from '@/components/atoms/Modal'
import TaskForm from '@/components/organisms/TaskForm'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { taskService } from '@/services/api/taskService'
import { projectService } from '@/services/api/projectService'

const TaskList = ({ projectId = null }) => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const columns = {
    'Pending': { title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
    'In Progress': { title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
    'Review': { title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900/20' },
    'Completed': { title: 'Completed', color: 'bg-green-100 dark:bg-green-900/20' }
  }

  useEffect(() => {
    loadTasks()
    if (!projectId) {
      loadProjects()
    }
  }, [projectId])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const data = projectId ? 
        await taskService.getByProjectId(projectId) : 
        await taskService.getAll()
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)
    }
  }
const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId !== destination.droppableId) {
      const taskId = parseInt(draggableId)
      const newStatus = destination.droppableId

      // Optimistic update
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.Id === taskId
            ? { ...task, status: newStatus }
            : task
        )
      )

      try {
        await taskService.updateStatus(taskId, newStatus)
        toast.success('Task status updated successfully')
      } catch (error) {
        // Revert on error
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.Id === taskId
              ? { ...task, status: source.droppableId }
              : task
          )
        )
        toast.error('Failed to update task status')
      }
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

const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, taskData)
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.Id === editingTask.Id ? updatedTask : task
          )
        )
        toast.success('Task updated successfully')
      } else {
        const newTaskData = projectId ? { ...taskData, projectId } : taskData
        const newTask = await taskService.create(newTaskData)
        setTasks(prevTasks => [...prevTasks, newTask])
        toast.success('Task created successfully')
      }
      setIsModalOpen(false)
      setEditingTask(null)
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskService.delete(taskId)
      setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

const TaskCard = ({ task, index }) => (
    <Draggable draggableId={task.Id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 group ${snapshot.isDragging ? 'rotate-3 shadow-lg' : ''}`}
        >
          <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {task.title}
              </h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditTask(task)
                  }}
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTask(task.Id)
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {task.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <div className="flex items-center gap-1">
                <ApperIcon name="Calendar" className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </Badge>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadTasks} />
  }

return (
    <div className={projectId ? "" : "p-6"}>
      {!projectId && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Management
          </h1>
          <Button onClick={handleAddTask} className="gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      )}

      {projectId && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Project Tasks
          </h2>
          <Button onClick={handleAddTask} className="gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(columns).map(([columnId, column]) => {
            const columnTasks = tasks.filter(task => task.status === columnId)
            
            return (
              <div key={columnId} className="flex flex-col">
                <div className={`${column.color} rounded-lg p-4 mb-4`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {column.title}
                    </h3>
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
                        <TaskCard key={task.Id} task={task} index={index} />
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
          projects={projects}
          projectId={projectId}
          onSubmit={handleSaveTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}

export default TaskList
export { TaskList as KanbanBoard }