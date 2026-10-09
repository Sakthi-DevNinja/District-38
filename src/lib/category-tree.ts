import { PublicCategory } from './api/types'
import { slugifyCategoryName } from './product-adapter'

export interface CategoryNode {
  id: string
  name: string
  /** Route slug derived from the name, e.g. "riding-gear" → /riding-gear. */
  slug: string
  description: string | null
  children: CategoryNode[]
}

// Turns the flat category list into top-level categories with their
// subcategories (any depth), keeping the API's order.
export function buildCategoryTree(categories: PublicCategory[]): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>()
  categories.forEach((c) =>
    nodes.set(c.id, {
      id: c.id,
      name: c.name,
      slug: slugifyCategoryName(c.name),
      description: c.description,
      children: [],
    }),
  )

  // Hide categories with nothing published (and so their subcategories),
  // so menus never lead to an empty page. Older backends send no count:
  // show everything then.
  const visible = categories.filter((c) => c.productCount !== 0)
  const isVisible = new Set(visible.map((c) => c.id))

  const roots: CategoryNode[] = []
  visible.forEach((c) => {
    const node = nodes.get(c.id)!
    const parent = c.parentCategoryId ? nodes.get(c.parentCategoryId) : undefined
    // A child of a hidden (empty) parent is empty too, so it is skipped.
    if (c.parentCategoryId && parent && !isVisible.has(c.parentCategoryId)) return
    // A parent that isn't public makes this a top-level entry.
    if (parent) parent.children.push(node)
    else roots.push(node)
  })
  return sortFeaturedFirst(roots)
}

// Top-level categories shown first, in this order: the header shows the
// first four; the mobile menu, footer and home tiles follow the same order.
// Empty categories are hidden, so the later entries fill in for them.
export const FEATURED_CATEGORY_SLUGS = ['helmets', 'riding-gear', 'protection-parts', 'bike-accessories', 'helmet-accessories', 'luggage']

function sortFeaturedFirst(roots: CategoryNode[]): CategoryNode[] {
  const rank = (c: CategoryNode) => {
    const i = FEATURED_CATEGORY_SLUGS.indexOf(c.slug)
    return i === -1 ? FEATURED_CATEGORY_SLUGS.length : i
  }
  // Array.prototype.sort is stable, so the rest keep the API order.
  return [...roots].sort((a, b) => rank(a) - rank(b))
}

// Decorative photos for categories we already have artwork for, matched by
// slug. Categories without one get a plain tile, never a made-up image.
const CATEGORY_IMAGES: Record<string, string> = {
  helmets: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
  'riding-gear': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
  'bike-accessories': 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80',
  'bike-care': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
}

export function categoryImage(slug: string): string | undefined {
  return CATEGORY_IMAGES[slug]
}
