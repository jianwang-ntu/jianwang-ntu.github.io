import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import ApHead from '../components/ApHead.jsx';
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
        <p className="work-project-skills"><strong>Methods:</strong> {project.skills.join(', ')}</p>
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
        description="Industry engineering and research projects by Jian Wang, with concise summaries and evidence-linked detail pages."
        path="/work"
      />
      <Nav skipToContent />
      <div className="portfolio-shell work-shell">
        <ApHead sidebar />
        <main id="main-content" className="portfolio-content work-text-page">
          <p className="portfolio-eyebrow">From research to working systems</p>
          <div className="work-heading">
            <div>
              <h1>Work &amp; projects</h1>
              <p className="page-deck">Production systems, mobile AI, and evidence-driven software research.</p>
            </div>
            <Link className="text-link" to="/cv">Experience &amp; CV ↗</Link>
          </div>
          <p className="text-index-intro">
            The main industry projects are explained here without requiring another click. Detail pages add diagrams,
            reconstruction images, and the longer engineering record.
          </p>

          <section className="work-text-section" aria-labelledby="industry-work-title">
            <p className="portfolio-eyebrow">Industry</p>
            <h2 id="industry-work-title">Industry Case Studies</h2>

            <article className="work-editorial-entry">
              <h3>Shared web infrastructure at 58.com</h3>
              <p className="text-index-meta">58.com · Mobile Web / Backend Infrastructure · 2011–2017</p>
              <div className="work-indented-notes">
                <p><strong>Shared asynchronous Web framework.</strong> App-facing services, Mobile WAP, and product business lines needed the same request handling without rebuilding it inside each service. The framework placed middleware and common components behind stable boundaries so business code could reuse authentication, request parsing, service access, caching, and response handling.</p>
                <p><strong>Scale and difficulty.</strong> The documented system served 100M+ daily requests. Compatibility with several business lines, low per-request overhead, and failure isolation mattered as much as API convenience: one common component could not be allowed to turn into a shared failure point.</p>
                <p><strong>Custom Nginx module.</strong> A second project moved company traffic routing into the Nginx request path. It pursued an OpenResty-like programming goal through a custom module: match central rules, select an upstream, update rules safely, and retain a bounded hot-path cost with a predictable fallback when routing state was unavailable.</p>
              </div>
              <p className="work-evidence-note">The retained record supports the request scale and architecture; historical latency and CPU measurements are not reconstructed.</p>
              <p className="work-detail-links"><Link to="/work/58-web-infrastructure">Details with diagrams</Link><span aria-hidden="true"> · </span><Link to="/zh/work/58-web-infrastructure">中文版本</Link></p>
            </article>

            <article className="work-editorial-entry">
              <h3>Portrait intelligence at Xiaomi</h3>
              <p className="text-index-meta">Xiaomi AI Lab · Research Scientist · 2017–2019</p>
              <div className="work-indented-notes">
                <p><strong>Portrait semantic segmentation.</strong> The pipeline separated the person from the surrounding scene for portrait effects. The difficult cases were the ones visible to users immediately: hair and clothing boundaries, occlusion, motion, and foreground colours that resemble the background.</p>
                <p><strong>Selfie-to-emoji generation.</strong> GAN-based image translation turned a selfie into a personalised cartoon or emoji. The engineering problem was not only style transfer; the output also needed to retain recognisable identity and behave consistently across expressions.</p>
                <p><strong>Deployment efficiency.</strong> Models trained with PyTorch and CUDA moved through compression, ONNX/IR graph conversion, and device-specific validation for Hexagon DSP or Kirin NPU. Accuracy, unsupported operators, memory pressure, and visual regressions had to be checked together.</p>
              </div>
              <p className="work-evidence-note">The deployment path is retained; proprietary topology, losses, FPS, latency, and model-size measurements are not presented as recovered facts.</p>
              <p className="work-detail-links"><Link to="/work/xiaomi-portrait-ai">Details with images</Link></p>
            </article>
          </section>

          <section className="work-text-section" id="research-projects" aria-labelledby="research-projects-title">
            <p className="portfolio-eyebrow">Research</p>
            <h2 id="research-projects-title">Research projects</h2>
            <p className="section-intro">A compact index of the systems, benchmarks, and evaluations behind the publication record.</p>
            <div className="text-index-list">
              {researchProjects.map((project) => <ResearchProject key={project.id} project={project} />)}
            </div>
          </section>

          <section className="work-text-section" aria-labelledby="other-industry-title">
            <p className="portfolio-eyebrow">Earlier work</p>
            <h2 id="other-industry-title">Other industry experience</h2>
            {otherIndustry.map((project) => (
              <article className="other-industry-entry" key={project.id}>
                <h3>{project.title}</h3>
                <p className="text-index-meta">{project.affiliation} · {projectPeriod(project)}</p>
                <p>{project.summary}</p>
              </article>
            ))}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
