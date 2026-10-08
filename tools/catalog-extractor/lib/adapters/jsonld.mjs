import { htmlToText, parsePrice } from '../normalize.mjs'

// Fallback for any shop: product URLs from sitemap.xml, then the
// schema.org Product data (JSON-LD) that shops embed for Google.
// Sizes are usually not in JSON-LD, so these products come out without
// variants and are flagged for the owner to add sizes.

export async function detect(fetcher, baseUrl) {
  const entry = await fetcher.getText(`${baseUrl}/sitemap.xml`)
  return Boolean(entry && entry.status === 200 && /<(urlset|sitemapindex)/.test(entry.body))
}

function locs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'))
}

/** All page URLs from the sitemap (following sitemap indexes) matching the pattern. */
async function productUrls(fetcher, baseUrl, pattern) {
  const re = new RegExp(pattern ?? '/products?/')
  const queue = [`${baseUrl}/sitemap.xml`]
  const seen = new Set()
  const urls = []
  while (queue.length) {
    const url = queue.shift()
    if (seen.has(url)) continue
    seen.add(url)
    const entry = await fetcher.getText(url)
    if (!entry || entry.status !== 200) continue
    if (/<sitemapindex/.test(entry.body)) queue.push(...locs(entry.body))
    else urls.push(...locs(entry.body).filter((u) => re.test(u)))
  }
  return [...new Set(urls)]
}

export async function* products(fetcher, baseUrl, { limit = Infinity, productUrlPattern } = {}) {
  let yielded = 0
  for (const url of await productUrls(fetcher, baseUrl, productUrlPattern)) {
    const entry = await fetcher.getText(url)
    if (!entry || entry.status !== 200) continue
    const raw = fromHtml(entry.body, url)
    if (!raw) continue
    yield raw
    if (++yielded >= limit) return
  }
}

function findProduct(node) {
  if (!node || typeof node !== 'object') return null
  if (Array.isArray(node)) {
    for (const n of node) {
      const found = findProduct(n)
      if (found) return found
    }
    return null
  }
  const type = node['@type']
  if (type === 'Product' || (Array.isArray(type) && type.includes('Product'))) return node
  return findProduct(node['@graph'])
}

export function fromHtml(html, url) {
  let product = null
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      product = findProduct(JSON.parse(m[1]))
    } catch {
      continue
    }
    if (product) break
  }
  if (!product) return null

  const offers = Array.isArray(product.offers) ? product.offers[0] : product.offers
  const price = parsePrice(offers?.price ?? offers?.lowPrice)
  const brand = typeof product.brand === 'string' ? product.brand : product.brand?.name
  const images = (Array.isArray(product.image) ? product.image : [product.image])
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter(Boolean)
  const description = htmlToText(product.description)

  return {
    sourceUrl: url,
    sourceId: String(product.sku ?? product.productID ?? url),
    name: htmlToText(product.name),
    brand: htmlToText(brand ?? ''),
    sourceCategory: htmlToText(product.category ?? ''),
    description,
    tags: [],
    sellingPrice: price,
    mrp: null,
    images: images.map((src) => new URL(src, url).href),
    variants: [],
    needsSizes: true,
  }
}
