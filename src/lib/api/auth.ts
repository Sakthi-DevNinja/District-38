import { apiGet, apiPost } from './client'
import {
  CustomerProfile,
  CustomerTokenResponse,
  LoginCustomerInput,
  RegisterCustomerInput,
} from './types'

// Real VEYONN customer auth (src/capabilities/storefront/infrastructure/
// controllers/customer-auth.controller.ts) — entirely separate from
// Pilot/admin auth. Never touches an admin JWT or admin login endpoint.

export function register(input: RegisterCustomerInput): Promise<CustomerTokenResponse> {
  return apiPost<CustomerTokenResponse>('/api/public/v1/auth/register', input)
}

export function login(input: LoginCustomerInput): Promise<CustomerTokenResponse> {
  return apiPost<CustomerTokenResponse>('/api/public/v1/auth/login', input)
}

// Customer tokens are stateless (no server-side session store — see the
// backend controller's own doc comment) — this call still authenticates,
// giving the site a real endpoint to hit on logout, but the actual
// sign-out is enforced client-side by discarding the token afterward.
export function logout(): Promise<void> {
  return apiPost<void>('/api/public/v1/auth/logout')
}

export function getProfile(): Promise<CustomerProfile> {
  return apiGet<CustomerProfile>('/api/public/v1/account/me')
}
