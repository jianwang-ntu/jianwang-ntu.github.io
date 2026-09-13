import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';

const PROJECT_SOCIAL_IMAGE = 'https://www.wj2ai.com/images/projects/xiaomi/portrait-segmentation-reconstruction.jpg';

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
              Two image systems shared one engineering constraint: research-grade portrait models had to become dependable mobile experiences. The work connected semantic segmentation for portrait effects with GAN-based selfie cartoonisation, then carried the models from GPU training toward on-device inference.
            </p>
            <p className="case-study-evidence-intro">
              The visuals below are illustrative reconstructions made from portfolio portraits, not original Xiaomi product captures. The retained record confirms the project domains and deployment path, but not proprietary model topology or benchmark tables.
            </p>
          </header>

          <section className="case-study-section">
            <h2>Portrait semantic segmentation</h2>
            <p>
              The product contract was to separate the person from the surrounding scene so a phone could blur, replace, or restyle the background. The visible quality depended on the least forgiving pixels: the subject boundary.
            </p>
            <ResultFigure
              src="/images/projects/xiaomi/portrait-segmentation-reconstruction.jpg"
              srcSmall="/images/projects/xiaomi/portrait-segmentation-reconstruction-768.jpg"
              alt="Portrait segmentation demonstration: the same portrait shown as a source image, a binary semantic mask, and a foreground composite over a blurred outdoor background."
              caption="The product contract in one sequence: preserve the subject, estimate a clean mask, and make the final composite feel natural."
              priority
            />
            <EngineeringNotes
              implementation="The explored system designs included GCN, CNN, GAN variants, and a cascaded multi-mask approach. They combined scene context with local evidence to estimate the foreground and refine hair, shoulders, and transition regions. This is a system-level reconstruction of the verified deployment logic without asserting Xiaomi’s proprietary topology or losses."
              efficiency="A segmentation model was useful only if the full mask-and-composite path remained practical on the target phone. Compression and operator support therefore had to be considered alongside visible boundary quality, not after the visual model was finished."
              difficulty="Fine hair, semi-transparent edges, occlusion, low light, motion blur, clutter, and similar foreground and background colours all break the clean-edge assumption. Small mask errors become obvious as halos or missing subject detail."
            />
          </section>

          <section className="case-study-section">
            <h2>Selfie to emoji with GANs</h2>
            <p>
              This project treated a selfie as a character-design problem: simplify the portrait into an expressive visual language without losing the face that makes the result personal.
            </p>
            <ResultFigure
              src="/images/projects/xiaomi/selfie-emoji-reconstruction.jpg"
              srcSmall="/images/projects/xiaomi/selfie-emoji-reconstruction-768.jpg"
              alt="Selfie-to-emoji generation demonstration: one source portrait beside four consistent cartoon avatar expressions of the same person."
              caption="Expressions change across the set while identity and the character system remain recognisable."
            />
            <EngineeringNotes
              implementation="The retained record identifies GAN-based face cartoonisation. At the product level, that meant structuring the portrait, translating it into the target visual language, and constraining face shape, hair, and feature placement so the output stayed recognisable."
              efficiency="A visually strong generator still needed stable outputs after compression and graph conversion. Model size, supported operations, and ordinary selfie conditions shaped what could move from a GPU experiment into a handset pipeline."
              difficulty="Identity and style pull in opposite directions: too little stylisation looks like a filter, while too much removes the identifying details. Neutral, smiling, surprised, and focused outputs also had to read as one consistent character rather than unrelated faces."
            />
          </section>

          <section className="case-study-section">
            <h2>Mobile deployment and validation</h2>
            <p>
              The model was only one part of the system. The practical path was PyTorch and CUDA training, compression through quantisation or pruning, ONNX/IR graph conversion, and validation on the accelerator that would actually execute the model: Hexagon DSP or Kirin NPU.
            </p>
            <EngineeringNotes
              implementation="Each conversion stage had to preserve the intended graph closely enough to validate the same image behaviour on the target runtime. Unsupported operators or changed numerical behaviour could require revisiting either the model or its exported graph."
              efficiency="Parameter count, memory traffic, latency, supported operators, and visual quality were coupled constraints. Improving one dimension could make another worse, so validation covered the delivered graph rather than only the training checkpoint."
              difficulty="The GPU model and the phone model were not automatically equivalent. Quantisation, pruning, conversion, and accelerator constraints could change boundary quality, destabilise generated faces, or prevent execution entirely."
            />
            <p className="case-study-evidence">
              Historical model size, FPS, and latency measurements were not retained in the public portfolio materials. This page therefore explains the supported engineering path without inventing those numbers, the exact generator or discriminator, or a proprietary loss formulation.
            </p>
            <p className="case-study-closing">
              The lasting lesson was concrete: model quality includes the halo around hair, whether a generated face still looks like the same person, whether a converted graph behaves differently, and whether the target accelerator can execute it at all.
            </p>
          </section>
        </article>
      </SiteFrame>
      <Footer />
    </div>
  );
}
