import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  ArrowLeft, 
  Tag, 
  ChevronRight, 
  Building, 
  Phone, 
  Mail, 
  User, 
  AlertCircle,
  QrCode,
  Store
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { DISTRICT_38_STORE } from '../data/storeInfo';
import { Order } from '../types';
import { BrandLogo } from '../components/layout/BrandLogo';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    currentUser, 
    isAuthenticated, 
    createOrder, 
    navigate,
    showToast
  } = useShop();

  // Form States
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    street: currentUser?.addresses?.[0]?.street || '',
    city: currentUser?.addresses?.[0]?.city || '',
    state: currentUser?.addresses?.[0]?.state || 'Tamil Nadu',
    pincode: currentUser?.addresses?.[0]?.pincode || '',
    deliveryMethod: 'express' as 'express' | 'store_pickup',
    paymentMethod: 'upi' as 'upi' | 'card' | 'netbanking' | 'cod',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    saveInfo: true
  });

  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0) {
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

  const handleInputChange = (field: string, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    applyCoupon(couponCode.trim());
    setCouponCode('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      showToast('Please fill in your contact name, email, and phone number.', 'error');
      return;
    }

    if (formData.deliveryMethod === 'express') {
      if (!formData.street.trim() || !formData.city.trim() || !formData.pincode.trim()) {
        showToast('Please enter your full shipping address and 6-digit postal pincode.', 'error');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate order placement
    setTimeout(() => {
      const orderId = `D38-${Date.now().toString().slice(-6)}`;
      const order: Order = {
        id: orderId,
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shipping: formData.deliveryMethod === 'store_pickup' ? 0 : cartShipping,
        total: formData.deliveryMethod === 'store_pickup' ? (cartSubtotal - cartDiscount) : cartTotal,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        shippingAddress: {
          id: `addr-${Date.now()}`,
          name: formData.name,
          phone: formData.phone,
          street: formData.deliveryMethod === 'store_pickup' ? 'District 38 Flagship Store, Salai Road' : formData.street,
          city: formData.deliveryMethod === 'store_pickup' ? 'Tiruchirappalli' : formData.city,
          state: formData.deliveryMethod === 'store_pickup' ? 'Tamil Nadu' : formData.state,
          pincode: formData.deliveryMethod === 'store_pickup' ? '620018' : formData.pincode,
          isDefault: true
        },
        paymentMethod: formData.paymentMethod.toUpperCase(),
        paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'paid',
        trackingNumber: formData.deliveryMethod === 'store_pickup' ? 'PICKUP-D38-TRICHY' : `DTDC-${Math.floor(100000000 + Math.random() * 900000000)}`,
        courierPartner: formData.deliveryMethod === 'store_pickup' ? 'In-Store Click & Collect' : 'DTDC Express Air',
        estimatedDelivery: formData.deliveryMethod === 'store_pickup' ? 'Ready in 1 hour at Salai Road Store' : 'Within 2 - 3 Business Days'
      };

      createOrder(order);
      setIsProcessing(false);
      showToast('Order confirmed successfully!', 'success');
      navigate(`/order-success?orderId=${orderId}`);
    }, 1200);
  };

  const finalTotal = formData.deliveryMethod === 'store_pickup' 
    ? (cartSubtotal - cartDiscount) 
    : cartTotal;

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
            <span className="hidden sm:inline">SSL Secure</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Contact Information */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="text-base font-bold text-neutral-950 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-medium">
                    1
                  </span>
                  <span>Rider Contact Details</span>
                </h2>
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-xs text-orange-600 font-semibold hover:underline"
                  >
                    Already have an account? Sign in
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Anand Kumar"
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                    />
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      placeholder="rider@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Mobile Phone (for delivery SMS & tracking) *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Option */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-950 flex items-center space-x-2 pb-3 border-b border-neutral-100">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-medium">
                  2
                </span>
                <span>Delivery Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Express Doorstep */}
                <label
                  onClick={() => handleInputChange('deliveryMethod', 'express')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                    formData.deliveryMethod === 'express'
                      ? 'border-orange-600 bg-orange-50/20 ring-2 ring-orange-500/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-neutral-900">Doorstep Express</span>
                    </div>
                    <span className="font-semibold text-neutral-900">
                      {cartShipping === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : `₹${cartShipping}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-normal">
                    Dispatched via BlueDart / DTDC Air with real-time SMS tracking.
                  </p>
                </label>

                {/* Click & Collect Trichy */}
                <label
                  onClick={() => handleInputChange('deliveryMethod', 'store_pickup')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                    formData.deliveryMethod === 'store_pickup'
                      ? 'border-orange-600 bg-orange-50/20 ring-2 ring-orange-500/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-neutral-900">Trichy Store Pickup</span>
                    </div>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-normal">
                    Ready in 1 hour at Salai Road Store with in-person sizing & trial.
                  </p>
                </label>
              </div>

              {/* Shipping Address Inputs (if Doorstep Delivery) */}
              {formData.deliveryMethod === 'express' ? (
                <div className="space-y-4 pt-3 border-t border-neutral-100 text-xs">
                  <div className="font-semibold text-neutral-900">Shipping Address</div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">House / Flat / Street Address *</label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={e => handleInputChange('street', e.target.value)}
                      placeholder="e.g. 14B, 3rd Cross, Thillai Nagar"
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={e => handleInputChange('city', e.target.value)}
                        placeholder="Tiruchirappalli"
                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">State *</label>
                      <select
                        value={formData.state}
                        onChange={e => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                      >
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi NCR</option>
                        <option value="Other">Other States</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">6-Digit Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={e => handleInputChange('pincode', e.target.value)}
                        placeholder="620018"
                        className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-orange-500 font-normal"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-1">
                  <div className="font-semibold text-neutral-900 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>Pickup Location: District 38 Trichy Flagship</span>
                  </div>
                  <div className="text-neutral-500 font-normal">
                    75/c Alsa Complex, Salai Road, Next to Reliance Digital, Opposite HP Petrol Bunk, Trichy, Tamil Nadu 620018
                  </div>
                  <div className="text-emerald-700 font-medium text-[11px] pt-1">
                    Store open daily 10:00 AM – 9:30 PM. Please bring valid Govt ID / Order confirmation SMS.
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-950 flex items-center space-x-2 pb-3 border-b border-neutral-100">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-medium">
                  3
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* UPI Option */}
                <label
                  onClick={() => handleInputChange('paymentMethod', 'upi')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all block ${
                    formData.paymentMethod === 'upi'
                      ? 'border-orange-600 bg-orange-50/20 ring-2 ring-orange-500/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <QrCode className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-neutral-900">Instant UPI / QR / Google Pay / PhonePe / Paytm</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Fastest
                    </span>
                  </div>

                  {formData.paymentMethod === 'upi' && (
                    <div className="mt-3 pt-3 border-t border-neutral-200/60 space-y-2">
                      <label className="block text-neutral-600 font-medium">Enter Virtual Payment Address (UPI ID) or scan at step 2:</label>
                      <input
                        type="text"
                        value={formData.upiId}
                        onChange={e => handleInputChange('upiId', e.target.value)}
                        placeholder="e.g. rider@okhdfcbank / mobile@ybl"
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                  )}
                </label>

                {/* Credit / Debit Cards */}
                <label
                  onClick={() => handleInputChange('paymentMethod', 'card')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all block ${
                    formData.paymentMethod === 'card'
                      ? 'border-orange-600 bg-orange-50/20 ring-2 ring-orange-500/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <CreditCard className="w-4 h-4 text-neutral-800" />
                    <span className="font-semibold text-neutral-900">Credit / Debit Card (Visa, MasterCard, RuPay)</span>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="mt-3 pt-3 border-t border-neutral-200/60 space-y-3">
                      <div>
                        <label className="block font-medium text-neutral-600 mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={formData.cardNumber}
                          onChange={e => handleInputChange('cardNumber', e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-medium text-neutral-600 mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={formData.cardExpiry}
                            onChange={e => handleInputChange('cardExpiry', e.target.value)}
                            placeholder="12/28"
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-neutral-600 mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={formData.cardCvv}
                            onChange={e => handleInputChange('cardCvv', e.target.value)}
                            placeholder="•••"
                            className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => handleInputChange('paymentMethod', 'cod')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all block ${
                    formData.paymentMethod === 'cod'
                      ? 'border-orange-600 bg-orange-50/20 ring-2 ring-orange-500/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">Cash on Delivery (COD)</span>
                    <span className="text-[10px] text-neutral-500 font-normal">Pay cash or UPI to delivery agent</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-neutral-950 pb-3 border-b border-neutral-100">
                Order Items ({cartCount})
              </h3>

              {/* Items scroll */}
              <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {cart.map(item => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img src={item.product.thumbnail} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200" />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-semibold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-900 line-clamp-1">{item.product.name}</div>
                        <div className="text-[11px] text-neutral-400 font-normal">
                          {item.selectedSize ? `Size: ${item.selectedSize}` : ''} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="font-semibold text-neutral-900">
                      ₹{item.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon form */}
              <div className="pt-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <span className="flex items-center space-x-1.5 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code <strong>{appliedCoupon}</strong> Applied (-₹{cartDiscount.toLocaleString('en-IN')})</span>
                    </span>
                    <button type="button" onClick={removeCoupon} className="text-xs font-semibold text-red-600 hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Coupon Code"
                      className="flex-1 px-3 py-1.5 text-xs border border-neutral-300 rounded-lg uppercase focus:outline-none font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Calculation */}
              <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-neutral-900">
                    {formData.deliveryMethod === 'store_pickup' || cartShipping === 0 ? (
                      <span className="text-emerald-600 font-semibold">FREE</span>
                    ) : (
                      `₹${cartShipping}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Total Due</span>
                  <span className="text-orange-600 font-bold text-lg">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-400 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <span>AUTHORIZING RIDER ORDER...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>CONFIRM & PLACE ORDER • ₹{finalTotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-neutral-400 font-normal">
                By placing this order, you agree to District 38's 07-day exchange and terms of sale.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
