import multer from 'multer'
import { ApiError } from '../utils/ApiError'

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

const storage = multer.memoryStorage()

export const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(ApiError.badRequest('Only JPEG, PNG, and WebP images are allowed'))
      return
    }
    callback(null, true)
  },
})

