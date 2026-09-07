import React from 'react';

/* Hand-authored schematics, one per paper / project.
   Every figure is plain inline SVG so it inherits the page theme through CSS
   custom properties (--ap-fig-*), costs no network request, and scales without
   raster artefacts. Each is drawn from the actual method described in the
   paper — these are explanatory, not decorative, so keep them honest: if a
   diagram would imply a mechanism the work does not use, change the diagram. */

const W = 600;

function Defs() {
  return (
    <defs>
      <marker id="apArrow" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--ap-fig-stroke)" />
      </marker>
    </defs>
  );
}

/* Evenly spaced left-to-right pipeline. `steps` are {label, sub}. */
function Flow({ steps, height = 118, y = 30, boxH = 52 }) {
  const gap = 18;
  const boxW = (W - gap * (steps.length - 1) - 8) / steps.length;
  return (
    <>
      {steps.map((s, i) => {
        const x = 4 + i * (boxW + gap);
        return (
          <g key={i}>
            <rect x={x} y={y} width={boxW} height={boxH} rx="6"
                  fill={s.accent ? 'var(--ap-fig-fill)' : 'none'}
                  stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
            <text x={x + boxW / 2} y={y + (s.sub ? 22 : 30)} textAnchor="middle"
                  className="ap-fig-label">{s.label}</text>
            {s.sub && (
              <text x={x + boxW / 2} y={y + 38} textAnchor="middle"
                    className="ap-fig-sub">{s.sub}</text>
            )}
            {i < steps.length - 1 && (
              <line x1={x + boxW + 3} y1={y + boxH / 2} x2={x + boxW + gap - 3} y2={y + boxH / 2}
                    stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
            )}
          </g>
        );
      })}
    </>
  );
}

function Frame({ title, children, height = 118 }) {
  return (
    <svg className="ap-fig" viewBox={`0 0 ${W} ${height}`} role="img"
         aria-label={title} preserveAspectRatio="xMidYMid meet">
      <title>{title}</title>
      <Defs />
      <text x="4" y="16" className="ap-fig-title">{title}</text>
      {children}
    </svg>
  );
}

/* ---- one figure per artefact ------------------------------------------- */

const defects4c = () => (
  <Frame title="Defects4C — mining a reproducible C/C++ repair benchmark">
    <Flow steps={[
      { label: '38M+', sub: 'commits' },
      { label: 'filter', sub: 'bug-fix pairs' },
      { label: 'expert', sub: 'validation', accent: true },
      { label: '350 bugs', sub: 'buildable + tests', accent: true },
      { label: '24 LLMs', sub: 'repair eval' },
    ]} />
  </Frame>
);

/* Hand-placed rather than using <Flow>: this figure forks, and Flow spreads
   its boxes across the full width, which would collide with the branch. */
const tracewise = () => (
  <Frame title="Do Code Semantics Help? — execution traces as LLM supervision" height={150}>
    <rect x="4" y="46" width="106" height="44" rx="6" fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="57" y="66" textAnchor="middle" className="ap-fig-label">source</text>
    <text x="57" y="80" textAnchor="middle" className="ap-fig-sub">program</text>

    <line x1="113" y1="68" x2="139" y2="68" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />

    <rect x="142" y="46" width="112" height="44" rx="6" fill="var(--ap-fig-fill)" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="198" y="66" textAnchor="middle" className="ap-fig-label">execute</text>
    <text x="198" y="80" textAnchor="middle" className="ap-fig-sub">runtime trace</text>

    {/* fork the trace into its two consumption paths */}
    <line x1="257" y1="68" x2="286" y2="68" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <line x1="286" y1="40" x2="286" y2="96" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <line x1="286" y1="40" x2="316" y2="40" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
    <line x1="286" y1="96" x2="316" y2="96" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />

    <rect x="318" y="24" width="122" height="32" rx="6" fill="var(--ap-fig-fill)" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="379" y="44" textAnchor="middle" className="ap-fig-label">SFT</text>
    <rect x="318" y="80" width="122" height="32" rx="6" fill="var(--ap-fig-fill)" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="379" y="100" textAnchor="middle" className="ap-fig-label">prompting</text>

    <line x1="442" y1="40" x2="470" y2="58" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
    <line x1="442" y1="96" x2="470" y2="78" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />

    <rect x="472" y="46" width="124" height="44" rx="6" fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="534" y="66" textAnchor="middle" className="ap-fig-label">Code LLM</text>
    <text x="534" y="80" textAnchor="middle" className="ap-fig-sub">probed</text>

    <text x="4" y="140" className="ap-fig-sub">trace semantics injected at training time and at inference time, then measured</text>
  </Frame>
);

