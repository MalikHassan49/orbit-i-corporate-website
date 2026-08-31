import { socialLinks } from '@/config/socialLinks'
import { cn } from '@/utils/cn'

interface SocialLinksProps {
  className?: string
  iconClassName?: string
}

export function SocialLinks({ className, iconClassName }: SocialLinksProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target={social.url.startsWith('mailto:') ? undefined : '_blank'}
          rel={social.url.startsWith('mailto:') ? undefined : 'noreferrer'}
          aria-label={social.name}
          className={cn(
            'flex size-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-colors hover:border-primary-500/50 hover:text-primary-300',
            iconClassName
          )}
        >
          <social.icon className="size-4" aria-hidden />
        </a>
      ))}
    </div>
  )
}
