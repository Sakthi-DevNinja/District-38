import {
  makeImportKey,
  normalizeColour,
  normalizeSize,
  productCodeFrom,
  shortFrom,
  sizeSortKey,
  skuFrom,
} from './normalize.mjs'

function lookup(map, key) {
  if (!map || !key) return undefined
  const k = key.trim().toLowerCase()
  for (const [from, to] of Object.entries(map)) {
    if (from.trim().toLowerCase() === k) return to
  }
  return undefined
}

/** category-map.json values are a path string or { path, hsn }. */
function mapCategory(categoryMap, sourceCategory) {
  const hit = lookup(categoryMap, sourceCategory)
  if (hit === undefined) return { path: '', hsn: '', mapped: false }
  if (typeof hit === 'string') return { path: hit, hsn: '', mapped: true }
  return { path: hit.path ?? '', hsn: hit.hsn ?? '', mapped: true }
}

/** Suggests a certification value and tag from the product text. */
function detectCertification(text) {
  if (/22\.06/.test(text)) return { certification: 'ECE 22.06', tag: 'ece-22.06' }
  if (/\bECE\b/i.test(text)) return { certification: 'ECE 22.05', tag: 'ece' }
  if (/\bISI\b/.test(text)) return { certification: 'ISI', tag: 'isi' }
  if (/\bDOT\b/.test(text)) return { certification: 'DOT', tag: 'dot' }
  return { certification: '', tag: '' }
}

/**
 * Turns raw products from every source into staging rows.
 * Sources are given in priority order: when the same product is listed more
 * than once, the first listing is kept whole and the rest are skipped and
 * listed in the duplicates report.
 */
