import type { TeamMember } from '@/types'

/**
 * Team members are managed through the backend (TeamMember model,
 * /api/v1/team) and the admin dashboard's Team section — this file is not
 * used to render the live Team page. It exists only as a typed reference
 * for what a team entry looks like, useful for local development/testing
 * before the backend has real content seeded.
 */
export const TEAM_MEMBER_SHAPE_EXAMPLE: TeamMember = {
  id: 'example',
  name: 'Jane Doe',
  designation: 'Role / Title',
  bio: 'Short professional bio.',
  skills: ['Skill A', 'Skill B'],
  order: 0,
}
