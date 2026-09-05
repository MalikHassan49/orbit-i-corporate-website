import { useState, type FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button, Modal } from '@/components/ui'
import { Badge } from '@/components/ui/Badge'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { PageLoader } from '@/components/ui/Loader'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { getApiErrorMessage } from '@/utils/apiError'
import { supportService } from '@/services/supportService'
import { useFetch } from '@/hooks/useFetch'
import type { Invoice, SupportTicket } from '@/types'

export function ClientProfilePage() {
  const { user } = useAuth()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { fullName: user?.fullName ?? '', email: user?.email ?? '' },
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Profile</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Manage your account details.</p>
      </div>
      <Card hoverable={false} className="max-w-lg">
        <form onSubmit={handleSubmit(() => {})} className="flex flex-col gap-4">
          <Input label="Full name" {...register('fullName')} />
          <Input label="Email" type="email" disabled hint="Contact support to change your email address." {...register('email')} />
          <Button type="submit" isLoading={isSubmitting} className="mt-2 self-start">
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  )
}

export function ClientSettingsPage() {
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyProject, setNotifyProject] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Settings</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Notification preferences for your account.</p>
      </div>
      <Card hoverable={false} className="max-w-lg divide-y divide-[var(--color-border)]">
        <ToggleRow label="Email notifications" description="Receive order and project updates by email." checked={notifyEmail} onChange={setNotifyEmail} />
        <ToggleRow label="Project milestone alerts" description="Get notified when a milestone is completed." checked={notifyProject} onChange={setNotifyProject} />
      </Card>
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export function ClientSupportPage() {
  const { data: tickets, isLoading, error, refetch } = useFetch(() => supportService.listMine(), [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ subject: '', message: '' })
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const columns: DataTableColumn<SupportTicket>[] = [
    { header: 'Subject', render: (t) => t.subject },
    { header: 'Status', render: (t) => <Badge tone="primary">{t.status}</Badge> },
    { header: 'Opened', render: (t) => formatDate(t.createdAt) },
  ]

  const openModal = () => {
    setForm({ subject: '', message: '' })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.subject.trim() || !form.message.trim()) {
      setFormError('Please fill in both the subject and message.')
      return
    }
    if (form.subject.trim().length < 3) {
      setFormError('Subject must be at least 3 characters.')
      return
    }
    if (form.message.trim().length < 10) {
      setFormError('Message must be at least 10 characters.')
      return
    }

    setFormError(null)
    setIsSubmitting(true)
    try {
      await supportService.create({ subject: form.subject.trim(), message: form.message.trim() })
      setIsModalOpen(false)
      setForm({ subject: '', message: '' })
      refetch()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Could not create your support ticket. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Support</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Open a ticket if you need help with an order or project.</p>
        </div>
        <Button size="md" onClick={openModal}>New ticket</Button>
      </div>
      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <DataTable
          columns={columns}
          rows={tickets ?? []}
          keyField={(t) => t.id}
          emptyTitle="No support tickets"
          emptyDescription="Open a ticket and our team will respond within one business day."
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New support ticket">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Subject"
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
            placeholder="What do you need help with?"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="support-message" className="text-sm font-medium text-[var(--color-text-primary)]">
              Message
            </label>
            <textarea
              id="support-message"
              rows={5}
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              placeholder="Tell us how we can help."
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button type="submit" isLoading={isSubmitting} className="mt-2">
            Submit ticket
          </Button>
        </form>
      </Modal>
    </div>
  )
}

const MOCK_INVOICES: Invoice[] = []

export function ClientInvoicesPage() {
  const columns: DataTableColumn<Invoice>[] = [
    { header: 'Invoice', render: (i) => `#${i.id}` },
    { header: 'Amount', render: (i) => formatCurrency(i.amount, i.currency) },
    { header: 'Status', render: (i) => <Badge tone={i.status === 'paid' ? 'success' : 'warning'}>{i.status}</Badge> },
    { header: 'Date', render: (i) => formatDate(i.issuedAt) },
  ]

  if (MOCK_INVOICES.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Invoices</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Billing history for your account.</p>
        </div>
        <EmptyState title="No invoices yet" description="Invoices for your orders and projects will appear here." />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Invoices</h2>
      <DataTable columns={columns} rows={MOCK_INVOICES} keyField={(i) => i.id} />
    </div>
  )
}
