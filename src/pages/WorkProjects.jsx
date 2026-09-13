import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import { WORK_PROJECTS, projectPeriod } from '../data-work.js';

function ResourceLink({ link }) {
  return link.href.startsWith('/')
    ? <Link to={link.href}>{link.label}</Link>
    : <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>;
}

function ResearchProject({ project }) {
  return (
    <article className="text-index-row work-project-row" id={project.id}>
      <div className="text-index-year">{projectPeriod(project)}</div>
      <div className="text-index-body">
        <h3>{project.title}</h3>
        <p className="text-index-meta">{project.venue} · {project.affiliation}</p>
        <p className="text-index-summary">{project.summary}</p>
        <p className="text-index-links">
          {project.publication && <Link to={`/pubs/${project.publication}`}>Publication details</Link>}
          {project.links.map((link) => <ResourceLink key={link.href} link={link} />)}
        </p>
      </div>
    </article>
  );
}

export default function WorkProjects() {
  const researchProjects = WORK_PROJECTS.filter((project) => project.type === 'research');
  const otherIndustry = WORK_PROJECTS.filter((project) => project.type === 'industry' && project.id === 'baidu-data');

  return (
    <div className="page">
      <Seo
        title="Work & Projects"
        description="Jian Wang’s work on shared web infrastructure, mobile portrait AI, program repair, and code-model evaluation."
        path="/work"
      />
      <Nav skipToContent />
      <SiteFrame className="work-shell" mainClassName="work-text-page">
          <div className="work-heading">
            <div>
              <h1>Work &amp; projects</h1>
              <p className="page-deck">Web infrastructure, mobile AI, and software research.</p>
            </div>
            <Link className="text-link" to="/cv">Experience &amp; CV ↗</Link>
          </div>
          <section className="work-text-section" aria-labelledby="industry-work-title">
            <h2 id="industry-work-title">Industry projects</h2>

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

          <section className="work-text-section" id="research-projects" aria-labelledby="research-projects-title">
            <h2 id="research-projects-title">Research projects</h2>
            <div className="text-index-list">
              {researchProjects.map((project) => <ResearchProject key={project.id} project={project} />)}
            </div>
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
