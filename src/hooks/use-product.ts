import { useAsync } from './use-async'
import { getProductBySlug } from '../lib/api/catalog'

// Always looked up by the backend's own slug — never by name, never by
// any locally-invented identifier.
export function useProduct(slug: string) {
  return useAsync(() => getProductBySlug(slug), [slug])
}
