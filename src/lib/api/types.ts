// Hand-written to match the VEYONN backend's public storefront contract
// exactly (src/capabilities/storefront/application/dto/
// public-catalog-response.dto.ts on the backend) — this is the real,
// authoritative product/brand/category shape from here on. Nothing in
// this file is a fabricated or invented field; anything the backend
// doesn't provide simply isn't listed here (see PRODUCT_ADAPTER_NOTES in
// ../product-adapter.ts for how the UI's own Product type copes with the
// gap).

export interface PublicImage {
  url: string
  label: string | null
}

export interface PublicPrice {
  sellingPrice: number
  mrp: number | null
  currency: string
  isOnSale: boolean
  discountPercent: number | null
}

export interface PublicVariant {
  id: string
  name: string | null
  price: PublicPrice
  inStock: boolean
}

export interface PublicRef {
  id: string
  name: string
}

export interface PublicProductListItem {
  id: string
  slug: string
  name: string
  shortDescription: string | null
  brand: PublicRef | null
  category: PublicRef | null
  price: PublicPrice
  inStock: boolean
  isFeatured: boolean
  isBestSeller: boolean
  thumbnail: PublicImage | null
}

export interface PublicProductDetail extends PublicProductListItem {
  description: string | null
  images: PublicImage[]
  variants: PublicVariant[]
  availableQuantity: number
}

export interface PublicBrand {
  id: string
  name: string
  description: string | null
}

export interface PublicCategory {
  id: string
  name: string
  description: string | null
  parentCategoryId: string | null
}

export interface ProductListPage {
  items: PublicProductListItem[]
  nextCursor: string | null
  hasNext: boolean
}

export interface ListProductsParams {
  q?: string
  productCategoryId?: string
  brandId?: string
  cursor?: string
  limit?: number
}
