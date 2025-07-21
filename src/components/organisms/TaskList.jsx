import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
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
import { timeEntryService } from '@/services/api/timeEntryService'
import { projectService } from '@/services/api/projectService'

const TaskList = ({ projectId = null }) => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'list'
  const [timerStates, setTimerStates] = useState({}) // { taskId: { isActive, startTime, elapsedTime } }
  const [activeTimers, setActiveTimers] = useState(new Set())
const columns = {
    'Pending': { title: 'To Do', color: 'bg-gray-100 dark:bg-gray-800' },
    'In Progress': { title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/20' },
    'Completed': { title: 'Completed', color: 'bg-green-100 dark:bg-green-900/20' }
  }

useEffect(() => {
    loadTasks()
    if (!projectId) {
      loadProjects()
    }
    loadActiveTimers()
  }, [projectId])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerStates(prevStates => {
        const newStates = { ...prevStates }
        let hasUpdates = false
        
        activeTimers.forEach(taskId => {
          if (newStates[taskId]?.isActive) {
            const now = Date.now()
            const elapsed = now - newStates[taskId].startTime
            newStates[taskId] = {
              ...newStates[taskId],
              elapsedTime: elapsed
            }
            hasUpdates = true
          }
        })
        
        return hasUpdates ? newStates : prevStates
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [activeTimers])

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

  const loadActiveTimers = () => {
    try {
      const savedTimers = localStorage.getItem('activeTaskTimers')
      if (savedTimers) {
        const timers = JSON.parse(savedTimers)
        const currentTime = Date.now()
        const updatedTimers = {}
        const activeSet = new Set()

        Object.entries(timers).forEach(([taskId, timer]) => {
          if (timer.isActive) {
            const elapsed = currentTime - timer.startTime
            updatedTimers[taskId] = {
              ...timer,
              elapsedTime: elapsed
            }
            activeSet.add(parseInt(taskId))
          }
        })

        setTimerStates(updatedTimers)
        setActiveTimers(activeSet)
      }
    } catch (error) {
      console.error('Failed to load active timers:', error)
    }
  }

  const saveActiveTimers = (timers) => {
    try {
      localStorage.setItem('activeTaskTimers', JSON.stringify(timers))
    } catch (error) {
      console.error('Failed to save active timers:', error)
    }
  }

  const handleStartTimer = (taskId) => {
    const startTime = Date.now()
    const newTimerState = {
      isActive: true,
      startTime,
      elapsedTime: 0
    }

    setTimerStates(prev => {
      const updated = {
        ...prev,
        [taskId]: newTimerState
      }
      saveActiveTimers(updated)
      return updated
    })

    setActiveTimers(prev => new Set([...prev, taskId]))
    toast.info('Timer started')
  }

  const handleStopTimer = async (taskId) => {
    const timerState = timerStates[taskId]
    if (!timerState?.isActive) return

    const endTime = Date.now()
    const duration = Math.floor((endTime - timerState.startTime) / 1000) // duration in seconds

    try {
// Create time entry
       const task = tasks.find(t => t.Id === taskId)
       await timeEntryService.create({
         taskId,
         projectId: task?.projectId_c?.Id || task?.projectId_c,
         startTime: new Date(timerState.startTime).toISOString(),
         endTime: new Date(endTime).toISOString(),
         duration
       })

      // Update timer state
      setTimerStates(prev => {
        const updated = { ...prev }
        delete updated[taskId]
        saveActiveTimers(updated)
        return updated
      })

      setActiveTimers(prev => {
        const newSet = new Set(prev)
        newSet.delete(taskId)
        return newSet
      })

      const hours = Math.floor(duration / 3600)
      const minutes = Math.floor((duration % 3600) / 60)
      const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
      toast.success(`Timer stopped. Time logged: ${timeString}`)
    } catch (error) {
      toast.error('Failed to log time entry')
    }
  }

  const formatElapsedTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
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
? { ...task, status_c: newStatus }
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
const newTaskData = projectId ? { ...taskData, projectId: projectId } : taskData
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
                 {task.title_c || task.Name}
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
                 <span>{new Date(task.dueDate_c).toLocaleDateString()}</span>
               </div>
</div>
            
            {/* Timer Section */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    const isActive = timerStates[task.Id]?.isActive
                    if (isActive) {
                      handleStopTimer(task.Id)
                    } else {
                      handleStartTimer(task.Id)
                    }
                  }}
                  className={`gap-1 ${timerStates[task.Id]?.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                >
                  <ApperIcon 
                    name={timerStates[task.Id]?.isActive ? "Square" : "Play"} 
                    className="w-3 h-3" 
                  />
                  {timerStates[task.Id]?.isActive ? 'Stop' : 'Start'}
                </Button>
                {timerStates[task.Id]?.isActive && (
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    {formatElapsedTime(timerStates[task.Id].elapsedTime)}
                  </span>
                )}
              </div>
<Badge className={`text-xs ${getPriorityColor(task.priority_c)}`}>
                 {task.priority_c}
               </Badge>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  )

  const TableTaskList = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
<thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Task</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Priority</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Due Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Timer</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.Id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
<td className="py-4 px-4">
                 <div>
                   <h3 className="font-semibold text-gray-900 dark:text-white">{task.title_c || task.Name}</h3>
                   {task.description && (
                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                       {task.description}
                     </p>
                   )}
                </div>
              </td>
<td className="py-4 px-4">
                 <Badge variant={task.status_c === 'Completed' ? 'success' : task.status_c === 'In Progress' ? 'info' : 'warning'}>
                   {task.status_c === 'Pending' ? 'To Do' : task.status_c}
                 </Badge>
               </td>
<td className="py-4 px-4">
                 <Badge className={getPriorityColor(task.priority_c)}>
                   {task.priority_c}
                 </Badge>
               </td>
<td className="py-4 px-4">
                 <span className="text-gray-600 dark:text-gray-400">
                   {new Date(task.dueDate_c).toLocaleDateString()}
                 </span>
               </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const isActive = timerStates[task.Id]?.isActive
                      if (isActive) {
                        handleStopTimer(task.Id)
                      } else {
                        handleStartTimer(task.Id)
                      }
                    }}
                    className={`gap-1 ${timerStates[task.Id]?.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                  >
                    <ApperIcon 
                      name={timerStates[task.Id]?.isActive ? "Square" : "Play"} 
                      className="w-3 h-3" 
                    />
                  </Button>
                  {timerStates[task.Id]?.isActive && (
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                      {formatElapsedTime(timerStates[task.Id].elapsedTime)}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTask(task)}
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.Id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="CheckSquare" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
        </div>
      )}
    </div>
  )

  const KanbanView = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
{Object.entries(columns).map(([columnId, column]) => {
           const columnTasks = tasks.filter(task => task.status_c === columnId)
          
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Management
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <ApperIcon name="List" className="w-4 h-4" />
                List
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="gap-2"
              >
                <ApperIcon name="Kanban" className="w-4 h-4" />
                Kanban
              </Button>
            </div>
            <Button onClick={handleAddTask} className="gap-2">
              <ApperIcon name="Plus" className="w-4 h-4" />
              Add Task
            </Button>
          </div>
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

      {/* Render based on view mode for main tasks page, always kanban for project */}
      {!projectId && viewMode === 'list' ? (
        <Card className="p-6">
          <TableTaskList />
        </Card>
      ) : (
        <KanbanView />
      )}

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