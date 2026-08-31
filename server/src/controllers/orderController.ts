import type { Request, Response } from 'express'
import { orderService } from '../services/orderService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'
import { ApiError } from '../utils/ApiError'

export const orderController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    const items = req.body.items.map((i: { productId: string; quantity: number }) => ({
      productId: i.productId,
      quantity: i.quantity,
    }))
    const order = await orderService.create({ userId: req.user.id, items })
    return sendSuccess(res, 201, 'Order placed successfully', order)
  }),

  listMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    const orders = await orderService.listForUser(req.user.id)
    return sendSuccess(res, 200, 'Orders fetched', orders)
  }),

  getMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized()
    const order = await orderService.getForUser((req.params.id as string), req.user.id)
    return sendSuccess(res, 200, 'Order fetched', order)
  }),

  listAll: asyncHandler(async (req: Request, res: Response) => {
    const { status, page, limit } = req.query
    const result = await orderService.listAll({
      status: status as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    })
    return sendSuccess(res, 200, 'Orders fetched', result)
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.updateStatus((req.params.id as string), req.body.status)
    return sendSuccess(res, 200, 'Order status updated', order)
  }),
}
