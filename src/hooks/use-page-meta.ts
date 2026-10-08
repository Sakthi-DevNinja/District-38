import { useEffect } from 'react';
import { PageMetaInput, setPageMeta } from '../lib/seo';

// Call once per page component with real, page-specific data. Re-runs
// whenever the given deps change (e.g. when async product data arrives).
export function usePageMeta(meta: PageMetaInput | null, deps: unknown[]): void {
  useEffect(() => {
    if (meta) setPageMeta(meta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
