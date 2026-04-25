import React from 'react';

export const Box = ({ dashed, hatch, className = '', style, children, ...rest }) => {
  const cls = ['box', dashed && 'dashed', hatch && 'hatch', className].filter(Boolean).join(' ');
  return <div className={cls} style={style} {...rest}>{children}</div>;
};

export const Tag = ({ children, body }) => (
  <span className={'tag ' + (body ? 'body' : '')}>{children}</span>
);

export const Note = ({ children }) => <span className="note">{children}</span>;

export const Status = ({ s }) => {
  const labels = {
    active: '● ACTIVE',
    paused: '◐ PAUSED',
    shipped: '✓ SHIPPED',
    archived: '□ ARCHIVED',
  };
  return <span className={'status ' + s}>{labels[s] || s.toUpperCase()}</span>;
};

export const Thumb = ({ label = 'fig', w = 90, h = 64, style }) => (
  <div className="thumb" style={{ width: w, height: h, ...style }}>
    <span>[{label}]</span>
  </div>
);

export const Squiggle = ({ w = 140 }) => (
  <svg className="squiggle" width={w} height="8" viewBox={`0 0 ${w} 8`}>
    <path
      d={`M0 4 Q ${w / 8} 0, ${w / 4} 4 T ${w / 2} 4 T ${(3 * w) / 4} 4 T ${w} 4`}
      stroke="#1a1a1a" strokeWidth="1.2" fill="none"
    />
  </svg>
);

export const SectionHead = ({ num, children, rule = 'line' }) => (
  <div className="sec">
    {num && <span className="num">{num}</span>}
    <h3>{children}</h3>
    {rule === 'line' && <div className="rule" />}
    {rule === 'squiggle' && <div className="grow" style={{ marginLeft: 8 }}><Squiggle /></div>}
  </div>
);

export const Kicker = ({ children }) => <div className="kicker">{children}</div>;

export const Chip = ({ solid, sm, href, onClick, children }) => {
  const cls = ['chip', solid && 'solid', sm && 'sm'].filter(Boolean).join(' ');
  if (href) {
    const external = /^https?:|^mailto:/i.test(href);
    return external
      ? <a className={cls} href={href} target="_blank" rel="noreferrer">{children}</a>
      : <a className={cls} href={href}>{children}</a>;
  }
  return <button className={cls} onClick={onClick} type="button">{children}</button>;
};
