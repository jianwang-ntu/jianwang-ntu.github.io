import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import Seo from '../components/Seo.jsx';

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
        description="Curriculum vitae of Jian Wang — education, employment, talks, awards. PhD conferred Mar 2026."
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
          body="Large-scale empirical study of 13 AIGC detectors on 2M+ code samples (ASE '24). Built RATCHET retrieval-augmented APR (ISSRE '24). Neuro-symbolic methods for DL testing — NPC, Faire (TOSEM '22, '23). 3rd place + S$100K in AI Singapore deepfake challenge."
        />
        <CVBlock
          left="Dec 2019 — Aug 2021"
          right="Singapore"
          title="Research Assistant"
          sub="Nanyang Technological University · Deep Learning Security"
          body="Pre-PhD research bridge — neural-network testing, robustness analysis, and the early infrastructure that became NPC and the AIGC-detector study."
        />
        <CVBlock
          left="2017 — 2019"
          right="Beijing"
          title="Research Scientist · Xiaomi AI Lab"
          sub="Xiaomi Group · AI Lab"
          body="Trained GANs for portrait background removal and face cartoonisation. Owned full pipeline: GPU training (CUDA / PyTorch) → quantisation / pruning → ONNX/IR → on-device inference on Hexagon DSP / Kirin NPU. Cascaded multi-mask approach for natural-scene blur."
        />
        <CVBlock
          left="2011 — 2017"
          right="Beijing"
          title="Backend Engineer · 58.com"
          sub="58 Inc. · Mobile Web / Backend Infrastructure"
          body="Designed and shipped a high-performance asynchronous web framework that handles 100M+ daily requests in production, and a user-profiling and behavior-analytics platform. Owned reliability, latency, scalability."
        />
        <CVBlock left="2011" right="Beijing" title="Data Engineering Intern" sub="Baidu, Inc." body="Contributed to large-scale data pipelines." />

        <CVH>Selected publications</CVH>
        <div className="cv-publications">
          <div><b>Wang J.</b>, Xie X., Hu Q., Liu S., Yu J., Kong J., Li Y. <i>Defects4C: Benchmarking Large Language Model Repair Capability with C/C++ Bugs.</i> <b>ASE '25</b>.</div>
          <div style={{ marginTop: 6 }}><b>Wang J.</b>, Xie X., Hu Q., Liu S., Li Y. <i>Do Code Semantics Help? A Comprehensive Study on Execution Trace-Based Information for Code LLMs.</i> <b>EMNLP Findings '25</b>.</div>
          <div style={{ marginTop: 6 }}><b>Wang J.</b>, Liu S., Xie X., Siow J. K., Liu K., Li Y. <i>RATCHET: Retrieval Augmented Transformer for Program Repair.</i> <b>ISSRE '24</b>.</div>
          <div style={{ marginTop: 6 }}><b>Wang J.</b>, Liu S., Xie X., Li Y. <i>An Empirical Study to Evaluate AIGC Detectors on Code Content.</i> <b>ASE '24</b>.</div>
          <div style={{ marginTop: 6 }}>Liu S., Ma W., <b>Wang J.</b>, Xie X., Feng R., Liu Y. <i>Enhancing Code Vulnerability Detection via Vulnerability-Preserving Data Augmentation.</i> <b>LCTES '24</b>.</div>
          <div style={{ marginTop: 6 }}>Li T., Xie X., <b>Wang J.</b>, et al. <i>Faire: Repairing Fairness of Neural Networks via Neuron Condition Synthesis.</i> <b>ACM TOSEM '23</b>.</div>
          <div style={{ marginTop: 6 }}>Xie X., Li T., <b>Wang J.</b>, et al. <i>NPC: Neuron Path Coverage via Characterizing Decision Logic of DNNs.</i> <b>ACM TOSEM '22</b>.</div>
          <div style={{ marginTop: 6 }}>Xie X., Guo W., Ma L., Le W., <b>Wang J.</b>, et al. <i>Automatic RNN Repair via Model-based Analysis.</i> <b>ICML '21</b>.</div>
          <div style={{ marginTop: 6 }}>Guo Q., Juefei-Xu F., Xie X., Ma L., <b>Wang J.</b>, et al. <i>Watch out! Motion is Blurring the Vision of Your Deep Neural Networks.</i> <b>NeurIPS '20</b>.</div>
          <div style={{ marginTop: 6 }}>Wang R., Juefei-Xu F., Ma L., Xie X., Huang Y., <b>Wang J.</b>, Liu Y. <i>FakeSpotter: A Simple yet Robust Baseline for Spotting AI-Synthesized Fake Faces.</i> <b>IJCAI '20</b>.</div>
          <p className="reading-links"><a href="/pubs">All publications</a><a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar ↗</a></p>
        </div>

        <CVH>Honors & awards</CVH>
        <div className="cv-prose">
          <p><b>2022</b> · S$100,000 prize · 3rd place · AI Singapore Deepfake Detection Challenge (international)</p>
          <p><b>2019</b> · AI / Computer Vision Certification · Tsinghua University</p>
        </div>

        <CVH>Engineering highlights</CVH>
        <div className="cv-prose">
          <p><b>Production scale:</b> async web framework powering 100M+ daily requests at 58.com.</p>
          <p><b>End-to-end ML:</b> trained, quantised, and deployed GAN-based portrait models onto Qualcomm Hexagon DSP / HiSilicon Kirin NPU at Xiaomi.</p>
          <p><b>Research artifacts:</b> <a href="/work#research-projects">Defects4C, tracewise probing, RATCHET, FGVulDet and the AIGC-detector study</a>.</p>
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

        <p className="cv-closing">References available on request.</p>
      </SiteFrame>

      <Footer />
    </div>
  );
}
