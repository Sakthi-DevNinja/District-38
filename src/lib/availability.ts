import { Availability } from '../types'

interface HasAvailability {
  inStock: boolean
  availability?: Availability
}

/** Can be added to the cart: in stock, or available on order. */
export function isOrderable(item: HasAvailability): boolean {
  return item.availability ? item.availability !== 'OUT_OF_STOCK' : item.inStock
}

/** "ships in 3–5 days" for on-order items. */
export function dispatchText(dispatchDays?: string): string {
  return `ships in ${dispatchDays || '3–5'} days`
}
