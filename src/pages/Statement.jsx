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
    <Seo title="Research Statement" description="From program repair and code-model evaluation to reliable software-maintenance agents. Jian Wang's focused research agenda and longer-term network vision." path="/statement" />
    <Nav skipToContent />
    <div className="portfolio-shell">
      <ApHead sidebar />
      <main id="main-content" className="portfolio-content">
        <p className="portfolio-eyebrow">Research statement · September 2026</p>
        <h1>From reliable code to trustworthy agents</h1>
        <p className="page-deck">Reliable software maintenance is the starting point.</p>
        <p>I want to build agents whose work can be checked, whose actions stay within a maintainer's authority,
          and whose partial work can be recovered when conditions change. My starting point is program repair
          and the empirical evaluation of code models.</p>
        <ResearchPath />
        <nav className="statement-toc" aria-label="Statement sections">
          <span>Read in sequence</span>
          <ol>{headings.map(h => <li key={h.id}><a href={`#${h.id}`}>{h.title}</a></li>)}</ol>
        </nav>
        <article className="statement-body" aria-label="Research statement text">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            h2: props => <LinkedHeading {...props} level={2} />,
            h3: props => <LinkedHeading {...props} level={3} />,
          }}>{markdown}</ReactMarkdown>
        </article>
        <details className="network-vision">
          <summary>Earlier broad vision: trustworthy agent networks</summary>
          <p>The original V4 diagram maps a wider set of possibilities. The program above prioritizes
            maintenance, revalidation and recovery; the remaining network mechanisms are longer-term questions.</p>
          <ResearchOverview />
          <a href="/data/Jian_Wang_Research_Statement_202609.pdf" target="_blank" rel="noreferrer">Earlier broad draft (V4 PDF) ↗</a>
        </details>
        <div className="statement-download"><Link to="/pubs">Browse the published evidence ↗</Link>
          <Link to="/work#room-code">Explore the repair projects ↗</Link>
          <a href="#research-path">Back to the progression ↑</a></div>
      </main>
    </div><Footer />
  </div>;
}
