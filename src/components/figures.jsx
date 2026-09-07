import React from 'react';

/* Figures for papers and projects.
   Preferred source is the real figure lifted from the paper PDF — it is what
   the authors actually drew, carries the true numbers, and cannot misrepresent
   the method. Papers whose PDF is not openly reachable (ACM DL / AAAI OJS) fall
   back to a hand-drawn schematic below; swap them for the real figure whenever
   the PDF becomes available. */

const PAPER_IMAGES = {
  defects4c: {
    src: '/images/papers/defects4c.png',
    alt: 'Defects4C data collection pipeline: ~38M commits filtered to ~9M, ~76K, ~3.8K, then 350 human-annotated bugs split into Defects4C_bug and Defects4C_vul.',
    caption: 'Data collection and processing pipeline — Defects4C, ASE ’25 (Fig. 1)',
  },
  tracewise: {
    src: '/images/papers/tracewise.png',
    alt: 'Framework paradigm: an execution behaviour dataset feeds prompt-tuning data construction, then fine-tuning via PEFT/LoRA or full optimisation, and inference with scaling.',
    caption: 'Framework paradigm — Do Code Semantics Help?, EMNLP Findings ’25 (Fig. 1)',
  },
  ratchet: {
    src: '/images/papers/ratchet.png',
    alt: 'RATCHET overview: a training phase building RATCHET-FL and RATCHET-PG from a patch dataset, and an inference phase running fault localisation, CRP retrieval and patch generation.',
    caption: 'Overview — RATCHET, ISSRE ’24 (Fig. 1)',
  },
  fgvuldet: {
    src: '/images/papers/fgvuldet.png',
    alt: 'FGVulDet framework: data collection and vulnerability-preserving mutation produce an augmented dataset, consumed by an edge-aware GGNN detector with per-CWE classifiers.',
    caption: 'Framework — FGVulDet, LCTES ’24 (Fig. 2)',
  },
};

/* ── hand-drawn fallbacks ───────────────────────────────────────────────
   Layout rule: the frame title occupies roughly y=8..18, so no shape may
   start above y=26. A previous revision put a box at y=14 and it collided
   with the title on the live site. */

const W = 600;
const TOP = 26;

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

function Frame({ title, children, height }) {
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

function Flow({ steps, y = 34, boxH = 52 }) {
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
            {s.sub && <text x={x + boxW / 2} y={y + 38} textAnchor="middle"
                            className="ap-fig-sub">{s.sub}</text>}
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

const trustworthy = () => (
  <Frame title="Trustworthy AI-Assisted Programming — thesis arc" height={152}>
    <rect x="4" y={TOP + 14} width="150" height="52" rx="6" fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="79" y={TOP + 36} textAnchor="middle" className="ap-fig-label">AI-written</text>
    <text x="79" y={TOP + 52} textAnchor="middle" className="ap-fig-sub">code</text>
    <line x1="156" y1={TOP + 40} x2="196" y2={TOP + 40} stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
    <rect x="198" y={TOP} width="180" height="36" rx="6" fill="var(--ap-fig-fill)" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="288" y={TOP + 23} textAnchor="middle" className="ap-fig-label">detect unreliable</text>
    <rect x="198" y={TOP + 46} width="180" height="36" rx="6" fill="var(--ap-fig-fill)" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="288" y={TOP + 69} textAnchor="middle" className="ap-fig-label">repair</text>
    <line x1="380" y1={TOP + 18} x2="424" y2={TOP + 32} stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
    <line x1="380" y1={TOP + 64} x2="424" y2={TOP + 50} stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
    <rect x="426" y={TOP + 20} width="170" height="44" rx="6" fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
    <text x="511" y={TOP + 40} textAnchor="middle" className="ap-fig-label">trustworthy output</text>
    <text x="511" y={TOP + 55} textAnchor="middle" className="ap-fig-sub">detection + repair</text>
    <text x="4" y="146" className="ap-fig-sub">vulnerability detection, AIGC detection and program repair as one pipeline</text>
  </Frame>
);

const aigcdet = () => {
  const tasks = ['Q&A', 'summarisation', 'generation'];
  return (
    <Frame title="AIGC Detectors on Code — 13 detectors × 2.23M samples" height={168}>
      <text x="4" y={TOP + 22} className="ap-fig-sub">tasks</text>
      {tasks.map((t, i) => (
        <g key={t}>
          <rect x="58" y={TOP + 8 + i * 30} width="132" height="24" rx="4"
                fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
          <text x="124" y={TOP + 24 + i * 30} textAnchor="middle" className="ap-fig-label">{t}</text>
        </g>
      ))}
      <line x1="196" y1={TOP + 50} x2="238" y2={TOP + 50} stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
      <rect x="240" y={TOP + 6} width="196" height="88" rx="6" fill="var(--ap-fig-fill)" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
      <text x="338" y={TOP + 2} textAnchor="middle" className="ap-fig-sub">13 detectors</text>
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} x={252 + (i % 5) * 36} y={TOP + 18 + Math.floor(i / 5) * 26}
              width="26" height="18" rx="3" fill="var(--ap-fig-accent)" opacity="0.30" />
      ))}
      <line x1="442" y1={TOP + 50} x2="484" y2={TOP + 50} stroke="var(--ap-fig-stroke)" strokeWidth="1.2" markerEnd="url(#apArrow)" />
      <rect x="486" y={TOP + 26} width="110" height="48" rx="6" fill="none" stroke="var(--ap-fig-stroke)" strokeWidth="1.2" />
      <text x="541" y={TOP + 48} textAnchor="middle" className="ap-fig-label">accuracy</text>
      <text x="541" y={TOP + 62} textAnchor="middle" className="ap-fig-sub">per task</text>
      <text x="4" y="162" className="ap-fig-sub">2.23M code samples — how well do AIGC detectors transfer from prose to code?</text>
    </Frame>
  );
};

const faire = () => (
  <Frame title="Faire — fairness repair via neuron condition synthesis" height={138}>
    <Flow steps={[
      { label: 'trained net', sub: 'unfair' },
      { label: 'locate', sub: 'responsible neurons', accent: true },
      { label: 'synthesise', sub: 'neuron condition', accent: true },
      { label: 'repaired', sub: 'accuracy kept' },
    ]} />
    <text x="4" y="118" className="ap-fig-sub">repair edits neuron conditions rather than retraining the whole model</text>
  </Frame>
);

export const FIGURES = { trustworthy, aigcdet, faire };

export default function Figure({ id, className = '' }) {
  const img = PAPER_IMAGES[id];
  if (img) {
    return (
      <figure className={`ap-fig-wrap ap-fig-photo ${className}`}>
        <img src={img.src} alt={img.alt} loading="lazy" className="ap-fig-img" />
        <figcaption className="ap-fig-credit">{img.caption}</figcaption>
      </figure>
    );
  }
  const F = FIGURES[id];
  if (!F) return null;
  return <div className={`ap-fig-wrap ${className}`}>{F()}</div>;
}
