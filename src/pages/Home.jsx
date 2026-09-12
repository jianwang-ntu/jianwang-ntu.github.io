import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import ApHead from '../components/ApHead.jsx';
import ResearchOverview from '../components/ResearchOverview.jsx';
import ResearchConnection from '../components/ResearchConnection.jsx';
import { NEWS, ALL_PUBS } from '../data.jsx';
import { PUB_META } from '../data-pubs.js';

const selectedPubs = ALL_PUBS.filter(p => ['C5', 'C4', 'C3', 'C2'].includes(p.id));

function AcademicPagesHome() {
  return (
    <div className="portfolio-shell">
      <ApHead sidebar />
      <main id="main-content" className="portfolio-content">
        <p className="portfolio-eyebrow">Trustworthy agent networks · Software engineering · AI security</p>
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
          <p>I aim to make AI agents useful, secure and accountable representatives of <strong>people, groups and companies</strong>.
            My research on <Link to="/statement"><strong>trustworthy agent networks</strong></Link> connects two questions:
            how an agent can grow in capability while preserving the authority, privacy and commitments of those it represents,
            and how independently governed agents can cooperate to create shared value.</p>
          <p>I study these as <Link to="/statement#assured-agency">assured agency</Link> and{' '}
            <Link to="/statement#collective-agency">collective agency</Link>, linked by{' '}
            <Link to="/statement#independent-evidence-and-controlled-adaptation">independent evidence and controlled adaptation</Link>.</p>
          <div id="research-overview"><ResearchOverview /></div>
        </section>
        <aside className="collaboration-note" aria-label="Collaboration interests">
          <p><strong>Useful autonomy, secure cooperation.</strong> I welcome research and engineering collaborations on
            trustworthy agents for individuals and organizations: secure delegation, cooperation across independent owners,
            and evidence-based evaluation. Collaborative production and private research offer settings where capabilities,
            information and commitments must work together.</p>
          <p className="home-skills-links">
            <Link to="/statement#evaluation-and-milestones">Evaluation & milestones</Link>
            <Link to="/work">Earlier work & projects</Link>
            <a href="mailto:jian004@e.ntu.edu.sg">Get in touch ↗</a>
          </p>
        </aside>
        <section className="home-section" aria-labelledby="selected-title">
          <div className="section-heading"><h2 id="selected-title">Selected publications</h2>
            <Link className="text-link" to="/pubs">All publications ↗</Link></div>
          <p>Earlier work in repair, detection and evaluation. <Link to="/statement#published-foundations">How it informs the future agenda ↗</Link></p>
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
    <Seo title="Home" description="Jian Wang — PhD, NTU Singapore. Trustworthy agent networks for individuals, groups and companies, building on software engineering and AI evaluation." path="/home" />
    <Nav skipToContent /><AcademicPagesHome /><Footer />
  </div>;
}
