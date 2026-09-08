import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import { Chip, Note, Tag, Thumb, SectionHead } from '../components/primitives.jsx';
import { NEWS, FEATURED_PUBS } from '../data.jsx';
import Figure from '../components/figures.jsx';

/* ─── shared badge renderer ───────────────────────────────────────── */
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

/* ─── Classic layout pieces ─────────────────────────────────────── */
/* ─── Academic layout pieces ────────────────────────────────────── */
/* ─── academicpages mode ──────────────────────────────────────────────
   Sticky identity rail on the left, scrolling content on the right —
   the layout convention academicpages.github.io popularised. Markup and
   styles are original to this repo; only the arrangement is borrowed. */

function ApSidebar() {
  return (
    <aside className="ap-sidebar">
      <img
        src="/images/jornbowrl_circle3.jpg"
        alt="Jian Wang"
        className="ap-avatar"
        onError={(e) => { e.currentTarget.src = '/images/headshot-ai.png'; }}
      />
      <h1 className="ap-name">Jian Wang</h1>
      <p className="ap-name-alt">王剑</p>
      <p className="ap-role">PhD, Nanyang Technological University</p>
      <p className="ap-role ap-role-muted">Code LLM security · program repair</p>

      <ul className="ap-meta">
        <li><span className="ap-meta-k">Location</span> Singapore</li>
        <li><span className="ap-meta-k">Email</span>{' '}
          <a href="mailto:jian004@e.ntu.edu.sg">jian004@e.ntu.edu.sg</a></li>
        <li><span className="ap-meta-k">Scholar</span>{' '}
          <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">citations</a></li>
        <li><span className="ap-meta-k">GitHub</span>{' '}
          <a href="https://github.com/jianwang-ntu" target="_blank" rel="noreferrer">jianwang-ntu</a></li>
        <li><span className="ap-meta-k">Twitter</span>{' '}
          <a href="https://twitter.com/jornbowrl" target="_blank" rel="noreferrer">@jornbowrl</a></li>
      </ul>

      <div className="ap-dl">
        <a href="/data/Jian_Wang_CV_Academic_202605.pdf" target="_blank" rel="noreferrer">↓ CV (EN)</a>
        <a href="/data/Jian_Wang_CV_Chinese_202605.pdf" target="_blank" rel="noreferrer">↓ CV (中文)</a>
        <a href="/data/Jian_Wang_Research_Statement.pdf" target="_blank" rel="noreferrer">↓ Research statement</a>
      </div>
    </aside>
  );
}

function ApPubEntry({ p }) {
  return (
    <article className="ap-pub">
      {p.figure && <Figure id={p.figure} />}
      <div className="ap-pub-body">
        <h3 className="ap-pub-title">{p.title}</h3>
        <p className="ap-pub-authors">{p.authors}</p>
        <p className="ap-pub-venue">
          <span className="ap-venue-chip">{p.venue} {p.year}</span>
          {p.note && <span className="ap-pub-note">{p.note}</span>}
        </p>
        <p className="ap-pub-links">
          {(p.badges || []).map((b, i) => (
            <a key={i} href={b.href} target="_blank" rel="noreferrer" className="ap-lnk">{b.label}</a>
          ))}
        </p>
      </div>
    </article>
  );
}

function AcademicPagesHome() {
  return (
    <div className="ap-shell">
      <ApSidebar />
      <main className="ap-main">
        <h2 className="ap-h2">About</h2>
        <p className="ap-text">
          Recent PhD from the College of Computing and Data Science (CCDS) at{' '}
          <b>Nanyang Technological University</b>, advised by{' '}
          <a href="https://personal.ntu.edu.sg/yi_li/" target="_blank" rel="noreferrer">Prof. Li Yi</a>.
          Research sits at the intersection of <b>software engineering</b>,{' '}
          <b>large language models</b> and <b>trustworthy AI systems</b> — automated
          program repair, AIGC code detection, and execution-grounded reasoning over programs.
        </p>
        <p className="ap-text">
          Before research: <b>~8 years</b> in industry — AI Lab at Xiaomi (GANs for portrait
          background removal and face cartoonisation) and a backend role at 58.com
          (async web framework serving 100M+ daily requests).
        </p>

        <h2 className="ap-h2">Research interests</h2>
        <ul className="ap-list">
          <li>Code LLM intelligence and trustworthiness (APR, semantics reasoning)</li>
          <li>AI-generated code (AIGC) detection</li>
          <li>Long-horizon AI for software maintenance — agentic, automatic, reliable</li>
        </ul>

        <h2 className="ap-h2">Selected publications</h2>
        <p className="ap-note">
          <b>Bold</b> author is me. Each figure sketches the paper's actual pipeline. →{' '}
          <a href="/pubs">all publications</a> · <a href="/work">the work behind them</a>
        </p>
        {FEATURED_PUBS.map((p, i) => <ApPubEntry key={i} p={p} />)}

        <h2 className="ap-h2">News</h2>
        <div className="ap-news">
          {NEWS.slice(0, 7).map(([d, t], i) => (
            <div key={i} className="ap-news-row">
              <span className="ap-news-date">{d}</span>
              <span>{t}</span>
            </div>
          ))}
        </div>

        <p className="ap-award">
          ★ <b>S$100,000 prize</b> · 3rd place · AI Singapore Deepfake Detection Challenge · 2022
        </p>
      </main>
    </div>
  );
}

/* ─── Page shell ──────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="page">
      <Seo
        title="Home"
        description="Jian Wang — PhD, NTU Singapore. Research on code LLM security, automated program repair, and AI-generated code detection."
        path="/home"
      />
      <Nav />
      <AcademicPagesHome />
      <Footer />
    </div>
  );
}
