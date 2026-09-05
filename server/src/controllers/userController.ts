import type { Request, Response } from 'express'
import { userService } from '../services/userService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'

export const userController = {
  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    const user = await userService.getById(req.user.id)
    return sendSuccess(res, 200, 'Profile fetched', user)
  }),

  updateMe: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    const user = await userService.updateProfile(req.user.id, req.body)
    return sendSuccess(res, 200, 'Profile updated', user)
  }),

  listClients: asyncHandler(async (req: Request, res: Response) => {
    const { search, page, limit } = req.query
    const result = await userService.listClients({
      search: search as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    })
    return sendSuccess(res, 200, 'Clients fetched', result)
  }),

  setActiveStatus: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.setActiveStatus((req.params.id as string), req.body.isActive)
    return sendSuccess(res, 200, 'Client status updated', user)
  }),
  createEditor: asyncHandler(async (req: Request, res: Response) =>
    sendSuccess(res, 201, 'Editor account created', await userService.createEditor(req.body))),
}
