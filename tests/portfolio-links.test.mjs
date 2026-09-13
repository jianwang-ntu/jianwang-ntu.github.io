import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { WORK_PROJECTS } from '../src/data-work.js';
import { PUB_META } from '../src/data-pubs.js';
import { statementHeadings } from '../src/statement-headings.js';
import { PUBLICATION_CONNECTIONS, STATEMENT_ALIASES, resolveStatementHash } from '../src/research-agenda.js';

const markdown = readFileSync(new URL('../src/content/research-statement.md', import.meta.url), 'utf8');
const fullMarkdown = readFileSync(new URL('../src/content/research-statement-full.md', import.meta.url), 'utf8');
const headings = statementHeadings(markdown);

test('every research project links to an existing publication', () => {
  const keys = Object.values(PUB_META).map(p => p.key);
  for (const p of WORK_PROJECTS.filter(p => p.type === 'research')) assert.ok(keys.includes(p.publication), p.id);
});

test('repeated statement subtitles get distinct, stable anchors', () => {
  const repeated = statementHeadings('## Hypothesis and evidence\n\n## Hypothesis and evidence');
  assert.deepEqual(repeated.map(h => h.id), ['hypothesis-and-evidence', 'hypothesis-and-evidence-2']);
  assert.equal(new Set(headings.map(h => h.id)).size, headings.length);
});

test('all statement overview and prose jump links have targets', () => {
  const source = readFileSync(new URL('../src/pages/Statement.jsx', import.meta.url), 'utf8');
  const overview = readFileSync(new URL('../src/components/ResearchOverview.jsx', import.meta.url), 'utf8');
  const targets = new Set([...headings.map(h => h.id), ...[...(source + overview).matchAll(/id="([^"]+)"/g)].map(m => m[1])]);
  for (const [, id] of source.matchAll(/href="#([^"]+)"/g)) assert.ok(targets.has(id), id);
});

test('publication connections lead from existing papers to focused statement sections', () => {
  const keys = Object.values(PUB_META).map(p => p.key);
  for (const [key, connection] of Object.entries(PUBLICATION_CONNECTIONS)) {
    assert.ok(keys.includes(key), key);
    assert.ok(headings.some(h => h.id === connection.section), connection.section);
    assert.ok(connection.boundary, `Evidence boundary for ${key}`);
  }
});

test('site links and legacy bookmarks never target hidden appendix sections', () => {
  const appendixStart = fullMarkdown.indexOf('\n## Appendix A:');
  const referencesStart = fullMarkdown.indexOf('\n## References', appendixStart);
  assert.ok(appendixStart > 0 && referencesStart > appendixStart);
  const hiddenIds = new Set(statementHeadings(fullMarkdown.slice(appendixStart, referencesStart)).map(h => h.id));
  const home = readFileSync(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8');

  for (const connection of Object.values(PUBLICATION_CONNECTIONS)) {
    assert.equal(hiddenIds.has(connection.section), false, connection.section);
  }
  for (const [oldId, target] of Object.entries(STATEMENT_ALIASES)) {
    assert.equal(hiddenIds.has(target), false, `${oldId} -> ${target}`);
  }
  for (const [, target] of home.matchAll(/to="\/statement#([^"]+)"/g)) {
    assert.equal(hiddenIds.has(target), false, target);
  }
});

test('old statement bookmarks resolve to the sections that absorb their topics', () => {
  const targets = new Set([...headings.map(h => h.id), 'research-overview']);
  for (const [oldId, target] of Object.entries(STATEMENT_ALIASES)) {
    assert.equal(resolveStatementHash(`#${oldId}`), target);
    assert.ok(targets.has(target), `${oldId} -> ${target}`);
    assert.equal(resolveStatementHash(`#${target}`), null, 'redirects must terminate');
  }
  assert.equal(resolveStatementHash('#unknown-section'), null);
  assert.equal(resolveStatementHash('#constructor'), null);
});

test('homepage research interests point to real statement sections', () => {
  const home = readFileSync(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8');
  const statement = readFileSync(new URL('../src/pages/Statement.jsx', import.meta.url), 'utf8');
  const targets = new Set([...headings.map(h => h.id), ...[...statement.matchAll(/id="([^"]+)"/g)].map(m => m[1])]);
  for (const [, id] of home.matchAll(/to="\/statement#([^"]+)"/g)) assert.ok(targets.has(id), id);
});

test('bookmarks for shortened statement subsections reach their retained research area', () => {
  const groups = [
    ['i-scalable-oversight-under-adaptation', [
      'direction-1-learn-which-evidence-changes-the-decision',
      'direction-2-preserve-oversight-signals-under-optimization',
      'contribution-and-decisive-evidence',
    ]],
    ['ii-safety-preserving-learning-and-feedback', [
      'direction-1-train-on-consequential-decision-differences',
      'direction-2-select-feedback-repairs-by-their-learning-effects',
      'contribution-and-decisive-evidence-2',
    ]],
    ['iii-control-across-time-and-delegation', [
      'direction-1-carry-constraints-through-task-decomposition',
      'direction-2-revise-control-when-its-assumptions-change',
      'contribution-and-decisive-evidence-3',
      'long-term-direction-ai-assisted-research-that-can-improve-safely',
    ]],
  ];
  for (const [target, bookmarks] of groups) {
    for (const bookmark of bookmarks) assert.equal(resolveStatementHash(`#${bookmark}`), target);
    assert.ok(headings.some(heading => heading.id === target));
  }
});

test('statement PDF download exists and is a PDF', () => {
  const file = new URL('../public/data/Jian_Wang_Research_Statement_2026.pdf', import.meta.url);
  assert.ok(existsSync(file));
  assert.equal(readFileSync(file).subarray(0,5).toString(), '%PDF-');
});
