// One native-object scene generates editable PowerPoint and sharp web SVGs.
// Run with @oai/artifact-tool available, or set ARTIFACT_TOOL_MODULE to its .mjs.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { Presentation, PresentationFile } = await import(process.env.ARTIFACT_TOOL_MODULE || '@oai/artifact-tool');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const draft = process.env.DIAGRAM_BUILD_DIR || path.join(root, '.codex-finalizer');
const web = path.join(root, 'public/images/research');
await fs.mkdir(draft, { recursive: true });
const W = 1448, H = 1086;
const ink = '#203442', blue = '#1D6077', pale = '#F1F6F8', rule = '#667985';
const deck = Presentation.create({ slideSize: { width: W, height: H } });
const scenes = [];
let scene;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function begin(name, title, subtitle) {
  scene = { name, title, items: [], slide: deck.slides.add() }; scenes.push(scene);
  scene.slide.background.fill = '#FFFFFF';
  text(title, 20, 12, 1408, 60, 42, true);
  text(subtitle, 20, 75, 1408, 40, 26);
  scene.slide.speakerNotes.textFrame.setText('Redrawn from the author-provided research statement diagram. The framework is proposed research. Original raster source is retained in archive/statement-images/2026-10-07-before-editable-redraw/. All diagram text, shapes and connections are native editable objects.');
}
function text(value, x, y, w, h, size = 26, bold = false, align = 'center', color = ink) {
  const lines = value.split('\n');
  // Separate line objects keep browser and PowerPoint line placement identical.
  const lh = size * 1.22, top = y + (h - lines.length * lh) / 2;
  lines.forEach((line, i) => {
    const ty = top + i * lh;
    const sh = scene.slide.shapes.add({ geometry: 'textbox', name: line.slice(0, 64), position: { left: x, top: ty, width: w, height: lh }, fill: 'none', line: { fill: 'none', width: 0 } });
    sh.text = line;
    sh.text.style = { typeface: 'Arial', fontSize: size, bold, color, alignment: align, verticalAlignment: 'middle', autoFit: 'none', wrap: 'none', insets: { top: 0, right: 0, bottom: 0, left: 0 } };
    scene.items.push({ type: 'text', line, x, y: ty, w, h: lh, size, bold, align, color });
  });
}
function box(x, y, w, h, fill = pale, dashed = false) {
  const shape = scene.slide.shapes.add({ geometry: 'rect', name: 'Diagram boundary', position: { left: x, top: y, width: w, height: h }, fill, line: { fill: rule, width: 1.6, style: dashed ? 'dashed' : 'solid' } });
  scene.items.push({ type: 'box', x, y, w, h, fill, dashed }); return shape;
}
function cell(x, y, w, h, heading, body, size = 25) {
  box(x, y, w, h); text(heading, x + 12, y + 12, w - 24, 40, heading.length > 27 ? 23 : 28, true);
  text(body, x + 16, y + 56, w - 32, h - 68, size);
}
function arrow(points, dashed = false, head = true) {
  // Native path objects avoid zero-height connector export problems for exact
  // horizontal/vertical routes, while retaining editable vertices in PowerPoint.
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys), w = Math.max(1, Math.max(...xs) - x), h = Math.max(1, Math.max(...ys) - y);
  scene.slide.shapes.add({ geometry: 'custom', name: 'Editable flow arrow', position: { left: x, top: y, width: w, height: h }, fill: 'none', line: { fill: ink, width: 2, style: dashed ? 'dashed' : 'solid' }, customPaths: [{ width: w, height: h, commands: points.map(([px, py], i) => ({ [i ? 'lineTo' : 'moveTo']: { x: px - x, y: py - y } })) }] });
  if (head) {
    const [ex, ey] = points.at(-1), [px, py] = points.at(-2);
    const angle = Math.atan2(ey - py, ex - px), ux = Math.cos(angle), uy = Math.sin(angle);
    const vertices = [[ex, ey], [ex - 12 * ux - 5 * uy, ey - 12 * uy + 5 * ux], [ex - 12 * ux + 5 * uy, ey - 12 * uy - 5 * ux]];
    const hx = Math.min(...vertices.map(p => p[0])), hy = Math.min(...vertices.map(p => p[1]));
    const hw = Math.max(...vertices.map(p => p[0])) - hx, hh = Math.max(...vertices.map(p => p[1])) - hy;
    scene.slide.shapes.add({ geometry: 'custom', name: 'Arrowhead', position: { left: hx, top: hy, width: hw, height: hh }, fill: ink, line: { fill: 'none', width: 0 }, customPaths: [{ width: hw, height: hh, commands: [...vertices.map(([vx, vy], i) => ({ [i ? 'lineTo' : 'moveTo']: { x: vx - hx, y: vy - hy } })), { close: {} }] }] });
  }
  scene.items.push({ type: 'arrow', points, dashed, head });
}
function footer(value) { text(value, 30, 995, 1388, 65, 24); }
function stage(x, n, title) { box(x, 145, 420, 795, '#FFFFFF'); text(`${n}  ${title}`, x + 12, 163, 396, 68, 30, true, 'center', blue); }
function between(x, label) { text(label, x - 15, 445, 90, 65, 18); arrow([[x, 530], [x + 60, 530]]); }
function decision(x, y, width, yes, no) {
  const mid = x + width / 2;
  arrow([[mid, y], [mid, y + 32]], false, false);
  arrow([[mid, y + 32], [x + width / 4, y + 32], [x + width / 4, y + 96]]);
  arrow([[mid, y + 32], [x + 3 * width / 4, y + 32], [x + 3 * width / 4, y + 96]]);
  text('all pass', x, y, width / 2, 30, 21);
  text('fail / unknown', mid, y, width / 2, 30, 21);
  box(x, y + 96, width / 2 - 9, 65); box(mid + 9, y + 96, width / 2 - 9, 65);
  text(yes, x + 6, y + 103, width / 2 - 21, 50, 25, true);
  text(no, mid + 15, y + 103, width / 2 - 21, 50, 25, true);
}

