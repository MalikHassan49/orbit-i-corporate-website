interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
      errors?: Record<string, string>
    }
  }
  message?: string
}

/**
 * Turns an Axios error from the backend's { success, message, errors }
 * envelope into a single readable string — including per-field validation
 * messages when present, since "Validation failed" alone doesn't tell the
 * admin which field is wrong.
 */
export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.') {
  const error = err as ApiErrorResponse
  const data = error?.response?.data
  if (!data) return error?.message || fallback

  if (data.errors && Object.keys(data.errors).length > 0) {
    const details = Object.entries(data.errors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join(' · ')
    return `${data.message || 'Validation failed'} — ${details}`
  }

  return data.message || fallback
}
