import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import { CAREER_TIMELINE, WORK_PROJECTS, projectPeriod } from '../data-work.js';

export default function WorkProjects() {
  const otherIndustry = WORK_PROJECTS.filter((project) => project.type === 'industry' && project.id === 'baidu-data');

  return (
    <div className="page">
      <Seo
        title="Work"
        description="Jian Wang’s career timeline and industry experience in shared web infrastructure and mobile portrait AI."
        path="/work"
      />
      <Nav skipToContent />
      <SiteFrame className="work-shell" mainClassName="work-text-page">
          <div className="work-heading">
            <div>
              <h1>Work</h1>
              <p className="page-deck">Career timeline and industry experience.</p>
            </div>
            <Link className="text-link" to="/cv">Experience &amp; CV ↗</Link>
          </div>
          <section className="work-timeline" id="timeline" aria-labelledby="timeline-title">
            <h2 id="timeline-title">Timeline</h2>
            <ol className="work-timeline-list">
              {CAREER_TIMELINE.map((entry) => (
                <li className="work-timeline-entry" key={entry.id}>
                  <span className="work-timeline-date">{entry.period}</span>
                  <span className="work-timeline-marker" aria-hidden="true" />
                  <span className={`work-timeline-mark mark-${entry.id}`} aria-hidden="true">{entry.mark}</span>
                  <div className="work-timeline-body">
                    <h3><Link to={entry.href}>{entry.institution}</Link></h3>
                    <p>{entry.role} · {entry.country}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="work-text-section" aria-labelledby="industry-work-title">
            <h2 id="industry-work-title">Industry experience</h2>

            <article className="work-editorial-entry">
              <h3>Shared web infrastructure at 58.com</h3>
              <p className="text-index-meta">58.com · Mobile Web / Backend Infrastructure · 2011–2017</p>
              <div className="work-indented-notes">
                <p><strong>Shared asynchronous Web framework.</strong> I built middleware and common components for App-facing services, Mobile WAP, and several business lines. The system served 100M+ daily requests; compatibility, request overhead, and failure isolation were the main engineering constraints.</p>
                <p><strong>Custom Nginx module.</strong> I designed a company traffic router that selected upstream services inside the Nginx request path. Like OpenResty, the goal was programmable request handling. Rule updates, routing cost, and fallback behaviour were the key design concerns.</p>
              </div>
              <p className="work-detail-links"><Link to="/work/58-web-infrastructure">Details</Link><Link to="/zh/work/58-web-infrastructure">中文</Link></p>
            </article>

            <article className="work-editorial-entry">
              <h3>Portrait intelligence at Xiaomi</h3>
              <p className="text-index-meta">Xiaomi AI Lab · Research Scientist · 2017–2019</p>
              <div className="work-indented-notes">
                <p><strong>Portrait semantic segmentation.</strong> I worked on separating the subject from the background for portrait effects, with particular attention to hair, clothing boundaries, and difficult lighting.</p>
                <p><strong>Selfie-to-emoji generation.</strong> GAN-based translation turned selfies into personalised cartoons. The main challenge was preserving identity while changing style.</p>
                <p>Deployment work covered PyTorch/CUDA training, compression, ONNX/IR conversion, and validation on Hexagon DSP or Kirin NPU. Operator support, memory use, and image quality constrained the final model.</p>
              </div>
              <p className="work-detail-links"><Link to="/work/xiaomi-portrait-ai">Details</Link></p>
            </article>
          </section>

          <section className="work-text-section" aria-labelledby="other-industry-title">
            <h2 id="other-industry-title">Other industry experience</h2>
            {otherIndustry.map((project) => (
              <article className="other-industry-entry" key={project.id}>
                <h3>{project.title}</h3>
                <p className="text-index-meta">{project.affiliation} · {projectPeriod(project)}</p>
                <p>{project.summary}</p>
              </article>
            ))}
          </section>
      </SiteFrame>
      <Footer />
    </div>
  );
}