const ratchet = () => (
  <Frame title="RATCHET — retrieval-augmented repair without failing tests" height={132}>
    <Flow steps={[
      { label: 'buggy code', sub: 'no failing test' },
      { label: 'BiLSTM', sub: 'fault localiser', accent: true },
      { label: 'retrieve', sub: 'similar fixes', accent: true },
      { label: 'transformer', sub: 'patch' },
    ]} />
    <text x="4" y="112" className="ap-fig-sub">localisation runs from the code alone — no test suite required to point at the fault</text>
  </Frame>
);

const aigcdet = () => {
  const tasks = ['Q&A', 'summarisation', 'generation'];
  return (
    <Frame title="AIGC Detectors on Code — 13 detectors × 2.23M samples" height={150}>
      <text x="4" y="36" className="ap-fig-sub">tasks</text>
      {tasks.map((t, i) => (
        <g key={t}>
          <rect x="58" y={26 + i * 30} width="132" height="24" rx="4"
                fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
          <text x="124" y={42 + i * 30} textAnchor="middle" className="ap-fig-label">{t}</text>
        </g>
      ))}
      <line x1="196" y1="68" x2="238" y2="68" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
      {/* detector grid — 13 cells */}
      <rect x="240" y="24" width="196" height="88" rx="6" fill="var(--ap-fig-fill)" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
      <text x="338" y="18" textAnchor="middle" className="ap-fig-sub">13 detectors</text>
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} x={252 + (i % 5) * 36} y={36 + Math.floor(i / 5) * 26}
              width="26" height="18" rx="3" fill="var(--ap-fig-accent)" opacity="0.30" />
      ))}
      <line x1="442" y1="68" x2="484" y2="68" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
      <rect x="486" y="44" width="110" height="48" rx="6" fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
      <text x="541" y="66" textAnchor="middle" className="ap-fig-label">accuracy</text>
      <text x="541" y="80" textAnchor="middle" className="ap-fig-sub">per task</text>
      <text x="4" y="140" className="ap-fig-sub">2.23M code samples — how well do AIGC detectors transfer from prose to code?</text>
    </Frame>
  );
};

const trustworthy = () => (
  <Frame title="Trustworthy AI-Assisted Programming — thesis arc" height={140}>
    <rect x="4" y="26" width="150" height="52" rx="6" fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="79" y="48" textAnchor="middle" className="ap-fig-label">AI-written</text>
    <text x="79" y="64" textAnchor="middle" className="ap-fig-sub">code</text>
    <line x1="156" y1="52" x2="196" y2="52" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
    <rect x="198" y="14" width="180" height="36" rx="6" fill="var(--ap-fig-fill)" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="288" y="36" textAnchor="middle" className="ap-fig-label">detect unreliable</text>
    <rect x="198" y="60" width="180" height="36" rx="6" fill="var(--ap-fig-fill)" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="288" y="82" textAnchor="middle" className="ap-fig-label">repair</text>
    <line x1="380" y1="32" x2="424" y2="46" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
    <line x1="380" y1="78" x2="424" y2="64" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
    <rect x="426" y="34" width="170" height="44" rx="6" fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="511" y="54" textAnchor="middle" className="ap-fig-label">trustworthy output</text>
    <text x="511" y="69" textAnchor="middle" className="ap-fig-sub">detection + repair</text>
    <text x="4" y="126" className="ap-fig-sub">vulnerability detection, AIGC detection and program repair as one pipeline</text>
  </Frame>
);

const fgvuldet = () => (
  <Frame title="FGVulDet — edge-aware GGNN with vulnerability-preserving augmentation" height={132}>
    <Flow steps={[
      { label: 'source', sub: 'function' },
      { label: 'code graph', sub: 'typed edges' },
      { label: 'augment', sub: 'vuln-preserving', accent: true },
      { label: 'GGNN', sub: 'edge-aware', accent: true },
      { label: 'verdict', sub: 'fine-grained' },
    ]} />
    <text x="4" y="112" className="ap-fig-sub">augmentation grows training data without destroying the vulnerability it labels</text>
  </Frame>
);

const faire = () => (
  <Frame title="Faire — fairness repair via neuron condition synthesis" height={132}>
    <Flow steps={[
      { label: 'trained net', sub: 'unfair' },
      { label: 'locate', sub: 'responsible neurons', accent: true },
      { label: 'synthesise', sub: 'neuron condition', accent: true },
      { label: 'repaired', sub: 'accuracy kept' },
    ]} />
    <text x="4" y="112" className="ap-fig-sub">repair edits neuron conditions rather than retraining the whole model</text>
  </Frame>
);

export const FIGURES = {
  defects4c, tracewise, ratchet, aigcdet, trustworthy, fgvuldet, faire,
};

export default function Figure({ id, className = '' }) {
  const F = FIGURES[id];
  if (!F) return null;
  return <div className={`ap-fig-wrap ${className}`}>{F()}</div>;
}
