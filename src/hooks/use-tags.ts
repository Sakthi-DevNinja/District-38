import { useAsync } from './use-async'
import { listTags } from '../lib/api/catalog'

export function useTags() {
  return useAsync(() => listTags(), [])
}
