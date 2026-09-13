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

test('Work & Projects links to the Xiaomi portrait intelligence case study', () => {
  const html = renderRoute('/work');

  assert.match(html, /href="\/work\/xiaomi-portrait-ai"/);
  assert.match(html, /Portrait intelligence at Xiaomi/);
});

test('Xiaomi case study explains both visual pipelines and their deployment constraints', () => {
  const html = renderRoute('/work/xiaomi-portrait-ai');

  assert.match(html, /Portrait intelligence, built for the phone/);
  assert.match(html, /Portrait semantic segmentation/);
  assert.match(html, /Selfie to emoji with GANs/);
  assert.match(html, /\/images\/projects\/xiaomi\/portrait-segmentation-reconstruction\.jpg/);
  assert.match(html, /portrait-segmentation-reconstruction-768\.jpg 768w/);
  assert.match(html, /\/images\/projects\/xiaomi\/selfie-emoji-reconstruction\.jpg/);
  assert.match(html, /selfie-emoji-reconstruction-768\.jpg 768w/);
  assert.match(html, /width="1536" height="1024"/);
  assert.match(html, /loading="lazy"/);
  assert.equal((html.match(/Illustrative reconstruction/g) || []).length, 2);

  for (const deploymentTerm of ['PyTorch', 'CUDA', 'ONNX/IR', 'Hexagon DSP', 'Kirin NPU']) {
    assert.match(html, new RegExp(deploymentTerm));
  }

  assert.match(html, /Historical model size, FPS, and latency measurements were not retained/);
  assert.match(html, /verified deployment logic without asserting Xiaomi’s proprietary topology or losses/);
  assert.match(html, /aria-label="Profile"/);
});
