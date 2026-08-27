import { DependencyList, useEffect, useRef, useState } from 'react'

export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

// The smallest reasonable data-fetching hook for this codebase — no React
// Query, no extra dependency. `deps` controls when the fetcher re-runs,
// same convention as useEffect's own dependency array. A stale response
// (the deps changed again before this call resolved) is discarded rather
// than applied, so a slow first request can never clobber a fast second
// one.
export function useAsync<T>(fetcher: () => Promise<T>, deps: DependencyList): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: null, isLoading: true, error: null })
  const requestId = useRef(0)

  useEffect(() => {
    const thisRequest = ++requestId.current
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    fetcher()
      .then((data) => {
        if (requestId.current === thisRequest) {
          setState({ data, isLoading: false, error: null })
        }
      })
      .catch((error: unknown) => {
        if (requestId.current === thisRequest) {
          setState({ data: null, isLoading: false, error: error instanceof Error ? error : new Error('Request failed') })
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
