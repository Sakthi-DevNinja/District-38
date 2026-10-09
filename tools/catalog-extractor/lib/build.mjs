import {
  makeImportKey,
  normalizeColour,
  normalizeSize,
  productCodeFrom,
  shortFrom,
  sizeSortKey,
  skuFrom,
  slugify,
  titleCaseName,
} from './normalize.mjs'

/** The storefront's collection tags (src/lib/collections.ts); other source tags are SEO noise. */
const DEFAULT_KEEP_TAGS = ['ece-22.06', 'touring', 'monsoon', 'city', 'adventure', 'track']

function lookup(map, key) {
  if (!map || !key) return undefined
  const k = key.trim().toLowerCase()
  for (const [from, to] of Object.entries(map)) {
    if (from.trim().toLowerCase() === k) return to
  }
  return undefined
}

/**
 * category-map.json values: a path string, "" to ignore a category (e.g.
 * "Flash sale"), or { path, hsn, refine: { "<regex>": "<path>" } } where
 * refine picks a subcategory from the product name and tags.
 * Of several mapped source categories, the deepest District 38 path wins.
 */
function mapCategory(categoryMap, sourceCategories, text) {
  let best = null
  for (const name of sourceCategories) {
    const hit = lookup(categoryMap, name)
    if (!hit) continue
    const entry = typeof hit === 'string' ? { path: hit } : hit
    if (!entry.path) continue
    const depth = entry.path.split('>').length
    if (!best || depth > best.depth) best = { ...entry, depth }
  }
  if (!best) return { path: '', hsn: '', mapped: false }
  let path = best.path
  for (const [pattern, refined] of Object.entries(best.refine ?? {})) {
    if (new RegExp(pattern, 'i').test(text)) {
      path = refined
      break
    }
  }
  return { path, hsn: best.hsn ?? '', mapped: true }
}

// Categories whose products are never re-filed by name rules.
const PROTECTED_TOP_CATEGORIES = ['Helmets', 'Riding Gear']

/**
 * category-map.json "_nameRules": [{ pattern, path, always? }], checked in
 * order against the product name; the first matching rule decides. A rule
 * re-files the product when the source only gave a broad category (or none),
 * or always when "always" is set (for source categories known to be wrong).
 */
function applyNameRules(category, name, rules) {
  for (const rule of rules) {
    if (!new RegExp(rule.pattern, 'i').test(name)) continue
    const top = category.path.split(' > ')[0]
    const broad = !category.mapped || !category.path.includes('>')
    if (rule.always || (broad && !PROTECTED_TOP_CATEGORIES.includes(top))) {
      return { ...category, path: rule.path, mapped: true, renamed: true }
    }
    return category
  }
  return category
}

/** Throttlerz prices like 700.01 are a rounding artefact: 700.01 → 700. */
function cleanPrice(value) {
  if (!value) return value
  return Math.round((value % 1) * 100) === 1 ? Math.floor(value) : value
}

/** Footwear sizes: 9 → "UK 9", 42 → "EU 42", so mixed lists stay clear. */
function shoeSize(size, categoryPath) {
  if (!/boot|shoe/i.test(categoryPath) || !/^\d+(\.5)?$/.test(size)) return size
  const n = Number(size)
  if (n <= 14) return `UK ${size}`
  if (n >= 34) return `EU ${size}`
  return size
}

// Words that don't tell two products apart ("Axor Apex Helmet" and
// "AXOR APEX MOTORCYCLE HELMET" are the same product).
const FILLER_WORDS = new Set(['helmet', 'helmets', 'motorcycle', 'bike', 'riding', 'the', 'with', 'for', 'and', 'new'])

function significantWords(name, brand) {
  const brandWords = new Set(slugify(brand).split('-'))
  return [...new Set(slugify(name).split('-').filter((w) => w && !FILLER_WORDS.has(w) && !brandWords.has(w)))]
}

function wordOverlap(a, b) {
  const setB = new Set(b)
  const shared = a.filter((w) => setB.has(w)).length
  return shared / (a.length + b.length - shared || 1)
}

/**
 * Certification from the product text, only when the text names it.
 * A bare "ECE" without its version is not guessed; it is flagged instead.
 */
