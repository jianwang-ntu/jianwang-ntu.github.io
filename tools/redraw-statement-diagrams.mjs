// Faithful reconstruction: original canvas sizes, wording and object placement.
// Native editable PowerPoint objects + SVGs share this geometry. Only the two
// original role illustrations are raster crops, as requested by the author.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { Presentation, PresentationFile } = await import(process.env.ARTIFACT_TOOL_MODULE || '@oai/artifact-tool');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const draft = process.env.DIAGRAM_BUILD_DIR || path.join(root, '.codex-finalizer/restored');
const web = path.join(root, 'public/images/research');
await fs.mkdir(draft, { recursive: true });
const W = 1881, H = 1086;
const deck = Presentation.create({ slideSize: { width: W, height: H } });
const scenes = [];
const roleBytes = Object.fromEntries(await Promise.all(['human','robot'].map(async name => [name,await fs.readFile(path.join(web,'roles',`${name}.png`))])));
let scene;
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function begin(name, title, w, h, font='Arial Narrow', color='#11131A') {
  scene={name,title,w,h,font,color,dx:(W-w)/2,dy:(H-h)/2,items:[],slide:deck.slides.add()}; scenes.push(scene);
  scene.slide.background.fill='#FFFFFF';
  scene.slide.speakerNotes.textFrame.setText('Faithful editable reconstruction of the original author-provided diagram, retaining its wording and object coordinates. Original PNG and checksums: archive/statement-images/2026-10-07-before-editable-redraw/. The human and robot are separately cropped original artwork; all labels, formulas, boundaries and flow lines are native editable objects. The shared deck uses white margins to accommodate the different original aspect ratios.');
}
const pos=(x,y,w,h)=>({left:x+scene.dx,top:y+scene.dy,width:w,height:h});
function text(value,x,y,w,h,size=30,bold=false,align='center',font=scene.font,color=scene.color,italic=false) {
  const lines=value.split('\n'), lh=size*1.14, top=y+(h-lines.length*lh)/2;
  lines.forEach((line,i)=>{
    const ty=top+i*lh;
    const sh=scene.slide.shapes.add({geometry:'textbox',name:line.slice(0,64),position:pos(x,ty,w,lh),fill:'none',line:{fill:'none',width:0}});
    sh.text=line; sh.text.style={typeface:font,fontSize:size,bold,italic,color,alignment:align,verticalAlignment:'middle',autoFit:'none',wrap:'none',insets:{top:0,right:0,bottom:0,left:0}};
    scene.items.push({type:'text',line,x,y:ty,w,h:lh,size,bold,align,font,color,italic});
  });
}
function math(value,x,y,w,h,size=34,italic=true,font='Times New Roman') {text(value,x,y,w,h,size,false,'center',font,scene.color,italic);}
function box(x,y,w,h,fill='#FFFFFF',stroke=scene.color,width=2,dashed=false,geometry='rect') {
  const sh=scene.slide.shapes.add({geometry,name:'Editable boundary',position:pos(x,y,w,h),fill,line:{fill:stroke,width,style:dashed?'dashed':'solid'}});
  scene.items.push({type:'box',x,y,w,h,fill,stroke,width,dashed,geometry});return sh;
}
function badge(value,x,y,w,h,size=34) {box(x,y,w,h,'#FFFFFF',scene.color,2.4,false,'ellipse');text(value,x,y,w,h,size,true);}
function arrow(points,dashed=false,head=true,width=2.4) {
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(1,Math.max(...xs)-x),h=Math.max(1,Math.max(...ys)-y);
  scene.slide.shapes.add({geometry:'custom',name:'Editable flow path',position:pos(x,y,w,h),fill:'none',line:{fill:scene.color,width,style:dashed?'dashed':'solid'},customPaths:[{width:w,height:h,commands:points.map(([px,py],i)=>({[i?'lineTo':'moveTo']:{x:px-x,y:py-y}}))}]});
  if(head){
    const [ex,ey]=points.at(-1),[px,py]=points.at(-2),angle=Math.atan2(ey-py,ex-px),ux=Math.cos(angle),uy=Math.sin(angle);
    const vertices=[[ex,ey],[ex-16*ux-7*uy,ey-16*uy+7*ux],[ex-16*ux+7*uy,ey-16*uy-7*ux]];
    const hx=Math.min(...vertices.map(p=>p[0])),hy=Math.min(...vertices.map(p=>p[1]));
    const hw=Math.max(...vertices.map(p=>p[0]))-hx,hh=Math.max(...vertices.map(p=>p[1]))-hy;
    scene.slide.shapes.add({geometry:'custom',name:'Editable arrowhead',position:pos(hx,hy,hw,hh),fill:scene.color,line:{fill:'none',width:0},customPaths:[{width:hw,height:hh,commands:[...vertices.map(([vx,vy],i)=>({[i?'lineTo':'moveTo']:{x:vx-hx,y:vy-hy}})),{close:{}}]}]});
  }
  scene.items.push({type:'arrow',points,dashed,head,width,color:scene.color});
}
function role(name,x,y,w,h,alt) {
  scene.slide.images.add({blob:roleBytes[name],contentType:'image/png',alt,fit:'contain',position:pos(x,y,w,h)});
  scene.items.push({type:'role',name,x,y,w,h,alt});
}