export function buildStaging(sourceResults, { categoryMap = {}, brandMap = {} } = {}) {
  // Brand spelling: brand-map.json first, then the most common spelling.
  const spellings = new Map()
  for (const { products } of sourceResults) {
    for (const p of products) {
      const mapped = lookup(brandMap, p.brand) ?? p.brand
      if (!mapped) continue
      const key = mapped.toLowerCase()
      const counts = spellings.get(key) ?? new Map()
      counts.set(mapped, (counts.get(mapped) ?? 0) + 1)
      spellings.set(key, counts)
    }
  }
  const canonicalBrand = (raw) => {
    const mapped = lookup(brandMap, raw) ?? raw
    if (!mapped) return ''
    const counts = spellings.get(mapped.toLowerCase())
    if (!counts) return mapped
    // Most used spelling; on a tie prefer normal capitalisation over ALL CAPS.
    const shouty = (t) => (t === t.toUpperCase() ? 1 : 0)
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || shouty(a[0]) - shouty(b[0]))[0][0]
  }

  // Group listings of the same product (across or within sites) by import key.
  const groups = new Map()
  for (const { source, products } of sourceResults) {
    for (const p of products) {
      const brand = canonicalBrand(p.brand)
      const key = makeImportKey(brand, p.name)
      const list = groups.get(key) ?? []
      list.push({ ...p, brand, source })
      groups.set(key, list)
    }
  }

  const products = []
  const variants = []
  const imagePlans = []
  const duplicates = []
  const issues = []
  const unmappedCategories = new Map()
  const usedCodes = new Set()
  const usedSkus = new Set()

  for (const [importKey, entries] of groups) {
    // The first listing (sources are in priority order) is the product;
    // every other listing of it is skipped and reported, never merged.
    const [primary, ...skipped] = entries
    let productCode = productCodeFrom(importKey)
    for (let n = 2; usedCodes.has(productCode); n++) productCode = `${productCodeFrom(importKey).slice(0, 37)}-${n}`
    usedCodes.add(productCode)

    const category = mapCategory(categoryMap, primary.sourceCategory)
    if (!category.mapped) {
      const name = primary.sourceCategory || '(none)'
      unmappedCategories.set(name, (unmappedCategories.get(name) ?? 0) + 1)
    }

    const description = primary.description ?? ''
    const shortDescription = primary.shortDescription || shortFrom(description)
    const cert = detectCertification(`${primary.name} ${description} ${primary.tags.join(' ')}`)
    const tags = [...new Set([...primary.tags, cert.tag].filter(Boolean).map((t) => t.toLowerCase()))]

    const sellingPrice = primary.sellingPrice ?? null
    const mrp = primary.mrp && primary.mrp > sellingPrice ? primary.mrp : null

    for (const dup of skipped) {
      duplicates.push({
        productCode,
        name: primary.name,
        keptSource: primary.source,
        keptUrl: primary.sourceUrl,
        keptPrice: sellingPrice ?? '',
        skippedSource: dup.source,
        skippedUrl: dup.sourceUrl,
        skippedPrice: dup.sellingPrice ?? '',
      })
    }

    products.push({
      productCode,
      importKey,
      name: primary.name,
      brand: primary.brand,
      categoryPath: category.path,
      shortDescription,
      description,
      sellingPrice: sellingPrice ?? '',
      mrp: mrp ?? '',
      hsn: category.hsn,
      certification: cert.certification,
      tags: tags.join(','),
      sourceUrls: primary.sourceUrl,
      uom: '',
      published: '',
      status: 'NEW',
    })

    // Sizes/colours of the kept listing; the same option twice is kept once.
    const byOption = new Map()
    for (const v of primary.variants) {
      const size = normalizeSize(v.size)
      const colour = normalizeColour(v.colour)
      if (!size && !colour) continue
      const optKey = `${size}|${colour}`
      if (!byOption.has(optKey)) byOption.set(optKey, { ...v, size, colour })
    }
    const productVariants = [...byOption.values()].sort((a, b) =>
      (a.colour || '').localeCompare(b.colour || '') || sizeSortKey(a.size).localeCompare(sizeSortKey(b.size)),
    )
    for (const v of productVariants) {
      let sku = v.sku && !usedSkus.has(v.sku) ? v.sku : skuFrom(productCode, v.size, v.colour)
      for (let n = 2; usedSkus.has(sku); n++) sku = `${skuFrom(productCode, v.size, v.colour)}-${n}`
      usedSkus.add(sku)
      variants.push({
        sku,
        productCode,
        productImportKey: importKey,
        variantName: [v.size, v.colour].filter(Boolean).join(' / '),
        size: v.size,
        colour: v.colour,
        // Blank = same as the product; only differences are written.
        sellingPrice: v.sellingPrice && v.sellingPrice !== sellingPrice ? v.sellingPrice : '',
        mrp: v.mrp && v.mrp !== mrp && v.mrp > (v.sellingPrice ?? 0) ? v.mrp : '',
        published: '',
        status: 'NEW',
      })
    }

    // Every gallery image of the kept listing, in the site's order.
    const imageUrls = [...new Set(primary.images)]
    imagePlans.push({ productCode, importKey, urls: imageUrls })

    // What the owner must look at before approving.
    const problems = []
    if (!primary.brand) problems.push('no brand')
    if (!category.mapped) problems.push('category not mapped')
    if (!sellingPrice) problems.push('no price')
    if (imageUrls.length === 0) problems.push('no images')
    if (primary.needsSizes && productVariants.length === 0) problems.push('sizes not found, add them')
    if (/helmet/i.test(category.path) && !cert.certification) problems.push('certification not found')
    if (problems.length) issues.push({ productCode, name: primary.name, problems: problems.join('; '), sourceUrls: products.at(-1).sourceUrls })
  }

  // Reference rows the products depend on.
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))]
    .sort()
    .map((name) => ({ name, description: '', status: 'NEW' }))

  const sizeValues = [...new Set(variants.map((v) => v.size).filter(Boolean))].sort((a, b) => sizeSortKey(a).localeCompare(sizeSortKey(b)))
  const colourValues = [...new Set(variants.map((v) => v.colour).filter(Boolean))].sort()
  const attributes = [
    ...sizeValues.map((value, i) => ({ attribute: 'Size', classification: i === 0 ? 'VARIANT' : '', dataType: i === 0 ? 'LIST' : '', value, status: 'NEW' })),
    ...colourValues.map((value, i) => ({ attribute: 'Colour', classification: i === 0 ? 'VARIANT' : '', dataType: i === 0 ? 'LIST' : '', value, status: 'NEW' })),
  ]

  // Categories: Size is required where every product in it has sizes.
  const categories = []
  for (const path of [...new Set(products.map((p) => p.categoryPath).filter(Boolean))].sort()) {
    const inCategory = products.filter((p) => p.categoryPath === path)
    const withSizes = inCategory.filter((p) => variants.some((v) => v.productCode === p.productCode && v.size))
    const withColours = inCategory.filter((p) => variants.some((v) => v.productCode === p.productCode && v.colour))
    const attrs = []
    if (withSizes.length) attrs.push(withSizes.length === inCategory.length ? 'Size:required' : 'Size')
    if (withColours.length) attrs.push('Colour')
    categories.push({ path, description: '', attributes: attrs.join(';'), status: 'NEW' })
  }

  return {
    brands,
    attributes,
    categories,
    products,
    variants,
    imagePlans,
    duplicates,
    issues,
    unmappedCategories: [...unmappedCategories.entries()].map(([sourceCategory, products]) => ({ sourceCategory, products })),
  }
}
