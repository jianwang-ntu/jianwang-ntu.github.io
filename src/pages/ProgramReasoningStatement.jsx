import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import markdown from '../content/program-reasoning-statement.md?raw';

const webMarkdown = markdown.replace(/<!--\s*pagebreak\s*-->/g, '');

export default function ProgramReasoningStatement() {
  return (
    <div className="page">
      <Seo
        title="Program Reasoning Research Statement"
        description="A research agenda for reliable program reasoning through learned semantic abstractions, formal feedback, and rigorous evaluation."
        path="/research_coding_statement"
      />
      <Nav skipToContent />
      <SiteFrame className="statement-shell program-reasoning-shell">
        <p className="portfolio-eyebrow">Targeted research statement · September 2026</p>
        <h1>Reliable Program Reasoning through Learning and Formal Feedback</h1>
        <p className="statement-lead">Learn useful semantic artifacts; check them against program behaviour.</p>
        <div className="statement-download">
          <a href="/data/Jian_Wang_Program_Reasoning_Statement_2026.pdf" target="_blank" rel="noreferrer">Two-page statement (PDF) ↗</a>
          <Link to="/statement">Primary research statement ↗</Link>
        </div>
        <article className="statement-body program-reasoning-body" aria-label="Program reasoning research statement">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{webMarkdown}</ReactMarkdown>
        </article>
        <div className="statement-download">
          <Link to="/pubs/loop-r1">Read the Loop-R1 preprint ↗</Link>
          <Link to="/pubs">Browse publications ↗</Link>
        </div>
      </SiteFrame>
      <Footer />
    </div>
  );
}