// Overview: original 1448 × 1086. Retain all thirteen website link regions.
begin('reliable-agents-human-control','Reliable AI Agents Under Human Control',1448,1086,'Times New Roman','#060606');
text(scene.title,180,0,1088,60,45,true);
text('A proposed research agenda for actions, system updates, and delegation',110,61,1228,41,34);
box(20,109,697,444);box(732,109,696,444);
text('Human–Agent Interaction',35,116,667,43,33,true);
text('Agent–Agent Collaboration',747,116,666,43,33,true);
role('human',46,163,230,156,'Human at a laptop, cropped from the original overview');
role('robot',536,161,126,154,'AI agent, cropped from the original overview');
role('robot',790,161,126,154,'Agent A, original robot artwork');
role('robot',1246,161,126,154,'Agent B, original robot artwork');
text('Human',57,319,211,32,24,true);text('AI agent',528,319,147,32,24,true);
text('Agent A',780,319,146,32,24,true);text('Agent B',1237,319,145,32,24,true);
text('Task + authorized scope',286,197,234,37,23);arrow([[286,234],[520,234]]);
arrow([[520,270],[286,270]]);text('Action proposal + evidence',285,276,236,34,22);
text('Subtask + data + constraints',947,197,280,37,22);arrow([[947,234],[1227,234]]);
arrow([[1227,270],[947,270]]);text('Proposal + evidence + status',946,276,281,34,22);
const humanRows=['Check proposed actions against approved requirements','Evaluate security and reliability after system updates','Enforce current scope and permissions across task steps'];
const agentRows=['Check proposed actions using independent evidence','Assess retention after either agent or harness updates','Enforce inherited data limits and valid delegation scope'];
for(const [x,rows] of [[31,humanRows],[745,agentRows]]) rows.forEach((label,i)=>{
  const y=360+i*64;box(x,y,673,54);badge(['I','II','III'][i],x+16,y+5,49,45,30);text(label,x+93,y+5,572,44,24,false,'left');
});
box(20,568,1408,90);text('Shared human-approved requirements Φ',50,573,1348,47,38,true);
text('Task criteria · security properties · authorization scope',50,618,1348,35,30);
arrow([[205,724],[205,689],[1241,689],[1241,724]],false,true,3);
box(628,670,191,35,'#FFFFFF','#FFFFFF',0);text('scoped approvals',628,670,191,35,28);
for(const [x,w,badgeX,label,n] of [[20,369,37,'Action assurance','I'],[533,381,550,'Safety retention','II'],[1058,370,1075,'Workflow control','III']]){
  box(x,724,w,126,'#FFFFFF','#060606',2.5);badge(n,badgeX,752,63,65,44);text(label,x+107,753,w-132,65,30,true);
}
arrow([[389,802],[533,802]],false,true,3);text('checked\nfeedback',400,739,125,61,27);
arrow([[914,802],[1058,802]],false,true,3);text('version +\nevidence',927,739,119,61,27);
arrow([[1241,850],[1241,900],[205,900],[205,850]],true,true,2.4);arrow([[724,900],[724,850]],true,true,2.4);
text('workflow feedback',550,906,348,34,29);
text('Formal claims require faithful models, sound checking, and trusted enforcement;\ntests provide evidence for evaluated conditions.',190,971,1068,70,29);

