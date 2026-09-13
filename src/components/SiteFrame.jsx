import React from 'react';
import ApHead from './ApHead.jsx';

export default function SiteFrame({ children, mainClassName = '', className = '' }) {
  const contentClass = ['portfolio-content', mainClassName].filter(Boolean).join(' ');

  return (
    <div className={`portfolio-shell ${className}`.trim()}>
      <aside className="site-profile" aria-label="Profile">
        <ApHead sidebar />
      </aside>
      <main id="main-content" className={contentClass} tabIndex={-1}>{children}</main>
    </div>
  );
}
