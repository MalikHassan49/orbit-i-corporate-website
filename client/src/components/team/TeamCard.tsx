import { Link2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { TeamMember } from '@/types'

export function TeamCard({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-4">
        {member.avatarUrl ? (
          <img
            src={member.avatarUrl}
            alt={`Portrait of ${member.name}`}
            loading="lazy"
            className="size-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-500/15 font-display text-lg font-semibold text-primary-300"
            aria-hidden
          >
            {initials}
          </div>
        )}
        <div>
          <h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">{member.name}</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">{member.designation}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{member.bio}</p>

      {member.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {member.skills.map((skill) => (
            <Badge key={skill} tone="neutral">{skill}</Badge>
          ))}
        </div>
      )}

      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-300"
        >
          <Link2 className="size-3.5" aria-hidden /> LinkedIn
        </a>
      )}
    </Card>
  )
}
