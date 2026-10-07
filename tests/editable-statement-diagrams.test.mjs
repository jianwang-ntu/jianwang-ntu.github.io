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
    'reliable-agents-human-control': ['Shared human-approved requirements Φ', 'sound checking', 'valid delegation'],
    'formal-oversight-before-action': ['Send(d, r) ⇒ Authorized(d, r)', 'Check(proof, O) = valid', 'M(x) ⊨ Φ', 'Model assumptions still hold'],
    'preserving-safety-continual-updates': ['PolicyOK ∧ RetentionOK', 'Sₜ₊₁ = Update(Sₜ, Δ*)', 'Keep requirements unchanged', 'Retain Sₜ'],
    'authorization-delegated-workflows': ['ScopeOK ∧ FlowOK ∧ FreshOK', 'do not authorize disclosure.', 'Recovery cannot undo completed disclosures.'],
  };
  for (const [name, labels] of Object.entries(expected)) {
    const svg = readFileSync(file(`public/images/research/${name}.svg`), 'utf8');
    assert.match(svg, /viewBox="0 0 1448 1086"/);
    assert.doesNotMatch(svg, /<image\b|data:image/);
    for (const label of labels) assert.ok(svg.includes(label), `${name}: ${label}`);
  }
  assert.ok(existsSync(file('public/data/statement-diagrams/statement-diagrams.pptx')));
  assert.match(readFileSync(file('public/data/statement-diagrams/statement-diagrams.pdf')).subarray(0, 5).toString(), /%PDF-/);
});
