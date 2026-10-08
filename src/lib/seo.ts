// Lightweight, dependency-free SEO helpers — sets document.title, meta
// description/OG tags, canonical link, and JSON-LD structured data
// directly on the DOM. The app uses real path-based routing (History
// API — see ShopContext), so these are real, addressable URLs. This
// still only helps crawlers that execute JS (e.g. Googlebot) — crawlers
// that fetch raw HTML without running JavaScript (most AI/answer-engine
// bots) need prerendering/SSR, a separate, larger piece of work.

const SITE_NAME = 'District 38';

function siteOrigin(): string {
  return typeof window !== 'undefined' ? window.location.origin : '';
}

function upsertMetaByAttr(attr: 'name' | 'property', key: string, content: string) {
  if (typeof document === 'undefined') return;
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(path: string) {
  if (typeof document === 'undefined') return;
  const href = `${siteOrigin()}${path}`;
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export interface PageMetaInput {
  /** Page-specific title. "| District 38" is appended automatically. */
  title: string;
  description: string;
  /** Current route path (e.g. "/products/axor-apex-pro"), for canonical + og:url. */
  path: string;
  image?: string;
}

export function setPageMeta({ title, description, path, image }: PageMetaInput): void {
  if (typeof document === 'undefined') return;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  document.title = fullTitle;
  upsertMetaByAttr('name', 'description', description);
  upsertMetaByAttr('property', 'og:title', fullTitle);
  upsertMetaByAttr('property', 'og:description', description);
  upsertMetaByAttr('property', 'og:url', `${siteOrigin()}${path}`);
  if (image) upsertMetaByAttr('property', 'og:image', image);
  upsertCanonical(path);
}

/** Sets (or clears) a robots meta tag — use `setRobotsMeta('noindex, nofollow')`
 * on pages like the 404 that should never be indexed, and clear it (pass
 * `null`) when leaving that page so it doesn't leak onto the next one. */
export function setRobotsMeta(content: string | null): void {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!content) {
    existing?.remove();
    return;
  }
  upsertMetaByAttr('name', 'robots', content);
}

/** Insert/replace a JSON-LD <script> block by a stable id. Pass `null` to remove it. */
export function setStructuredData(id: string, data: Record<string, unknown> | null): void {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }
  let script = existing as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
