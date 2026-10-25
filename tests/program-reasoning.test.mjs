import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { PUB_META } from '../src/data-pubs.js';

const file = path => new URL(`../${path}`, import.meta.url);

let vite;
let App;
let MemoryRouter;
let ALL_PUBS;
let consoleError;

test.before(async () => {
  consoleError = console.error;
  console.error = (...args) => {
    if (String(args[0]).startsWith('Warning: useLayoutEffect does nothing on the server')) return;
    consoleError(...args);
  };
  vite = await createServer({
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false, port: 0, strictPort: false },
  });
  ({ default: App } = await vite.ssrLoadModule('/src/App.jsx'));
  ({ ALL_PUBS } = await vite.ssrLoadModule('/src/data.jsx'));
  ({ MemoryRouter } = await import('react-router-dom'));
});

test.after(async () => {
  await vite.close();
  console.error = consoleError;
});

function renderRoute(route) {
  return renderToStaticMarkup(
    React.createElement(
      MemoryRouter,
      { initialEntries: [route] },
      React.createElement(App),
    ),
  );
}

function mainContent(html) {
  return html.match(/<main\b[\s\S]*<\/main>/)?.[0] || '';
}

test('the primary agenda resolves every homepage direction and retains access to the multi-agent statement', () => {
  const home = mainContent(renderRoute('/home'));
  const primary = mainContent(renderRoute('/statement'));
  const multiAgent = mainContent(renderRoute('/statement_multi_agent'));
  assert.ok(primary, '/statement must render its own main content');
  const directionTargets = new Set([...home.matchAll(/href="\/statement#([^"]+)"/g)].map(match => match[1]));
  assert.equal(directionTargets.size, 3);
  for (const target of directionTargets) assert.ok(primary.includes(`id="${target}"`), target);
  assert.match(primary, /href="\/statement_multi_agent"/);
  assert.match(primary, /href="\/research_coding_statement"/);
  assert.match(primary, /<details[^>]*id="references"[^>]*><summary>References<\/summary>/);
  assert.match(multiAgent, /statement-diagram-link/);
});

test('PDF-derived research diagrams offer vector previews, matching PDF pages and overview navigation', () => {
  const home = mainContent(renderRoute('/home'));
  const primary = mainContent(renderRoute('/statement'));
  for (const html of [home, primary]) {
    const overview = html.match(/<figure\b[^>]*aria-label="Formal reasoning research overview"[^>]*>[\s\S]*?<\/figure>/)?.[0];
    assert.ok(overview, 'the current research overview is missing');
    for (const target of ['learning-reusable-proof-strategies', 'compositional-verification', 'trustworthy-verification-feedback']) {
      assert.ok(overview.includes(`href="/statement#${target}"`), target);
    }
  }
  for (const [index, name] of ['overview', 'learning-proof-strategies', 'compositional-verification', 'trustworthy-feedback'].entries()) {
    const path = `/figures/formal-reasoning/${name}.png`;
    assert.ok(primary.includes(`href="${path}?v=`), path);
    assert.deepEqual([...readFileSync(file(`public${path}`)).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.ok(existsSync(file(`public/figures/formal-reasoning/${name}.webp`)));
    assert.ok(primary.includes(`src="/figures/formal-reasoning/${name}.svg?`));
    assert.match(primary, new RegExp(`href="/data/formal-reasoning-diagrams/formal-reasoning-diagrams\\.pdf\\?v=[^"#]+#page=${index + 1}"`));
    const svg = readFileSync(file(`public/figures/formal-reasoning/${name}.svg`), 'utf8');
    assert.match(svg, /<svg\b/);
    assert.doesNotMatch(svg, /<(?:image|script)\b/);
  }
  const diagrams = [...primary.matchAll(/<figure\b[^>]*class="[^"]*formal-research-figure[^"]*"[\s\S]*?<\/figure>/g)].map(match => match[0]);
  assert.equal(diagrams.length, 4);
  for (const diagram of diagrams) {
    assert.ok(diagram.includes('Proposed '), 'each diagram must distinguish proposed work from source results');
    for (const source of ['https://www.anthropic.com/research/formal-verification', 'https://theorem.dev/blog/verified-software-stack/']) {
      assert.ok(diagram.includes(`href="${source}"`), `missing diagram context link: ${source}`);
    }
  }
  assert.ok(existsSync(file('public/data/formal-reasoning-diagrams.zip')));
  const manifest = JSON.parse(readFileSync(file('public/figures/formal-reasoning/exports.json'), 'utf8'));
  const pdf = readFileSync(file(`public${manifest.source_pdf}`));
  assert.equal(createHash('sha256').update(pdf).digest('hex'), manifest.source_pdf_sha256);
});

test('Loop-R1 is indexed as a public preprint with paper and OpenReview links', () => {
  const meta = PUB_META.C7;
  assert.ok(meta, 'Loop-R1 metadata is missing');
  assert.equal(meta.key, 'loop-r1');
  assert.deepEqual(meta.authors, ['Wang J. J.', 'Quan L.', 'Hu Q.', 'Cheng M.', 'Li Y.', 'Xie X.']);

  const publication = ALL_PUBS.find(item => item.id === 'C7');
  assert.ok(publication, 'Loop-R1 publication entry is missing');
  assert.equal(publication.venue, 'Preprint');
  assert.deepEqual(publication.badges, [
    { label: 'paper', href: '/data/Loop-R1-preprint.pdf' },
    { label: 'openreview', href: 'https://openreview.net/forum?id=M7n2yGFYza#discussion' },
  ]);

  const index = mainContent(renderRoute('/pubs'));
  assert.match(index, /Loop-R1: Learning Semantic Reasoning/);
  assert.match(index, /href="\/pubs\/loop-r1"/);
  assert.doesNotMatch(index, /Loop-R1[\s\S]{0,500}(?:Accepted|NeurIPS 2026)/i);
});

test('Loop-R1 detail presents the original framework, measured evidence and limits', () => {
  const main = mainContent(renderRoute('/pubs/loop-r1'));

  assert.match(main, /src="\/figures\/loop-r1-overview\.svg"/);
  assert.match(main, /Problem/);
  assert.match(main, /Method/);
  assert.match(main, /Evidence/);
  assert.match(main, /Limitations/);
  assert.match(main, /19\.39%/);
  assert.match(main, /61\.25%/);
  assert.match(main, /37\.5%/);
  assert.match(main, /77\.8%/);
  assert.match(main, /InvBench/);
  assert.match(main, /href="\/data\/Loop-R1-preprint\.pdf"/);
  assert.match(main, /href="https:\/\/openreview\.net\/forum\?id=M7n2yGFYza#discussion"/);
  assert.doesNotMatch(main, /Accepted at NeurIPS|NeurIPS 2026/);
});

test('the program-reasoning statement is reachable from the primary statement', () => {
  const primary = mainContent(renderRoute('/statement_multi_agent'));
  const coding = mainContent(renderRoute('/research_coding_statement'));

  assert.match(primary, /href="\/research_coding_statement"/);
  assert.match(coding, /Learning and Formal Reasoning for Program Understanding, Verification, and Synthesis/);
  assert.match(coding, /src="\/figures\/program-reasoning-overview\.svg"/);
  assert.match(coding, /Research overview: learned models propose; formal tools check; evaluation tests generalisation\./);
  assert.doesNotMatch(coding, /aria-label="Open the program reasoning overview at full size"/);
  assert.match(coding, /href="\/data\/Jian_Wang_Program_Reasoning_Statement_2026\.pdf"/);
  assert.match(coding, /href="\/pubs\/loop-r1"/);
  assert.match(coding, /href="\/pubs\/defects4c"/);
  assert.match(coding, /href="\/pubs\/code-semantics-execution-traces"/);
  assert.match(coding, /href="\/pubs\/ratchet"/);
  assert.doesNotMatch(coding, /<table\b|Appendix/);
  assert.doesNotMatch(coding, /pagebreak/);
});

test('the targeted statement is concise and organised around four questions', () => {
  const source = readFileSync(file('src/content/program-reasoning-statement.md'), 'utf8');
  const headings = [...source.matchAll(/^## (.+)$/gm)].map(match => match[1]);
  assert.deepEqual(headings, [
    'Research problem',
    'Proposed research',
    'Evidence from prior work',
    'Fit and contribution',
  ]);

  const words = source
    .replace(/<!--.*?-->/gs, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_]/g, ' ')
    .match(/[\p{L}\p{N}][\p{L}\p{N}\-./]*/gu) || [];
  assert.ok(words.length >= 600, `statement is too thin: ${words.length} words`);
  assert.ok(words.length <= 1100, `statement is too long: ${words.length} words`);
});

test('the program-reasoning overview is a compact accessible SVG', () => {
  const svg = readFileSync(file('public/figures/program-reasoning-overview.svg'), 'utf8');
  assert.match(svg, /^<svg\b/);
  assert.match(svg, /role="img"/);
  assert.match(svg, /<title id="title">Program reasoning research overview<\/title>/);
  assert.match(svg, /<desc id="desc">[^<]+<\/desc>/);
  assert.match(svg, /Program reasoning problems/);
  assert.match(svg, /Learning \+ formal feedback/);
  assert.match(svg, /Research outputs/);
});

test('the public preprint names the authors and removes review-only markings', () => {
  const pdf = file('public/data/Loop-R1-preprint.pdf');
  assert.ok(existsSync(pdf), 'public preprint PDF is missing');
  assert.equal(readFileSync(pdf).subarray(0, 5).toString(), '%PDF-');

  const extracted = spawnSync('pdftotext', [pdf.pathname, '-'], { encoding: 'utf8' });
  assert.equal(extracted.status, 0, extracted.stderr);
  for (const author of ['Jian Jornbowl Wang', 'Lili Quan', 'Qiang Hu', 'Mingfei Cheng', 'Yi Li', 'Xiaofei Xie']) {
    assert.match(extracted.stdout, new RegExp(author), author);
  }
  assert.doesNotMatch(
    extracted.stdout,
    /Anonymous Author|anonymous\.4open\.science|Do not distribute|Confidential reviewer copy|Submitted to .*NeurIPS|NeurIPS Paper Checklist|visible to the reviewers|Delete this instruction block|desk rejected|we publicly release|In your output you MUST Include|Overall, I find this submission/i,
  );
});

test('the downloadable program-reasoning statement is exactly two pages', () => {
  const pdf = file('public/data/Jian_Wang_Program_Reasoning_Statement_2026.pdf');
  assert.ok(existsSync(pdf), 'program-reasoning statement PDF is missing');
  assert.equal(readFileSync(pdf).subarray(0, 5).toString(), '%PDF-');

  const info = spawnSync('pdfinfo', [pdf.pathname], { encoding: 'utf8' });
  assert.equal(info.status, 0, info.stderr);
  assert.match(info.stdout, /^Pages:\s+2$/m);

  const extracted = spawnSync('pdftotext', [pdf.pathname, '-'], { encoding: 'utf8' });
  assert.equal(extracted.status, 0, extracted.stderr);
  assert.match(extracted.stdout, /Learning and Formal Reasoning for Program\s+Understanding, Verification, and Synthesis/);
  assert.match(extracted.stdout, /Verifiers, tests, and analyses check/);
  assert.match(extracted.stdout, /Loop-R1/);
});
