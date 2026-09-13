import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { statementHeadings } from '../src/statement-headings.js';

const file = path => new URL(`../${path}`, import.meta.url);
const text = path => readFileSync(file(path), 'utf8');

test('the former statement is archived without a public entry point', () => {
  const archive = 'archive/research-statement/trustworthy-agent-networks-2026';
  for (const name of [
    'research-statement.md',
    'research-statement-full.md',
    'ResearchOverview.jsx',
    'ResearchPath.jsx',
    'trustworthy_agent_networks.svg',
    'Jian_Wang_Research_Statement_202609.pdf',
  ]) assert.ok(existsSync(file(`${archive}/${name}`)), name);

  assert.equal(existsSync(file('public/data/Jian_Wang_Research_Statement_202609.pdf')), false);
  assert.equal(existsSync(file('src/components/ResearchPath.jsx')), false);
  assert.equal(existsSync(file('src/assets/trustworthy_agent_networks.svg')), false);
  const publicSurfaces = [
    'src/App.jsx',
    'src/components/Nav.jsx',
    'src/pages/Statement.jsx',
    'tools/build-sitemap.mjs',
    'tools/build-prerender.mjs',
  ].map(text).join('\n');
  assert.doesNotMatch(publicSurfaces, /statement\/archive|trustworthy-agent-networks-2026/i);
});

test('the supplied reliable-autonomy source and overview are installed', () => {
  const full = text('src/content/research-statement-full.md');
  const web = text('src/content/research-statement.md');
  assert.match(full, /^# Reliable Autonomy for Adaptive AI Agents$/m);
  assert.match(full, /Jian Wang \| 13 September 2026/);
  assert.match(web, /^## I\. Scalable oversight under adaptation$/m);
  assert.match(web, /^## II\. Safety-preserving learning and feedback$/m);
  assert.match(web, /^## III\. Control across time and delegation$/m);
  assert.doesNotMatch(web, /```mermaid|^# Reliable Autonomy/m);
  assert.doesNotMatch(web, /<br>/);

  const png = readFileSync(file('public/images/research/reliable-autonomy-overview.png'));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});

test('the statement page exposes the three-part agenda without a crowded index', () => {
  const page = text('src/pages/Statement.jsx');
  const overview = text('src/components/ResearchOverview.jsx');
  const home = text('src/pages/Home.jsx');
  const headings = statementHeadings(text('src/content/research-statement.md'));
  const sections = headings.filter(heading => heading.level === 2).map(heading => heading.id);
  const agenda = [
    'i-scalable-oversight-under-adaptation',
    'ii-safety-preserving-learning-and-feedback',
    'iii-control-across-time-and-delegation',
  ];

  for (const id of agenda) {
    assert.ok(sections.includes(id), id);
    assert.match(home, new RegExp(`/statement#${id}`));
  }
  assert.match(page, /headings\.filter\(heading => heading\.level === 2\)/);
  assert.match(page, /Jian_Wang_Research_Statement_2026\.pdf/);
  assert.doesNotMatch(page, /ResearchPath|Previous version|archive/i);

  const regions = [...overview.matchAll(/id: '([^']+)'/g)].map(match => match[1]);
  assert.deepEqual(regions, agenda);
  assert.match(overview, /reliable-autonomy-overview\.png/);
});

test('the PDF builder validates the reliable-autonomy source without authoring dependencies', () => {
  const result = spawnSync('python3', ['tools/build-research-statement.py', '--check'], {
    cwd: file('.'),
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Reliable Autonomy for Adaptive AI Agents/);
  assert.match(result.stdout, /3 overview links/);
});

test('the current downloadable statement is the newly generated PDF', () => {
  const pdf = file('public/data/Jian_Wang_Research_Statement_2026.pdf');
  assert.ok(existsSync(pdf));
  assert.equal(readFileSync(pdf).subarray(0, 5).toString(), '%PDF-');
  assert.equal(existsSync(file('public/data/Jian_Wang_Research_Statement_202609.pdf')), false);
});
