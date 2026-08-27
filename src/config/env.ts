function requireEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

// The VEYONN backend's public API base URL — the only backend District 38
// is ever allowed to talk to. Never hardcoded, never a default fallback:
// a missing value fails loudly at startup rather than silently pointing
// somewhere wrong. No tenant/company ID or credential belongs here — the
// public storefront API resolves those server-side (see
// SystemActorContextService on the backend).
export const env = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
