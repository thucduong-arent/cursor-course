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

const initialProjects: Project[] = [
  { id: "project-1", name: "Personal", count: 6, icon: "🌟" },
  { id: "project-2", name: "Zapier Work", count: 7 },
  { id: "project-3", name: "Very real project", count: 4, selected: true },
  { id: "project-4", name: "Another real project", count: 0 },
  { id: "project-5", name: "This one is also important", count: 0 },
]

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

  useEffect(() => {
    setSections(initialSections)
    setProjects(initialProjects)
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

      // Add the new project to the list
      const newProject = {
        id: data.project.id,
        name: data.project.name,
        count: 0,
        selected: true,
      }

      // Update projects list, deselecting all other projects
      setProjects(
        projects.map((project) => ({
          ...project,
          selected: false,
        })).concat(newProject)
      )
      
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
                    <button
                      className="p-1 rounded hover:bg-gray-200"
                      onClick={() => {
                        // TODO: Show popup/modal for project name edit
                        // Will need state management for selected project
                      }}
                    >
                      <MoreHorizontal size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
                <ul className="space-y-1">
                  {projects.map((project) => (
                    <li
                      key={project.id}
                      onClick={() => selectProject(project.id)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded cursor-pointer",
                        project.selected ? "bg-gray-200" : "hover:bg-gray-200",
                      )}
                    >
                      <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                      <span>
                        {project.name} {project.icon}
                      </span>
                      <span className="ml-auto text-gray-400 text-sm">{project.count}</span>
                    </li>
                  ))}
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
