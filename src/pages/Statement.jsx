import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import ApHead from '../components/ApHead.jsx';
import markdown from '../content/research-statement.md?raw';
import { statementHeadings } from '../statement-headings.js';

const headings = statementHeadings(markdown);
function LinkedHeading({ node, children, level }) {
  const heading = headings.find(h => h.line === node.position.start.line);
  const Tag = `h${level}`;
  return <Tag id={heading.id} tabIndex={-1}><a href={`#${heading.id}`}>{children}</a></Tag>;
}

export default function Statement() {
  return <div className="page">
    <Seo title="Research Statement" description="Jian Wang's research statement: trustworthy agent networks, assured agency, collective agency, and independent evidence. Research agenda, 2026–2029." path="/statement" />
    <Nav skipToContent />
    <div className="portfolio-shell">
      <ApHead sidebar />
      <main id="main-content" className="portfolio-content">
        <p className="portfolio-eyebrow">Research statement · September 2026</p>
        <h1>Trustworthy agent networks</h1>
        <p className="page-deck">Assured agency and collective agency.</p>
        <p>How can intelligent agents expand what people and organizations accomplish while remaining accountable to those they represent?</p>
        <p className="statement-status">A proposed research agenda for 2026–2029. The hypotheses and mechanisms below are directions to test; published research is linked separately.</p>
        <div className="statement-download"><a href="/data/Jian_Wang_Research_Statement_202609.pdf" target="_blank" rel="noreferrer">Download full statement (PDF) ↗</a>
          <Link to="/pubs">Published research ↗</Link><a href="#research-background">Research background ↓</a></div>
        <div className="statement-overview" aria-label="Clickable research overview">
          <p className="portfolio-eyebrow">Two directions · One shared foundation</p>
          <nav className="statement-map" aria-label="Research directions">
            <a href="#essay-i-assured-agency"><span>DIRECTION 01</span><strong>Assured agency</strong><span>How does agency persist through change?<br />Mandates · Execution · Capability growth ↗</span></a>
            <a href="#essay-ii-collective-agency"><span>DIRECTION 02</span><strong>Collective agency</strong><span>When does cooperation create lasting value?<br />Representation · Coordination · Delivery ↗</span></a>
            <a className="foundation" href="#independent-evidence-and-controlled-adaptation"><span>SHARED FOUNDATION</span><strong>Independent evidence & controlled adaptation</strong><span>Verify outcomes → Attribute failures → Evaluate updates ↗</span></a>
          </nav>
        </div>
        <details className="statement-toc">
          <summary>On this page · jump to any section</summary>
          <nav aria-label="Statement sections"><ul>{headings.map(h => <li className={h.level === 3 ? 'toc-sub' : ''} key={h.id}>
            <a href={`#${h.id}`}>{h.title}</a>
          </li>)}</ul></nav>
        </details>
        <article className="statement-body" aria-label="Research statement text">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            h2: props => <LinkedHeading {...props} level={2} />,
            h3: props => <LinkedHeading {...props} level={3} />,
          }}>{markdown}</ReactMarkdown>
        </article>
        <section id="research-background" className="statement-section" tabIndex={-1}>
          <div className="section-heading"><h2>Research background</h2><Link className="text-link" to="/work">Explore the projects ↗</Link></div>
          <p>My research on AI-assisted programming provides the background for this agenda. The following themes connect my published work to the questions I want to pursue next.</p>
          <section id="code-trustworthiness" className="statement-section" tabIndex={-1}>
            <h3><a href="#code-trustworthiness">Code LLM trustworthiness</a></h3>
            <p>I study automated program repair and execution semantics: how to assess generated code against what programs actually do. <Link to="/pubs/ratchet">RATCHET</Link> investigates retrieval-augmented repair; <Link to="/pubs/defects4c">Defects4C</Link> provides executable C/C++ bugs; and <Link to="/pubs/code-semantics-execution-traces">the execution-trace study</Link> examines the limits of adding runtime information to code models.</p>
          </section>
          <section id="code-detection" className="statement-section" tabIndex={-1}>
            <h3><a href="#code-detection">AI-generated code detection</a></h3>
            <p>How well does detection built for prose hold up on code? My <Link to="/pubs/aigc-detectors-on-code">ASE 2024 study</Link> evaluates detectors on code content. This work motivates careful evaluation under task and distribution changes, and a distinction between a detector's score and evidence of reliability.</p>
          </section>
          <section id="long-horizon" className="statement-section" tabIndex={-1}>
            <h3><a href="#long-horizon">Long-horizon AI for software maintenance</a></h3>
            <p>I want to extend this foundation to agentic, automatic and reliable maintenance across long-running tasks. This is a research direction: agents must preserve useful state, operate within delegated authority, verify effects and recover when assumptions change. The <a href="#essay-i-assured-agency">Assured Agency essay</a> develops these questions.</p>
          </section>
        </section>
        <a className="text-link" href="#main-content">Back to the overview ↑</a>
      </main>
    </div><Footer />
  </div>;
}
