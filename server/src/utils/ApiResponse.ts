import type { Response } from 'express'

/**
 * Sends a response in the app's standard envelope:
 * { success: true, message, data }
 */
export function sendSuccess<T>(res: Response, statusCode: number, message: string, data: T) {
  return res.status(statusCode).json({ success: true, message, data })
}
