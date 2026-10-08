import React, { useState } from 'react';
import { X, ShoppingBag, PackageCheck, PackageX, Ruler } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useProduct } from '../../hooks/use-product';
import { adaptDetail } from '../../lib/product-adapter';
import { VariantPicker } from '../commerce/VariantPicker';
import { Product } from '../../types';

export const QuickAddModal: React.FC = () => {
  const { quickAddProduct } = useShop();
  if (!quickAddProduct) return null;
  return <QuickAddContent key={quickAddProduct.id} product={quickAddProduct} />;
};

// The catalog list doesn't carry variants, so the product's detail is loaded
// here to offer its sizes — a product with variants can't be added without one.
const QuickAddContent: React.FC<{ product: Product }> = ({ product }) => {
  const { closeQuickAdd, addToCart, openSizeGuide, navigate } = useShop();
  const detailQuery = useProduct(product.slug);
  const variants = detailQuery.data ? adaptDetail(detailQuery.data).variants : [];
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [showVariantError, setShowVariantError] = useState(false);

  const autoVariantId = variants.length === 1 && variants[0].inStock ? variants[0].id : '';
  const selectedVariant = variants.find((v) => v.id === (selectedVariantId || autoVariantId));
  const displayPrice = selectedVariant?.price ?? product.price;
  const inStock = selectedVariant ? selectedVariant.inStock : product.inStock;

  const handleAddToCart = async () => {
    if (variants.length > 0 && !selectedVariant) {
      setShowVariantError(true);
      return;
    }
    await addToCart(product.id, 1, selectedVariant?.id);
    closeQuickAdd();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div
        onClick={closeQuickAdd}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-screen px-4 flex items-center justify-center py-6">
        <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-neutral-900">
          <button
            onClick={closeQuickAdd}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex space-x-4 mb-6">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-24 h-24 rounded-xl object-cover bg-neutral-100 border border-neutral-200 shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-neutral-100 border border-neutral-200 shrink-0" />
            )}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                {product.brand}{product.subcategory && ` • ${product.subcategory}`}
              </div>
              <h3 className="text-base font-bold text-neutral-950 leading-snug mt-0.5">
                {product.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1.5">
                <span className="text-base font-extrabold text-neutral-900">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                {!selectedVariant && product.originalPrice && (
                  <span className="text-xs text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {detailQuery.isLoading ? (
            <p className="mb-5 text-xs text-neutral-400">Loading sizes…</p>
          ) : detailQuery.error ? (
            <p className="mb-5 text-xs text-red-600">Couldn't load sizes. Open the full product page to choose one.</p>
          ) : (
            variants.length > 0 && (
              <div className="mb-5 space-y-2">
                <VariantPicker
                  variants={variants}
                  selectedId={selectedVariant?.id ?? ''}
                  onSelect={(id) => {
                    setSelectedVariantId(id);
                    setShowVariantError(false);
                  }}
                  showError={showVariantError}
                />
                <button
                  onClick={() => openSizeGuide(product.category)}
                  className="text-xs font-semibold text-orange-600 hover:underline flex items-center space-x-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>
            )
          )}

          <div className={`mb-5 flex items-center justify-between p-2.5 rounded-xl border text-xs ${inStock ? 'bg-neutral-50 border-neutral-100' : 'bg-red-50 border-red-100'}`}>
            <span className={`flex items-center space-x-1.5 font-medium ${inStock ? 'text-emerald-700' : 'text-red-700'}`}>
              {inStock ? (
                <PackageCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <PackageX className="w-4 h-4 text-red-500" />
              )}
              <span>{inStock ? 'In Stock & Ready to Ship' : 'Currently Out of Stock'}</span>
            </span>
            {inStock && <span className="text-neutral-500 text-[11px]">Same-day dispatch</span>}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              disabled={detailQuery.isLoading || !!detailQuery.error || !inStock}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO CART • ₹{displayPrice.toLocaleString('en-IN')}</span>
            </button>

            <button
              onClick={() => {
                closeQuickAdd();
                navigate(`/products/${product.slug}`);
              }}
              className="w-full py-2 text-center text-xs font-semibold text-neutral-600 hover:text-neutral-900"
            >
              View Full Product Specifications & Tech Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
