import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import ApHead from '../components/ApHead.jsx';
import { NEWS, FEATURED_PUBS } from '../data.jsx';

const PUB_PATHS = {
  trustworthy: 'trustworthy-ai-assisted-programming', defects4c: 'defects4c',
  tracewise: 'code-semantics-execution-traces', aigcdet: 'aigc-detectors-on-code',
};

function AcademicPagesHome() {
  return (
    <div className="portfolio-shell">
      <ApHead sidebar />
      <main id="main-content" className="portfolio-content">
        <p className="portfolio-eyebrow">Software engineering · Language models · Trustworthy AI</p>
        <h1>About me</h1>
        <div className="home-bio">
          <p>
            I am a recent PhD from the College of Computing and Data Science (CCDS) at{' '}
            <strong>Nanyang Technological University</strong>, advised by{' '}
            <a href="https://personal.ntu.edu.sg/yi_li/" target="_blank" rel="noreferrer">Prof. Li Yi</a>.
            My research sits at the intersection of <strong>software engineering</strong>,{' '}
            <strong>large language models</strong> and <strong>trustworthy AI systems</strong> — with a focus on{' '}
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
          <ul className="research-interest-list">
            <li><Link to="/statement#code-trustworthiness">Code LLM trustworthiness</Link><span>Automated program repair, execution semantics</span></li>
            <li><Link to="/statement#code-detection">AI-generated code detection</Link><span>How detection built for prose holds up on code</span></li>
            <li><Link to="/statement#long-horizon">Long-horizon AI for software maintenance</Link><span>Agentic, automatic, reliable</span></li>
          </ul>
        </section>
        <aside className="collaboration-note" aria-label="Collaboration interests">
          <p><strong>From research to working systems.</strong> I welcome research collaborations and engineering
            opportunities in reliable coding agents, LLM evaluation and AI security.</p>
          <p className="home-skills-links">
            <Link to="/work?skill=LLM+evaluation#project-index">LLM evaluation</Link>
            <Link to="/work?skill=PyTorch#project-index">PyTorch & model development</Link>
            <Link to="/work?skill=Backend+systems#project-index">Backend systems</Link>
            <a href="mailto:jian004@e.ntu.edu.sg">Get in touch ↗</a>
          </p>
        </aside>
        <section className="home-section" aria-labelledby="selected-title">
          <div className="section-heading"><h2 id="selected-title">Selected publications</h2>
            <Link className="text-link" to="/pubs">All publications ↗</Link></div>
          {FEATURED_PUBS.map(p => (
            <article className="home-publication" key={p.figure}>
              <span className="publication-year">{p.year}</span>
              <div>
                <h3><Link to={`/pubs/${PUB_PATHS[p.figure]}`}>{p.title}</Link></h3>
                <p className="publication-authors">{p.authors}</p>
                <div className="publication-meta"><span>{p.venue} {p.year}</span>
                  {p.note === 'THESIS SUMMARY' && <span className="small-label">Thesis summary</span>}
                  {p.badges?.map(b => <a key={b.label} href={b.href} target="_blank" rel="noreferrer">{b.label}</a>)}
                </div>
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
    <Seo title="Home" description="Jian Wang — PhD, NTU Singapore. Research on code LLM security, automated program repair, and AI-generated code detection." path="/home" />
    <Nav skipToContent /><AcademicPagesHome /><Footer />
  </div>;
}
