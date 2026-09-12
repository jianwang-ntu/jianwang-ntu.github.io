import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import Figure from '../components/figures.jsx';
import Authors from '../components/Authors.jsx';
import { ALL_PUBS } from '../data.jsx';
import { PUB_META, KEY_TO_ID } from '../data-pubs.js';
import ResearchConnection from '../components/ResearchConnection.jsx';

export default function PublicationDetail() {
  const { key } = useParams();
  const [copied, setCopied] = useState(false);
  const id = KEY_TO_ID[key];
  const pub = ALL_PUBS.find((p) => p.id === id);
  const meta = PUB_META[id];
  if (!pub || !meta) return <Navigate to="/pubs" replace />;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(meta.bibtex);
      setCopied(true); setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked — the text is selectable anyway */ }
  };

  return (
    <div className="page">
      <Seo
        title={pub.title}
        description={meta.brief}
        path={`/pubs/${meta.key}`}
      />
      <Nav />
      <article className="pub-detail">
        <Link to="/pubs" className="pub-back">← all publications</Link>

        <h1 className="pub-detail-title">{pub.title}</h1>
        <p className="pub-detail-authors"><Authors names={meta.authors} /></p>
        <p className="pub-detail-venue">
          <i>{pub.venue}</i>, {pub.year}
          {pub.note && <span className="ap-pub-note"> · {pub.note}</span>}
        </p>

        <p className="ap-pub-links pub-detail-links">
          {(pub.badges || []).map((b, i) => (
            <a key={i} href={b.href} target="_blank" rel="noreferrer" className="ap-lnk">{b.label}</a>
          ))}
        </p>

        {pub.figure && <Figure id={pub.figure} className="pub-detail-fig" />}

        <p className="pub-detail-brief">{meta.brief}</p>

        {meta.abstract ? (
          <>
            <h2 className="ap-h2">Abstract</h2>
            <p className="ap-text">{meta.abstract}</p>
          </>
        ) : (
          <p className="pub-detail-noabs">
            An abstract has not been added to this page. Follow the publication links above for the source.
          </p>
        )}

        <ResearchConnection publication={meta.key} />

        <h2 className="ap-h2">
          Cite
          <button className="pub-cite-copy" onClick={copy}>{copied ? 'copied' : 'copy'}</button>
        </h2>
        <pre className="pub-bibtex">{meta.bibtex}</pre>
      </article>
      <Footer />
    </div>
  );
}
