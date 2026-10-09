#!/usr/bin/env node
// District 38 catalog extractor. See README.md.
//   node extract.mjs recon https://example-shop.in
//   node extract.mjs run --config sources.json [--limit 20] [--refresh] [--skip-images]
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, join, resolve } from 'node:path'
import { PoliteFetcher } from './lib/fetcher.mjs'
import { buildStaging, strongestCertification } from './lib/build.mjs'
import { downloadImages } from './lib/images.mjs'
import { HEADERS, parseCsv, writeCsv } from './lib/csv.mjs'
import * as shopify from './lib/adapters/shopify.mjs'
import * as woocommerce from './lib/adapters/woocommerce.mjs'
import * as jsonld from './lib/adapters/jsonld.mjs'

const ADAPTERS = { shopify, woocommerce, jsonld }

function parseArgs(argv) {
  const [command, ...rest] = argv
  const options = { _: [] }
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i]
    if (!arg.startsWith('--')) options._.push(arg)
    else if (rest[i + 1] && !rest[i + 1].startsWith('--')) options[arg.slice(2)] = rest[++i]
    else options[arg.slice(2)] = true
  }
  return { command, options }
}

const baseOf = (url) => new URL(url).origin

async function detectAdapter(fetcher, baseUrl) {
  for (const name of ['shopify', 'woocommerce', 'jsonld']) {
    if (await ADAPTERS[name].detect(fetcher, baseUrl)) return name
  }
  return null
}

async function readJsonFile(path, fallback) {
  if (!path) return fallback
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return fallback
    throw new Error(`Could not read ${path}: ${error.message}`)
  }
}

async function recon(url, options) {
  const baseUrl = baseOf(url)
  const out = resolve(options.out ?? 'catalog-data')
  const fetcher = new PoliteFetcher({ rawDir: join(out, 'raw', 'recon', new URL(url).hostname), delayMs: Number(options.delay ?? 1500), contact: options.contact })
  console.log(`Checking ${baseUrl} …`)
  const adapter = await detectAdapter(fetcher, baseUrl)
  if (!adapter) {
    console.log('Could not recognise this shop (not Shopify, not WooCommerce, no sitemap). It needs a custom adapter.')
    return
  }
  console.log(`Platform: ${adapter}`)
  const sample = []
  for await (const p of ADAPTERS[adapter].products(fetcher, baseUrl, { limit: 5, productUrlPattern: options.pattern })) sample.push(p)
  console.log(`Sample of ${sample.length} product(s):`)
  for (const p of sample) {
    console.log(`  - ${p.brand || '(no brand)'} | ${p.name} | ₹${p.sellingPrice ?? '?'}${p.mrp ? ` (MRP ₹${p.mrp})` : ''} | ${p.variants.length} sizes/options | ${p.images.length} images | categories: ${(p.sourceCategories ?? []).join(' | ') || '(none)'}`)
  }
  console.log(`Requests: ${fetcher.stats.network} network, ${fetcher.stats.cached} cached, ${fetcher.stats.blocked} blocked by robots.txt`)
}

