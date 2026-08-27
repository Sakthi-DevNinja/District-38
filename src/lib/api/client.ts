import { env } from '../../config/env'

// The smallest reasonable API layer for a read-only, unauthenticated
// public catalog — native fetch, no new dependency. This is deliberately
// where a future customer-auth Authorization header would be added (one
// place, not scattered per call site) once Phase 2 needs it.
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(path, env.apiBaseUrl)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const body = await response.json()
      message = body?.error?.message ?? body?.message ?? message
    } catch {
      // Response body wasn't JSON — keep the generic message.
    }
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

// Product/thumbnail/gallery image URLs come back from the backend as
// paths relative to the API (e.g. "/api/public/v1/files/{id}/download"),
// never a full origin — this is the one place that resolves them against
// the configured API base URL.
export function resolveImageUrl(relativeUrl: string): string {
  return new URL(relativeUrl, env.apiBaseUrl).toString()
}
