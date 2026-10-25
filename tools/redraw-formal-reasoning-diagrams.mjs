// Native PowerPoint reconstruction of the four consolidated research figures.
// No figure is embedded as a flattened picture. Text, boundaries, symbols,
// flow paths, arrowheads, and section links are individual editable objects.
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
    `Research statement: https://www.wj2ai.com/statement/\n\n` +
    ({
      'overview': 'Verification tools may check proofs and produce diagnostic results. Proof rejection, a validated counterexample to a stated claim, and an unknown result are different outcomes. The research directions are hypotheses to evaluate.',
      'learning-proof-strategies': 'Compare retrieval, inference-time refinement, and learning across training tasks. Freeze model weights and the retrieval bank before held-out evaluation. Exclude test proofs and keep related program transformations in the same split. Validate counterexamples against the actual obligation and execution model. A failed auxiliary invariant does not necessarily demonstrate a program defect.',
      'compositional-verification': 'Check a composition argument as well as each local proof. Caller preconditions, frame and shared-state obligations, and environmental assumptions must support the stated global property in the same model. Relevant changes require affected local and composition obligations to be rechecked.',
      'trustworthy-feedback': 'Theorem acceptance and intended-requirement assessment are distinct. Assess whether assumptions are consistent, feasible, and justified. Record evidence eligible for a declared learning or change-review use, with provenance and limitations. Requirement tests can be incomplete. A validated counterexample can be useful bug-finding evidence without counting as proof success.',
    }[name] || ''));
  text(title, 115, 8, 1442, 62, 46, true, 'center', 'Arial');
  text(subtitle, 150, 75, 1372, 44, 29);
  text('Proposed research', 1420, 20, 230, 30, 21);
}
function text(value, x, y, w, h, size = 27, bold = false, align = 'center', font = 'Arial', link) {
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
  text(note, 40, 893, 1592, 32, 21);
  // Sources are linked in the HTML caption and retained in speaker notes.
}
function sectionPanel(label, subtitle, x, y, w, h, letter, url) {
  box(x, y, w, h, `${label} panel`); badge(letter, x + 16, y + 11, 44);
  text(label, x + 76, y + 11, w - 92, 34, 27, true, 'left', 'Arial', url);
  text(subtitle, x + 76, y + 48, w - 92, 28, 23, false, 'left');
}

