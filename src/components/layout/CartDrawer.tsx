import React from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotal,
    cartLoading,
    updateCartQuantity,
    removeFromCart,
    navigate
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-bold text-neutral-950">Your Cart</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700">
                {cartCount} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart drawer"
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Your cart is empty</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Explore our curated collection of ECE 22.06 helmets, CE Level 2 jackets, and touring accessories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                >
                  <span>Start Exploring Gear</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {cart.map(item => (
                  <div key={`${item.productId}:${item.variantId ?? ''}`} className="py-4 first:pt-0 last:pb-0 flex space-x-3.5 group">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0 cursor-pointer"
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate(`/products/${item.product.slug}`);
                      }}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                              {item.product.brand}
                            </span>
                            <h4
                              onClick={() => {
                                setIsCartOpen(false);
                                navigate(`/products/${item.product.slug}`);
                              }}
                              className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-1 hover:text-orange-600 cursor-pointer transition-colors"
                            >
                              {item.product.name}
                            </h4>
                            {item.variantName && (
                              <div className="text-xs text-neutral-500 mt-0.5">Size: {item.variantName}</div>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId, item.variantId)}
                            aria-label="Remove item"
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.variantId)}
                            disabled={cartLoading}
                            className="p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-neutral-900 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.variantId)}
                            disabled={cartLoading}
                            className="p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-bold text-neutral-900">
                            ₹{item.totalPrice.toLocaleString('en-IN')}
                          </span>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-neutral-400">
                              (₹{item.unitPrice.toLocaleString('en-IN')} each)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/80 space-y-3">
              {/* Price Calculation — server-computed subtotal only; VEYONN
                  has no shipping/tax/discount fields on the cart, so none
                  are estimated here. */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between text-sm font-extrabold text-neutral-950">
                  <span>Subtotal</span>
                  <span className="text-orange-600 font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Primary Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-neutral-300 text-neutral-800 font-semibold text-xs hover:bg-neutral-100 transition-colors"
                >
                  View Full Cart
                </button>
              </div>

              <div className="flex items-center justify-center space-x-4 text-[10px] text-neutral-400 pt-1">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Secure Checkout via Razorpay</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
