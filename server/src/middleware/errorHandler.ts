import type { NextFunction, Request, Response } from 'express'
import { MongooseError } from 'mongoose'
import { MulterError } from 'multer'
import { ApiError } from '../utils/ApiError'
import { env } from '../config/env'

interface MongoDuplicateKeyError extends Error {
  code?: number
  keyValue?: Record<string, unknown>
}

/**
 * Must be registered last, after all routes. Normalizes every thrown error
 * (ApiError, Mongoose validation/cast errors, JWT errors, duplicate-key
 * errors, or anything unexpected) into { success: false, message, errors }.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, errors: err.errors })
  }

  if (err instanceof MongooseError && err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: extractMongooseErrors(err) })
  }

  if (err instanceof MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 2MB or smaller' : err.message
    return res.status(400).json({ success: false, message })
  }

  const mongoErr = err as MongoDuplicateKeyError
  if (mongoErr?.code === 11000) {
    const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : 'field'
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
      errors: { [field]: 'Already in use' },
    })
  }

  if (err instanceof Error && (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' })
  }

  console.error('[unhandled error]', err)
  return res.status(500).json({
    success: false,
    message: env.isProduction ? 'Something went wrong. Please try again.' : (err as Error)?.message || 'Unknown error',
  })
}

function extractMongooseErrors(err: unknown): Record<string, string> {
  const errors: Record<string, string> = {}
  const mongooseErr = err as { errors?: Record<string, { message: string }> }
  if (mongooseErr.errors) {
    for (const [key, value] of Object.entries(mongooseErr.errors)) {
      errors[key] = value.message
    }
  }
  return errors
}
