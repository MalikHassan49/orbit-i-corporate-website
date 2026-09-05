export const ROLES = {
  CLIENT: 'client',
  EDITOR: 'editor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ALL_ROLES: Role[] = Object.values(ROLES)
export const ADMIN_ROLES: Role[] = [ROLES.ADMIN, ROLES.SUPER_ADMIN]
export const CONTENT_EDITOR_ROLES: Role[] = [ROLES.EDITOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]
