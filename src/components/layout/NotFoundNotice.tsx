import React from 'react';
import { useShop } from '../../context/ShopContext';
import { useNoIndex } from '../../hooks/use-noindex';

interface NotFoundNoticeProps {
  title: string;
  message: string;
  actionLabel: string;
  actionPath: string;
}

// Shared "this thing doesn't exist" state for detail pages (unknown
// product, brand, guide or category slug). Sets its own title and
// noindex, so a dead link never keeps the previous page's title or gets
// indexed as a real page. The owning page must pass null to usePageMeta
// while this is shown, or its own (later-running) effect overwrites the
// title again.
export const NotFoundNotice: React.FC<NotFoundNoticeProps> = ({ title, message, actionLabel, actionPath }) => {
  const { navigate } = useShop();
  useNoIndex(title);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
      <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
      <p className="text-sm text-neutral-500">{message}</p>
      <button
        onClick={() => navigate(actionPath)}
        className="inline-flex items-center px-5 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs"
      >
        {actionLabel}
      </button>
    </div>
  );
};
