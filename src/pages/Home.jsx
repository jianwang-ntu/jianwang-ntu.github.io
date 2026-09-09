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

function ApHomeHead() {
  return (
    <header className="ap-home-head">
      <img
        src="/images/jornbowrl_circle3.jpg"
        alt="Jian Wang"
        className="ap-home-avatar"
        onError={(e) => { e.currentTarget.src = '/images/headshot-ai.png'; e.currentTarget.onerror = null; }}
      />
      <h1 className="ap-home-name">Jian Wang · 王剑</h1>
      <p className="ap-home-meta">
        <a href="mailto:jian004@e.ntu.edu.sg">jian004@e.ntu.edu.sg</a><br />
        College of Computing and Data Science<br />
        Nanyang Technological University<br />
        Singapore
      </p>
      <nav className="ap-home-links">
        <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar</a>
        <a href="https://github.com/jianwang-ntu" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://twitter.com/jornbowrl" target="_blank" rel="noreferrer">Twitter</a>
        <a href="/data/Jian_Wang_CV_Academic_202605.pdf" target="_blank" rel="noreferrer">CV</a>
        <a href="/data/Jian_Wang_Research_Statement.pdf" target="_blank" rel="noreferrer">Research statement</a>
      </nav>
    </header>
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
    <div className="ap-home">
      <ApHomeHead />

      <div className="ap-home-body">
        <p>
          I am a recent PhD from the College of Computing and Data Science (CCDS) at{' '}
          <b>Nanyang Technological University</b>, advised by{' '}
          <a href="https://personal.ntu.edu.sg/yi_li/" target="_blank" rel="noreferrer">Prof. Li Yi</a>.
          My research sits at the intersection of <b>software engineering</b>,{' '}
          <b>large language models</b> and <b>trustworthy AI systems</b> — with a focus on{' '}
          <b>automated program repair</b>, <b>AI-generated code detection</b> and{' '}
          <b>execution-grounded reasoning</b> over programs.
        </p>
        <p>
          Before research I spent <b>~8 years in industry</b>: the AI Lab at <b>Xiaomi</b>,
          training GANs for portrait background removal and face cartoonisation, and a backend
          role at <b>58.com</b>, building an async web framework serving 100M+ daily requests.
        </p>

        <h2 className="ap-home-h2">Research Interests</h2>
        <ul className="ap-home-list">
          <li><b>Code LLM trustworthiness</b>: automated program repair, execution semantics</li>
          <li><b>AI-generated code detection</b>: how detection built for prose holds up on code</li>
          <li><b>Long-horizon AI for software maintenance</b>: agentic, automatic, reliable</li>
        </ul>

        <h2 className="ap-home-h2">Selected Publications</h2>
        <p style={{ marginBottom: 18 }}>
          <b>Bold</b> author is me. Each figure is the paper&rsquo;s own. →{' '}
          <a href="/pubs">all publications</a> · <a href="/work">the work behind them</a>
        </p>
        {FEATURED_PUBS.map((p, i) => <ApPubEntry key={i} p={p} />)}

        <h2 className="ap-home-h2">News</h2>
        <div className="ap-home-news">
          {NEWS.slice(0, 7).map(([d, t], i) => (
            <div key={i}><span className="d">{d}</span>{t}</div>
          ))}
        </div>

        <h2 className="ap-home-h2">Awards</h2>
        <ul className="ap-home-list">
          <li><b>S$100,000 prize</b> — 3rd place, AI Singapore Deepfake Detection Challenge, 2022</li>
        </ul>
      </div>
    </div>
  );
}

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
