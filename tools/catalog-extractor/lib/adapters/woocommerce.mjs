import { htmlToText } from '../normalize.mjs'

// WooCommerce stores (WordPress) expose products through the public Store
// API at /wp-json/wc/store/v1/products, 100 per page.

const API = '/wp-json/wc/store/v1/products'

export async function detect(fetcher, baseUrl) {
  const data = await fetcher.getJson(`${baseUrl}${API}?per_page=1`)
  return Array.isArray(data)
}

export async function* products(fetcher, baseUrl, { limit = Infinity } = {}) {
  let yielded = 0
  for (let page = 1; ; page++) {
    const list = await fetcher.getJson(`${baseUrl}${API}?per_page=100&page=${page}`)
    if (!Array.isArray(list) || list.length === 0) return
    for (const p of list) {
      yield toRaw(p)
      if (++yielded >= limit) return
    }
  }
}

/** Store API prices are strings in minor units (paise): "549900" → 5499. */
function money(value, prices) {
  if (value === undefined || value === null || value === '') return null
  const minor = Number(prices?.currency_minor_unit ?? 2)
  const n = Number(value) / 10 ** minor
  return Number.isFinite(n) && n > 0 ? n : null
}

function attributeTerms(p, names) {
  const attr = (p.attributes ?? []).find((a) => names.includes(String(a.name).toLowerCase()))
  return (attr?.terms ?? []).map((t) => t.name)
}

export function toRaw(p) {
  const regular = money(p.prices?.regular_price, p.prices)
  const current = money(p.prices?.price, p.prices)
  const sizes = attributeTerms(p, ['size', 'sizes', 'pa_size'])
  const colours = attributeTerms(p, ['color', 'colour', 'pa_color', 'pa_colour'])
  // Brand: a brands plugin field, a "Brand" attribute, or left blank for review.
  const brand =
    p.brands?.[0]?.name ?? attributeTerms(p, ['brand', 'brands', 'pa_brand'])[0] ?? ''

  // Variation prices need one extra request each; the parent price is used
  // and the owner reviews any size that sells at a different price.
  const variants = []
  for (const size of sizes.length ? sizes : ['']) {
    for (const colour of colours.length ? colours : ['']) {
      if (!size && !colour) continue
      variants.push({ sku: '', size, colour, sellingPrice: current, mrp: regular > current ? regular : null, available: p.is_in_stock !== false })
    }
  }

  return {
    sourceUrl: p.permalink,
    sourceId: String(p.id),
    name: htmlToText(p.name),
    brand: htmlToText(brand),
    sourceCategory: p.categories?.[0]?.name ? htmlToText(p.categories[0].name) : '',
    description: htmlToText(p.description),
    shortDescription: htmlToText(p.short_description),
    tags: (p.tags ?? []).map((t) => htmlToText(t.name)),
    sellingPrice: current,
    mrp: regular && current && regular > current ? regular : null,
    images: (p.images ?? []).map((img) => img.src).filter(Boolean),
    variants,
  }
}
