// End-to-end test against fake local shops: node --test test/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { deflateSync } from 'node:zlib'
import { parseCsv } from '../lib/csv.mjs'
import { normalizeSize, makeImportKey, htmlToText } from '../lib/normalize.mjs'
import { parseRobots, robotsAllows } from '../lib/fetcher.mjs'

const run = promisify(execFile)
const here = dirname(fileURLToPath(import.meta.url))

// A tiny solid-colour PNG, different per colour so images don't de-duplicate.
function png(r, g, b) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  })
  const crc = (buf) => {
    let c = 0xffffffff
    for (const x of buf) c = crcTable[(c ^ x) & 255] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
    const td = Buffer.concat([Buffer.from(type), data])
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td))
    return Buffer.concat([len, td, c])
  }
  const w = 8, h = 8
  const raw = Buffer.alloc((w * 3 + 1) * h)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) raw.set([r, g, b], y * (w * 3 + 1) + 1 + x * 3)
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

function serve(handler) {
  return new Promise((resolve) => {
    const server = createServer(handler)
    server.listen(0, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` }))
  })
}

test('unit: sizes, keys, html, robots', () => {
  assert.equal(normalizeSize('Medium'), 'M')
  assert.equal(normalizeSize(' xl '), 'XL')
  assert.equal(normalizeSize('2XL'), 'XXL')
  assert.equal(normalizeSize('42'), '42')
  assert.equal(makeImportKey('Axor', 'Axor Apex Pro'), 'axor__apex-pro')
  assert.equal(makeImportKey('AXOR', 'Apex Pro'), 'axor__apex-pro')
  assert.equal(htmlToText('<p>One &amp; two</p><ul><li>A</li></ul>'), 'One & two\n\n• A')
  const rules = parseRobots('User-agent: *\nDisallow: /admin\nDisallow: /*?add-to-cart=\nDisallow: /private$\nAllow: /admin/ajax\n\nUser-agent: other\nDisallow: /\nSitemap: https://x.test/sitemap_index.xml', 'district38catalogbot')
  assert.equal(robotsAllows(rules, '/product/helmet'), true, 'a wildcard rule must not block the whole site')
  assert.equal(robotsAllows(rules, '/shop/?add-to-cart=12'), false)
  assert.equal(robotsAllows(rules, '/admin/settings'), false)
  assert.equal(robotsAllows(rules, '/admin/ajax'), true, 'the longer Allow wins')
  assert.equal(robotsAllows(rules, '/private'), false)
  assert.equal(robotsAllows(rules, '/private/page'), true, '$ anchors the end')
  assert.deepEqual(rules.sitemaps, ['https://x.test/sitemap_index.xml'])
})

test('end to end: two shops into a staging folder, duplicates skipped', async () => {
  const hits = { blocked: 0 }
  const shopA = await serve((req, res) => {
    const u = new URL(req.url, 'http://x')
    if (u.pathname === '/robots.txt') return res.end('User-agent: *\nDisallow: /secret\n')
    if (u.pathname === '/products.json') {
      if (u.searchParams.get('page') && u.searchParams.get('page') !== '1') return res.end('{"products":[]}')
      res.setHeader('content-type', 'application/json')
      return res.end(JSON.stringify({ products: [
        {
          id: 1, title: 'Axor Apex Pro', handle: 'axor-apex-pro', vendor: 'AXOR', product_type: 'Full Face Helmets',
          body_html: '<p>ECE 22.06 certified full face helmet.</p>', tags: ['Touring'],
          options: [{ name: 'Size' }, { name: 'Color' }],
          variants: [
            { sku: 'AX-APX-M', option1: 'Medium', option2: 'black', price: '5499.00', compare_at_price: '5999.00', available: true },
            { sku: 'AX-APX-L', option1: 'Large', option2: 'black', price: '5499.00', compare_at_price: '5999.00', available: true },
          ],
          images: [{ src: `${shopA.url}/img/a1.png`, position: 1 }, { src: `${shopA.url}/img/a2.png`, position: 2 }],
        },
        {
          id: 2, title: 'Chain Lube', handle: 'chain-lube', vendor: 'Motul', product_type: 'Lubes',
          body_html: 'Keeps chains clean.', tags: '', options: [{ name: 'Title' }],
          variants: [{ sku: '', option1: 'Default Title', price: '450', compare_at_price: null }],
          images: [],
        },
      ] }))
    }
    if (u.pathname.startsWith('/img/')) {
      res.setHeader('content-type', 'image/png')
      return res.end(u.pathname.endsWith('a1.png') ? png(200, 0, 0) : png(0, 0, 200))
    }
    res.statusCode = 404; res.end()
  })
  const shopB = await serve((req, res) => {
    const u = new URL(req.url, 'http://x')
    if (u.pathname === '/robots.txt') return res.end('User-agent: *\nDisallow: /product/hidden\n')
    if (u.pathname === '/products.json' || u.pathname.startsWith('/wp-json')) { res.statusCode = 404; return res.end() }
    if (u.pathname === '/sitemap.xml') {
      return res.end(`<?xml version="1.0"?><urlset><url><loc>${shopB.url}/product/apex-pro</loc></url><url><loc>${shopB.url}/product/hidden</loc></url><url><loc>${shopB.url}/about</loc></url></urlset>`)
    }
    if (u.pathname === '/product/hidden') { hits.blocked++; return res.end('should not be fetched') }
    if (u.pathname === '/product/apex-pro') {
      const ld = { '@context': 'https://schema.org', '@type': 'Product', name: 'Apex Pro', brand: { name: 'Axor' }, description: 'Full face helmet with pinlock.', image: ['/img/b1.png'], offers: { price: '5299', priceCurrency: 'INR' } }
      return res.end(`<html><head><script type="application/ld+json">${JSON.stringify(ld)}</script></head></html>`)
    }
    if (u.pathname === '/img/b1.png') { res.setHeader('content-type', 'image/png'); return res.end(png(0, 200, 0)) }
    res.statusCode = 404; res.end()
  })

  try {
    const work = await mkdtemp(join(tmpdir(), 'd38-extract-'))
    await writeFile(join(work, 'category-map.json'), JSON.stringify({ 'full face helmets': { path: 'Helmets > Full Face', hsn: '65061010' } }))
    await writeFile(join(work, 'sources.json'), JSON.stringify({
      contact: 'test@example.com', delayMs: 0, imageDelayMs: 0, categoryMap: 'category-map.json',
      sources: [
        { name: 'shopA', url: shopA.url, adapter: 'auto' },
        { name: 'shopB', url: shopB.url, adapter: 'auto', productUrlPattern: '/product/' },
      ],
    }))
    const out = join(work, 'out')
    const { stdout } = await run(process.execPath, [join(here, '..', 'extract.mjs'), 'run', '--config', join(work, 'sources.json'), '--out', out])
    assert.match(stdout, /Products: 2/)

    const read = async (f) => parseCsv(await readFile(join(out, f), 'utf8'))
    const products = await read('staging/products.csv')
    const apex = products.find((p) => p.importKey === 'axor__apex-pro')
    assert.ok(apex, 'the helmet listed on both shops appears once')
    assert.equal(apex.productCode, 'AXOR-APEX-PRO')
    assert.equal(apex.brand, 'Axor', 'normal capitalisation wins a tie with ALL CAPS')
    assert.equal(apex.categoryPath, 'Helmets > Full Face')
    assert.equal(apex.hsn, '65061010')
    assert.equal(apex.sellingPrice, '5499')
    assert.equal(apex.mrp, '5999')
    assert.equal(apex.certification, 'ECE 22.06')
    assert.equal(apex.tags, 'touring,ece-22.06')
    assert.equal(apex.sourceUrls, `${shopA.url}/products/axor-apex-pro`, 'only the kept listing')
    assert.equal(apex.status, 'NEW')

    const variants = await read('staging/variants.csv')
    assert.deepEqual(variants.map((v) => [v.sku, v.size, v.colour]), [['AX-APX-M', 'M', 'Black'], ['AX-APX-L', 'L', 'Black']])

    const images = await read('staging/images.csv')
    assert.deepEqual(images.filter((i) => i.productCode === 'AXOR-APEX-PRO').map((i) => i.localFile), ['AXOR-APEX-PRO/01.png', 'AXOR-APEX-PRO/02.png'])
    assert.deepEqual(await readdir(join(out, 'staging', 'images', 'AXOR-APEX-PRO')), ['01.png', '02.png'])

    const header = (await readFile(join(out, 'staging', 'products.csv'), 'utf8')).split('\r\n')[0]
    assert.equal(header, '﻿productCode,importKey,name,brand,categoryPath,shortDescription,description,sellingPrice,mrp,hsn,certification,tags,sourceUrls,uom,published,status')

    const duplicates = await read('reports/skipped-duplicates.csv')
    assert.equal(duplicates.length, 1)
    assert.equal(duplicates[0].keptSource, 'shopA')
    assert.equal(duplicates[0].skippedSource, 'shopB')
    assert.equal(duplicates[0].skippedPrice, '5299')

    const review = await read('reports/needs-review.csv')
    const lube = review.find((r) => r.name === 'Chain Lube')
    assert.match(lube.problems, /category not mapped/)
    assert.match(lube.problems, /no images/)

    const categories = await read('staging/categories.csv')
    assert.deepEqual(categories, [{ path: 'Helmets > Full Face', description: '', attributes: 'Size:required;Colour', status: 'NEW' }])

    assert.equal(hits.blocked, 0, 'robots.txt Disallow was respected')

    // A second run reuses the cache and the downloaded images.
    const again = await run(process.execPath, [join(here, '..', 'extract.mjs'), 'run', '--config', join(work, 'sources.json'), '--out', out])
    assert.match(again.stdout, /0 downloaded, 2 already on disk/)
  } finally {
    shopA.server.close()
    shopB.server.close()
  }
})

test('throttlerz-style product: brand from category, fitment tag, title case, helmet refine', async () => {
  const { toRaw } = await import('../lib/adapters/woocommerce.mjs')
  const { buildStaging } = await import('../lib/build.mjs')
  const raw = toRaw({
    id: 7, name: 'AXOR STREET FLIP UP HELMET', permalink: 'https://t.test/product/axor-street', sku: '',
    description: '<p>DOT certified flip up helmet.</p>', short_description: '',
    prices: { price: '459900', regular_price: '499900', currency_minor_unit: 2 },
    images: [{ src: 'https://t.test/a.jpg' }], brands: [], tags: [{ name: 'Flash' }],
    categories: [{ name: 'HELMETS' }, { name: 'AXOR' }, { name: 'KTM' }, { name: 'Flash sale' }],
    attributes: [{ name: 'SIZE', terms: [{ name: 'M' }, { name: 'L' }, { name: 'XL' }] }],
    variations: [{ id: 1, attributes: [{ name: 'SIZE', value: 'M' }] }, { id: 2, attributes: [{ name: 'SIZE', value: 'L' }] }],
    is_in_stock: true,
  })
  const staging = buildStaging([{ source: 't', products: [raw], titleCase: true }], {
    categoryMap: {
      HELMETS: { path: 'Helmets', hsn: '65061010', refine: { 'flip|modular': 'Helmets > Modular' } },
      'Flash sale': '',
    },
    knownBrands: ['Axor'],
    fitmentCategories: ['KTM', 'Royal Enfield'],
  })
  const [p] = staging.products
  assert.equal(p.name, 'Axor Street Flip Up Helmet')
  assert.equal(p.brand, 'Axor', 'brand found among the categories')
  assert.equal(p.categoryPath, 'Helmets > Modular', 'refined by keyword')
  assert.equal(p.sellingPrice, 4599)
  assert.equal(p.mrp, 4999)
  assert.equal(p.certification, 'DOT')
  assert.equal(p.tags, 'fits-ktm', 'SEO tags dropped, fitment kept')
  assert.deepEqual(staging.variants.map((v) => v.size), ['M', 'L'], 'only the combinations the site sells')
  assert.equal(staging.unmappedCategories.length, 0)
})
