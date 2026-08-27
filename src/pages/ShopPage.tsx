import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  ChevronDown, 
  X, 
  RotateCcw, 
  Flame, 
  ShieldCheck, 
  Sparkles,
  Search,
  Grid,
  Columns
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useProducts } from '../hooks/use-products';
import { useCategories } from '../hooks/use-categories';
import { adaptListItem, slugifyCategoryName } from '../lib/product-adapter';
import { ProductGrid } from '../components/commerce/ProductGrid';
import { FilterDrawer } from '../components/commerce/FilterDrawer';

interface ShopPageProps {
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory }) => {
  const { 
    shopFilters, 
    updateShopFilters, 
    resetShopFilters, 
    routeParams, 
    currentRoute,
    navigate 
  } = useShop();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [columns, setColumns] = useState<3 | 4>(4);

  // Sync category if passed
  const effectiveCategory = initialCategory || shopFilters.category;

  // Real VEYONN catalog — the fetched page IS "the catalog" for filtering
  // purposes (matches the previous static-array approach); category,
  // price, stock, and sale filters all continue to apply client-side over
  // this page, same as before. Only q is passed server-side (a real
  // filter VEYONN's public API supports) — category/brand stay
  // client-side here because shopFilters stores names/slugs the API
  // doesn't accept directly (see FilterDrawer's own note on this).
  const productsQuery = useProducts({ q: shopFilters.searchQuery, limit: 100 });
  const categoriesQuery = useCategories();
  const allProducts = useMemo(
    () => (productsQuery.data?.items ?? []).map(adaptListItem),
    [productsQuery.data],
  );

  // Compute active category name or search title if applicable — VEYONN
  // categories carry no slug of their own, so this matches by a
  // client-derived slug of the real category name (see
  // slugifyCategoryName's own doc comment).
  const activeCategory = (categoriesQuery.data ?? []).find(
    (c) => slugifyCategoryName(c.name) === effectiveCategory,
  );

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // 1. Search Query
      if (shopFilters.searchQuery) {
        const query = shopFilters.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchBrand = product.brand.toLowerCase().includes(query);
        const matchSub = product.subcategory.toLowerCase().includes(query);
        const matchFeature = product.features.some(f => f.toLowerCase().includes(query));
        if (!matchName && !matchBrand && !matchSub && !matchFeature) return false;
      }

      // 2. Category
      if (effectiveCategory && product.category !== effectiveCategory) {
        return false;
      }

      // 3. Subcategory
      if (shopFilters.subcategory && product.subcategory !== shopFilters.subcategory) {
        return false;
      }

      // 4. Brands
      if (shopFilters.brand.length > 0 && !shopFilters.brand.includes(product.brand)) {
        return false;
      }

      // 5. Price Range
      if (product.price < shopFilters.priceRange[0] || product.price > shopFilters.priceRange[1]) {
        return false;
      }

      // 6. Certifications
      if (shopFilters.certifications.length > 0) {
        if (!product.certifications || !product.certifications.some(c => shopFilters.certifications.includes(c as any))) {
          return false;
        }
      }

      // 7. Riding Styles
      if (shopFilters.ridingStyles.length > 0) {
        if (!product.ridingStyles || !product.ridingStyles.some(s => shopFilters.ridingStyles.includes(s as any))) {
          return false;
        }
      }

      // 8. In Stock Only
      if (shopFilters.inStockOnly && !product.inStock) {
        return false;
      }

      // 9. On Sale Only
      if (shopFilters.onSaleOnly && (!product.discountPercent || product.discountPercent <= 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (shopFilters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [allProducts, shopFilters]);

  // Active filter count
  const activeFiltersCount = 
    (shopFilters.category ? 1 : 0) +
    (shopFilters.subcategory ? 1 : 0) +
    shopFilters.brand.length +
    shopFilters.certifications.length +
    shopFilters.ridingStyles.length +
    (shopFilters.inStockOnly ? 1 : 0) +
    (shopFilters.onSaleOnly ? 1 : 0) +
    (shopFilters.searchQuery ? 1 : 0) +
    (shopFilters.priceRange[1] < 40000 ? 1 : 0);

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-10 border border-neutral-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1.5 flex items-center space-x-1.5">
            <span>District 38 Catalog</span>
            <span>•</span>
            <span>Trichy Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {shopFilters.searchQuery 
              ? `Results for "${shopFilters.searchQuery}"`
              : activeCategory 
              ? activeCategory.name 
              : 'All Motorcycle Riding Gear'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
            {activeCategory?.description || 'Explore our full lineup of ECE 22.06 helmets, CE Level 2 jackets, luggage systems, and genuine bike care products.'}
          </p>
        </div>
      </div>

      {/* 2. Top Bar: Controls & Active Chips */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        {/* Left: Filter Toggle for Mobile + Results count */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px]">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="text-xs font-semibold text-neutral-500">
            Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> products
          </span>
        </div>

        {/* Right: Sort & Grid layout switchers */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-neutral-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={shopFilters.sortBy}
              onChange={(e) => updateShopFilters({ sortBy: e.target.value as any })}
              className="px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-orange-500"
            >
              <option value="featured">Featured & Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Drops</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center space-x-1 border border-neutral-300 rounded-xl p-1 bg-white">
            <button
              onClick={() => setColumns(3)}
              className={`p-1.5 rounded-lg transition-colors ${columns === 3 ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
              title="3 Columns"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setColumns(4)}
              className={`p-1.5 rounded-lg transition-colors ${columns === 4 ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
              title="4 Columns"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-neutral-400">Active Filters:</span>
          
          {shopFilters.category && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
              <span>Category: {activeCategory?.name || shopFilters.category}</span>
              <button onClick={() => updateShopFilters({ category: undefined })} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {shopFilters.searchQuery && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium border border-orange-200">
              <span>Query: "{shopFilters.searchQuery}"</span>
              <button onClick={() => updateShopFilters({ searchQuery: undefined })} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {shopFilters.brand.map(b => (
            <span key={b} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
              <span>Brand: {b}</span>
              <button 
                onClick={() => updateShopFilters({ brand: shopFilters.brand.filter(item => item !== b) })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {shopFilters.certifications.map(c => (
            <span key={c} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
              <span>Cert: {c}</span>
              <button 
                onClick={() => updateShopFilters({ certifications: shopFilters.certifications.filter(item => item !== c) })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {shopFilters.ridingStyles.map(s => (
            <span key={s} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
              <span>Style: {s}</span>
              <button 
                onClick={() => updateShopFilters({ ridingStyles: shopFilters.ridingStyles.filter(item => item !== s) })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {shopFilters.inStockOnly && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
              <span>In Stock Only</span>
              <button onClick={() => updateShopFilters({ inStockOnly: false })} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {shopFilters.onSaleOnly && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium border border-orange-200">
              <span>On Sale Only</span>
              <button onClick={() => updateShopFilters({ onSaleOnly: false })} className="hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={resetShopFilters}
            className="text-xs font-bold text-red-600 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 3. Main Content: Desktop Sidebar + Product Grid */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sticky Sidebar */}
        <div className="hidden lg:block sticky top-24">
          <FilterDrawer isOpen={true} onClose={() => {}} isDesktopSidebar={true} />
        </div>

        {/* Mobile Slide-in Drawer */}
        <FilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid
            products={filteredProducts}
            isLoading={productsQuery.isLoading}
            error={productsQuery.error}
            columns={columns}
            emptyTitle="No gear matches these specifications"
            emptyDescription="We couldn't find items matching your active combination of brand, safety certification, and price filters."
          />
        </div>
      </div>
    </div>
  );
};
