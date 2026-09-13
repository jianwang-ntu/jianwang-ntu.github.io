import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import ResearchOverview from '../components/ResearchOverview.jsx';
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
            Before research, I spent about eight years in industry. At <Link to="/work/xiaomi-portrait-ai">Xiaomi AI Lab</Link>,
            I worked on portrait segmentation and GAN-based selfie cartoonisation. At{' '}
            <Link to="/work/58-web-infrastructure">58.com</Link>, I built shared web infrastructure
            and a custom Nginx traffic router.
          </p>
        </div>
        <section className="home-section" aria-labelledby="interests-title">
          <div className="section-heading">
            <h2 id="interests-title">Research interests</h2>
            <Link className="text-link" to="/statement">Research statement ↗</Link>
          </div>
          <p>My proposed research focuses on <strong>reliable autonomy for adaptive AI agents</strong>:
            how agents can learn and interact while remaining safe, reliable, and under meaningful human control as models,
            tools, and workflows change.</p>
          <p>The agenda connects <Link to="/statement#i-scalable-oversight-under-adaptation">scalable oversight</Link>,{' '}
            <Link to="/statement#ii-safety-preserving-learning-and-feedback">safety-preserving learning</Link>, and{' '}
            <Link to="/statement#iii-control-across-time-and-delegation">control across time and delegation</Link>.</p>
          <ResearchOverview showIndustryEvidence={false} />
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
          <p><strong>AI Singapore Deepfake Detection Challenge, 2022</strong><br />3rd place · S$100,000 prize</p>
        </section>
    </SiteFrame>
  );
}

export default function Home() {
  return <div className="page">
    <Seo title="Home" description="Jian Wang — PhD, NTU Singapore. Reliable autonomy for adaptive AI agents, building on software engineering and AI evaluation." path="/home" />
    <Nav skipToContent /><AcademicPagesHome /><Footer />
  </div>;
}
