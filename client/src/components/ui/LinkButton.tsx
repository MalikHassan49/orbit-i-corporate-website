import type { ComponentProps } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[image:var(--gradient-brand)] text-white shadow-[var(--glow-primary)] hover:brightness-110 active:brightness-95',
  outline:
    'border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:border-primary-400 hover:bg-white/5',
  ghost: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5',
  danger: 'bg-[var(--color-danger)] text-white hover:brightness-110',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
}

/** A React Router <Link> styled identically to <Button>, for nav CTAs. */
export function LinkButton({ className, variant = 'primary', size = 'md', children, ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium',
        'transition-all duration-200 ease-out whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
