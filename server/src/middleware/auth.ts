import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '../utils/ApiError'
import { verifyAccessToken } from '../utils/jwt'
import type { Role } from '../constants/roles'

/**
 * Verifies the Bearer access token and attaches { id, role } to req.user.
 * This is the server-side authorization boundary — the frontend's route
 * guards are UX only and must never be relied on for real security.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Authentication required'))
  }

  const token = header.slice('Bearer '.length)
  try {
    const payload = verifyAccessToken(token)
    req.user = { id: payload.sub, role: payload.role }
    return next()
  } catch {
    return next(ApiError.unauthorized('Invalid or expired session'))
  }
}

/** Restricts a route to specific roles. Must run after `authenticate`. */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'))
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'))
    }
    return next()
  }
}
