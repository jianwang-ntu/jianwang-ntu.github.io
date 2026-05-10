import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import { NEWS, FEATURED_PUBS } from '../data.jsx';

function PubEntry({ p }) {
  const firstLink = p.badges?.[0];
  return (
    <div className="home-pub-entry">
      <div className="home-pub-title">
        {firstLink?.href
          ? <a href={firstLink.href} target="_blank" rel="noreferrer">{p.title}</a>
          : p.title}
        {p.note && <span className="home-pub-featured">{p.note}</span>}
      </div>
      <div className="home-pub-authors">{p.authors}</div>
      <div className="home-pub-venue">{p.venue} · {p.year}</div>
      {p.badges && p.badges.length > 0 && (
        <div className="home-pub-links">
          {p.badges.map((b, i) =>
            b.href
              ? <a key={i} href={b.href} target="_blank" rel="noreferrer" className="pub-lnk">{b.label}</a>
              : <span key={i} className="pub-lnk">{b.label}</span>
          )}
        </div>
      )}
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

      {/* ── Profile / About ─────────────────────────────────────────── */}
      <section className="about-section">

        {/* Left: profile card */}
        <div className="profile-card">
          <img
            src="/images/jornbowrl_circle.jpg"
            alt="Jian Wang"
            className="profile-avatar"
            onError={(e) => {
              e.currentTarget.src = '/images/headshot-ai.png';
            }}
          />
          <h2 className="profile-name">Jian Wang</h2>
          <p className="profile-sub">王剑</p>
          <p className="profile-sub">PhD · NTU Singapore</p>
          <p className="profile-sub">Code LLM Security</p>
          <div className="profile-links">
            <a href="mailto:jian004@e.ntu.edu.sg" className="soc-link">Email</a>
            <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer" className="soc-link">Scholar</a>
            <a href="https://github.com/jianwang-ntu" target="_blank" rel="noreferrer" className="soc-link">GitHub</a>
            <a href="https://twitter.com/jornbowrl" target="_blank" rel="noreferrer" className="soc-link">Twitter</a>
          </div>
          <a href="/data/JianWang_cv.pdf" target="_blank" rel="noreferrer" className="cv-download">↓ Download CV</a>
        </div>

        {/* Right: bio + interests + news */}
        <div className="bio-column">
          <h2 className="bio-section-h">Biography</h2>
          <p className="bio-text">
            I'm a recent PhD from the College of Computing and Data Science (CCDS) at{' '}
            <b>Nanyang Technological University</b>, advised by{' '}
            <a href="https://personal.ntu.edu.sg/yi_li/" target="_blank" rel="noreferrer">Prof. Li Yi</a>.
            My research sits at the intersection of <b>software engineering</b>,{' '}
            <b>large language models</b>, and <b>trustworthy AI systems</b> — from
            automated program repair and AIGC code detection to execution-grounded
            reasoning over programs.
          </p>
          <p className="bio-text">
            Before research I spent <b>~8 years</b> in industry: AI Lab at Xiaomi (trained
            GANs for portrait background removal and face cartoonisation) and a backend role
            at 58.com (high-performance async web framework serving 100M+ daily requests).
          </p>

          <h2 className="bio-section-h" style={{ marginTop: 22 }}>Research Interests</h2>
          <ul className="bio-interests">
            <li>Automated program repair (LLM-based)</li>
            <li>AI-generated code detection</li>
            <li>Execution-trace reasoning for code LLMs</li>
            <li>Robustness &amp; fairness of neural systems</li>
          </ul>

          <h2 className="bio-section-h">News</h2>
          <div className="bio-news">
            {NEWS.slice(0, 7).map(([d, t], i) => (
              <div key={i} className="news-row">
                <span className="news-date">{d}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 18, fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.6 }}>
            ★ <b>S$100,000 prize</b> · 3rd place · AI Singapore Deepfake Detection Challenge · 2022
          </p>
        </div>
      </section>

      {/* ── Selected Publications ──────────────────────────────────── */}
      <section className="home-pubs-section">
        <h2 className="bio-section-h">Selected Publications</h2>
        <p className="home-pubs-intro">
          <b>Bold</b> author is me. →{' '}
          <a href="/pubs">see all publications</a> ·{' '}
          <a href="/work">see the work behind them</a>
        </p>
        {FEATURED_PUBS.map((p, i) => <PubEntry key={i} p={p} />)}
      </section>

      <Footer />
    </div>
  );
}
