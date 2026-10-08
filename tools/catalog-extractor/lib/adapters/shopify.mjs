import { htmlToText, parsePrice } from '../normalize.mjs'

// Shopify stores expose every product, variant and image at
// /products.json (250 per page) — no HTML scraping needed.

export async function detect(fetcher, baseUrl) {
  const data = await fetcher.getJson(`${baseUrl}/products.json?limit=1`)
  return Array.isArray(data?.products)
}

export async function* products(fetcher, baseUrl, { limit = Infinity } = {}) {
  let yielded = 0
  for (let page = 1; ; page++) {
    const data = await fetcher.getJson(`${baseUrl}/products.json?limit=250&page=${page}`)
    const list = data?.products ?? []
    if (list.length === 0) return
    for (const p of list) {
      yield toRaw(p, baseUrl)
      if (++yielded >= limit) return
    }
  }
}

function optionIndex(options, names) {
  const i = (options ?? []).findIndex((o) => names.includes(String(o.name).toLowerCase()))
  return i >= 0 ? i + 1 : 0
}

export function toRaw(p, baseUrl) {
  const sizeOpt = optionIndex(p.options, ['size', 'sizes', 'helmet size'])
  const colourOpt = optionIndex(p.options, ['color', 'colour', 'colors', 'colours'])
  const tags = Array.isArray(p.tags) ? p.tags : String(p.tags ?? '').split(',')
  const variants = (p.variants ?? []).map((v) => ({
    sku: v.sku || '',
    size: sizeOpt ? v[`option${sizeOpt}`] : '',
    colour: colourOpt ? v[`option${colourOpt}`] : '',
    title: v.title,
    sellingPrice: parsePrice(v.price),
    mrp: parsePrice(v.compare_at_price),
    available: v.available !== false,
  }))
  const first = variants[0]
  return {
    sourceUrl: `${baseUrl}/products/${p.handle}`,
    sourceId: String(p.id),
    name: String(p.title ?? '').trim(),
    brand: String(p.vendor ?? '').trim(),
    sourceCategories: [String(p.product_type ?? '').trim()].filter(Boolean),
    description: htmlToText(p.body_html),
    tags: tags.map((t) => t.trim()).filter(Boolean),
    sellingPrice: first?.sellingPrice ?? null,
    mrp: first?.mrp ?? null,
    images: (p.images ?? [])
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((img) => img.src)
      .filter(Boolean)
      // Shopify's CDN resizes on request: 1600px is plenty for the shop and
      // keeps multi-MB originals out of the download.
      .map((src) => `${src}${src.includes('?') ? '&' : '?'}width=1600`),
    // A "Default Title" variant means the product has no real options.
    variants: variants.length === 1 && !first.size && !first.colour ? [] : variants,
  }
}
