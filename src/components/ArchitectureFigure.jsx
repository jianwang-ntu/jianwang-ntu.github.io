import React from 'react';

export default function ArchitectureFigure({
  src,
  alt,
  caption,
  note,
  viewLabel,
  scrollLabel,
  scrollHint,
  className = '',
  width = 1440,
  height = 900,
  priority = false,
}) {
  return (
    <figure className={`case-study-figure architecture-figure ${className}`.trim()}>
      <div
        className="architecture-scroll"
        role="group"
        aria-label={scrollLabel}
        tabIndex="0"
      >
        <img
          src={src}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          decoding="async"
          alt={alt}
        />
      </div>
      <figcaption>
        <span>{caption}</span>
        <span className="architecture-placeholder-note">{note}</span>
        <span className="architecture-scroll-hint">{scrollHint}</span>
        <a href={src} target="_blank" rel="noreferrer" className="architecture-fullsize-link">
          {viewLabel}
        </a>
      </figcaption>
    </figure>
  );
}