// 1. Overview: preserve the five-stage mechanism and three linked research areas.
start('overview', 'Learning Reusable Formal Reasoning', 'Learn from verification, compose proofs, and assess what the evidence supports');
const overviewNodes = [[31,275,'Code and\ntest harness'],[359,266,'Approved\nproperty'],[681,308,'Agent proposes\nproof artifacts'],[1037,256,'Independent\nverification'],[1324,319,'Verification\noutcomes']];
for (const [i,[x,w,label]] of overviewNodes.entries()) {
  box(x,144,w,230,'Research mechanism'); badge(String(i+1),x+w/2-19,125);
  text(label,x+12,164,w-24,64,26,true);
}
text('Existing software',47,232,243,28,23);
document(87,271,47,62,'code'); document(211,271,47,62);
text('Program',51,340,112,25,23); text('Tests',173,340,112,25,23);
text('State the input domain\nand execution model.',375,239,234,60,22);
text('Harness-derived claims\nretain the harness scope.',371,310,242,51,21);
document(707,256,48,78); text('Invariants\nContracts\nLemmas',778,246,191,101,24,false,'left');
check(1138,250,48); text('Check formal claims.\nRecord diagnostics.',1048,314,234,54,21);
for(const [i,label] of ['Proof checked','Proof rejected','Valid counterexample','Unknown / timeout'].entries()) {
  const y=238+i*31;
  if(i===0) check(1341,y+5,17); else if(i===1) cross(1341,y+5,16); else text(i===2?'!':'?',1337,y,26,28,24,true);
  text(label,1375,y,256,28,21,false,'left');
}
for(const [a,b] of [[306,359],[625,681],[989,1037],[1293,1324]]) pathShape([[a,263],[b,263]]);
pathShape([[1470,374],[1470,416],[833,416],[833,374]],true);
text('Use feedback to revise proofs',892,380,500,33,25,true);
pathShape([[837,416],[837,438],[319,438],[319,494]],true);
pathShape([[837,438],[728,438],[728,494]],true);
pathShape([[837,438],[1356,438],[1356,494]],true);
text('Transfer across tasks',338,450,290,28,22);
text('Reuse across components',756,450,325,28,22);
text('Audit intended use',1380,450,245,28,22);
sectionPanel('Learn proof strategies','What transfers to new programs?',31,495,559,320,'A','https://www.wj2ai.com/statement#learning-reusable-proof-strategies');
smallDocStack(57,625,47,62); text('Checked\nproofs',40,698,118,52,22);
pathShape([[128,654],[194,654]]); box(195,592,237,134,'Learned strategy');
text('Learned strategy',207,603,213,34,24,true);
text('Choose assertions\nReuse proof patterns',207,650,213,58,21);
pathShape([[432,654],[477,654]]); document(490,617,47,66);
text('New\nprograms',465,698,110,52,22);
box(51,761,519,42,'Retrieval and search comparison',true);
text('Compare learning with retrieval and search.',65,766,491,32,21);
sectionPanel('Compose local proofs','When do local proofs compose?',611,495,476,320,'B','https://www.wj2ai.com/statement#compositional-verification');
box(632,622,195,95,'Local evidence'); text('Local proofs',644,631,171,30,24,true);
text('Library contracts\nCaller conditions',640,668,179,43,21);
pathShape([[827,670],[851,670]]);
box(851,622,215,95,'Composition argument'); text('Composition',862,631,193,30,24,true);
text('Interfaces, state,\nand assumptions',862,668,193,43,21);
pathShape([[958,717],[958,738]]);
text('Show local claims imply\nthe global property',646,743,407,60,22,true);
sectionPanel('Audit the evidence','Does the claim match the goal?',1110,495,532,320,'C','https://www.wj2ai.com/statement#trustworthy-verification-feedback');
for(const [x,w,label] of [[1127,145,'Intended\ngoal'],[1287,177,'Exact\nartifacts'],[1475,154,'Model\nassumptions']]) {
  box(x,590,w,105,'Evidence assessment input'); text(label,x+8,599,w-16,54,22,true);
  document(x+w/2-18,655,36,31);
}
pathShape([[1198,695],[1198,714],[1554,714],[1554,695]],false,false);
pathShape([[1380,714],[1380,738]]); box(1205,739,360,64,'Assess evidence');
text('Assess coverage and limits',1215,747,340,47,23,true);
box(189,835,1294,53,'Research goal');
text('Goal: reusable, independently checked software evidence',205,843,1262,36,30,true);
footer('Every guarantee is limited by the approved property, model, assumptions, and trusted checking.');

// 2. Learning: four distinct outcomes and three experimental mechanisms.
start('learning-proof-strategies','Learning Reusable Proof Strategies','What transfers from training to unfamiliar programs?');
const learningNodes=[[30,250,'Code and\ntest harness'],[380,260,'Approved\nproperty'],[720,280,'Propose proof\nartifacts'],[1080,245,'Verification\ntools']];
for(const [x,w,label] of learningNodes) {box(x,155,w,145,label.replace('\n',' '));text(label,x+90,170,w-104,63,24,true,'left');}
document(52,190,44,61); text('Existing software',48,263,213,29,21);
document(401,190,43,61); text('Domain and model',396,263,228,29,21);
document(742,190,45,54); text('Invariants, contracts,\nand lemmas',735,247,250,50,22);
magnifier(1101,188,39); text('Proof checks\nand diagnostics',1091,247,222,50,22);
for(const [a,b] of [[280,380],[640,720],[1000,1080]]) pathShape([[a,226],[b,226]]);
pathShape([[1325,226],[1350,226]],false,false);
for(const [i,label] of ['Proof checked','Proof rejected','Valid\ncounterexample','Unknown / timeout'].entries()) {
 const y=126+i*60; box(1390,y,255,52,'Distinct verification outcome');
 if(i===0) check(1404,y+16,21); else if(i===1) cross(1404,y+16,20); else text(i===2?'!':'?',1398,y+6,34,40,30,true);
 text(label,1440,y+4,194,44,i===2?21:22,i===0);
 pathShape([[1350,226],[1350,y+26],[1390,y+26]]);
}
pathShape([[1350,226],[1350,388],[860,388],[860,300]],true);
text('Guide the next proof attempt',900,343,430,33,24,true);
text('Compare three mechanisms under matched data, tools, and total cost',60,410,1552,35,29,true);
const methods=[[40,'Retrieve','Reuse a stored proof artifact.'],[586,'Refine','Revise within one task.'],[1132,'Learn','Learn across training tasks.']];
for(const [x,label,sub] of methods) {box(x,465,500,228,'Experimental mechanism');text(label,x+20,476,460,40,32,true);text(sub,x+20,523,460,31,24);}
database(139,570,58,67);pathShape([[223,604],[315,604]]);document(341,570,48,65);
text('Recheck it for the new obligation.',61,648,458,32,23);
document(675,570,48,65);pathShape([[757,604],[852,604]]);document(886,570,48,65);
text('Use feedback with model weights fixed.',607,648,458,32,22);
document(1220,570,48,65);pathShape([[1295,604],[1374,604]]);box(1395,575,190,57,'Learned model');text('Model',1407,584,166,39,27,true);
text('Compare proofs, checked steps, and revisions.',1153,648,458,32,21);
for(const x of [290,836,1382])pathShape([[x,693],[x,734]]);
box(40,735,1592,93,'Held-out evaluation');text('Held-out evaluation',70,746,1532,35,30,true);
text('Freeze model weights and the retrieval bank before testing.',70,789,1532,28,24);
text('Keep related programs in the same split. Report retrieval, refinement, and learned transfer separately.',40,835,1592,31,23);
text('Proof rejection does not refute a claim. Validate counterexamples against the stated claim and model.\nA failed auxiliary invariant need not imply a software bug. Unknown results and timeouts are inconclusive.',40,883,1592,51,21);

