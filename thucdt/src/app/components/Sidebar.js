'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import {
  HomeIcon,
  BeakerIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ReceiptPercentIcon,
  BookOpenIcon,
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

function UserProfile({ image, name, email, loading, children }) {
	return (
		<div className="flex items-center gap-3">
			{loading ? (
				<div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
			) : image ? (
				<Image
					src={image}
					alt={name}
					width={32}
					height={32}
					className="rounded-full"
				/>
			) : (
				<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
					<UserCircleIcon className="w-6 h-6 text-purple-500" />
				</div>
			)}
			<div className="flex-1 min-w-0">
				{loading ? (
					<>
						<div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
						<div className="h-3 w-32 bg-gray-200 rounded mt-1 animate-pulse"></div>
					</>
				) : (
					<>
						<p className="text-sm font-medium text-gray-900 truncate">{name}</p>
						{typeof email === 'string' ? (
							<p className="text-xs text-gray-500 truncate">{email}</p>
						) : email}
					</>
				)}
				{children}
			</div>
		</div>
	)
}

export default function Sidebar({ onToggle }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { data: session, status } = useSession()
  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    if (session?.user) {
      // Extract user details from the session
      setUserDetails({
        name: session.user.name || 'User',
        email: session.user.email || '',
        image: session.user.image || null
      })
    }
  }, [session])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    onToggle?.(!isCollapsed)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/auth/signin')
  }

  const menuItems = [
    { name: 'Overview', href: '/dashboards', icon: HomeIcon },
    { name: 'API Playground', href: '/playground', icon: CodeBracketIcon },
    { name: 'TODO', href: '/todo-app', icon: ClipboardDocumentListIcon },
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
          
          {/* User Profile Section */}
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg bg-gray-50">
            {status === 'loading' ? (
              <UserProfile loading />
            ) : userDetails ? (
              <div className="space-y-3">
                <UserProfile
                  image={userDetails.image}
                  name={userDetails.name}
                  email={userDetails.email}
                >
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mt-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </UserProfile>
              </div>
            ) : (
              <UserProfile
                name="Not signed in"
                email={
                  <Link href="/auth/signin" className="text-xs text-purple-600 hover:underline">
                    Sign in
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </aside>
    </>
  )
} 