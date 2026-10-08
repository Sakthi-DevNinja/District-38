import { writeFile } from 'node:fs/promises'

// Exact column order of the VEYONN import templates
// (GET /api/v1/imports/{entity}/template). Keep in sync with the backend.
export const HEADERS = {
  brands: ['name', 'description', 'status'],
  attributes: ['attribute', 'classification', 'dataType', 'value', 'status'],
  categories: ['path', 'description', 'attributes', 'status'],
  products: [
    'productCode', 'importKey', 'name', 'brand', 'categoryPath', 'shortDescription',
    'description', 'sellingPrice', 'mrp', 'hsn', 'certification', 'tags', 'sourceUrls',
    'uom', 'published', 'status',
  ],
  variants: [
    'sku', 'productCode', 'productImportKey', 'variantName', 'size', 'colour',
    'sellingPrice', 'mrp', 'published', 'status',
  ],
  images: [
    'productCode', 'productImportKey', 'position', 'localFile', 'sourceUrl', 'label',
    'visibility', 'fileId', 'fileSha256', 'status',
  ],
}

function cell(value) {
  if (value === undefined || value === null) return ''
  const text = String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(headers, rows) {
  const lines = [headers.join(',')]
  for (const row of rows) lines.push(headers.map((h) => cell(row[h])).join(','))
  return lines.join('\r\n') + '\r\n'
}

/** UTF-8 with BOM so Excel and Google Sheets read ₹ and accents correctly. */
export async function writeCsv(path, headers, rows) {
  await writeFile(path, '﻿' + toCsv(headers, rows), 'utf8')
}

/** Minimal CSV parser (quoted fields, BOM) for reading our own output back. */
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  const src = text.replace(/^﻿/, '')
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { field += '"'; i++ }
      else if (ch === '"') quoted = false
      else field += ch
    } else if (ch === '"') quoted = true
    else if (ch === ',') { row.push(field); field = '' }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++
      row.push(field); rows.push(row); row = []; field = ''
    } else field += ch
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  const [headers, ...data] = rows
  return data.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])))
}
