import React from 'react';
import { useLocation } from 'react-router-dom';
import ApHead from './ApHead.jsx';

export default function SiteFrame({ children, mainClassName = '', className = '' }) {
  const { pathname } = useLocation();
  const isHome = pathname.replace(/\/$/, '') === '/home';
  const contentClass = ['portfolio-content', mainClassName].filter(Boolean).join(' ');

  return (
    <div className={`portfolio-shell${isHome ? '' : ' portfolio-shell--wide'} ${className}`.trim()}>
      <aside className="site-profile" aria-label="Profile">
        {isHome ? <ApHead sidebar /> : (
          <details className="profile-disclosure" key={pathname}>
            <summary>Profile</summary>
            <ApHead sidebar />
          </details>
        )}
      </aside>
      <main id="main-content" className={contentClass} tabIndex={-1}>{children}</main>
    </div>
  );
}
