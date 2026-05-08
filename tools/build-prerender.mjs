#!/usr/bin/env node
/**
 * Post-build prerender. Vite outputs a single dist/index.html (SPA shell);
 * social-sharing bots (LinkedIn, Twitter, Facebook, Slack unfurl) don't run
 * JS, so they only see the static <head>. Without this step every shared
 * link shows the homepage's title/description.
 *
 * What we do:
 *   1. Read dist/index.html.
 *   2. For each route (/home, /pubs, /work, /cv, /blog) and each blog post
 *      (/blog/<slug>), write dist/<route>/index.html with a patched <head> —
 *      route-specific <title>, meta description, og:*, twitter:*, canonical,
 *      and (for blog posts) JSON-LD BlogPosting structured data.
 *   3. The body is unchanged: the SPA still mounts and React Router takes
 *      over once JS executes. Crawlers and unfurlers grab the static head
 *      and are happy.
 *
 * Servers serve dist/<route>/index.html directly when present (both GitHub
 * Pages and the wj2ai.com nginx do via try_files), so users see the right
 * meta tags on first paint without any redirect.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = (process.env.SITE_URL || 'https://www.wj2ai.com').replace(/\/$/, '');
const S3_IMAGE_BASE = (process.env.S3_IMAGE_BASE
  || 'https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io').replace(/\/$/, '');
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const distDir = resolve(repoRoot, 'dist');
const distIndex = resolve(distDir, 'index.html');

if (!existsSync(distIndex)) {
  console.error(`build-prerender: ${distIndex} not found. Run \`vite build\` first.`);
  process.exit(1);
}

const baseHtml = readFileSync(distIndex, 'utf-8');

// Default site-level meta. Used as fallback when a per-route value is missing.
const SITE_NAME = 'Jian Wang';
const DEFAULT_DESC = 'Jian Wang (王剑) — PhD, NTU Singapore. Research on code LLM security, automated program repair, and AI-generated code detection. Notes on agents, harnesses, and engineering.';
const DEFAULT_IMAGE = 'https://123publicdata.s3.ap-southeast-1.amazonaws.com/personal/favor.ico';
const TWITTER_HANDLE = '';  // optional; leave empty to omit twitter:creator

const escape = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Read posts.json (the manifest). Per-post meta.json is the canonical source
 *  for dek/title — but posts.json mirrors them, so reading the manifest is
 *  enough for prerendering. */
function readPosts() {
  const p = resolve(repoRoot, 'public/blog/posts.json');
  if (!existsSync(p)) return [];
  try { return JSON.parse(readFileSync(p, 'utf-8')); }
  catch (e) { console.warn(`build-prerender: could not parse ${p} (${e.message})`); return []; }
}

