import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useCategoryTree } from '../../hooks/use-category-tree';
import { useProducts } from '../../hooks/use-products';
import { CategoryNode, categoryImage } from '../../lib/category-tree';
import { adaptListItem, slugifyCategoryName } from '../../lib/product-adapter';

interface MegaMenuProps {
  /** Id of the top-level category whose menu is open, or null. */
  activeMenu: string | null;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ activeMenu, onClose }) => {
  const { tree } = useCategoryTree();
  const category = activeMenu ? tree.find(c => c.id === activeMenu) : undefined;
  if (!category) return null;
  // Keyed so switching menus starts a fresh lookup for that category.
  return <MegaMenuPanel key={category.id} category={category} onClose={onClose} />;
};

const MegaMenuPanel: React.FC<{ category: CategoryNode; onClose: () => void }> = ({ category, onClose }) => {
  const { navigate } = useShop();
  // One request gives the newest product to spotlight and the brands that
  // actually have products in this category, with counts.
  const preview = useProducts({ productCategoryId: category.id, limit: 1, facets: true });
  const newest = preview.data?.items[0] ? adaptListItem(preview.data.items[0]) : null;
  const brands = preview.data?.facets?.brands.slice(0, 6) ?? [];
  const total = preview.data?.total;

  const go = (route: string) => {
    navigate(route);
    onClose();
  };

  const image = newest?.images[0] || newest?.thumbnail || categoryImage(category.slug);

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-neutral-900"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 grid grid-cols-12 gap-8">
        {/* Col 1: Subcategories */}
        <div className="col-span-4 border-r border-neutral-100 pr-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            {category.name}
          </div>
          {category.children.length > 0 ? (
            <ul className="space-y-1">
              {category.children.map(sub => (
                <li key={sub.id}>
                  <button
                    onClick={() => go(`/${sub.slug}`)}
                    className="group flex items-start text-left w-full hover:bg-neutral-50 p-2 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                        {sub.name}
                      </div>
                      {sub.description && (
                        <p className="text-xs text-neutral-500 line-clamp-1">{sub.description}</p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            category.description && (
              <p className="text-sm text-neutral-600 leading-relaxed">{category.description}</p>
            )
          )}
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <button
              onClick={() => go(`/${category.slug}`)}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center space-x-1"
            >
              <span>
                View all {category.name.toLowerCase()}
                {total ? ` (${total})` : ''}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Col 2: Brands with products here */}
        <div className="col-span-4 border-r border-neutral-100 pr-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Brands
          </div>
          {brands.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {brands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => go(`/brands/${slugifyCategoryName(brand.name)}`)}
                  className="text-left p-3 rounded-lg border border-neutral-200/70 hover:border-orange-500/50 hover:bg-orange-50/20 transition-all group"
                >
                  <div className="font-semibold text-sm text-neutral-900 group-hover:text-orange-600">
                    {brand.name}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {brand.count} {brand.count === 1 ? 'product' : 'products'}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400">{preview.isLoading ? 'Loading…' : 'New stock arriving soon.'}</p>
          )}
        </div>

        {/* Col 3: Newest product, or the category itself */}
        <div className="col-span-4">
          <div
            onClick={() => go(newest ? `/products/${newest.slug}` : `/${category.slug}`)}
            className="group cursor-pointer relative overflow-hidden rounded-lg bg-neutral-950 p-6 text-white h-full min-h-48 flex flex-col justify-end"
          >
            {image && (
              <img
                src={image}
                alt={newest?.name ?? category.name}
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
              />
            )}
            <div className="relative z-10">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-2 bg-orange-600 text-white">
                {newest ? 'Just in' : category.name}
              </span>
              <h4 className="text-lg font-bold text-white mb-1">{newest?.name ?? `Shop ${category.name}`}</h4>
              {newest ? (
                <p className="text-xs text-neutral-300 mb-3">
                  {newest.brand} · ₹{newest.price.toLocaleString('en-IN')}
                </p>
              ) : (
                category.description && <p className="text-xs text-neutral-300 mb-3">{category.description}</p>
              )}
              <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400 group-hover:text-orange-300">
                <span>{newest ? 'View product' : 'Browse'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
