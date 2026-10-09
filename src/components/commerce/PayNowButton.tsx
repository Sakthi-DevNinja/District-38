import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { retryPayment } from '../../lib/api/checkout';
import { payWithRazorpay } from '../../lib/razorpay-checkout';
import { Order } from '../../types';

/** True for an order the customer can still pay: placed, not yet paid. */
export function canPayNow(order: Order): boolean {
  return order.documentStatus === 'PENDING_APPROVAL' && order.payment.status !== 'PAID';
}

interface PayNowButtonProps {
  order: Order;
  /** Called after the payment is verified by the server. */
  onPaid: (salesOrderId: string) => void;
}

// Lets a customer pay an order whose payment failed or was abandoned, from
// My Orders or the order page, instead of only right after checkout.
export const PayNowButton: React.FC<PayNowButtonProps> = ({ order, onPaid }) => {
  const { currentUser, showToast } = useShop();
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = async () => {
    setIsPaying(true);
    try {
      const payment = await retryPayment(order.id);
      const result = await payWithRazorpay(payment, {
        orderNumber: order.orderNumber,
        prefill: {
          name: order.deliveryAddress?.contactName || currentUser?.displayName,
          email: currentUser?.email,
          contact: order.deliveryAddress?.phone ?? undefined
        }
      });
      if (result.outcome === 'paid') {
        showToast('Payment confirmed! Thank you.', 'success');
        onPaid(result.salesOrderId);
      } else if (result.outcome === 'unverified') {
        showToast(result.message, 'error');
      } else if (result.outcome === 'unavailable') {
        showToast('Payment window failed to load. Check your connection and try again.', 'error');
      } else {
        showToast('Payment was not completed. You can try again any time.', 'warning');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not start the payment.', 'error');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={isPaying}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors disabled:opacity-60"
    >
      <CreditCard className="w-4 h-4" />
      {isPaying ? 'Opening payment…' : `Pay now • ₹${Number(order.total).toLocaleString('en-IN')}`}
    </button>
  );
};
