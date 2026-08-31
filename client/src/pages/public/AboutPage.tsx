import { Target, Eye, Compass, HeartHandshake } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'

const VALUES = [
  { title: 'Clarity over cleverness', description: 'We choose the boring, maintainable solution over the clever one, every time.' },
  { title: 'Direct communication', description: 'No account-manager relay — you talk to the people building your software.' },
  { title: 'Ownership', description: 'We build systems your team can run without us, not ones that lock you in.' },
  { title: 'Honest scoping', description: "If something can't be done in the timeline you have, we say so up front." },
]

export function AboutPage() {
  return (
    <>
      <SEO {...PAGE_SEO.about} />
      <div className="pb-24">
      <section className="border-b border-[var(--color-border)] py-20">
        <div className="container-app">
          <Badge tone="primary" className="mb-5">About ORBIT-I</Badge>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            A technology company built on engineering discipline
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            ORBIT-I Private Limited designs and builds software for companies that need it done
            properly — reliable architecture, honest timelines, and code that outlives the project
            that created it.
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] py-16">
        <div className="container-app grid gap-6 sm:grid-cols-2">
          <Card hoverable={false} className="flex flex-col gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-500/10 text-primary-300">
              <Target className="size-5" aria-hidden />
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Mission</h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Build software that removes real friction from how our clients operate — not software
              that just looks good in a demo.
            </p>
          </Card>
          <Card hoverable={false} className="flex flex-col gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-500/10 text-primary-300">
              <Eye className="size-5" aria-hidden />
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Vision</h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              To be the engineering partner companies call when the project actually matters and
              can't afford to be rebuilt in a year.
            </p>
          </Card>
        </div>
      </section>

      <section className="border-b border-[var(--color-border)] py-16">
        <div className="container-app">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">Core values</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {VALUES.map((value) => (
              <Card key={value.title} hoverable={false}>
                <h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-app grid gap-6 sm:grid-cols-2">
          <Card hoverable={false} className="flex flex-col gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-500/10 text-primary-300">
              <Compass className="size-5" aria-hidden />
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Our approach</h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Every engagement starts with discovery, moves through a reviewable architecture plan,
              and ships in phases you can see progress on — not a black box until launch day.
            </p>
          </Card>
          <Card hoverable={false} className="flex flex-col gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-500/10 text-primary-300">
              <HeartHandshake className="size-5" aria-hidden />
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Culture</h2>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              A small, senior team that reviews each other's work closely and stays engaged with a
              project past launch, not just to the handoff.
            </p>
          </Card>
        </div>
      </section>
    </div>
    </>
  )
}
