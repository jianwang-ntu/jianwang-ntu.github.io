import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import FormalReasoningFigure from '../components/FormalReasoningFigure.jsx';
import { NEWS, ALL_PUBS } from '../data.jsx';
import { PUB_META } from '../data-pubs.js';

const selectedPubs = ALL_PUBS.filter(p => ['C5', 'C4', 'C3', 'C2'].includes(p.id));

function AcademicPagesHome() {
  return (
    <SiteFrame mainClassName="home-content">
        <h1>About me</h1>
        <div className="home-bio">
          <p>
            I received my PhD in Computer Science from{' '}
            <strong>Nanyang Technological University</strong>, advised by{' '}
            <a href="https://personal.ntu.edu.sg/yi_li/" target="_blank" rel="noreferrer">Prof. Li Yi</a>.
            My work covers automated program repair, AI-generated code detection,
            and the evaluation of execution-trace information for code models.
          </p>
          <p>
            I bring eight years of <Link to="/work">industry experience</Link> in applied AI and large-scale software systems.
          </p>
        </div>
        <section className="home-section" aria-labelledby="interests-title">
          <div className="section-heading">
            <h2 id="interests-title">Research interests</h2>
            <Link className="text-link" to="/statement">Research statement ↗</Link>
          </div>
          <p>My research focuses on <strong>reliable AI-assisted programming</strong>: how coding agents can learn formal reasoning to write, repair, and maintain software. My proposed agenda connects{' '}
            <Link to="/statement#learning-reusable-proof-strategies">learning from verification</Link>,{' '}
            <Link to="/statement#compositional-verification">preserving guarantees through change</Link>, and{' '}
            <Link to="/statement#trustworthy-verification-feedback">aligning feedback with intended behavior</Link>.</p>
          <FormalReasoningFigure />
        </section>
        <section className="home-section" aria-labelledby="selected-title">
          <div className="section-heading"><h2 id="selected-title">Selected publications</h2>
            <Link className="text-link" to="/pubs">All publications ↗</Link></div>
          {selectedPubs.map(p => (
            <article className="home-publication" key={p.figure}>
              <span className="publication-year">{p.year}</span>
              <div>
                <h3><Link to={`/pubs/${PUB_META[p.id].key}`}>{p.title}</Link></h3>
                <p className="publication-authors">{p.authors}</p>
                <div className="publication-meta"><span>{p.venue}</span>
                  {p.note === 'THESIS SUMMARY' && <span className="small-label">Thesis summary</span>}
                  {p.badges?.map(b => <a key={b.label} href={b.href} target="_blank" rel="noreferrer">{b.label}</a>)}
                </div>
              </div>
            </article>
          ))}
        </section>
        <section className="home-section" aria-labelledby="news-title">
          <h2 id="news-title">News</h2>
          <div className="home-news">{NEWS.slice(0, 2).map(([date, text], i) => (
            <div key={i}><span>{date}</span><p>{text}</p></div>
          ))}</div>
        </section>
        <section className="home-section" aria-labelledby="award-title">
          <h2 id="award-title">Recognition</h2>
          <p>
            <a href="https://www.straitstimes.com/tech/tech-news/singaporean-wins-100k-prize-in-challenge-to-build-ai-models-that-detect-deepfakes" target="_blank" rel="noreferrer">
              <strong>AI Singapore Deepfake Detection Challenge, 2022</strong>
            </a>
            <br />3rd place · S$100,000 prize
          </p>
        </section>
        <section className="home-section" aria-labelledby="service-title">
          <h2 id="service-title">Academic service</h2>
          <p><strong>Reviewer</strong> · NeurIPS 2026 · ACM TOSEM (2026) · ICSE 2026 Shadow PC · ASE 2026 Artifact Evaluation</p>
        </section>
    </SiteFrame>
  );
}

export default function Home() {
  return <div className="page">
    <Seo title="Home" description="Jian Wang — PhD, NTU Singapore. Reliable AI-assisted programming through learned formal reasoning, verification feedback, and evidence for software changes." path="/home" />
    <Nav skipToContent /><AcademicPagesHome /><Footer />
  </div>;
}
