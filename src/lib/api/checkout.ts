import { apiPost } from './client'
import { CheckoutAddressInput, CheckoutResult, PaymentInitResult } from './types'

// Real VEYONN checkout (checkout.controller.ts) — creates a genuine Sales
// Order (salesChannel=WEBSITE), visible in Pilot immediately. Never marks
// anything paid; payment is the separate Razorpay verify step (payments.ts).

export function checkout(address: CheckoutAddressInput): Promise<CheckoutResult> {
  return apiPost<CheckoutResult>('/api/public/v1/checkout', address)
}

// Retries payment-gateway initiation for a Sales Order that was created
// successfully but whose Razorpay order creation failed. Never creates a
// second Sales Order.
export function retryPayment(salesOrderId: string): Promise<PaymentInitResult> {
  return apiPost<PaymentInitResult>(`/api/public/v1/checkout/${encodeURIComponent(salesOrderId)}/retry-payment`)
}
