import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useCategories } from '../../hooks/use-categories';
import { useBrands } from '../../hooks/use-brands';
import { slugifyCategoryName as slugify } from '../../lib/product-adapter';
import { CatalogFacets } from '../../lib/api/types';

/** The default max price, meaning "no price filter". */
export const NO_PRICE_LIMIT = 50000;
const PRICE_STEP = 500;

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopSidebar?: boolean;
  /** Brands and price range for the current category/search, from the catalog API. */
  facets?: CatalogFacets;
  /** Shown on the mobile "show results" button. */
  resultCount?: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  isDesktopSidebar = false,
  facets,
  resultCount
}) => {
  const { shopFilters, updateShopFilters, resetShopFilters } = useShop();
  const categoriesQuery = useCategories();
  const brandsQuery = useBrands();

  const handleCategoryToggle = (slug: string) => {
    updateShopFilters({
      category: shopFilters.category === slug ? undefined : slug,
      subcategory: undefined
    });
  };

  // One brand at a time — the catalog API filters on a single brand.
  const handleBrandToggle = (brandId: string) => {
    updateShopFilters({ brand: shopFilters.brand[0] === brandId ? [] : [brandId] });
  };

  // Brands in view, plus the selected one even when other filters leave it
  // with no matches — otherwise it could not be unselected here.
  const selectedBrandId = shopFilters.brand[0];
  const brandOptions = [...(facets?.brands ?? [])];
  if (selectedBrandId && !brandOptions.some(b => b.id === selectedBrandId)) {
    const selected = (brandsQuery.data ?? []).find(b => b.id === selectedBrandId);
    if (selected) brandOptions.push({ id: selected.id, name: selected.name, count: 0 });
  }

  // Slider bounds follow the real prices in view, rounded to whole steps.
  const priceFloor = facets?.priceRange
    ? Math.floor(facets.priceRange.min / PRICE_STEP) * PRICE_STEP
    : 0;
  const priceCeiling = facets?.priceRange
    ? Math.ceil(facets.priceRange.max / PRICE_STEP) * PRICE_STEP
    : 0;
  const showPriceFilter = priceCeiling - priceFloor >= PRICE_STEP;
  const priceValue = Math.min(shopFilters.priceRange[1], priceCeiling);
  const formatPrice = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  // Certification/riding-style filters are intentionally NOT rendered
  // below — VEYONN's public catalog has no such fields on a product today
  // (no fabricated filter that could never actually match anything real).

  const content = (
    <div className="space-y-6 text-xs text-neutral-800">
      {/* 1. Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <span className="font-bold text-sm text-neutral-950 uppercase tracking-wider">
          Filter Gear
        </span>
        <button
          onClick={resetShopFilters}
          className="flex items-center space-x-1 text-neutral-500 hover:text-orange-600 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 2. Categories */}
      <div>
        <div className="font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
          Categories
        </div>
        <div className="space-y-1.5">
          {(categoriesQuery.data ?? []).map(c => {
            const slug = slugify(c.name);
            const isSelected = shopFilters.category === slug;
            return (
              <button
                key={c.id}
                onClick={() => handleCategoryToggle(slug)}
                className={`w-full flex items-center px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                  isSelected ? 'bg-neutral-900 text-white font-bold' : 'hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Availability Toggles */}
      <div className="space-y-2 pt-2 border-t border-neutral-100">
        <label className="flex items-center space-x-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={shopFilters.inStockOnly}
            onChange={(e) => updateShopFilters({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="font-medium text-neutral-800">In Stock only</span>
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={shopFilters.onSaleOnly}
            onChange={(e) => updateShopFilters({ onSaleOnly: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="font-medium text-neutral-800">On Sale</span>
        </label>

      </div>

      {/* 4. Brands */}
      {brandOptions.length > 0 && (
        <div className="pt-2 border-t border-neutral-100">
          <div className="font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
            Brands
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {brandOptions.map(b => (
              <label key={b.id} className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name={isDesktopSidebar ? 'brand-desktop' : 'brand-mobile'}
                  checked={shopFilters.brand[0] === b.id}
                  onClick={() => handleBrandToggle(b.id)}
                  onChange={() => {}}
                  className="w-4 h-4 border-neutral-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-medium text-neutral-800 flex-1">{b.name}</span>
                <span className="text-neutral-400">{b.count}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 5. Price */}
      {showPriceFilter && (
        <div className="pt-2 border-t border-neutral-100">
          <div className="font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
            Max Price: {priceValue >= priceCeiling ? 'Any' : formatPrice(priceValue)}
          </div>
          <input
            type="range"
            min={priceFloor}
            max={priceCeiling}
            step={PRICE_STEP}
            value={priceValue}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              updateShopFilters({
                priceRange: [shopFilters.priceRange[0], value >= priceCeiling ? NO_PRICE_LIMIT : value]
              });
            }}
            aria-label="Maximum price"
            className="w-full accent-orange-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
            <span>{formatPrice(priceFloor)}</span>
            <span>{formatPrice(priceCeiling)}</span>
          </div>
        </div>
      )}
    </div>
  );

  if (isDesktopSidebar) {
    return <div className="w-64 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs shrink-0">{content}</div>;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-in fade-in duration-200">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between pb-4 mb-2">
            <h3 className="font-extrabold text-base text-neutral-950">Filters</h3>
            <button onClick={onClose} className="p-1 rounded-full text-neutral-400 hover:text-neutral-900">
              <X className="w-5 h-5" />
            </button>
          </div>
          {content}
          <div className="mt-8 pt-4 border-t border-neutral-100">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold text-xs tracking-wide shadow-md"
            >
              {resultCount === undefined ? 'SHOW RESULTS' : `SHOW ${resultCount} ${resultCount === 1 ? 'RESULT' : 'RESULTS'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
