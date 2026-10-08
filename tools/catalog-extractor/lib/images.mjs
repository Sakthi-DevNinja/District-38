import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

// Records which source URL each saved file came from, so re-runs match
// files by URL rather than by position (a failed image no longer shifts
// the numbering of the ones after it).
const MANIFEST = '.sources.json'

async function readManifest(dir) {
  try {
    return JSON.parse(await readFile(join(dir, MANIFEST), 'utf8'))
  } catch {
    return null
  }
}

/**
 * WordPress keeps resized copies (photo-1024x1024.webp) even when the
 * original upload is gone. Finds the largest copy of the same photo on the
 * product page.
 */
async function wordpressResizedCopy(fetcher, url, pageUrl) {
  if (!pageUrl || !url.includes('/wp-content/uploads/')) return null
  const page = await fetcher.getText(pageUrl)
  if (!page || page.status !== 200) return null
  const file = url.split('/').pop()
  const dot = file.lastIndexOf('.')
  const base = file.slice(0, dot)
  const folder = url.slice(0, url.length - file.length)
  const escaped = (folder + base).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`${escaped}-(\\d+)x(\\d+)\\.(?:jpe?g|png|webp)`, 'g')
  let best = null
  for (const m of page.body.matchAll(re)) {
    const area = Number(m[1]) * Number(m[2])
    if (!best || area > best.area) best = { url: m[0], area }
  }
  return best?.url ?? null
}

/**
 * Downloads each product's gallery in order to images/<productCode>/01.jpg,
 * 02.jpg … (01 = main image). Files already on disk are reused, identical
 * images within a product are kept once, a missing WordPress original is
 * replaced by its largest resized copy, and the returned rows match the
 * import's product-images sheet.
 */
export async function downloadImages(fetcher, imagePlans, imagesDir, { log = console.log } = {}) {
  const rows = []
  const failures = []
  let downloaded = 0
  let reused = 0
  let recovered = 0
  for (const plan of imagePlans) {
    const dir = join(imagesDir, plan.productCode)
    await mkdir(dir, { recursive: true })
    const manifest = await readManifest(dir)
    const existing = await readdir(dir)
    const sources = {}
    const seenHashes = new Set()
    let position = 0

    for (const url of plan.urls) {
      const nn = String(position + 1).padStart(2, '0')
      // With a manifest, match by URL; folders from before it existed are
      // matched by position as they were saved.
      let file = manifest ? manifest[url] : existing.find((f) => f.startsWith(`${nn}.`))
      if (file && !existing.includes(file)) file = undefined
      let buffer
      if (file) {
        buffer = await readFile(join(dir, file))
        reused++
      } else {
        let result = await fetcher.getBuffer(url)
        if (!result) {
          const copy = await wordpressResizedCopy(fetcher, url, plan.pageUrl)
          if (copy) {
            result = await fetcher.getBuffer(copy)
            if (result) recovered++
          }
        }
        const ext = result && EXTENSIONS[result.contentType.split(';')[0].trim().toLowerCase()]
        if (!ext) {
          if (result) log(`  skipped ${url}: unsupported type ${result.contentType}`)
          failures.push({ productCode: plan.productCode, url })
          continue
        }
        buffer = result.buffer
        // A free name, so a new file never overwrites an existing one.
        let n = position + 1
        while (existing.some((f) => f.startsWith(`${String(n).padStart(2, '0')}.`))) n++
        file = `${String(n).padStart(2, '0')}.${ext}`
        existing.push(file)
        await writeFile(join(dir, file), buffer)
        downloaded++
      }
      const sha = createHash('sha256').update(buffer).digest('hex')
      if (seenHashes.has(sha)) continue
      seenHashes.add(sha)
      sources[url] = file
      position++
      rows.push({
        productCode: plan.productCode,
        productImportKey: plan.importKey,
        position,
        localFile: `${plan.productCode}/${file}`,
        sourceUrl: url,
        label: '',
        visibility: 'PUBLIC',
        fileId: '',
        fileSha256: '',
        status: 'NEW',
      })
    }
    if (Object.keys(sources).length) await writeFile(join(dir, MANIFEST), JSON.stringify(sources, null, 1))
  }
  return { rows, downloaded, reused, recovered, failures }
}