// 3. Composition: the global argument must be checked as well as local proofs.
start('compositional-verification','Compositional Verification','Check local proofs and the argument that connects them');
box(30,230,180,320,'Global verification goal');badge('1',101,211);
document(96,277,48,68);text('Global\nverification\ngoal',44,377,152,109,26,true);
box(255,230,200,320,'Proposed decomposition');badge('2',336,211);tree(320,285,65,65);
text('Propose a\ndecomposition',267,391,176,87,24,true);pathShape([[210,390],[255,390]]);
box(500,225,650,355,'Local obligations',true);badge('3',520,176);
text('Check local obligations',580,173,540,43,29,true,'left');
for(const [y,label] of [[250,'Library A'],[355,'Library B'],[460,'Caller']]) {
 box(520,y,180,80,'Software component');text(label,532,y+19,156,42,24,true);
 box(735,y,210,80,'Contract and local proof');text('Contract and\nlocal proof',747,y+10,186,60,23);
 box(980,y,150,80,'Local proof check');text('Proof\ncheck',992,y+10,126,60,24,true);
 pathShape([[455,390],[477,390],[477,y+40],[520,y+40]]);
 pathShape([[700,y+40],[735,y+40]]);pathShape([[945,y+40],[980,y+40]]);
 pathShape([[1130,y+40],[1172,y+40],[1172,390],[1195,390]]);
}
box(1195,230,250,320,'Composition argument check');badge('4',1301,211);
text('Check\ncomposition',1207,249,226,67,26,true);
text('Caller preconditions\nShared state / frames\nModel and assumptions',1207,337,226,97,21);
text('Do these local claims\nimply the global goal?',1207,467,226,65,21);
box(1490,230,150,320,'Checked global claim');badge('5',1546,211);document(1541,282,48,68);
text('Checked\nglobal claim',1499,387,132,87,22,true);pathShape([[1445,390],[1490,390]]);
pathShape([[1320,550],[1320,611],[355,611],[355,550]],true);
text('Revise unproved obligations',590,617,560,35,26,true);
box(30,680,865,180,'Proof reuse across callers');text('Reuse requires each caller to meet the library contract',50,692,825,37,26,true,'left');
box(50,746,260,85,'Checked dependency');text('Shared library proof\nand contract',62,760,236,58,23);
for(const [y,n] of [[739,1],[802,2]]) {box(505,y,365,46,'Caller obligations');text('Caller '+n+': prove preconditions',517,y+5,341,35,22);pathShape([[310,788],[456,788],[456,y+23],[505,y+23]]);}
box(930,680,710,180,'Revalidation after changes');text('After any relevant change',951,692,668,37,27,true,'left');
box(950,746,300,85,'Relevant change');text('Code, contract, property,\nmodel, or assumptions',962,758,276,60,21);
box(1305,746,315,85,'Affected obligation revalidation');text('Recheck affected local\nand composition obligations',1317,758,291,60,21);pathShape([[1250,788],[1305,788]]);
footer('Composition requires discharged caller obligations and a checked argument from local claims to the global property.');

