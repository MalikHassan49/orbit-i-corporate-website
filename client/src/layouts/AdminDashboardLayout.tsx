import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FolderKanban,
  Briefcase,
  FileText,
  Inbox,
  Star,
  UsersRound,
  Settings,
} from 'lucide-react'
import { DashboardSidebar, type SidebarNavItem } from '@/components/dashboard/DashboardSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ROUTES } from '@/constants'

const navItems: SidebarNavItem[] = [
  { label: 'Overview', to: ROUTES.adminDashboard, icon: LayoutDashboard, end: true },
  { label: 'Clients', to: ROUTES.adminClients, icon: Users },
  { label: 'Products', to: ROUTES.adminProducts, icon: Package },
  { label: 'Orders', to: ROUTES.adminOrders, icon: ShoppingCart },
  { label: 'Projects', to: ROUTES.adminProjects, icon: FolderKanban },
  { label: 'Careers', to: ROUTES.adminCareers, icon: Briefcase },
  { label: 'Applications', to: ROUTES.adminApplications, icon: FileText },
  { label: 'Leads', to: ROUTES.adminLeads, icon: Inbox },
  { label: 'Case Studies', to: ROUTES.adminCaseStudies, icon: FileText },
  { label: 'Testimonials', to: ROUTES.adminTestimonials, icon: Star },
  { label: 'Team', to: ROUTES.adminTeam, icon: UsersRound },
  { label: 'Settings', to: ROUTES.adminSettings, icon: Settings },
]

const titleByPath: Record<string, string> = {
  [ROUTES.adminDashboard]: 'Overview',
  [ROUTES.adminClients]: 'Clients',
  [ROUTES.adminProducts]: 'Products',
  [ROUTES.adminOrders]: 'Orders',
  [ROUTES.adminProjects]: 'Projects',
  [ROUTES.adminCareers]: 'Careers',
  [ROUTES.adminApplications]: 'Applications',
  [ROUTES.adminLeads]: 'Leads',
  [ROUTES.adminCaseStudies]: 'Case Studies',
  [ROUTES.adminTestimonials]: 'Testimonials',
  [ROUTES.adminTeam]: 'Team',
  [ROUTES.adminSettings]: 'Settings',
}

export function AdminDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <DashboardSidebar
        items={navItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        footerLabel="ORBIT-I Admin Console"
      />
      <div className="flex flex-1 flex-col">
        <DashboardHeader title={titleByPath[pathname] ?? 'Admin'} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
