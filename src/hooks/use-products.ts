import { useAsync } from './use-async'
import { listProducts } from '../lib/api/catalog'
import { ListProductsParams } from '../lib/api/types'

// Note: only `q`, `productCategoryId`, `brandId`, `cursor`, and `limit` are
// real server-side filters (the actual VEYONN public catalog contract).
// Price range, in-stock-only, on-sale-only, and sort order are applied
// client-side over whatever page this returns — see ShopPage's own
// filtering for exactly which of the pre-existing filter UI still applies.
export function useProducts(params: ListProductsParams) {
  return useAsync(
    () => listProducts(params),
    [params.q, params.productCategoryId, params.brandId, params.cursor, params.limit],
  )
}