// 4. Audit: theorem checking and requirement assessment serve different roles.
start('trustworthy-feedback','Trustworthy Verification Feedback','A checked theorem still needs a review of its scope and intended use');
const auditStages=[[30,330,'Fix the\nverification target'],[405,280,'Check the\nformal claim'],[730,510,'Assess the evidence'],[1285,355,'Record the\nallowed use']];
for(const [i,[x,w,label]] of auditStages.entries()) {box(x,190,w,400,'Evidence review stage');badge(String(i+1),x+w/2-19,171);text(label,x+16,212,w-32,70,28,true);}
for(const [i,label] of ['Approved property','Exact code version','Input domain and model','Stated assumptions','Candidate proof'].entries()) text(label,49,304+i*49,292,34,i===2?22:24,i===0,'left');
check(522,302,47);text('Accepted proof\nestablishes the\nstated theorem.',423,370,244,100,24,true);
text('Rejected or unknown:\nclaim remains unproved.',422,505,246,65,21);
for(const [i,[heading,detail]] of [
 ['Requirement coverage','Does the claim address the intended goal?'],
 ['Artifact match','Same code, property, model, and assumptions?'],
 ['Assumption validity','Consistent, feasible, and justified?'],
 ['Behavior preservation','Evidence that required behavior is preserved?'],
].entries()) {const y=292+i*71;text(heading,750,y,470,29,24,true,'left');text(detail,750,y+32,470,33,21,false,'left');}
text('Under declared criteria',1303,303,319,34,22);
text('Eligible evidence\nfor learning or\nchange review',1303,366,319,107,26,true);
text('Record scope, limitations,\nand approval conditions.',1303,512,319,58,22);
for(const [a,b] of [[360,405],[685,730],[1240,1285]])pathShape([[a,390],[b,390]]);
pathShape([[545,590],[545,654]]);text('Not\nestablished',560,600,154,48,21,false,'left');
pathShape([[985,590],[985,654]]);text('Failed or\ninconclusive',1001,600,232,48,21,false,'left');
box(30,655,330,95,'Protected requirements');text('Protect requirements\nand acceptance rules',47,672,296,61,24,true);
box(405,655,1235,95,'Investigation and review');text('Investigate, revise, or request review',430,665,1185,39,30,true);
text('Keep rejected proofs, valid counterexamples, and unknown results separate.',430,709,1185,30,23);
text('Failure cases to audit',30,774,1610,33,26,true,'left');
for(const [x,w,heading,detail] of [[30,500,'Weak property','Important requirements are left unspecified.'],[576,500,'Unrealistic assumptions','Conditions are inconsistent or never feasible.'],[1122,518,'Behavior removed','The patch disables required functionality.']]) {
 box(x,820,w,70,'Failure case');text(heading,x+15,825,w-30,30,25,true,'left');text(detail,x+15,859,w-30,26,21,false,'left');
}
text('A checked proof establishes its theorem. Requirement tests can still miss required behavior.',40,908,1592,27,20);

// Export editable native objects and full-resolution authoring previews.
if(textOverflows.length)throw new Error(textOverflows.join('\n'));
for(const [i,s] of scenes.entries()) {
 const png=await deck.export({slide:s.slide,format:'png',scale:1});
 await fs.writeFile(path.join(build,'slide-'+(i+1)+'.png'),new Uint8Array(await png.arrayBuffer()));
 const layout=await s.slide.export({format:'layout'});
 await fs.writeFile(path.join(build,'slide-'+(i+1)+'.layout.json'),await layout.text());
}
await (await PresentationFile.exportPptx(deck)).save(path.join(build,'candidate.pptx'));
await fs.writeFile(path.join(build,'scenes.json'),JSON.stringify(scenes.map(({name,title,items})=>({name,title,items})),null,2));
await fs.writeFile(path.join(build,'deck.json'),JSON.stringify(deck.toProto()));
console.log('Created '+scenes.length+' reviewed editable slides in '+build);
