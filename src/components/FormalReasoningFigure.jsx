import React from 'react';
import { Link } from 'react-router-dom';

const figures = {
  overview: {
    file: 'overview',
    title: 'Formal reasoning research overview',
    caption: 'Proposed research: learn transferable strategies, reuse checked dependency evidence, and assess intended requirements.',
    alt: 'Existing code and a test harness inform an explicit property under a stated input domain and execution model. An agent proposes proofs for an independent checker. Feedback motivates transfer, reuse through checked dependency interfaces, and assessment of intended requirements.',
  },
  'learning-reusable-proof-strategies': {
    file: 'learning-proof-strategies',
    title: 'Learning reusable proof strategies',
    caption: 'Proposed comparison: distinguish proof retrieval, within-task refinement, and learning through held-out transfer tests.',
    alt: 'Checker feedback guides the next proof proposal. Retrieval, within-task refinement, and cross-task learning are compared separately through transfer tests under matched budgets.',
  },
  'compositional-verification': {
    file: 'compositional-verification',
    title: 'Compositional verification',
    caption: 'Proposed research: reuse checked components only after validating caller obligations, interfaces, and assumptions.',
    alt: 'An agent decomposes a global software property across shared libraries and callers. Independent checks and a separate interface and assumption gate support composition; changed components trigger revalidation of affected evidence.',
  },
  'trustworthy-verification-feedback': {
    file: 'trustworthy-feedback',
    title: 'Trustworthy verification feedback',
    caption: 'Proposed research: assess requirement coverage and behavior preservation separately from theorem checking.',
    alt: 'A checked theorem receives a separate assessment of requirement coverage, artifact matching, explicit assumptions, and behavior preservation. Invalid or unresolved results and failed assessments require investigation, revision, or review.',
  },
};

const learn = '/statement#learning-reusable-proof-strategies';
const compose = '/statement#compositional-verification';
const audit = '/statement#trustworthy-verification-feedback';
// Regions measured against the restyled 1672 × 941 overview PNG.
const overviewRegions = [
  ['Code and test harness', audit, 31, 143, 275, 230],
  ['Explicit property and execution model', audit, 359, 143, 266, 230],
  ['Agent proposes proofs: learn proof strategies', learn, 681, 143, 308, 230],
  ['Independent checker: assess verification evidence', audit, 1037, 143, 256, 230],
  ['Verification feedback: checked, counterexample, or unresolved', audit, 1324, 143, 319, 230],
  ['Learn reusable strategies', learn, 31, 494, 560, 322],
  ['Compose verification evidence', compose, 611, 494, 476, 322],
  ['Audit verification feedback', audit, 1110, 494, 532, 322],
  ['Read the full formal reasoning research statement', '/statement', 188, 834, 1296, 56],
];

export default function FormalReasoningFigure({ kind = 'overview', loading = 'lazy' }) {
  const figure = figures[kind];
  if (!figure) return null;
  const original = `/figures/formal-reasoning/${figure.file}.png`;
  const overview = kind === 'overview';
  return <figure className="research-overview formal-research-figure" aria-label={figure.title}>
    <div className="formal-research-scroll" tabIndex="0" aria-label={`Scrollable diagram: ${figure.title}`}>
      <div className="linked-research-image formal-research-canvas">
        <a className="formal-research-open" href={original} target="_blank" rel="noreferrer" aria-label={`Open ${figure.title} at full size`}>
          <img className="home-research-image" src={`/figures/formal-reasoning/${figure.file}.webp?v=20261026-motivation`} alt={figure.alt} width="1672" height="941" loading={loading} decoding="async" />
        </a>
        {overview && overviewRegions.map(([label, to, x, y, width, height]) =>
          <Link key={label} className="research-image-link" to={to} aria-label={label} title={label}
            style={{ left: `${x / 1672 * 100}%`, top: `${y / 941 * 100}%`, width: `${width / 1672 * 100}%`, height: `${height / 941 * 100}%` }} />)}
      </div>
    </div>
    {overview && <ul className="research-overview-mobile" aria-label="Research areas">
      <li><Link to={learn}>Learning reusable proof strategies</Link></li>
      <li><Link to={compose}>Compositional verification</Link></li>
      <li><Link to={audit}>Trustworthy verification feedback</Link></li>
    </ul>}
    <figcaption>
      <span className="formal-research-caption">{figure.caption}</span>
      <span className="formal-research-context">Sources for context: <a href="https://www.anthropic.com/research/formal-verification" target="_blank" rel="noreferrer">Anthropic and Theorem: formal software verification [1]</a> · <a href="https://theorem.dev/blog/verified-software-stack/" target="_blank" rel="noreferrer">Theorem: the verified software stack [2]</a>.</span>
      {overview && <span>Click a research area to read its section.</span>}
      <span className="formal-research-actions">
        <a href={original} target="_blank" rel="noreferrer">Open full size ↗</a>
        <a href={original} download>Download PNG</a>
        {overview && <a href="/data/formal-reasoning-diagrams.zip" download>Download all diagrams</a>}
      </span>
    </figcaption>
  </figure>;
}
