import { useAsync } from './use-async'
import { listCategories } from '../lib/api/catalog'

export function useCategories() {
  return useAsync(() => listCategories(), [])
}
