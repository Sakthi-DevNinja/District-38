import { useTags } from './use-tags'
import { COLLECTIONS, tagCounts } from '../lib/collections'

/** True once at least one curated collection has a published product. */
export function useHasCollections(): boolean {
  const tagsQuery = useTags()
  const counts = tagCounts(tagsQuery.data)
  return COLLECTIONS.some(c => (counts.get(c.tag) ?? 0) > 0)
}
