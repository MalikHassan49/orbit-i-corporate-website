import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Logo } from '@/components/layout/Logo'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants'

export interface SidebarNavItem {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

interface DashboardSidebarProps {
  items: SidebarNavItem[]
  footerLabel?: string
  isOpen: boolean
  onClose: () => void
}

export function DashboardSidebar({ items, footerLabel, isOpen, onClose }: DashboardSidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    onClose()
    await logout()
    navigate(ROUTES.home, { replace: true })
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-background-elevated)] transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-[var(--header-height)] items-center border-b border-[var(--color-border)] px-5">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-500/12 text-primary-300 border border-primary-500/25'
                        : 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] border border-transparent'
                    )
                  }
                >
                  <item.icon className="size-4.5" aria-hidden />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-[var(--color-border)] px-3 py-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-transparent px-3.5 py-2.5 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10"
          >
            <LogOut className="size-4.5" aria-hidden />
            Log out
          </button>
        </div>

        {footerLabel && (
          <div className="border-t border-[var(--color-border)] px-5 py-3 text-xs text-[var(--color-text-muted)]">
            {footerLabel}
          </div>
        )}
      </aside>
    </>
  )
}
