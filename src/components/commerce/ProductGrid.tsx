import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { PackageOpen, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
  emptyTitle?: string;
  emptyDescription?: string;
  columns?: 2 | 3 | 4;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  error = null,
  emptyTitle = 'No riding gear matches your filters',
  emptyDescription = 'Try resetting your price, brand, or category filters to explore available motorcycle products.',
  columns = 4
}) => {
  const { resetShopFilters, navigate } = useShop();

  if (error) {
    return (
      <div className="text-center py-16 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-400 mb-4">
          <PackageOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-neutral-900">Couldn't load products</h3>
        <p className="text-xs text-neutral-500 mt-1 mb-6 leading-relaxed">
          We're having trouble reaching the District 38 catalog right now. Please try again in a moment.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-neutral-100 rounded-2xl p-4 flex flex-col space-y-3">
            <div className="aspect-square bg-neutral-200 rounded-xl w-full" />
            <div className="h-3 bg-neutral-200 rounded w-1/3" />
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 rounded w-1/2 mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300 max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-4">
          <PackageOpen className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-neutral-900">{emptyTitle}</h3>
        <p className="text-xs text-neutral-500 mt-1 mb-6 leading-relaxed">
          {emptyDescription}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={resetShopFilters}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Reset All Filters
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold hover:bg-neutral-100 transition-colors"
          >
            Browse All Gear
          </button>
        </div>
      </div>
    );
  }

  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns];

  return (
    <div className={`grid ${colClasses} gap-3 sm:gap-6`}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
