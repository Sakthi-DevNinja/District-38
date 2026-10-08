import { useAsync } from './use-async'
import { listProducts } from '../lib/api/catalog'
import { ListProductsParams } from '../lib/api/types'

// Every filter, sort and page is applied by the server, so callers get the
// exact page they asked for along with the total match count.
export function useProducts(params: ListProductsParams) {
  return useAsync(() => listProducts(params), [JSON.stringify(params)])
}
