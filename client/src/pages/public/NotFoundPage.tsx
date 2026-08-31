import { Link } from 'react-router-dom'
import { LinkButton } from '@/components/ui'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { ROUTES } from '@/constants'

export function NotFoundPage() {
  return (
    <>
      <SEO {...PAGE_SEO.notFound} />
      <div className="container-app flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="font-display text-7xl font-semibold text-primary-500/60">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-[var(--color-text-primary)]">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-[var(--color-text-secondary)]">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-6 flex gap-3">
          <LinkButton to={ROUTES.home}>Back home</LinkButton>
          <Link
            to={ROUTES.contact}
            className="inline-flex h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-border-strong)] px-5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-white/5"
          >
            Contact us
          </Link>
        </div>
      </div>
    </>
  )
}
