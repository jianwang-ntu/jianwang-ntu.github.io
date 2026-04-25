import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import PageHead from '../components/PageHead.jsx';
import { Box, Chip, Tag } from '../components/primitives.jsx';

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

function CVH({ num, children }) {
  return (
    <div className="cv-section-h">
      <span className="num">{num}</span>
      <h2>{children}</h2>
      <div className="rule" />
    </div>
  );
}

export default function CV() {
  return (
    <div className="page">
      <Nav />
      <PageHead
        kicker="CURRICULUM VITAE · WEB EDITION"
        title={<span>Jian Wang — <u>cv.</u></span>}
        blurb={<>Web rendering of the canonical PDF. PDF is the source of truth for committees; this page is for everyone else. PhD conferred Mar 2026.</>}
        right={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <Chip solid href="/data/JianWang_cv.pdf">↓ cv.pdf</Chip>
            <Chip sm href="/data/jornbowrl-bio.txt">↓ bio.txt</Chip>
          </div>
        }
      />

      <section className="content" style={{ paddingTop: 16 }}>
        <CVH num="01">Education</CVH>
        <CVBlock
          left="2021 — 2026"
          right="Singapore"
          title="PhD, Computer Science"
          sub="Nanyang Technological University · College of Computing and Data Science"
          body={<>Advisor: <a href="https://personal.ntu.edu.sg/yi_li/" target="_blank" rel="noreferrer">Prof. Li Yi</a>. Working area: <i>code LLM security and intelligence</i> — automated program repair, AI-generated code detection, execution-grounded reasoning over programs.</>}
        />
        <CVBlock left="2019" right="Beijing" title="Certification · AI / Computer Vision" sub="Tsinghua University" />
        <CVBlock left="2007 — 2011" right="Tianjin" title="BEng, Software Engineering" sub="Tianjin University" />

        <CVH num="02">Experience · 8 yrs industry + 5 yrs research</CVH>
        <CVBlock
          left="Aug 2023 — now"
          right="Singapore"
          title="PhD Candidate · Research Assistant"
          sub="Singapore Management University · Code Intelligence & LLM Security (with Prof. Xie Xiaofei)"
          body="Built Defects4C (ASE '25). Designed semantic-enhancement framework with execution traces for SFT/PEFT (EMNLP '25). Evaluated 24 SOTA LLMs across single-round and conversation-based repair."
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

        <CVH num="03">Selected publications</CVH>
        <div style={{ fontSize: 12.5, lineHeight: 1.7, paddingTop: 6 }}>
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
          <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.6 }}>full list → <a href="/pubs">Publications</a> · <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar</a></div>
        </div>

        <CVH num="04">Honors & awards</CVH>
        <div style={{ fontSize: 12.5, lineHeight: 1.85 }}>
          <div>★ <b>2022</b> · S$100,000 prize · 3rd place · AI Singapore Deepfake Detection Challenge (international)</div>
          <div>★ <b>2019</b> · AI / Computer Vision Certification · Tsinghua University</div>
        </div>

        <CVH num="05">Engineering highlights</CVH>
        <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>
          <div><b>Production scale:</b> async web framework powering 100M+ daily requests at 58.com.</div>
          <div style={{ marginTop: 4 }}><b>End-to-end ML:</b> trained, quantised, and deployed GAN-based portrait models onto Qualcomm Hexagon DSP / HiSilicon Kirin NPU at Xiaomi.</div>
          <div style={{ marginTop: 4 }}><b>Open-source:</b> Defects4C, tracewise probing, RATCHET, FGVulDet, AIGC-detector study site.</div>
        </div>

        <CVH num="06">Skills</CVH>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
          {[
            'Python', 'PyTorch', 'C/C++', 'CUDA', 'ONNX',
            'LLMs / SFT / PEFT', 'Transformers', 'GNN/GGNN',
            'Symbolic methods', 'Adversarial robustness', 'Quantisation',
            'Backend / Async Web Frameworks',
            'Mandarin (native)', 'English (fluent)',
          ].map((s) => <Tag key={s}>{s}</Tag>)}
        </div>

        <Box dashed style={{ marginTop: 32, padding: 14, fontFamily: 'var(--mono)', fontSize: 11, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span>References on request — typically advisor + 2 collaborators.</span>
          <span>↓ <a href="/data/JianWang_cv.pdf" target="_blank" rel="noreferrer">cv.pdf</a> · ↓ <a href="/data/jornbowrl-bio.txt" target="_blank" rel="noreferrer">bio.txt</a></span>
        </Box>
      </section>

      <Footer />
    </div>
  );
}
