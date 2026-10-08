import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { adaptListItem } from '../lib/product-adapter';
import { ProductCard } from '../components/commerce/ProductCard';
import { useNoIndex } from '../hooks/use-noindex';

export const WishlistPage: React.FC = () => {
  const { wishlist, wishlistLoading, navigate, isAuthenticated, authLoading } = useShop();

  useNoIndex('Your Wishlist');

  // Wait for a stored session to be restored before deciding the visitor
  // is signed out, or a refresh would bounce a signed-in customer to login.
  if (authLoading) return null;

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const wishlistedProducts = wishlist
    .filter((item) => item.product !== null)
    .map((item) => adaptListItem(item.product!));

  if (wishlistLoading && wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-sm text-neutral-400">Loading your wishlist…</p>
      </div>
    );
  }

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <Heart className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-950">Your Wishlist is Empty</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
            Save track-certified helmets, riding jackets, and touring accessories by tapping the heart icon on any gear card.
          </p>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-colors"
        >
          <span>BROWSE MOTORCYCLE GEAR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight flex items-center space-x-3">
            <span>Saved Riding Gear</span>
            <span className="text-sm font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
              {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'}
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Keep track of your dream helmet graphics, armor upgrades, and luggage kits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {wishlistedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
