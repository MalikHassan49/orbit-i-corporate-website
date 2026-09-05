import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Button, Modal } from '@/components/ui'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/States'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { formatDate } from '@/utils/formatters'
import { adminService } from '@/services/adminService'
import { useFetch } from '@/hooks/useFetch'
import { useAuth } from '@/contexts/AuthContext'
import { getApiErrorMessage } from '@/utils/apiError'
import type { User } from '@/types'

export function AdminClientsPage() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [accountForm, setAccountForm] = useState({ fullName: '', email: '', password: '' })
  const [accountError, setAccountError] = useState<string | null>(null)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const { data: result, isLoading, error, refetch } = useFetch(
    () => adminService.listClients({ search: query || undefined }),
    [query]
  )
  const clients = result?.items ?? []

  const toggleActive = async (client: User) => {
    await adminService.setClientActive(client.id, !client.isActive)
    refetch()
  }

  const openCreateDialog = () => {
    setAccountForm({ fullName: '', email: '', password: '' })
    setAccountError(null)
    setIsInviteOpen(true)
  }

  const handleCreateAccount = async () => {
    const fullName = accountForm.fullName.trim()
    const email = accountForm.email.trim()
    const password = accountForm.password.trim()

    if (!fullName || !email || !password) {
      setAccountError('Please provide a name, email, and password for the SEO manager account.')
      return
    }

    setAccountError(null)
    setIsCreatingAccount(true)
    try {
      await adminService.createSeoManager({ fullName, email, password })
      setIsInviteOpen(false)
      setAccountForm({ fullName: '', email: '', password: '' })
    } catch (err) {
      setAccountError(getApiErrorMessage(err, 'Could not create the SEO manager account.'))
    } finally {
      setIsCreatingAccount(false)
    }
  }

  const columns: DataTableColumn<User>[] = [
    { header: 'Name', render: (c) => <span className="font-medium">{c.fullName}</span> },
    { header: 'Email', render: (c) => c.email },
    { header: 'Joined', render: (c) => formatDate(c.createdAt) },
    { header: 'Status', render: (c) => <Badge tone={c.isActive ? 'success' : 'danger'}>{c.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      header: '',
      render: (c) => (
        <Button size="sm" variant="outline" onClick={() => toggleActive(c)}>
          {c.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Clients</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {result ? `${result.totalItems} registered clients` : 'Loading…'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row sm:items-center sm:justify-end">
          {user?.role === 'super_admin' && (
            <Button size="md" variant="outline" onClick={openCreateDialog}>
              Create SEO manager
            </Button>
          )}
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden />
            <Input placeholder="Search clients…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" aria-label="Search clients" />
          </div>
        </div>
      </div>
      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable columns={columns} rows={clients} keyField={(c) => c.id} emptyTitle="No clients found" />
      )}

      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Create SEO manager account">
        <div className="flex flex-col gap-4">
          <Input label="Full name" value={accountForm.fullName} onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })} placeholder="Jane SEO" />
          <Input label="Email" type="email" value={accountForm.email} onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })} placeholder="seo@orbit-i.com" />
          <Input label="Temporary password" type="password" value={accountForm.password} onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })} placeholder="••••••••" />
          {accountError && <p className="text-sm text-[var(--color-danger)]">{accountError}</p>}
          <Button onClick={handleCreateAccount} isLoading={isCreatingAccount}>Create account</Button>
        </div>
      </Modal>
    </div>
  )
}
