import { apiPost } from './client'
import { VerifyRazorpayPaymentInput, VerifyRazorpayPaymentResult } from './types'

// Real VEYONN Razorpay verification (razorpay-payment.controller.ts). The
// browser is never trusted to declare payment success — this independently
// re-verifies the HMAC signature server-side before confirming anything.
// No Razorpay secret ever lives in this frontend; only the publishable
// key id (returned in CheckoutResult.payment.publicFields.keyId) is used
// client-side, exactly as Razorpay's own Checkout.js widget requires.
export function verifyRazorpayPayment(
  input: VerifyRazorpayPaymentInput,
): Promise<VerifyRazorpayPaymentResult> {
  return apiPost<VerifyRazorpayPaymentResult>('/api/public/v1/payments/razorpay/verify', input)
}
