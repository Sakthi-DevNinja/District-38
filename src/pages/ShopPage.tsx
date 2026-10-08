import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  X,
  Grid,
  Columns
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useProducts } from '../hooks/use-products';
import { useCategories } from '../hooks/use-categories';
import { useBrands } from '../hooks/use-brands';
import { adaptListItem, slugifyCategoryName } from '../lib/product-adapter';
import { ProductGrid } from '../components/commerce/ProductGrid';
import { Pagination } from '../components/commerce/Pagination';
import { tagTitle } from '../lib/collections';
import { FilterDrawer, NO_PRICE_LIMIT } from '../components/commerce/FilterDrawer';
import { usePageMeta } from '../hooks/use-page-meta';
import { CatalogSort } from '../lib/api/types';
import { FilterState } from '../types';

const PAGE_SIZE = 24;

const SORT_PARAM: Record<FilterState['sortBy'], CatalogSort> = {
  newest: 'newest',
  'price-asc': 'price_asc',
  'price-desc': 'price_desc',
  discount: 'discount',
  // Not offered by the catalog API; fall back to newest first.
  featured: 'newest',
  rating: 'newest'
};

interface ShopPageProps {
  initialCategory?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory }) => {
  const {
    shopFilters,
    updateShopFilters,
    resetShopFilters,
    currentRoute
  } = useShop();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [columns, setColumns] = useState<3 | 4>(4);

  const effectiveCategory = initialCategory || shopFilters.category;
  const categoriesQuery = useCategories();
  const brandsQuery = useBrands();

  // Routes carry a category slug; VEYONN categories have no slug of their
  // own, so it is matched against a slug of the real category name.
  const activeCategory = (categoriesQuery.data ?? []).find(
    (c) => slugifyCategoryName(c.name) === effectiveCategory,
  );
  const waitingForCategory = !!effectiveCategory && categoriesQuery.isLoading;
  const unknownCategory = !!effectiveCategory && !categoriesQuery.isLoading && !activeCategory;

  const filterParams = {
    q: shopFilters.searchQuery || undefined,
    productCategoryId: activeCategory?.id,
    brandId: shopFilters.brand[0],
    priceMax: shopFilters.priceRange[1] < NO_PRICE_LIMIT ? shopFilters.priceRange[1] : undefined,
    inStock: shopFilters.inStockOnly || undefined,
    tag: shopFilters.tag,
    onSale: shopFilters.onSaleOnly || undefined,
    sort: SORT_PARAM[shopFilters.sortBy]
  };

  // Changing any filter starts again from page 1, without an extra render.
  const filterKey = JSON.stringify([filterParams, effectiveCategory]);
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;

  const productsQuery = useProducts({ ...filterParams, page, limit: PAGE_SIZE, facets: true });
  const result = productsQuery.data;
  const facets = result?.facets;

  const products = useMemo(
    () => (unknownCategory || waitingForCategory ? [] : (result?.items ?? []).map(adaptListItem)),
    [result, unknownCategory, waitingForCategory],
  );
  const total = unknownCategory ? 0 : (result?.total ?? 0);
  const totalPages = unknownCategory ? 0 : (result?.totalPages ?? 0);

  const goToPage = (next: number) => {
    setPageState({ key: filterKey, page: next });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  usePageMeta({
    title: activeCategory ? `${activeCategory.name} — Shop` : 'Shop All Motorcycle Gear',
    description: activeCategory
      ? (activeCategory.description ?? `Shop ${activeCategory.name} at District 38 — authorised, genuine motorcycle riding gear.`)
      : 'Browse the full District 38 catalog — ECE 22.06 helmets, riding jackets, gloves, and touring accessories.',
    path: currentRoute
  }, [activeCategory?.id, currentRoute]);

  const brandName = (id: string) => (brandsQuery.data ?? []).find(b => b.id === id)?.name ?? 'Selected brand';

  const activeFiltersCount =
    (shopFilters.category ? 1 : 0) +
    shopFilters.brand.length +
    (shopFilters.inStockOnly ? 1 : 0) +
    (shopFilters.onSaleOnly ? 1 : 0) +
    (shopFilters.tag ? 1 : 0) +
    (shopFilters.searchQuery ? 1 : 0) +
    (shopFilters.priceRange[1] < NO_PRICE_LIMIT ? 1 : 0);

  const firstShown = (page - 1) * PAGE_SIZE + 1;
  const lastShown = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-10 border border-neutral-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1.5 flex items-center space-x-1.5">
            <span>District 38 Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {shopFilters.searchQuery
              ? `Results for "${shopFilters.searchQuery}"`
              : shopFilters.tag
              ? tagTitle(shopFilters.tag)
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
            {productsQuery.isLoading && !result ? (
              'Loading products…'
            ) : total === 0 ? (
              'No products'
            ) : totalPages > 1 ? (
              <>Showing <strong className="text-neutral-900">{firstShown}–{lastShown}</strong> of <strong className="text-neutral-900">{total}</strong> products</>
            ) : (
              <><strong className="text-neutral-900">{total}</strong> {total === 1 ? 'product' : 'products'}</>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-neutral-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={SORT_PARAM[shopFilters.sortBy] === 'newest' ? 'newest' : shopFilters.sortBy}
              onChange={(e) => updateShopFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 focus:outline-none focus:border-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
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
              <button onClick={() => updateShopFilters({ category: undefined })} className="hover:text-red-600" aria-label="Remove category filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {shopFilters.searchQuery && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium border border-orange-200">
              <span>Query: "{shopFilters.searchQuery}"</span>
              <button onClick={() => updateShopFilters({ searchQuery: '' })} className="hover:text-red-600" aria-label="Clear search">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {shopFilters.brand.map(id => (
            <span key={id} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
              <span>Brand: {brandName(id)}</span>
              <button
                onClick={() => updateShopFilters({ brand: [] })}
                className="hover:text-red-600"
                aria-label="Remove brand filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {shopFilters.priceRange[1] < NO_PRICE_LIMIT && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
              <span>Up to ₹{shopFilters.priceRange[1].toLocaleString('en-IN')}</span>
              <button
                onClick={() => updateShopFilters({ priceRange: [shopFilters.priceRange[0], NO_PRICE_LIMIT] })}
                className="hover:text-red-600"
                aria-label="Remove price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {shopFilters.tag && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium border border-orange-200">
              <span>Collection: {tagTitle(shopFilters.tag)}</span>
              <button onClick={() => updateShopFilters({ tag: undefined })} className="hover:text-red-600" aria-label="Remove collection filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {shopFilters.onSaleOnly && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium border border-orange-200">
              <span>On Sale</span>
              <button onClick={() => updateShopFilters({ onSaleOnly: false })} className="hover:text-red-600" aria-label="Remove on-sale filter">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {shopFilters.inStockOnly && (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200">
              <span>In Stock Only</span>
              <button onClick={() => updateShopFilters({ inStockOnly: false })} className="hover:text-red-600" aria-label="Remove in-stock filter">
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
        <div className="hidden lg:block sticky top-24">
          <FilterDrawer isOpen={true} onClose={() => {}} isDesktopSidebar={true} facets={facets} />
        </div>

        <FilterDrawer
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          facets={facets}
          resultCount={total}
        />

        <div className="flex-1 space-y-8">
          <ProductGrid
            products={products}
            isLoading={productsQuery.isLoading || waitingForCategory}
            error={productsQuery.error}
            columns={columns}
            emptyTitle="No gear matches these filters"
            emptyDescription="Try another brand, a higher price limit, or clear the filters to see everything."
          />

          <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
        </div>
      </div>
    </div>
  );
};
