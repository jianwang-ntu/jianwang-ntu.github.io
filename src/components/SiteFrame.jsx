import React from 'react';
import ApHead from './ApHead.jsx';

export default function SiteFrame({ children, mainClassName = '' }) {
  const className = ['portfolio-content', mainClassName].filter(Boolean).join(' ');

  return (
    <div className="portfolio-shell case-study-shell">
      <aside aria-label="Profile">
        <ApHead sidebar />
      </aside>
      <main id="main-content" className={className}>{children}</main>
    </div>
  );
}
