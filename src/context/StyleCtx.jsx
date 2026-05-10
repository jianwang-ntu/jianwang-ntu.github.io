import React, { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'wj-style-mode';
const DEFAULT_MODE = 'academic'; // new default

const StyleCtx = createContext({ mode: DEFAULT_MODE, toggle: () => {} });

export function StyleProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'classic' || stored === 'academic' ? stored : DEFAULT_MODE;
    } catch {
      return DEFAULT_MODE;
    }
  });

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'academic' ? 'classic' : 'academic';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  return <StyleCtx.Provider value={{ mode, toggle }}>{children}</StyleCtx.Provider>;
}

export function useStyleMode() {
  return useContext(StyleCtx);
}
