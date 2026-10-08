import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 1 … 4 5 6 … 12 — the current page, its neighbours, and both ends.
function pageNumbers(current: number, total: number): (number | 'gap')[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('gap');
    result.push(p);
  });
  return result;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 hover:border-neutral-900 disabled:opacity-40 disabled:hover:border-neutral-300"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Previous</span>
      </button>
      {pageNumbers(page, totalPages).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-xs text-neutral-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`min-w-9 px-3 py-2 rounded-xl text-xs font-bold ${
              p === page
                ? 'bg-neutral-950 text-white'
                : 'border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-800 hover:border-neutral-900 disabled:opacity-40 disabled:hover:border-neutral-300"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </nav>
  );
};
