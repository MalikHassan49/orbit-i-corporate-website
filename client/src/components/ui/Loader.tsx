import { cn } from '@/utils/cn'

interface LoaderProps {
  size?: number
  className?: string
  label?: string
}

/** Orbit-themed loading indicator: a small dot orbiting a ring, echoing the brand mark. */
export function Loader({ size = 28, className, label = 'Loading' }: LoaderProps) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)} role="status" aria-label={label}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="animate-spin" style={{ animationDuration: '1.1s' }}>
        <circle cx="20" cy="20" r="16" stroke="var(--color-border-strong)" strokeWidth="3" />
        <path
          d="M36 20a16 16 0 0 0-16-16"
          stroke="var(--color-accent-cyan)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <Loader size={40} />
    </div>
  )
}
