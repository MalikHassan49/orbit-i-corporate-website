/**
 * Thrown anywhere in controllers/services to signal an operational error
 * with a specific HTTP status. Caught by the global error middleware and
 * turned into the standard { success, message, errors } response shape.
 */
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly errors?: Record<string, string>
  public readonly isOperational = true

  constructor(statusCode: number, message: string, errors?: Record<string, string>) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  static badRequest(message = 'Bad request', errors?: Record<string, string>) {
    return new ApiError(400, message, errors)
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message)
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message)
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message)
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message)
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message)
  }
}
