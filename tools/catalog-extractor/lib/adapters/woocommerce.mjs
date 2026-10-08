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

const SIZE_NAMES = ['size', 'sizes', 'pa_size', 'helmet size']
const COLOUR_NAMES = ['color', 'colour', 'colors', 'colours', 'pa_color', 'pa_colour']

const isOneOf = (name, names) => names.includes(String(name ?? '').toLowerCase())

export function toRaw(p) {
  const regular = money(p.prices?.regular_price, p.prices)
  const current = money(p.prices?.price, p.prices)
  const brandAttr = (p.attributes ?? []).find((a) => isOneOf(a.name, ['brand', 'brands', 'pa_brand']))

  // The site's own size/colour combinations. Variation prices need one
  // extra request each, so the parent price is used; the owner reviews
  // any size that sells at a different price.
  const variants = (p.variations ?? [])
    .map((variation) => {
      const attrs = variation.attributes ?? []
      const size = attrs.find((a) => isOneOf(a.name, SIZE_NAMES))?.value ?? ''
      const colour = attrs.find((a) => isOneOf(a.name, COLOUR_NAMES))?.value ?? ''
      return {
        sku: '',
        size: htmlToText(size),
        colour: htmlToText(colour),
        sellingPrice: current,
        mrp: regular > current ? regular : null,
        available: p.is_in_stock !== false,
      }
    })
    .filter((v) => v.size || v.colour)

  return {
    sourceUrl: p.permalink,
    sourceId: String(p.id),
    sku: p.sku || '',
    name: htmlToText(p.name),
    // Brands plugin or a Brand attribute; otherwise the build step looks
    // for a known brand among the categories.
    brand: htmlToText(p.brands?.[0]?.name ?? brandAttr?.terms?.[0]?.name ?? ''),
    sourceCategories: (p.categories ?? []).map((c) => htmlToText(c.name)),
    description: htmlToText(p.description),
    shortDescription: htmlToText(p.short_description),
    tags: (p.tags ?? []).map((t) => htmlToText(t.name)),
    sellingPrice: current,
    mrp: regular && current && regular > current ? regular : null,
    images: (p.images ?? []).map((img) => img.src).filter(Boolean),
    variants,
  }
}
