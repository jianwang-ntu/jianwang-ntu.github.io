import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/home', label: 'Home' },
  { to: '/statement', label: 'Research statement', short: 'Research' },
  { to: '/pubs', label: 'Publications' },
  { to: '/work', label: 'Work & Projects', short: 'Work' },
  { to: '/cv',   label: 'CV' },
  { to: '/blog', label: 'Blog' },
];

export default function Nav({ skipToContent = false }) {
  const { pathname } = useLocation();
  const isChineseWorkPage = pathname.startsWith('/zh/work/');

  return (
    <>
    {skipToContent && <a className="skip-link" href="#main-content">Skip to content</a>}
    <nav className="nav" aria-label="Main navigation">
      <NavLink to="/home" className="brand" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
        Jian Wang · 王剑
      </NavLink>
      <div className="links">
        {NAV_ITEMS.map((n) => {
          const label = n.short ? <><span className="nav-label-full">{n.label}</span><span className="nav-label-short" aria-hidden="true">{n.short}</span></> : n.label;
          if (n.to === '/work' && isChineseWorkPage) {
            return <Link key={n.to} to={n.to} className="active" aria-current="page" aria-label={n.label}>{label}</Link>;
          }
          return (
            <NavLink
              key={n.to}
              to={n.to}
              aria-label={n.label}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {label}
            </NavLink>
          );
        })}
      </div>
    </nav>
    </>
  );
}
