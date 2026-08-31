import type { Response } from 'express'
import { env } from '../config/env'

const REFRESH_COOKIE_NAME = 'orbit_refresh_token'
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
    maxAge: THIRTY_DAYS_MS,
    path: '/api/v1/auth',
  })
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' })
}

export function getRefreshTokenCookieName() {
  return REFRESH_COOKIE_NAME
}
