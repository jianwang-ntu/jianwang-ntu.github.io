import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const file = p => new URL(`../${p}`, import.meta.url);
const archive = 'archive/statement-images/2026-10-07-before-editable-redraw/';

test('all four original images retain their backed-up content and checksums', () => {
  const manifest = JSON.parse(readFileSync(file(`${archive}manifest.json`), 'utf8'));
  assert.equal(manifest.files.length, 4);
  for (const entry of manifest.files) {
    const backup = readFileSync(file(entry.backup));
    assert.equal(backup.length, entry.bytes);
    assert.equal(createHash('sha256').update(backup).digest('hex'), entry.sha256);
    assert.deepEqual(readFileSync(file(entry.source)), backup);
  }
});

test('current diagrams are vectors with the formal gates and assurance limits', () => {
  const expected = {
    'reliable-agents-human-control': ['Shared human-approved requirements Φ', 'sound checking', 'valid delegation scope'],
    'formal-oversight-before-action': ['Send(d, r) ⇒ Authorized(d, r)', 'Check(proof, O) = valid', 'M(x) ⊨ Φ', 'Model assumptions still hold'],
    'preserving-safety-continual-updates': ['PolicyOK ∧ RetentionOK', 'Sₜ₊₁ = Update(Sₜ, Δ*)', 'Keep requirements unchanged', 'Retain Sₜ'],
    'authorization-delegated-workflows': ['ScopeOK ∧ FlowOK ∧ FreshOK', 'do not authorize disclosure.', 'Guarantees depend on captured effects and trusted enforcement.'],
  };
  for (const [name, labels] of Object.entries(expected)) {
    const svg = readFileSync(file(`public/images/research/${name}.svg`), 'utf8');
    const original = readFileSync(file(`${archive}${name}.png`));
    assert.ok(svg.includes(`viewBox="0 0 ${original.readUInt32BE(16)} ${original.readUInt32BE(20)}"`), `${name}: preserve the original aspect ratio`);
    if (name !== 'reliable-agents-human-control') assert.doesNotMatch(svg, /<image\b|data:image/);
    for (const label of labels) assert.ok(svg.includes(label), `${name}: ${label}`);
  }
  assert.ok(existsSync(file('public/data/statement-diagrams/statement-diagrams.pptx')));
  assert.match(readFileSync(file('public/data/statement-diagrams/statement-diagrams.pdf')).subarray(0, 5).toString(), /%PDF-/);
});

test('overview reuses exact separately cropped human and robot assets', () => {
  const svg = readFileSync(file('public/images/research/reliable-agents-human-control.svg'), 'utf8');
  const manifest = JSON.parse(readFileSync(file('public/images/research/roles/source.json'), 'utf8'));
  assert.equal(manifest.roles.length, 2);
  for (const role of manifest.roles) {
    const bytes = readFileSync(file(role.file));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), role.sha256);
    assert.ok(svg.includes(bytes.toString('base64')));
  }
  const page = readFileSync(file('public/data/statement-diagrams/comparison.html'), 'utf8');
  assert.match(page, /Original backup/);
  assert.match(page, /Editable redraw/);
  assert.equal((page.match(/class="comparison"/g) || []).length, 4);
});

test('the three section diagrams share neutral backgrounds', () => {
  for (const name of ['formal-oversight-before-action', 'preserving-safety-continual-updates', 'authorization-delegated-workflows']) {
    const svg = readFileSync(file(`public/images/research/${name}.svg`), 'utf8');
    assert.match(svg, /fill="white"/);
    assert.match(svg, /fill="#F8F8F8"/);
    assert.doesNotMatch(svg, /#F0F3F6|#FAFBFD|#F7F7F7/);
  }
});
