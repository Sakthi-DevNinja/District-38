import { apiDelete, apiGet, apiPost } from './client'
import { WishlistItem } from './types'

// Real VEYONN customer wishlist (wishlist.controller.ts) — every route
// requires a customer JWT; ownership is always resolved server-side from
// the token, never from a request param.

export function getWishlist(): Promise<WishlistItem[]> {
  return apiGet<WishlistItem[]>('/api/public/v1/wishlist')
}

export function addWishlistItem(productId: string): Promise<void> {
  return apiPost<void>('/api/public/v1/wishlist/items', { productId })
}

export function removeWishlistItem(productId: string): Promise<void> {
  return apiDelete<void>(`/api/public/v1/wishlist/items/${encodeURIComponent(productId)}`)
}
