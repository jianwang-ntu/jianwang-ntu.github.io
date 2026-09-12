import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import { ALL_PUBS } from '../data.jsx';
import Figure, { PAPER_IMAGES } from '../components/figures.jsx';
import ApHead from '../components/ApHead.jsx';
import Authors from '../components/Authors.jsx';
import { Link } from 'react-router-dom';
import { PUB_META } from '../data-pubs.js';
import ResearchConnection from '../components/ResearchConnection.jsx';

function ApPubRow({ p }) {
  const meta = PUB_META[p.id];
  return (
    <article className="ap-pub ap-pub-2col">
      <div className="ap-pub-figcol">
        {p.figure
          ? <Figure id={p.figure} />
          : <div className="ap-fig-none">{p.venue}<span>{p.year}</span></div>}
      </div>
      <div className="ap-pub-body">
        <h3 className="ap-pub-title">
          {meta
            ? <Link to={`/pubs/${meta.key}`}>{p.title}</Link>
            : p.title}
        </h3>
        <p className="ap-pub-authors">
          {meta ? <Authors names={meta.authors} /> : p.authors}
        </p>
        <p className="ap-pub-venue">
          <i>{p.venue}</i>, {p.year}
          {p.note && <span className="ap-pub-note"> · {p.note}</span>}
        </p>
        <p className="ap-pub-links">
          {(p.badges || []).map((b, i) => (
            <a key={i} href={b.href} target="_blank" rel="noreferrer" className="ap-lnk">{b.label}</a>
          ))}
          {meta && <Link to={`/pubs/${meta.key}`} className="ap-lnk ap-lnk-more">details</Link>}
        </p>
        {meta?.brief && <p className="ap-pub-brief">{meta.brief}</p>}
        {meta && <ResearchConnection publication={meta.key} compact />}
      </div>
    </article>
  );
}

function AcademicPagesPublications({ byYear, years }) {
  // count only figures lifted from the papers themselves; the rest are
  // hand-drawn schematics and must not be described as the paper's own
  const fromPaper = ALL_PUBS.filter((p) => p.figure && PAPER_IMAGES[p.figure]).length;
  const drawn = ALL_PUBS.filter((p) => p.figure && !PAPER_IMAGES[p.figure]).length;
  return (
    <div className="portfolio-shell publications-shell">
      <ApHead sidebar />
      <main id="main-content" className="portfolio-content publications-content">
        <p className="portfolio-eyebrow">Software engineering · AI evaluation · Security</p>
        <h1>Publications</h1>
        <p>My published work spans program repair, code-model evaluation and earlier research on AI testing and robustness.
          The <Link to="/statement#published-foundations">research statement</Link> connects methods and lessons from this work
          to my future agenda in trustworthy agent networks.</p>
        <p className="publication-index-note">{ALL_PUBS.length} papers · {fromPaper} original paper figures · {drawn} explanatory schematics · My name appears in <b>bold</b>.</p>
        <Link className="text-link" to="/work?type=research#project-index">Browse research projects & artifacts ↗</Link>
        {years.map((y) => (
          <React.Fragment key={y}>
            <h2 className="ap-year">{y}</h2>
            {byYear[y].map((p) => <ApPubRow key={p.id} p={p} />)}
          </React.Fragment>
        ))}
      </main>
    </div>
  );
}

/* ─── Page shell ──────────────────────────────────────────────────── */
export default function Publications() {

  const byYear = {};
  ALL_PUBS.forEach((p) => { (byYear[p.year] = byYear[p.year] || []).push(p); });
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="page">
      <Seo
        title="Publications"
        description={`Peer-reviewed research and preprints by Jian Wang on code LLM security, fake-content detection, and program repair. ${ALL_PUBS.length} papers across SE, ML, and security venues.`}
        path="/pubs"
      />
      <Nav skipToContent />
      <AcademicPagesPublications byYear={byYear} years={years} />
      <Footer />
    </div>
  );
}
