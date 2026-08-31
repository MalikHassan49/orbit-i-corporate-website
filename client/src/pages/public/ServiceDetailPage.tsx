import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check, Code2, Smartphone, Wrench, PenTool, Cloud, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { serviceContentService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'

const serviceIcons: Record<string, typeof Code2> = { Code2, Smartphone, Wrench, PenTool, Cloud, Sparkles }

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: service, isLoading, error, refetch } = useFetch(
    () => serviceContentService.getBySlug(slug!),
    [slug]
  )

  if (isLoading) return <div className="py-24"><PageLoader /></div>

  if (error || !service) {
    return (
      <div className="container-app py-24">
        {error && error !== 'Service not found' ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <EmptyState title="Service not found" description="This service may have been renamed or removed." />
        )}
      </div>
    )
  }

  const Icon = serviceIcons[service.icon] ?? Code2

  return (
    <div className="pb-24">
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="container-app">
          <Link to={ROUTES.services} className="text-sm text-[var(--color-text-secondary)] hover:text-primary-300">
            ← All services
          </Link>
          <div className="mt-5 flex size-14 items-center justify-center rounded-[var(--radius-lg)] bg-primary-500/10 text-primary-300">
            <Icon className="size-6" aria-hidden />
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            {service.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {service.technologies.map((tech) => (
              <Badge key={tech} tone="neutral">{tech}</Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] py-16">
        <div className="container-app grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">Benefits</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary-400" aria-hidden />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">Our process</h2>
            <ol className="mt-6 flex flex-col gap-5">
              {service.processSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] font-display text-xs font-semibold text-primary-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--color-text-primary)]">{step.title}</p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          <Card hoverable={false} className="flex flex-col items-center gap-5 py-14 text-center">
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Ready to talk about your {service.title.toLowerCase()} project?
            </h2>
            <LinkButton to={ROUTES.contact} size="lg">
              Start a conversation <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          </Card>
        </div>
      </section>
    </div>
  )
}
