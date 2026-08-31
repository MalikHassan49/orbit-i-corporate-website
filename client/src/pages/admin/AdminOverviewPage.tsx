import { Users, ShoppingCart, Package, FolderKanban, DollarSign, Inbox } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/States'
import { formatCurrency } from '@/utils/formatters'
import { adminService } from '@/services/adminService'
import { useFetch } from '@/hooks/useFetch'

export function AdminOverviewPage() {
  const { data: metrics, isLoading, error, refetch } = useFetch(() => adminService.getMetrics(), [])

  if (isLoading) return <PageLoader />
  if (error || !metrics) return <ErrorState onRetry={refetch} />

  const cards = [
    { label: 'Total clients', value: String(metrics.totalClients), icon: Users },
    { label: 'Total orders', value: String(metrics.totalOrders), icon: ShoppingCart },
    { label: 'Active products', value: String(metrics.activeProducts), icon: Package },
    { label: 'Active projects', value: String(metrics.activeProjects), icon: FolderKanban },
    { label: 'Revenue (confirmed+)', value: formatCurrency(metrics.revenue), icon: DollarSign },
    { label: 'Pending leads', value: String(metrics.pendingLeads), icon: Inbox },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((m) => (
          <Card key={m.label} hoverable={false} className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary-500/10 text-primary-300">
              <m.icon className="size-5" aria-hidden />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">{m.value}</p>
              <p className="text-sm text-[var(--color-text-secondary)]">{m.label}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
