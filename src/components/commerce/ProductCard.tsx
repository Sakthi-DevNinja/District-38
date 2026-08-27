import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, ShieldCheck, Eye, ImageOff } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickAdd = true }) => {
  const {
    navigate,
    isInWishlist,
    toggleWishlist,
    openQuickAdd
  } = useShop();

  const isFavorited = isInWishlist(product.id);
  const hasMultipleImages = product.images.length > 1;
  // No thumbnail at all (product has no PUBLIC image), or the URL failed
  // to load — both fall back to the same neutral placeholder, never a
  // broken-image icon.
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const showPlaceholder = !product.thumbnail || thumbnailFailed;

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
  };

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
        {product.discountPercent && product.discountPercent > 0 ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-orange-600 text-white">
            {product.discountPercent}% OFF
          </span>
        ) : product.isNew ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider bg-neutral-900 text-white">
            NEW
          </span>
        ) : null}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        aria-label="Toggle wishlist"
        className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg backdrop-blur-md transition-all ${
          isFavorited 
            ? 'bg-orange-600 text-white' 
            : 'bg-white/90 text-neutral-600 hover:bg-white hover:text-neutral-900 border border-neutral-200/60'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
      </button>

      {/* Image Container */}
      <div 
        onClick={handleCardClick}
        className="relative aspect-square w-full overflow-hidden bg-neutral-100 cursor-pointer"
      >
        {showPlaceholder ? (
          <div className="h-full w-full flex items-center justify-center text-neutral-300">
            <ImageOff className="w-8 h-8" />
          </div>
        ) : (
          <img
            src={product.thumbnail}
            alt={product.name}
            onError={() => setThumbnailFailed(true)}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-102 ${
              hasMultipleImages ? 'group-hover:opacity-0 absolute inset-0' : ''
            }`}
            loading="lazy"
          />
        )}

        {!showPlaceholder && hasMultipleImages && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102 opacity-0 group-hover:opacity-100"
            loading="lazy"
          />
        )}

        {/* Quick Add Overlay on Desktop Hover */}
        {showQuickAdd && (
          <div className="absolute inset-x-2.5 bottom-2.5 hidden sm:flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickAdd(product);
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Select Options</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              aria-label="View Details"
              className="p-2 rounded-lg bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs border border-neutral-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between" onClick={handleCardClick}>
        <div>
          {/* Brand & Subcategory */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            <span>{product.brand}</span>
            {product.subcategory && (
              <span className="text-neutral-500 font-normal">{product.subcategory}</span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 leading-snug line-clamp-2 hover:text-orange-600 transition-colors cursor-pointer">
            {product.name}
          </h3>

          {/* Color swatches preview if available */}
          {product.availableColors && product.availableColors.length > 1 && (
            <div className="flex items-center space-x-1 mt-2">
              {product.availableColors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.availableColors.length > 4 && (
                <span className="text-[10px] text-neutral-400 font-medium">+{product.availableColors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline space-x-1.5">
            <span className="text-sm sm:text-base font-bold text-neutral-950">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through font-normal">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Rating — omitted entirely when no rating data exists (VEYONN
              has no review/rating capability yet; never fabricated) */}
          {product.rating != null && (
            <div className="flex items-center space-x-1 text-xs font-medium text-neutral-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-neutral-400 font-normal">({product.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <div className="sm:hidden mt-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickAdd(product);
            }}
            className="w-full py-2 px-3 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs flex items-center justify-center space-x-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Select Options</span>
          </button>
        </div>
      </div>
    </div>
  );
};
