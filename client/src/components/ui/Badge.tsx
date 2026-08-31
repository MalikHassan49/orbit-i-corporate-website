import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneStyles: Record<Tone, string> = {
  primary: 'bg-primary-500/15 text-primary-300 border-primary-500/30',
  success: 'bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/30',
  warning: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)] border-[var(--color-warning)]/30',
  danger: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)] border-[var(--color-danger)]/30',
  neutral: 'bg-white/5 text-[var(--color-text-secondary)] border-[var(--color-border-strong)]',
}

export function Badge({ className, tone = 'neutral', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
