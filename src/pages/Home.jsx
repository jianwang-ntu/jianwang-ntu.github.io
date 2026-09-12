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
        <p className="portfolio-eyebrow">Trustworthy agent networks · Software engineering · AI</p>
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
          <p>My current agenda is <Link to="/statement"><strong>trustworthy agent networks</strong></Link>:
            persistent agents that grow in capability, cooperate across people and organizations, and remain
            accountable to those they represent. It connects two research directions through a shared foundation.</p>
          <ul className="research-interest-list">
            <li><Link to="/statement#essay-i-assured-agency">Assured agency</Link>
              <span>How does agency persist through change? Persistent mandates, state and commitments;
                authorized execution and recovery; capability growth under live obligations.</span></li>
            <li><Link to="/statement#essay-ii-collective-agency">Collective agency</Link>
              <span>When does cooperation create lasting value? Limited group representation, private coordination
                and conditional commitments, with delivery, exit and shared accountability.</span></li>
            <li><Link to="/statement#independent-evidence-and-controlled-adaptation">Independent evidence & controlled adaptation</Link>
              <span>A shared foundation: verify outcomes, attribute failures and evaluate changes to agent
                capabilities and coordination, while preserving each principal&rsquo;s authority.</span></li>
          </ul>
        </section>
        <aside className="collaboration-note" aria-label="Collaboration interests">
          <p><strong>Building useful, accountable agency.</strong> I welcome research and engineering collaborations
            on persistent agents, cooperation across independent principals, and independent outcome evaluation.
            I aim to test these ideas in collaborative production and private research, measuring useful completion,
            participant outcomes, human effort and recovery costs.</p>
          <p className="home-skills-links">
            <Link to="/statement#a-staged-research-program-2026-2029">Research roadmap, 2026–2029</Link>
            <Link to="/work">Earlier work & projects</Link>
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
    <Seo title="Home" description="Jian Wang — PhD, NTU Singapore. Research on trustworthy agent networks: assured agency, collective agency, and independent evidence." path="/home" />
    <Nav skipToContent /><AcademicPagesHome /><Footer />
  </div>;
}
