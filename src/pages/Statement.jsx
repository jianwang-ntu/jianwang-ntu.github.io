import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import ApHead from '../components/ApHead.jsx';
import ResearchOverview from '../components/ResearchOverview.jsx';
import ResearchPath from '../components/ResearchPath.jsx';
import markdown from '../content/research-statement.md?raw';
import { statementHeadings } from '../statement-headings.js';
import { resolveStatementHash } from '../research-agenda.js';

const headings = statementHeadings(markdown);
function LinkedHeading({ node, children, level }) {
  const heading = headings.find(h => h.line === node.position.start.line);
  const Tag = `h${level}`;
  return <Tag id={heading.id} tabIndex={-1}><a href={`#${heading.id}`}>{children}</a></Tag>;
}

export default function Statement() {
  const { hash, search } = useLocation();
  const redirect = resolveStatementHash(hash);
  if (redirect) return <Navigate to={`/statement${search}#${redirect}`} replace />;
  return <div className="page">
    <Seo title="Research Statement" description="Trustworthy agent networks for individuals, groups and companies: assured agency, collective agency, and independent evidence with controlled adaptation." path="/statement" />
    <Nav skipToContent />
    <div className="portfolio-shell statement-shell">
      <ApHead sidebar />
      <main id="main-content" className="portfolio-content">
        <p className="portfolio-eyebrow">Research statement · September 2026</p>
        <h1>Trustworthy agent networks</h1>
        <p className="statement-lead">How can AI agents expand what <strong>individuals, groups and companies</strong> accomplish,
          while preserving authority, privacy and commitments as they learn and cooperate?</p>
        <ResearchOverview />
        <p>My agenda connects <a href="#assured-agency">assured agency</a>—accountable representation through change—with{' '}
          <a href="#collective-agency">collective agency</a>—cooperation across independent people and organizations.
          <a href="#independent-evidence-and-controlled-adaptation"> Independent evidence and controlled adaptation</a> link the two.</p>
        <div className="statement-download"><a href="/data/Jian_Wang_Research_Statement_202609.pdf" target="_blank" rel="noreferrer">Full research statement (PDF) ↗</a>
          <a href="#published-foundations">Published foundations ↓</a></div>
        <nav className="statement-toc" aria-label="Statement sections">
          <span>The research agenda</span>
          <ol>{headings.map(h => <li key={h.id}><a href={`#${h.id}`}>{h.title}</a></li>)}</ol>
        </nav>
        <article className="statement-body" aria-label="Research statement text">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            h2: props => <LinkedHeading {...props} level={2} />,
            h3: props => <LinkedHeading {...props} level={3} />,
          }}>{markdown}</ReactMarkdown>
        </article>
        <ResearchPath />
        <div className="statement-download"><Link to="/pubs">Browse the published evidence ↗</Link>
          <Link to="/work#room-code">Explore the repair projects ↗</Link>
          <a href="#network-overview">Back to the overview ↑</a></div>
      </main>
    </div><Footer />
  </div>;
}
