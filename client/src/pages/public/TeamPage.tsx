import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { TeamCard } from '@/components/team/TeamCard'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { teamService } from '@/services/teamService'
import { useFetch } from '@/hooks/useFetch'

export function TeamPage() {
  const { data: team, isLoading, error, refetch } = useFetch(() => teamService.list(), [])

  return (
    <>
      <SEO {...PAGE_SEO.team} />
      <div className="pb-24">
        <section className="border-b border-[var(--color-border)] py-20">
          <div className="container-app">
            <Badge tone="primary" className="mb-5">Our Team</Badge>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
              The people building ORBIT-I
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
              A small, senior team that stays engaged with every project from architecture through
              to launch — not a rotating cast of contractors.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container-app">
            {isLoading ? (
              <PageLoader />
            ) : error ? (
              <ErrorState onRetry={refetch} />
            ) : !team || team.length === 0 ? (
              <EmptyState
                icon={<Users className="size-5" aria-hidden />}
                title="Team information coming soon"
                description="Check back shortly, or reach out via the contact page in the meantime."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {team.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
