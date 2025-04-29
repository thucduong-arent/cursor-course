import { Menu, Home, Search, Plus, Bell, HelpCircle, User } from "lucide-react"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
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
  )
} 