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

test('Home displays the supplied agent-world image with full-size access and statement links', () => {
  const html = renderRoute('/home');
  const figure = html.match(/<figure\b[^>]*id="research-overview"[^>]*>[\s\S]*?<\/figure>/)?.[0] || '';
  const image = figure.match(/<img\b[^>]*>/)?.[0];
  assert.ok(image, 'Home must display the supplied illustration as an image');
  const src = image.match(/src="([^"]+)"/)?.[1];
  assert.ok(src, 'The illustration must have a loadable asset URL');
  const png = readFileSync(new URL(`..${src}`, import.meta.url));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 1672);
  assert.equal(png.readUInt32BE(20), 941);
  assert.match(image, /width="1672" height="941"/);
  assert.match(image, /alt="A world connected by agents:[^"]+"/);
  assert.ok(figure.includes(`href="${src}"`), 'The full-size link must open the displayed asset');
  assert.match(figure, /Open full-size image/);
  assert.doesNotMatch(figure, /<object\b|full-size SVG/);

  for (const target of [
    'i-scalable-oversight-under-adaptation',
    'ii-safety-preserving-learning-and-feedback',
    'iii-control-across-time-and-delegation',
  ]) assert.ok(html.includes(`href="/statement#${target}"`), target);
  assert.doesNotMatch(html, /Industry grounding|Percentages|company endorsement/);
});

test('Home keeps the three Chinese research questions in the caption below the image', () => {
  const html = renderRoute('/home');
  const figure = html.match(/<figure\b[^>]*id="research-overview"[^>]*>[\s\S]*?<\/figure>/)?.[0] || '';
  const caption = figure.match(/<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/)?.[0] || '';
  const questions = [...caption.matchAll(/<li>([\s\S]*?)<\/li>/g)]
    .map(([, item]) => item.replace(/<[^>]+>/g, ''));

  assert.ok(figure.indexOf('<img') < figure.indexOf('<figcaption'), 'The caption must follow the original image');
  assert.deepEqual(questions, [
    '可扩展监督：当前行动有什么可信依据？',
    '安全保持的学习：能力提升后，原有约束是否仍然有效？',
    '跨时间与委派的控制：任务变长、参与者增多后，授权是否仍然有效？',
  ]);
  assert.match(caption, /<ol class="home-research-questions" lang="zh-Hans">/);
  assert.ok(caption.indexOf('</ol>') < caption.indexOf('Open full-size image'), 'The English link stays outside the Chinese language region');
  assert.doesNotMatch(renderRoute('/statement'), /当前行动有什么可信依据|能力提升后|任务变长/);
});

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

test('Statement offers JD sources collapsed by default without adding them to Home', () => {
  const html = renderRoute('/statement');
  const disclosure = html.match(/<details\b[^>]*id="industry-jd-references"[^>]*>[\s\S]*?<\/details>/)?.[0];
  assert.ok(disclosure, 'The percentage figure needs its JD source disclosure');
  assert.match(disclosure, /<summary>References \(JD sources\)<\/summary>/);
  assert.doesNotMatch(disclosure, /^<details[^>]*\sopen(?:[\s=>])/);
  assert.ok(html.indexOf(disclosure) > html.indexOf('</figure>'), 'Sources should follow the figure');
  assert.doesNotMatch(renderRoute('/home'), /industry-jd-references|References \(JD sources\)/);
});

test('the JD reference list preserves all matched records grouped by research direction and company', () => {
  const html = renderRoute('/statement');
  const disclosure = html.match(/<details\b[^>]*id="industry-jd-references"[^>]*>[\s\S]*?<\/details>/)?.[0] || '';
  const ids = [...disclosure.matchAll(/<code>([^<]+)<\/code>/g)].map(match => match[1]);
  assert.equal(ids.length, 89, 'All theme assignments must be inspectable');
  assert.equal(new Set(ids).size, 77, 'Cross-theme matches must not be removed');
  assert.equal((disclosure.match(/<h3\b/g) || []).length, 3);
  const companies = [...disclosure.matchAll(/<p><strong>([^<]+) — (\d+) matched records?<\/strong><\/p>\s*<ul>([\s\S]*?)<\/ul>/g)];
  assert.deepEqual(companies.map(([, name, count]) => [name, Number(count)]), [
    ['OpenAI', 21], ['Anthropic', 23], ['MiniMax', 1], ['Moonshot', 1],
    ['OpenAI', 7], ['Anthropic', 4], ['Moonshot', 1],
    ['OpenAI', 10], ['Anthropic', 10], ['DeepSeek', 2], ['MiniMax', 2], ['Moonshot', 2], ['Zhipu', 5],
  ]);
  for (const [, name, count, list] of companies) {
    assert.equal((list.match(/<li>/g) || []).length, Number(count), name);
  }
  assert.match(disclosure, /12–13 September 2026/);
  assert.match(disclosure, /not a list of currently open positions/);
  assert.match(disclosure, /one assessor/);
  assert.match(disclosure, /broad themes, including enabling technical foundations/);
  assert.match(disclosure, /does not establish direct research on or endorsement of every subproblem/);
  assert.match(disclosure, /Generic capability evaluation alone is excluded/);
  assert.match(disclosure, /Generic SFT\/RL\/post-training alone is excluded/);
  assert.match(disclosure, /without an agent-execution context is excluded/);
  assert.doesNotMatch(disclosure, /<table|<a\b/);
  assert.doesNotMatch(disclosure, /&lt;!--|Research_Overview_JD_Method\.md/);
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
