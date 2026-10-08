import React from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useNoIndex } from '../hooks/use-noindex';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartLoading,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    navigate
  } = useShop();

  useNoIndex('Your Cart');

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
            Review your gear selections before checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          disabled={cartLoading}
          className="text-xs font-semibold text-neutral-500 hover:text-red-600 transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          Empty Entire Cart
        </button>
      </div>

      {/* 2. Main Grid: Cart Items on Left + Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-xs">
            {cart.map(item => (
              <div key={`${item.productId}:${item.variantId ?? ''}`} className="p-4 sm:p-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
                          {item.product.brand}
                        </span>
                        <h3
                          onClick={() => navigate(`/products/${item.product.slug}`)}
                          className="text-sm sm:text-base font-semibold text-neutral-950 hover:text-orange-600 cursor-pointer transition-colors leading-snug mt-0.5"
                        >
                          {item.product.name}
                        </h3>
                        {item.variantName && (
                          <div className="text-xs text-neutral-500 mt-0.5">Size: {item.variantName}</div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-neutral-100">
                    <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.variantId)}
                        disabled={cartLoading}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-semibold disabled:opacity-50"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-neutral-900 min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.variantId)}
                        disabled={cartLoading}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 font-semibold disabled:opacity-50"
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
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-neutral-950 pb-3 border-b border-neutral-100">
              Order Summary
            </h2>

            {/* Price Calculations — server-computed subtotal only.
                VEYONN has no shipping/tax/discount fields on the cart, so
                none are estimated or fabricated here. */}
            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Items Subtotal ({cartCount})</span>
                <span className="font-semibold text-neutral-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-neutral-950 pt-3 border-t border-neutral-200">
                <span>Subtotal</span>
                <span className="text-orange-600 font-bold text-lg">₹{cartSubtotal.toLocaleString('en-IN')}</span>
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
                <span>Secure Checkout via Razorpay</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span>Order becomes a verified District 38 Sales Order</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
