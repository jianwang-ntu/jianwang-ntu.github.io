#!/usr/bin/env node
/**
 * Generate public/sitemap.xml from public/blog/posts.json + the static routes.
 *
 * Run before `vite build` so the sitemap ends up in dist/. The deploy workflow
 * also calls this; running it locally before a manual build is safe (idempotent).
 *
 * Canonical site URL is taken from the SITE_URL env var, defaulting to
 * https://www.wj2ai.com (the user's custom domain). Both deploy targets
 * (github.io and wj2ai.com) serve identical content; the sitemap and the
 * <link rel="canonical"> tags both point at SITE_URL so Google attributes
 * everything to one origin.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = (process.env.SITE_URL || 'https://www.wj2ai.com').replace(/\/$/, '');
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const postsJsonPath = resolve(repoRoot, 'public/blog/posts.json');
const sitemapPath = resolve(repoRoot, 'public/sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

// Static routes from src/App.jsx. Update both places when you add a top-level
// page. `/` redirects to `/home` so we don't list it separately.
const STATIC_ROUTES = [
  { path: '/home', changefreq: 'monthly', priority: '1.0' },
  { path: '/pubs', changefreq: 'monthly', priority: '0.9' },
  { path: '/work', changefreq: 'monthly', priority: '0.8' },
  { path: '/cv',   changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly',  priority: '0.9' },
];

let posts = [];
try {
  posts = JSON.parse(readFileSync(postsJsonPath, 'utf-8'));
} catch (e) {
  console.warn(`build-sitemap: could not read ${postsJsonPath} (${e.message}); writing static-only sitemap.`);
}

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const urls = [];
for (const r of STATIC_ROUTES) {
  urls.push({ loc: `${SITE_URL}${r.path}`, lastmod: today, changefreq: r.changefreq, priority: r.priority });
}
for (const p of posts) {
  if (!p?.slug) continue;
  urls.push({
    loc: `${SITE_URL}/blog/${p.slug}`,
    lastmod: p.date || today,
    changefreq: 'yearly',  // a published blog post rarely changes
    priority: '0.8',
  });
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls.map((u) => [
    '  <url>',
    `    <loc>${escape(u.loc)}</loc>`,
    `    <lastmod>${u.lastmod}</lastmod>`,
    `    <changefreq>${u.changefreq}</changefreq>`,
    `    <priority>${u.priority}</priority>`,
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n');

writeFileSync(sitemapPath, xml, 'utf-8');
console.log(`build-sitemap: wrote ${sitemapPath} with ${urls.length} URLs (SITE_URL=${SITE_URL})`);
