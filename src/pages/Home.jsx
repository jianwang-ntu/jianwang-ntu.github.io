import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import ApHead from '../components/ApHead.jsx';
import ResearchOverview from '../components/ResearchOverview.jsx';
import ResearchPath from '../components/ResearchPath.jsx';
import ResearchConnection from '../components/ResearchConnection.jsx';
import { NEWS, ALL_PUBS } from '../data.jsx';
import { PUB_META } from '../data-pubs.js';

const selectedPubs = ALL_PUBS.filter(p => ['C5', 'C4', 'C3', 'C2'].includes(p.id));

function AcademicPagesHome() {
  return (
    <div className="portfolio-shell">
      <ApHead sidebar />
      <main id="main-content" className="portfolio-content">
        <p className="portfolio-eyebrow">Software reliability · Code models · Trustworthy agents</p>
        <h1>About me</h1>
        <div className="home-bio">
          <p>
            I am a recent PhD from the College of Computing and Data Science (CCDS) at{' '}
            <strong>Nanyang Technological University</strong>, advised by{' '}
            <a href="https://personal.ntu.edu.sg/yi_li/" target="_blank" rel="noreferrer">Prof. Li Yi</a>.
            My research connects <strong>software engineering</strong>,{' '}
            <strong>large language models</strong> and <strong>trustworthy AI systems</strong>.
            My PhD work focused on{' '}
            <strong>automated program repair</strong>, <strong>AI-generated code detection</strong> and{' '}
            <strong>execution-grounded reasoning</strong> over programs.
          </p>
          <p>
            Before research I spent <strong>~8 years in industry</strong>: the AI Lab at <strong>Xiaomi</strong>,
            training GANs for portrait background removal and face cartoonisation, and a backend
            role at <strong>58.com</strong>, building an async web framework serving 100M+ daily requests.
          </p>
        </div>
        <section className="home-section" aria-labelledby="interests-title">
          <div className="section-heading">
            <h2 id="interests-title"><Link to="/statement">Research interests</Link></h2>
            <Link className="text-link" to="/statement">Read the statement ↗</Link>
          </div>
          <p>My next research direction is <Link to="/statement"><strong>reliable software-maintenance agents</strong></Link>.
            I want to extend repair and evaluation from individual code changes to workflows that use tools,
            check their outcomes and recover when conditions change.</p>
          <div id="research-overview"><ResearchPath /></div>
          <details className="network-vision">
            <summary>Longer-term vision: trustworthy agent networks</summary>
            <p>Cooperation across independently governed repositories is a later extension. The original
              overview below shows the broader vision; these mechanisms remain proposed research.</p>
            <ResearchOverview />
          </details>
        </section>
        <aside className="collaboration-note" aria-label="Collaboration interests">
          <p><strong>From repair research to reliable agents.</strong> I welcome research collaborations and engineering
            opportunities in software-maintenance agents, code-model evaluation and reproducible benchmarks.
            My immediate interest is in measurable correctness, recovery and the human effort needed to complete a task.</p>
          <p className="home-skills-links">
            <Link to="/statement#evaluation-and-milestones">Evaluation & milestones</Link>
            <Link to="/work">Earlier work & projects</Link>
            <a href="mailto:jian004@e.ntu.edu.sg">Get in touch ↗</a>
          </p>
        </aside>
        <section className="home-section" aria-labelledby="selected-title">
          <div className="section-heading"><h2 id="selected-title">Selected publications</h2>
            <Link className="text-link" to="/pubs">All publications ↗</Link></div>
          <p>Published work behind the proposed direction. Each paper links to the next question it motivates.</p>
          {selectedPubs.map(p => (
            <article className="home-publication" key={p.figure}>
              <span className="publication-year">{p.year}</span>
              <div>
                <h3><Link to={`/pubs/${PUB_META[p.id].key}`}>{p.title}</Link></h3>
                <p className="publication-authors">{p.authors}</p>
                <div className="publication-meta"><span>{p.venue} {p.year}</span>
                  {p.note === 'THESIS SUMMARY' && <span className="small-label">Thesis summary</span>}
                  {p.badges?.map(b => <a key={b.label} href={b.href} target="_blank" rel="noreferrer">{b.label}</a>)}
                </div>
                <ResearchConnection publication={PUB_META[p.id].key} compact />
              </div>
            </article>
          ))}
        </section>
        <section className="home-section" aria-labelledby="news-title">
          <h2 id="news-title">News</h2>
          <div className="home-news">{NEWS.slice(0, 6).map(([date, text], i) => (
            <div key={i}><span>{date}</span><p>{text}</p></div>
          ))}</div>
        </section>
        <section className="home-section" aria-labelledby="award-title">
          <h2 id="award-title">Recognition</h2>
          <p><strong>AI Singapore Deepfake Detection Challenge, 2022</strong><br />3rd place · S$100,000 prize</p>
        </section>
      </main>
    </div>
  );
}

export default function Home() {
  return <div className="page">
    <Seo title="Home" description="Jian Wang — PhD, NTU Singapore. Program repair and code-model evaluation, with a proposed direction in reliable software-maintenance agents." path="/home" />
    <Nav skipToContent /><AcademicPagesHome /><Footer />
  </div>;
}
