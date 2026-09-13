import React from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';

const PROJECT_SOCIAL_IMAGE = 'https://www.wj2ai.com/images/projects/xiaomi/portrait-segmentation-reconstruction.jpg';

const segmentationSteps = [
  {
    number: '01',
    title: 'Frame',
    text: 'Normalize the camera frame while preserving the full portrait, not only the face crop.',
  },
  {
    number: '02',
    title: 'Separate',
    text: 'Use global scene context and local visual evidence to estimate a person-level foreground mask.',
  },
  {
    number: '03',
    title: 'Refine',
    text: 'Resolve hair, shoulders, and blur boundaries with the explored GCN, CNN, GAN, and cascaded multi-mask designs.',
  },
  {
    number: '04',
    title: 'Ship',
    text: 'Compress, convert, and validate the model against the operators available on the target mobile accelerator.',
  },
];

const deploymentSteps = [
  { label: 'Train', detail: 'PyTorch · CUDA' },
  { label: 'Compress', detail: 'quantise · prune' },
  { label: 'Convert', detail: 'ONNX/IR' },
  { label: 'Accelerate', detail: 'Hexagon DSP · Kirin NPU' },
];

const segmentationChallenges = [
  {
    title: 'Hair is not a hard edge',
    text: 'Fine strands and semi-transparent boundaries make a coarse foreground mask visibly artificial.',
  },
  {
    title: 'Real scenes break clean assumptions',
    text: 'Clutter, similar foreground and background colours, low light, and motion blur all compete with the subject boundary.',
  },
  {
    title: 'The GPU model is not the phone model',
    text: 'Quantisation, pruning, conversion, and unsupported operators can each change accuracy or block deployment.',
  },
];

const emojiSteps = [
  {
    number: '01',
    title: 'Structure',
    text: 'Center the portrait representation so pose and framing do not overwhelm identity-bearing features.',
  },
  {
    number: '02',
    title: 'Translate',
    text: 'Treat cartoonisation as a GAN-based image-to-image translation problem rather than a fixed artistic filter.',
  },
  {
    number: '03',
    title: 'Constrain',
    text: 'Keep face shape, hair, and feature placement recognizable while simplifying texture, colour, and line work.',
  },
  {
    number: '04',
    title: 'Productise',
    text: 'Control model size, conversion compatibility, and output stability across ordinary selfie conditions.',
  },
];

const emojiChallenges = [
  {
    title: 'Identity versus style',
    text: 'Too little stylisation looks like a filter; too much removes the details that make the avatar recognizable.',
  },
  {
    title: 'Expressions must share one character',
    text: 'A neutral, smiling, surprised, or focused face should still look like the same designed persona.',
  },
  {
    title: 'Training quality is not deployment quality',
    text: 'A visually strong generator must remain stable after compression and graph conversion on constrained hardware.',
  },
];

function ResultFigure({ src, srcSmall, alt, caption, priority = false }) {
  return (
    <figure className="xp-result">
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
      <figcaption>
        <strong>Illustrative reconstruction.</strong> {caption}
      </figcaption>
    </figure>
  );
}

function StepGrid({ steps }) {
  return (
    <div className="xp-step-grid">
      {steps.map((step) => (
        <section className="xp-step" key={step.number}>
          <span>{step.number}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </section>
      ))}
    </div>
  );
}

