import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check, FileSearch } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { caseStudyService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO, buildCreativeWorkJsonLd, buildBreadcrumbJsonLd } from '@/config/seo'

export function CaseStudiesPage() {
  const { data: caseStudies, isLoading, error, refetch } = useFetch(() => caseStudyService.list(), [])

  return (
    <>
      <SEO {...PAGE_SEO.caseStudies} />
    <div className="pb-24">
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="container-app">
          <Badge tone="primary" className="mb-5">Case studies</Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            Real problems, real systems
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            A look at the problems we've been brought in to solve, and what we built to solve them.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          {isLoading ? (
            <PageLoader />
          ) : error ? (
            <ErrorState onRetry={refetch} />
          ) : !caseStudies || caseStudies.length === 0 ? (
            <EmptyState icon={<FileSearch className="size-5" aria-hidden />} title="No case studies published yet" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {caseStudies.map((study) => (
                <Link key={study.id} to={ROUTES.caseStudyDetail(study.slug)}>
                  <Card className="flex h-full flex-col gap-4">
                    <Badge tone="primary">{study.clientIndustry}</Badge>
                    <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
                      {study.projectName}
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{study.problem}</p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {study.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} tone="neutral">{tech}</Badge>
                      ))}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
    </>
  )
}

export function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: study, isLoading, error, refetch } = useFetch(() => caseStudyService.getBySlug(slug!), [slug])

  if (isLoading) return <div className="py-24"><PageLoader /></div>

  if (error || !study) {
    return (
      <div className="container-app py-24">
        {error && error !== 'Case study not found' ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <EmptyState
            icon={<FileSearch className="size-5" aria-hidden />}
            title="Case study not found"
            description="This case study may have been renamed or removed."
          />
        )}
      </div>
    )
  }

  return (
    <div className="pb-24">
      <SEO
        title={`${study.projectName} — Case Study | ORBIT-I`}
        description={study.problem.slice(0, 155)}
        path={ROUTES.caseStudyDetail(study.slug)}
        jsonLd={[
          buildCreativeWorkJsonLd(study),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Case Studies', path: ROUTES.caseStudies },
            { name: study.projectName, path: ROUTES.caseStudyDetail(study.slug) },
          ]),
        ]}
      />
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="container-app">
          <Link to={ROUTES.caseStudies} className="text-sm text-[var(--color-text-secondary)] hover:text-primary-300">
            ← All case studies
          </Link>
          <Badge tone="primary" className="mt-5">{study.clientIndustry}</Badge>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            {study.projectName}
          </h1>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] py-16">
        <div className="container-app grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">The problem</h2>
            <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">{study.problem}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">The solution</h2>
            <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">{study.solution}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] py-16">
        <div className="container-app">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Results</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {study.results.map((result) => (
              <li key={result} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                <Check className="mt-0.5 size-4 shrink-0 text-primary-400" aria-hidden />
                {result}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-2">
            {study.technologies.map((tech) => (
              <Badge key={tech} tone="neutral">{tech}</Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app">
          <Card hoverable={false} className="flex flex-col items-center gap-5 py-14 text-center">
            <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">Have a similar problem?</h2>
            <LinkButton to={ROUTES.contact} size="lg">
              Talk to our team <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
          </Card>
        </div>
      </section>
    </div>
  )
}
