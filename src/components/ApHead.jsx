import React from 'react';
import { Link } from 'react-router-dom';

/* The identity block that opens every page: centred avatar, name, contact
   lines and a rule-bounded link strip. Shared so Home, Publications and
   Work & Projects use one header rather than three copies that drift apart.
   Only external links live here — the masthead already carries the site's
   own routes, and repeating them reads as clutter. `sub` adds a
   page-specific summary line beneath. */
export default function ApHead({ sub, sidebar = false }) {
  const Name = sidebar ? 'h2' : 'h1';
  return (
    <header className={`ap-page-head${sidebar ? ' profile-rail' : ''}`}>
      <img
        src="/images/jornbowrl_circle3.jpg"
        alt="Jian Wang"
        className="ap-page-avatar"
        onError={(e) => { e.currentTarget.src = '/images/headshot-ai.png'; e.currentTarget.onerror = null; }}
      />
      <Name className="ap-page-name">Jian Wang <span>王剑</span></Name>
      {sidebar && <p className="profile-degree">PhD · Computer Science</p>}
      <p className="ap-page-meta">
        <a href="mailto:jian004@e.ntu.edu.sg">jian004@e.ntu.edu.sg</a><br />
        PhD, Nanyang Technological University<br />
        Singapore
      </p>
      <nav className="ap-page-links" aria-label="Profile links">
        <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar</a>
        <a href="https://github.com/jianwang-ntu" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://twitter.com/jornbowrl" target="_blank" rel="noreferrer">Twitter</a>
        <a href="/data/Jian_Wang_CV_Academic_202605.pdf" target="_blank" rel="noreferrer">CV</a>
        <Link to="/statement">Research statement</Link>
      </nav>
      {sub && <p className="ap-page-sub">{sub}</p>}
    </header>
  );
}
