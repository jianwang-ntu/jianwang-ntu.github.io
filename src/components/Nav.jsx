import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/home', label: 'Home' },
  { to: '/pubs', label: 'Publications' },
  { to: '/work', label: 'Work & Projects' },
  { to: '/cv',   label: 'CV' },
];

export default function Nav() {
  return (
    <nav className="nav">
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
  );
}
