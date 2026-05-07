import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { SectionHead, Tag } from '../components/primitives.jsx';

function BlogCard({ post, featured }) {
  const cls = ['blog-post', featured ? 'feat' : ''].filter(Boolean).join(' ');
  const langs = post.languages || ['en'];
  return (
    <Link to={`/blog/${post.slug}`} className={cls} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="when">
        {post.date}
        <div className="meta">
          {post.source ? 'via video' : ''}
          {langs.length > 1 && <span> · {langs.join('/').toUpperCase()}</span>}
        </div>
      </div>
      <div>
        <div className="ttl">{post.title_en}</div>
        {post.dek_en && <div className="dek">{post.dek_en}</div>}
        {post.tags?.length > 0 && (
          <div className="tags">
            {post.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}blog/posts.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setPosts)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="page">
      <Nav />
      <section style={{ padding: '32px 0' }}>
        <SectionHead num="01">Blog</SectionHead>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16, fontFamily: 'var(--mono)' }}>
          Notes and summaries — auto-drafted from talks and papers, edited by hand.
        </div>
        {error && <div style={{ color: 'crimson' }}>Could not load posts: {error}</div>}
        {posts === null && !error && <div>Loading…</div>}
        {posts !== null && posts.length === 0 && <div style={{ opacity: 0.6 }}>No posts yet.</div>}
        {posts && posts.length > 0 && (
          <div>
            {posts.map((p, i) => (
              <BlogCard key={p.slug} post={p} featured={i === 0} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
