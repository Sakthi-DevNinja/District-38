import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Clock, 
  TrendingUp,
  Tag,
  BookOpen 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useProducts } from '../../hooks/use-products';
import { useCategories } from '../../hooks/use-categories';
import { useBrands } from '../../hooks/use-brands';
import { adaptListItem, slugifyCategoryName as slugify } from '../../lib/product-adapter';
import { RIDING_GUIDES } from '../../data/guides';

// Each term must return results from the live catalog — check them
// whenever brands or categories are unpublished.
const POPULAR_SEARCHES = ['Axor Apex', 'Riding Gloves', 'Tail Bag', 'Visor', 'Tank Bag', 'Boots'];

export const SearchOverlay: React.FC = () => {
  const { 
    isSearchOpen,
    setIsSearchOpen,
    navigate,
    updateShopFilters,
    recentSearches,
    addRecentSearch,
    clearRecentSearches
  } = useShop();

  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInputVal('');
    }
  }, [isSearchOpen]);

  const cleanQuery = inputVal.trim().toLowerCase();

  // Real VEYONN catalog search — `q` is a genuine server-side filter.
  // Only fetched once a query is actually typed (an empty search overlay
  // shouldn't hit the network). Categories/brands have no server-side
  // search endpoint of their own — matched client-side over the same
  // small "all of them" lists FilterDrawer already loads elsewhere.
  const productsQuery = useProducts({ q: cleanQuery || undefined, limit: 5 });
  const categoriesQuery = useCategories();
  const brandsQuery = useBrands();

  if (!isSearchOpen) return null;

  const matchedProducts = cleanQuery ? (productsQuery.data?.items ?? []).map(adaptListItem) : [];

  const matchedCategories = cleanQuery
    ? (categoriesQuery.data ?? []).filter(c => c.name.toLowerCase().includes(cleanQuery))
    : [];

  const matchedBrands = cleanQuery
    ? (brandsQuery.data ?? []).filter(b => b.name.toLowerCase().includes(cleanQuery))
    : [];

  const matchedGuides = cleanQuery
    ? RIDING_GUIDES.filter(g => g.title.toLowerCase().includes(cleanQuery) || g.tags.some(t => t.toLowerCase().includes(cleanQuery)))
    : [];

  const handleSearchSubmit = (term: string) => {
    if (!term.trim()) return;
    addRecentSearch(term);
    setIsSearchOpen(false);
    updateShopFilters({ searchQuery: term.trim() });
    navigate('/shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      {/* Dark backdrop */}
      <div 
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      <div className="relative min-h-screen flex flex-col justify-start items-center pt-8 sm:pt-16 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
          {/* Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center space-x-3">
            <Search className="w-5 h-5 text-neutral-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchSubmit(inputVal);
                if (e.key === 'Escape') setIsSearchOpen(false);
              }}
              placeholder="Search helmets, riding jackets, tailbags, ECE 22.06..."
              className="w-full text-base sm:text-lg font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />
            {inputVal && (
              <button
                onClick={() => setInputVal('')}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors shrink-0"
            >
              ESC
            </button>
          </div>

          {/* Results / Default Suggestions */}
          <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6 space-y-6">
            {cleanQuery ? (
              <>
                {/* Products matching */}
                {matchedProducts.length > 0 && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                      Matching Gear ({matchedProducts.length})
                    </div>
                    <div className="divide-y divide-neutral-100">
                      {matchedProducts.map(product => (
                        <div
                          key={product.id}
                          onClick={() => {
                            addRecentSearch(product.name);
                            setIsSearchOpen(false);
                            navigate(`/products/${product.slug}`);
                          }}
                          className="py-2.5 flex items-center justify-between hover:bg-neutral-50 rounded-xl px-2 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            {product.thumbnail ? (
                              <img
                                src={product.thumbnail}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 shrink-0" />
                            )}
                            <div>
                              <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                                {product.brand}{product.subcategory && ` • ${product.subcategory}`}
                              </div>
                              <div className="text-sm font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                                {product.name}
                              </div>
                              <div className="text-xs font-bold text-neutral-800">
                                ₹{product.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brands & Categories matching */}
                {(matchedBrands.length > 0 || matchedCategories.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {matchedBrands.length > 0 && (
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                          Brands
                        </div>
                        <div className="space-y-1.5">
                          {matchedBrands.map(b => (
                            <button
                              key={b.id}
                              onClick={() => {
                                setIsSearchOpen(false);
                                navigate(`/brands/${slugify(b.name)}`);
                              }}
                              className="w-full text-left p-2 rounded-lg hover:bg-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800"
                            >
                              <span>{b.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchedCategories.length > 0 && (
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                          Categories
                        </div>
                        <div className="space-y-1.5">
                          {matchedCategories.map(c => (
                            <button
                              key={c.id}
                              onClick={() => {
                                setIsSearchOpen(false);
                                navigate(`/${slugify(c.name)}`);
                              }}
                              className="w-full text-left p-2 rounded-lg hover:bg-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800"
                            >
                              <span>{c.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Guides matching */}
                {matchedGuides.length > 0 && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Riding Guides & Technical Articles
                    </div>
                    <div className="space-y-2">
                      {matchedGuides.map(g => (
                        <button
                          key={g.id}
                          onClick={() => {
                            setIsSearchOpen(false);
                            navigate(`/guides/${g.slug}`);
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-2.5">
                            <BookOpen className="w-4 h-4 text-orange-600 shrink-0" />
                            <span className="text-xs font-medium text-neutral-800 group-hover:text-orange-600">
                              {g.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400">{g.readTime}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {matchedProducts.length === 0 && matchedBrands.length === 0 && matchedCategories.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    <p className="text-sm font-medium">No direct matches found for "{inputVal}".</p>
                    <p className="text-xs mt-1 text-neutral-400">Try searching for generic terms like "Helmet", "Axor", "Gloves", or "Tail Bag".</p>
                    <button
                      onClick={() => handleSearchSubmit(inputVal)}
                      className="mt-4 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
                    >
                      Search All Catalog for "{inputVal}"
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Recent Searches</span>
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-[11px] text-neutral-400 hover:text-neutral-600 underline"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSearchSubmit(term)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Gear Searches */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                    <span>Popular Rider Searches</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {POPULAR_SEARCHES.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchSubmit(item)}
                        className="text-left p-2.5 rounded-xl border border-neutral-200 hover:border-orange-500 hover:bg-orange-50/30 text-xs font-semibold text-neutral-800 transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span>Free doorstep delivery on orders above ₹5,000</span>
                  <button 
                    onClick={() => { setIsSearchOpen(false); navigate('/offers'); }}
                    className="font-bold text-orange-600 hover:underline"
                  >
                    View Active Deals →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
