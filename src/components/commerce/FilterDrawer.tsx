import React from 'react';
import { X, RotateCcw, Flame } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useCategories } from '../../hooks/use-categories';
import { useBrands } from '../../hooks/use-brands';
import { slugifyCategoryName as slugify } from '../../lib/product-adapter';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopSidebar?: boolean;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  isDesktopSidebar = false
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

  const handleBrandToggle = (brandName: string) => {
    const brands = [...shopFilters.brand];
    const index = brands.indexOf(brandName);
    if (index > -1) {
      brands.splice(index, 1);
    } else {
      brands.push(brandName);
    }
    updateShopFilters({ brand: brands });
  };

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
          <span className="font-medium text-neutral-800">In Stock at Trichy Hub only</span>
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={shopFilters.onSaleOnly}
            onChange={(e) => updateShopFilters({ onSaleOnly: e.target.checked })}
            className="w-4 h-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="font-medium text-neutral-800 flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>On Sale & Discounted</span>
          </span>
        </label>
      </div>

      {/* 4. Brands */}
      <div className="pt-2 border-t border-neutral-100">
        <div className="font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
          Authorized Brands
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {(brandsQuery.data ?? []).map(b => {
            const isChecked = shopFilters.brand.includes(b.name);
            return (
              <label key={b.id} className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleBrandToggle(b.name)}
                  className="w-4 h-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-medium text-neutral-800">{b.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 7. Price Filter */}
      <div className="pt-2 border-t border-neutral-100">
        <div className="font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
          Max Price: ₹{shopFilters.priceRange[1].toLocaleString('en-IN')}
        </div>
        <input
          type="range"
          min="500"
          max="40000"
          step="500"
          value={shopFilters.priceRange[1]}
          onChange={(e) => updateShopFilters({ priceRange: [shopFilters.priceRange[0], parseInt(e.target.value)] })}
          className="w-full accent-orange-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
          <span>₹500</span>
          <span>₹20,000</span>
          <span>₹40,000+</span>
        </div>
      </div>
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
              SHOW RESULTS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
