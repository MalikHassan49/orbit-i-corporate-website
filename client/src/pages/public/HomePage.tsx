import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Gauge,
  Layers,
  Users2,
  Code2,
  Smartphone,
  Wrench,
  PenTool,
  Cloud,
  Sparkles,
} from 'lucide-react'
import { LinkButton } from '@/components/ui'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { ROUTES } from '@/constants'
import { serviceContentService, caseStudyService, testimonialService } from '@/services/contentService'
import { useFetch } from '@/hooks/useFetch'
import orbitLogo from '@/assets/brand/orbit-i-logo.png'

const serviceIcons: Record<string, typeof Code2> = {
  Code2,
  Smartphone,
  Wrench,
  PenTool,
  Cloud,
  Sparkles,
}

const TECHNOLOGIES = ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker', 'AWS']

const WHY_ORBIT = [
  {
    icon: ShieldCheck,
    title: 'Built to last',
    description: 'Typed, tested, documented — code your team can pick up without a handoff call.',
  },
  {
    icon: Gauge,
    title: 'Shipped on schedule',
    description: 'Clear phases and visible progress, so you always know what stage a project is at.',
  },
  {
    icon: Layers,
    title: 'Architected to scale',
    description: 'We design for the load you\u2019ll have in a year, not just the demo you need next week.',
  },
  {
    icon: Users2,
    title: 'A team, not a ticket queue',
    description: 'Direct access to the engineers building your product — no relay through account managers.',
  },
]

export function HomePage() {
  return (
    <>
      <SEO {...PAGE_SEO.home} />
      <HeroSection />
      <AboutIntroSection />
      <ServicesSection />
      <WhyOrbitSection />
      <TechnologiesSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
      {/* ambient brand glow, echoing the logo's orbital ring */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px]"
        style={{ background: 'var(--gradient-glow)' }}
        aria-hidden
      />
      <div className="container-app grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Badge tone="primary" className="mb-6">
            <span className="size-1.5 rounded-full bg-primary-400" /> Software & technology partner
          </Badge>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
            Building digital solutions that{' '}
            <span className="text-gradient-brand">move businesses forward</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            ORBIT-I designs and builds web platforms, mobile apps, and custom software for companies
            that need reliable engineering — not just another vendor.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton to={ROUTES.contact} size="lg">
              Start a project <ArrowRight className="size-4" aria-hidden />
            </LinkButton>
            <LinkButton to={ROUTES.caseStudies} size="lg" variant="outline">
              View our work
            </LinkButton>
          </div>
          <div className="mt-12 flex items-center gap-8 border-t border-[var(--color-border)] pt-8">
            <StatBlock value="6+" label="Core service lines" />
            <StatBlock value="TS" label="End-to-end type safety" />
            <StatBlock value="24/7" label="Deployed system monitoring" />
          </div>
        </div>

        <OrbitHeroVisual />
      </div>
    </section>
  )
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">{value}</p>
      <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
    </div>
  )
}

/** The hero's signature element: the brand mark set inside a slowly-rotating orbit ring, echoing the logo's own orbit path. */
function OrbitHeroVisual() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
      <div
        className="absolute inset-0 rounded-full border border-[var(--color-border-strong)]/60"
        style={{ animation: 'spin 22s linear infinite' }}
        aria-hidden
      >
        <span className="absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-[var(--color-accent-cyan)] shadow-[0_0_16px_var(--color-accent-cyan)]" />
      </div>
      <div
        className="absolute inset-10 rounded-full border border-[var(--color-border)]/70"
        style={{ animation: 'spin 30s linear infinite reverse' }}
        aria-hidden
      >
        <span className="absolute top-1/2 -right-1 size-2 -translate-y-1/2 rounded-full bg-[var(--color-silver-500)]" />
      </div>
      <div className="relative flex size-48 items-center justify-center rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
        <img src={orbitLogo} alt="" className="size-28 object-contain" aria-hidden />
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}

