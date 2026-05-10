import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { StyleProvider } from './context/StyleCtx.jsx';
import Home from './pages/Home.jsx';
import Publications from './pages/Publications.jsx';
import WorkProjects from './pages/WorkProjects.jsx';
import CV from './pages/CV.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <StyleProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pubs" element={<Publications />} />
        <Route path="/work" element={<WorkProjects />} />
        <Route path="/cv" element={<CV />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </StyleProvider>
  );
}
