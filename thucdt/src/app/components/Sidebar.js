'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  BeakerIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ReceiptPercentIcon,
  BookOpenIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function Sidebar({ onToggle }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    onToggle?.(!isCollapsed)
  }

  const menuItems = [
    { name: 'Overview', href: '/dashboards', icon: HomeIcon },
    { name: 'Research Assistant', href: '/research-assistant', icon: BeakerIcon },
    { name: 'Research Reports', href: '/research-reports', icon: DocumentTextIcon },
    { name: 'API Playground', href: '/api-playground', icon: CodeBracketIcon },
    { name: 'Invoices', href: '/invoices', icon: ReceiptPercentIcon },
    { name: 'Documentation', href: '/documentation', icon: BookOpenIcon, external: true },
  ]

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={`fixed top-6 ${isCollapsed ? 'left-6' : 'left-[280px]'} z-50 p-2.5 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300`}
      >
        {isCollapsed ? (
          <Bars3Icon className="w-5 h-5 text-white" />
        ) : (
          <XMarkIcon className="w-5 h-5 text-white" />
        )}
      </button>
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isCollapsed ? '-translate-x-full w-0 opacity-0' : 'translate-x-0 w-[300px] opacity-100'
        }`}
      >
        <div className={`transition-all duration-300 ${isCollapsed ? 'invisible' : 'visible'}`}>
          <div className="px-6 py-6">
            <h1 className="text-xl font-bold">ThucDT AI</h1>
          </div>
          <nav className="px-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg group ${
                    isActive 
                      ? 'text-purple-600 bg-purple-50 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                  {item.external && (
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-auto text-gray-400" />
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Eden Marco</p>
                <p className="text-xs text-gray-500 truncate">app.thucdt.com/home#</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
} 