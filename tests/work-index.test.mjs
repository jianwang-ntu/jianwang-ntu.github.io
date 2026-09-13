import test from 'node:test';
import assert from 'node:assert/strict';
import { WORK_PROJECTS, ROOMS, filterProjects, projectYears } from '../src/data-work.js';

test('industry work can be browsed without paper artifacts', () => {
  const found = filterProjects({ type: 'industry' });
  assert.ok(found.some(p => p.id === '58-web'));
  assert.ok(found.some(p => p.id === 'xiaomi-emoji'));
  assert.ok(found.every(p => p.type === 'industry' && !p.publication));
});

test('year filters include the full duration of industry projects', () => {
  assert.ok(filterProjects({ year: '2014' }).some(p => p.id === '58-web'));
  assert.ok(!filterProjects({ year: '2025' }).some(p => p.id === '58-web'));
});

test('year, skill and type filters intersect', () => {
  assert.deepEqual(filterProjects({ year: '2025', skill: 'C/C++', type: 'research' }).map(p => p.id), ['defects4c']);
  assert.deepEqual(filterProjects({ year: '2025', skill: 'GANs' }), []);
});

test('every project has a unique deep link, room and evidenced skills', () => {
  assert.equal(new Set(WORK_PROJECTS.map(p => p.id)).size, WORK_PROJECTS.length);
  for (const p of WORK_PROJECTS) {
    assert.ok(ROOMS.some(r => r.id === p.room));
    assert.ok(p.skills.length > 0);
    assert.ok(p.startYear <= p.endYear);
  }
});

test('published industry case studies expose their internal project pages', () => {
  const expectedPages = {
    '58-web': '/work/58-web-infrastructure',
    'xiaomi-emoji': '/work/xiaomi-portrait-ai',
    'xiaomi-portrait': '/work/xiaomi-portrait-ai',
  };

  for (const [id, href] of Object.entries(expectedPages)) {
    const project = WORK_PROJECTS.find(p => p.id === id);
    assert.equal(project.status, 'Published');
    assert.ok(project.links.some(link => link.href === href));
  }
});

test('available years are unique, newest first and cover project intervals', () => {
  assert.deepEqual(projectYears, [...new Set(projectYears)].sort((a, b) => b - a));
  assert.ok(projectYears.includes(2014));
  assert.ok(projectYears.every(year => filterProjects({ year: String(year) }).length > 0));
});
