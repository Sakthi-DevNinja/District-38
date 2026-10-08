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

// The customer's access token, persisted so a refresh doesn't log them out.
// A separate, dedicated key from anything Pilot/admin-side ever uses — this
// is a District 38 customer token only, never an admin JWT.
const TOKEN_STORAGE_KEY = 'd38_customer_token'

export function getCustomerToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

export function setCustomerToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } catch {
    // Ignore storage failures (private browsing, quota) — the token still
    // works for the rest of this session via in-memory state.
  }
}

export function clearCustomerToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // Ignore.
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
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

  if (response.status === HTTP_NO_CONTENT) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

const HTTP_NO_CONTENT = 204

function authHeaders(): Record<string, string> {
  const token = getCustomerToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    method: 'GET',
    headers: { Accept: 'application/json', ...authHeaders() },
  })
  return handleResponse<T>(response)
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(response)
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(response)
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'DELETE',
    headers: { Accept: 'application/json', ...authHeaders() },
  })
  return handleResponse<T>(response)
}

// Product/thumbnail/gallery image URLs come back from the backend as
// paths relative to the API (e.g. "/api/public/v1/files/{id}/download"),
// never a full origin — this is the one place that resolves them against
// the configured API base URL.
export function resolveImageUrl(relativeUrl: string): string {
  return new URL(relativeUrl, env.apiBaseUrl).toString()
}