begin('reliable-agents-human-control', 'Reliable AI Agents Under Human Control', 'A proposed research agenda for actions, system updates, and delegation');
for (const [x, title, left, right, forward, back, rows] of [
  [20, 'Human–Agent Interaction', 'Human', 'AI agent', 'Task + authorized scope', 'Action proposal + evidence', ['Check actions against approved requirements', 'Evaluate protection after system updates', 'Enforce current scope and permissions across steps']],
  [732, 'Agent–Agent Collaboration', 'Agent A', 'Agent B', 'Subtask + data + constraints', 'Proposal + evidence + status', ['Check actions using independent evidence', 'Assess retention after agent or harness updates', 'Enforce inherited data limits and valid delegation']],
]) {
  box(x, 124, 696, 429, '#FFFFFF'); text(title, x + 15, 139, 666, 45, 32, true, 'center', blue);
  box(x + 28, 214, 140, 103); text(left, x + 35, 226, 126, 79, 27, true);
  box(x + 528, 214, 140, 103); text(right, x + 535, 226, 126, 79, 27, true);
  text(forward, x + 175, 195, 344, 48, 22); arrow([[x + 180, 248], [x + 516, 248]]);
  arrow([[x + 516, 282], [x + 180, 282]]); text(back, x + 175, 290, 344, 48, 22);
  rows.forEach((row, i) => {
    box(x + 11, 360 + i * 64, 674, 54, '#FFFFFF');
    text(['I', 'II', 'III'][i], x + 21, 363 + i * 64, 50, 48, 27, true, 'center', blue);
    text(row, x + 79, 363 + i * 64, 592, 48, 23, false, 'left');
  });
}
box(20, 568, 1408, 90); text('Shared human-approved requirements Φ', 35, 575, 1378, 42, 32, true);
text('Task criteria · security properties · authorization scope', 35, 619, 1378, 33, 25);
box(20, 724, 369, 126); box(534, 724, 380, 126); box(1058, 724, 370, 126);
text('I   Action assurance', 32, 749, 345, 76, 30, true); text('II   Safety retention', 546, 749, 356, 76, 30, true); text('III   Workflow control', 1070, 749, 346, 76, 30, true);
arrow([[205, 724], [205, 690], [1243, 690], [1243, 724]]); box(612, 671, 224, 36, '#FFFFFF'); text('scoped approvals', 612, 671, 224, 36, 23);
arrow([[389, 802], [534, 802]]); text('checked\nfeedback', 393, 738, 136, 60, 23);
arrow([[914, 802], [1058, 802]]); text('version +\nevidence', 922, 738, 128, 60, 23);
arrow([[1243, 850], [1243, 901], [205, 901], [205, 850]], true);
arrow([[724, 901], [724, 850]], true); text('workflow feedback', 534, 914, 380, 35, 25);
text('Formal claims require faithful models, sound checking, and trusted enforcement;\ntests provide evidence for evaluated conditions.', 125, 970, 1198, 78, 24);