function ChallengeGrid({ items }) {
  return (
    <div className="xp-challenge-grid">
      {items.map((item) => (
        <section className="xp-challenge" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </section>
      ))}
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
        <article className="industry-case-study xiaomi-project">
          <Link to="/work" className="xp-back">← Work &amp; Projects</Link>

          <header className="xp-hero">
            <p className="xp-overline">Xiaomi AI Lab · Beijing · 2017–2019</p>
            <h1>Portrait intelligence, built for the phone</h1>
            <p className="xp-dek">
              Two image systems, one engineering constraint: turn research-grade
              portrait models into dependable mobile experiences. The work joined
              semantic segmentation for portrait effects with GAN-based selfie
              cartoonisation—and carried both from GPU training toward on-device inference.
            </p>
            <div className="xp-fact-row" aria-label="Project scope">
              <span>Portrait segmentation</span>
              <span>GAN generation</span>
              <span>On-device inference</span>
            </div>
          </header>

          <aside className="xp-evidence-note">
            <strong>About the visuals and evidence.</strong> The images on this page are
            illustrative reconstructions made from portfolio portraits, not original
            Xiaomi product captures. The public record confirms the project domains and
            deployment path, but not the proprietary model topology or benchmark tables.
          </aside>

          <section className="xp-section" aria-labelledby="segmentation-title">
            <p className="xp-overline">Project 01 · Understand the portrait</p>
            <h2 id="segmentation-title">Portrait semantic segmentation</h2>
            <p className="xp-lead">
              The product task was deceptively simple: isolate the person so a phone
              camera could blur, replace, or restyle the background. The visible quality
              of the feature depended on the least forgiving pixels—the boundary.
            </p>
            <ResultFigure
              src="/images/projects/xiaomi/portrait-segmentation-reconstruction.jpg"
              srcSmall="/images/projects/xiaomi/portrait-segmentation-reconstruction-768.jpg"
              alt="Portrait segmentation demonstration: the same portrait shown as a source image, a binary semantic mask, and a foreground composite over a blurred outdoor background."
              caption="A compact view of the product contract: preserve the subject, estimate a clean mask, and make the composite feel natural."
              priority
            />

            <div className="xp-model-note">
              <strong>Verified scope, system-level reconstruction.</strong>{' '}
              Retained portfolio records name GCN, CNN, GAN variants, and a cascaded
              multi-mask design. The stages below explain the verified deployment logic
              without asserting Xiaomi’s proprietary topology or losses.
            </div>

            <h3 className="xp-subhead">Implementation logic</h3>
            <StepGrid steps={segmentationSteps} />

            <h3 className="xp-subhead">What made it difficult</h3>
            <ChallengeGrid items={segmentationChallenges} />
          </section>

          <section className="xp-efficiency" aria-labelledby="efficiency-title">
            <p className="xp-overline">Efficiency · The model was only half the system</p>
            <h2 id="efficiency-title">From a CUDA graph to a mobile graph</h2>
            <p className="xp-lead">
              Efficiency was an end-to-end deployment loop: reduce the model, preserve
              acceptable visual boundaries, convert the graph, and retest it on the
              accelerator that would actually execute it.
            </p>
            <div className="xp-pipeline" aria-label="Model deployment pipeline">
              {deploymentSteps.map((step, index) => (
                <div className="xp-pipeline-step" key={step.label}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step.label}</strong>
                  <small>{step.detail}</small>
                </div>
              ))}
            </div>
            <div className="xp-efficiency-copy">
              <p>
                <strong>Optimisation targets.</strong> Parameter count, memory traffic,
                latency, supported operators, and visual boundary quality had to be
                considered together; improving one could degrade another.
              </p>
              <p>
                <strong>Evidence boundary.</strong> Historical model size, FPS, and latency
                measurements were not retained in the public portfolio materials, so this
                page describes the verified deployment workflow without inventing numbers.
              </p>
            </div>
          </section>

          <section className="xp-section" aria-labelledby="emoji-title">
            <p className="xp-overline">Project 02 · Redesign the portrait</p>
            <h2 id="emoji-title">Selfie to emoji with GANs</h2>
            <p className="xp-lead">
              This project treated a selfie as a character-design problem: simplify the
              image into an expressive visual language without losing the face that makes
              the result personal.
            </p>
            <ResultFigure
              src="/images/projects/xiaomi/selfie-emoji-reconstruction.jpg"
              srcSmall="/images/projects/xiaomi/selfie-emoji-reconstruction-768.jpg"
              alt="Selfie-to-emoji generation demonstration: one source portrait beside four consistent cartoon avatar expressions of the same person."
              caption="The key tension is visible across the set: expressions change, while identity and the character system remain stable."
            />

            <div className="xp-model-note">
              <strong>System-level reconstruction, not a proprietary architecture claim.</strong>{' '}
              The archived record identifies GAN-based face cartoonisation, but not the
              exact generator, discriminator, or loss formulation. The stages below explain
              the product logic that such a system must satisfy.
            </div>

            <h3 className="xp-subhead">Implementation logic</h3>
            <StepGrid steps={emojiSteps} />

            <h3 className="xp-subhead">What made it difficult</h3>
            <ChallengeGrid items={emojiChallenges} />
          </section>

          <section className="xp-takeaway" aria-labelledby="takeaway-title">
            <p className="xp-overline">What carried forward</p>
            <h2 id="takeaway-title">A model is trustworthy only inside its delivery path</h2>
            <p>
              These projects made failure concrete: a halo around hair, a changed identity,
              a graph that converted but ran differently, or an accelerator that could not
              execute the chosen operator. That systems view later became a useful lens for
              studying deep-learning robustness, model behaviour, and reliable AI-assisted
              software.
            </p>
          </section>
        </article>
      </SiteFrame>
      <Footer />
    </div>
  );
}
