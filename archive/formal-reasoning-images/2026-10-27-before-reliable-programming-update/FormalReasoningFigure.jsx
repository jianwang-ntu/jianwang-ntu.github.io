import React from 'react';
import { Link } from 'react-router-dom';

const figures = {
  overview: {
    file: 'overview',
    page: 1,
    title: 'Formal reasoning research overview',
    caption: 'Proposed research: learn across tasks, check composition arguments, and audit the scope and use of verification evidence.',
    alt: 'Existing code and a test harness inform an explicit property under a stated input domain and execution model. An agent proposes proof artifacts for independent verification. Checked proofs, rejected proofs, validated counterexamples, and unknown results remain distinct. Research studies transfer, checked composition arguments, and evidence assessment.',
  },
  'learning-reusable-proof-strategies': {
    file: 'learning-proof-strategies',
    page: 2,
    title: 'Learning reusable proof strategies',
    caption: 'Proposed comparison: distinguish retrieval, within-task refinement, and learning through held-out evaluation with frozen model weights and retrieval banks.',
    alt: 'Distinct verification outcomes guide the next proof attempt. Retrieval rechecks stored artifacts, refinement keeps model weights fixed, and learning uses training tasks. Held-out evaluation freezes model weights and a training-only retrieval bank, separates related program families, and reports each mechanism under matched budgets.',
  },
  'compositional-verification': {
    file: 'compositional-verification',
    page: 3,
    title: 'Compositional verification',
    caption: 'Proposed research: check local proofs and the composition argument, including caller conditions, shared state, and model assumptions.',
    alt: 'An agent decomposes a global verification goal across libraries and callers. Local proofs and a composition argument must discharge caller preconditions, shared-state and frame obligations, and model assumptions. Relevant changes trigger rechecking of affected local and composition obligations.',
  },
  'trustworthy-verification-feedback': {
    file: 'trustworthy-feedback',
    page: 4,
    title: 'Trustworthy verification feedback',
    caption: 'Proposed research: assess coverage, exact artifacts, assumption validity, and required behavior before recording evidence for a declared use.',
    alt: 'Fix the approved verification target, check its formal claim, assess requirement coverage, artifact binding, assumption validity, and behavior preservation, then record evidence eligible for learning or change review under declared criteria. Rejected proofs, validated counterexamples, and unknown results remain distinct. Requirement tests can still miss behavior.',
  },
};

const learn = '/statement#learning-reusable-proof-strategies';
const compose = '/statement#compositional-verification';
const audit = '/statement#trustworthy-verification-feedback';
const assetVersion = '20261026-reviewed-clarity';
// The PDF-derived vector preview keeps the editable slide's 1672 × 941 canvas.
const overviewRegions = [
  ['Code and test harness', audit, 31, 143, 275, 230],
  ['Explicit property and execution model', audit, 359, 143, 266, 230],
  ['Agent proposes proofs: learn proof strategies', learn, 681, 143, 308, 230],
  ['Independent verification: assess evidence', audit, 1037, 143, 256, 230],
  ['Verification outcomes: checked proof, rejected proof, valid counterexample, or unknown', audit, 1324, 143, 319, 230],
  ['Learn reusable strategies', learn, 31, 494, 560, 322],
  ['Compose verification evidence', compose, 611, 494, 476, 322],
  ['Audit verification feedback', audit, 1110, 494, 532, 322],
  ['Read the full formal reasoning research statement', '/statement', 188, 834, 1296, 56],
];

export default function FormalReasoningFigure({ kind = 'overview', loading = 'lazy' }) {
  const figure = figures[kind];
  if (!figure) return null;
  const original = `/figures/formal-reasoning/${figure.file}.png?v=${assetVersion}`;
  const vector = `/figures/formal-reasoning/${figure.file}.svg?v=${assetVersion}`;
  const pdf = `/data/formal-reasoning-diagrams/formal-reasoning-diagrams.pdf?v=${assetVersion}#page=${figure.page}`;
  const overview = kind === 'overview';
  return <figure className="research-overview formal-research-figure" aria-label={figure.title}>
    <div className="formal-research-scroll" tabIndex="0" aria-label={`Scrollable diagram: ${figure.title}`}>
      <div className="linked-research-image formal-research-canvas">
        <a className="formal-research-open" href={pdf} target="_blank" rel="noreferrer" aria-label={`Open ${figure.title} as PDF, page ${figure.page}`}>
          <img className="home-research-image" src={vector} alt={figure.alt} width="1672" height="941" loading={loading} decoding="async" />
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
        <a href={pdf} target="_blank" rel="noreferrer">Open PDF ↗</a>
        <a href={vector} download>Download SVG</a>
        <a href={original} download>Download PNG</a>
        {overview && <a href={`/data/formal-reasoning-diagrams/formal-reasoning-diagrams.pptx?v=${assetVersion}`} download>Editable PowerPoint</a>}
        {overview && <a href={`/data/formal-reasoning-diagrams.zip?v=${assetVersion}`} download>Download all diagrams</a>}
      </span>
    </figcaption>
  </figure>;
}
