import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { Tag } from '../components/primitives.jsx';

export default function BlogPost() {
  const { slug } = useParams();
  const [meta, setMeta] = useState(null);
  const [body, setBody] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const base = import.meta.env.BASE_URL;

    fetch(`${base}blog/posts.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((posts) => {
        if (cancelled) return;
        const found = posts.find((p) => p.slug === slug);
        if (!found) {
          setError('Post not found.');
          return;
        }
        setMeta(found);
        return fetch(`${base}blog/${slug}.md`);
      })
      .then((r) => {
        if (!r) return;
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((md) => { if (!cancelled && md) setBody(md); })
      .catch((e) => !cancelled && setError(e.message));

    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="page">
      <Nav />
      <section style={{ padding: '32px 0', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', marginBottom: 24 }}>
          <Link to="/blog">← back to blog</Link>
        </div>

        {error && <div style={{ color: 'crimson' }}>{error}</div>}

        {meta && (
          <div style={{ marginBottom: 16, fontSize: 11, fontFamily: 'var(--mono)', opacity: 0.7 }}>
            {meta.date}
            {meta.source && <> · <a href={meta.source} target="_blank" rel="noreferrer">source video</a></>}
          </div>
        )}

        {meta?.tags?.length > 0 && (
          <div className="tags" style={{ marginBottom: 24 }}>
            {meta.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        )}

        {body && (
          <article className="blog-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </article>
        )}

        {meta && !body && !error && <div>Loading…</div>}
      </section>
      <Footer />
    </div>
  );
}
