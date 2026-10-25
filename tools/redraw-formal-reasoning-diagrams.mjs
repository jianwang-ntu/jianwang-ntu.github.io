// Native PowerPoint reconstruction of the four consolidated research figures.
// No figure is embedded as a flattened picture. Text, boundaries, symbols,
// flow paths, arrowheads, and citation links are individual editable objects.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { Presentation, PresentationFile } = await import(process.env.ARTIFACT_TOOL_MODULE || '@oai/artifact-tool');
const { createCanvas } = await import(process.env.CANVAS_MODULE || '@napi-rs/canvas');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const build = process.env.FORMAL_DIAGRAM_BUILD_DIR || path.join(root, '.codex-finalizer/formal-reasoning-pptx');
await fs.mkdir(build, { recursive: true });
const W = 1672, H = 941, ink = '#111111';
const deck = Presentation.create({ slideSize: { width: W, height: H } });
const context = createCanvas(1, 1).getContext('2d');
const sources = [
  ['[1] Anthropic + Theorem (2026)', 'https://www.anthropic.com/research/formal-verification'],
  ['[2] Theorem (2026)', 'https://theorem.dev/blog/verified-software-stack/'],
];
const scenes = [];
const textOverflows = [];
let scene;
function start(name, title, subtitle) {
  scene = { name, title, items: [], slide: deck.slides.add() }; scenes.push(scene);
  scene.slide.background.fill = '#FFFFFF';
  scene.slide.speakerNotes.textFrame.setText(
    `Jian Wang's proposed research agenda. This diagram is a conceptual proposal, not a report of completed experiments.\n\n` +
    `Context sources:\n[1] Anthropic and Theorem. LLMs are making formal software verification feasible at a much larger scale. 22 October 2026. ${sources[0][1]}\n` +
    `[2] Margaret von Ebers et al. Bootstrapping the Verified Software Stack. Theorem, 29 September 2026. ${sources[1][1]}\n\n` +
    `Formal guarantees remain conditional on the stated property, input domain, execution semantics, explicit assumptions, and trusted checking.\n` +
    `Research statement: https://www.wj2ai.com/statement/`);
  text(title, 115, 5, 1442, 62, 49, true, 'center', 'Arial');
  text(subtitle, 150, 69, 1372, 47, 34);
  text('Proposed research', 1435, 18, 215, 28, 20);
}
function text(value, x, y, w, h, size = 27, bold = false, align = 'center', font = 'Arial Narrow', link) {
  const lines = value.split('\n'); const lh = size * 1.16;
  const top = y + (h - lines.length * lh) / 2;
  for (const [i, line] of lines.entries()) {
    context.font = `${bold ? 'bold ' : ''}${size}px "${font}"`;
    const measured = context.measureText(line).width;
    if (measured > w + 1) textOverflows.push(`${scene.name}: text too wide (${measured.toFixed(1)} > ${w}): ${line}`);
    const sh = scene.slide.shapes.add({ geometry: 'textbox', name: line.slice(0, 80),
      position: { left: x, top: top + i * lh, width: w, height: lh },
      fill: 'none', line: { fill: 'none', width: 0 } });
    sh.text = link ? [[{ run: line, link: { uri: link, isExternal: true } }]] : line;
    sh.text.style = { typeface: font, fontSize: size, bold, color: ink,
      alignment: align, verticalAlignment: 'middle', autoFit: 'none', wrap: 'none', insets: 0 };
    scene.items.push({ type: 'text', value: line, x, y: top + i * lh, w, h: lh, size, bold, font, align, link });
  }
}
function box(x, y, w, h, name = 'Editable boundary', dashed = false, geometry = 'rect', width = 1.7) {
  const sh = scene.slide.shapes.add({ geometry, name, position: { left: x, top: y, width: w, height: h },
    fill: '#FFFFFF', line: { fill: ink, width, style: dashed ? 'dashed' : 'solid' } });
  scene.items.push({ type: 'box', x, y, w, h, geometry, dashed }); return sh;
}
function pathShape(points, dashed = false, arrow = true, width = 2, name = 'Editable flow path') {
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(1, Math.max(...xs) - x), h = Math.max(1, Math.max(...ys) - y);
  scene.slide.shapes.add({ geometry: 'custom', name, position: { left: x, top: y, width: w, height: h },
    fill: 'none', line: { fill: ink, width, style: dashed ? 'dashed' : 'solid' },
    customPaths: [{ width: w, height: h, commands: points.map(([px, py], i) => ({ [i ? 'lineTo' : 'moveTo']: { x: px - x, y: py - y } })) }] });
  if (arrow) {
    const [ex, ey] = points.at(-1), [px, py] = points.at(-2);
    const angle = Math.atan2(ey - py, ex - px), ux = Math.cos(angle), uy = Math.sin(angle);
    const vertices = [[ex, ey], [ex - 12 * ux - 5 * uy, ey - 12 * uy + 5 * ux], [ex - 12 * ux + 5 * uy, ey - 12 * uy - 5 * ux]];
    const hx = Math.min(...vertices.map(p => p[0])), hy = Math.min(...vertices.map(p => p[1]));
    const hw = Math.max(1, Math.max(...vertices.map(p => p[0])) - hx), hh = Math.max(1, Math.max(...vertices.map(p => p[1])) - hy);
    scene.slide.shapes.add({ geometry: 'custom', name: 'Editable arrowhead', position: { left: hx, top: hy, width: hw, height: hh }, fill: ink,
      line: { fill: 'none', width: 0 }, customPaths: [{ width: hw, height: hh,
        commands: [...vertices.map(([vx, vy], i) => ({ [i ? 'lineTo' : 'moveTo']: { x: vx - hx, y: vy - hy } })), { close: {} }] }] });
  }
  scene.items.push({ type: 'path', points, dashed, arrow });
}
function badge(label, x, y, d = 38) { box(x, y, d, d, `Stage ${label}`, false, 'ellipse'); text(label, x, y, d, d, d * .65, true); }
function rule(x, y, w, dashed = false) { pathShape([[x, y], [x + w, y]], dashed, false, 1.5, 'Editable rule'); }
function check(x, y, size = 28) { pathShape([[x, y + size * .55], [x + size * .35, y + size * .9], [x + size, y]], false, false, 3, 'Editable check mark'); }
function cross(x, y, size = 27) { pathShape([[x, y], [x + size, y + size]], false, false, 3, 'Editable cross'); pathShape([[x + size, y], [x, y + size]], false, false, 3, 'Editable cross'); }
function document(x, y, w = 65, h = 80, kind = 'lines') {
  const f = Math.min(17, w / 4);
  pathShape([[x, y], [x + w - f, y], [x + w, y + f], [x + w, y + h], [x, y + h], [x, y]], false, false, 1.8, 'Editable proof document');
  pathShape([[x + w - f, y], [x + w - f, y + f], [x + w, y + f]], false, false, 1.5);
  if (kind === 'code') text('</>', x + 3, y + h * .3, w - 6, h * .4, Math.min(31, w * .43), true);
  else for (let i = 0; i < 3; i++) rule(x + w * .2, y + h * (.35 + i * .17), w * .55);
}
function windowIcon(x, y, w, h, kind = 'code') {
  box(x, y, w, h, 'Editable program window'); rule(x, y + 18, w);
  for (let i = 0; i < 3; i++) box(x + 6 + i * 9, y + 6, 3.5, 3.5, 'Window control', false, 'ellipse', 1);
  if (kind === 'code') text('</>', x + 8, y + 31, w - 16, h - 39, 39, true);
  else if (kind === 'check') { check(x + 20, y + 42, 40); for (let i = 0; i < 3; i++) rule(x + 88, y + 44 + i * 18, w - 108); }
  else for (let i = 0; i < 3; i++) { check(x + 9, y + 30 + i * 20, 11); rule(x + 31, y + 36 + i * 20, w - 43); }
}
function magnifier(x, y, d = 42) { box(x, y, d, d, 'Editable magnifier lens', false, 'ellipse', 2.5); pathShape([[x + d * .83, y + d * .83], [x + d * 1.35, y + d * 1.35]], false, false, 4, 'Editable magnifier handle'); }
function tree(x, y, w = 65, h = 54) { const fork = y + h * .44; pathShape([[x + w / 2, y + 15], [x + w / 2, fork], [x + 8, y + h - 8]], false, false, 2); pathShape([[x + w / 2, fork], [x + w - 8, y + h - 8]], false, false, 2); for (const [cx, cy] of [[w / 2, 8], [8, h - 8], [w - 8, h - 8]]) box(x + cx - 7, y + cy - 7, 14, 14, 'Proof tree node', false, 'ellipse', 2); }
function stack(x, y, w = 60, h = 58) { for (let i = 2; i >= 0; i--) { const cy = y + i * 12; pathShape([[x + w / 2, cy], [x + w, cy + 13], [x + w / 2, cy + 27], [x, cy + 13], [x + w / 2, cy]], false, false, 2, 'Editable library layer'); } }
function smallDocStack(x, y, w = 51, h = 68) { for (let i = 2; i >= 0; i--) { box(x + i * 11, y - i * 11, w, h, 'Editable proof artifact'); for (let j = 0; j < 3; j++) rule(x + i * 11 + 9, y - i * 11 + 19 + j * 13, w - 18); } }
function database(x, y, w = 58, h = 70) { box(x, y + 9, w, h - 18, 'Editable proof library'); for (let i = 0; i < 3; i++) box(x, y + i * 24, w, 18, 'Proof library layer', false, 'ellipse'); }
function footer(note) {
  text(note, 90, 889, 1492, 25, 20);
  // Sources are linked in the HTML caption and retained in speaker notes.
}
function sectionPanel(label, subtitle, x, y, w, h, letter, url) {
  box(x, y, w, h, `${label} panel`); badge(letter, x + 16, y + 11, 44);
  text(label, x + 76, y + 11, w - 92, 34, 30, true, 'left', 'Arial Narrow', url);
  text(subtitle, x + 76, y + 48, w - 92, 28, 23, false, 'left');
}