function AboutIntroSection() {
  return (
    <section className="border-t border-[var(--color-border)] py-20">
      <div className="container-app grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-medium text-primary-400">Who we are</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            A software company built around engineering discipline
          </h2>
          <p className="mt-5 leading-relaxed text-[var(--color-text-secondary)]">
            ORBIT-I Private Limited works with businesses that need software built right the first
            time — from internal tools that replace spreadsheets to customer-facing platforms that
            need to hold up under real usage. We keep teams small, architecture clear, and
            communication direct.
          </p>
          <Link
            to={ROUTES.about}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-400 hover:text-primary-300"
          >
            More about ORBIT-I <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card hoverable={false} className="flex flex-col gap-2">
            <p className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Mission</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Build software that removes real friction from how our clients operate.
            </p>
          </Card>
          <Card hoverable={false} className="flex flex-col gap-2">
            <p className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Approach</p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Clear architecture, honest timelines, and code your team can own long-term.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  const { data: services, isLoading } = useFetch(() => serviceContentService.list(), [])
  const displayServices = (services ?? []).slice(0, 6)

  return (
    <section className="border-t border-[var(--color-border)] py-20">
      <div className="container-app">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary-400">What we do</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              Services built around your product
            </h2>
          </div>
          <LinkButton to={ROUTES.services} variant="outline">
            All services
          </LinkButton>
        </div>
        {isLoading ? (
          <div className="py-10"><PageLoader /></div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayServices.map((service) => {
              const Icon = serviceIcons[service.icon] ?? Code2
              return (
                <Card key={service.id} className="flex flex-col gap-4">
                  <div className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-500/10 text-primary-300">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {service.summary}
                    </p>
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
  )
}

function WhyOrbitSection() {
  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-background-elevated)] py-20">
      <div className="container-app">
        <p className="text-sm font-medium text-primary-400">Why ORBIT-I</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
          What working with us actually looks like
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ORBIT.map((item) => (
            <div key={item.title}>
              <div className="flex size-10 items-center justify-center rounded-full border border-[var(--color-border-strong)] text-primary-300">
                <item.icon className="size-4.5" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-[var(--color-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TechnologiesSection() {
  return (
    <section className="border-t border-[var(--color-border)] py-16">
      <div className="container-app flex flex-col items-center gap-8 text-center">
        <p className="text-sm font-medium text-[var(--color-text-muted)]">Our core technology stack</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {TECHNOLOGIES.map((tech) => (
            <Badge key={tech} tone="neutral" className="px-4 py-2 text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseStudiesSection() {
  const { data: caseStudies, isLoading } = useFetch(() => caseStudyService.list(), [])
  const displayStudies = (caseStudies ?? []).slice(0, 4)

  if (!isLoading && displayStudies.length === 0) return null

  return (
    <section className="border-t border-[var(--color-border)] py-20">
      <div className="container-app">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary-400">Case studies</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
              Recent work
            </h2>
          </div>
          <LinkButton to={ROUTES.caseStudies} variant="outline">
            All case studies
          </LinkButton>
        </div>
        {isLoading ? (
          <div className="py-10"><PageLoader /></div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {displayStudies.map((study) => (
              <Link key={study.id} to={ROUTES.caseStudyDetail(study.slug)}>
                <Card className="h-full">
                  <Badge tone="primary" className="mb-4">
                    {study.clientIndustry}
                  </Badge>
                  <h3 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
                    {study.projectName}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">{study.problem}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-400">
                    Read the case study <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const { data: testimonials, isLoading } = useFetch(() => testimonialService.list(), [])
  const displayTestimonials = testimonials ?? []

  if (!isLoading && displayTestimonials.length === 0) return null

  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-background-elevated)] py-20">
      <div className="container-app">
        <p className="text-sm font-medium text-primary-400">Client feedback</p>
        {isLoading ? (
          <div className="py-10"><PageLoader /></div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {displayTestimonials.map((testimonial) => (
              <Card key={testimonial.id} hoverable={false} className="flex flex-col gap-5">
                <p className="text-lg leading-relaxed text-[var(--color-text-primary)]">“{testimonial.quote}”</p>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">{testimonial.authorName}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {testimonial.authorRole} · {testimonial.company}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="border-t border-[var(--color-border)] py-24">
      <div className="container-app">
        <Card
          hoverable={false}
          className="flex flex-col items-center gap-6 border-primary-500/25 bg-[image:var(--gradient-surface)] py-16 text-center"
        >
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Have a project in mind?
          </h2>
          <p className="max-w-lg text-[var(--color-text-secondary)]">
            Tell us what you're building. We'll get back to you with next steps within one business day.
          </p>
          <LinkButton to={ROUTES.contact} size="lg">
            Get in touch <ArrowRight className="size-4" aria-hidden />
          </LinkButton>
        </Card>
      </div>
    </section>
  )
}
