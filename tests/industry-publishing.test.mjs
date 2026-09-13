import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('production build publishes both industry case studies and their visual assets', () => {
  execFileSync('npm', ['run', 'build'], {
    cwd: repoRoot,
    stdio: 'pipe',
  });

  const sitemap = readFileSync(resolve(repoRoot, 'dist/sitemap.xml'), 'utf8');
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
