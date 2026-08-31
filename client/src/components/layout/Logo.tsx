import { Link } from 'react-router-dom'
import orbitLogo from '@/assets/brand/orbit-i-logo.png'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

interface LogoProps {
  className?: string
  imgClassName?: string
  showWordmark?: boolean
}

/**
 * Renders the official ORBIT-I logo asset. Do not recolor, stretch, or
 * otherwise distort this image — per brand guidelines it is used as-is,
 * scaled proportionally only.
 */
export function Logo({ className, imgClassName, showWordmark = true }: LogoProps) {
  return (
    <Link to={ROUTES.home} className={cn('flex items-center gap-2.5 shrink-0', className)}>
      <img
        src={orbitLogo}
        alt="ORBIT-I logo"
        className={cn('h-9 w-9 object-contain', imgClassName)}
      />
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
          ORBIT<span className="text-primary-400">-I</span>
        </span>
      )}
    </Link>
  )
}
