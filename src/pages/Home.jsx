import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import { Chip, Note, Tag, Thumb, SectionHead } from '../components/primitives.jsx';
import { useStyleMode } from '../context/StyleCtx.jsx';
import { NEWS, FEATURED_PUBS } from '../data.jsx';

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
function ClassicPubRow({ p }) {
  return (
    <div className="pub-row">
      <Thumb label={p.thumb} w={90} h={64} />
      <div style={{ flex: 1 }}>
        <div className="pub-title">{p.title}</div>
        <div className="pub-authors">{p.authors}</div>
        <div className="pub-meta">
          <span className="venue">{p.venue} · {p.year}</span>
          {p.badges?.map((b, i) => <PubBadge key={i} b={b} />)}
          {p.note && <Note>{p.note}</Note>}
        </div>
      </div>
    </div>
  );
}

function ClassicNewsItem({ date, children }) {
  return (
    <div className="news-item">
      <span className="date">{date}</span>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}

function ClassicHome() {
  return (
    <>
      <section className="home-hero">
        <div>
          <div className="kicker" style={{ letterSpacing: 2 }}>
            NTU PhD · SMU RESEARCH · CODE LLM SECURITY
          </div>
          <h1>Code LLM security<br /><u>and intelligence.</u></h1>
          <div className="lede">
            I'm <b>Jian Wang (王剑)</b>, a recent PhD from the College of Computing
            and Data Science (CCDS), <b>Nanyang Technological University</b>,
            advised by{' '}
            <a href="https://personal.ntu.edu.sg/yi_li/" target="_blank" rel="noreferrer">Prof. Li Yi</a>.
            My research sits at the intersection of <b>software engineering</b>,{' '}
            <b>large language models</b>, and <b>trustworthy AI systems</b> — from
            automated program repair and AIGC code detection to execution-grounded
            reasoning over programs. Before research I spent <b>~8 years</b> in
            industry: AI Lab at Xiaomi (trained GANs for portrait background removal
            and face cartoonisation) and a backend role at 58.com (high-performance
            async web framework serving 100M+ daily requests).
          </div>
          <div className="ctas">
            <Chip solid href="/data/Jian_Wang_CV_Academic_202605.pdf">↓ CV (EN)</Chip>
            <Chip solid href="/data/Jian_Wang_CV_Chinese_202605.pdf">↓ CV (中文)</Chip>
            <Chip href="/data/Jian_Wang_Research_Statement.pdf">Research statement</Chip>
            <Chip href="mailto:jian004@e.ntu.edu.sg">Email →</Chip>
            <Chip href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ">Scholar</Chip>
            <Chip href="https://twitter.com/jornbowrl">Twitter</Chip>
          </div>
        </div>
        <div className="headshot" style={{ background: 'var(--bg)', padding: 0 }}>
          <img
            src="/images/headshot-ai.png"
            alt="Jian Wang"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.innerHTML =
                '<span style="background:rgba(250,250,247,0.6);padding:4px;font-family:var(--mono);font-size:10px">[photo]</span>';
            }}
          />
        </div>
      </section>

      <section className="home-body">
        <div>
          <SectionHead>Featured work</SectionHead>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATURED_PUBS.map((p, i) => <ClassicPubRow key={i} p={p} />)}
          </div>
          <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 11 }}>
            → <a href="/pubs">see all publications</a> · <a href="/work">see the work behind them</a>
          </div>
        </div>
        <div>
          <SectionHead>News</SectionHead>
          <div className="news-list">
            {NEWS.slice(0, 7).map(([d, t], i) => <ClassicNewsItem key={i} date={d}>{t}</ClassicNewsItem>)}
          </div>
          <div style={{ marginTop: 24 }}>
            <SectionHead>Awards</SectionHead>
            <div style={{ fontSize: 11.5, lineHeight: 1.7 }}>
              <div>★ <b>S$100,000 prize</b> · 3rd place · AI Singapore Deepfake Detection Challenge · 2022</div>
              <div>★ AI / Computer Vision certification · Tsinghua University · 2019</div>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <SectionHead>Research interests</SectionHead>
            <div style={{ fontSize: 11.5, lineHeight: 1.7 }}>
              <div>· Trustworthy Code Intelligence (TCI)</div>
              <div>· AI-generated code detection (provenance & robustness)</div>
              <div>· Automated program repair at scale (Defects4C, RATCHET)</div>
              <div>· Execution-semantics-grounded reasoning for code LLMs</div>
              <div>· Long-horizon AI for software maintenance</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── Academic layout pieces ────────────────────────────────────── */
function AcademicPubEntry({ p }) {
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

function AcademicHome() {
  return (
    <>
      <section className="about-section">
        {/* Left: profile card */}
        <div className="profile-card">
          <img
            src="/images/jornbowrl_circle.jpg"
            alt="Jian Wang"
            className="profile-avatar"
            onError={(e) => { e.currentTarget.src = '/images/headshot-ai.png'; }}
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
          <div className="cv-downloads">
            <a href="/data/Jian_Wang_CV_Academic_202605.pdf" target="_blank" rel="noreferrer" className="cv-download">↓ CV (EN)</a>
            <a href="/data/Jian_Wang_CV_Chinese_202605.pdf" target="_blank" rel="noreferrer" className="cv-download">↓ CV (中文)</a>
          </div>
          <a href="/data/Jian_Wang_Research_Statement.pdf" target="_blank" rel="noreferrer" className="cv-download" style={{ marginTop: 6 }}>↓ Research statement</a>
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
            <li>Trustworthy Code Intelligence (TCI)</li>
            <li>AI-generated code detection (provenance &amp; robustness)</li>
            <li>Automated program repair at scale (Defects4C, RATCHET)</li>
            <li>Execution-semantics-grounded reasoning for code LLMs</li>
            <li>Long-horizon AI for software maintenance</li>
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

      <section className="home-pubs-section">
        <h2 className="bio-section-h">Selected Publications</h2>
        <p className="home-pubs-intro">
          <b>Bold</b> author is me. →{' '}
          <a href="/pubs">see all publications</a> ·{' '}
          <a href="/work">see the work behind them</a>
        </p>
        {FEATURED_PUBS.map((p, i) => <AcademicPubEntry key={i} p={p} />)}
      </section>
    </>
  );
}

/* ─── Page shell ──────────────────────────────────────────────────── */
export default function Home() {
  const { mode } = useStyleMode();
  return (
    <div className="page">
      <Seo
        title="Home"
        description="Jian Wang — PhD, NTU Singapore. Research on code LLM security, automated program repair, and AI-generated code detection."
        path="/home"
      />
      <Nav />
      {mode === 'academic' ? <AcademicHome /> : <ClassicHome />}
      <Footer />
    </div>
  );
}
