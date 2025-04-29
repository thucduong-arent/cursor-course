import { Layout, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Project = {
  id: string
  name: string
  count: number
  selected?: boolean
  icon?: string
}

interface SidebarProps {
  sidebarOpen: boolean
  projects: Project[]
  isLoading: boolean
  setIsProjectModalOpen: (open: boolean) => void
  selectProject: (projectId: string) => void
  setDeleteConfirmProjectId: (projectId: string | null) => void
}

export default function Sidebar({
  sidebarOpen,
  projects,
  isLoading,
  setIsProjectModalOpen,
  selectProject,
  setDeleteConfirmProjectId
}: SidebarProps) {
  return (
    <>
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
    </>
  )
} 