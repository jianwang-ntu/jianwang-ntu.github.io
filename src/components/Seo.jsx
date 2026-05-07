import { useEffect } from 'react';

// Canonical site URL — must match SITE_URL used by tools/build-sitemap.mjs +
// tools/build-prerender.mjs. Both deploy targets (github.io and wj2ai.com)
// point their canonical at this URL so search engines attribute everything
// to one origin.
const SITE_URL = 'https://www.wj2ai.com';
const SITE_NAME = 'Jian Wang';
const DEFAULT_DESCRIPTION = 'Jian Wang (王剑) — PhD, NTU Singapore. Research on code LLM security, automated program repair, and AI-generated code detection. Notes on agents, harnesses, and engineering.';
const DEFAULT_IMAGE = 'https://123publicdata.s3.ap-southeast-1.amazonaws.com/personal/favor.ico';

function setMeta(selector, attr, value) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(selector);
  if (!value) {
    // Leave existing tags alone if no value supplied — the prerendered HTML
    // already has sensible defaults; clobbering with empty would harm SEO.
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    // Decide whether the selector targets `name=` or `property=`.
    const nameMatch = selector.match(/\[name="([^"]+)"\]/);
    const propMatch = selector.match(/\[property="([^"]+)"\]/);
    if (nameMatch) el.setAttribute('name', nameMatch[1]);
    else if (propMatch) el.setAttribute('property', propMatch[1]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel, href) {
  if (typeof document === 'undefined' || !href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setLdJson(payload) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('script[type="application/ld+json"][data-seo="page"]');
  if (!payload) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-seo', 'page');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload);
}

/**
 * Update <head> tags for the current route.
 *
 * The prerender step writes static <head> tags into dist/<route>/index.html
 * for crawlers that don't run JS (LinkedIn / Twitter / FB / Slack unfurl).
 * This component keeps the head in sync as the user navigates client-side,
 * for Googlebot which runs JS and re-snapshots, and for the user's tab title.
 *
 * Pass a `path` to set <link rel="canonical">; default is the current
 * pathname (still wrapped in SITE_URL).
 */
export default function Seo({
  title,
  description,
  image,
  path,
  type = 'website',
  ldJson,
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Academic Homepage`;
    const desc = description || DEFAULT_DESCRIPTION;
    const img = image || DEFAULT_IMAGE;
    const canonicalPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/');
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', desc);
    setLink('canonical', canonicalUrl);

    setMeta('meta[property="og:site_name"]', 'content', SITE_NAME);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', img);

    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    setMeta('meta[name="twitter:image"]', 'content', img);

    setLdJson(ldJson || null);
  }, [title, description, image, path, type, JSON.stringify(ldJson || null)]);

  return null;
}