// 1. Overview. Match the five-node flow and three research regions.
start('overview', 'Learning Reusable Formal Reasoning', 'From expensive proofs to transferable reasoning');
for (const [x, w, n] of [[31, 275, 1], [359, 266, 2], [681, 308, 3], [1037, 256, 4], [1324, 319, 5]]) { box(x, 144, w, 230, 'Research mechanism'); badge(String(n), x + w / 2 - 19, 125); }
text('Code + test harness', 47, 172, 243, 33, 27, true); text('Existing software', 48, 206, 241, 27, 24);
windowIcon(65, 239, 86, 94); windowIcon(180, 239, 93, 94, 'test'); text('Program', 51, 340, 112, 25, 22); text('Test harness', 166, 340, 124, 25, 22);
text('Explicit property', 371, 172, 242, 33, 28, true); text('Input domain + execution model', 369, 207, 246, 27, 19.5);
box(397, 240, 211, 116, 'Explicit property details'); text('Input domain\nExecution model\nSafety / functional\nproperty', 415, 254, 178, 88, 22, false, 'left');
text('Agent proposes proofs', 695, 172, 280, 33, 27, true); text('Invariants · Contracts · Lemmas', 697, 207, 276, 27, 22);
for (const [x, label] of [[701, 'Invariant'], [794, 'Contract'], [887, 'Lemma']]) { box(x, 239, 82, 102, 'Proof artifact'); text(label, x + 4, 247, 74, 25, 20, true); for (let i = 0; i < 3; i++) rule(x + 15, 286 + i * 14, 51); }
text('Independent checker', 1048, 172, 234, 34, 27, true); windowIcon(1077, 232, 177, 110, 'check');
text('Verification feedback', 1336, 172, 295, 34, 28, true);
for (const [x, label, status] of [[1334, 'Checked', 'yes'], [1434, 'Counterexample', 'no'], [1534, 'Unresolved', 'unknown']]) {
  box(x, 230, 98, 98, 'Verification outcome'); if (status === 'yes') check(x + 32, 253, 29); else if (status === 'no') cross(x + 35, 252, 25); else text('?', x + 31, 244, 40, 43, 40, true);
  text(label, x + 3, 292, 92, 26, status === 'no' ? 15 : 20);
}
for (const [a, b, label] of [[306, 359, 'Formalize'], [625, 681, 'Propose'], [989, 1037, 'Check'], [1293, 1324, '']]) { pathShape([[a, 263], [b, 263]]); if (label) text(label, a + 2, 224, b - a - 4, 27, label === 'Formalize' ? 13 : label === 'Propose' ? 17 : 19); }
pathShape([[1470, 374], [1470, 416], [833, 416], [833, 374]], true); text('Refine and learn', 865, 381, 260, 31, 27, true);
pathShape([[837, 416], [837, 438], [319, 438], [319, 494]], true); pathShape([[837, 438], [728, 438], [728, 494]], true); pathShape([[837, 438], [1356, 438], [1356, 494]], true);
text('Learn from proof feedback', 348, 446, 281, 29, 23); text('Reuse through checked interfaces', 749, 446, 324, 29, 23); text('Audit requirements', 1380, 446, 250, 29, 24);
sectionPanel('Learn reusable strategies', 'What transfers beyond one proof?', 31, 495, 559, 320, 'A', 'https://www.wj2ai.com/statement#learning-reusable-proof-strategies');
smallDocStack(52, 631, 53, 72); text('Checked\nderivations', 40, 719, 105, 54, 22);
pathShape([[129, 659], [193, 659]]); box(194, 580, 237, 158, 'Learned strategy'); text('Learned strategy', 206, 588, 213, 29, 25, true);
for (const [label, y] of [['Abstract patterns', 620], ['Proof heuristics', 659], ['Reusable templates', 698]]) { box(211, y, 202, 32, 'Strategy component'); text(label, 218, y + 3, 188, 26, 20); }
pathShape([[432, 659], [477, 659]]); smallDocStack(479, 627, 53, 72); text('Unfamiliar\nprograms', 465, 705, 105, 44, 20);
box(159, 758, 410, 46, 'Retrieval and search comparison', true); magnifier(180, 768, 18); text('Compare with retrieval + search', 215, 764, 340, 32, 23);
sectionPanel('Compose verification evidence', 'Can checked dependencies support callers?', 611, 495, 476, 320, 'B', 'https://www.wj2ai.com/statement#compositional-verification');
for (const [label, detail, y] of [['Library A proof', '(e.g., memory safety)', 583], ['Library B proof', '(e.g., API contract)', 648], ['Caller obligations', '(e.g., correct usage)', 713]]) { box(628, y, 174, 54, 'Local checked evidence'); text(label, 636, y + 2, 158, 26, 22, true); text(detail, 634, y + 27, 162, 22, 18); }
box(827, 604, 109, 133, 'Checked interfaces'); text('Checked\ninterfaces', 832, 614, 99, 57, 22, true); tree(850, 678, 63, 48);
for (const [y, ty] of [[610, 644], [675, 670], [740, 711]]) pathShape([[802, y], [815, y], [815, ty], [827, ty]]);
box(947, 586, 126, 180, 'Larger stated property'); text('Larger stated\nproperty', 954, 597, 112, 54, 21.5, true); text('(e.g., caller\nfunctionality)', 953, 655, 114, 47, 19); document(985, 712, 48, 43); pathShape([[936, 675], [947, 675]]);
sectionPanel('Audit verification feedback', 'Does the theorem capture the requirement?', 1110, 495, 532, 320, 'C', 'https://www.wj2ai.com/statement#trustworthy-verification-feedback');
for (const [x, w, label, detail] of [[1127, 145, 'Intended\nrequirements', ''], [1287, 177, 'Exact artifacts', '(proofs, counterexamples,\ntraces)'], [1480, 149, 'Assumptions', '(environment, model,\ntrusted components)']]) {
  box(x, 584, w, 116, 'Evidence assessment input'); text(label, x + 5, 590, w - 10, 44, 22, true); if (detail) text(detail, x + 5, 631, w - 10, 32, 15.5);
  document(x + w / 2 - 20, detail ? 672 : 645, 40, detail ? 21 : 44);
}
pathShape([[1198, 700], [1198, 715], [1554, 715], [1554, 700]], false, false); pathShape([[1380, 715], [1380, 733]]);
box(1242, 734, 265, 68, 'Assess feedback'); magnifier(1261, 749, 29); text('Assess feedback', 1311, 743, 181, 34, 25, true); rule(1320, 783, 117);
box(189, 835, 1294, 53, 'Verification goal'); text('Efficient, reusable, independently checkable verification', 205, 843, 1262, 36, 32, true);
footer('Guarantees depend on the property, input domain, execution semantics, and trusted checking.');

