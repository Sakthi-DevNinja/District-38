// Hand-written to match the VEYONN backend's public storefront contract
// exactly (src/capabilities/storefront/application/dto/
// public-catalog-response.dto.ts on the backend) — this is the real,
// authoritative product/brand/category shape from here on. Nothing in
// this file is a fabricated or invented field; anything the backend
// doesn't provide simply isn't listed here (see PRODUCT_ADAPTER_NOTES in
// ../product-adapter.ts for how the UI's own Product type copes with the
// gap).

export interface PublicImage {
  position: number
  /** Original upload. */
  url: string
  /** ~400px WebP — product cards and lists. */
  thumbnailUrl: string
  /** ~1200px WebP — product page gallery. */
  mediumUrl: string
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
  sku: string
  name: string | null
  price: PublicPrice
  inStock: boolean
  availableQuantity: number
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
  /** As entered in the catalog, e.g. ["Touring", "helmet"]. */
  tags: string[]
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

export interface CatalogFacets {
  /** Brands in the current category/search, ignoring the brand and price selections. */
  brands: { id: string; name: string; count: number }[]
  /** Ignores the tag selection, like brands ignore the brand selection. */
  tags: TagCount[]
  priceRange: { min: number; max: number } | null
}

export interface ProductListPage {
  items: PublicProductListItem[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  facets?: CatalogFacets
}

export interface TagCount {
  tag: string
  count: number
}

export type CatalogSort = 'newest' | 'price_asc' | 'price_desc' | 'name' | 'discount'

export interface ListProductsParams {
  q?: string
  /** Includes products in its subcategories. */
  productCategoryId?: string
  brandId?: string
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  /** Any of these tags, matched case-insensitively. */
  tag?: string
  /** Only products priced below MRP. */
  onSale?: boolean
  sort?: CatalogSort
  /** 1-based. */
  page?: number
  /** Default 24, max 100. */
  limit?: number
  facets?: boolean
}

// ─── Customer Auth (src/capabilities/storefront/application/dto/
// register-customer.dto.ts, login-customer.dto.ts, customer-auth-response.dto.ts
// on the backend) — this is a separate, customer-only auth surface. Never
// the admin/Pilot JWT; never carries roles/permissions. ──────────────────

export interface RegisterCustomerInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginCustomerInput {
  email: string
  password: string
}

export interface CustomerTokenResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface CustomerProfile {
  id: string
  contactId: string
  email: string
  displayName: string
  lastLoginAt: string | null
  createdAt: string
}

// ─── Wishlist (wishlist.dto.ts) ──────────────────────────────────────────

export interface WishlistItem {
  productId: string
  addedAt: string
  product: PublicProductListItem | null
}

// ─── Cart (cart.dto.ts) — productId + quantity only; VEYONN's cart has no
// color/size/variant dimension (see ../product-adapter.ts's own notes on
// why availableColors/availableSizes are always empty). ──────────────────

export interface CartLine {
  productId: string
  variantId: string | null
  variantName: string | null
  variantSku: string | null
  unitPrice: number
  quantity: number
  lineTotal: number
  product: PublicProductListItem | null
}

export interface CartResponse {
  items: CartLine[]
  subtotal: number
  currency: string
}

// ─── Checkout & Razorpay (checkout.dto.ts, razorpay-payment.dto.ts) ─────

export interface CheckoutAddressInput {
  deliveryAddressLine1: string
  deliveryAddressLine2?: string
  deliveryCity: string
  deliveryStateProvince: string
  deliveryPostalCode: string
  deliveryCountryCode: string
}

export interface PaymentInitResult {
  paymentId: string
  providerOrderId: string
  amount: string
  currency: string
  publicFields: Record<string, string>
}

export interface CheckoutResult {
  salesOrderId: string
  orderNumber: string
  documentStatus: string
  salesChannel: string
  total: number
  currency: string
  paymentRequired: true
  payment: PaymentInitResult | null
  paymentInitiationFailed: boolean
}

export interface VerifyRazorpayPaymentInput {
  paymentId: string
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

export interface VerifyRazorpayPaymentResult {
  paymentId: string
  paymentStatus: 'CONFIRMED'
  salesOrderId: string
}

// ─── Customer Orders (customer-order.dto.ts) — customer-safe shape only,
// never the admin SalesOrder DTOs. ────────────────────────────────────────

export interface CustomerOrderListItem {
  id: string
  orderNumber: string
  documentStatus: string
  salesChannel: string
  createdAt: string
}

export interface CustomerOrderListPage {
  items: CustomerOrderListItem[]
  nextCursor: string | null
  hasNext: boolean
}

export interface CustomerOrderLine {
  productId: string
  productName: string
  variantId?: string | null
  variantName?: string | null
  orderedQuantity: string
  unitPrice: string
  lineTotal: string
  lineDeliveryStatus: string
}

export interface CustomerOrderDeliveryAddress {
  line1: string
  line2: string | null
  city: string
  stateProvince: string
  postalCode: string
  countryCode: string
}

export interface CustomerOrderPayment {
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID'
  amountPaid: string
  amountDue: string
}

export interface CustomerOrderDetail {
  id: string
  orderNumber: string
  documentStatus: string
  salesChannel: string
  createdAt: string
  total: string
  lines: CustomerOrderLine[]
  deliveryAddress: CustomerOrderDeliveryAddress | null
  payment: CustomerOrderPayment
}
