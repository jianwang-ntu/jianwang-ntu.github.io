import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { WORK_PROJECTS } from '../src/data-work.js';
import { PUB_META } from '../src/data-pubs.js';
import { statementHeadings } from '../src/statement-headings.js';

const markdown = readFileSync(new URL('../src/content/research-statement.md', import.meta.url), 'utf8');
const headings = statementHeadings(markdown);

test('every research project links to an existing publication', () => {
  const keys = Object.values(PUB_META).map(p => p.key);
  for (const p of WORK_PROJECTS.filter(p => p.type === 'research')) assert.ok(keys.includes(p.publication), p.id);
});

test('repeated statement subtitles get distinct, stable anchors', () => {
  const repeated = headings.filter(h => h.title === 'Hypothesis and evidence');
  assert.deepEqual(repeated.map(h => h.id), ['hypothesis-and-evidence', 'hypothesis-and-evidence-2']);
  assert.equal(new Set(headings.map(h => h.id)).size, headings.length);
});

test('all statement overview and prose jump links have targets', () => {
  const source = readFileSync(new URL('../src/pages/Statement.jsx', import.meta.url), 'utf8');
  const targets = new Set([...headings.map(h => h.id), ...[...source.matchAll(/id="([^"]+)"/g)].map(m => m[1])]);
  for (const [, id] of source.matchAll(/href="#([^"]+)"/g)) assert.ok(targets.has(id), id);
});

test('homepage research interests point to real statement sections', () => {
  const home = readFileSync(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8');
  const statement = readFileSync(new URL('../src/pages/Statement.jsx', import.meta.url), 'utf8');
  const targets = new Set([...headings.map(h => h.id), ...[...statement.matchAll(/id="([^"]+)"/g)].map(m => m[1])]);
  for (const [, id] of home.matchAll(/to="\/statement#([^"]+)"/g)) assert.ok(targets.has(id), id);
});

test('statement PDF download exists and is a PDF', () => {
  const file = new URL('../public/data/Jian_Wang_Research_Statement_202609.pdf', import.meta.url);
  assert.ok(existsSync(file));
  assert.equal(readFileSync(file).subarray(0,5).toString(), '%PDF-');
});