// I: original wide layout, including proof equation rows and repair loop label.
begin('formal-oversight-before-action','Formal Oversight Before Action',1870,841,'Arial Narrow','#11151D');
text(scene.title,275,0,1320,70,54,true,'center','Arial','#050509');
text('Proposed framework: specify properties, prove obligations, enforce execution',250,77,1370,45,38);
box(29,156,555,618);box(655,156,581,618);box(1315,156,530,618);
text('1   Formal specification',60,172,502,60,48,true);
text('2   Formal proof checking',676,172,540,60,48,true);
text('3   Execution gate',1336,172,488,60,48,true);
box(51,253,511,179,'#F8F8F8');text('Approved specification Φ',76,286,461,51,40,true);
text('Task correctness + security',76,346,461,43,33);
box(51,472,511,197,'#F8F8F8','#D0D0D0',1.3);text('Example security property',79,488,455,43,32,true,'left');
math('always:  Send(d, r) ⇒ Authorized(d, r)',70,541,474,46,29,false);
text('Every send must be authorized.',79,600,455,45,30,false,'left');
text('Review intent. Protect the specification.',56,708,505,50,30);
math('Φ',594,407,49,48,40);arrow([[584,463],[655,463]]);
box(681,253,476,188,'#F8F8F8');text('Generate logical obligations',701,264,436,44,30,true);
box(701,321,437,57,'#FAFAFA','#D0D0D0',1.2);math('O := Obligations(M(x), Φ)',710,326,419,48,33,false);
text('Model the candidate and tool effects.',701,384,437,44,28);
arrow([[918,441],[918,486]]);
box(681,486,476,191,'#F8F8F8');text('Prove and check every obligation',702,495,435,47,32,true);
box(701,554,437,51,'#FAFAFA','#D0D0D0',1.2);text('SMT solver / proof assistant',715,559,409,42,29);
box(701,605,437,54,'#FAFAFA','#D0D0D0',1.2);math('Check(proof, O) = valid',715,608,409,46,29,false,'Courier New');
arrow([[1157,594],[1212,594],[1212,312],[1157,312]],true);
box(1163,400,75,93,'#FFFFFF','#FFFFFF',0);text('Repair\ncandidate\nor proof',1165,398,72,96,25);
text('Verification target:',716,706,256,48,33);math('M(x) ⊨ Φ',963,704,257,52,36);
arrow([[1270,463],[1315,463]]);
box(1339,253,484,300,'#F8F8F8');text('Allow only when ALL hold',1360,265,442,47,34,true);
['Proof accepted','Artifact, model, spec match proof','Permission valid at execution','Model assumptions still hold'].forEach((v,i)=>{
  box(1359,321+i*55,447,48,'#FAFAFA','#D0D0D0',1.2);text(v,1395,325+i*55,400,41,29,false,'left');
});
arrow([[1580,553],[1580,594]],false,false);arrow([[1580,594],[1478,594],[1478,643]]);arrow([[1580,594],[1665,594],[1665,643]]);
text('all true',1375,582,97,39,25);text('false or unknown',1674,582,151,39,24);
box(1339,643,232,63,'#F8F8F8');box(1594,643,229,63,'#F8F8F8');
text('Execute',1350,650,210,49,33,true);text('Defer / review',1600,650,216,49,33,true);
text('Enforce through trusted controls.',1343,718,475,42,30);
text('Assurance requires faithful models, sound proof checking, and trusted enforcement.',340,791,1190,41,30);

