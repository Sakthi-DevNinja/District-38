import { useEffect } from 'react';
import { setRobotsMeta } from '../lib/seo';

// For private/transactional pages (cart, checkout, account, wishlist,
// auth, order confirmation) that should never be indexed — there's
// nothing here a search visitor should land on, and for account/order
// pages, indexing could reflect one customer's own data in place of a
// generic page.
export function useNoIndex(title?: string): void {
  useEffect(() => {
    if (title) document.title = `${title} | District 38`;
    setRobotsMeta('noindex, nofollow');
    return () => setRobotsMeta(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);
}
