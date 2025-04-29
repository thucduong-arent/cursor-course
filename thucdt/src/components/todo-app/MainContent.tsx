import { ChevronDown, ChevronRight, MoreHorizontal, Plus, User, Layout, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import EditableText from "./EditableText"

type Task = {
  id: string
  title: string
  completed: boolean
  due_date?: string
  parent_task_id?: string | null
  subtasks?: Task[]
  collapsed?: boolean
  section_id: string
}

type Section = {
  id: string
  name: string
  tasks: Task[]
  collapsed: boolean
  project_id: string
}

type Project = {
  id: string
  name: string
  count: number
  selected?: boolean
  icon?: string
  sectionTaskCounts?: Record<string, number>
}

interface MainContentProps {
  sections: Section[]
  isLoading: boolean
  selectedProject: Project | null
  selectedSectionId: string | null
  setSelectedSectionId: (sectionId: string | null) => void
  setIsSectionModalOpen: (open: boolean) => void
  setIsTaskModalOpen: (open: boolean) => void
  toggleSection: (sectionId: string) => void
  toggleTask: (sectionId: string, taskId: string) => void
  toggleSubtask: (sectionId: string, taskId: string, subtaskId: string) => void
  toggleTaskCollapse: (sectionId: string, taskId: string) => void
  setNotification: (notification: { show: boolean; message: string; type: 'success' | 'error' }) => void
  refreshSections: () => void
  refreshProjects: () => void
}

export default function MainContent({
  sections,
  isLoading,
  selectedProject,
  selectedSectionId,
  setSelectedSectionId,
  setIsSectionModalOpen,
  setIsTaskModalOpen,
  toggleSection,
  toggleTask,
  toggleSubtask,
  toggleTaskCollapse,
  setNotification,
  refreshSections,
  refreshProjects
}: MainContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  
  // New handlers for the EditableText component
  const handleProjectNameSave = async (newName: string) => {
    try {
      const response = await fetch(`/api/projects/${selectedProject?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update project name')
      }
      
      setNotification({
        show: true,
        message: 'Project name updated successfully',
        type: 'success'
      })
      
      // Refresh both sections and projects to get updated data
      refreshSections()
      refreshProjects()
    } catch (error) {
      console.error('Error updating project name:', error)
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to update project name',
        type: 'error'
      })
      throw error // Re-throw to let EditableText handle the reset
    }
  }

  const handleSectionNameSave = async (sectionId: string, newName: string) => {
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update section name')
      }
      
      setNotification({
        show: true,
        message: 'Section name updated successfully',
        type: 'success'
      })
      
      // Refresh sections to get updated data
      refreshSections()
    } catch (error) {
      console.error('Error updating section name:', error)
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to update section name',
        type: 'error'
      })
      throw error // Re-throw to let EditableText handle the reset
    }
  }

  const handleTaskTitleSave = async (taskId: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update task title')
      }
      
      setNotification({
        show: true,
        message: 'Task title updated successfully',
        type: 'success'
      })
      
      // Refresh sections to get updated data
      refreshSections()
    } catch (error) {
      console.error('Error updating task title:', error)
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to update task title',
        type: 'error'
      })
      throw error // Re-throw to let EditableText handle the reset
    }
  }

  const handleDeleteSection = async (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete section')
      }

      setNotification({
        show: true,
        message: 'Section deleted successfully',
        type: 'success'
      })
      
      // Refresh sections after successful deletion
      refreshSections()
    } catch (error) {
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to delete section',
        type: 'error'
      })
    }
  }

  // Function to get task count for a section
  const getSectionTaskCount = (sectionId: string): number => {
    if (selectedProject?.sectionTaskCounts && selectedProject.sectionTaskCounts[sectionId] !== undefined) {
      return selectedProject.sectionTaskCounts[sectionId]
    }
    // Fallback to the tasks array length if sectionTaskCounts is not available
    const section = sections.find(s => s.id === sectionId)
    if (section) {
      // Count all uncompleted tasks
      const uncompletedTasks = section.tasks.filter(task => !task.completed)
      
      // Count uncompleted subtasks as well
      const uncompletedSubtasks = uncompletedTasks.reduce((count, task) => {
        if (task.subtasks) {
          return count + task.subtasks.filter(subtask => !subtask.completed).length
        }
        return count
      }, 0)
      
      // Total count is the sum of uncompleted tasks and uncompleted subtasks
      return uncompletedTasks.length + uncompletedSubtasks
    }
    return 0
  }

  if (!selectedProject) {
    return (
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto h-full flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Project Selected</h2>
            <p className="text-gray-500">Please select a project to view its tasks and sections.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <EditableText
            value={selectedProject.name}
            onSave={handleProjectNameSave}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            className="text-xl font-bold"
            textClassName="text-xl font-bold"
            inputClassName="text-xl font-bold"
            size="lg"
          />
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setIsSectionModalOpen(true)}
              disabled={!selectedProject}
            >
              Add New Section
            </button>
            <button className="p-1 rounded hover:bg-gray-100">
              <User size={18} className="text-gray-500" />
            </button>
            <button className="p-1 rounded hover:bg-gray-100">
              <Layout size={18} className="text-gray-500" />
            </button>
            <button className="p-1 rounded hover:bg-gray-100">
              <MoreHorizontal size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <button 
              className="w-full text-left mb-4 flex items-center text-gray-500 hover:bg-gray-100 p-2 rounded"
              onClick={() => {
                if (sections.length > 0) {
                  setSelectedSectionId(sections[0].id)
                  setIsTaskModalOpen(true)
                } else {
                  setNotification({
                    show: true,
                    message: 'Please create a section first',
                    type: 'error'
                  })
                }
              }}
            >
              <Plus size={16} className="mr-2" />
              Add task
            </button>

            {/* Sections */}
            {sections.map((section) => (
              <div key={section.id} className="mb-6">
                <div className="flex items-center mb-2 cursor-pointer" onClick={() => toggleSection(section.id)}>
                  {section.collapsed ? (
                    <ChevronRight size={18} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-400" />
                  )}
                  <EditableText
                    value={section.name}
                    onSave={(newName) => handleSectionNameSave(section.id, newName)}
                    isEditing={editingSectionId === section.id}
                    setIsEditing={(isEditing) => isEditing ? setEditingSectionId(section.id) : setEditingSectionId(null)}
                    className="font-medium ml-1"
                    textClassName="font-medium"
                    inputClassName="font-medium"
                    onClick={(e) => e.stopPropagation()}
                    size="md"
                  />
                  <span className="ml-2 text-gray-400 text-sm">{getSectionTaskCount(section.id)}</span>
                  {getSectionTaskCount(section.id) === 0 && (
                    <button 
                      className="ml-auto p-1 rounded hover:bg-gray-100 text-gray-400"
                      onClick={(e) => handleDeleteSection(section.id, e)}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {!section.collapsed && (
                  <div className="pl-6 space-y-2">
                    {section.tasks.map((task) => (
                      <div key={task.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => toggleTask(section.id, task.id)}
                            className="mt-1 w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                          >
                            {task.completed && <span className="block w-3 h-3 m-auto rounded-full bg-gray-400"></span>}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-start">
                              <EditableText
                                value={task.title}
                                onSave={(newTitle) => handleTaskTitleSave(task.id, newTitle)}
                                isEditing={editingTaskId === task.id}
                                setIsEditing={(isEditing) => isEditing ? setEditingTaskId(task.id) : setEditingTaskId(null)}
                                className={cn(
                                  "w-full",
                                  task.completed && "line-through text-gray-400"
                                )}
                                textClassName={cn(
                                  task.completed && "line-through text-gray-400"
                                )}
                                inputClassName={cn(
                                  task.completed && "line-through text-gray-400"
                                )}
                                onClick={(e) => e.stopPropagation()}
                                size="sm"
                              />
                            </div>
                            {task.due_date && (
                              <div className="mt-1">
                                <span
                                  className={cn(
                                    "text-xs px-1.5 py-0.5 rounded",
                                    task.due_date === "Tomorrow"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : task.due_date === "Monday"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800",
                                  )}
                                >
                                  {task.due_date}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Subtasks */}
                        {task.subtasks && task.subtasks.length > 0 && !task.collapsed && (
                          <div className="pl-7 space-y-2">
                            {task.subtasks.map((subtask) => (
                              <div key={subtask.id} className="flex items-start gap-2">
                                <button
                                  onClick={() => toggleSubtask(section.id, task.id, subtask.id)}
                                  className="mt-1 w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                                >
                                  {subtask.completed && (
                                    <span className="block w-3 h-3 m-auto rounded-full bg-gray-400"></span>
                                  )}
                                </button>
                                <span className={cn(subtask.completed && "line-through text-gray-400")}>
                                  {subtask.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <button 
                      className="flex items-center text-gray-500 hover:bg-gray-100 p-1 rounded"
                      onClick={() => {
                        setSelectedSectionId(section.id)
                        setIsTaskModalOpen(true)
                      }}
                    >
                      <Plus size={16} className="mr-2" />
                      Add task
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  )
} 