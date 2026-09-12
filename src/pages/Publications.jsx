import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import PageHead from '../components/PageHead.jsx';
import Seo from '../components/Seo.jsx';
import { Box, Chip, Note, Tag, Thumb } from '../components/primitives.jsx';
import { ALL_PUBS } from '../data.jsx';
import Figure, { PAPER_IMAGES } from '../components/figures.jsx';
import ApHead from '../components/ApHead.jsx';
import Authors from '../components/Authors.jsx';
import { Link } from 'react-router-dom';
import { PUB_META } from '../data-pubs.js';
import ResearchConnection from '../components/ResearchConnection.jsx';

/* ─── shared badge ──────────────────────────────────────────────── */
function PubBadge({ b }) {
  if (b.href) {
    return (
      <a href={b.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
        <Tag>{b.label}</Tag>
      </a>
    );
  }
  return <Tag>{b.label}</Tag>;
}

/* ─── Classic layout ─────────────────────────────────────────────── */
/* ─── Academic layout ────────────────────────────────────────────── */
/* ─── academicpages mode ─────────────────────────────────────────── */

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
    <div className="ap-page">
      <ApHead sub={`${ALL_PUBS.length} papers across SE, ML and security venues · ${fromPaper} with the paper's own figure, ${drawn} with a drawn schematic`} />
      <div className="ap-page-body">
        <h2 className="ap-page-h2">Publications</h2>
        <p>My published work spans program repair, code-model evaluation and earlier research on AI testing and robustness.
          The <Link to="/statement#published-foundations">research statement</Link> explains how selected papers motivate
          a proposed direction in software-maintenance agents. <Link to="/work?type=research#project-index">Browse their projects and artifacts ↗</Link></p>
        <p><b>Bold</b> author is me.</p>
        {years.map((y) => (
          <React.Fragment key={y}>
            <h3 className="ap-year">{y}</h3>
            {byYear[y].map((p) => <ApPubRow key={p.id} p={p} />)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ─── Page shell ──────────────────────────────────────────────────── */
export default function Publications() {

  const byYear = {};
  ALL_PUBS.forEach((p) => { (byYear[p.year] = byYear[p.year] || []).push(p); });
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);
  const kindCount = ALL_PUBS.reduce((acc, p) => { acc[p.kind] = (acc[p.kind] || 0) + 1; return acc; }, {});

  return (
    <div className="page">
      <Seo
        title="Publications"
        description={`Peer-reviewed research and preprints by Jian Wang on code LLM security, fake-content detection, and program repair. ${ALL_PUBS.length} papers across SE, ML, and security venues.`}
        path="/pubs"
      />
      <Nav />
      <AcademicPagesPublications byYear={byYear} years={years} />
      <Footer />
    </div>
  );
}
