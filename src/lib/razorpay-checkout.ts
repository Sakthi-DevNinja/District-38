import { verifyRazorpayPayment } from './api/payments';
import { PaymentInitResult } from './api/types';
import { loadRazorpay } from './razorpay-loader';

export type RazorpayOutcome =
  | { outcome: 'paid'; salesOrderId: string }
  /** The customer closed the window without paying. */
  | { outcome: 'dismissed' }
  /** Paid, but the server could not verify it. */
  | { outcome: 'unverified'; message: string }
  /** The Razorpay script could not load. */
  | { outcome: 'unavailable' };

interface PayOptions {
  orderNumber: string | null;
  prefill: { name?: string; email?: string; contact?: string };
}

// Opens the real Razorpay Checkout widget using exactly what the VEYONN
// backend returned (publishable key id + provider order id + amount) —
// never a client-invented amount. A success is only reported after the
// payment is verified server-side (the browser is never trusted to declare
// success). Razorpay shows its own failure messages and lets the customer
// retry inside the same window, so a failed attempt resolves only when the
// window is closed.
export async function payWithRazorpay(payment: PaymentInitResult, options: PayOptions): Promise<RazorpayOutcome> {
  const loaded = await loadRazorpay();
  if (!loaded) return { outcome: 'unavailable' };

  return new Promise<RazorpayOutcome>((resolve) => {
    const rzp = new window.Razorpay({
      key: payment.publicFields.keyId,
      order_id: payment.providerOrderId,
      amount: payment.amount,
      currency: payment.currency,
      name: 'District 38',
      description: options.orderNumber ? `Order ${options.orderNumber}` : 'Order payment',
      prefill: options.prefill,
      theme: { color: '#EA580C' },
      handler: async (response) => {
        try {
          const result = await verifyRazorpayPayment({
            paymentId: payment.paymentId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
          resolve({ outcome: 'paid', salesOrderId: result.salesOrderId });
        } catch (err) {
          resolve({
            outcome: 'unverified',
            message: err instanceof Error ? err.message : 'Payment could not be verified. Please retry.'
          });
        }
      },
      modal: {
        ondismiss: () => resolve({ outcome: 'dismissed' })
      }
    });
    rzp.open();
  });
}
