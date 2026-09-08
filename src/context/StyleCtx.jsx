import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'wj-style-mode';
const DEFAULT_MODE = 'apages'; // academicpages is now the site's own style

/* Cycle order for the nav toggle. `label` is the mode you'll switch TO, so the
   button always advertises its destination (same convention as the original
   two-mode toggle). Adding a mode here is all it takes to extend the cycle —
   the validator below derives from this list rather than hard-coding names,
   which is what broke when the set was still literal 'classic' | 'academic'. */
export const MODES = [
  { id: 'apages',   label: '▤ academicpages', title: 'Switch to academicpages style' },
  { id: 'academic', label: '◨ academic', title: 'Switch to academic style' },
  { id: 'classic',  label: '◧ classic', title: 'Switch to classic style' },
];

const MODE_IDS = MODES.map((m) => m.id);

const StyleCtx = createContext({ mode: DEFAULT_MODE, toggle: () => {}, next: DEFAULT_MODE });

export function StyleProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return MODE_IDS.includes(stored) ? stored : DEFAULT_MODE;
    } catch {
      return DEFAULT_MODE;
    }
  });

  const toggle = useCallback(() => {
    setMode((prev) => {
      const i = MODE_IDS.indexOf(prev);
      const next = MODE_IDS[(i + 1) % MODE_IDS.length];
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  // Stamp the active mode on the root element so global chrome — masthead,
  // footer, body background — can be themed without touching every page shell.
  useEffect(() => {
    document.documentElement.setAttribute('data-style', mode);
  }, [mode]);

  const nextMode = MODE_IDS[(MODE_IDS.indexOf(mode) + 1) % MODE_IDS.length];

  return (
    <StyleCtx.Provider value={{ mode, toggle, next: nextMode }}>
      {children}
    </StyleCtx.Provider>
  );
}

export function useStyleMode() {
  return useContext(StyleCtx);
}
