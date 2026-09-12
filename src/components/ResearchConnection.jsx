import React from 'react';
import { Link } from 'react-router-dom';
import { PUBLICATION_CONNECTIONS } from '../research-agenda.js';

export default function ResearchConnection({ publication, compact = false }) {
  const connection = PUBLICATION_CONNECTIONS[publication];
  if (!connection) return null;
  if (compact) return <p className="research-connection-link"><Link to={`/statement#${connection.section}`}>Next research question: {connection.label} ↗</Link></p>;
  return <aside className="research-connection" aria-label="Connection to proposed research">
    <h2>Connection to the research agenda</h2>
    <p>{connection.connection}</p>
    <p className="connection-boundary">{connection.boundary}</p>
    <Link to={`/statement#${connection.section}`}>{connection.label} ↗</Link>
  </aside>;
}