begin('formal-oversight-before-action', 'I. Formal Oversight Before Action', 'Proposed framework: specify properties, prove obligations, enforce execution');
stage(20, '1', 'Formal specification'); stage(514, '2', 'Proof checking'); stage(1008, '3', 'Execution gate');
cell(40, 254, 380, 175, 'Approved specification Φ', 'Task correctness\n+ security', 29);
cell(40, 474, 380, 240, 'Example security property', 'always:\nSend(d, r) ⇒ Authorized(d, r)\n\nEvery send must be authorized.', 23);
text('Review intent.\nProtect the specification.', 46, 790, 368, 95, 26);
text('Φ', 449, 475, 55, 40, 32); arrow([[440, 530], [514, 530]]);
cell(534, 254, 380, 188, 'Generate obligations', 'O := Obligations(M(x), Φ)\n\nModel candidate and tool effects.', 24);
arrow([[724, 442], [724, 496]]);
cell(534, 496, 380, 210, 'Prove and check every obligation', 'SMT solver / proof assistant\n\nCheck(proof, O) = valid', 24);
text('Verification target:\nM(x) ⊨ Φ', 534, 799, 380, 90, 29);
arrow([[914, 665], [924, 665], [924, 348], [914, 348]], true);
text('Repair candidate or proof', 545, 736, 367, 40, 23);
between(944, 'checked\nevidence');
box(1028, 254, 380, 385); text('Allow only when ALL hold', 1040, 270, 356, 48, 27, true);
['Proof accepted', 'Artifact, model and specification\nmatch checked versions', 'Permission valid at execution', 'Model assumptions still hold'].forEach((v, i) => {
  box(1044, 331 + i * 72, 348, 63, '#FFFFFF'); text(v, 1052, 337 + i * 72, 332, 51, 23);
});
decision(1028, 639, 380, 'Execute', 'Defer / review'); text('Enforce through trusted controls.', 1036, 845, 364, 65, 24);
footer('Assurance requires adequate specifications, faithful models, sound proof checking, and trusted enforcement.');

begin('preserving-safety-continual-updates', 'II. Preserving Safety Through Continual Updates', 'LLM or harness changes can invalidate existing guardrails');
stage(20, '1', 'Propose Δ'); stage(514, '2', 'Revalidate protection'); stage(1008, '3', 'Apply validated Δ');
cell(40, 254, 380, 179, 'Current system', 'Sₜ = (Lₜ, Hₜ)\nLLM + harness\nincluding guardrails', 25);
cell(40, 464, 380, 131, 'LLM learning', 'Paired authorized tasks', 26);
cell(40, 626, 380, 163, 'Harness upgrades', 'Tools · monitors\ntraining feedback', 26);
text('Test a candidate before release.', 46, 842, 368, 63, 25);
between(448, 'updated\ncandidate');
cell(534, 254, 380, 124, 'Protected requirements', 'Security · reliability · task completion', 22);
box(534, 408, 380, 305); text('Recheck existing guardrails', 548, 421, 352, 44, 27, true);
cell(550, 480, 348, 96, 'PolicyOK', 'Permissions · data boundaries', 22);
cell(550, 592, 348, 102, 'RetentionOK', 'Independent regression\nand adversarial tests', 22);
arrow([[600, 713], [600, 791]]); text('fail / unknown', 617, 735, 177, 40, 21);
cell(534, 791, 380, 131, 'Repair update or guardrails', 'Keep requirements unchanged', 23);
arrow([[850, 791], [850, 713]], true); text('retest', 852, 737, 60, 34, 20);
between(944, 'checked\nevidence');
cell(1028, 254, 380, 280, 'Update gate', 'Accept(Δ*) :=\nPolicyOK ∧ RetentionOK\n\nRelease the checked\nversion only', 26);
decision(1028, 534, 380, 'Apply Δ*', 'Retain Sₜ');
cell(1028, 747, 380, 175, 'On acceptance', 'Sₜ₊₁ = Update(Sₜ, Δ*)\n\nΔ*: checked change, including\nneeded guardrail repairs', 23);
arrow([[1218, 940], [1218, 965], [15, 965], [15, 343], [40, 343]]);
box(545, 946, 355, 37, '#FFFFFF'); text('Revalidate at every update', 545, 946, 355, 37, 24);
footer('Protection requirements stay fixed; guardrail implementations may evolve.');

