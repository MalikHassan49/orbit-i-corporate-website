import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Circle, FileText } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Loader'
import { EmptyState, ErrorState } from '@/components/ui/States'
import { ROUTES } from '@/constants'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/formatters'
import { projectService } from '@/services/projectService'
import { useFetch } from '@/hooks/useFetch'
import type { ProjectStatus } from '@/types'

const statusTone: Record<ProjectStatus, 'primary' | 'success' | 'warning' | 'neutral'> = {
  planning: 'neutral',
  in_progress: 'primary',
  on_hold: 'warning',
  completed: 'success',
}

export function ClientProjectsPage() {
  const { data: projects, isLoading, error, refetch } = useFetch(() => projectService.listMine(), [])
  const items = projects ?? []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Projects</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Every project ORBIT-I is building for you.</p>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : items.length === 0 ? (
        <EmptyState title="No projects yet" description="Projects ORBIT-I builds for you will appear here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((project) => (
            <Link key={project.id} to={ROUTES.clientProjectDetail(project.id)}>
              <Card className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-display font-semibold text-[var(--color-text-primary)]">{project.name}</h3>
                  <Badge tone={statusTone[project.status]}>{project.status.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-[image:var(--gradient-brand)]" style={{ width: `${project.progress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">{project.progress}% complete</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const TABS = ['Overview', 'Milestones', 'Documents', 'Updates'] as const

export function ClientProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project, isLoading, error, refetch } = useFetch(() => projectService.getMine(id!), [id])
  const [tab, setTab] = useState<(typeof TABS)[number]>('Overview')

  if (isLoading) return <PageLoader />

  if (error || !project) {
    return error && error !== 'Project not found' ? (
      <ErrorState onRetry={refetch} />
    ) : (
      <EmptyState title="Project not found" description="This project may have been archived." />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">{project.name}</h2>
          <Badge tone={statusTone[project.status]} className="mt-2">{project.status.replace('_', ' ')}</Badge>
        </div>
      </div>

      <div className="flex gap-1 border-b border-[var(--color-border)]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              tab === t
                ? 'border-primary-500 text-[var(--color-text-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <Card hoverable={false}>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Progress</p>
              <p className="mt-1 font-display text-2xl font-semibold text-[var(--color-text-primary)]">{project.progress}%</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Assigned team</p>
              <p className="mt-1 text-sm text-[var(--color-text-primary)]">{project.assignedTeam.join(', ') || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Target date</p>
              <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                {project.targetDate ? formatDate(project.targetDate) : '—'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {tab === 'Milestones' && (
        <Card hoverable={false}>
          {project.milestones.length === 0 ? (
            <EmptyState title="No milestones yet" />
          ) : (
            <ul className="flex flex-col gap-4">
              {project.milestones.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  {m.isComplete ? (
                    <CheckCircle2 className="size-5 shrink-0 text-[var(--color-success)]" aria-hidden />
                  ) : (
                    <Circle className="size-5 shrink-0 text-[var(--color-text-muted)]" aria-hidden />
                  )}
                  <div className="flex flex-1 items-center justify-between">
                    <span className={cn('text-sm', m.isComplete ? 'text-[var(--color-text-secondary)] line-through' : 'text-[var(--color-text-primary)]')}>
                      {m.title}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">{formatDate(m.dueDate)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {tab === 'Documents' && (
        <EmptyState icon={<FileText className="size-5" aria-hidden />} title="No documents shared yet" description="Files your project team shares will appear here." />
      )}

      {tab === 'Updates' && (
        <EmptyState title="No updates posted yet" description="Progress updates from your project team will appear here." />
      )}
    </div>
  )
}
