import type { Request, Response } from 'express'
import { productService } from '../services/productService'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/ApiResponse'

export const productController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { search, category, status, page, limit } = req.query
    const result = await productService.list({
      search: search as string | undefined,
      category: category as string | undefined,
      status: status as string | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    })
    return sendSuccess(res, 200, 'Products fetched', result)
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getBySlug((req.params.slug as string))
    return sendSuccess(res, 200, 'Product fetched', product)
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.create(req.body)
    return sendSuccess(res, 201, 'Product created', product)
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.update((req.params.id as string), req.body)
    return sendSuccess(res, 200, 'Product updated', product)
  }),

  archive: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.archive((req.params.id as string))
    return sendSuccess(res, 200, 'Product archived', product)
  }),
}
