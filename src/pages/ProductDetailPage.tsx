import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Truck,
  RotateCcw, 
  Check, 
  Star, 
  ChevronRight, 
  Share2, 
  Info,
  MapPin,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useProduct } from '../hooks/use-product';
import { useProducts } from '../hooks/use-products';
import { adaptDetail, adaptListItem } from '../lib/product-adapter';
import { REVIEWS } from '../data/reviews';
import { ProductGallery } from '../components/commerce/ProductGallery';
import { ReviewSection } from '../components/commerce/ReviewSection';
import { PincodeChecker } from '../components/commerce/PincodeChecker';
import { ProductGrid } from '../components/commerce/ProductGrid';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const {
    navigate,
    addToCart,
    isInWishlist,
    toggleWishlist,
    showToast,
  } = useShop();

  // Real VEYONN product, looked up by the backend's own slug — never by
  // name, never by a locally-invented identifier.
  const productDetailQuery = useProduct(slug);
  const productDto = productDetailQuery.data;

  // Related products — server-side filtered by the SAME real category id
  // this product belongs to (not the client-derived slug used for URL
  // routing elsewhere on this page).
  const relatedQuery = useProducts({ productCategoryId: productDto?.category?.id, limit: 5 });

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'care'>('specs');

  if (productDetailQuery.isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-sm text-neutral-400">Loading product…</p>
      </div>
    );
  }

  if (productDetailQuery.error || !productDto) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-xl font-bold text-neutral-900">Product not found</h1>
        <p className="text-sm text-neutral-500">
          This product may have been unpublished or the link is incorrect.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs"
        >
          Browse the catalog
        </button>
      </div>
    );
  }

  const product = adaptDetail(productDto);
  const isFavorited = isInWishlist(product.id);
  const productReviews = REVIEWS.filter(r => r.productId === product.id || r.productId === 'general');

  // Related products — real data, adapted the same way the catalog list is.
  const relatedProducts = (relatedQuery.data?.items ?? [])
    .filter((p) => p.id !== product.id)
    .map(adaptListItem)
    .slice(0, 4);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on District 38 Motorcycle Gear`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 space-y-12">
      {/* 1. Breadcrumb navigation */}
      <nav className="flex items-center space-x-2 text-xs text-neutral-500 overflow-x-auto pb-1">
        <button onClick={() => navigate('/')} className="hover:text-neutral-900 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate(`/${product.category}`)} className="hover:text-neutral-900 capitalize transition-colors">
          {product.category.replace('-', ' ')}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate(`/brands/${product.brand.toLowerCase()}`)} className="hover:text-neutral-900 transition-colors">
          {product.brand}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-neutral-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. Main Stage: Gallery & Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Gallery */}
        <div className="lg:col-span-7 sticky top-24">
          <ProductGallery
            images={product.images}
            productName={product.name}
            certificationBadge={product.certifications?.[0]}
          />
        </div>

        {/* Right: Buy Box & Options */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                {product.brand}{product.subcategory && ` • ${product.subcategory}`}
              </span>
              <button
                onClick={handleShare}
                aria-label="Share product"
                className="p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950 mt-1.5 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating and SKU — both omitted when absent (VEYONN has no
                review/rating capability, and no public SKU field) rather
                than showing a fabricated or "undefined" value. */}
            {(product.rating != null || product.sku) && (
              <div className="flex items-center space-x-3 mt-2 text-xs">
                {product.rating != null && (
                  <div className="flex items-center space-x-1 font-medium text-neutral-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-neutral-400 font-normal">({product.reviewCount} reviews)</span>
                  </div>
                )}
                {product.rating != null && product.sku && <span className="text-neutral-300">•</span>}
                {product.sku && (
                  <span className="text-neutral-400 text-[11px] font-medium">SKU: {product.sku}</span>
                )}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-neutral-400 line-through font-normal">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800">
                    {product.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
            <div className="text-[11px] text-neutral-500 font-normal">
              Inclusive of all taxes & GST invoice. Free shipping applies at checkout.
            </div>
          </div>

          {/* Variant Selection — VEYONN variants are a plain named option
              (no separate structured color/hex or size), so this is one
              generic selector rather than the old separate color/size UI.
              Only shown when a product genuinely has more than one real
              variant. */}
          {product.variants.length > 1 && (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Options
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      disabled={!v.inStock}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        isSelected
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-800 bg-white'
                      }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex space-x-3">
              {/* Stepper */}
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-neutral-600 hover:bg-neutral-100 font-semibold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-neutral-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-neutral-600 hover:bg-neutral-100 font-semibold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </button>

              {/* Wishlist Icon Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-colors shrink-0 ${
                  isFavorited 
                    ? 'border-orange-500 bg-orange-50 text-orange-600' 
                    : 'border-neutral-300 hover:border-neutral-400 text-neutral-700 bg-white'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>BUY IT NOW (EXPRESS CHECKOUT)</span>
            </button>
          </div>

          {/* Trichy Store Stock Badge & Pincode Checker */}
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Ready for dispatch from <strong>Trichy Central Hub</strong></span>
              </span>
              <span className="text-[11px] font-bold text-emerald-800">Same-Day Courier</span>
            </div>

            <PincodeChecker />
          </div>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-neutral-600">
            <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Official 1-Year Brand Warranty</span>
            </div>
            <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <RotateCcw className="w-4 h-4 text-orange-600 shrink-0" />
              <span>07-Day Size Exchange Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Tabs: Specs, Features, Care & Homologation */}
      <div className="pt-8 border-t border-neutral-200">
        <div className="flex space-x-2 border-b border-neutral-200 mb-6">
          {[
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'features', label: 'Key Safety Features' },
            { id: 'care', label: 'Care & Maintenance' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-orange-600 text-neutral-950 font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-neutral-50 p-6 sm:p-8 rounded-2xl border border-neutral-200/80">
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {Array.isArray(product.specifications)
                ? product.specifications.map((s, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-neutral-200/70">
                      <span className="font-medium text-neutral-500">{s.label}</span>
                      <span className="font-semibold text-neutral-900">{s.value}</span>
                    </div>
                  ))
                : Object.entries(product.specifications || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-neutral-200/70">
                      <span className="font-medium text-neutral-500">{k}</span>
                      <span className="font-semibold text-neutral-900">{String(v)}</span>
                    </div>
                  ))}
              {product.weight && (
                <div className="flex justify-between py-2 border-b border-neutral-200/70">
                  <span className="font-medium text-neutral-500">Weight</span>
                  <span className="font-semibold text-neutral-900">{product.weight}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-neutral-200/70">
                <span className="font-medium text-neutral-500">Origin / Brand</span>
                <span className="font-semibold text-neutral-900">{product.brand}</span>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-3">
              <div className="text-xs text-neutral-700 leading-relaxed mb-4">
                {product.description}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-neutral-800">
                    <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-4 text-xs text-neutral-700 leading-relaxed max-w-3xl">
              <p>
                <strong>Cleaning Instructions:</strong> Detach inner cheek pads and comfort liners. Hand wash using lukewarm water and mild organic cleaner. Air dry naturally away from direct sunlight or blow dryers.
              </p>
              <p>
                <strong>Visor Care:</strong> Clean exterior visor surface with a microfiber cloth and pure water or dedicated visor spray. Avoid household glass cleaners (ammonia ruins anti-scratch and UV coatings).
              </p>
              <p>
                <strong>Storage:</strong> Always store in the included soft helmet bag in a dry, ventilated area away from battery acids and engine exhaust fumes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Verified Rider Reviews */}
      <ReviewSection
        productId={product.id}
        rating={product.rating}
        reviewCount={product.reviewCount}
        initialReviews={productReviews}
      />

      {/* 5. Related Gear Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-neutral-950">You May Also Need</h3>
            <button
              onClick={() => navigate(`/${product.category}`)}
              className="text-xs font-bold text-orange-600 hover:underline flex items-center space-x-1"
            >
              <span>Explore Collection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </div>
      )}
    </div>
  );
};
