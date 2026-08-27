import { useAsync } from './use-async'
import { listBrands } from '../lib/api/catalog'

export function useBrands() {
  return useAsync(() => listBrands(), [])
}
