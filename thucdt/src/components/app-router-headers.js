'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const AppRouterHeaders = () => {
	const pathname = usePathname()

	const isActive = (path) => {
		return pathname === path
	}

	return (
		<div className="flex items-center space-x-4 mb-6">
			{/* Navigation links can be added here as needed */}
		</div>
	)
}

export default AppRouterHeaders 