import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

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

test('Work & Projects links to the 58.com web infrastructure case study', () => {
  const html = renderRoute('/work');

  assert.doesNotMatch(html, /CASE STUDIES COMING SOON/);
  assert.match(html, /href="\/work\/58-web-infrastructure"/);
  assert.match(html, /Shared web infrastructure at 58\.com/);
  assert.match(html, /Industry Case Studies/);
});

test('58.com case study explains the shared middleware and Nginx traffic router', () => {
  const html = renderRoute('/work/58-web-infrastructure');

  assert.match(html, /lang="en"/);
  assert.match(html, /Web Infrastructure at 58\.com/);
  assert.match(html, /Shared web framework/);
  assert.match(html, /Traffic routing in Nginx/);
  assert.match(html, /100M\+ daily requests/);
  assert.match(html, /App-facing services/);
  assert.match(html, /Mobile WAP/);
  assert.match(html, /common components/);
  assert.match(html, /OpenResty/);
  assert.match(html, /href="\/zh\/work\/58-web-infrastructure"/);
  assert.match(html, /\/images\/projects\/58\/shared-middleware-architecture\.svg/);
  assert.match(html, /\/images\/projects\/58\/nginx-traffic-router\.svg/);
  assert.equal((html.match(/View full-size diagram/g) || []).length, 2);
  assert.match(html, /href="\/images\/projects\/58\/shared-middleware-architecture\.svg" target="_blank"/);
  assert.match(html, /href="\/images\/projects\/58\/nginx-traffic-router\.svg" target="_blank"/);
  assert.match(html, /aria-label="Profile"/);
});

test('Chinese 58.com route renders a complete localized project page', () => {
  const html = renderRoute('/zh/work/58-web-infrastructure');

  assert.match(html, /lang="zh-CN"/);
  assert.match(html, /58同城的 Web 基础设施/);
  assert.match(html, /共享 Web 框架/);
  assert.match(html, /Nginx 内的流量路由/);
  assert.match(html, /日请求量 1 亿\+/);
  assert.match(html, /href="\/work\/58-web-infrastructure"/);
  assert.match(html, /<a(?=[^>]*class="active")(?=[^>]*aria-current="page")(?=[^>]*href="\/work")[^>]*>/);
  assert.equal((html.match(/查看原图/g) || []).length, 2);
  assert.match(html, /\/images\/projects\/58\/shared-middleware-architecture-zh\.svg/);
  assert.match(html, /\/images\/projects\/58\/nginx-traffic-router-zh\.svg/);
  assert.match(html, /aria-label="Profile"/);
});
