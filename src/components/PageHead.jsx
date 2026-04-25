import React from 'react';

export default function PageHead({ kicker, title, blurb, right }) {
  return (
    <header className="page-head">
      <div className="ph-main">
        {kicker && <div className="kicker">{kicker}</div>}
        <h1>{title}</h1>
        {blurb && <div className="blurb">{blurb}</div>}
      </div>
      {right && <div>{right}</div>}
    </header>
  );
}
