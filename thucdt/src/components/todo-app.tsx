"use client"

import { useState, useEffect } from "react"
import ProjectModal, { ItemType } from "./TodoCreateModal"
import Notification from "@/app/components/Notification"
import Header from "./Header"
import Sidebar from "./Sidebar"
import MainContent from "./MainContent"
import DeleteConfirmationModal from "./DeleteConfirmationModal"

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

const initialSections: Section[] = [
  {
    id: "section-1",
    name: "This is a section",
    collapsed: false,
    project_id: "default",
    tasks: [
      { id: "task-1-1", title: "This is a task for me to do", completed: false, due_date: "Tomorrow", section_id: "section-1" },
      { id: "task-1-2", title: "And another task", completed: false, due_date: "Monday", section_id: "section-1" },
    ],
  },
  {
    id: "section-2",
    name: "This is another section",
    collapsed: false,
    project_id: "default",
    tasks: [
      {
        id: "task-2-1",
        title: "Oh look, more tasks",
        completed: false,
        due_date: "0/1",
        collapsed: false,
        section_id: "section-2",
        subtasks: [{ id: "subtask-2-1-1", title: "With sub-tasks!", completed: false, section_id: "section-2" }],
      },
    ],
  },
]

// Custom error type with status code
interface ApiError extends Error {
  status?: number;
}

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

// Function to fetch sections and tasks for a project
async function fetchProjectData(projectId: string) {
  try {
    // Fetch sections for the project
    const sectionsResponse = await fetch(`/api/sections?project_id=${projectId}`)
    if (!sectionsResponse.ok) {
      throw new Error('Failed to fetch sections')
    }
    const sectionsData = await sectionsResponse.json()

    // Fetch tasks for the project
    const tasksResponse = await fetch(`/api/tasks?project_id=${projectId}`)
    if (!tasksResponse.ok) {
      throw new Error('Failed to fetch tasks')
    }
    const tasksData = await tasksResponse.json()

    // Group tasks by section
    const sections = sectionsData.sections.map((section: any) => {
      const sectionTasks = tasksData.tasks
        .filter((task: Task) => task.section_id === section.id)
        .map((task: Task) => ({
          ...task,
          completed: task.completed || false,
          collapsed: false
        }))

      return {
        id: section.id,
        name: section.name,
        tasks: sectionTasks,
        collapsed: false,
        project_id: section.project_id
      }
    })

    return sections
  } catch (error) {
    console.error('Error fetching project data:', error)
    throw error
  }
}

export default function TodoApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sections, setSections] = useState<Section[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
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

  const selectProject = async (projectId: string) => {
    setIsLoading(true)
    try {
      // Update selected state in projects list
      setProjects(
        projects.map((project) => ({
          ...project,
          selected: project.id === projectId,
        })),
      )
      setSelectedProjectId(projectId)

      // Fetch and set sections and tasks for the selected project
      const projectSections = await fetchProjectData(projectId)
      setSections(projectSections)
    } catch (error) {
      console.error('Error loading project data:', error)
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to load project data',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
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
        // Pass the status code along with the error
        const error = new Error(data.error || 'Failed to create project') as ApiError
        error.status = response.status
        throw error
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
      // Re-throw the error so the ProjectModal can handle it
      throw error
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

  const handleCreateSection = async (name: string) => {
    if (!selectedProjectId) {
      throw new Error('Please select a project first')
    }

    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          project_id: selectedProjectId
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Pass the status code along with the error
        const error = new Error(data.error || 'Failed to create project') as ApiError
        error.status = response.status
        throw error
      }

      // Refresh the sections
      const updatedSections = await fetchProjectData(selectedProjectId)
      setSections(updatedSections)

      setNotification({
        show: true,
        message: 'Section created successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating section:', error)
      throw error
    }
  }

  const handleCreateTask = async (name: string) => {
    if (!selectedProjectId || !selectedSectionId) {
      throw new Error('Please select a project and section first')
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: name,
          section_id: selectedSectionId,
          project_id: selectedProjectId
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task')
      }

      // Refresh the sections
      const updatedSections = await fetchProjectData(selectedProjectId)
      setSections(updatedSections)

      setNotification({
        show: true,
        message: 'Task created successfully',
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const refreshSections = async () => {
    if (selectedProjectId) {
      try {
        const updatedSections = await fetchProjectData(selectedProjectId)
        setSections(updatedSections)
      } catch (error) {
        console.error('Error refreshing sections:', error)
        setNotification({
          show: true,
          message: 'Failed to refresh sections',
          type: 'error'
        })
      }
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen}
          projects={projects}
          isLoading={isLoading}
          setIsProjectModalOpen={setIsProjectModalOpen}
          selectProject={selectProject}
          setDeleteConfirmProjectId={setDeleteConfirmProjectId}
        />

        {/* Main content */}
        <MainContent 
          sections={sections}
          isLoading={isLoading}
          selectedProject={projects.find(p => p.id === selectedProjectId) || null}
          selectedSectionId={selectedSectionId}
          setSelectedSectionId={setSelectedSectionId}
          setIsSectionModalOpen={setIsSectionModalOpen}
          setIsTaskModalOpen={setIsTaskModalOpen}
          toggleSection={toggleSection}
          toggleTask={toggleTask}
          toggleSubtask={toggleSubtask}
          toggleTaskCollapse={toggleTaskCollapse}
          setNotification={setNotification}
          refreshSections={refreshSections}
        />
      </div>

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
        type="project"
      />

      {/* Section Creation Modal */}
      <ProjectModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        onSubmit={handleCreateSection}
        type="section"
      />

      {/* Task Creation Modal */}
      <ProjectModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        type="task"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        deleteConfirmProjectId={deleteConfirmProjectId}
        isLoading={isLoading}
        setDeleteConfirmProjectId={setDeleteConfirmProjectId}
        handleDeleteProject={handleDeleteProject}
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
