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
import { useAuth } from '@/contexts/AuthContext'

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
  { label: 'Blog', to: ROUTES.adminBlog, icon: FileText },
  { label: 'Categories', to: ROUTES.adminCategories, icon: FolderKanban },
  { label: 'Tags', to: ROUTES.adminTags, icon: Star },
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
  [ROUTES.adminBlog]: 'Blog',
  [ROUTES.adminCategories]: 'Categories',
  [ROUTES.adminTags]: 'Tags',
  [ROUTES.adminTestimonials]: 'Testimonials',
  [ROUTES.adminTeam]: 'Team',
  [ROUTES.adminSettings]: 'Settings',
}

export function AdminDashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()
  const visibleNavItems = user?.role === 'editor'
    ? navItems.filter(
      (item) => item.to === ROUTES.adminBlog
        || item.to === ROUTES.adminCaseStudies
        || item.to === ROUTES.adminCategories
        || item.to === ROUTES.adminTags,
    )
    : navItems

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <DashboardSidebar
        items={visibleNavItems}
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
