import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Ruler, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const QuickAddModal: React.FC = () => {
  const { 
    quickAddProduct, 
    closeQuickAdd, 
    addToCart, 
    openSizeGuide,
    navigate 
  } = useShop();

  const [selectedColor, setSelectedColor] = useState<string>(() => {
    return quickAddProduct?.availableColors[0]?.name || '';
  });

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return quickAddProduct?.availableSizes[0] || '';
  });

  const [quantity, setQuantity] = useState(1);

  if (!quickAddProduct) return null;

  const product = quickAddProduct;

  const handleAddToCart = () => {
    addToCart(product, quantity, undefined, selectedColor, selectedSize);
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
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercent && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Color Selector */}
          {product.availableColors.length > 0 && (
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                Color: <span className="text-neutral-900 normal-case font-semibold">{selectedColor || product.availableColors[0].name}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map(c => {
                  const isSelected = (selectedColor || product.availableColors[0].name) === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        isSelected 
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm' 
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-700 bg-white'
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-neutral-300 shrink-0" 
                        style={{ backgroundColor: c.hex }} 
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.availableSizes.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Size: <span className="text-neutral-900 normal-case font-semibold">{selectedSize || product.availableSizes[0]}</span>
                </label>
                <button
                  onClick={() => openSizeGuide(product.category)}
                  className="text-xs font-semibold text-orange-600 hover:underline flex items-center space-x-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.availableSizes.map(size => {
                  const isSelected = (selectedSize || product.availableSizes[0]) === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        isSelected
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-800 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Indicator — a specific count is only shown when we
              actually have one (VEYONN's list-level catalog data doesn't
              carry a per-item count, to avoid an availability query per
              row on every page — see product-adapter.ts); never a guessed
              number. */}
          <div className={`mb-5 flex items-center justify-between p-2.5 rounded-xl border text-xs ${product.inStock ? 'bg-neutral-50 border-neutral-100' : 'bg-red-50 border-red-100'}`}>
            <span className={`flex items-center space-x-1.5 font-medium ${product.inStock ? 'text-emerald-700' : 'text-red-700'}`}>
              <ShieldCheck className={`w-4 h-4 ${product.inStock ? 'text-emerald-600' : 'text-red-500'}`} />
              <span>
                {product.inStock ? 'In Stock at Trichy Hub' : 'Currently Out of Stock'}
                {product.inStock && product.stockCount > 0 ? ` (${product.stockCount} units available)` : ''}
              </span>
            </span>
            {product.inStock && <span className="text-neutral-500 text-[11px]">Same-day dispatch</span>}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm tracking-wide shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD TO CART • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
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
