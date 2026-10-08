import { apiGet } from './client'
import { CustomerOrderDetail, CustomerOrderListPage } from './types'

// Real VEYONN customer order history (customer-order.controller.ts) —
// only this customer's own WEBSITE orders; ownership is always resolved
// server-side from the JWT, never from a request param. Cursor-paginated,
// same convention as the public product catalog.
export function listOrders(cursor?: string, limit?: number): Promise<CustomerOrderListPage> {
  return apiGet<CustomerOrderListPage>('/api/public/v1/account/orders', { cursor, limit })
}

export function getOrder(id: string): Promise<CustomerOrderDetail> {
  return apiGet<CustomerOrderDetail>(`/api/public/v1/account/orders/${encodeURIComponent(id)}`)
}
