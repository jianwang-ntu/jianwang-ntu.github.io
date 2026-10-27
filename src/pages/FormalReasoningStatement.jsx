import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import FormalReasoningFigure from '../components/FormalReasoningFigure.jsx';
import markdown from '../content/formal-reasoning-statement.md?raw';
import { statementHeadings } from '../statement-headings.js';
import { resolveStatementHash } from '../research-agenda.js';

const foundationStart = markdown.indexOf('## Research foundation and approach');
const referencesStart = markdown.indexOf('## References');
const body = markdown.slice(0, foundationStart);
const agendaStart = body.indexOf('## ');
const introduction = body.slice(0, agendaStart);
const agenda = body.slice(agendaStart);
const agendaLineOffset = introduction.split('\n').length - 1;
const foundation = markdown.slice(foundationStart, referencesStart).replace(/^## Research foundation and approach\s*/, '');
const references = markdown.slice(referencesStart).replace(/^## References\s*/, '');
const headings = statementHeadings(body);
const legacySections = new Set([
  'i-scalable-oversight-under-adaptation',
  'ii-safety-preserving-learning-and-feedback',
  'iii-control-across-time-and-delegation',
  'research-overview',
]);

function LinkedHeading({ node, children }) {
  const heading = headings.find(item => item.line === node.position.start.line + agendaLineOffset);
  return <>
    <h2 id={heading.id} tabIndex={-1}><a href={`#${heading.id}`}>{children}</a></h2>
    <FormalReasoningFigure kind={heading.id} />
  </>;
}

export default function FormalReasoningStatement() {
  const { hash, search } = useLocation();
  const legacyTarget = resolveStatementHash(hash) || (legacySections.has(hash.slice(1)) ? hash.slice(1) : null);
  if (legacyTarget) return <Navigate to={`/statement_multi_agent${search}#${legacyTarget}`} replace />;
  return <div className="page">
    <Seo title="Research Statement" description="Learning formal reasoning for reliable AI-assisted programming: verification-guided strategies, guarantees across software changes, and feedback aligned with intended behavior." path="/statement" />
    <Nav skipToContent />
    <SiteFrame className="statement-shell">
      <p className="portfolio-eyebrow">Research statement · 27 October 2026</p>
      <h1>Learning Formal Reasoning for Reliable AI-Assisted Programming</h1>
      <dl className="statement-meta" aria-label="Research statement metadata">
        <dt>Scope</dt>
        <dd>AI-assisted software generation, repair, and maintenance.</dd>
        <dt>Aim</dt>
        <dd>Learn transferable formal reasoning that supports useful software changes with independently checked evidence.</dd>
      </dl>
      <article className="statement-body" aria-label="Research statement text">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{introduction}</ReactMarkdown>
        <FormalReasoningFigure loading="eager" />
        <nav className="statement-toc" aria-label="Statement sections">
          <span>The research agenda</span>
          <ol>{headings.map(heading => <li key={heading.id}><a href={`#${heading.id}`}>{heading.title}</a></li>)}</ol>
        </nav>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ h2: LinkedHeading }}>{agenda}</ReactMarkdown>
        <details className="industry-references" id="research-foundation-and-approach" tabIndex={-1}>
          <summary>Research foundation and approach</summary>
          <div className="industry-references-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{foundation}</ReactMarkdown></div>
        </details>
        <details className="industry-references" id="references" tabIndex={-1}>
          <summary>References</summary>
          <div className="industry-references-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{references}</ReactMarkdown></div>
        </details>
      </article>
      <div className="statement-download">
        <a href="/agent_reliable.html">Reusable reasoning and reliable coding agents ↗</a>
        <Link to="/statement_multi_agent">Multi-agent research statement ↗</Link>
        <Link to="/research_coding_statement">Program reasoning statement ↗</Link>
        <Link to="/pubs">Browse publications ↗</Link>
      </div>
    </SiteFrame>
    <Footer />
  </div>;
}
