import AppRouterHeaders from '@/components/app-router-headers'

export default function DashboardLayout({ children }) {
	return (
		<div className="container mx-auto px-4 py-8">
			<AppRouterHeaders />
			{children}
		</div>
	)
} 