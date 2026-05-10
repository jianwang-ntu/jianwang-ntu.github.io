import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStyleMode } from '../context/StyleCtx.jsx';

const NAV_ITEMS = [
  { to: '/home', label: 'Home' },
  { to: '/pubs', label: 'Publications' },
  { to: '/work', label: 'Work & Projects' },
  { to: '/cv',   label: 'CV' },
  { to: '/blog', label: 'Blog' },
];

export default function Nav() {
  const { mode, toggle } = useStyleMode();
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
        <button
          className="style-toggle"
          onClick={toggle}
          title={mode === 'academic' ? 'Switch to classic style' : 'Switch to academic style'}
        >
          {mode === 'academic' ? '◧ classic' : '◨ academic'}
        </button>
      </div>
    </nav>
  );
}
