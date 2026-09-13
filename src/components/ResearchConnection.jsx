import React from 'react';
import { Link } from 'react-router-dom';
import { PUBLICATION_CONNECTIONS } from '../research-agenda.js';

export default function ResearchConnection({ publication, compact = false, variant = 'default' }) {
  const connection = PUBLICATION_CONNECTIONS[publication];
  if (!connection) return null;
  if (compact) return <p className="research-connection-link"><Link to={`/statement#${connection.section}`}>Next research question: {connection.label} ↗</Link></p>;
  if (variant === 'editorial') return <aside className="research-connection research-connection-editorial" aria-label="Connection to proposed research">
    <p><strong>Research connection.</strong> {connection.connection}</p>
    <p className="connection-boundary"><strong>Evidence boundary.</strong> {connection.boundary}</p>
    <p><Link to={`/statement#${connection.section}`}>{connection.label} ↗</Link></p>
  </aside>;
  return <aside className="research-connection" aria-label="Connection to proposed research">
    <h2>Connection to the research agenda</h2>
    <p>{connection.connection}</p>
    <p className="connection-boundary">{connection.boundary}</p>
    <Link to={`/statement#${connection.section}`}>{connection.label} ↗</Link>
  </aside>;
}
