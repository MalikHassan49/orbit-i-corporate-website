import type { Request, Response } from 'express'
import { authService } from '../services/authService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'
import { setRefreshTokenCookie, clearRefreshTokenCookie, getRefreshTokenCookieName } from '../utils/cookies'

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.register(req.body)
    setRefreshTokenCookie(res, refreshToken)
    return sendSuccess(res, 201, 'Account created successfully', { user, accessToken })
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body)
    setRefreshTokenCookie(res, refreshToken)
    return sendSuccess(res, 200, 'Logged in successfully', { user, accessToken })
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const incomingToken = req.cookies?.[getRefreshTokenCookieName()]
    const { accessToken, refreshToken } = await authService.refresh(incomingToken)
    setRefreshTokenCookie(res, refreshToken)
    return sendSuccess(res, 200, 'Session refreshed', { accessToken })
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    clearRefreshTokenCookie(res)
    return sendSuccess(res, 200, 'Logged out successfully', null)
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email)
    return sendSuccess(res, 200, 'If an account exists for that email, a reset link has been sent', null)
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.password)
    return sendSuccess(res, 200, 'Password updated successfully', null)
  }),
}
