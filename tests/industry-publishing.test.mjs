import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PUB_META } from '../src/data-pubs.js';
import { BLOG_ALIASES } from '../src/blog-aliases.js';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('production build publishes both industry case studies and their visual assets', () => {
  execFileSync('npm', ['run', 'build'], {
    cwd: repoRoot,
    stdio: 'pipe',
  });

  const sitemap = readFileSync(resolve(repoRoot, 'dist/sitemap.xml'), 'utf8');
  for (const meta of Object.values(PUB_META)) {
    const html = readFileSync(resolve(repoRoot, `dist/pubs/${meta.key}/index.html`), 'utf8');
    assert.ok(sitemap.includes(`<loc>https://www.wj2ai.com/pubs/${meta.key}</loc>`), meta.key);
    assert.doesNotMatch(html, /<title>Publication —/);
    assert.ok(html.includes(meta.brief.replaceAll('&', '&amp;').replaceAll('"', '&quot;')), meta.key);
  }
  for (const [source, target] of Object.entries(BLOG_ALIASES)) {
    const html = readFileSync(resolve(repoRoot, `dist/blog/${source}/index.html`), 'utf8');
    assert.ok(html.includes(`rel="canonical" href="https://www.wj2ai.com/blog/${target}"`));
    assert.ok(!sitemap.includes(`/blog/${source}</loc>`));
    assert.equal(existsSync(resolve(repoRoot, `dist/blog/${source}/meta.json`)), false);
  }
  for (const name of readdirSync(resolve(repoRoot, 'archive/legacy-downloads'))) {
    assert.equal(existsSync(resolve(repoRoot, `dist/data/${name}`)), false, name);
  }
  assert.equal(existsSync(resolve(repoRoot, 'dist/archive')), false);
  const posts = JSON.parse(readFileSync(resolve(repoRoot, 'public/blog/posts.json'), 'utf8'));
  for (const post of posts) {
    const html = readFileSync(resolve(repoRoot, `dist/blog/${post.slug}/index.html`), 'utf8');
    assert.equal((html.match(/<script type="application\/ld\+json" data-seo="page">/g) || []).length, 1, post.slug);
  }
  const fiftyEightHtml = readFileSync(
    resolve(repoRoot, 'dist/work/58-web-infrastructure/index.html'),
    'utf8',
  );
  const fiftyEightZhHtml = readFileSync(
    resolve(repoRoot, 'dist/zh/work/58-web-infrastructure/index.html'),
    'utf8',
  );
  const xiaomiHtml = readFileSync(
    resolve(repoRoot, 'dist/work/xiaomi-portrait-ai/index.html'),
    'utf8',
  );

  assert.match(fiftyEightHtml, /<html lang="en"/);
  assert.match(fiftyEightHtml, /<title>Web Infrastructure at 58\.com — Jian Wang<\/title>/);
  assert.match(fiftyEightHtml, /<link rel="canonical" href="https:\/\/www\.wj2ai\.com\/work\/58-web-infrastructure" \/>/);
  assert.match(
    fiftyEightHtml,
    /<meta property="og:image" content="https:\/\/www\.wj2ai\.com\/images\/projects\/58\/shared-web-infrastructure\.png" \/>/,
  );
  assert.equal(
    sitemap.split('<loc>https://www.wj2ai.com/work/58-web-infrastructure</loc>').length - 1,
    1,
  );

  assert.match(fiftyEightZhHtml, /<html lang="zh-CN"/);
  assert.match(fiftyEightZhHtml, /<title>58同城的 Web 基础设施 — Jian Wang<\/title>/);
  assert.match(fiftyEightZhHtml, /<link rel="canonical" href="https:\/\/www\.wj2ai\.com\/zh\/work\/58-web-infrastructure" \/>/);
  assert.equal(
    sitemap.split('<loc>https://www.wj2ai.com/zh/work/58-web-infrastructure</loc>').length - 1,
    1,
  );

  const fiftyEightImageDir = resolve(repoRoot, 'dist/images/projects/58');
  for (const filename of [
    'shared-middleware-architecture.svg',
    'shared-middleware-architecture-zh.svg',
    'nginx-traffic-router.svg',
    'nginx-traffic-router-zh.svg',
  ]) {
    const imagePath = resolve(fiftyEightImageDir, filename);
    assert.equal(existsSync(imagePath), true, `${filename} should be published`);
    assert.ok(statSync(imagePath).size < 100_000, `${filename} should stay below 100 KB`);
  }
  const socialImage = resolve(fiftyEightImageDir, 'shared-web-infrastructure.png');
  assert.equal(existsSync(socialImage), true, '58.com social image should be published');
  assert.ok(statSync(socialImage).size < 500_000, '58.com social image should stay below 500 KB');

  assert.match(xiaomiHtml, /<title>Portrait Intelligence at Xiaomi — Jian Wang<\/title>/);
  assert.match(xiaomiHtml, /<link rel="canonical" href="https:\/\/www\.wj2ai\.com\/work\/xiaomi-portrait-ai" \/>/);
  assert.match(
    xiaomiHtml,
    /<meta property="og:image" content="https:\/\/www\.wj2ai\.com\/images\/projects\/xiaomi\/portrait-segmentation-reconstruction\.jpg" \/>/,
  );
  assert.equal(
    sitemap.split('<loc>https://www.wj2ai.com/work/xiaomi-portrait-ai</loc>').length - 1,
    1,
  );

  const xiaomiImageDir = resolve(repoRoot, 'dist/images/projects/xiaomi');
  const imageBudgets = [
    ['portrait-segmentation-architecture.svg', 120_000],
    ['selfie-emoji-architecture.svg', 120_000],
    ['mobile-deployment-architecture.svg', 120_000],
    ['portrait-segmentation-reconstruction.jpg', 600_000],
    ['portrait-segmentation-reconstruction-768.jpg', 160_000],
    ['selfie-emoji-reconstruction.jpg', 600_000],
    ['selfie-emoji-reconstruction-768.jpg', 160_000],
  ];
  for (const [filename, maxBytes] of imageBudgets) {
    const imagePath = resolve(xiaomiImageDir, filename);
    assert.equal(existsSync(imagePath), true, `${filename} should be published`);
    assert.ok(statSync(imagePath).size < maxBytes, `${filename} should stay below ${maxBytes} bytes`);
  }
  assert.equal(existsSync(resolve(xiaomiImageDir, 'portrait-segmentation-reconstruction.png')), false);
  assert.equal(existsSync(resolve(xiaomiImageDir, 'selfie-emoji-reconstruction.png')), false);
});
