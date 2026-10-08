import { TagCount } from './api/types'

// Curated lists on the storefront are driven by product tags. To put a
// product in a collection, give it the tag below (the `tags` column of the
// product import sheet, or Tags in Pilot). Matching ignores case.
// A collection or style with no published products is hidden.

export interface TagCollection {
  tag: string
  title: string
  description: string
  /** Short label shown on the tile. */
  label: string
  image: string
}

export const COLLECTIONS: TagCollection[] = [
  {
    tag: 'ece-22.06',
    title: 'ECE 22.06 Certified Helmets',
    description: 'Helmets certified to the latest European safety standard, including rotational impact tests.',
    label: 'Safety Certified',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
  },
  {
    tag: 'touring',
    title: 'Highway Touring',
    description: 'Gear for long days in the saddle: comfortable helmets, tail bags and all-weather layers.',
    label: 'Long Distance',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
  },
  {
    tag: 'monsoon',
    title: 'Monsoon Ready',
    description: 'Waterproof jackets, rain suits, dry bags and anti-fog inserts for the wet season.',
    label: 'All-Weather',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80',
  },
  {
    tag: 'city',
    title: 'City Commuting',
    description: 'Light, breathable gear and essentials for the daily ride to work.',
    label: 'Daily Commute',
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80',
  },
]

export const RIDING_STYLES: TagCollection[] = [
  {
    tag: 'touring',
    title: 'Highway Touring',
    description: 'Ventilated helmets, Pinlock inserts, tail bags and saddlebags.',
    label: 'Long Distance',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
  },
  {
    tag: 'city',
    title: 'Urban Commuting',
    description: 'Breathable mesh jackets, gloves and helmet communicators.',
    label: 'Daily Riding',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
  },
  {
    tag: 'adventure',
    title: 'Adventure & Off-Road',
    description: 'Dual-sport helmets, waterproof dry bags and knee armour.',
    label: 'All Terrain',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80',
  },
  {
    tag: 'track',
    title: 'Track & Sport',
    description: 'Full-face spoiler helmets, back protectors and gauntlet gloves.',
    label: 'Track & Street',
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80',
  },
]

/** Product count per tag (lower-cased), from the catalog's tag list. */
export function tagCounts(tags: TagCount[] | null | undefined): Map<string, number> {
  const counts = new Map<string, number>()
  ;(tags ?? []).forEach(t => {
    const key = t.tag.toLowerCase()
    counts.set(key, (counts.get(key) ?? 0) + t.count)
  })
  return counts
}

/** Display name for a tag filter: a known collection/style title, else the tag. */
export function tagTitle(tag: string): string {
  const known = [...COLLECTIONS, ...RIDING_STYLES].find(c => c.tag === tag.toLowerCase())
  return known?.title ?? tag
}
