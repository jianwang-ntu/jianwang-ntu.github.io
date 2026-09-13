import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';
import ArchitectureFigure from '../components/ArchitectureFigure.jsx';

const PROJECT_SOCIAL_IMAGE = 'https://www.wj2ai.com/images/projects/xiaomi/portrait-segmentation-reconstruction.jpg';
const ARCHITECTURE_NOTE = 'Functional blocks describe roles, not Xiaomi’s verified proprietary topology.';
const ARCHITECTURE_VIEW = 'View full-size architecture ↗';
const ARCHITECTURE_SCROLL_LABEL = 'Scrollable system architecture';
const ARCHITECTURE_SCROLL_HINT = 'Scroll inside the diagram to inspect the full architecture.';

function ResultFigure({ src, srcSmall, alt, caption, priority = false }) {
  return (
    <figure className="case-study-figure xiaomi-result">
      <img
        src={src}
        srcSet={`${srcSmall} 768w, ${src} 1536w`}
        sizes="(max-width: 900px) calc(100vw - 36px), 800px"
        width="1536"
        height="1024"
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
        alt={alt}
      />
      <figcaption><strong>Illustrative reconstruction.</strong> {caption}</figcaption>
    </figure>
  );
}

function EngineeringNotes({ implementation, efficiency, difficulty }) {
  return (
    <div className="case-study-notes">
      <p className="case-study-note"><strong>Implementation.</strong> {implementation}</p>
      <p className="case-study-note"><strong>Efficiency.</strong> {efficiency}</p>
      <p className="case-study-note"><strong>What was difficult.</strong> {difficulty}</p>
    </div>
  );
}

