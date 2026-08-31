import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button, Modal } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/States'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { projectService } from '@/services/projectService'
import { adminService } from '@/services/adminService'
import { useFetch } from '@/hooks/useFetch'
import { getApiErrorMessage } from '@/utils/apiError'
import type { Project, ProjectStatus } from '@/types'

const statusTone: Record<ProjectStatus, 'primary' | 'success' | 'warning' | 'neutral'> = {
  planning: 'neutral',
  in_progress: 'primary',
  on_hold: 'warning',
  completed: 'success',
}

type AdminProject = Project & { client?: { fullName: string; email: string } }

const emptyForm = { name: '', clientId: '', assignedTeam: '', startDate: '', targetDate: '' }

export function AdminProjectsPage() {
  const { data: projects, isLoading, error, refetch } = useFetch(() => projectService.listAll(), [])
  const { data: clientsResult } = useFetch(() => adminService.listClients({ limit: 100 }), [])
  const items = (projects ?? []) as AdminProject[]
  const clients = clientsResult?.items ?? []

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = () => {
    setForm({ ...emptyForm, clientId: clients[0]?.id ?? '', startDate: new Date().toISOString().slice(0, 10) })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCreate = async () => {
    if (!form.name || !form.clientId || !form.startDate) {
      setFormError('Please fill in all required fields.')
      return
    }
    setFormError(null)
    setIsSubmitting(true)
    try {
      await adminService.createProject({
        name: form.name,
        client: form.clientId,
        assignedTeam: form.assignedTeam.split(',').map((t) => t.trim()).filter(Boolean),
        startDate: form.startDate,
        targetDate: form.targetDate || undefined,
      })
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Could not create the project.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: DataTableColumn<AdminProject>[] = [
    { header: 'Project', render: (p) => <span className="font-medium">{p.name}</span> },
    { header: 'Client', render: (p) => p.client?.fullName ?? '—' },
    { header: 'Team', render: (p) => p.assignedTeam.join(', ') || '—' },
    { header: 'Progress', render: (p) => `${p.progress}%` },
    { header: 'Status', render: (p) => <Badge tone={statusTone[p.status]}>{p.status.replace('_', ' ')}</Badge> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Projects</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Projects assigned to your team, by client.</p>
        </div>
        <Button size="md" onClick={openModal} disabled={clients.length === 0}>
          <Plus className="size-4" aria-hidden /> New project
        </Button>
      </div>
      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable columns={columns} rows={items} keyField={(p) => p.id} emptyTitle="No projects yet" />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New project">
        <div className="flex flex-col gap-4">
          <Input label="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Orbit CRM — Custom Integration" />
          <div>
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Client</label>
            <select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>
              ))}
            </select>
            {clients.length === 0 && (
              <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">No registered clients yet — a client must sign up before you can assign a project.</p>
            )}
          </div>
          <Input label="Assigned team (comma-separated names)" value={form.assignedTeam} onChange={(e) => setForm({ ...form, assignedTeam: e.target.value })} placeholder="Ayesha K., Bilal R." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="Target date" type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
          </div>
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button onClick={handleCreate} isLoading={isSubmitting} className="mt-2">
            Create project
          </Button>
        </div>
      </Modal>
    </div>
  )
}
