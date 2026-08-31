import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'
import { ApiError } from '../utils/ApiError'

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`))
}

/**
 * Validates req.body against a Zod schema and replaces it with the parsed
 * (typed, defaulted) result. On failure, forwards a 400 with per-field
 * messages via the standard error envelope.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        errors[issue.path.join('.') || 'body'] = issue.message
      }
      return next(ApiError.badRequest('Validation failed', errors))
    }
    req.body = result.data
    return next()
  }
}
