import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import { Box, Chip, SectionHead, Status, Tag } from '../components/primitives.jsx';
import { WORK, PROJECTS } from '../data.jsx';
import Figure, { PAPER_IMAGES } from '../components/figures.jsx';
import ApHead from '../components/ApHead.jsx';

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


/* ─── academicpages mode ─────────────────────────────────────────────
   Projects lead with their schematic: on a portfolio page the diagram is
   the fastest way to convey what an artefact actually does. */
function AcademicPagesWork() {
  const active = PROJECTS.filter((p) => p.status !== 'archived').length;
  // only count figures actually lifted from the papers
  const fromPaper = PROJECTS.filter((p) => p.figure && PAPER_IMAGES[p.figure]).length;
  return (
    <div className="ap-page">
      <ApHead sub={`${WORK.length} roles, 2011 — 2026 · ${PROJECTS.length} open-source artefacts (${active} active)`} />
      <div className="ap-page-body">
        <h2 className="ap-page-h2">Open-source Artefacts</h2>
        <p>
          {fromPaper} of these carry the figure from the artefact&rsquo;s own paper;
          the rest use a schematic drawn from the method.
        </p>
        {PROJECTS.map((p, i) => (
          <article className="ap-proj" key={i}>
            {p.figure && <Figure id={p.figure} />}
            <div className="ap-pub-body">
              <h3 className="ap-pub-title">
                {p.href ? <a href={p.href} target="_blank" rel="noreferrer">{p.title}</a> : p.title}
              </h3>
              <p className="ap-pub-venue">
                <span className="ap-venue-chip">{p.kind}</span>
                <span className="ap-pub-kind">{p.status}</span>
                {p.stats && <span className="ap-pub-note">{p.stats}</span>}
              </p>
              <p className="ap-text ap-text-s">{p.blurb}</p>
              <p className="ap-pub-links"><span className="ap-slug">{p.slug}</span></p>
            </div>
          </article>
        ))}

        <h2 className="ap-page-h2">Roles</h2>
        {WORK.map((w, i) => (
          <section className="ap-role-row" key={i}>
            <div className="ap-role-when">{w.year}</div>
            <div>
              <h3 className="ap-pub-title">{w.role}</h3>
              <p className="ap-pub-authors">{w.where}</p>
              <p className="ap-text ap-text-s">{w.what}</p>
              {w.stack?.length > 0 && (
                <p className="ap-stack">{w.stack.map((t, j) => <span key={j}>{t}</span>)}</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function WorkProjects() {
  return (
    <div className="page">
      <Seo
        title="Work & Projects"
        description="Engineering work and side projects — agent harnesses, blog automation, security research tooling. Eight years of shipping code, now studying what breaks when LLMs ship it."
        path="/work"
      />
      <Nav />
      <AcademicPagesWork />
      <Footer />
    </div>
  );
}
