import { mkdirSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import multer from 'multer'
import { ApiError } from '../utils/ApiError'

const uploadsDirectory = resolve(process.cwd(), 'uploads')
mkdirSync(uploadsDirectory, { recursive: true })

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadsDirectory),
  filename: (_req, file, callback) => callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`),
})

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
