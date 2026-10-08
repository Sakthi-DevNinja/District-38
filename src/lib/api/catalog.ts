import { apiGet } from './client'
import {
  ListProductsParams,
  ProductListPage,
  PublicBrand,
  PublicCategory,
  TagCount,
  PublicProductDetail,
} from './types'

// Thin, typed wrappers over the VEYONN public storefront API — no business
// logic, no data shaping beyond what fetch/JSON already gives us (mapping
// into whatever shape a given UI component wants happens in
// src/lib/product-adapter.ts, kept deliberately separate from this file).

export function listProducts(params: ListProductsParams = {}): Promise<ProductListPage> {
  return apiGet<ProductListPage>('/api/public/v1/products', {
    q: params.q,
    productCategoryId: params.productCategoryId,
    brandId: params.brandId,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    inStock: params.inStock ? 'true' : undefined,
    tag: params.tag,
    onSale: params.onSale ? 'true' : undefined,
    sort: params.sort,
    page: params.page,
    limit: params.limit,
    facets: params.facets ? 'true' : undefined,
  })
}

export function getProductBySlug(slug: string): Promise<PublicProductDetail> {
  return apiGet<PublicProductDetail>(`/api/public/v1/products/${encodeURIComponent(slug)}`)
}

// Brands and categories change rarely and are read by the header, menus,
// footer and home page at once, so one request is shared for a few minutes.
const REFERENCE_TTL_MS = 5 * 60 * 1000

function shared<T>(load: () => Promise<T>): () => Promise<T> {
  let cached: { promise: Promise<T>; at: number } | null = null
  return () => {
    if (!cached || Date.now() - cached.at > REFERENCE_TTL_MS) {
      const promise = load()
      cached = { promise, at: Date.now() }
      // A failed request is not kept, so the next caller retries.
      promise.catch(() => {
        if (cached?.promise === promise) cached = null
      })
    }
    return cached.promise
  }
}

export const listBrands = shared(() => apiGet<PublicBrand[]>('/api/public/v1/brands'))

export const listCategories = shared(() => apiGet<PublicCategory[]>('/api/public/v1/categories'))

/** Published products per tag, across the whole catalog. */
export const listTags = shared(() => apiGet<TagCount[]>('/api/public/v1/tags'))
