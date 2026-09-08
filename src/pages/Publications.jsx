import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import PageHead from '../components/PageHead.jsx';
import Seo from '../components/Seo.jsx';
import { Box, Chip, Note, Tag, Thumb } from '../components/primitives.jsx';
import { ALL_PUBS } from '../data.jsx';
import Figure from '../components/figures.jsx';
import Authors from '../components/Authors.jsx';
import { Link } from 'react-router-dom';
import { PUB_META } from '../data-pubs.js';

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
      </div>
    </article>
  );
}

function AcademicPagesPublications({ byYear, years }) {
  const withFig = ALL_PUBS.filter((p) => p.figure).length;
  return (
    <div className="ap-shell">
      <aside className="ap-sidebar">
        <img
          src="/images/jornbowrl_circle3.jpg"
          alt="Jian Wang"
          className="ap-avatar"
          onError={(e) => { e.currentTarget.src = '/images/headshot-ai.png'; e.currentTarget.onerror = null; }}
        />
        <h1 className="ap-name">Jian Wang</h1>
        <p className="ap-role">PhD, NTU Singapore</p>
        <p className="ap-role ap-role-muted">Code LLM security · program repair</p>
        <ul className="ap-meta">
          <li><span className="ap-meta-k">Papers</span> {ALL_PUBS.length}</li>
          <li><span className="ap-meta-k">Diagrams</span> {withFig}</li>
          <li><span className="ap-meta-k">Scholar</span>{' '}
            <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">citations</a></li>
        </ul>
        <div className="ap-dl">
          <a href="/data/Jian_Wang_CV_Academic_202605.pdf" target="_blank" rel="noreferrer">↓ CV (PDF)</a>
        </div>
      </aside>

      <main className="ap-main">
        <h2 className="ap-h2">Publications</h2>
        <p className="ap-note">
          <b>Bold</b> author is me. {ALL_PUBS.length} papers across SE, ML and security venues;
          {' '}{withFig} carry a schematic of the method.
        </p>
        {years.map((y) => (
          <React.Fragment key={y}>
            <h3 className="ap-year">{y}</h3>
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
