import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'
import { sendSuccess } from '../utils/ApiResponse'
import { cloudinary } from '../config/cloudinary'

export const uploadController = {
  image: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) throw ApiError.badRequest('Select an image to upload')

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(ApiError.internal(`Failed to upload image: ${error.message}`))
          } else if (result) {
            resolve(sendSuccess(res, 201, 'Image uploaded', { url: result.secure_url }))
          }
        }
      )

      uploadStream.end(req.file!.buffer)
    })
  }),
}
