import { apiDelete, apiGet, apiPatch, apiPost } from './client'
import { CartResponse } from './types'

// Real VEYONN customer cart (cart.controller.ts). A line is a product plus,
// for products sold in sizes, one variant — M and L of the same helmet are
// separate lines. Server is authoritative for price, availability, and stock
// on every mutation, and requires variantId whenever the product has
// sellable variants.

export function getCart(): Promise<CartResponse> {
  return apiGet<CartResponse>('/api/public/v1/cart')
}

export function addCartItem(
  productId: string,
  quantity: number,
  variantId?: string,
): Promise<CartResponse> {
  return apiPost<CartResponse>('/api/public/v1/cart/items', { productId, variantId, quantity })
}

function lineQuery(variantId?: string | null): string {
  return variantId ? `?variantId=${encodeURIComponent(variantId)}` : ''
}

export function updateCartItemQuantity(
  productId: string,
  quantity: number,
  variantId?: string | null,
): Promise<CartResponse> {
  return apiPatch<CartResponse>(
    `/api/public/v1/cart/items/${encodeURIComponent(productId)}${lineQuery(variantId)}`,
    { quantity },
  )
}

export function removeCartItem(productId: string, variantId?: string | null): Promise<CartResponse> {
  return apiDelete<CartResponse>(
    `/api/public/v1/cart/items/${encodeURIComponent(productId)}${lineQuery(variantId)}`,
  )
}

export function clearCart(): Promise<CartResponse> {
  return apiDelete<CartResponse>('/api/public/v1/cart')
}
