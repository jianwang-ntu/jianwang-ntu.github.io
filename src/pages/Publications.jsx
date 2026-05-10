import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import { ALL_PUBS } from '../data.jsx';

function PubEntry({ p }) {
  const firstLink = p.badges?.[0];
  return (
    <article className="pub-entry">
      <div className="pub-entry-title">
        {firstLink?.href
          ? <a href={firstLink.href} target="_blank" rel="noreferrer">{p.title}</a>
          : p.title}
        {p.note && <span className="pub-entry-feat">{p.note}</span>}
      </div>
      <div className="pub-entry-authors">{p.authors}</div>
      <div className="pub-entry-venue">{p.venue} · {p.year}</div>
      {p.badges && p.badges.length > 0 && (
        <div className="pub-entry-links">
          {p.badges.map((b, i) =>
            b.href
              ? <a key={i} href={b.href} target="_blank" rel="noreferrer" className="pub-entry-lnk">{b.label}</a>
              : <span key={i} className="pub-entry-lnk">{b.label}</span>
          )}
        </div>
      )}
    </article>
  );
}

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
      <Nav />

      <div className="pubs-page">

        {/* ── Left sidebar ──────────────────────────────────────────── */}
        <div className="pubs-sidebar">
          <img
            src="/images/jornbowrl_circle.jpg"
            alt="Jian Wang"
            className="sidebar-avatar"
            onError={(e) => {
              e.currentTarget.src = '/images/headshot-ai.png';
              e.currentTarget.onerror = null;
            }}
          />
          <h3 className="sidebar-name">Jian Wang</h3>
          <p className="sidebar-bio">
            PhD · NTU Singapore<br />
            Code LLM Security &amp; Program Repair
          </p>
          <div className="sidebar-links">
            <a href="mailto:jian004@e.ntu.edu.sg">Email</a>
            <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar</a>
            <a href="https://github.com/jianwang-ntu" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://twitter.com/jornbowrl" target="_blank" rel="noreferrer">Twitter</a>
            <a href="/data/JianWang_cv.pdf" target="_blank" rel="noreferrer">CV (PDF)</a>
          </div>
        </div>

        {/* ── Main publications list ─────────────────────────────── */}
        <div className="pubs-main">
          <h1 className="pubs-page-title">Publications</h1>
          <p className="pubs-intro">
            <b>Bold</b> author is me. {ALL_PUBS.length} papers across SE, ML, and security venues.{' '}
            See also <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar</a>.
          </p>

          {years.map((y) => (
            <React.Fragment key={y}>
              <h2 className="pubs-year-h">{y}</h2>
              {byYear[y].map((p) => <PubEntry key={p.id} p={p} />)}
            </React.Fragment>
          ))}

          <p style={{ marginTop: 36, fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.55, lineHeight: 1.6 }}>
            For older / co-authored work, see{' '}
            <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">
              Google Scholar
            </a>.{' '}·{' '}
            <a href="/data/JianWang_cv.pdf" target="_blank" rel="noreferrer">↓ cv.pdf</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
