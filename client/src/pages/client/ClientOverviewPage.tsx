import { Link } from 'react-router-dom'
import { ShoppingBag, FolderKanban, Receipt, LifeBuoy, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState } from '@/components/ui/States'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/constants'
import { orderService } from '@/services/orderService'
import { projectService } from '@/services/projectService'
import { useFetch } from '@/hooks/useFetch'

export function ClientOverviewPage() {
  const { user } = useAuth()
  const { data: orders, isLoading: ordersLoading } = useFetch(() => orderService.listMine(), [])
  const { data: projects, isLoading: projectsLoading } = useFetch(() => projectService.listMine(), [])

  const isLoading = ordersLoading || projectsLoading
  const activeOrders = (orders ?? []).filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length
  const activeProjects = (projects ?? []).filter((p) => p.status !== 'completed').length
  const featuredProject = (projects ?? [])[0]

  const summaryCards = [
    { label: 'Active orders', value: String(activeOrders), icon: ShoppingBag, to: ROUTES.clientOrders },
    { label: 'Active projects', value: String(activeProjects), icon: FolderKanban, to: ROUTES.clientProjects },
    { label: 'Open invoices', value: '0', icon: Receipt, to: ROUTES.clientInvoices },
    { label: 'Support tickets', value: '0', icon: LifeBuoy, to: ROUTES.clientSupport },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
          Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Here's a quick look at what's happening on your account.
        </p>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <Link key={card.label} to={card.to}>
                <Card className="flex flex-col gap-3">
                  <div className="flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-primary-500/10 text-primary-300">
                    <card.icon className="size-4.5" aria-hidden />
                  </div>
                  <p className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">{card.value}</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{card.label}</p>
                </Card>
              </Link>
            ))}
          </div>

          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                {featuredProject ? 'Active project' : 'Projects'}
              </h3>
              {featuredProject && (
                <Link
                  to={ROUTES.clientProjectDetail(featuredProject.id)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-400 hover:text-primary-300"
                >
                  View details <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              )}
            </div>
            {featuredProject ? (
              <>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{featuredProject.name}</p>
                    <Badge tone="primary" className="mt-2">{featuredProject.status.replace('_', ' ')}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                      {featuredProject.progress}%
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">Complete</p>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-brand)]"
                    style={{ width: `${featuredProject.progress}%` }}
                  />
                </div>
              </>
            ) : (
              <div className="mt-4">
                <EmptyState title="No projects yet" description="Projects ORBIT-I builds for you will show up here." />
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
