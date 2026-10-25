import React from 'react';
import { Link } from 'react-router-dom';

const figures = {
  overview: {
    file: 'overview',
    title: 'Formal reasoning research overview',
    alt: 'An AI coding agent proposes invariants, contracts, and lemmas for an independent checker. Checked, counterexample, and unresolved feedback support refinement and learning. Three research areas study transfer, composition, and trustworthy evidence.',
  },
  'learning-reusable-proof-strategies': {
    file: 'learning-proof-strategies',
    title: 'Learning reusable proof strategies',
    alt: 'Checker feedback guides the next proof proposal. Retrieval, within-task refinement, and cross-task learning are compared separately through transfer tests under matched budgets.',
  },
  'compositional-verification': {
    file: 'compositional-verification',
    title: 'Compositional verification',
    alt: 'An agent decomposes a global goal into loop invariants, function contracts, and lemmas. Local evidence passes through interface and shared-assumption checks before composition; failures trigger revision.',
  },
  'trustworthy-verification-feedback': {
    file: 'trustworthy-feedback',
    title: 'Trustworthy verification feedback',
    alt: 'A checked theorem receives a separate assessment of specification adequacy, artifact matching, and explicit assumptions. Invalid or unresolved outcomes require investigation, revision, or review.',
  },
};

const learn = '/statement#learning-reusable-proof-strategies';
const compose = '/statement#compositional-verification';
const audit = '/statement#trustworthy-verification-feedback';
// Regions measured against the original 1672 × 941 overview PNG.
const overviewRegions = [
  ['Approved program and specification', audit, 21, 132, 261, 221],
  ['AI coding agent: learn proof strategies', learn, 310, 132, 270, 221],
  ['Proof artifacts: compose verification evidence', compose, 608, 132, 350, 221],
  ['Independent checker: assess verification evidence', audit, 986, 132, 269, 221],
  ['Verification feedback: checked, counterexample, or unresolved', audit, 1282, 132, 369, 221],
  ['Learn reusable strategies', learn, 22, 485, 534, 323],
  ['Compose verification evidence', compose, 575, 485, 523, 323],
  ['Audit verification feedback', audit, 1118, 485, 533, 323],
  ['Read the full formal reasoning research statement', '/statement', 208, 833, 1256, 65],
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
          <img className="home-research-image" src={`/figures/formal-reasoning/${figure.file}.webp`} alt={figure.alt} width="1672" height="941" loading={loading} decoding="async" />
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
      {overview && <span>Click a research area to read its section.</span>}
      <span className="formal-research-actions">
        <a href={original} target="_blank" rel="noreferrer">Open full size ↗</a>
        <a href={original} download>Download PNG</a>
        {overview && <a href="/data/formal-reasoning-diagrams.zip" download>Download all diagrams</a>}
      </span>
    </figcaption>
  </figure>;
}
