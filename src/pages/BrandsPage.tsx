import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useBrands } from '../hooks/use-brands';
import { useProducts } from '../hooks/use-products';
import { adaptListItem, slugifyCategoryName as slugify } from '../lib/product-adapter';
import { ProductGrid } from '../components/commerce/ProductGrid';
import { usePageMeta } from '../hooks/use-page-meta';

interface BrandsPageProps {
  brandSlug?: string;
}

export const BrandsPage: React.FC<BrandsPageProps> = ({ brandSlug }) => {
  const { navigate, updateShopFilters } = useShop();
  const brandsQuery = useBrands();

  // Real VEYONN brands carry no slug of their own — same situation as
  // categories (see product-adapter.ts's own note) — matched here by a
  // client-derived slug of the real brand name.
  const selectedBrand = brandSlug
    ? (brandsQuery.data ?? []).find((b) => slugify(b.name) === brandSlug)
    : null;

  const brandProductsQuery = useProducts({ brandId: selectedBrand?.id, limit: 100 });

  usePageMeta({
    title: brandSlug
      ? (selectedBrand ? `${selectedBrand.name} — Authorised Dealer` : 'Brand')
      : 'Shop by Brand',
    description: brandSlug
      ? (selectedBrand?.description ?? `Shop genuine ${selectedBrand?.name ?? ''} motorcycle gear at District 38, an authorised dealer.`)
      : 'District 38 is an authorised dealer for MT Helmets, Axor, Rynox, SMK, ViaTerra, Motul, and more.',
    path: brandSlug ? `/brands/${brandSlug}` : '/brands'
  }, [brandSlug, selectedBrand?.id]);

  if (brandSlug) {
    if (brandsQuery.isLoading) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-sm text-neutral-400">Loading brand…</p>
        </div>
      );
    }

    if (!selectedBrand) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="text-xl font-bold text-neutral-900">Brand not found</h1>
          <button
            onClick={() => navigate('/brands')}
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs"
          >
            Browse all brands
          </button>
        </div>
      );
    }

    const brandProducts = (brandProductsQuery.data?.items ?? []).map(adaptListItem);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 border border-neutral-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-orange-400 font-mono uppercase">
            <span>Official Authorised Partner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{selectedBrand.name}</h1>
          {selectedBrand.description && (
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              {selectedBrand.description}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-950">
              {selectedBrand.name} Products Available at District 38 ({brandProducts.length})
            </h2>
            <button
              onClick={() => {
                updateShopFilters({ brand: [selectedBrand.id] });
                navigate('/shop');
              }}
              className="text-xs font-bold text-orange-600 hover:underline"
            >
              Filter in Full Catalog →
            </button>
          </div>
          <ProductGrid
            products={brandProducts}
            isLoading={brandProductsQuery.isLoading}
            error={brandProductsQuery.error}
            columns={4}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
          Global & Indian Engineering
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
          Authorized Motorcycle Brand Directory
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
          District 38 is an authorized retail distributor for the world’s leading motorcycle safety and touring equipment manufacturers. Every product comes with full manufacturer warranty.
        </p>
      </div>

      {brandsQuery.isLoading && (
        <p className="text-center text-sm text-neutral-400">Loading brands…</p>
      )}

      {brandsQuery.error && (
        <p className="text-center text-sm text-red-500">Couldn't load brands right now.</p>
      )}

      {!brandsQuery.isLoading && !brandsQuery.error && (brandsQuery.data ?? []).length === 0 && (
        <p className="text-center text-sm text-neutral-400">No brands available yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(brandsQuery.data ?? []).map(brand => (
          <div
            key={brand.id}
            onClick={() => navigate(`/brands/${slugify(brand.name)}`)}
            className="group p-6 bg-white rounded-2xl border border-neutral-200 hover:border-orange-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white font-black text-xs flex items-center justify-center font-mono">
                {brand.name.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-950 group-hover:text-orange-600 transition-colors">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-3 leading-relaxed">
                    {brand.description}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end text-xs">
              <span className="font-bold text-orange-600 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
