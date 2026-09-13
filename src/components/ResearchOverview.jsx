import React from 'react';
import { Link } from 'react-router-dom';
import overviewUrl from '../assets/reliable-autonomy-overview.svg';

export default function ResearchOverview() {
  return (
    <figure className="research-overview" id="research-overview">
      <div className="research-overview-canvas" role="region"
        aria-label="Research overview; scroll horizontally on a small screen" tabIndex={0}>
        <object className="research-overview-object" data={overviewUrl} type="image/svg+xml"
          aria-label="Interactive vector overview of reliable autonomy for adaptive AI agents">
          <span>The interactive research overview is available through the links below.</span>
        </object>
      </div>
      <ul className="research-overview-mobile" aria-label="Research overview">
        <li><Link to="/statement#i-scalable-oversight-under-adaptation">Scalable oversight</Link></li>
        <li><Link to="/statement#ii-safety-preserving-learning-and-feedback">Safety-preserving learning</Link></li>
        <li><Link to="/statement#iii-control-across-time-and-delegation">Control across time and delegation</Link></li>
      </ul>
      <figcaption>
        <span>Industry grounding: 829 deduplicated JDs across six companies. Percentages are coded theme matches within each company’s collected sample, not company endorsement.</span>
        <a href={overviewUrl} target="_blank" rel="noreferrer">Open full-size SVG ↗</a>
      </figcaption>
    </figure>
  );
}
