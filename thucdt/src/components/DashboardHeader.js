export default function DashboardHeader() {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Overview</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1 bg-white rounded-full shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Operational</span>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">CURRENT PLAN</h2>
          <button className="px-4 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30">
            Manage Plan
          </button>
        </div>
        <h3 className="text-2xl font-bold mb-4">Researcher</h3>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span>API Limit</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-lg">24/1,000 Requests</div>
        </div>
      </div>
    </header>
  )
} 