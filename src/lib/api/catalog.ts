import { apiGet } from './client'
import {
  ListProductsParams,
  ProductListPage,
  PublicBrand,
  PublicCategory,
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
    cursor: params.cursor,
    limit: params.limit,
  })
}

export function getProductBySlug(slug: string): Promise<PublicProductDetail> {
  return apiGet<PublicProductDetail>(`/api/public/v1/products/${encodeURIComponent(slug)}`)
}

export function listBrands(): Promise<PublicBrand[]> {
  return apiGet<PublicBrand[]>('/api/public/v1/brands')
}

export function listCategories(): Promise<PublicCategory[]> {
  return apiGet<PublicCategory[]>('/api/public/v1/categories')
}
