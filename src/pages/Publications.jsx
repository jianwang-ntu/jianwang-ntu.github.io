import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import Authors from '../components/Authors.jsx';
import { ALL_PUBS } from '../data.jsx';
import { PUB_META } from '../data-pubs.js';

function PublicationRow({ publication }) {
  const meta = PUB_META[publication.id];

  return (
    <article className="text-index-row publication-index-row">
      <div className="text-index-year">{publication.year}</div>
      <div className="text-index-body">
        <h2>{publication.title}</h2>
        <p className="text-index-meta">
          {meta ? <Authors names={meta.authors} /> : publication.authors}
          <span aria-hidden="true"> · </span>
          <i>{publication.venue}</i>
          {publication.note && <span> · {publication.note}</span>}
        </p>
        {meta?.brief && <p className="text-index-summary">{meta.brief}</p>}
        <p className="text-index-links">
          {(publication.badges || []).map((link) => (
            <a key={`${publication.id}-${link.label}`} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
          ))}
          {meta && <Link to={`/pubs/${meta.key}`}>Details</Link>}
        </p>
      </div>
    </article>
  );
}

export default function Publications() {
  return (
    <div className="page">
      <Seo
        title="Publications"
        description={`Peer-reviewed research and preprints by Jian Wang on code LLM security, fake-content detection, and program repair. ${ALL_PUBS.length} papers across SE, ML, and security venues.`}
        path="/pubs"
      />
      <Nav skipToContent />
      <SiteFrame className="publications-shell" mainClassName="publications-content text-index-page">
          <h1>Publications</h1>
          <p className="page-deck">Research on program repair, code-model evaluation, neural-network testing, and robustness.</p>
          <p className="text-index-intro">
            My name appears in <b>bold</b>. Details include figures, research context, and citations.
          </p>
          <p><Link className="text-link" to="/work#research-projects">Research projects and artifacts ↗</Link></p>
          <div className="text-index-list">
            {ALL_PUBS.map((publication) => <PublicationRow key={publication.id} publication={publication} />)}
          </div>
      </SiteFrame>
      <Footer />
    </div>
  );
}
