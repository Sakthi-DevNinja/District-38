#!/usr/bin/env node
// Generates public/sitemap.xml from real data only — static known routes
// plus live products/categories/brands fetched from the VEYONN public
// catalog API. Never fabricates a URL. Run manually (or wire into your
// own CI step) once SITE_URL and the backend are both known/reachable —
// not part of `npm run build` by default, since that shouldn't fail (or
// silently produce a stale sitemap) just because the backend happens to
// be unreachable at build time.
//
// Usage:
//   SITE_URL=https://www.district38.in VITE_API_BASE_URL=https://api.district38.in node scripts/generate-sitemap.mjs

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = process.env.SITE_URL;
const API_BASE_URL = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL;

if (!SITE_URL) {
  console.error('SITE_URL is required, e.g. SITE_URL=https://www.district38.in node scripts/generate-sitemap.mjs');
  process.exit(1);
}
if (!API_BASE_URL) {
  console.error('VITE_API_BASE_URL (or API_BASE_URL) is required to fetch real products/categories/brands.');
  process.exit(1);
}

function slugifyCategoryName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchAllProducts() {
  const items = [];
  let cursor;
  do {
    const url = new URL('/api/public/v1/products', API_BASE_URL);
    url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('cursor', cursor);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    const page = await res.json();
    items.push(...page.items);
    cursor = page.hasNext ? page.nextCursor : null;
  } while (cursor);
  return items;
}

async function fetchJson(pathname) {
  const res = await fetch(new URL(pathname, API_BASE_URL));
  if (!res.ok) throw new Error(`Failed to fetch ${pathname}: ${res.status}`);
  return res.json();
}

// Guides are site-authored content in src/data/guides.ts, not backend data.
async function readGuideSlugs() {
  const src = await readFile(path.resolve(process.cwd(), 'src', 'data', 'guides.ts'), 'utf-8');
  return [...src.matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1]);
}

const STATIC_ROUTES = [
  '/', '/shop', '/brands', '/collections', '/offers', '/guides',
  '/about', '/contact', '/faq', '/shipping', '/returns', '/privacy', '/terms', '/store'
];

function urlEntry(loc, { changefreq = 'weekly', priority = '0.5' } = {}) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

async function main() {
  const [products, categories, brands, guideSlugs] = await Promise.all([
    fetchAllProducts(),
    fetchJson('/api/public/v1/categories'),
    fetchJson('/api/public/v1/brands'),
    readGuideSlugs()
  ]);

  const entries = [
    ...STATIC_ROUTES.map((p) => urlEntry(`${SITE_URL}${p}`, { changefreq: p === '/' ? 'daily' : 'weekly', priority: p === '/' ? '1.0' : '0.6' })),
    ...categories.map((c) => urlEntry(`${SITE_URL}/${slugifyCategoryName(c.name)}`, { changefreq: 'weekly', priority: '0.7' })),
    ...brands.map((b) => urlEntry(`${SITE_URL}/brands/${slugifyCategoryName(b.name)}`, { changefreq: 'weekly', priority: '0.6' })),
    ...guideSlugs.map((s) => urlEntry(`${SITE_URL}/guides/${s}`, { changefreq: 'monthly', priority: '0.5' })),
    ...products.map((p) => urlEntry(`${SITE_URL}/products/${p.slug}`, { changefreq: 'daily', priority: '0.8' }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

  const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
  await writeFile(outPath, xml, 'utf-8');
  console.log(`Wrote ${entries.length} URLs to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
