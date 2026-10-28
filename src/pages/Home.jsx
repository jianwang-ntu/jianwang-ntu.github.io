import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
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
            <a className="text-link" href="/agent_reliable.html">Research statement ↗</a>
          </div>
          <p>I study <strong>reliable AI-assisted programming</strong> through two directions:{' '}
            <a href="/agent_reliable.html#reusable-reasoning">learning reasoning strategies that transfer to unfamiliar programs</a>, and{' '}
            <a href="/agent_reliable.html#reliable-coding-agents">building coding agents that remain dependable across extended tasks and changing contexts</a>.</p>
          <figure className="research-overview formal-research-figure" aria-label="Reusable reasoning and reliable coding agents">
            <div className="linked-research-image formal-research-canvas">
              <a className="formal-research-open" href="/figures/agent-reliable/01-overview.png" target="_blank" rel="noreferrer" aria-label="Open the two-direction research overview at full size">
                <img className="home-research-image" src="/figures/agent-reliable/01-overview.webp" width="1672" height="941" alt="Reusable reasoning provides strategies to reliable coding agents; agents provide feedback for learning." loading="lazy" decoding="async" />
              </a>
              <a className="research-image-link" href="/agent_reliable.html#reusable-reasoning" aria-label="Read about learning reusable reasoning" title="Learning reusable reasoning" style={{ left: '4.3%', top: '33.5%', width: '33.4%', height: '46.3%' }} />
              <a className="research-image-link" href="/agent_reliable.html#reliable-coding-agents" aria-label="Read about building reliable coding agents" title="Building reliable coding agents" style={{ left: '62.2%', top: '33.5%', width: '33.5%', height: '46.3%' }} />
            </div>
            <ul className="research-overview-mobile" aria-label="Research directions">
              <li><a href="/agent_reliable.html#reusable-reasoning">Learning reusable reasoning</a></li>
              <li><a href="/agent_reliable.html#reliable-coding-agents">Building reliable coding agents</a></li>
            </ul>
            <figcaption>Proposed agenda: learned strategies guide agents; experience from agents informs learning.</figcaption>
          </figure>
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
    <Seo title="Home" description="Jian Wang — PhD, NTU Singapore. Learning reusable reasoning for programming and building reliable coding agents for extended software tasks." path="/home" />
    <Nav skipToContent /><AcademicPagesHome /><Footer />
  </div>;
}
