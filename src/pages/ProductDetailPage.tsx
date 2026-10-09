import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  Check,
  Star, 
  ChevronRight, 
  Share2, 
  Info,
  MapPin,
  Flame,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useProduct } from '../hooks/use-product';
import { useProducts } from '../hooks/use-products';
import { adaptDetail, adaptListItem, slugifyCategoryName } from '../lib/product-adapter';
import { ProductGallery } from '../components/commerce/ProductGallery';
import { PincodeChecker } from '../components/commerce/PincodeChecker';
import { ProductGrid } from '../components/commerce/ProductGrid';
import { VariantPicker } from '../components/commerce/VariantPicker';
import { ProductDescription } from '../components/commerce/ProductDescription';
import { dispatchText, isOrderable } from '../lib/availability';
import { usePageMeta } from '../hooks/use-page-meta';
import { setStructuredData } from '../lib/seo';
import { resolveImageUrl } from '../lib/api/client';

const HELMET_CATEGORIES = new Set(['Helmets', 'Full Face', 'Modular', 'Open Face', 'Off-Road & Adventure', 'Kids']);

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

  // Real per-page title/description + Product structured data — every
  // field below comes straight from the real API response, never
  // fabricated (rating/reviewCount are deliberately omitted from the
  // schema since VEYONN has no review capability).
  usePageMeta(
    productDto
      ? {
          title: `${productDto.name} — ${productDto.brand?.name ?? 'District 38'}`,
          description: productDto.shortDescription ?? `${productDto.name} by ${productDto.brand?.name ?? 'District 38'} — ${productDto.price.sellingPrice ? `₹${productDto.price.sellingPrice}` : ''} at District 38.`,
          path: `/products/${productDto.slug}`,
          image: productDto.thumbnail ? resolveImageUrl(productDto.thumbnail.mediumUrl) : undefined
        }
      : null,
    [productDto?.id]
  );

  useEffect(() => {
    if (!productDto) return;
    setStructuredData('ld-product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productDto.name,
      description: productDto.shortDescription ?? undefined,
      image: productDto.thumbnail ? resolveImageUrl(productDto.thumbnail.mediumUrl) : undefined,
      sku: productDto.id,
      brand: productDto.brand ? { '@type': 'Brand', name: productDto.brand.name } : undefined,
      offers: {
        '@type': 'Offer',
        priceCurrency: productDto.price.currency,
        price: productDto.price.sellingPrice,
        availability: productDto.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: `${window.location.origin}/products/${productDto.slug}`
      }
    });

    const categorySlug = productDto.category ? slugifyCategoryName(productDto.category.name) : null;
    setStructuredData('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${window.location.origin}/` },
        ...(productDto.category
          ? [{ '@type': 'ListItem', position: 2, name: productDto.category.name, item: `${window.location.origin}/${categorySlug}` }]
          : []),
        { '@type': 'ListItem', position: productDto.category ? 3 : 2, name: productDto.name, item: `${window.location.origin}/products/${productDto.slug}` }
      ]
    });

    return () => {
      setStructuredData('ld-product', null);
      setStructuredData('ld-breadcrumb', null);
    };
  }, [productDto]);

  // Related products — server-side filtered by the SAME real category id
  // this product belongs to (not the client-derived slug used for URL
  // routing elsewhere on this page).
  const relatedQuery = useProducts({ productCategoryId: productDto?.category?.id, limit: 5 });

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [showVariantError, setShowVariantError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'care'>('description');

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
  // Helmet care advice only makes sense on helmets (VEYONN categories are flat: Full Face, Modular…).
  const isHelmet = HELMET_CATEGORIES.has(productDto.category?.name ?? '');
  const isFavorited = isInWishlist(product.id);

  // Related products — real data, adapted the same way the catalog list is.
  const relatedProducts = (relatedQuery.data?.items ?? [])
    .filter((p) => p.id !== product.id)
    .map(adaptListItem)
    .slice(0, 4);

  // A product with variants must be added with one; a single in-stock
  // variant is picked automatically.
  const hasVariants = product.variants.length > 0;
  const autoVariantId =
    product.variants.length === 1 && isOrderable(product.variants[0]) ? product.variants[0].id : '';
  const selectedVariant = product.variants.find((v) => v.id === (selectedVariantId || autoVariantId));
  const displayPrice = selectedVariant?.price ?? product.price;
  const displayOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;
  const displayDiscount =
    displayOriginalPrice && displayOriginalPrice > displayPrice
      ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
      : null;

  // The chosen size decides; before one is chosen, any orderable size counts.
  // Orderable = in stock now, or available on order (ships in a few days).
  const isAvailable = selectedVariant
    ? isOrderable(selectedVariant)
    : hasVariants
      ? product.variants.some(isOrderable)
      : isOrderable(product);
  const isInStockNow = selectedVariant
    ? selectedVariant.inStock
    : hasVariants
      ? product.variants.some((v) => v.inStock)
      : product.inStock;
  const onOrderDays = selectedVariant?.dispatchDays ?? product.dispatchDays;

  const addSelectionToCart = async () => {
    if (!isAvailable) return false;
    if (hasVariants && !selectedVariant) {
      setShowVariantError(true);
      return false;
    }
    await addToCart(product.id, quantity, selectedVariant?.id);
    return true;
  };

  const handleAddToCart = () => {
    void addSelectionToCart();
  };

  const handleBuyNow = async () => {
    if (await addSelectionToCart()) navigate('/checkout');
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
                  <span className="text-neutral-400 text-[11px] font-medium">SKU: {selectedVariant?.sku ?? product.sku}</span>
                )}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
              {displayOriginalPrice && displayDiscount && (
                <>
                  <span className="text-sm text-neutral-400 line-through font-normal">
                    ₹{displayOriginalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800">
                    {displayDiscount}% OFF
                  </span>
                </>
              )}
            </div>
            <div className="text-[11px] text-neutral-500 font-normal">
              Inclusive of all taxes & GST invoice. Free shipping applies at checkout.
            </div>
          </div>

          {hasVariants && (
            <VariantPicker
              variants={product.variants}
              selectedId={selectedVariant?.id ?? ''}
              onSelect={(id) => {
                setSelectedVariantId(id);
                setShowVariantError(false);
              }}
              showError={showVariantError}
            />
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
                disabled={!isAvailable}
                className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:bg-neutral-300 disabled:text-neutral-600 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {isAvailable
                    ? `ADD TO CART • ₹${(displayPrice * quantity).toLocaleString('en-IN')}`
                    : 'OUT OF STOCK'}
                </span>
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
              disabled={!isAvailable}
              className="disabled:hidden w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm tracking-wide transition-colors flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>BUY IT NOW (EXPRESS CHECKOUT)</span>
            </button>
          </div>

          {/* Stock Badge & Pincode Checker */}
          <div className="space-y-4 pt-2">
            {isAvailable && isInStockNow ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <span className="flex items-center space-x-1.5 font-medium">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Ready for dispatch</span>
                </span>
                <span className="text-[11px] font-bold text-emerald-800">Same-Day Courier</span>
              </div>
            ) : isAvailable ? (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span className="flex items-center space-x-1.5 font-medium">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Available on order</span>
                </span>
                <span className="text-[11px] font-bold text-amber-800">{dispatchText(onOrderDays)}</span>
              </div>
            ) : (
              <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-xs text-neutral-700 font-medium">
                {selectedVariant
                  ? `Size ${selectedVariant.name} is out of stock. Try another size or save it to your wishlist.`
                  : 'Currently out of stock. Save it to your wishlist and check back soon.'}
              </div>
            )}

            <PincodeChecker />
          </div>

        </div>
      </div>

      {/* 3. Detailed Tabs: Specs, Features, Care & Homologation */}
      <div className="pt-8 border-t border-neutral-200">
        <div className="flex space-x-2 border-b border-neutral-200 mb-6">
          {[
            { id: 'description', label: 'Description' },
            { id: 'specs', label: 'Specifications' },
            ...(isHelmet ? [{ id: 'care', label: 'Care & Maintenance' }] : [])
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
          {activeTab === 'description' && <ProductDescription description={product.description} />}

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

          {activeTab === 'care' && isHelmet && (
            <div className="space-y-4 text-xs text-neutral-700 leading-relaxed max-w-3xl">
              <p>
                <strong>Cleaning Instructions:</strong> Detach inner cheek pads and comfort liners. Hand wash using lukewarm water and mild organic cleaner. Air dry naturally away from direct sunlight or blow dryers.
              </p>
              <p>
                <strong>Visor Care:</strong> Clean exterior visor surface with a microfiber cloth and pure water or dedicated visor spray. Avoid household glass cleaners (ammonia ruins anti-scratch and UV coatings).
              </p>
              <p>
                <strong>Storage:</strong> Store in a helmet bag in a dry, ventilated area away from battery acids and engine exhaust fumes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews are hidden until VEYONN can store them: the old form kept a
          review only in the visitor's own browser, so it looked posted but wasn't. */}

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
