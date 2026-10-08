import React from 'react';
import { ProductVariant } from '../../types';
import { dispatchText, isOrderable } from '../../lib/availability';

interface VariantPickerProps {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
  showError?: boolean;
}

// VEYONN variants are plain named options (usually one per size), so this is
// a single selector. A product with variants can't be added to the cart
// without one being picked — the backend requires it.
export const VariantPicker: React.FC<VariantPickerProps> = ({
  variants,
  selectedId,
  onSelect,
  showError = false,
}) => {
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
        Size
        {selected && (
          <span className="ml-1.5 normal-case font-semibold text-neutral-900">{selected.name}</span>
        )}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {variants.map((v) => {
          const isSelected = v.id === selectedId;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              disabled={!isOrderable(v)}
              title={!isOrderable(v) ? 'Out of stock' : v.inStock ? undefined : `Available on order, ${dispatchText(v.dispatchDays)}`}
              className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:line-through ${
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
      {showError && !selected && (
        <p className="mt-2 text-xs font-medium text-red-600">Please choose a size.</p>
      )}
      {selected && !selected.inStock && isOrderable(selected) && (
        <p className="mt-2 text-xs font-medium text-amber-700">This size is available on order and {dispatchText(selected.dispatchDays)}.</p>
      )}
      {selected && selected.inStock && selected.stockCount > 0 && selected.stockCount <= 5 && (
        <p className="mt-2 text-xs font-medium text-orange-600">Only {selected.stockCount} left in this size</p>
      )}
    </div>
  );
};
