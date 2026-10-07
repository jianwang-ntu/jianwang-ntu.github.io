import React from 'react';
import { Link } from 'react-router-dom';
import LinkedResearchImage from './LinkedResearchImage.jsx';

const imageUrl = '/images/research/reliable-agents-human-control.svg?v=original-layout-20261007';

export default function ResearchOverview() {
  return (
    <figure className="research-overview" id="research-overview">
      <LinkedResearchImage />
      <ul className="research-overview-mobile" aria-label="Research overview">
        <li><Link to="/statement#i-scalable-oversight-under-adaptation">Oversight before action</Link></li>
        <li><Link to="/statement#ii-safety-preserving-learning-and-feedback">Preserving safety through continual updates</Link></li>
        <li><Link to="/statement#iii-control-across-time-and-delegation">Authorization across delegated workflows</Link></li>
      </ul>
      <figcaption>
        <a href={imageUrl} target="_blank" rel="noreferrer">Open full-size image ↗</a>
        {' · '}<a href="/data/statement-diagrams/statement-diagrams.pptx?v=neutral-background-20261007" download>Editable diagrams (PowerPoint)</a>
        {' · '}<a href="/data/statement-diagrams/statement-diagrams.pdf?v=neutral-background-20261007" target="_blank" rel="noreferrer">Diagrams (PDF) ↗</a>
        {' · '}<a href="/data/statement-diagrams/comparison.html" target="_blank" rel="noreferrer">Compare with originals ↗</a>
      </figcaption>
    </figure>
  );
}
