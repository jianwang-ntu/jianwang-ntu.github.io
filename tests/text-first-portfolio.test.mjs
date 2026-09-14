import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { PUB_META } from '../src/data-pubs.js';

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

function mainContent(html) {
  return html.match(/<main\b[\s\S]*<\/main>/)?.[0] || '';
}

function articleContent(html) {
  return html.match(/<article\b[\s\S]*<\/article>/)?.[0] || '';
}

test('Every page family has one main landmark reachable from the skip link', () => {
  const routes = ['/home', '/statement', '/pubs', '/work', '/cv', '/blog',
    '/blog/example', '/work/58-web-infrastructure', '/zh/work/58-web-infrastructure',
    '/work/xiaomi-portrait-ai', ...Object.values(PUB_META).map(meta => `/pubs/${meta.key}`)];

  for (const route of routes) {
    const html = renderRoute(route);
    assert.equal((html.match(/<main\b/g) || []).length, 1, route);
    assert.match(html, /href="#main-content"/, route);
    assert.match(html, /<main[^>]*id="main-content"[^>]*tabindex="-1"/, route);
    assert.match(html, /<aside[^>]*aria-label="Profile"/, route);
  }
});

test('Publications presents every paper as a concise text entry', () => {
  const html = renderRoute('/pubs');
  const main = mainContent(html);

  assert.match(main, /Publications/);
  assert.match(main, /Provides 248 buggy functions and 102 vulnerable functions/);
  assert.equal((main.match(/>Details<\/a>/g) || []).length, Object.keys(PUB_META).length);
  assert.doesNotMatch(main, /<figure|<img/);
});

test('Work explains the two principal industry projects on its first page', () => {
  const html = renderRoute('/work');
  const main = mainContent(html);

  assert.match(main, /Shared asynchronous Web framework/i);
  assert.match(main, /100M\+ daily requests/);
  assert.match(main, /custom Nginx module/i);
  assert.match(main, /portrait semantic segmentation/i);
  assert.match(main, /selfie-to-emoji generation/i);
  assert.match(main, /Hexagon DSP/);
  assert.match(main, /Kirin NPU/);
  assert.match(main, /href="\/work\/58-web-infrastructure"/);
  assert.match(main, /href="\/zh\/work\/58-web-infrastructure"/);
  assert.match(main, /href="\/work\/xiaomi-portrait-ai"/);
  assert.doesNotMatch(main, /<select|<img|<figure/);
  assert.doesNotMatch(main, /The project rooms|Project index/);
});

test('Work keeps research projects and their evidence reachable', () => {
  const html = renderRoute('/work');

  assert.match(html, /Defects4C/);
  assert.match(html, /Execution-trace reasoning/);
  assert.match(html, /href="\/pubs\/defects4c"/);
  assert.match(html, /href="https:\/\/github\.com\/defects4c\/defects4c"/);
});

test('Publication details keep the figure prominent and the citation collapsed', () => {
  const article = articleContent(renderRoute('/pubs/defects4c'));

  assert.match(article, /<figure/);
  assert.match(article, /Provides 248 buggy functions and 102 vulnerable functions/);
  assert.match(article, /<h2[^>]*>About this paper<\/h2>/);
  assert.equal((article.match(/<h2\b/g) || []).length, 1);
  assert.match(article, /<details[^>]*class="[^"]*pub-citation[^"]*"/);
  assert.match(article, /<summary>Citation<\/summary>/);
  assert.doesNotMatch(article, /<details[^>]*\sopen(?:[\s=>])/);
});

test('Publication details do not invent prose when an abstract is unavailable', () => {
  const article = articleContent(renderRoute('/pubs/trustworthy-ai-assisted-programming'));

  assert.match(article, /A thesis summary tying vulnerability detection/);
  assert.match(article, /<details[^>]*class="[^"]*pub-citation[^"]*"/);
  assert.doesNotMatch(article, /An abstract has not been added|undefined|null/);
});

test('Blog identifies the notes as summaries of other people\'s ideas', () => {
  const index = mainContent(renderRoute('/blog'));
  const post = mainContent(renderRoute('/blog/example'));

  for (const page of [index, post]) {
    assert.match(page, /role="note"/);
    assert.match(page, /External-source reading notes?/);
    assert.match(page, /ideas belong to the cited speakers and authors/i);
    assert.match(page, /not my original work/i);
  }
});
