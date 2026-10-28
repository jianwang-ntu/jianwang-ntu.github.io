import React from 'react';
import { Link } from 'react-router-dom';

const figures = {
  overview: {
    file: '01-overview',
    title: 'Formal reasoning research overview',
    caption: 'Proposed agenda: learn reasoning, compose guarantees, and audit feedback for reliable programming.',
    alt: 'Three complementary directions—learn reasoning, compose guarantees, and audit feedback—support reliable programming.',
  },
  'learning-reusable-proof-strategies': {
    file: '02-programming-strategies',
    height: 940,
    title: 'Learning verification-guided programming strategies',
    caption: 'Proposed research: learn reusable reasoning from verification feedback. A failed proof is not itself a software defect.',
    alt: 'Program, reason, and check, with a learning loop from checking back to reasoning.',
  },
  'compositional-verification': {
    file: '03-software-changes',
    title: 'Preserving guarantees across software changes',
    caption: 'Proposed research: connect local proofs through checked composition. Reuse after changes requires the assumptions to remain valid.',
    alt: 'Local proofs connect through a checked composition argument to a program guarantee.',
  },
  'trustworthy-verification-feedback': {
    file: '04-intended-behavior',
    title: 'Verification feedback aligned with intended behavior',
    caption: 'Proposed research: check the formal claim and assess intended behavior. Assurance remains conditional on specifications, models, assumptions, and trusted checks.',
    alt: 'Checking the claim and assessing the behavior both inform evidence for decisions.',
  },
};

const learn = '/statement#learning-reusable-proof-strategies';
const compose = '/statement#compositional-verification';
const audit = '/statement#trustworthy-verification-feedback';
const assetVersion = '20261027-simple';
// Coordinates match the simplified overview's 1672 × 941 canvas.
const overviewRegions = [
  ['Read this earlier formal-reasoning statement', '/statement', 462, 208, 748, 202],
  ['Learn reasoning from verification', learn, 141, 606, 416, 225],
  ['Compose guarantees across software changes', compose, 638, 606, 397, 225],
  ['Audit feedback against intended behavior', audit, 1119, 606, 414, 225],
];

export default function FormalReasoningFigure({ kind = 'overview', loading = 'lazy' }) {
  const figure = figures[kind];
  if (!figure) return null;
  const original = `/figures/reliable-programming/${figure.file}.png?v=${assetVersion}`;
  const preview = `/figures/reliable-programming/${figure.file}.webp?v=${assetVersion}`;
  const overview = kind === 'overview';
  return <figure className="research-overview formal-research-figure" aria-label={figure.title}>
    <div className="linked-research-image formal-research-canvas">
      <a className="formal-research-open" href={original} target="_blank" rel="noreferrer" aria-label={`Open ${figure.title} at full size`}>
        <img className="home-research-image" src={preview} alt={figure.alt} width="1672" height={figure.height || 941} loading={loading} decoding="async" />
      </a>
      {overview && overviewRegions.map(([label, to, x, y, width, height]) =>
        <Link key={label} className="research-image-link" to={to} aria-label={label} title={label}
          style={{ left: `${x / 1672 * 100}%`, top: `${y / 941 * 100}%`, width: `${width / 1672 * 100}%`, height: `${height / 941 * 100}%` }} />)}
    </div>
    {overview && <ul className="research-overview-mobile" aria-label="Research areas">
      <li><Link to={learn}>Learning from verification</Link></li>
      <li><Link to={compose}>Preserving guarantees through change</Link></li>
      <li><Link to={audit}>Feedback aligned with intended behavior</Link></li>
    </ul>}
    <figcaption>
      <span className="formal-research-caption">{figure.caption}</span>
      <span className="formal-research-context">Related context: <a href="https://www.anthropic.com/research/formal-verification" target="_blank" rel="noreferrer">Anthropic and Theorem [1]</a> · <a href="https://theorem.dev/blog/verified-software-stack/" target="_blank" rel="noreferrer">Theorem: verified software stack [2]</a> · <a href="https://verus-lang.github.io/verus/guide/llmforverusproof.html" target="_blank" rel="noreferrer">Verus guide [3]</a>.</span>
      <span className="formal-research-actions">
        <a href={original} target="_blank" rel="noreferrer">Open full-size image ↗</a>
        <a href={original} download>Download PNG</a>
        {overview && <a href={`/data/reliable-programming-diagrams.zip?v=${assetVersion}`} download>Download all diagrams</a>}
      </span>
    </figcaption>
  </figure>;
}
