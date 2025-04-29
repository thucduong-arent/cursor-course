"use client"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  User,
  Layout,
  Bell,
  HelpCircle,
  Menu,
  Home,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import ProjectModal from "./ProjectModal"
import Notification from "@/app/components/Notification"

type Task = {
  id: string
  text: string
  completed: boolean
  date?: string
  subtasks?: Task[]
  collapsed?: boolean
}

type Section = {
  id: string
  title: string
  tasks: Task[]
  collapsed: boolean
  count: number
}

type Project = {
  id: string
  name: string
  count: number
  selected?: boolean
  icon?: string
}

const initialSections: Section[] = [
  {
    id: "section-1",
    title: "This is a section",
    collapsed: false,
    count: 2,
    tasks: [
      { id: "task-1-1", text: "This is a task for me to do", completed: false, date: "Tomorrow" },
      { id: "task-1-2", text: "And another task", completed: false, date: "Monday" },
    ],
  },
  {
    id: "section-2",
    title: "This is another section",
    collapsed: false,
    count: 2,
    tasks: [
      {
        id: "task-2-1",
        text: "Oh look, more tasks",
        completed: false,
        date: "0/1",
        collapsed: false,
        subtasks: [{ id: "subtask-2-1-1", text: "With sub-tasks!", completed: false }],
      },
    ],
  },
]