async function run(options) {
  if (!options.config) throw new Error('Pass --config sources.json (see sources.example.json).')
  const configPath = resolve(options.config)
  const configDir = dirname(configPath)
  const config = await readJsonFile(configPath, null)
  if (!config?.sources?.length) throw new Error(`${options.config} has no sources.`)

  const out = resolve(options.out ?? config.out ?? 'catalog-data')
  const stagingDir = join(out, 'staging')
  const reportsDir = join(out, 'reports')
  await mkdir(stagingDir, { recursive: true })
  await mkdir(reportsDir, { recursive: true })

  const categoryMap = await readJsonFile(config.categoryMap && join(configDir, config.categoryMap), {})
  const brandMap = await readJsonFile(config.brandMap && join(configDir, config.brandMap), {})
  const limit = options.limit ? Number(options.limit) : Infinity

  const sourceResults = []
  for (const source of config.sources) {
    const baseUrl = baseOf(source.url)
    const fetcher = new PoliteFetcher({
      rawDir: join(out, 'raw', source.name),
      delayMs: Number(source.delayMs ?? config.delayMs ?? 1500),
      contact: config.contact,
      refresh: Boolean(options.refresh),
    })
    const adapterName = !source.adapter || source.adapter === 'auto' ? await detectAdapter(fetcher, baseUrl) : source.adapter
    if (!ADAPTERS[adapterName]) throw new Error(`${source.name}: unknown or undetected adapter "${adapterName}".`)
    console.log(`\n${source.name} (${baseUrl}) via ${adapterName}`)

    const products = []
    for await (const p of ADAPTERS[adapterName].products(fetcher, baseUrl, { limit, productUrlPattern: source.productUrlPattern })) {
      products.push(p)
      if (products.length % 25 === 0) console.log(`  ${products.length} products…`)
    }
    console.log(`  ${products.length} products (${fetcher.stats.network} requests, ${fetcher.stats.cached} from cache, ${fetcher.stats.blocked} blocked, ${fetcher.stats.failed} failed)`)

    // Normalised snapshot of exactly what this site showed, kept per run.
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    await mkdir(join(out, 'snapshots'), { recursive: true })
    await writeFile(join(out, 'snapshots', `${source.name}-${stamp}.json`), JSON.stringify({ source, adapter: adapterName, products }, null, 2))
    sourceResults.push({ source: source.name, products, titleCase: Boolean(source.titleCase), useImages: source.useImages !== false })
  }

  const staging = buildStaging(sourceResults, {
    categoryMap,
    brandMap,
    knownBrands: config.knownBrands ?? [],
    fitmentCategories: config.fitmentCategories ?? [],
    keepTags: config.keepTags,
  })

  // Rewritten descriptions (descriptions/*.json: [{ productCode, shortDescription, description }])
  // are applied on every build, so they survive re-extraction.
  let descriptionsApplied = 0
  try {
    const descDir = join(out, 'descriptions')
    const byCode = new Map()
    for (const file of (await readdir(descDir)).filter((f) => f.endsWith('.json')).sort()) {
      for (const d of JSON.parse(await readFile(join(descDir, file), 'utf8'))) byCode.set(d.productCode, d)
    }
    for (const p of staging.products) {
      const d = byCode.get(p.productCode)
      if (!d) continue
      p.shortDescription = d.shortDescription
      p.description = d.description
      descriptionsApplied++
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  // Helmet certifications confirmed by the owner (owner/helmet-certifications.csv:
  // productCode, certification) override what was read from the source text.
  // Several marks ("DOT, ISI") keep the strongest one, like the text reader does.
  let certificationsApplied = 0
  try {
    const sheet = parseCsv(await readFile(join(out, 'owner', 'helmet-certifications.csv'), 'utf8'))
    const byCode = new Map(sheet.filter((r) => r.productCode && r.certification?.trim()).map((r) => [r.productCode, r.certification]))
    for (const p of staging.products) {
      const given = byCode.get(p.productCode)
      if (!given) continue
      const certification = strongestCertification(given)
      if (!certification) {
        console.log(`  helmet-certifications.csv: "${given}" for ${p.productCode} is not ECE 22.06/22.05, DOT or ISI, skipped`)
        continue
      }
      p.certification = certification
      if (certification === 'ECE 22.06') p.tags = [...new Set([...p.tags.split(',').filter(Boolean), 'ece-22.06'])].join(',')
      const issue = staging.issues.find((i) => i.productCode === p.productCode)
      if (issue) issue.problems = issue.problems.split('; ').filter((x) => !/certification|ECE but/.test(x)).join('; ')
      if (!staging.attributes.some((a) => a.attribute === 'Certification' && a.value === certification)) {
        staging.attributes.push({ attribute: 'Certification', classification: '', dataType: '', value: certification, status: 'NEW' })
      }
      certificationsApplied++
    }
    staging.issues = staging.issues.filter((i) => i.problems)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  let images ={ rows: [], downloaded: 0, reused: 0, recovered: 0, failures: [] }
  if (!options['skip-images']) {
    console.log(`\nDownloading images for ${staging.imagePlans.length} products…`)
    const imageFetcher = new PoliteFetcher({ rawDir: join(out, 'raw', '_images'), delayMs: Number(config.imageDelayMs ?? 500), contact: config.contact })
    images = await downloadImages(imageFetcher, staging.imagePlans, join(stagingDir, 'images'))
  }

  // Our own / brand photos (photos/<productCode>/*.jpg|png|webp) are added on every build,
  // after the source's photos, so they survive re-extraction like the descriptions.
  let ownPhotos = 0
  try {
    const photosDir = join(out, 'photos')
    const byCode = new Map(staging.products.map((p) => [p.productCode, p]))
    for (const code of (await readdir(photosDir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort()) {
      const product = byCode.get(code)
      if (!product) {
        console.log(`  photos/${code}: no product with this code, skipped`)
        continue
      }
      const files = (await readdir(join(photosDir, code))).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
      let position = images.rows.filter((r) => r.productCode === code).length
      await mkdir(join(stagingDir, 'images', code), { recursive: true })
      for (const [i, file] of files.entries()) {
        const target = `own-${String(i + 1).padStart(2, '0')}${extname(file).toLowerCase()}`
        await copyFile(join(photosDir, code, file), join(stagingDir, 'images', code, target))
        images.rows.push({ productCode: code, productImportKey: product.importKey, position: ++position, localFile: `${code}/${target}`, sourceUrl: '', label: '', visibility: 'PUBLIC', fileId: '', fileSha256: '', status: 'NEW' })
        ownPhotos++
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  await writeCsv(join(stagingDir, 'brands.csv'), HEADERS.brands, staging.brands)
  await writeCsv(join(stagingDir, 'attributes.csv'), HEADERS.attributes, staging.attributes)
  await writeCsv(join(stagingDir, 'categories.csv'), HEADERS.categories, staging.categories)
  await writeCsv(join(stagingDir, 'products.csv'), HEADERS.products, staging.products)
  await writeCsv(join(stagingDir, 'variants.csv'), HEADERS.variants, staging.variants)
  await writeCsv(join(stagingDir, 'images.csv'), HEADERS.images, images.rows)
  await writeCsv(join(reportsDir, 'needs-review.csv'), ['productCode', 'name', 'problems', 'sourceUrls'], staging.issues)
  // Products with no photo on any source: imported as unpublished drafts;
  // staff add a photo in Pilot before publishing.
  // Includes products whose every image failed to download.
  const withImages = new Set(images.rows.map((r) => r.productCode))
  const needsPhoto = options['skip-images']
    ? staging.issues.filter((i) => i.problems.includes('no images'))
    : staging.products.filter((p) => !withImages.has(p.productCode))
  await writeCsv(join(reportsDir, 'needs-photo.csv'), ['productCode', 'name', 'sourceUrls'], needsPhoto)
  await writeCsv(join(reportsDir, 'failed-images.csv'), ['productCode', 'url'], images.failures)
  await writeCsv(join(reportsDir, 'skipped-duplicates.csv'), ['productCode', 'name', 'keptSource', 'keptUrl', 'keptPrice', 'skippedSource', 'skippedUrl', 'skippedPrice'], staging.duplicates)
  await writeCsv(join(reportsDir, 'refiled-by-name.csv'), ['productCode', 'name', 'from', 'to'], staging.refiled)
  await writeCsv(join(reportsDir, 'unmapped-categories.csv'), ['sourceCategories', 'products'], staging.unmappedCategories)

  const summary = [
    `Products: ${staging.products.length} (from ${sourceResults.reduce((n, s) => n + s.products.length, 0)} source listings)`,
    `Sizes/variants: ${staging.variants.length}`,
    `Brands: ${staging.brands.length}, categories: ${staging.categories.length}`,
    `Images: ${images.rows.length} (${images.downloaded} downloaded, ${images.reused} already on disk, ${images.recovered} recovered from resized copies, ${images.failures.length} unavailable)${options['skip-images'] ? ' — skipped' : ''}`,
    `Products without any photo: ${needsPhoto.length} (reports/needs-photo.csv)`,
    `Own / brand photos added: ${ownPhotos} (photos/<productCode>/)`,
    `Descriptions rewritten: ${descriptionsApplied} of ${staging.products.length}`,
    `Helmet certifications from owner/helmet-certifications.csv: ${certificationsApplied}`,
    `Re-filed by name rules: ${staging.refiled.length} (reports/refiled-by-name.csv)`,
    `Needs review: ${staging.issues.length} products (reports/needs-review.csv)`,
    `Duplicates skipped: ${staging.duplicates.length} (reports/skipped-duplicates.csv)`,
    `Unmapped source categories: ${staging.unmappedCategories.length} (reports/unmapped-categories.csv)`,
    `Staging folder: ${stagingDir}`,
  ]
  await writeFile(join(reportsDir, 'summary.txt'), summary.join('\n') + '\n')
  console.log('\n' + summary.join('\n'))
}

const { command, options } = parseArgs(process.argv.slice(2))
try {
  if (command === 'recon' && options._[0]) await recon(options._[0], options)
  else if (command === 'run') await run(options)
  else {
    console.log('Usage:\n  node extract.mjs recon <shop-url> [--contact you@example.com]\n  node extract.mjs run --config sources.json [--limit N] [--refresh] [--skip-images] [--out catalog-data]')
    process.exitCode = command ? 1 : 0
  }
} catch (error) {
  console.error(`Error: ${error.message}`)
  process.exitCode = 1
}
