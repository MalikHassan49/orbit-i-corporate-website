import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/States'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency, formatDate } from '@/utils/formatters'
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

const MOCK_TICKETS: SupportTicket[] = []

export function ClientSupportPage() {
  const columns: DataTableColumn<SupportTicket>[] = [
    { header: 'Subject', render: (t) => t.subject },
    { header: 'Status', render: (t) => <Badge tone="primary">{t.status}</Badge> },
    { header: 'Opened', render: (t) => formatDate(t.createdAt) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Support</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Open a ticket if you need help with an order or project.</p>
        </div>
        <Button size="md">New ticket</Button>
      </div>
      <DataTable columns={columns} rows={MOCK_TICKETS} keyField={(t) => t.id} emptyTitle="No support tickets" emptyDescription="Open a ticket and our team will respond within one business day." />
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
