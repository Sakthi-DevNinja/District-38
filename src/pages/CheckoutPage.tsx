import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  MapPin,
  Lock,
  ArrowLeft,
  Mail,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNoIndex } from '../hooks/use-noindex';
import { verifyRazorpayPayment } from '../lib/api/payments';
import { retryPayment } from '../lib/api/checkout';
import { PaymentInitResult } from '../lib/api/types';
import { loadRazorpay } from '../lib/razorpay-loader';
import { BrandLogo } from '../components/layout/BrandLogo';

const INDIAN_STATES = [
  'Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana',
  'Maharashtra', 'Delhi', 'Gujarat', 'West Bengal', 'Other'
];

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    currentUser,
    isAuthenticated,
    submitCheckout,
    navigate,
    showToast
  } = useShop();

  useNoIndex('Checkout');

  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    stateProvince: 'Tamil Nadu',
    postalCode: '',
    countryCode: 'IN'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [salesOrderId, setSalesOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [paymentFailed, setPaymentFailed] = useState(false);

  useEffect(() => {
    void loadRazorpay();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Please sign in to check out</h2>
        <p className="text-xs text-neutral-500">Your cart and order history are tied to your District 38 account.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Once a Sales Order has been submitted, the real cart is empty
  // server-side regardless of payment outcome — the empty-cart redirect
  // must not fire in that case, or a failed-payment retry would be
  // unreachable.
  if (cart.length === 0 && !salesOrderId) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Your cart is empty</h2>
        <p className="text-xs text-neutral-500">Please add riding gear to your bag before checking out.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-5 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleInputChange = (field: keyof typeof address, val: string) => {
    setAddress(prev => ({ ...prev, [field]: val }));
  };

  // Opens the real Razorpay Checkout widget using exactly what the VEYONN
  // backend returned (publishable key id + provider order id + amount) —
  // never a client-invented amount. On success, the payment is verified
  // server-side (the browser is never trusted to declare success) before
  // the order confirmation page is shown.
  const openRazorpay = async (payment: PaymentInitResult, displayOrderNumber: string | null) => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      setPaymentFailed(true);
      showToast('Payment window failed to load. Check your connection and retry.', 'error');
      return;
    }

    const rzp = new window.Razorpay({
      key: payment.publicFields.keyId,
      order_id: payment.providerOrderId,
      amount: payment.amount,
      currency: payment.currency,
      name: 'District 38',
      description: displayOrderNumber ? `Order ${displayOrderNumber}` : 'Order payment',
      prefill: { name: currentUser?.displayName, email: currentUser?.email },
      theme: { color: '#EA580C' },
      handler: async (response) => {
        try {
          const result = await verifyRazorpayPayment({
            paymentId: payment.paymentId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
          showToast('Payment confirmed! Your order is placed.', 'success');
          navigate('/order-success', { orderId: result.salesOrderId });
        } catch (err) {
          setPaymentFailed(true);
          showToast(
            err instanceof Error ? err.message : 'Payment could not be verified. Please retry.',
            'error'
          );
        }
      },
      modal: {
        ondismiss: () => {
          setPaymentFailed(true);
          showToast('Payment was not completed. You can retry from here.', 'warning');
        }
      }
    });

    // Razorpay shows its own failure message and lets the customer retry
    // inside the same window; ondismiss handles the toast if they give up.
    rzp.on('payment.failed', () => {
      setPaymentFailed(true);
    });

    rzp.open();
  };

  const handleRetryPayment = async () => {
    if (!salesOrderId) return;
    setIsProcessing(true);
    try {
      const payment = await retryPayment(salesOrderId);
      setPaymentFailed(false);
      await openRazorpay(payment, orderNumber);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not restart payment.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.line1.trim() || !address.city.trim() || !address.stateProvince.trim() || !address.postalCode.trim()) {
      showToast('Please enter your full delivery address.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await submitCheckout(address);
      setSalesOrderId(result.salesOrderId);
      setOrderNumber(result.orderNumber);

      if (result.paymentInitiationFailed || !result.payment) {
        // The Sales Order is real and NOT lost — only the payment gateway
        // call failed. Never a fake success, never a second order.
        setPaymentFailed(true);
        showToast('Your order was created, but starting payment failed. Please retry.', 'warning');
        return;
      }

      await openRazorpay(result.payment, result.orderNumber);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not place your order.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // A real Sales Order now exists server-side — show its status instead of
  // the (now cart-empty) checkout form. Payment either opened successfully
  // (the Razorpay overlay is a separate widget on top of this) or the
  // gateway call failed and this offers the documented retry path.
  if (salesOrderId) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-5">
        {paymentFailed ? (
          <>
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Order Saved — Payment Not Completed</h2>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Your order is saved as a real order, but payment wasn't completed. Nothing was charged, and no second order will be created — retry whenever you're ready.
              </p>
            </div>
            <button
              onClick={handleRetryPayment}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-400 text-white font-bold text-xs"
            >
              <RefreshCcw className="w-4 h-4" />
              {isProcessing ? 'Retrying…' : 'Retry Payment'}
            </button>
            <button
              onClick={() => navigate('/account/orders')}
              className="block mx-auto text-xs font-semibold text-neutral-500 hover:text-neutral-900"
            >
              View in My Orders
            </button>
          </>
        ) : (
          <p className="text-sm text-neutral-500">Opening secure payment…</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-neutral-50/50 min-h-screen pb-16">
      {/* Header bar */}
      <div className="bg-white border-b border-neutral-200 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center space-x-2 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </button>

          <div className="flex items-center space-x-2">
            <BrandLogo size="sm" />
          </div>

          <div className="flex items-center space-x-1 text-xs text-neutral-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Account (already authenticated — no separate contact
                form; VEYONN's checkout takes only a delivery address, the
                customer's identity comes from their session.) */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-neutral-950 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-medium">
                  1
                </span>
                <span>Checking Out As</span>
              </h2>
              <div className="flex items-center gap-4 text-xs text-neutral-600 pl-8">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-neutral-400" /> {currentUser?.email}</span>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-950 flex items-center space-x-2 pb-3 border-b border-neutral-100">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-medium">
                  2
                </span>
                <span>Delivery Address</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">House / Flat / Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address.line1}
                    onChange={e => handleInputChange('line1', e.target.value)}
                    placeholder="e.g. 14B, 3rd Cross, Thillai Nagar"
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Apartment / Landmark (Optional)</label>
                  <input
                    type="text"
                    value={address.line2}
                    onChange={e => handleInputChange('line2', e.target.value)}
                    placeholder="e.g. Near Rockfort View School"
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={e => handleInputChange('city', e.target.value)}
                      placeholder="Tiruchirappalli"
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">State *</label>
                    <select
                      value={address.stateProvince}
                      onChange={e => handleInputChange('stateProvince', e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                    >
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={20}
                      value={address.postalCode}
                      onChange={e => handleInputChange('postalCode', e.target.value)}
                      placeholder="620018"
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-950 flex items-center space-x-2 pb-3 border-b border-neutral-100">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-medium">
                  3
                </span>
                <span>Payment</span>
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Payment is handled securely by Razorpay — UPI, cards, netbanking, and wallets. You'll be asked to
                complete payment in a secure Razorpay window after placing your order.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-neutral-950 pb-3 border-b border-neutral-100">
                Order Items ({cartCount})
              </h3>

              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {cart.map(item => (
                  <div key={`${item.productId}:${item.variantId ?? ''}`} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img src={item.product.thumbnail} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200" />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-semibold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 line-clamp-1">{item.product.name}</div>
                        {item.variantName && (
                          <div className="text-xs text-neutral-500 mt-0.5">Size: {item.variantName}</div>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-neutral-900">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation — server-computed subtotal only. */}
              <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                <div className="flex justify-between text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Total Due</span>
                  <span className="text-orange-600 font-bold text-lg">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-400 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <span>PROCESSING...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>PLACE ORDER & PAY • ₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <div className="space-y-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Payment verified securely via Razorpay</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                  <span>Delivered nationwide</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
