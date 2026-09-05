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
  const [editorForm, setEditorForm] = useState({ fullName: '', email: '', password: '' })
  const [editorError, setEditorError] = useState<string | null>(null)
  const [isCreatingEditor, setIsCreatingEditor] = useState(false)
  const { data: result, isLoading, error, refetch } = useFetch(
    () => adminService.listClients({ search: query || undefined }),
    [query]
  )
  const clients = result?.items ?? []

  const toggleActive = async (client: User) => {
    await adminService.setClientActive(client.id, !client.isActive)
    refetch()
  }

  const handleCreateEditor = async () => {
    const fullName = editorForm.fullName.trim()
    const email = editorForm.email.trim()
    const password = editorForm.password.trim()

    if (!fullName || !email || !password) {
      setEditorError('Please provide a name, email, and password for the editor account.')
      return
    }

    setEditorError(null)
    setIsCreatingEditor(true)
    try {
      await adminService.createEditor({ fullName, email, password })
      setIsInviteOpen(false)
      setEditorForm({ fullName: '', email: '', password: '' })
    } catch (err) {
      setEditorError(getApiErrorMessage(err, 'Could not create the editor account.'))
    } finally {
      setIsCreatingEditor(false)
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
            <Button size="md" variant="outline" onClick={() => setIsInviteOpen(true)}>
              Create editor
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

      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Create editor account">
        <div className="flex flex-col gap-4">
          <Input label="Full name" value={editorForm.fullName} onChange={(e) => setEditorForm({ ...editorForm, fullName: e.target.value })} placeholder="Jane Editor" />
          <Input label="Email" type="email" value={editorForm.email} onChange={(e) => setEditorForm({ ...editorForm, email: e.target.value })} placeholder="editor@orbit-i.com" />
          <Input label="Temporary password" type="password" value={editorForm.password} onChange={(e) => setEditorForm({ ...editorForm, password: e.target.value })} placeholder="••••••••" />
          {editorError && <p className="text-sm text-[var(--color-danger)]">{editorError}</p>}
          <Button onClick={handleCreateEditor} isLoading={isCreatingEditor}>Create account</Button>
        </div>
      </Modal>
    </div>
  )
}