// 2. Learning: distinct alternatives, shared evaluation, protected property.
start('learning-proof-strategies', 'Learning Reusable Proof Strategies', 'Which verification evidence teaches transfer?');
const top = [[30, 257, 'Code +\ntest harness'], [389, 249, 'Explicit\nproperty'], [729, 270, 'Agent\nproposes proofs'], [1080, 237, 'Independent\nchecker']];
for (const [x, w, label] of top) { box(x, 152, w, 130, label.replace('\n', ' ')); text(label, x + 94, 169, w - 108, 63, 25, true, 'left'); }
document(53, 178, 51, 69); text('Existing software', 136, 245, 138, 23, 22, false, 'left');
document(409, 178, 66, 73, 'code'); text('Input domain +\nexecution model', 502, 233, 123, 41, 20, false, 'left');
document(754, 179, 48, 66); text('Invariants · Contracts ·\nLemmas', 825, 235, 161, 39, 19, false, 'left'); magnifier(1105, 180, 43);
for (const [a, b, label] of [[287, 389, 'Formalize'], [638, 729, 'Propose'], [999, 1080, 'Check']]) { pathShape([[a, 216], [b, 216]]); text(label, a + 1, 183, b - a - 2, 27, 24, true); }
pathShape([[1317, 216], [1334, 216]], false, false);
for (const [y, label, symbol] of [[104, 'Checked step', 'check'], [175, 'Counterexample', 'cross'], [246, 'Unresolved /\nresource limit', '?']]) { box(1392, y, 253, 60, 'Distinct proof outcome'); if (symbol === 'check') check(1414, y + 18, 30); else if (symbol === 'cross') cross(1415, y + 17, 27); else text('?', 1409, y + 5, 44, 50, 40, true); text(label, 1466, y + 5, 170, 50, 25, symbol !== 'cross'); pathShape([[1334, 216], [1334, y + 30], [1392, y + 30]], false, true); }
pathShape([[1334, 216], [1334, 342], [843, 342], [843, 283]], true); text('Any outcome: investigate and refine the proof', 870, 305, 447, 29, 24, true);
box(30, 365, 1615, 484, 'Alternative mechanisms comparison', true); text('Compare three experimental mechanisms', 330, 370, 1012, 39, 34, true);
for (const [x, label, number, sub] of [[70, 'Retrieve', '1', 'Reuse checked proof artifacts'], [604, 'Refine', '2', 'Adapt during one task'], [1118, 'Learn', '3', 'Train reusable proof strategies']]) { box(x, 413, 483, 256, `Alternative mechanism: ${label}`); badge(number, x + 25, 423, 53); text(label, x + 103, 423, 350, 39, 36, true, 'left'); text(sub, x + 104, 466, 352, 29, 27, false, 'left'); }
database(189, 513, 64, 73); pathShape([[279, 550], [347, 550]]); document(365, 514, 57, 72); text('Search and reuse from\nexisting invariants, lemmas, etc.', 115, 605, 397, 52, 27);
document(721, 515, 53, 70); pathShape([[798, 550], [866, 550]]); document(887, 515, 54, 70); text('Iteratively improve using\nchecker feedback on the same task.', 641, 605, 411, 52, 26);
document(1247, 515, 52, 70); pathShape([[1324, 550], [1393, 550]]); text('Strategy', 1410, 524, 135, 43, 31, true); text('Compare final proofs,\nderivations, and revisions.', 1154, 605, 411, 52, 27);
for (const x of [320, 836, 1359]) pathShape([[x, 669], [x, 714]]);
box(220, 715, 1232, 80, 'Held-out transfer test'); document(607, 730, 45, 53); document(668, 730, 45, 53); text('Held-out transfer test', 762, 727, 633, 32, 30, true, 'left'); text('Unfamiliar programs + changed obligations', 762, 763, 633, 25, 24, false, 'left');
box(43, 803, 1588, 41, 'Matched evaluation budgets'); text('Matched data, tools, and total cost', 100, 808, 1474, 29, 26);
box(30, 857, 1615, 39, 'Learning versus artifact reuse'); text('Sharing a proof and learning a strategy are evaluated separately.', 60, 861, 1555, 30, 31, true);
footer('Checked success does not establish generalization.');

