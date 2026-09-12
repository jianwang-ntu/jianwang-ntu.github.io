import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Publications from './pages/Publications.jsx';
import WorkProjects from './pages/WorkProjects.jsx';
import CV from './pages/CV.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import PublicationDetail from './pages/PublicationDetail.jsx';
import Statement from './pages/Statement.jsx';

function ScrollToTop() {
  const { pathname, hash, key } = useLocation();
  const previous = useRef({});
  useEffect(() => {
    const changedPage = previous.current.pathname !== pathname;
    const leftAnchor = previous.current.hash && !hash;
    previous.current = { pathname, hash };
    if (!hash) {
      if (changedPage || leftAnchor) window.scrollTo(0, 0);
      return;
    }
    const frame = requestAnimationFrame(() => {
      let id;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      target?.scrollIntoView({ block: 'start' });
      if (target?.hasAttribute('tabindex')) target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
  return null;
}

function ResearchRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`/statement${search}${hash}`} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/statement" element={<Statement />} />
        <Route path="/research" element={<ResearchRedirect />} />
        <Route path="/pubs" element={<Publications />} />
        <Route path="/pubs/:key" element={<PublicationDetail />} />
        <Route path="/work" element={<WorkProjects />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
