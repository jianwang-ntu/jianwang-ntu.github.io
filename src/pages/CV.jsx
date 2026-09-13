import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import Seo from '../components/Seo.jsx';
import { ALL_PUBS } from '../data.jsx';
import { PUB_META } from '../data-pubs.js';
import Authors from '../components/Authors.jsx';

function CVBlock({ left, right, title, sub, body }) {
  return (
    <div className="cv-block">
      <div className="when">
        <div className="d">{left}</div>
        {right && <div className="w">{right}</div>}
      </div>
      <div className="body">
        <div className="ttl">{title}</div>
        {sub && <div className="sub">{sub}</div>}
        {body && <div className="desc">{body}</div>}
      </div>
    </div>
  );
}

function CVH({ children }) {
  return <h2 className="cv-section-title">{children}</h2>;
}

export default function CV() {
  return (
    <div className="page">
      <Seo
        title="CV"
        description="Jian Wang’s education, research and industry experience, selected publications, and awards."
        path="/cv"
      />
      <Nav skipToContent />
      <SiteFrame mainClassName="cv-content">
        <h1>Curriculum vitae</h1>
        <p className="page-deck">Education, research and industry experience.</p>
        <p className="text-index-intro">PhD conferred March 2026. The downloadable CV is the May 2026 snapshot;
          the <a href="/statement">research statement</a> describes my proposed next direction.</p>
        <div className="reading-links">
          <a href="/data/Jian_Wang_CV_Academic_202605.pdf" target="_blank" rel="noreferrer">Download CV (PDF) ↗</a>
          <a href="/data/jornbowrl-bio.txt">Short bio</a>
        </div>

        <CVH>Education</CVH>
        <CVBlock
          left="2021 — 2026"
          right="Singapore"
          title="PhD, Computer Science"
          sub="Nanyang Technological University · College of Computing and Data Science"
          body={<>Advisor: <a href="https://personal.ntu.edu.sg/yi_li/" target="_blank" rel="noreferrer">Prof. Li Yi</a>. PhD research: automated program repair, AI-generated code detection and the evaluation of execution-trace information for code models.</>}
        />
        <CVBlock left="2019" right="Beijing" title="Certification · AI / Computer Vision" sub="Tsinghua University" />
        <CVBlock left="2007 — 2011" right="Tianjin" title="BEng, Software Engineering" sub="Tianjin University" />

        <CVH>Research & industry experience</CVH>
        <CVBlock
          left="Aug 2023 — now"
          right="Singapore"
          title="Research Engineer Manager"
          sub="Singapore Management University · Code Intelligence & LLM Security (with Prof. Xie Xiaofei)"
          body={<>Built <a href="/pubs/defects4c">Defects4C (ASE '25)</a> and evaluated 24 LLMs on C/C++ repair.
            Studied execution traces in fine-tuning and inference; the <a href="/pubs/code-semantics-execution-traces">EMNLP '25 paper</a> reports limited usefulness in the settings tested.</>}
        />
        <CVBlock
          left="Aug 2021 — Aug 2023"
          right="Singapore"
          title="PhD Student"
          sub="Nanyang Technological University · Deep Learning & LLM Security"
          body="Studied AI-generated code detection and retrieval-augmented program repair. Co-authored work on neural-network testing and fairness repair, including NPC and Faire."
        />
        <CVBlock
          left="Dec 2019 — Aug 2021"
          right="Singapore"
          title="Research Assistant"
          sub="Nanyang Technological University · Deep Learning Security"
          body="Research on neural-network testing, robustness, and repair."
        />
        <CVBlock
          left="2017 — 2019"
          right="Beijing"
          title="Research Scientist · Xiaomi AI Lab"
          sub="Xiaomi Group · AI Lab"
          body={<>Worked on portrait segmentation and GAN-based selfie cartoonisation, from PyTorch/CUDA training through compression and ONNX/IR conversion to mobile inference. <a href="/work/xiaomi-portrait-ai">Project details</a>.</>}
        />
        <CVBlock
          left="2011 — 2017"
          right="Beijing"
          title="Backend Engineer · 58.com"
          sub="58 Inc. · Mobile Web / Backend Infrastructure"
          body={<>Built a shared asynchronous web framework serving 100M+ daily requests and a custom Nginx traffic router for multiple business lines. <a href="/work/58-web-infrastructure">Project details</a>.</>}
        />
        <CVBlock left="2011" right="Beijing" title="Data Engineering Intern" sub="Baidu, Inc." body="Contributed to large-scale data pipelines." />

        <CVH>Selected publications</CVH>
        <div className="cv-publications">
          {ALL_PUBS.filter(pub => ['C5', 'C4', 'C3'].includes(pub.id)).map(pub => (
            <p key={pub.id}><Authors names={PUB_META[pub.id].authors} />.{' '}
              <a href={`/pubs/${PUB_META[pub.id].key}`}>{pub.title}</a>. {pub.venue}, {pub.year}.</p>
          ))}
          <p className="reading-links"><a href="/pubs">All publications</a><a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar ↗</a></p>
        </div>

        <CVH>Honors & awards</CVH>
        <div className="cv-prose">
          <p><b>2022</b> · S$100,000 prize · 3rd place · AI Singapore Deepfake Detection Challenge (international)</p>
        </div>

        <CVH>Skills</CVH>
        <p className="cv-skills">
          {[
            'Python', 'PyTorch', 'C/C++', 'CUDA', 'ONNX',
            'LLMs / SFT / PEFT', 'Transformers', 'GNN/GGNN',
            'Symbolic methods', 'Adversarial robustness', 'Quantisation',
            'Backend / Async Web Frameworks',
            'Mandarin (native)', 'English (fluent)',
          ].join(' · ')}
        </p>

      </SiteFrame>

      <Footer />
    </div>
  );
}
