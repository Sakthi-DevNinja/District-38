import { Product, ProductVariant } from '../types'
import { PublicProductDetail, PublicProductListItem } from './api/types'
import { resolveImageUrl } from './api/client'

// Maps the REAL VEYONN public catalog response into the shape the existing
// District 38 UI already expects (src/types/index.ts's own Product) — this
// is a one-way display adapter, not a second product domain model: there
// is exactly one source of product truth (the backend), this only reshapes
// it so components built against the old static-data shape keep working
// without a rewrite.
//
// PRODUCT_ADAPTER_NOTES — fields the real backend does not provide, and
// what this adapter does instead (never a fabricated value):
//   sku              -> undefined (not on the public API; internal admin
//                        productCode is never exposed publicly)
//   subcategory      -> '' (VEYONN categories are flat — no subcategory
//                        tier exists yet)
//   rating/reviewCount -> undefined (no review/rating capability exists
//                        in the backend at all)
//   isNew            -> undefined (no such flag on the backend)
//   stockCount       -> the real availableQuantity when known (product
//                        detail only); 0 for list items, where the backend
//                        deliberately returns only a boolean `inStock` to
//                        avoid an availability query per row on every page
//                        of the catalog — never a guessed number
//   features/specifications/certifications/ridingStyles/includedInBox/
//   material/weight/warranty/frequentlyBoughtWith
//                    -> empty arrays / undefined (no backend field exists
//                        for any of these yet; the existing UI already
//                        guards each of these sections on `.length > 0`,
//                        so they simply don't render — never invented)
//   availableColors/availableSizes -> empty arrays. VEYONN variants are
//                        `{id, name, price, inStock}` — no structured
//                        color/size data — so the old color-swatch/
//                        size-grid UI (which needs a hex code and a
//                        separate size string) has nothing real to bind
//                        to. Real variants are exposed instead via
//                        `variants` (see below), unchanged from the old
//                        shape's own field.

// A route-friendly identifier for a category, derived client-side from its
// real name (VEYONN categories carry no slug of their own — only Products
// have one). Used only for matching this site's existing fixed category
// routes (/helmets, /riding-jackets, ...); never sent to the backend as if
// it were real data.
export function slugifyCategoryName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toVariant(v: PublicProductDetail['variants'][number]): ProductVariant {
  return {
    id: v.id,
    name: v.name ?? v.sku,
    sku: v.sku,
    inStock: v.inStock,
    stockCount: v.availableQuantity,
    price: v.price.sellingPrice,
    originalPrice: v.price.mrp ?? undefined,
  }
}

function baseFields(dto: PublicProductListItem): Product {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    brand: dto.brand?.name ?? '',
    sku: undefined,
    category: dto.category ? slugifyCategoryName(dto.category.name) : '',
    subcategory: '',
    price: dto.price.sellingPrice,
    originalPrice: dto.price.mrp ?? undefined,
    discountPercent: dto.price.discountPercent ?? undefined,
    rating: undefined,
    reviewCount: undefined,
    isNew: undefined,
    isBestSeller: dto.isBestSeller,
    isFeatured: dto.isFeatured,
    isOnSale: dto.price.isOnSale,
    inStock: dto.inStock,
    stockCount: 0,
    images: dto.thumbnail ? [resolveImageUrl(dto.thumbnail.mediumUrl)] : [],
    thumbnail: dto.thumbnail ? resolveImageUrl(dto.thumbnail.thumbnailUrl) : '',
    shortDescription: dto.shortDescription ?? '',
    description: dto.shortDescription ?? '',
    features: [],
    specifications: [],
    certifications: [],
    ridingStyles: [],
    availableColors: [],
    availableSizes: [],
    variants: [],
  }
}

export function adaptListItem(dto: PublicProductListItem): Product {
  return baseFields(dto)
}

export function adaptDetail(dto: PublicProductDetail): Product {
  const images = [...dto.images]
    .sort((a, b) => a.position - b.position)
    .map((img) => resolveImageUrl(img.mediumUrl))
  return {
    ...baseFields(dto),
    description: dto.description ?? dto.shortDescription ?? '',
    images: images.length > 0 ? images : baseFields(dto).images,
    stockCount: dto.availableQuantity,
    variants: dto.variants.map(toVariant),
  }
}
