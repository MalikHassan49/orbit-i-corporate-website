import { Badge } from '@/components/ui/Badge'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/States'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { orderService } from '@/services/orderService'
import { useFetch } from '@/hooks/useFetch'
import type { Order, OrderStatus } from '@/types'

const statusTone: Record<OrderStatus, 'primary' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  pending: 'warning',
  confirmed: 'primary',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'danger',
}

const columns: DataTableColumn<Order>[] = [
  { header: 'Order', render: (o) => <span className="font-medium">#{o.id.slice(-6)}</span> },
  { header: 'Items', render: (o) => o.items.map((i) => i.productName).join(', ') },
  { header: 'Total', render: (o) => formatCurrency(o.total, o.currency) },
  {
    header: 'Status',
    render: (o) => <Badge tone={statusTone[o.status]}>{o.status.replace('_', ' ')}</Badge>,
  },
  { header: 'Date', render: (o) => formatDate(o.createdAt) },
]

export function ClientOrdersPage() {
  const { data: orders, isLoading, error, refetch } = useFetch(() => orderService.listMine(), [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Orders</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Track the status of everything you've ordered from ORBIT-I.</p>
      </div>
      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          rows={orders ?? []}
          keyField={(o) => o.id}
          emptyTitle="No orders yet"
          emptyDescription="Orders you place from the products page will show up here."
        />
      )}
    </div>
  )
}