// 3. Composition: dependency interfaces and affected-evidence revalidation.
start('compositional-verification', 'Compositional Verification', 'Reuse checked components through verified interfaces');
box(33, 233, 152, 256, 'Global software property'); badge('1', 90, 214); document(75, 282, 67, 94); text('Global\nsoftware\nproperty', 43, 388, 132, 86, 29, true);
box(230, 233, 192, 256, 'Agent proposes decomposition'); badge('2', 304, 214); tree(294, 288, 67, 76); text('Agent proposes\ndecomposition', 241, 390, 170, 72, 27, true);
pathShape([[185, 351], [230, 351]]);
box(507, 194, 671, 335, 'Component verification', true); text('Check each component', 647, 157, 391, 34, 31, true);
for (const [y, label, code] of [[213, 'Shared\nlibrary A', false], [320, 'Shared\nlibrary B', false], [429, 'Caller\ncomponent', true]]) {
  box(522, y, 201, 78, 'Software component'); if (code) text('</>', 540, y + 18, 67, 41, 36, true); else stack(548, y + 14, 46, 49); text(label, 611, y + 9, 103, 60, 23, true, 'left');
  box(757, y, 181, 78, 'Contract and local proof'); document(777, y + 17, 35, 44); text('Contract +\nlocal proof', 824, y + 10, 104, 58, 24, false, 'left');
  box(970, y, 193, 78, 'Independent check'); box(985, y + 17, 44, 44, 'Check result', false, 'ellipse'); check(997, y + 27, 24); text('Independent\ncheck', 1039, y + 10, 116, 58, 25, false, 'left');
  pathShape([[723, y + 39], [757, y + 39]]); pathShape([[938, y + 39], [970, y + 39]]);
  pathShape([[422, 351], [455, 351], [455, y + 39], [522, y + 39]]);
  pathShape([[1163, y + 39], [1197, y + 39], [1197, 354], [1230, 354]]);
}
box(1230, 237, 195, 284, 'Interface and assumption gate'); badge('6', 1308, 218); tree(1294, 276, 67, 58); text('Check interfaces\n+ assumptions', 1238, 359, 179, 63, 27, true);
box(1239, 429, 177, 81, 'Interface checks', true); text('Caller obligations\nShared state\nExecution model', 1252, 435, 152, 69, 23, false, 'left');
box(1481, 233, 159, 258, 'Evidence for larger property'); badge('7', 1541, 214); document(1528, 281, 65, 91); text('Evidence for\nthe larger\nproperty', 1490, 391, 141, 83, 28, true); pathShape([[1425, 354], [1481, 354]]);
pathShape([[1326, 521], [1326, 564], [327, 564], [327, 489]], true); text('Revise incompatible obligations', 622, 570, 454, 32, 29, true);
box(37, 615, 847, 200, 'Dependency reuse'); text('Reuse one dependency proof across callers', 59, 627, 802, 35, 29, true, 'left');
box(76, 681, 262, 110, 'Checked shared library'); stack(104, 704, 49, 55); text('Shared library A', 164, 690, 161, 28, 24, true, 'left'); text('Checked proof\n+ interface', 164, 729, 161, 52, 24, false, 'left');
box(364, 702, 96, 62, 'Verified interface'); text('Verified\ninterface', 371, 708, 82, 50, 23); pathShape([[338, 735], [364, 735]]);
for (const [y, n] of [[667, 1], [744, 2]]) { box(527, y, 313, 58, 'Caller component'); text('</>', 546, y + 8, 52, 43, 28, true); text(`Caller component ${n}`, 610, y + 10, 213, 37, 26, true, 'left'); pathShape([[460, 733], [486, 733], [486, y + 29], [527, y + 29]]); }
box(908, 615, 730, 200, 'Changes and revalidation'); text('When something changes', 940, 628, 660, 35, 30, true, 'left');
box(939, 683, 321, 99, 'Changed caller component or property'); document(962, 703, 40, 57); text('Changed caller /\ncomponent / property', 1018, 695, 226, 74, 26, true, 'left');
box(1303, 683, 304, 99, 'Revalidate affected evidence'); text('Revalidate\naffected evidence', 1334, 700, 244, 64, 28); pathShape([[1260, 733], [1303, 733]]); pathShape([[1417, 683], [1417, 521]], true);
box(31, 847, 1610, 40, 'Conditional proof reuse'); text('Reuse is conditional on matching interfaces, artifacts, and assumptions.', 60, 853, 1552, 28, 29, true);
footer('Larger guarantees require checked interfaces and explicit assumptions.');

