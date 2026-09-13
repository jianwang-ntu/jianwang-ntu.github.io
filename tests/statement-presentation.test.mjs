import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const svgFile = new URL('../src/assets/reliable-autonomy-overview.svg', import.meta.url);

let vite;
let App;
let MemoryRouter;
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

test('the overview is a vector SVG whose nine research blocks are links', () => {
  assert.ok(existsSync(svgFile), 'vector overview SVG is missing');
  const svg = readFileSync(svgFile, 'utf8');
  const linkedBlocks = [...svg.matchAll(/<a\b[^>]*href="\/statement#([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  const expectedTargets = [
    'i-scalable-oversight-under-adaptation',
    'ii-safety-preserving-learning-and-feedback',
    'iii-control-across-time-and-delegation',
  ];

  assert.match(svg, /^<svg\b/);
  assert.doesNotMatch(svg, /<image\b/i);
  assert.equal(linkedBlocks.length, 9);
  for (const [, , block] of linkedBlocks) assert.match(block, /<rect\b/);
  for (const target of expectedTargets) {
    assert.equal(linkedBlocks.filter(([, href]) => href === target).length, 3, target);
  }

  const html = renderRoute('/statement');
  assert.match(html, /<object\b[^>]*type="image\/svg\+xml"/);
  assert.match(html, /reliable-autonomy-overview\.svg/);
  assert.doesNotMatch(html, /reliable-autonomy-overview\.png/);
});

test('the top connectors stay below the research-area headings', () => {
  const svg = readFileSync(svgFile, 'utf8');
  const connectorPaths = [...svg.matchAll(/<path class="connector" d="([^"]+)"/g)];

  assert.ok(connectorPaths.length >= 2, 'expected the two top connector paths');
  for (const [, path] of connectorPaths.slice(0, 2)) {
    const coordinates = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) || [];
    const yCoordinates = coordinates.filter((_, index) => index % 2 === 1);
    assert.ok(
      Math.min(...yCoordinates) >= 340,
      `top connector enters the heading band: ${path}`,
    );
  }
});

test('the long learning heading breaks before the adjacent icon', () => {
  const svg = readFileSync(svgFile, 'utf8');
  assert.match(
    svg,
    /<text class="area area-long" x="910" y="238"><tspan x="910">II\. Safety-Preserving<\/tspan><tspan x="910" dy="36">Learning<\/tspan><\/text>/,
  );
});

test('the overview reports company-level JD signals with their evidence boundary', () => {
  const svg = readFileSync(svgFile, 'utf8');
  const expected = {
    'industry-oversight': [
      ['OpenAI', '11.2%'], ['Anthropic', '7.0%'], ['DeepSeek', '0.0%'],
      ['MiniMax', '1.3%'], ['Moonshot', '1.9%'], ['Zhipu', '0.0%'],
    ],
    'industry-learning': [
      ['OpenAI', '3.7%'], ['Anthropic', '1.2%'], ['DeepSeek', '0.0%'],
      ['MiniMax', '0.0%'], ['Moonshot', '1.9%'], ['Zhipu', '0.0%'],
    ],
    'industry-control': [
      ['OpenAI', '5.3%'], ['Anthropic', '3.0%'], ['DeepSeek', '8.7%'],
      ['MiniMax', '2.7%'], ['Moonshot', '3.8%'], ['Zhipu', '3.1%'],
    ],
  };

  assert.match(svg, />Industry Signals in the Collected JD Sample</);
  assert.match(svg, />829 deduplicated JDs</);
  assert.match(svg, />Theme matches ÷ each company’s collected JDs</);
  assert.match(svg, />Sample proxy, not company endorsement or investment</);

  for (const [id, rows] of Object.entries(expected)) {
    const start = svg.indexOf(`id="${id}"`);
    const end = svg.indexOf('</g>', start);
    assert.ok(start >= 0 && end > start, id);
    const card = svg.slice(start, end);
    for (const [company, percentage] of rows) {
      assert.match(card, new RegExp(`>${company}<[\\s\\S]{0,220}>${percentage.replace('.', '\\.') }<`));
    }
  }

  const html = renderRoute('/statement');
  assert.match(html, /Industry grounding: 829 deduplicated JDs/);
  assert.match(html, /not company endorsement/i);
});

test('the public statement omits appendices while retaining the core agenda and references', () => {
  const html = renderRoute('/statement');
  const linkedPages = `${renderRoute('/home')}\n${renderRoute('/pubs/defects4c')}`;
  const article = html.match(/<article\b[\s\S]*<\/article>/)?.[0] || '';

  assert.match(article, /I\. Scalable oversight under adaptation/);
  assert.match(article, /II\. Safety-preserving learning and feedback/);
  assert.match(article, /III\. Control across time and delegation/);
  assert.match(article, /References/);
  assert.doesNotMatch(article, /Appendix A|Appendix B|The eight JD JSONL files|\[J\d|appendic/i);
  assert.doesNotMatch(html, /href="[^"]*#appendix-/);
  assert.doesNotMatch(linkedPages, /href="[^"]*#(?:appendix-|how-my-existing-methods-carry-forward)/);
  assert.equal((article.match(/<h2\b/g) || []).length, 4);
});