export default function XiaomiPortraitAI() {
  return (
    <div className="page">
      <Seo
        title="Portrait Intelligence at Xiaomi"
        description="A visual case study of portrait semantic segmentation and GAN-based selfie cartoonisation, from GPU training to on-device inference."
        image={PROJECT_SOCIAL_IMAGE}
        path="/work/xiaomi-portrait-ai"
      />
      <Nav skipToContent />
      <SiteFrame mainClassName="case-study-main">
        <article className="editorial-case-study xiaomi-project">
          <Link to="/work" className="case-study-back">← Work &amp; Projects</Link>

          <header className="case-study-header xiaomi-header">
            <p className="case-study-overline">Xiaomi AI Lab · Beijing · 2017–2019</p>
            <h1>Portrait intelligence, built for the phone</h1>
            <p className="case-study-deck">
              I worked on two image systems: semantic segmentation for portrait effects and GAN-based selfie cartoonisation. Both also had to move from GPU training toward dependable on-device inference.
            </p>
            <p className="case-study-evidence-intro">
              The images are illustrative reconstructions made from portfolio portraits, not original Xiaomi product captures. The diagrams explain system roles rather than proprietary model designs.
            </p>
          </header>

          <section className="case-study-section">
            <h2>Portrait semantic segmentation</h2>
            <p>
              The task was to separate the person from the surrounding scene so a phone could blur, replace, or restyle the background. Most visible errors appeared at the subject boundary.
            </p>
            <ArchitectureFigure
              src="/images/projects/xiaomi/portrait-segmentation-architecture.svg"
              alt="System architecture for portrait segmentation: a source image passes through a placeholder feature backbone, context and detail paths, mask fusion, boundary refinement, and a final portrait composite."
              caption="System-level reconstruction of the complete portrait-mask path, from image input to boundary-aware composite."
              note={ARCHITECTURE_NOTE}
              viewLabel={ARCHITECTURE_VIEW}
              scrollLabel={ARCHITECTURE_SCROLL_LABEL}
              scrollHint={ARCHITECTURE_SCROLL_HINT}
              priority
            />
            <ResultFigure
              src="/images/projects/xiaomi/portrait-segmentation-reconstruction.jpg"
              srcSmall="/images/projects/xiaomi/portrait-segmentation-reconstruction-768.jpg"
              alt="Portrait segmentation demonstration: the same portrait shown as a source image, a binary semantic mask, and a foreground composite over a blurred outdoor background."
              caption="Source portrait, estimated foreground mask, and background-blur composite."
              priority
            />
            <EngineeringNotes
              implementation="The explored designs included GCN, CNN, GAN variants, and a cascaded multi-mask approach. Scene context and local image details informed the foreground mask, with refinement around hair, shoulders, and transition regions."
              efficiency="A segmentation model was useful only if the full mask-and-composite path remained practical on the target phone. Compression and operator support therefore had to be considered alongside visible boundary quality, not after the visual model was finished."
              difficulty="Fine hair, semi-transparent edges, occlusion, low light, motion blur, clutter, and similar foreground and background colours all break the clean-edge assumption. Small mask errors become obvious as halos or missing subject detail."
            />
          </section>

          <section className="case-study-section">
            <h2>Selfie to emoji with GANs</h2>
            <p>
              The goal was to turn a selfie into a cartoon or emoji while keeping the person recognisable.
            </p>
            <ArchitectureFigure
              src="/images/projects/xiaomi/selfie-emoji-architecture.svg"
              alt="System architecture for selfie-to-emoji generation: an aligned selfie passes through placeholder identity encoding and GAN-class generation, with training-only checks and multiple consistent expression outputs."
              caption="System-level reconstruction separating the handset inference path from training-only identity and style checks."
              note={ARCHITECTURE_NOTE}
              viewLabel={ARCHITECTURE_VIEW}
              scrollLabel={ARCHITECTURE_SCROLL_LABEL}
              scrollHint={ARCHITECTURE_SCROLL_HINT}
            />
            <ResultFigure
              src="/images/projects/xiaomi/selfie-emoji-reconstruction.jpg"
              srcSmall="/images/projects/xiaomi/selfie-emoji-reconstruction-768.jpg"
              alt="Selfie-to-emoji generation demonstration: one source portrait beside four consistent cartoon avatar expressions of the same person."
              caption="Expressions change across the set while identity and the character system remain recognisable."
            />
            <EngineeringNotes
              implementation="The project used GAN-based face cartoonisation. Face shape, hair, and feature placement were important for preserving identity while changing style."
              efficiency="A visually strong generator still needed stable outputs after compression and graph conversion. Model size, supported operations, and ordinary selfie conditions shaped what could move from a GPU experiment into a handset pipeline."
              difficulty="Balancing identity and style was difficult: too little stylisation looks like a filter, while too much removes the identifying details. Neutral, smiling, surprised, and focused outputs also had to read as one consistent character rather than unrelated faces."
            />
          </section>

          <section className="case-study-section">
            <h2>Mobile deployment and validation</h2>
            <p>
              The model was only one part of the system. The practical path was PyTorch and CUDA training, compression through quantisation or pruning, ONNX/IR graph conversion, and validation on the accelerator that would actually execute the model: Hexagon DSP or Kirin NPU.
            </p>
            <ArchitectureFigure
              src="/images/projects/xiaomi/mobile-deployment-architecture.svg"
              alt="Mobile deployment architecture: a PyTorch and CUDA model passes through compression, ONNX or IR export, operator validation, Hexagon DSP or Kirin NPU execution, and visual regression feedback."
              caption="The delivered graph—not only the training checkpoint—had to survive compression, conversion, runtime constraints, and image-level validation."
              note={ARCHITECTURE_NOTE}
              viewLabel={ARCHITECTURE_VIEW}
              scrollLabel={ARCHITECTURE_SCROLL_LABEL}
              scrollHint={ARCHITECTURE_SCROLL_HINT}
            />
            <EngineeringNotes
              implementation="Each conversion stage had to preserve the intended graph closely enough to validate the same image behaviour on the target runtime. Unsupported operators or changed numerical behaviour could require revisiting either the model or its exported graph."
              efficiency="Parameter count, memory traffic, latency, supported operators, and visual quality were coupled constraints. Improving one dimension could make another worse, so validation covered the delivered graph rather than only the training checkpoint."
              difficulty="The GPU model and the phone model were not automatically equivalent. Quantisation, pruning, conversion, and accelerator constraints could change boundary quality, destabilise generated faces, or prevent execution entirely."
            />
            <p className="case-study-evidence">
              Historical model size, FPS, and latency measurements were not retained in the public portfolio materials.
            </p>
          </section>
        </article>
      </SiteFrame>
      <Footer />
    </div>
  );
}
