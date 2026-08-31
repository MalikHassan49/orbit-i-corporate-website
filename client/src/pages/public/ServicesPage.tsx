import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Smartphone, Wrench, PenTool, Cloud, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState, EmptyState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { serviceContentService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'

const serviceIcons: Record<string, typeof Code2> = { Code2, Smartphone, Wrench, PenTool, Cloud, Sparkles }

export function ServicesPage() {
  const { data: services, isLoading, error, refetch } = useFetch(() => serviceContentService.list(), [])

  return (
    <>
      <SEO {...PAGE_SEO.services} />
      <div className="pb-24">
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="container-app">
          <Badge tone="primary" className="mb-5">Services</Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Engineering services scoped to your product
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            From a single feature to a full platform — every engagement follows the same process:
            discovery, architecture, build, and a support window after launch.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            <ErrorState onRetry={refetch} />
          ) : !services || services.length === 0 ? (
            <EmptyState title="No services listed yet" description="Check back soon." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = serviceIcons[service.icon] ?? Code2
                return (
                  <Card key={service.id} className="flex flex-col gap-4">
                    <div className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-500/10 text-primary-300">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{service.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {service.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} tone="neutral">{tech}</Badge>
                      ))}
                    </div>
                    <Link
                      to={ROUTES.serviceDetail(service.slug)}
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-300"
                    >
                      Learn more <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  )
}
