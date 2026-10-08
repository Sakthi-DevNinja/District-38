import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useProducts } from '../hooks/use-products';
import { adaptListItem } from '../lib/product-adapter';
import { ProductGrid } from '../components/commerce/ProductGrid';
import { Pagination } from '../components/commerce/Pagination';

const PAGE_SIZE = 24;
import { usePageMeta } from '../hooks/use-page-meta';

// Promotional/coupon codes are NOT a real VEYONN capability today (no
// discount-code field exists anywhere in the checkout contract, and order
// totals are always server-computed) — see the API Gap Report. This page
// only shows genuinely discounted gear (real sellingPrice < mrp from the
// live catalog), never a fabricated coupon.
export const OffersPage: React.FC = () => {
  const { navigate } = useShop();

  usePageMeta({
    title: 'Deals & Clearance',
    description: 'Genuine discounts on ECE 22.06 helmets, riding jackets, and touring accessories at District 38 — no promo code needed.',
    path: '/offers'
  }, []);

  // Server-side: only products priced below MRP, biggest discount first.
  const [page, setPage] = useState(1);
  const productsQuery = useProducts({ onSale: true, sort: 'discount', page, limit: PAGE_SIZE });
  const discountedProducts = (productsQuery.data?.items ?? []).map(adaptListItem);
  const total = productsQuery.data?.total ?? 0;

  const goToPage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
          <Flame className="w-4 h-4 text-amber-200" />
          <span>Live Catalog Discounts</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono uppercase">
          Deals & Clearance
        </h1>
        <p className="text-xs sm:text-sm text-neutral-100 max-w-2xl leading-relaxed">
          Genuine seasonal discounts on ECE 22.06 helmets, riding jackets, and touring accessories — prices as listed, no promo code needed.
        </p>
      </div>

      {/* Discounted Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-950">
            Discounted Gear On Sale ({total})
          </h2>
          <button onClick={() => navigate('/shop')} className="text-xs font-bold text-orange-600 hover:underline">
            View All Catalog →
          </button>
        </div>
        <ProductGrid
          products={discountedProducts}
          isLoading={productsQuery.isLoading}
          error={productsQuery.error}
          emptyTitle="No discounted gear right now"
          emptyDescription="Check back soon — our sale selection updates as new discounts go live."
          columns={4}
        />
        <Pagination page={page} totalPages={productsQuery.data?.totalPages ?? 0} onChange={goToPage} />
      </div>
    </div>
  );
};
