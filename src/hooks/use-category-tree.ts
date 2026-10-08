import { useMemo } from 'react'
import { useCategories } from './use-categories'
import { buildCategoryTree } from '../lib/category-tree'

export function useCategoryTree() {
  const categoriesQuery = useCategories()
  const tree = useMemo(
    () => buildCategoryTree(categoriesQuery.data ?? []),
    [categoriesQuery.data],
  )
  return { tree, isLoading: categoriesQuery.isLoading, error: categoriesQuery.error }
}
