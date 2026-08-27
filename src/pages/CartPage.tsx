import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Tag, 
  RotateCcw,
  MapPin,
  Lock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    navigate,
    addToCart
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const freeShippingThreshold = 2999;
  const progressToFree = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountToFree = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    applyCoupon(couponCode.trim());
    setCouponCode('');
  };

  const recommendedItems = PRODUCTS.filter(p => !cart.some(c => c.productId === p.id)).slice(0, 3);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-950">Your Cart is Currently Empty</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
            You haven't added any riding gear to your bag yet. Check out our certified ECE 22.06 helmets, CE Level 2 jackets, and motorcycle luggage.
          </p>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-colors"
        >
          <span>EXPLORE MOTORCYCLE CATALOG</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Review your gear selections, delivery speed, and applied discounts
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors self-start sm:self-auto"
        >
          Empty Entire Cart
        </button>
      </div>

      {/* 2. Free Shipping Bar */}
      <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
        <div className="max-w-2xl">
          {amountToFree > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-neutral-700">
                <span className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span>Add <strong>₹{amountToFree.toLocaleString('en-IN')}</strong> more for FREE Express Shipping nationwide!</span>
                </span>
                <span className="font-bold text-neutral-900">{progressToFree}%</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600 rounded-full transition-all duration-500" style={{ width: `${progressToFree}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Congratulations! Your order qualifies for FREE Express Doorstep Delivery.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Grid: Cart Items on Left + Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-xs">
            {cart.map(item => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <img
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0 cursor-pointer"
                  onClick={() => navigate(`/products/${item.product.slug}`)}
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-600">
                          {item.product.brand} • {item.product.subcategory}
                        </span>
                        <h3
                          onClick={() => navigate(`/products/${item.product.slug}`)}
                          className="text-sm sm:text-base font-semibold text-neutral-950 hover:text-orange-600 cursor-pointer transition-colors leading-snug mt-0.5"
                        >
                          {item.product.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Variants */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.selectedColor && (
                        <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 text-xs font-medium">
                          Color: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 text-xs font-medium">
                          Size: {item.selectedSize}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-100">
                    <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-semibold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-neutral-900 min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-neutral-950">
                        ₹{item.totalPrice.toLocaleString('en-IN')}
                      </span>
                      {item.quantity > 1 && (
                        <div className="text-[11px] text-neutral-400 font-normal">
                          (₹{item.unitPrice.toLocaleString('en-IN')} each)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rider Special Notes */}
          <div className="p-4 bg-white rounded-2xl border border-neutral-200">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Special Instructions / Delivery Landmark
            </label>
            <textarea
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              placeholder="e.g. Please leave package with security, or call before delivery. Bike model: Himalayan 450."
              rows={2}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-none focus:border-orange-500 resize-none font-normal"
            />
          </div>

          {/* Cross-sell Essentials */}
          {recommendedItems.length > 0 && (
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-900">
                Recommended Additions For Your Ride
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendedItems.map(rec => (
                  <div key={rec.id} className="p-3 bg-white rounded-xl border border-neutral-200 flex flex-col justify-between">
                    <div>
                      <img src={rec.thumbnail} alt={rec.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                      <div className="text-[10px] font-semibold text-orange-600 uppercase">{rec.brand}</div>
                      <div className="text-xs font-semibold text-neutral-900 line-clamp-1">{rec.name}</div>
                      <div className="text-xs font-bold text-neutral-900 mt-1">₹{rec.price.toLocaleString('en-IN')}</div>
                    </div>
                    <button
                      onClick={() => addToCart(rec, 1)}
                      className="mt-3 w-full py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
                    >
                      + Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-neutral-950 pb-3 border-b border-neutral-100">
              Order Summary
            </h2>

            {/* Coupon Code Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <span className="flex items-center space-x-2 font-semibold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Code <strong>{appliedCoupon}</strong> Applied</span>
                  </span>
                  <button onClick={removeCoupon} className="text-xs font-semibold text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Coupon (e.g. DISTRICT10)"
                      className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-xl uppercase focus:outline-none focus:border-orange-500 font-medium"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-normal">
                    Use code <strong className="font-semibold">DISTRICT10</strong> for 10% off.
                  </div>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Items Subtotal ({cartCount})</span>
                <span className="font-semibold text-neutral-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-neutral-900">
                  {cartShipping === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : `₹${cartShipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (Included)</span>
                <span className="text-neutral-500">₹{Math.round(cartSubtotal * 0.18 / 1.18).toLocaleString('en-IN')} (18%)</span>
              </div>

              <div className="flex justify-between text-base font-bold text-neutral-950 pt-3 border-t border-neutral-200">
                <span>Total Amount</span>
                <span className="text-orange-600 font-bold text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Points */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
              <div className="flex items-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>256-Bit SSL Encrypted & Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>07-Day Size Exchange with Reverse Pickup</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                <span>Option to Collect in person at Trichy Flagship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
