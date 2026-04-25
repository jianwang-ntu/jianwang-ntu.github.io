import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { Chip, Note, Tag, Thumb, SectionHead } from '../components/primitives.jsx';
import { NEWS, FEATURED_PUBS } from '../data.jsx';

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

function PubRow({ p }) {
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

function NewsItem({ date, children }) {
  return (
    <div className="news-item">
      <span className="date">{date}</span>
      <span style={{ flex: 1 }}>{children}</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="page">
      <Nav />
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
            <Chip solid href="/data/JianWang_cv.pdf">↓ Download CV</Chip>
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
                '<span style="background: rgba(250,250,247,0.6); padding: 4px; font-family: var(--mono); font-size: 10px;">[photo]</span>';
            }}
          />
        </div>
      </section>

      <section className="home-body">
        <div>
          <SectionHead>Featured work</SectionHead>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATURED_PUBS.map((p, i) => <PubRow key={i} p={p} />)}
          </div>
          <div style={{ marginTop: 14, fontFamily: 'var(--mono)', fontSize: 11 }}>
            → <a href="/pubs">see all publications</a> · <a href="/work">see the work behind them</a>
          </div>
        </div>
        <div>
          <SectionHead>News</SectionHead>
          <div className="news-list">
            {NEWS.slice(0, 7).map(([d, t], i) => <NewsItem key={i} date={d}>{t}</NewsItem>)}
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
              <div>· Automated program repair (LLM-based)</div>
              <div>· AI-generated code detection</div>
              <div>· Execution-trace reasoning for code LLMs</div>
              <div>· Robustness & fairness of neural systems</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
