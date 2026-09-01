import type { Request, Response } from 'express'
import { supportService } from '../services/supportService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'

export const supportController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    const ticket = await supportService.create({ userId: req.user.id, subject: req.body.subject, message: req.body.message })
    return sendSuccess(res, 201, 'Support ticket created', ticket)
  }),

  listMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    const tickets = await supportService.listForUser(req.user.id)
    return sendSuccess(res, 200, 'Support tickets fetched', tickets)
  }),

  listAll: asyncHandler(async (req: Request, res: Response) => {
    const tickets = await supportService.listAll({ status: req.query.status as string | undefined })
    return sendSuccess(res, 200, 'Support tickets fetched', tickets)
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const ticket = await supportService.updateStatus(req.params.id as string, req.body.status)
    return sendSuccess(res, 200, 'Support ticket updated', ticket)
  }),
}
