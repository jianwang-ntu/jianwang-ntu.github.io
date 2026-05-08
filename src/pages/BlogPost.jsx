import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import { Tag } from '../components/primitives.jsx';

// Cover-image URLs in meta.json are stored as `/images/blog/<slug>.png` for
// local dev. The deploy workflow rewrites them to S3 URLs in dist/, but the
// runtime image we use for og:image must always be absolute. Match the deploy
// rewrite so the og:image works on every endpoint, including a fresh first
// load before the prerendered <head> takes over.
const S3_IMAGE_BASE = 'https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io';
function absoluteImage(image) {
  if (!image) return undefined;
  if (image.startsWith('http')) return image;
  return `${S3_IMAGE_BASE}${image}`;
}

function pickInitialLang(meta) {
  const langs = meta?.languages || ['en'];
  if (typeof navigator !== 'undefined') {
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('zh') && langs.includes('zh')) return 'zh';
  }
  return langs.includes('en') ? 'en' : langs[0];
}

export default function BlogPost() {
  const { slug } = useParams();
  const [meta, setMeta] = useState(null);
  const [lang, setLang] = useState(null);
  const [body, setBody] = useState(null);
  const [error, setError] = useState(null);

  // Step 1: load meta.json (per-post). Falls back to scanning posts.json.
  useEffect(() => {
    let cancelled = false;
    const base = import.meta.env.BASE_URL;
    fetch(`${base}blog/${slug}/meta.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((m) => {
        if (cancelled) return;
        setMeta(m);
        setLang(pickInitialLang(m));
      })
      .catch(() =>
        // Fallback: pull from manifest if per-post meta is missing.
        fetch(`${base}blog/posts.json`)
          .then((r) => r.json())
          .then((posts) => {
            if (cancelled) return;
            const found = posts.find((p) => p.slug === slug);
            if (!found) {
              setError('Post not found.');
              return;
            }
            setMeta(found);
            setLang(pickInitialLang(found));
          })
          .catch((e) => !cancelled && setError(e.message))
      );
    return () => { cancelled = true; };
  }, [slug]);

  // Step 2: fetch the markdown for the active language whenever it changes.
  useEffect(() => {
    if (!lang || !slug) return;
    let cancelled = false;
    setBody(null);
    fetch(`${import.meta.env.BASE_URL}blog/${slug}/index.${lang}.md`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((md) => { if (!cancelled) setBody(md); })
      .catch((e) => !cancelled && setError(e.message));
    return () => { cancelled = true; };
  }, [slug, lang]);

  const langs = meta?.languages || [];
  const title = meta && (meta[`title_${lang}`] || meta.title_en || meta.title);

  // Per-post head tags — only render Seo once meta has loaded so we don't
  // overwrite the prerendered head with empty defaults.
  const seo = meta && (
    <Seo
      title={meta.title_en || meta.slug}
      description={meta.dek_en}
      image={absoluteImage(meta.image)}
      path={`/blog/${meta.slug}`}
      type="article"
      ldJson={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: meta.title_en || meta.slug,
        description: meta.dek_en,
        image: absoluteImage(meta.image),
        author: { '@type': 'Person', name: 'Jian Wang' },
        publisher: { '@type': 'Person', name: 'Jian Wang' },
        datePublished: meta.date,
        dateModified: meta.date,
        mainEntityOfPage: `https://www.wj2ai.com/blog/${meta.slug}`,
        ...(meta.source ? { isBasedOn: meta.source } : {}),
      }}
    />
  );

  return (
    <div className="page">
      {seo}
      <Nav />
      <section style={{ padding: '32px 0', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/blog">← back to blog</Link>
          {langs.length > 1 && (
            <div style={{ display: 'flex', gap: 6 }}>
              {langs.map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={'chip sm' + (code === lang ? ' solid' : '')}
                  type="button"
                >
                  {code === 'en' ? 'EN' : code === 'zh' ? '中文' : code.toUpperCase()}
                </button>
              ))}
            </div>
          )}
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
          <article className="blog-body" lang={lang}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </article>
        )}

        {meta && !body && !error && <div>Loading…</div>}
      </section>
      <Footer />
    </div>
  );
}
