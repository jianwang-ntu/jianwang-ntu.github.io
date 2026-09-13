import React from 'react';
import { Link } from 'react-router-dom';

const overviewUrl = '/images/research/reliable-autonomy-overview.png';

// Coordinates use the supplied artwork's pixels, so links scale with the image.
const regions = [
  { id: 'i-scalable-oversight-under-adaptation', label: 'Scalable oversight', box: [65, 205, 505, 445] },
  { id: 'ii-safety-preserving-learning-and-feedback', label: 'Safety-preserving learning', box: [930, 185, 470, 465] },
  { id: 'iii-control-across-time-and-delegation', label: 'Control across time and delegation', box: [450, 650, 545, 365] },
];

export default function ResearchOverview() {
  return (
    <figure className="research-overview" id="research-overview">
      <svg viewBox="0 0 1448 1086" width="1448" height="1086" role="group"
        aria-label="Interactive overview of reliable autonomy for adaptive AI agents">
        <title>Reliable Autonomy for Adaptive AI Agents</title>
        <desc>Scalable oversight, safety-preserving learning, and control across time and delegation form a connected research agenda. Select an area to read its section.</desc>
        <image href={overviewUrl} width="1448" height="1086" aria-hidden="true" />
        {regions.map(({ id, label, box: [x, y, width, height] }) => (
          <Link key={id} to={`/statement#${id}`} aria-label={`Read about ${label}`}>
            <title>{label}</title>
            <rect className="research-overview-region" x={x} y={y} width={width} height={height} rx="4" />
          </Link>
        ))}
      </svg>
      <ul className="research-overview-mobile" aria-label="Research overview">
        <li><Link to="/statement#i-scalable-oversight-under-adaptation">Scalable oversight</Link></li>
        <li><Link to="/statement#ii-safety-preserving-learning-and-feedback">Safety-preserving learning</Link></li>
        <li><Link to="/statement#iii-control-across-time-and-delegation">Control across time and delegation</Link></li>
      </ul>
      <figcaption>
        <span>Select one of the three research areas to read its section.</span>
        <a href={overviewUrl} target="_blank" rel="noreferrer">Open full-size overview ↗</a>
      </figcaption>
    </figure>
  );
}