// Function to fetch projects from the API
async function fetchUserProjects() {
  try {
    const response = await fetch('/api/projects')
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch projects')
    }
    
    const data = await response.json()
    
    // Transform the API response to match our Project type
    return data.projects.map((project: any) => ({
      id: project.id,
      name: project.name,
      count: project.task_count || 0,
      selected: false,
      icon: project.icon || ''
    }))
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

// Function to delete a project
async function deleteProject(projectId: string) {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete project')
    }
    
    return true
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

export default function TodoApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sections, setSections] = useState<Section[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  })
  const [deleteConfirmProjectId, setDeleteConfirmProjectId] = useState<string | null>(null)

  useEffect(() => {
    setSections(initialSections)
    
    // Fetch projects from the API
    const loadProjects = async () => {
      setIsLoading(true)
      try {
        const userProjects = await fetchUserProjects()
        setProjects(userProjects)
      } catch (error) {
        console.error('Error loading projects:', error)
        setNotification({
          show: true,
          message: 'Failed to load projects',
          type: 'error'
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProjects()
  }, [])

  const toggleSection = (sectionId: string) => {
    setSections(
      sections.map((section) => (section.id === sectionId ? { ...section, collapsed: !section.collapsed } : section)),
    )
  }

  const toggleTask = (sectionId: string, taskId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
            }
          : section,
      ),
    )
  }

  const toggleSubtask = (sectionId: string, taskId: string, subtaskId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      subtasks: task.subtasks?.map((subtask) =>
                        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask,
                      ),
                    }
                  : task,
              ),
            }
          : section,
      ),
    )
  }

  const toggleTaskCollapse = (sectionId: string, taskId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map((task) => (task.id === taskId ? { ...task, collapsed: !task.collapsed } : task)),
            }
          : section,
      ),
    )
  }

  const selectProject = (projectId: string) => {
    setProjects(
      projects.map((project) => ({
        ...project,
        selected: project.id === projectId,
      })),
    )
  }

  const handleCreateProject = async (name: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project')
      }

      // Refresh the projects list
      const userProjects = await fetchUserProjects()
      setProjects(userProjects)
      
      // Show success notification
      setNotification({
        show: true,
        message: 'Project created successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating project:', error)
      // Show error notification
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to create project',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    setIsLoading(true)
    try {
      await deleteProject(projectId)
      
      // Remove the project from the state
      setProjects(projects.filter(project => project.id !== projectId))
      
      // Show success notification
      setNotification({
        show: true,
        message: 'Project deleted successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting project:', error)
      // Show error notification
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to delete project',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
      setDeleteConfirmProjectId(null)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-2 flex items-center gap-2">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-white/20">
          <Menu size={18} />
        </button>
        <button className="p-1 rounded hover:bg-white/20">
          <Home size={18} />
        </button>
        <div className="flex items-center bg-white/20 rounded px-2 py-1 flex-1 max-w-md">
          <Search size={16} className="mr-2 text-white/70" />
          <span className="text-white/70 text-sm">Search</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="text-xs">⭐</span> Upgrade to Pro
          </span>
          <button className="p-1 rounded hover:bg-white/20">
            <Plus size={18} />
          </button>
          <button className="p-1 rounded hover:bg-white/20">
            <Bell size={18} />
          </button>
          <button className="p-1 rounded hover:bg-white/20">
            <HelpCircle size={18} />
          </button>
          <button className="p-1 rounded hover:bg-white/20">
            <User size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 border-r overflow-y-auto bg-gray-50 flex-shrink-0">
            <nav className="p-4">
              <ul className="space-y-1">
                <li className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
                  <span className="text-blue-500">
                    <Layout size={16} />
                  </span>
                  <span>Inbox</span>
                  <span className="ml-auto text-gray-400 text-sm">8</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
                  <span className="text-green-500">
                    <Layout size={16} />
                  </span>
                  <span>Today</span>
                  <span className="ml-auto text-gray-400 text-sm">7</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
                  <span className="text-purple-500">
                    <Layout size={16} />
                  </span>
                  <span>Upcoming</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded hover:bg-gray-200">
                  <span className="text-orange-500">
                    <Layout size={16} />
                  </span>
                  <span>Filters & Labels</span>
                </li>
              </ul>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">My Projects</h3>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1 rounded hover:bg-gray-200"
                      onClick={() => setIsProjectModalOpen(true)}
                    >
                      <Plus size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
                <ul className="space-y-1">
                  {isLoading ? (
                    <li className="flex items-center justify-center p-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                      <span className="ml-2 text-gray-500">Loading projects...</span>
                    </li>
                  ) : projects.length === 0 ? (
                    <li className="flex items-center justify-center p-4 text-gray-500">
                      No projects found. Create one to get started.
                    </li>
                  ) : (
                    projects.map((project) => (
                      <li
                        key={project.id}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded",
                          project.selected ? "bg-gray-200" : "hover:bg-gray-200",
                        )}
                      >
                        <div 
                          className="flex items-center gap-2 flex-1 cursor-pointer"
                          onClick={() => selectProject(project.id)}
                        >
                          <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                          <span>
                            {project.name} {project.icon}
                          </span>
                          <span className="ml-auto text-gray-400 text-sm">{project.count}</span>
                        </div>
                        <button
                          className="p-1 rounded hover:bg-gray-300 text-gray-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmProjectId(project.id);
                          }}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold">Very real project</h1>
              <div className="flex items-center gap-2">
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

            <button className="w-full text-left mb-4 flex items-center text-gray-500 hover:bg-gray-100 p-2 rounded">
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
                  <h2 className="font-medium ml-1">{section.title}</h2>
                  <span className="ml-2 text-gray-400 text-sm">{section.count}</span>
                  <button className="ml-auto p-1 rounded hover:bg-gray-100">
                    <MoreHorizontal size={16} className="text-gray-400" />
                  </button>
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
                              <span className={cn(task.completed && "line-through text-gray-400")}>{task.text}</span>
                            </div>
                            {task.date && (
                              <div className="mt-1">
                                <span
                                  className={cn(
                                    "text-xs px-1.5 py-0.5 rounded",
                                    task.date === "Tomorrow"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : task.date === "Monday"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800",
                                  )}
                                >
                                  {task.date}
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
                                  {subtask.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <button className="flex items-center text-gray-500 hover:bg-gray-100 p-1 rounded">
                      <Plus size={16} className="mr-2" />
                      Add task
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmProjectId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Delete Project</h3>
            <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setDeleteConfirmProjectId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleDeleteProject(deleteConfirmProjectId)}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </div>
  )
}
