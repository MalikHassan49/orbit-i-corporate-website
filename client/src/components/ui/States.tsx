import type { ReactNode } from 'react'
import { AlertTriangle, Inbox } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-white/5 text-[var(--color-text-muted)]">
        {icon ?? <Inbox className="size-5" aria-hidden />}
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {description && <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">{description}</p>}
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick} className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'That request failed. Check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
        <AlertTriangle className="size-5" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  )
}
