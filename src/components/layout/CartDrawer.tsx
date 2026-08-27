import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Tag, 
  Check 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/products';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartCount, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    navigate,
    addToCart
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2999;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  // Recommended quick add accessories
  const recommendedItems = PRODUCTS.filter(p => !cart.some(c => c.productId === p.id)).slice(0, 2);

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

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100 text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-neutral-700 font-medium">
                  <span className="flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-orange-600" />
                    <span>Add <strong>₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for Free Shipping</span>
                  </span>
                  <span className="font-bold text-neutral-900">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-600 rounded-full transition-all duration-500" 
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>You qualify for FREE Express Shipping nationwide!</span>
              </div>
            )}
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
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex space-x-3.5 group">
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
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Variants pill */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {item.selectedColor && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium">
                              Color: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium">
                              Size: {item.selectedSize}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-neutral-900 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
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

            {/* Quick Add Cross-sells in Cart */}
            {cart.length > 0 && recommendedItems.length > 0 && (
              <div className="pt-4 border-t border-neutral-100">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                  Frequently Added with this Gear
                </div>
                <div className="space-y-2">
                  {recommendedItems.map(item => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img src={item.thumbnail} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-white" />
                        <div>
                          <div className="text-xs font-semibold text-neutral-900 line-clamp-1">{item.name}</div>
                          <div className="text-xs font-bold text-neutral-800">₹{item.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-neutral-300 text-xs font-bold text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer & Checkout summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/80 space-y-3">
              {/* Coupon Form */}
              <div className="relative">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <span className="flex items-center space-x-1.5 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code <strong>{appliedCoupon}</strong> Applied (-₹{cartDiscount.toLocaleString('en-IN')})</span>
                    </span>
                    <button onClick={removeCoupon} className="text-xs font-bold text-red-600 hover:underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="Coupon code (e.g. DISTRICT10)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-orange-500 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
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
                    {cartShipping === 0 ? <span className="text-emerald-600">FREE</span> : `₹${cartShipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-950 pt-2 border-t border-neutral-200">
                  <span>Estimated Total</span>
                  <span className="text-orange-600 font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
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
                  View Full Cart & Estimated Delivery
                </button>
              </div>

              <div className="flex items-center justify-center space-x-4 text-[10px] text-neutral-400 pt-1">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
                <span>•</span>
                <span>Trichy Store Warranty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
