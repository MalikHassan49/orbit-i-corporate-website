import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { sendSuccess } from '../utils/ApiResponse'

export const uploadController = {
  image: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Select an image to upload')

    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    return sendSuccess(res, 201, 'Image uploaded', { url })
  }),
}