/** Build the <head> meta block for a route. ldJson is optional. */
function metaBlock({ title, description, canonicalPath, image, ogType = 'website', ldJson }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Academic Homepage`;
  const desc = description || DEFAULT_DESC;
  const url = `${SITE_URL}${canonicalPath}`;
  const img = image || DEFAULT_IMAGE;
  const lines = [
    `<title>${escape(fullTitle)}</title>`,
    `<meta name="description" content="${escape(desc)}" />`,
    `<link rel="canonical" href="${escape(url)}" />`,
    `<meta property="og:site_name" content="${escape(SITE_NAME)}" />`,
    `<meta property="og:type" content="${escape(ogType)}" />`,
    `<meta property="og:title" content="${escape(fullTitle)}" />`,
    `<meta property="og:description" content="${escape(desc)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:image" content="${escape(img)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(fullTitle)}" />`,
    `<meta name="twitter:description" content="${escape(desc)}" />`,
    `<meta name="twitter:image" content="${escape(img)}" />`,
  ];
  if (TWITTER_HANDLE) lines.push(`<meta name="twitter:creator" content="${escape(TWITTER_HANDLE)}" />`);
  if (ldJson) lines.push(`<script type="application/ld+json">${JSON.stringify(ldJson)}</script>`);
  return lines.map((l) => '    ' + l).join('\n');
}

/** Replace every SEO-bearing tag in the source <head> and inject our
 *  per-route block before </head>. We strip the homepage defaults from
 *  index.html — <title>, <meta name="description">, <link rel="canonical">,
 *  every og:* and twitter:* meta — so we don't end up with both the
 *  homepage's tags AND the route-specific tags coexisting (bots and link
 *  unfurlers can pick the wrong one). Idempotent — running twice strips
 *  the previous prerender block via a sentinel comment.
 */
function patchHead(html, block) {
  // Strip any previous prerender block (between sentinels).
  html = html.replace(/\n\s*<!-- prerender:start -->[\s\S]*?<!-- prerender:end -->\n?/g, '\n');
  // Drop the homepage defaults for SEO-bearing tags.
  html = html.replace(/\s*<title>[\s\S]*?<\/title>/, '');
  html = html.replace(/\s*<meta\s+name="description"[^>]*\/?>/g, '');
  html = html.replace(/\s*<link\s+rel="canonical"[^>]*\/?>/g, '');
  html = html.replace(/\s*<meta\s+property="og:[^"]*"[^>]*\/?>/g, '');
  html = html.replace(/\s*<meta\s+name="twitter:[^"]*"[^>]*\/?>/g, '');
  // Drop the explanatory comment block we ship in index.html so it doesn't
  // appear in every prerendered file.
  html = html.replace(/\n\s*<!--\s*These tags are sane defaults[\s\S]*?-->\n?/g, '\n');
  // Drop the OG / Twitter section comment headers too.
  html = html.replace(/\n\s*<!-- Open Graph[^>]*-->\n?/g, '\n');
  html = html.replace(/\n\s*<!-- Twitter Card[^>]*-->\n?/g, '\n');
  // Insert our block right before </head>.
  return html.replace('</head>',
    `\n    <!-- prerender:start -->\n${block}\n    <!-- prerender:end -->\n  </head>`);
}

function writeRoute(routePath, html) {
  const targetDir = resolve(distDir, routePath.replace(/^\//, ''));
  mkdirSync(targetDir, { recursive: true });
  const target = join(targetDir, 'index.html');
  writeFileSync(target, html, 'utf-8');
  console.log(`  wrote ${target.replace(repoRoot + '/', '')}`);
}

// Per-route descriptions — keep terse, ~150 chars max. These match the dynamic
// Seo component's defaults so the static and JS-rendered metadata agree.
const STATIC_ROUTES = [
  { path: '/home', title: 'Home',           desc: 'Jian Wang — PhD, NTU Singapore. Research on code LLM security, automated program repair, and AI-generated code detection.' },
  { path: '/pubs', title: 'Publications',   desc: 'Peer-reviewed research and preprints by Jian Wang on code LLM security, fake-content detection, and program repair.' },
  { path: '/work', title: 'Work & Projects', desc: 'Engineering work and side projects — agent harnesses, blog automation, security research tooling.' },
  { path: '/cv',   title: 'CV',             desc: 'Curriculum vitae — education, employment, talks, awards.' },
  { path: '/blog', title: 'Blog',           desc: 'Notes and summaries — auto-drafted from talks, papers, and posts; edited by hand.' },
];

console.log(`build-prerender: SITE_URL=${SITE_URL}`);

// 1) Static top-level routes.
for (const r of STATIC_ROUTES) {
  const block = metaBlock({
    title: r.title,
    description: r.desc,
    canonicalPath: r.path,
    ogType: 'website',
  });
  writeRoute(r.path, patchHead(baseHtml, block));
}

// 2) Each blog post, with BlogPosting JSON-LD for richer search results.
const posts = readPosts();
for (const p of posts) {
  if (!p?.slug) continue;
  const title = p.title_en || p.slug;
  const description = (p.dek_en || DEFAULT_DESC).replace(/\s+/g, ' ').trim();
  // posts.json already carries the canonical source-relative path for image.
  // The build-time S3 rewrite hasn't happened yet (we run before that step on
  // local builds; on CI we run after build but before upload, when the rewrite
  // already ran) — handle either form.
  let image = DEFAULT_IMAGE;
  if (p.image) {
    image = p.image.startsWith('http') ? p.image : `${S3_IMAGE_BASE}${p.image}`;
  }
  const canonicalPath = `/blog/${p.slug}`;
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'image': image,
    'author': { '@type': 'Person', 'name': 'Jian Wang' },
    'publisher': { '@type': 'Person', 'name': 'Jian Wang' },
    'datePublished': p.date,
    'dateModified': p.date,
    'mainEntityOfPage': `${SITE_URL}${canonicalPath}`,
    ...(p.source ? { 'isBasedOn': p.source } : {}),
  };
  const block = metaBlock({
    title, description,
    canonicalPath,
    image,
    ogType: 'article',
    ldJson,
  });
  writeRoute(canonicalPath, patchHead(baseHtml, block));
}

// 3) Patch the root index.html itself with site-level defaults so requests to
//    `/` (which redirects to /home but is also what the SPA-fallback serves
//    for every unmatched route) carry sensible meta.
const rootBlock = metaBlock({
  title: '',  // empty → uses the default site title
  description: DEFAULT_DESC,
  canonicalPath: '/home',  // / redirects to /home, attribute to canonical
  ogType: 'website',
});
writeFileSync(distIndex, patchHead(baseHtml, rootBlock), 'utf-8');
console.log(`  patched ${distIndex.replace(repoRoot + '/', '')}`);

// 4) Keep the SPA fallback in sync with the patched root.
const fallback = resolve(distDir, '404.html');
writeFileSync(fallback, readFileSync(distIndex), 'utf-8');
console.log(`  copied → ${fallback.replace(repoRoot + '/', '')}`);

console.log(`build-prerender: ${STATIC_ROUTES.length} static + ${posts.length} blog routes`);
