export function slugify(text) {
  return String(text ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', ndash: '–', mdash: '—', hellip: '…' }

/** HTML description → readable plain text, keeping paragraph and list breaks. */
export function htmlToText(html) {
  if (!html) return ''
  return String(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<(br|\/p|\/div|\/h[1-6]|\/li|\/tr)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** First sentence(s) up to ~160 characters, for the short description. */
export function shortFrom(text, max = 160) {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  const cut = flat.slice(0, max)
  const sentenceEnd = cut.lastIndexOf('. ')
  if (sentenceEnd > 60) return cut.slice(0, sentenceEnd + 1)
  return cut.slice(0, cut.lastIndexOf(' ')) + '…'
}

/** "₹5,499.00", "5499", 5499 → 5499; anything unparseable → null. */
export function parsePrice(value) {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const n = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : null
}

const SIZE_WORDS = {
  'extra small': 'XS', xsmall: 'XS', xs: 'XS',
  small: 'S', s: 'S',
  medium: 'M', m: 'M',
  large: 'L', l: 'L',
  'extra large': 'XL', xlarge: 'XL', xl: 'XL',
  '2xl': 'XXL', xxl: 'XXL', '2x': 'XXL',
  '3xl': 'XXXL', xxxl: 'XXXL', '3x': 'XXXL',
  '4xl': '4XL', xxxxl: '4XL',
}

export const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL']

/** "Medium", "m", " M " → "M"; numeric and unusual sizes are kept as written. */
export function normalizeSize(raw) {
  if (raw === null || raw === undefined) return ''
  const text = String(raw).trim()
  if (!text) return ''
  const key = text.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ')
  return SIZE_WORDS[key] ?? SIZE_WORDS[key.replace(/ /g, '')] ?? text.toUpperCase()
}

export function sizeSortKey(size) {
  const i = SIZE_ORDER.indexOf(size)
  if (i >= 0) return `0-${String(i).padStart(2, '0')}`
  const scaled = /^(UK|EU|US)\s*(\d+(?:\.\d+)?)$/.exec(size)
  if (scaled) return `1-${scaled[1]}-${scaled[2].padStart(6, '0')}`
  const n = parseFloat(size)
  return Number.isFinite(n) ? `1-${String(n).padStart(8, '0')}` : `2-${size}`
}

const COLOUR_FIXES = { gray: 'Grey', grey: 'Grey', blk: 'Black' }

export function normalizeColour(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return ''
  const fixed = COLOUR_FIXES[text.toLowerCase()]
  if (fixed) return fixed
  // "GLOSS WHITE AND GREY" → "Gloss White and Grey"
  return text
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/(?!^)\b(And|With|Or|Of)\b/g, (w) => w.toLowerCase())
}

/** Removes the brand from the start of a product name: "Axor Apex Pro" → "Apex Pro". */
export function modelName(name, brand) {
  const n = String(name ?? '').trim()
  if (!brand) return n
  const re = new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[\\s:-]*`, 'i')
  return n.replace(re, '').trim() || n
}

/**
 * Stable key that is the same on every site for the same product:
 * `<brand-slug>__<model-slug>`, never derived from a row number or a
 * site's own id, so the same helmet from two sites merges into one row.
 */
export function makeImportKey(brand, name) {
  return `${slugify(brand) || 'unbranded'}__${slugify(modelName(name, brand))}`
}

/** "axor__apex-pro" → "AXOR-APEX-PRO", at most 40 characters. */
export function productCodeFrom(importKey) {
  return importKey.replace('__', '-').toUpperCase().slice(0, 40).replace(/-+$/, '')
}

export function skuFrom(productCode, size, colour) {
  return [productCode, slugify(colour).toUpperCase(), slugify(size).toUpperCase()]
    .filter(Boolean)
    .join('-')
}

// Short codes that stay in capitals when an ALL-CAPS name is title-cased.
const KEEP_UPPER = new Set([
  'ECE', 'DOT', 'ISI', 'LED', 'USB', 'GPS', 'ABS', 'CNC', 'UV', 'HD', 'DRL', 'EVA', 'TPU', 'PU',
  'KTM', 'BMW', 'TVS', 'RE', 'NS', 'RS', 'RC', 'GT', 'XL', 'XXL', 'XS', 'SP', 'MT', 'KYT', 'SMK',
  'NHK', 'HJC', 'LS2', 'SMX', 'ADV', 'ATV', 'MX', 'D3O', 'CE', 'II', 'III', 'IV', 'AZ', 'O2',
  'GP', 'RR', 'ZX', 'CBR', 'FZ', 'NS', 'RTR', 'GPS', 'LH', 'RH', 'ML', 'MM', 'CC',
])

/**
 * "AZ HELMET LOCK" → "AZ Helmet Lock". Only names that are mostly upper
 * case are changed. Words with digits (LS2, 22.06), known short codes and
 * the given brand spellings keep their form; small joining words go lower.
 */
export function titleCaseName(name, brandSpellings = []) {
  const letters = name.replace(/[^A-Za-z]/g, '')
  if (!letters || letters.replace(/[^A-Z]/g, '').length / letters.length < 0.8) return name
  const brands = new Map(brandSpellings.map((b) => [b.toUpperCase(), b]))
  const small = new Set(['AND', 'OR', 'FOR', 'WITH', 'OF', 'THE', 'TO', 'IN', 'ON', 'A', 'AN'])
  return name
    .split(/(\s+|[-/()+,])/)
    .map((word, i) => {
      if (!/[A-Za-z]/.test(word)) return word
      const upper = word.toUpperCase()
      if (brands.has(upper)) return brands.get(upper)
      if (KEEP_UPPER.has(upper) || /\d/.test(word)) return upper
      if (i > 0 && small.has(upper)) return word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
}
