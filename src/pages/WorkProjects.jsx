import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import { Box, Chip, SectionHead, Status, Tag } from '../components/primitives.jsx';
import { WORK, PROJECTS } from '../data.jsx';

function Stat({ v, l, s }) {
  return (
    <div className="wp-stat" style={{ flex: 1 }}>
      <div className="v">{v}</div>
      <div className="l">{l}</div>
      {s && <div className="s">{s}</div>}
    </div>
  );
}

function WorkRow({ w, last }) {
  return (
    <div className={'wp-row ' + (last ? 'last ' : '') + (w.pivot ? 'pivot-on' : '')}>
      <div className="wp-when">
        <div className="yr">{w.year}</div>
        <div style={{ marginTop: 6 }}>
          <span className={'status ' + (w.kind === 'RESEARCH' ? 'active' : 'paused')}>{w.kind}</span>
        </div>
        {w.pivot && <div className="pivot">↳ on the<br />code-LLM<br />arc</div>}
      </div>
      <div className="spine">
        <div className="line" />
        <div className="dot" />
      </div>
      <div className="body">
        <div className="role">{w.role}</div>
        <div className="where">{w.where}</div>
        <div className="two">
          <div>
            <div className="kicker">WHAT I BUILT</div>
            <div className="what" style={{ marginTop: 4 }}>{w.what}</div>
            <div className="stack">{w.stack.map((s) => <Tag key={s}>{s}</Tag>)}</div>
          </div>
          <Box dashed className="transfer">
            <div className="label">SKILL TRANSFER → CODE LLM SECURITY</div>
            <div className="body">{w.transfer}</div>
            {w.papers && w.papers.length > 0 && (
              <div className="out">outputs · {w.papers.join(' · ')}</div>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

function ProjMini({ p }) {
  const inner = (
    <Box className="proj-mini" style={{ height: '100%' }}>
      <div className="head">
        <Tag>{p.kind}</Tag>
        <Status s={p.status} />
      </div>
      <div>
        <div className="title">{p.title}</div>
        <div className="slug">{p.slug}</div>
      </div>
      <div className="blurb">{p.blurb}</div>
      <div className="foot">
        <span style={{ opacity: 0.75 }}>{p.stats}</span>
        {p.lineage && <span style={{ opacity: 0.55 }}>← {p.lineage}</span>}
      </div>
    </Box>
  );
  return p.href
    ? <a href={p.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>{inner}</a>
    : <div>{inner}</div>;
}

const ARC = [
  'mobile-web async framework',
  'data pipelines',
  'GAN portrait segmentation',
  'DL testing & robustness',
  'AIGC detection',
  'automated program repair',
  'code LLM security',
];

const MATRIX = [
  ['Async web framework @ 58.com (100M+ daily req)', '→', 'Reproducible large-scale benchmarks', 'Defects4C'],
  ['GAN portrait pipelines @ Xiaomi (CUDA → DSP)',   '→', 'Model-internals lens for DL testing', 'NPC · Faire'],
  ['Face cartoonisation GANs @ Xiaomi',              '→', 'Adversarial robustness + deepfake detection', 'ABBA · FakeSpotter'],
  ['Production data pipelines @ Baidu',              '→', 'Empirical evaluation of detectors at scale', "AIGC Detectors (ASE '24)"],
  ['RNN automaton modelling @ NTU',                  '→', 'Trace-based reasoning for code LLMs', "EMNLP '25 · Code Semantics"],
  ['Retrieval-augmented APR @ NTU',                  '→', 'LLM-based C/C++ repair benchmarks', 'RATCHET · Defects4C'],
];

const PAIRS = [
  { paper: 'Defects4C: Benchmarking LLM Repair on C/C++', venue: "ASE '25", source: 'Curated 350 expert-validated bugs from 38M+ commits during SMU RA work', role: 'Research Assistant, SMU (2023–now)' },
  { paper: 'Do Code Semantics Help?', venue: "EMNLP '25", source: 'Trace-based SFT/PEFT framework — extends RNN automaton intuition', role: 'Research Assistant, SMU + NTU' },
  { paper: 'RATCHET: Retrieval-Augmented Transformer for Repair', venue: "ISSRE '24", source: 'Built during NTU PhD from 13 curated open-source projects', role: 'PhD Student, NTU (2021–23)' },
  { paper: 'AIGC Detectors on Code Content (2.23M samples)', venue: "ASE '24", source: 'Large-scale empirical study of detector behaviour on code', role: 'PhD Student, NTU (2021–23)' },
  { paper: 'NPC · Neuron Path Coverage', venue: "TOSEM '22", source: 'Decision-graph view of DNNs — direct heir of model-internals work', role: 'NTU (2019–23)' },
  { paper: 'FakeSpotter / ABBA · deepfake & blur attack', venue: "IJCAI '20 · NeurIPS '20", source: 'Output of the AI Singapore deepfake challenge (S$100K, 3rd place)', role: 'NTU (2019–23)' },
];

export default function WorkProjects() {
  return (
    <div className="page">
      <Seo
        title="Work & Projects"
        description="Engineering work and side projects — agent harnesses, blog automation, security research tooling. Eight years of shipping code, now studying what breaks when LLMs ship it."
        path="/work"
      />
      <Nav />

      <section className="wp-hero">
        <div className="kicker" style={{ letterSpacing: 2 }}>WORK & PROJECTS · 2011 — 2026</div>
        <h1>Eight years of shipping code,<br />now studying <u>what breaks when LLMs ship it.</u></h1>
        <div className="wp-grid">
          <div style={{ fontSize: 14, lineHeight: 1.7 }}>
            I am <b>not</b> a first-year PhD. Before NTU I spent eight years in
            industry — built a high-performance asynchronous web framework at{' '}
            <b>58.com</b> that handles 100M+ daily requests, then trained GANs
            for portrait background removal and face cartoonisation at{' '}
            <b>Xiaomi AI Lab</b>, owning the full GPU→on-device pipeline. The
            pivot to research happened because the same neuron-level lens that
            fixed our segmentation failures turned out to be the right lens for
            testing and repairing modern code LLMs.
            <br /><br />
            This page is the receipts. Each role below shows <b>what I built</b>,{' '}
            <b>the stack</b>, and <b>the specific skill that transfers</b> to my
            current research on code LLM security and intelligence. Open-source
            artifacts sit below — they're what fell out of the work.
          </div>
          <div className="wp-stats">
            <div className="row"><Stat v="8" l="YRS · INDUSTRY" s="58.com → Xiaomi" /><Stat v="5" l="YRS · PHD + RA" s="NTU + SMU" /></div>
            <div className="row"><Stat v="10" l="PEER-REVIEWED" s="ASE/ISSRE/ICML/NeurIPS" /><Stat v="100K" l="SGD PRIZE" s="deepfake challenge '22" /></div>
          </div>
        </div>
        <Box dashed className="wp-arc">
          <span style={{ opacity: 0.55, letterSpacing: 1 }}>THE ARC →</span>
          {ARC.map((p, i) => (
            <React.Fragment key={p}>
              <span className="step">{p}</span>
              {i < ARC.length - 1 && <span className="arr">→</span>}
            </React.Fragment>
          ))}
        </Box>
      </section>

      <div className="wp-view">
        <span style={{ opacity: 0.55 }}>view →</span>
        <Chip sm solid>timeline</Chip><Chip sm>by employer</Chip><Chip sm>by skill</Chip>
        <span style={{ marginLeft: 'auto', opacity: 0.55 }}>● filled dot = role on the code-LLM arc</span>
      </div>

      <section className="content">
        <SectionHead num="01">Experience · newest first</SectionHead>
        <div style={{ marginTop: 14 }}>
          {WORK.map((w, i) => <WorkRow key={i} w={w} last={i === WORK.length - 1} />)}
        </div>

        <div style={{ marginTop: 28 }}>
          <SectionHead num="02">Skill transfer matrix — old skill → research move</SectionHead>
          <div className="matrix">
            {MATRIX.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((cell, j) => (
                  <div key={j} className={'cell ' + (i === 0 ? 'first-row ' : '') + (j < 3 ? 'r ' : '') + 'c' + (j + 1)}>
                    {cell}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <SectionHead num="03">Open-source artifacts — what fell out of the work</SectionHead>
          <div style={{ fontSize: 12.5, lineHeight: 1.65, marginBottom: 14, opacity: 0.85 }}>
            Each grew directly out of one of the roles above. Click to open paper / repo / page.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {PROJECTS.map((p) => <ProjMini key={p.title} p={p} />)}
          </div>
        </div>

        <div style={{ marginTop: 36 }}>
          <SectionHead num="04">Experience × publications — read together</SectionHead>
          <div style={{ fontSize: 12.5, lineHeight: 1.65, marginBottom: 14, opacity: 0.85 }}>
            Most of my papers have a job behind them. Here's the pairing.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {PAIRS.map((p) => (
              <Box key={p.paper} className="pair">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                  <div className="title">{p.paper}</div>
                  <span className="venue">{p.venue}</span>
                </div>
                <div className="meta">
                  <div><span className="tag-mono">GROUNDED IN ·</span> {p.source}</div>
                  <div style={{ marginTop: 4 }}><span className="tag-mono">ROLE ·</span> {p.role}</div>
                </div>
              </Box>
            ))}
          </div>
        </div>

        <Box dashed style={{ marginTop: 22, padding: 14, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, flexWrap: 'wrap', gap: 16 }}>
          <span><b>How this page is organized.</b> Experience is the spine; projects and papers hang off it. For canonical chronology see <a href="/cv">CV</a>; for the full paper list see <a href="/pubs">Publications</a>.</span>
          <span>↓ <a href="/data/Jian_Wang_CV_Academic_202605.pdf" target="_blank" rel="noreferrer">cv.pdf</a></span>
        </Box>
      </section>

      <Footer />
    </div>
  );
}