begin('authorization-delegated-workflows', 'III. Authorization Across Delegated Workflows', 'A private report can leak through a delegated email draft');
stage(20, '1', 'A concrete handoff'); stage(514, '2', 'Track workflow context'); stage(1008, '3', 'Enforce and recover');
cell(40, 247, 380, 132, 'Approved task', 'Send a sanitized vendor update\nKeep customer IDs internal', 24);
arrow([[230, 379], [230, 421]]); text('delegated scope', 239, 381, 174, 37, 21);
cell(40, 421, 380, 132, 'Agent A: incident analyst', 'Reads private incident report\nDrafts the vendor update', 24);
arrow([[230, 553], [230, 591]]);
box(40, 591, 380, 126, '#FFFFFF', true); text('Handoff package', 54, 600, 352, 35, 28, true);
text('Task: send the vendor update\nPayload: draft with customer IDs', 54, 643, 352, 63, 23);
arrow([[230, 717], [230, 756]]); text('task + data', 240, 719, 173, 34, 21);
cell(40, 756, 380, 120, 'Agent B: vendor liaison', 'Can email the external vendor\nUses A’s draft as message content', 23);
text('Read access + email access\ndo not authorize disclosure.', 43, 883, 374, 50, 21);
between(448, 'authority +\ndata lineage');
cell(534, 254, 380, 174, 'ScopeOK', 'Within delegated authority', 26);
cell(534, 457, 380, 174, 'FlowOK', 'Preserves inherited\ndata restrictions', 26);
cell(534, 660, 380, 174, 'FreshOK', 'Approval dependencies\nremain valid', 26);
text('Revocation or changed context\ntriggers revalidation.', 545, 854, 358, 64, 25);
between(944, 'current\ncontext c');
cell(1028, 254, 380, 321, 'Workflow authorization rule', 'Allow(a, c) :=\nScopeOK ∧ FlowOK ∧ FreshOK\n\na: next delegated action\nc: current workflow context', 24);
decision(1028, 575, 380, 'Execute', 'Suspend /\nreplan');
text('Revalidate affected work;\npreserve valid progress.', 1040, 784, 356, 78, 25);
footer('Guarantees depend on captured effects and trusted enforcement. Recovery cannot undo completed disclosures.');

for (let i = 0; i < scenes.length; i++) {
  const s = scenes[i];
  const markup = s.items.map(a => {
    if (a.type === 'box') return `<rect x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" fill="${a.fill}" stroke="${rule}" stroke-width="1.6"${a.dashed ? ' stroke-dasharray="9 6"' : ''}/>`;
    if (a.type === 'text') return `<text x="${a.align === 'left' ? a.x : a.x + a.w / 2}" y="${a.y + a.h / 2}" dominant-baseline="central" text-anchor="${a.align === 'left' ? 'start' : 'middle'}" font-family="Arial, Helvetica, sans-serif" font-size="${a.size}" font-weight="${a.bold ? 700 : 400}" fill="${a.color}">${esc(a.line)}</text>`;
    return `<polyline points="${a.points.map(p => p.join(',')).join(' ')}" fill="none" stroke="${ink}" stroke-width="2"${a.dashed ? ' stroke-dasharray="9 6"' : ''}${a.head ? ' marker-end="url(#arrow)"' : ''}/>`;
  }).join('\n');
  await fs.writeFile(path.join(web, `${s.name}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title"><title id="title">${esc(s.title)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${ink}"/></marker></defs><rect width="${W}" height="${H}" fill="white"/>\n${markup}\n</svg>\n`);
  const preview = await deck.export({ slide: s.slide, format: 'png', scale: 1 });
  await fs.writeFile(path.join(draft, `slide-${i + 1}.png`), new Uint8Array(await preview.arrayBuffer()));
}
await (await PresentationFile.exportPptx(deck)).save(path.join(draft, 'candidate.pptx'));
console.log(`Created ${scenes.length} native editable slides and SVGs in ${web}`);
