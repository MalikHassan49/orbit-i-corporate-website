import { useCallback, useEffect, useState } from 'react'

interface UseFetchState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

/**
 * Minimal fetch-on-mount hook used across public and dashboard pages.
 * `deps` re-triggers the fetch (e.g. when a slug or filter changes).
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<UseFetchState<T>>({ data: null, isLoading: true, error: null })

  const load = useCallback(() => {
    let isCancelled = false
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    fetcher()
      .then((data) => {
        if (!isCancelled) setState({ data, isLoading: false, error: null })
      })
      .catch((err) => {
        if (!isCancelled) {
          const message = err?.response?.data?.message || err?.message || 'Something went wrong'
          setState({ data: null, isLoading: false, error: message })
        }
      })

    return () => {
      isCancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => load(), [load])

  return { ...state, refetch: load }
}
