import { ChevronDown, ChevronRight, MoreHorizontal, Plus, User, Layout, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

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
  const [editedName, setEditedName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editedSectionName, setEditedSectionName] = useState("")
  const sectionInputRef = useRef<HTMLInputElement>(null)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editedTaskTitle, setEditedTaskTitle] = useState("")
  const taskInputRef = useRef<HTMLInputElement>(null)
  
  // Update editedName when selectedProject changes
  useEffect(() => {
    if (selectedProject) {
      setEditedName(selectedProject.name)
    }
  }, [selectedProject])
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // Select all text in the input
      inputRef.current.select()
    }
  }, [isEditing])
  
  // Focus section input when editing starts
  useEffect(() => {
    if (editingSectionId && sectionInputRef.current) {
      sectionInputRef.current.focus()
      // Select all text in the input
      sectionInputRef.current.select()
    }
  }, [editingSectionId])
  
  // Focus task input when editing starts
  useEffect(() => {
    if (editingTaskId && taskInputRef.current) {
      taskInputRef.current.focus()
      // Select all text in the input
      taskInputRef.current.select()
    }
  }, [editingTaskId])
  
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
  
  const handleProjectNameEdit = () => {
    setIsEditing(true)
  }
  
  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value)
  }
  
  const handleProjectNameBlur = async () => {
    setIsEditing(false)
    
    // Only submit if the name has changed and is not empty
    if (editedName.trim() !== selectedProject?.name && editedName.trim() !== "") {
      try {
        const response = await fetch(`/api/projects/${selectedProject?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: editedName.trim() }),
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
        // Reset to original name on error
        if (selectedProject) {
          setEditedName(selectedProject.name)
        }
      }
    } else {
      // Reset to original name if no change or empty
      if (selectedProject) {
        setEditedName(selectedProject.name)
      }
    }
  }
  
  const handleProjectNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      if (selectedProject) {
        setEditedName(selectedProject.name)
      }
      setIsEditing(false)
    }
  }

  const handleSectionNameEdit = (sectionId: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingSectionId(sectionId)
    setEditedSectionName(currentName)
  }
  
  const handleSectionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSectionName(e.target.value)
  }
  
  const handleSectionNameBlur = async (sectionId: string, currentName: string) => {
    setEditingSectionId(null)
    
    // Only submit if the name has changed and is not empty
    if (editedSectionName.trim() !== currentName && editedSectionName.trim() !== "") {
      try {
        const response = await fetch(`/api/sections/${sectionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: editedSectionName.trim() }),
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
      }
    }
  }
  
  const handleSectionNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, sectionId: string, currentName: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sectionInputRef.current?.blur()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setEditingSectionId(null)
    }
  }

  const handleTaskTitleEdit = (taskId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingTaskId(taskId)
    setEditedTaskTitle(currentTitle)
  }
  
  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTaskTitle(e.target.value)
  }
  
  const handleTaskTitleBlur = async (taskId: string, currentTitle: string) => {
    setEditingTaskId(null)
    
    // Only submit if the title has changed and is not empty
    if (editedTaskTitle.trim() !== currentTitle && editedTaskTitle.trim() !== "") {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: editedTaskTitle.trim() }),
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
      }
    }
  }
  
  const handleTaskTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, taskId: string, currentTitle: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      taskInputRef.current?.blur()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setEditingTaskId(null)
    }
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
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={handleProjectNameChange}
              onBlur={handleProjectNameBlur}
              onKeyDown={handleProjectNameKeyDown}
              className="text-xl font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 py-0.5"
            />
          ) : (
            <h1 
              className="text-xl font-bold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              onClick={handleProjectNameEdit}
            >
              {selectedProject.name}
            </h1>
          )}
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
                  {editingSectionId === section.id ? (
                    <input
                      ref={sectionInputRef}
                      type="text"
                      value={editedSectionName}
                      onChange={handleSectionNameChange}
                      onBlur={() => handleSectionNameBlur(section.id, section.name)}
                      onKeyDown={(e) => handleSectionNameKeyDown(e, section.id, section.name)}
                      className="font-medium ml-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 py-0.5"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h2 
                      className="font-medium ml-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                      onClick={(e) => handleSectionNameEdit(section.id, section.name, e)}
                    >
                      {section.name}
                    </h2>
                  )}
                  <span className="ml-2 text-gray-400 text-sm">{section.tasks.length}</span>
                  {section.tasks.length === 0 && (
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
                              {editingTaskId === task.id ? (
                                <input
                                  ref={taskInputRef}
                                  type="text"
                                  value={editedTaskTitle}
                                  onChange={handleTaskTitleChange}
                                  onBlur={() => handleTaskTitleBlur(task.id, task.title)}
                                  onKeyDown={(e) => handleTaskTitleKeyDown(e, task.id, task.title)}
                                  className={cn(
                                    "bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1 py-0.5 w-full",
                                    task.completed && "line-through text-gray-400"
                                  )}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <span 
                                  className={cn(
                                    "cursor-pointer hover:bg-gray-100 px-2 py-1 rounded",
                                    task.completed && "line-through text-gray-400"
                                  )}
                                  onClick={(e) => handleTaskTitleEdit(task.id, task.title, e)}
                                >
                                  {task.title}
                                </span>
                              )}
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