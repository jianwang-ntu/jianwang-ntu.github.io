import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/home', label: 'Home' },
  { to: '/statement', label: 'Research statement' },
  { to: '/pubs', label: 'Publications' },
  { to: '/work', label: 'Work & Projects' },
  { to: '/cv',   label: 'CV' },
  { to: '/blog', label: 'Blog' },
];

export default function Nav({ skipToContent = false }) {
  return (
    <>
    {skipToContent && <a className="skip-link" href="#main-content">Skip to content</a>}
    <nav className="nav" aria-label="Main navigation">
      <NavLink to="/home" className="brand" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
        Jian Wang · 王剑
      </NavLink>
      <div className="links">
        {NAV_ITEMS.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {n.label}
          </NavLink>
        ))}
      </div>
    </nav>
    </>
  );
}