// II: preserve all original boxes, number badges, decision text and outer loop.
begin('preserving-safety-continual-updates','Preserving Safety Through Continual Updates',1870,841,'Arial Narrow','#08090B');
text(scene.title,245,0,1380,63,44,true,'center','Arial');text('LLM or harness changes can invalidate existing guardrails',300,65,1270,43,40);
box(26,138,531,588);box(676,138,519,588);box(1316,138,529,588);
for(const [x,n,label,w] of [[49,'1','Propose Δ',404],[699,'2','Revalidate protection',410],[1338,'3','Apply validated Δ',425]]){
 badge(n,x,147,63,61,40);text(label,x+94,148,w-73,59,42,true,'left');
}
box(66,220,464,173,'#F8F8F8');text('Current system',88,234,420,46,34,true);math('Sₜ = (Lₜ, Hₜ)',114,282,368,51,42);text('LLM + harness, including guardrails',85,337,426,39,28);
box(76,408,447,100,'#F8F8F8');text('LLM learning',97,418,405,40,32,true);text('Paired authorized tasks',97,461,405,37,28);
box(76,524,447,101,'#F8F8F8');text('Harness upgrades',97,534,405,40,32,true);text('Tools · monitors · training feedback',95,577,409,37,28);
text('Test a candidate before release.',84,660,426,48,29);
text('updated\ncandidate',561,357,109,61,26);arrow([[557,425],[676,425]]);
box(701,219,471,96,'#F8F8F8');text('Protected requirements',722,229,429,41,33,true);text('Security · reliability · task completion',716,270,442,35,27);
box(701,331,471,224,'#F8F8F8');text('Recheck existing guardrails',722,336,429,42,33,true);
box(726,384,421,73,'#FAFAFA','#9DA6AF',1.1);text('PolicyOK',740,389,393,34,29,true);text('Permissions · data boundaries',740,423,393,31,25);
box(726,470,421,73,'#FAFAFA','#9DA6AF',1.1);text('RetentionOK',740,475,393,34,29,true);text('Independent regression and adversarial tests',737,509,399,30,25);
arrow([[814,555],[814,616]]);text('fail / unknown',829,565,160,39,26);
arrow([[1044,616],[1044,555]],true);text('retest',1058,565,93,39,26);
box(700,616,472,87,'#F8F8F8');text('Repair update or guardrails',720,624,432,39,33,true);text('Keep requirements unchanged',720,665,432,32,27);
text('checked\nevidence',1200,357,109,61,26);arrow([[1195,425],[1316,425]]);
box(1343,219,475,206,'#F8F8F8');text('Update gate',1365,229,431,43,34,true);
math('Accept(Δ*) :=',1400,278,360,43,36);math('PolicyOK ∧ RetentionOK',1360,324,440,44,36);
text('Release the checked version only',1360,377,440,36,29);
arrow([[1581,425],[1581,458]],false,false);arrow([[1581,458],[1487,458],[1487,501]]);arrow([[1581,458],[1670,458],[1670,501]]);
text('pass',1413,439,63,39,26);text('fail / unknown',1680,439,150,39,26);
box(1335,501,241,64,'#F8F8F8');box(1594,501,235,64,'#F8F8F8');text('Apply Δ*',1344,508,223,47,33,true);text('Retain Sₜ',1605,508,213,47,33,true);
box(1332,582,498,131,'#F8F8F8');text('On acceptance:',1350,588,462,42,34,true);math('Sₜ₊₁ = Update(Sₜ, Δ*)',1356,630,450,45,35);
text('Δ*: checked change, including needed guardrail repairs',1343,675,476,31,24);
arrow([[1581,726],[1581,769],[43,769],[43,302],[66,302]]);
box(776,731,338,35,'#FFFFFF','#FFFFFF',0);text('Revalidate at every update',776,731,338,35,29);
text('Protection requirements stay fixed; guardrail implementations may evolve.',350,791,1170,39,28);

