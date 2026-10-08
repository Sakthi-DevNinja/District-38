import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Polite HTTP client for one source site:
 * - one request at a time with a delay between them,
 * - identifies itself with a contact address,
 * - honours robots.txt Disallow rules for `*` and our agent,
 * - caches every response under rawDir so mapping fixes never re-hit the
 *   site (the raw snapshot is also the evidence of what the site showed).
 */
export class PoliteFetcher {
  constructor({ rawDir, delayMs = 1500, contact, refresh = false, log = console.log }) {
    this.rawDir = rawDir
    this.delayMs = delayMs
    this.refresh = refresh
    this.log = log
    this.userAgent = `District38CatalogBot/1.0 (+${contact || 'no contact set'})`
    this.lastRequestAt = 0
    this.robots = new Map()
    this.stats = { network: 0, cached: 0, blocked: 0, failed: 0 }
  }

  cachePath(url) {
    const hash = createHash('sha1').update(url).digest('hex')
    return join(this.rawDir, `${hash}.json`)
  }

  async readCache(url) {
    if (this.refresh) return null
    try {
      return JSON.parse(await readFile(this.cachePath(url), 'utf8'))
    } catch {
      return null
    }
  }

  async throttle() {
    const wait = this.lastRequestAt + this.delayMs - Date.now()
    if (wait > 0) await sleep(wait)
    this.lastRequestAt = Date.now()
  }

  /** Sitemap URLs listed in the site's robots.txt (after it was read). */
  sitemapsFor(url) {
    return this.robots.get(new URL(url).origin)?.sitemaps ?? []
  }

  async allowedByRobots(url) {
    const { origin, pathname, search } = new URL(url)
    if (!this.robots.has(origin)) {
      let rules = Object.assign([], { sitemaps: [] })
      try {
        await this.throttle()
        const res = await fetch(`${origin}/robots.txt`, { headers: { 'User-Agent': this.userAgent } })
        if (res.ok) rules = parseRobots(await res.text(), 'district38catalogbot')
      } catch {
        // No robots.txt reachable: nothing is disallowed.
      }
      this.robots.set(origin, rules)
    }
    return robotsAllows(this.robots.get(origin), pathname + search)
  }

  /** GET text with retries. Returns { status, contentType, body } or null when blocked/failed. */
  async getText(url, { retries = 3 } = {}) {
    const cached = await this.readCache(url)
    if (cached) {
      this.stats.cached++
      return cached
    }
    if (!(await this.allowedByRobots(url))) {
      this.stats.blocked++
      this.log(`  robots.txt disallows ${url}, skipped`)
      return null
    }
    for (let attempt = 1; attempt <= retries; attempt++) {
      await this.throttle()
      try {
        const res = await fetch(url, { headers: { 'User-Agent': this.userAgent, Accept: '*/*' } })
        if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`)
        const entry = {
          url,
          status: res.status,
          contentType: res.headers.get('content-type') ?? '',
          fetchedAt: new Date().toISOString(),
          body: await res.text(),
        }
        this.stats.network++
        if (res.ok) {
          await mkdir(this.rawDir, { recursive: true })
          await writeFile(this.cachePath(url), JSON.stringify(entry), 'utf8')
        }
        return entry
      } catch (error) {
        if (attempt === retries) {
          this.stats.failed++
          this.log(`  failed ${url}: ${error.message}`)
          return null
        }
        // Back off harder each time, especially after a 429.
        await sleep(this.delayMs * attempt * 2)
      }
    }
    return null
  }

  async getJson(url) {
    const entry = await this.getText(url)
    if (!entry || entry.status !== 200) return null
    try {
      return JSON.parse(entry.body)
    } catch {
      return null
    }
  }

  /** Binary download (images); not cached in rawDir, the file itself is the cache. */
  async getBuffer(url) {
    if (!(await this.allowedByRobots(url))) {
      this.stats.blocked++
      return null
    }
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.throttle()
      try {
        const res = await fetch(url, { headers: { 'User-Agent': this.userAgent } })
        // A missing file won't appear on a retry.
        if (res.status === 404 || res.status === 410) {
          this.stats.failed++
          this.log(`  image missing (${res.status}) ${url}`)
          return null
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        this.stats.network++
        return { contentType: res.headers.get('content-type') ?? '', buffer: Buffer.from(await res.arrayBuffer()) }
      } catch (error) {
        if (attempt === 3) {
          this.stats.failed++
          this.log(`  image failed ${url}: ${error.message}`)
          return null
        }
        await sleep(this.delayMs * attempt * 2)
      }
    }
    return null
  }
}

/**
 * Allow/Disallow rules that apply to `*` or to our own agent name, as
 * { allow, pattern, length }. Patterns follow Google's robots.txt rules:
 * `*` matches any characters, a trailing `$` anchors the end, and the
 * longest matching rule wins (Allow wins a tie).
 */
export function parseRobots(text, agent) {
  const rules = []
  const sitemaps = []
  let applies = false
  let inAgentBlock = false
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim()
    const match = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/)
    if (!match) continue
    const [, key, value] = match
    const k = key.toLowerCase()
    if (k === 'sitemap') {
      sitemaps.push(value.trim())
    } else if (k === 'user-agent') {
      // Consecutive User-agent lines form one group.
      if (!inAgentBlock) applies = false
      const ua = value.toLowerCase()
      if (ua === '*' || agent.includes(ua)) applies = true
      inAgentBlock = true
    } else {
      inAgentBlock = false
      if (applies && (k === 'disallow' || k === 'allow') && value) {
        rules.push({ allow: k === 'allow', pattern: value, length: value.length })
      }
    }
  }
  rules.sitemaps = sitemaps
  return rules
}

function patternToRegex(pattern) {
  const anchored = pattern.endsWith('$')
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*')
  return new RegExp(`^${body}${anchored ? '$' : ''}`)
}

/** True when the path (with query string) may be fetched under these rules. */
export function robotsAllows(rules, pathAndQuery) {
  let best = null
  for (const rule of rules) {
    if (!patternToRegex(rule.pattern).test(pathAndQuery)) continue
    if (!best || rule.length > best.length || (rule.length === best.length && rule.allow)) best = rule
  }
  return !best || best.allow
}