// 4. Feedback: a checked theorem and an intended-requirement assessment differ.
start('trustworthy-feedback', 'Trustworthy Verification Feedback', 'A checked theorem must support the intended requirement');
for (const [y, n, title, detail] of [[133, '1', 'Approved property', 'Test-derived or explicit'], [289, '2', 'Exact code + model', 'Domain + execution\nsemantics'], [447, '3', 'Candidate proof', 'Invariants, contracts,\nlemmas, etc.']]) {
  box(40, y, 295, 123, 'Verification input'); badge(n, 32, y - 15); if (n === '3') tree(73, y + 32, 53, 52); else document(74, y + 35, 48, 60, n === '2' ? 'code' : 'lines');
  text(title, 143, y + 24, 186, 32, 24, true, 'left'); text(detail, 143, y + 64, 186, 50, 22, false, 'left');
  pathShape([[335, y + 61.5], [362, y + 61.5], [362, 349], [475, 349]]);
}
text('Check\nfor\ncorrectness', 370, 268, 96, 83, 22); box(475, 238, 150, 185, 'Independent checker'); badge('4', 472, 223); text('CHECK', 492, 267, 116, 42, 31, true); text('Independent\nchecker', 483, 336, 134, 66, 27, true);
pathShape([[625, 334], [716, 334]]); text('Proof\nvalid', 633, 267, 76, 53, 26);
box(716, 238, 153, 238, 'Theorem checked'); badge('5', 711, 223); document(764, 269, 56, 69); text('Theorem\nchecked', 726, 344, 133, 58, 30, true); text('Proof is valid under\nthe given property,\ncode and model.', 725, 404, 135, 65, 19);
pathShape([[869, 334], [999, 334]]); text('A checked\ntheorem still\nneeds\nassessment', 880, 226, 111, 98, 21);
box(999, 141, 353, 470, 'Intended requirement assessment'); badge('6', 988, 126); text('Assess intended requirements', 1037, 148, 302, 34, 25, true);
for (const [y, label, question] of [[191, 'Requirement coverage', 'Does the theorem address\nthe intended requirements?'], [293, 'Artifact matching', 'Does the proof match the\napproved code and property?'], [397, 'Explicit assumptions', 'Are all assumptions stated\nand acceptable?'], [502, 'Behavior preservation', 'Does the change preserve\nrequired behavior?']]) {
  box(1014, y, 323, 91, 'Evidence assessment criterion'); document(1031, y + 20, 36, 48); text(label, 1083, y + 8, 241, 29, 27, true, 'left'); text(question, 1083, y + 40, 241, 45, 22, false, 'left');
}
box(1470, 209, 173, 248, 'Validated learning credit'); badge('8', 1459, 194); document(1528, 245, 54, 68); text('Validated\nlearning credit /\naccepted change', 1479, 322, 155, 83, 23, true); text('Use as trusted feedback\nfor learning and updates.', 1480, 411, 153, 39, 16.5);
pathShape([[1352, 317], [1470, 317]]); text('All checks\nsatisfied', 1361, 257, 101, 55, 25);
box(1375, 518, 268, 119, 'Protected requirements and rules'); text('Protected requirements\n+ acceptance rules', 1390, 530, 238, 56, 25.5, true); text('Cannot be weakened to\nobtain reward.', 1390, 589, 238, 40, 24); pathShape([[1408, 518], [1408, 388], [1352, 388]], true);
pathShape([[540, 423], [540, 556]]); text('Invalid or\nunresolved', 560, 464, 159, 58, 27);
box(443, 556, 304, 123, 'Invalid or unresolved result'); document(467, 583, 45, 64); text('Invalid / unresolved', 542, 566, 193, 31, 25, true, 'left'); text('Counterexample,\nverification failure,\nor resource limit.', 542, 602, 193, 69, 25, false, 'left');
box(1042, 709, 443, 122, 'Investigate revise review'); magnifier(1068, 735, 39); text('Investigate / revise / review', 1128, 725, 344, 37, 29, true, 'left'); text('Revise the proof or proposed change.\nMay require human review.', 1128, 766, 344, 53, 24, false, 'left');
pathShape([[747, 623], [802, 623], [802, 759], [1042, 759]]); text('Never a success', 830, 721, 193, 30, 25);
pathShape([[1163, 611], [1163, 709]]); text('Failed or inconclusive\nassessment', 1180, 634, 263, 58, 26);
box(36, 694, 720, 176, 'Common failure examples', true); text('Common failure examples', 49, 702, 680, 29, 27, true, 'left');
for (const [x, title, detail] of [[50, 'Weak property', 'Requirements are\nunderspecified.'], [279, 'Inconsistent\npremise', 'Proof assumes conditions\nthat do not hold.'], [511, 'Patch disables\nrequired behavior', 'Proof does not match\nthe intended functionality.']]) {
  box(x, 736, 215, 122, 'Failure example'); text(title, x + 13, 744, 189, 48, 26, true, 'left'); text(detail, x + 13, 797, 189, 53, 20, false, 'left');
}
footer('A valid proof establishes its theorem; intended requirements need separate assessment.');

// Export a private editable candidate and render all authored slides.
if (textOverflows.length) throw new Error(textOverflows.join('\n'));
for (const [i, s] of scenes.entries()) {
  const png = await deck.export({ slide: s.slide, format: 'png', scale: 1 });
  await fs.writeFile(path.join(build, `slide-${i + 1}.png`), new Uint8Array(await png.arrayBuffer()));
  const layout = await s.slide.export({ format: 'layout' });
  await fs.writeFile(path.join(build, `slide-${i + 1}.layout.json`), await layout.text());
}
await (await PresentationFile.exportPptx(deck)).save(path.join(build, 'candidate.pptx'));
await fs.writeFile(path.join(build, 'scenes.json'), JSON.stringify(scenes.map(({ name, title, items }) => ({ name, title, items })), null, 2));
await fs.writeFile(path.join(build, 'deck.json'), JSON.stringify(deck.toProto()));
console.log(`Created ${scenes.length} editable native-object slides in ${build}`);
