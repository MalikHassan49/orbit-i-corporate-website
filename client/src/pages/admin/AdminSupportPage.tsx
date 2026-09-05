import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/States'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { formatDate } from '@/utils/formatters'
import { getApiErrorMessage } from '@/utils/apiError'
import { supportService, type SupportTicketRecord } from '@/services/supportService'
import { useFetch } from '@/hooks/useFetch'
import type { SupportTicketStatus } from '@/types'

const statusTone: Record<SupportTicketStatus, 'primary' | 'success' | 'warning' | 'neutral'> = {
  open: 'primary',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'neutral',
}

const statuses: SupportTicketStatus[] = ['open', 'in_progress', 'resolved', 'closed']

export function AdminSupportPage() {
  const { data: tickets, isLoading, error, refetch } = useFetch(() => supportService.listAll(), [])
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: SupportTicketStatus) => {
    setUpdateError(null)
    setUpdatingId(id)
    try {
      await supportService.updateStatus(id, status)
      refetch()
    } catch (err) {
      setUpdateError(getApiErrorMessage(err, 'Could not update the ticket status.'))
    } finally {
      setUpdatingId(null)
    }
  }

  const columns: DataTableColumn<SupportTicketRecord>[] = [
    { header: 'Subject', render: (ticket) => <span className="font-medium">{ticket.subject}</span> },
    {
      header: 'Client',
      render: (ticket) => (
        <div>
          <p>{ticket.user.fullName}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{ticket.user.email}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (ticket) => <Badge tone={statusTone[ticket.status]}>{ticket.status.replace('_', ' ')}</Badge>,
    },
    { header: 'Opened', render: (ticket) => formatDate(ticket.createdAt) },
    {
      header: '',
      render: (ticket) => (
        <div className="flex items-center gap-2">
          <select
            value={ticket.status}
            disabled={updatingId === ticket.id}
            onChange={(event) => handleStatusChange(ticket.id, event.target.value as SupportTicketStatus)}
            aria-label={`Update status for ${ticket.subject}`}
            className="h-9 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-2.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>
          {updatingId === ticket.id && <span className="text-xs text-[var(--color-text-secondary)]">Saving...</span>}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Support</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Review and manage client support tickets.</p>
      </div>
      {updateError && <p className="text-sm text-[var(--color-danger)]">{updateError}</p>}
      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          rows={tickets ?? []}
          keyField={(ticket) => ticket.id}
          emptyTitle="No support tickets"
          emptyDescription="Client support tickets will appear here."
        />
      )}
    </div>
  )
}
