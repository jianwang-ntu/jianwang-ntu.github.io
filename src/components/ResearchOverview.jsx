import React from 'react';
import { Link } from 'react-router-dom';

const imageUrl = '/images/research/reliable-agents-human-control.png';

export default function ResearchOverview() {
  return (
    <figure className="research-overview" id="research-overview">
      <a href={imageUrl} target="_blank" rel="noreferrer">
        <img className="home-research-image" src={imageUrl} width="1448" height="1086"
          decoding="async"
          alt="Reliable AI agents under human control: human–agent interaction and agent–agent collaboration share approved requirements for action assurance, safety retention, and workflow control." />
      </a>
      <ul className="research-overview-mobile" aria-label="Research overview">
        <li><Link to="/statement#i-scalable-oversight-under-adaptation">Oversight before action</Link></li>
        <li><Link to="/statement#ii-safety-preserving-learning-and-feedback">Preserving safety through continual updates</Link></li>
        <li><Link to="/statement#iii-control-across-time-and-delegation">Authorization across delegated workflows</Link></li>
      </ul>
      <figcaption>
        <a href={imageUrl} target="_blank" rel="noreferrer">Open full-size image ↗</a>
      </figcaption>
    </figure>
  );
}
