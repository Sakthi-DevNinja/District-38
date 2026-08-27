import React from 'react';
import { Flame, Tag, Copy, Check, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductGrid } from '../components/commerce/ProductGrid';

export const OffersPage: React.FC = () => {
  const { applyCoupon, showToast, navigate } = useShop();

  const discountedProducts = PRODUCTS.filter(p => p.discountPercent && p.discountPercent > 0);

  const promoCodes = [
    {
      code: 'DISTRICT10',
      discount: '10% Flat Discount',
      minOrder: 'Valid on orders above ₹4,999',
      desc: 'Exclusive welcome voucher for registered riders on all gear.'
    },
    {
      code: 'TRICHYFREE',
      discount: '100% Free Express Shipping',
      minOrder: 'Valid on all Tamil Nadu orders',
      desc: 'Zero shipping fee with priority next-day dispatch from Trichy.'
    },
    {
      code: 'HELMET500',
      discount: '₹500 Instant Cashback',
      minOrder: 'Valid on any ECE 22.06 Helmet',
      desc: 'Upgrade your head protection with direct manufacturer rebates.'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    showToast(`Code ${code} copied & applied to your active cart!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
          <Flame className="w-4 h-4 text-amber-200" />
          <span>Limited Time Deals & Coupons</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono uppercase">
          Promotions & Clearance
        </h1>
        <p className="text-xs sm:text-sm text-neutral-100 max-w-2xl leading-relaxed">
          Grab factory rebates and seasonal inventory clearances on MT Helmets, Rynox riding jackets, ViaTerra luggage, and SMK motorcycle lids.
        </p>
      </div>

      {/* Active Promo Codes */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-950">Active Promo Vouchers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {promoCodes.map(promo => (
            <div key={promo.code} className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-base text-orange-600 tracking-wider">
                    {promo.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                    Active
                  </span>
                </div>
                <div className="font-bold text-sm text-neutral-900 mt-2">{promo.discount}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{promo.desc}</div>
                <div className="text-[10px] text-neutral-400 mt-2 font-medium">{promo.minOrder}</div>
              </div>

              <button
                onClick={() => handleCopy(promo.code)}
                className="w-full py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy & Apply Code</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Discounted Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-950">
            Discounted Gear On Sale ({discountedProducts.length})
          </h2>
          <button onClick={() => navigate('/shop')} className="text-xs font-bold text-orange-600 hover:underline">
            View All Catalog →
          </button>
        </div>
        <ProductGrid products={discountedProducts} columns={4} />
      </div>
    </div>
  );
};
