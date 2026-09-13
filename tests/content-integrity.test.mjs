import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { PUB_META } from '../src/data-pubs.js';
import { BLOG_ALIASES } from '../src/blog-aliases.js';

const file = path => new URL(`../${path}`, import.meta.url);
const posts = JSON.parse(readFileSync(file('public/blog/posts.json'), 'utf8'));

test('every indexed note agrees with its metadata and has its declared translations', () => {
  assert.equal(new Set(posts.map(post => post.slug)).size, posts.length);
  for (const post of posts) {
    const meta = JSON.parse(readFileSync(file(`public/blog/${post.slug}/meta.json`), 'utf8'));
    assert.deepEqual(post, meta, post.slug);
    assert.match(post.dek_en, /[.!?]$/, `Incomplete summary: ${post.slug}`);
    for (const lang of post.languages) {
      const body = readFileSync(file(`public/blog/${post.slug}/index.${lang}.md`), 'utf8');
      assert.equal((body.match(/^# /gm) || []).length, 1, `${post.slug}/${lang}`);
      for (const [, path] of body.matchAll(/!\[[^\]]*\]\((\/[^)]+)\)/g)) {
        assert.ok(existsSync(file(`public${path}`)), `${post.slug}: missing ${path}`);
      }
    }
  }
});

test('consolidated note URLs lead to an indexed destination without redirect chains', () => {
  for (const [source, target] of Object.entries(BLOG_ALIASES)) {
    assert.ok(posts.some(post => post.slug === target), target);
    assert.ok(!posts.some(post => post.slug === source), source);
    assert.equal(Object.hasOwn(BLOG_ALIASES, target), false);
    assert.equal(existsSync(file(`public/blog/${source}/meta.json`)), false);
    assert.ok(existsSync(file(`archive/blog/${source}/meta.json`)));
  }
});

test('BibTeX exports preserve the displayed author surnames and order', () => {
  for (const meta of Object.values(PUB_META)) {
    const authors = meta.bibtex.match(/author\s*=\s*\{([^}]+)\}/)[1].split(' and ');
    assert.deepEqual(authors.map(author => {
      const parts = author.split(',').map(part => part.trim());
      assert.equal(parts.length, 2, `Ambiguous BibTeX author: ${author}`);
      return parts.join(' ');
    }), meta.authors, meta.key);
  }
});
