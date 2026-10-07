import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import ResearchOverview from '../components/ResearchOverview.jsx';
import IndustryJDReferences from '../components/IndustryJDReferences.jsx';
import ReadingTable from '../components/ReadingTable.jsx';
import markdown from '../content/research-statement.md?raw';
import { statementHeadings } from '../statement-headings.js';
import { resolveStatementHash } from '../research-agenda.js';

const referenceStart = markdown.indexOf('## References');
const statementBody = markdown.slice(0, referenceStart);
const references = markdown.slice(referenceStart).replace(/^## References\s*/, '');
const foundationStart = statementBody.indexOf('### Research foundation and approach');
const agendaStart = statementBody.indexOf('\n---', foundationStart);
const introduction = statementBody.slice(0, foundationStart);
const foundation = statementBody.slice(foundationStart, agendaStart).replace(/^### Research foundation and approach\s*/, '');
const agenda = statementBody.slice(agendaStart);
const agendaLineOffset = statementBody.slice(0, agendaStart).split('\n').length - 1;
const headings = statementHeadings(markdown);
const sections = headings.filter(heading => heading.level === 2);
function LinkedHeading({ node, children, level, lineOffset = 0 }) {
  const heading = headings.find(h => h.line === node.position.start.line + lineOffset);
  const Tag = `h${level}`;
  return <Tag id={heading.id} tabIndex={-1}><a href={`#${heading.id}`}>{children}</a></Tag>;
}

export default function Statement() {
  const { hash, search } = useLocation();
  const redirect = resolveStatementHash(hash);
  if (redirect) return <Navigate to={`/statement${search}#${redirect}`} replace />;
  return <div className="page">
    <Seo title="Research Statement" description="Reliable AI agents under human control: oversight before action, preserving safety through continual updates, and authorization across delegated workflows." path="/statement" />
    <Nav skipToContent />
    <SiteFrame className="statement-shell">
        <p className="portfolio-eyebrow">Research statement · 13 September 2026</p>
        <h1>Reliable AI agents under human control</h1>
        <p className="statement-lead">Oversight before action, preserving safety through continual updates, and authorization across delegated workflows.</p>
        <ResearchOverview />
        <IndustryJDReferences />
        <div className="statement-download"><a href="/data/Jian_Wang_Research_Statement_2026.pdf" target="_blank" rel="noreferrer">Full research statement (PDF) ↗</a>
          <Link to="/research_coding_statement">Program reasoning statement ↗</Link>
          <a href="#research-foundation-and-approach">Research foundation ↓</a></div>
        <nav className="statement-toc" aria-label="Statement sections">
          <span>The research agenda</span>
          <ol>{sections.map(heading => <li key={heading.id}><a href={`#${heading.id}`}>{heading.title}</a></li>)}</ol>
        </nav>
        <article className="statement-body" aria-label="Research statement text">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{introduction}</ReactMarkdown>
          <details className="industry-references" id="research-foundation-and-approach" tabIndex={-1}>
            <summary>Research foundation and approach</summary>
            <div className="industry-references-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{foundation}</ReactMarkdown>
            </div>
          </details>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            h2: props => <LinkedHeading {...props} level={2} lineOffset={agendaLineOffset} />,
            h3: props => <LinkedHeading {...props} level={3} lineOffset={agendaLineOffset} />,
            table: ReadingTable,
            img: ({ node, ...props }) => <a className="statement-diagram-link" href={props.src} target="_blank" rel="noreferrer" title="Open diagram at full size"><img {...props} /></a>,
          }}>{agenda}</ReactMarkdown>
          <details className="industry-references" id="references" tabIndex={-1}>
            <summary>References</summary>
            <div className="industry-references-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{references}</ReactMarkdown>
            </div>
          </details>
        </article>
        <div className="statement-download"><Link to="/pubs">Browse the published evidence ↗</Link>
          <Link to="/work#research-projects">Explore earlier research projects ↗</Link>
          <a href="#research-overview">Back to the overview ↑</a></div>
    </SiteFrame><Footer />
  </div>;
}