function detectCertification(text) {
  if (/22\.06/.test(text)) return { certification: 'ECE 22.06', tag: 'ece-22.06' }
  if (/22\.05/.test(text)) return { certification: 'ECE 22.05', tag: '' }
  if (/\bDOT\b/i.test(text)) return { certification: 'DOT', tag: '' }
  if (/\bISI\b/i.test(text)) return { certification: 'ISI', tag: '' }
  return { certification: '', tag: '', eceVersionUnknown: /\bECE\b/i.test(text) }
}

/**
 * Turns raw products from every source into staging rows.
 * Sources are given in priority order: when the same product is listed more
 * than once, the first listing is kept whole and the rest are skipped and
 * listed in the duplicates report.
 */
export function buildStaging(
  sourceResults,
  { categoryMap = {}, brandMap = {}, knownBrands = [], fitmentCategories = [], keepTags = DEFAULT_KEEP_TAGS } = {},
) {
  // fitmentCategories: ["KTM", …] or { "APRILLA": "Aprilia", … } to fix a bike name.
  const fitmentEntries = Array.isArray(fitmentCategories)
    ? fitmentCategories.map((name) => [name, name])
    : Object.entries(fitmentCategories)
  const fitment = new Map(fitmentEntries.map(([name, bike]) => [name.trim().toLowerCase(), `fits-${slugify(bike)}`]))
  const keep = new Set(keepTags.map((t) => t.toLowerCase()))

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

  // Brands a product can be recognised by when its own brand field is
  // empty: brands named by the sites themselves plus config.knownBrands.
  const brandNames = new Map()
  for (const b of [...knownBrands, ...[...spellings.keys()].map(canonicalBrand)]) {
    brandNames.set(b.trim().toLowerCase(), canonicalBrand(b) || b)
  }
  const brandFromCategories = (categories) =>
    categories.map((c) => brandNames.get(c.trim().toLowerCase())).find(Boolean) ?? ''
  const brandFromName = (name) => {
    const lower = name.toLowerCase()
    const match = [...brandNames.keys()]
      .filter((b) => lower.startsWith(`${b} `))
      .sort((a, b) => b.length - a.length)[0]
    return match ? brandNames.get(match) : ''
  }
  const allBrandSpellings = [...new Set(brandNames.values())]

  // Group listings of the same product (across or within sites) by import key.
  const groups = new Map()
  for (const { source, products, titleCase } of sourceResults) {
    for (const p of products) {
      const categories = p.sourceCategories ?? []
      const brand = canonicalBrand(p.brand) || brandFromCategories(categories) || brandFromName(p.name)
      const name = titleCase ? titleCaseName(p.name, allBrandSpellings) : p.name
      // Same brand and the same significant words (in any order) = same product.
      const words = significantWords(name, brand)
      const key = `${slugify(brand)}|${[...words].sort().join(' ')}`
      const list = groups.get(key) ?? []
      list.push({ ...p, name, brand, source, sourceCategories: categories, words, importKey: makeImportKey(brand, name) })
      groups.set(key, list)
    }
  }

  const products = []
  const variants = []
  const imagePlans = []
  const duplicates = []
  const refiled = []
  const issues = []
  const unmappedCategories = new Map()
  const usedCodes = new Set()
  const usedSkus = new Set()

  // Earlier-source products per brand, for spotting near-duplicates.
  const sourceRank = new Map(sourceResults.map((r, i) => [r.source, i]))
  const keptByBrand = new Map()

  for (const entries of groups.values()) {
    // The first listing (sources are in priority order) is the product;
    // every other listing of it is skipped and reported, never merged.
    const [primary, ...skipped] = entries
    const importKey = primary.importKey

    // Similar but not identical names are not skipped automatically (Matt
    // vs Gloss Black are different helmets); the owner decides.
    let possibleDuplicate = null
    if (primary.brand) {
      const earlier = (keptByBrand.get(primary.brand) ?? []).filter((k) => sourceRank.get(k.source) < sourceRank.get(primary.source))
      for (const k of earlier) {
        const overlap = wordOverlap(primary.words, k.words)
        if (overlap >= 0.6 && (!possibleDuplicate || overlap > possibleDuplicate.overlap)) possibleDuplicate = { ...k, overlap }
      }
      keptByBrand.set(primary.brand, [...(keptByBrand.get(primary.brand) ?? []), primary])
    }
    let productCode = productCodeFrom(importKey)
    for (let n = 2; usedCodes.has(productCode); n++) productCode = `${productCodeFrom(importKey).slice(0, 37)}-${n}`
    usedCodes.add(productCode)

    // Bike-model categories become fitment tags; brand categories are not
    // product types; the rest are mapped to District 38's tree.
    const isTypeCategory = (c) => !fitment.has(c.trim().toLowerCase()) && !brandNames.has(c.trim().toLowerCase())
    const typeCategories = primary.sourceCategories.filter(isTypeCategory)
    const fitmentTags = primary.sourceCategories.map((c) => fitment.get(c.trim().toLowerCase())).filter(Boolean)

    const description = primary.description ?? ''
    const category = applyNameRules(
      mapCategory(categoryMap, typeCategories, `${primary.name} ${primary.tags.join(' ')}`),
      primary.name,
      categoryMap._nameRules ?? [],
    )
    if (category.renamed) refiled.push({ productCode, name: primary.name, from: typeCategories.join(' | '), to: category.path })
    if (!category.mapped) {
      const name = typeCategories.join(' | ') || '(none)'
      unmappedCategories.set(name, (unmappedCategories.get(name) ?? 0) + 1)
    }

    const shortDescription = primary.shortDescription || shortFrom(description)
    // The product's own text decides; SEO tags only count when it says nothing
    // (a "22.06" tag must not override a description that says ECE 22.05).
    const fromText = detectCertification(`${primary.name} ${description}`)
    const cert = fromText.certification ? fromText : detectCertification(primary.tags.join(' '))
    const sourceTags = primary.tags.map((t) => t.toLowerCase()).filter((t) => keep.has(t))
    const tags = [...new Set([...sourceTags, ...fitmentTags, cert.tag].filter(Boolean))]

    const sellingPrice = cleanPrice(primary.sellingPrice) ?? null
    const mrp = primary.mrp && cleanPrice(primary.mrp) > sellingPrice ? cleanPrice(primary.mrp) : null

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
      const skuSize = normalizeSize(v.size)
      const size = shoeSize(skuSize, category.path)
      const colour = normalizeColour(v.colour)
      if (!size && !colour) continue
      const optKey = `${size}|${colour}`
      // skuSize keeps generated SKUs stable when only the size label changes.
      if (!byOption.has(optKey)) byOption.set(optKey, { ...v, size, skuSize, colour })
    }
    const productVariants = [...byOption.values()].sort((a, b) =>
      (a.colour || '').localeCompare(b.colour || '') || sizeSortKey(a.size).localeCompare(sizeSortKey(b.size)),
    )
    for (const v of productVariants) {
      let sku = v.sku && !usedSkus.has(v.sku) ? v.sku : skuFrom(productCode, v.skuSize, v.colour)
      for (let n = 2; usedSkus.has(sku); n++) sku = `${skuFrom(productCode, v.skuSize, v.colour)}-${n}`
      usedSkus.add(sku)
      variants.push({
        sku,
        productCode,
        productImportKey: importKey,
        variantName: [v.size, v.colour].filter(Boolean).join(' / '),
        size: v.size,
        colour: v.colour,
        // Blank = same as the product; only differences are written.
        sellingPrice: v.sellingPrice && cleanPrice(v.sellingPrice) !== sellingPrice ? cleanPrice(v.sellingPrice) : '',
        mrp: v.mrp && cleanPrice(v.mrp) !== mrp && v.mrp > (v.sellingPrice ?? 0) ? cleanPrice(v.mrp) : '',
        published: '',
        status: 'NEW',
      })
    }

    // Every gallery image of the kept listing, in the site's order.
    const imageUrls = [...new Set(primary.images)]
    imagePlans.push({ productCode, importKey, urls: imageUrls, pageUrl: primary.sourceUrl })

    // What the owner must look at before approving.
    const problems = []
    if (!primary.brand) problems.push('no brand')
    if (!category.mapped) problems.push('category not mapped')
    if (!sellingPrice) problems.push('no price')
    if (imageUrls.length === 0) problems.push('no images')
    if (possibleDuplicate) problems.push(`possible duplicate of "${possibleDuplicate.name}" (${possibleDuplicate.source})`)
    if (primary.needsSizes && productVariants.length === 0) problems.push('sizes not found, add them')
    if (/^helmets\b/i.test(category.path) && !cert.certification) {
      problems.push(cert.eceVersionUnknown ? 'says ECE but not which version' : 'certification not found')
    }
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
    refiled,
    issues,
    unmappedCategories: [...unmappedCategories.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([sourceCategories, products]) => ({ sourceCategories, products })),
  }
}
