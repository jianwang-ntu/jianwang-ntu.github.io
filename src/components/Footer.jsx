import React from 'react';

export default function Footer() {
  return (
    <footer className="foot">
      <span>© Jian Wang · 2026</span>
      <span>
        <a href="mailto:jian004@e.ntu.edu.sg">email</a> ·{' '}
        <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">scholar</a> ·{' '}
        <a href="https://twitter.com/jornbowrl" target="_blank" rel="noreferrer">twitter</a> ·{' '}
        <a href="/data/JianWang_cv.pdf" target="_blank" rel="noreferrer">cv</a>
      </span>
    </footer>
  );
}