// III: original serif typography, full handoff text, context boxes and rule.
begin('authorization-delegated-workflows','III. Authorization Across Delegated Workflows',1881,836,'Times New Roman','#080808');
text(scene.title,205,0,1471,63,50,true);text('A private report can leak through a delegated email draft.',260,62,1361,44,37);
box(29,114,530,696);box(679,147,524,623);box(1322,147,533,623);
badge('1',49,123,65,61,40);text('A concrete handoff',140,124,396,57,41,true,'left');
badge('2',699,156,65,61,40);text('Track workflow context',790,159,399,54,37,true,'left');
badge('3',1340,156,65,61,40);text('Enforce and recover',1432,159,405,54,38,true,'left');
box(55,196,481,105,'#F8F8F8');text('Approved task',74,198,443,38,32,true);text('Send a sanitized vendor update\nKeep customer IDs internal',74,235,443,59,28);
arrow([[295,301],[295,347]]);text('delegated scope',313,305,207,39,28,false,'left');
box(55,347,481,104,'#F8F8F8');text('Agent A: incident analyst',74,349,443,39,32,true);text('Reads private incident report\nDrafts the vendor update',74,388,443,57,28);
arrow([[295,451],[295,488]]);
box(55,488,481,109,'#F8F8F8',scene.color,2,true);text('Handoff package',74,489,443,40,32,true);text('Task: send the vendor update\nPayload: draft containing customer IDs',69,529,453,59,27);
arrow([[295,597],[295,637]]);text('task + data',313,599,207,35,28,false,'left');
box(55,637,481,101,'#F8F8F8');text('Agent B: vendor liaison',74,638,443,39,32,true);text('Can email the external vendor\nUses A’s draft as message content',74,677,443,56,28);
text('Read access + email access\ndo not authorize disclosure.',68,745,455,57,28);
text('authority +\ndata lineage',559,366,120,62,27);arrow([[559,439],[679,439]]);
box(702,235,478,122,'#F8F8F8');text('ScopeOK',720,251,442,44,36,true);text('Within delegated authority',720,299,442,43,30);
box(702,383,478,127,'#F8F8F8');text('FlowOK',720,402,442,44,36,true);text('Preserves inherited data restrictions',714,454,454,41,30);
box(702,537,478,124,'#F8F8F8');text('FreshOK',720,552,442,44,36,true);text('Approval dependencies remain valid',714,605,454,40,30);
text('Revocation or changed context\ntriggers revalidation.',703,685,477,65,30);
text('current\ncontext c',1209,367,107,62,27);arrow([[1203,439],[1322,439]]);
box(1342,235,494,263,'#F8F8F8');text('Workflow authorization rule',1355,246,468,47,35,true);
math('Allow(a, c) :=',1400,304,378,46,38);math('ScopeOK ∧ FlowOK ∧ FreshOK',1352,352,474,46,35);
text('a: next delegated action\nc: current workflow context',1367,406,444,65,29);
arrow([[1587,498],[1587,542]],false,false);arrow([[1587,542],[1485,542],[1485,601]]);arrow([[1587,542],[1667,542],[1667,601]]);
text('all pass',1377,524,102,40,27);text('false / unknown',1680,524,162,40,27);
box(1342,601,242,75,'#F8F8F8');box(1604,601,237,75,'#F8F8F8');text('Execute',1354,610,218,58,34,true);text('Suspend / replan',1614,610,217,58,29,true);
text('Revalidate affected work; preserve valid progress.',1333,716,513,40,25);
text('Guarantees depend on captured effects and trusted enforcement.',505,789,871,43,26);

await fs.writeFile(path.join(draft,'canvas-bounds.json'),JSON.stringify(scenes.map(s=>({name:s.name,w:s.w,h:s.h,dx:s.dx,dy:s.dy})),null,2));
for(let i=0;i<scenes.length;i++){
 const s=scenes[i];
 const markup=s.items.map(a=>{
  if(a.type==='box') return a.geometry==='ellipse'?`<ellipse cx="${a.x+a.w/2}" cy="${a.y+a.h/2}" rx="${a.w/2}" ry="${a.h/2}" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a.width}"/>`:`<rect x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" fill="${a.fill}" stroke="${a.stroke}" stroke-width="${a.width}"${a.dashed?' stroke-dasharray="10 6"':''}/>`;
  if(a.type==='text') return `<text x="${a.align==='left'?a.x:a.x+a.w/2}" y="${a.y+a.h/2}" dominant-baseline="central" text-anchor="${a.align==='left'?'start':'middle'}" font-family="${a.font}, ${a.font==='Times New Roman'?'serif':'sans-serif'}" font-size="${a.size}" font-weight="${a.bold?700:400}" font-style="${a.italic?'italic':'normal'}" fill="${a.color}">${esc(a.line)}</text>`;
  if(a.type==='role')return `<image class="original-role" data-role="${a.name}" x="${a.x}" y="${a.y}" width="${a.w}" height="${a.h}" href="data:image/png;base64,${roleBytes[a.name].toString('base64')}" aria-label="${esc(a.alt)}"/>`;
  return `<polyline points="${a.points.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${a.color}" stroke-width="${a.width}"${a.dashed?' stroke-dasharray="10 6"':''}${a.head?' marker-end="url(#arrow)"':''}/>`;
 }).join('\n');
 await fs.writeFile(path.join(web,`${s.name}.svg`),`<svg xmlns="http://www.w3.org/2000/svg" width="${s.w}" height="${s.h}" viewBox="0 0 ${s.w} ${s.h}" role="img" aria-labelledby="title"><title id="title">${esc(s.title)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${s.color}"/></marker></defs><rect width="${s.w}" height="${s.h}" fill="white"/>\n${markup}\n</svg>\n`);
 const preview=await deck.export({slide:s.slide,format:'png',scale:1});await fs.writeFile(path.join(draft,`slide-${i+1}.png`),new Uint8Array(await preview.arrayBuffer()));
}
await(await PresentationFile.exportPptx(deck)).save(path.join(draft,'candidate.pptx'));
console.log('Created four faithful native-object slides and original-size SVGs.');
