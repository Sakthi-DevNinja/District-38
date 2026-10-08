import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

/**
 * Downloads each product's gallery in order to images/<productCode>/01.jpg,
 * 02.jpg … (01 = main image). Files already on disk are reused, identical
 * images within a product are kept once, and the returned rows match the
 * import's product-images sheet.
 */
export async function downloadImages(fetcher, imagePlans, imagesDir, { log = console.log } = {}) {
  const rows = []
  let downloaded = 0
  let reused = 0
  for (const plan of imagePlans) {
    const dir = join(imagesDir, plan.productCode)
    await mkdir(dir, { recursive: true })
    const existing = await readdir(dir)
    const seenHashes = new Set()
    let position = 0

    for (const url of plan.urls) {
      const nn = String(position + 1).padStart(2, '0')
      let file = existing.find((f) => f.startsWith(`${nn}.`))
      let buffer
      if (file) {
        buffer = await readFile(join(dir, file))
        reused++
      } else {
        const result = await fetcher.getBuffer(url)
        const ext = result && EXTENSIONS[result.contentType.split(';')[0].trim().toLowerCase()]
        if (!ext) {
          if (result) log(`  skipped ${url}: unsupported type ${result.contentType}`)
          continue
        }
        buffer = result.buffer
        file = `${nn}.${ext}`
        await writeFile(join(dir, file), buffer)
        downloaded++
      }
      const sha = createHash('sha256').update(buffer).digest('hex')
      if (seenHashes.has(sha)) continue
      seenHashes.add(sha)
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
  }
  return { rows, downloaded, reused }
}
