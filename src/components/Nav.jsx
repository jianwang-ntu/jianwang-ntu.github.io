import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/home', label: 'Home' },
  { to: '/statement', label: 'Research statement' },
  { to: '/pubs', label: 'Publications' },
  { to: '/work', label: 'Work & Projects' },
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
          if (n.to === '/work' && isChineseWorkPage) {
            return <Link key={n.to} to={n.to} className="active" aria-current="page">{n.label}</Link>;
          }
          return (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {n.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
    </>
  );
}
