import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { SectionHead, Tag } from '../components/primitives.jsx';

// --------------------------------------------------------------------------- //
// Label taxonomy — must mirror tools/video-to-blog/pipeline.py LABEL_TAXONOMY
// so the filter bar shows axes in a stable order even before any post on the
// site uses them.
// --------------------------------------------------------------------------- //
const AXES = [
  { key: 'topic',   label: 'Topic'   },
  { key: 'format',  label: 'Format'  },
  { key: 'speaker', label: 'Speaker' },
];

// Click counter API — Lambda + DynamoDB behind API Gateway. Anyone with
// the URL can POST a slug; rate-limit/dedup is handled client-side via the
// per-session Set below so a refresh-spammer can't stack the chart.
const CLICK_API = 'https://sgwa5dhthk.execute-api.ap-southeast-1.amazonaws.com/';
const LOCAL_KEY = 'blog/clicks';
const SESSION_KEY = 'blog/posted-this-session';

function readLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') || {}; }
  catch { return {}; }
}
function writeLocal(obj) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(obj)); } catch {}
}
function postedSet() {
  try { return new Set(JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]')); }
  catch { return new Set(); }
}
function rememberPosted(slug) {
  const s = postedSet();
  s.add(slug);
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify([...s])); } catch {}
}

// Group a post's `labels` array (e.g. ["topic:agents", "format:podcast"]) by
// axis: { topic: ["agents"], format: ["podcast"], ... }
function groupLabels(labels = []) {
  const out = {};
  for (const lab of labels) {
    const i = lab.indexOf(':');
    if (i <= 0) continue;
    const axis = lab.slice(0, i);
    const value = lab.slice(i + 1);
    (out[axis] ||= []).push(value);
  }
  return out;
}

// Score a post by the reader's tag affinity — sum of *local* clicks across
// other posts they've opened that share at least one label with this one.
// We deliberately use local (per-reader) clicks here, not global counts:
// "For you" should reflect *this* reader's reading history, not crowd taste.
function affinityScore(post, localClicks, allPosts) {
  const myLabels = new Set(post.labels || []);
  if (myLabels.size === 0) return 0;
  let score = 0;
  for (const other of allPosts) {
    if (other.slug === post.slug) continue;
    const otherClicks = localClicks[other.slug] || 0;
    if (!otherClicks) continue;
    let overlap = 0;
    for (const lab of (other.labels || [])) {
      if (myLabels.has(lab)) overlap += 1;
    }
    score += otherClicks * overlap;
  }
  return score;
}


function FilterChip({ axis, value, count, active, onToggle }) {
  const cls = ['chip', 'sm', active ? 'solid' : ''].filter(Boolean).join(' ');
  return (
    <button
      type="button"
      className={cls}
      onClick={() => onToggle(axis, value)}
      style={{ marginRight: 6, marginBottom: 6 }}
    >
      {value} <span style={{ opacity: 0.6, marginLeft: 4 }}>{count}</span>
    </button>
  );
}


function FilterBar({ posts, selected, onToggle, onClear }) {
  // For each axis, count how many of the (currently visible) posts carry each label value.
  // We compute counts against ALL posts so chip counts are stable; selection
  // affects only which posts render.
  const counts = useMemo(() => {
    const out = {};
    for (const ax of AXES) out[ax.key] = {};
    for (const p of posts) {
      const g = groupLabels(p.labels);
      for (const ax of AXES) {
        for (const v of g[ax.key] || []) {
          out[ax.key][v] = (out[ax.key][v] || 0) + 1;
        }
      }
    }
    return out;
  }, [posts]);

  const anySelected = Object.values(selected).some((s) => s.size > 0);

  return (
    <div style={{ marginBottom: 18, paddingBottom: 14, borderBottom: 'var(--dash)' }}>
      {AXES.map((ax) => {
        const entries = Object.entries(counts[ax.key])
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        if (entries.length === 0) return null;
        return (
          <div key={ax.key} style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6 }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.55,
              minWidth: 64, textTransform: 'uppercase', letterSpacing: 1,
            }}>
              {ax.label}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {entries.map(([v, c]) => (
                <FilterChip
                  key={v}
                  axis={ax.key}
                  value={v}
                  count={c}
                  active={selected[ax.key]?.has(v)}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </div>
        );
      })}
      {anySelected && (
        <button
          type="button"
          className="chip sm"
          onClick={onClear}
          style={{ marginTop: 8, opacity: 0.7 }}
        >
          Clear filters ✕
        </button>
      )}
    </div>
  );
}


function BlogCard({ post, featured, globalCount, onClick }) {
  const cls = ['blog-post', featured ? 'feat' : '', post.image ? 'has-cover' : '']
    .filter(Boolean).join(' ');
  const langs = post.languages || ['en'];
  return (
    <Link
      to={`/blog/${post.slug}`}
      onClick={() => onClick(post.slug)}
      className={cls}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="when">
        {post.date}
        <div className="meta">
          {post.source ? 'via video' : ''}
          {langs.length > 1 && <span> · {langs.join('/').toUpperCase()}</span>}
          {globalCount > 0 && <span> · {globalCount} read{globalCount > 1 ? 's' : ''}</span>}
        </div>
      </div>
      <div className="body">
        <div className="ttl">{post.title_en}</div>
        {post.dek_en && <div className="dek">{post.dek_en}</div>}
        {(post.labels?.length > 0 || post.tags?.length > 0) && (
          <div className="tags">
            {(post.labels || []).map((l) => <Tag key={l}>{l}</Tag>)}
            {(post.tags || []).map((t) => <Tag key={t} body>{t}</Tag>)}
          </div>
        )}
      </div>
      {post.image && (
        <img
          className="cover"
          src={`${import.meta.env.BASE_URL.replace(/\/$/, '')}${post.image}`}
          alt=""
          loading="lazy"
        />
      )}
    </Link>
  );
}


export default function Blog() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({ topic: new Set(), format: new Set(), speaker: new Set() });
  const [sort, setSort] = useState('latest');
  const [localClicks, setLocalClicks] = useState(readLocal);
  const [globalCounts, setGlobalCounts] = useState({});

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}blog/posts.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setPosts)
      .catch((e) => setError(e.message));

    // Best-effort: pull global counts. Failure is silent — without it the
    // "Popular" sort just shows nothing and "N reads" hides on cards.
    fetch(CLICK_API)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && typeof data === 'object') setGlobalCounts(data); })
      .catch(() => {});
  }, []);

  function toggle(axis, value) {
    setSelected((prev) => {
      const next = { ...prev };
      const cur = new Set(prev[axis]);
      if (cur.has(value)) cur.delete(value); else cur.add(value);
      next[axis] = cur;
      return next;
    });
  }

  function clearAll() {
    setSelected({ topic: new Set(), format: new Set(), speaker: new Set() });
  }

  function trackClick(slug) {
    // Local: bumped immediately so "For you" reflects this read.
    const nextLocal = { ...localClicks, [slug]: (localClicks[slug] || 0) + 1 };
    setLocalClicks(nextLocal);
    writeLocal(nextLocal);
    // Global: optimistic UI bump, fire-and-forget POST. Throttled to one
    // POST per slug per session so reload-spam doesn't pollute the chart.
    setGlobalCounts((g) => ({ ...g, [slug]: (g[slug] || 0) + 1 }));
    if (!postedSet().has(slug)) {
      rememberPosted(slug);
      fetch(CLICK_API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug }),
        keepalive: true,
      }).catch(() => {});
    }
  }

  // Filter: AND across axes, OR within axis. An axis with no selected chips
  // doesn't constrain — empty selection means "show everything for this axis".
  const filtered = useMemo(() => {
    if (!posts) return null;
    return posts.filter((p) => {
      const g = groupLabels(p.labels);
      return AXES.every((ax) => {
        const sel = selected[ax.key];
        if (!sel || sel.size === 0) return true;
        const have = g[ax.key] || [];
        return have.some((v) => sel.has(v));
      });
    });
  }, [posts, selected]);

  const ordered = useMemo(() => {
    if (!filtered) return null;
    const arr = filtered.slice();
    if (sort === 'popular') {
      // Global counts — what every reader has clicked.
      arr.sort((a, b) =>
        (globalCounts[b.slug] || 0) - (globalCounts[a.slug] || 0)
        || (b.date || '').localeCompare(a.date || ''));
    } else if (sort === 'foryou') {
      // Local affinity — what *this* reader's history suggests.
      arr.sort((a, b) =>
        affinityScore(b, localClicks, posts) - affinityScore(a, localClicks, posts)
        || (b.date || '').localeCompare(a.date || ''));
    } else {
      arr.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    }
    return arr;
  }, [filtered, sort, globalCounts, localClicks, posts]);

  return (
    <div className="page">
      <Nav />
      <section className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <SectionHead num="01">Blog</SectionHead>
          {posts && posts.length > 0 && (
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 8px',
                background: 'transparent', border: 'var(--line)', borderRadius: 3,
              }}
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular (most reads)</option>
              <option value="foryou">For you</option>
            </select>
          )}
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16, fontFamily: 'var(--mono)' }}>
          Notes and summaries — auto-drafted from talks and papers, edited by hand.
        </div>

        {error && <div style={{ color: 'crimson' }}>Could not load posts: {error}</div>}
        {posts === null && !error && <div>Loading…</div>}

        {posts && posts.length > 0 && (
          <FilterBar
            posts={posts}
            selected={selected}
            onToggle={toggle}
            onClear={clearAll}
          />
        )}

        {ordered && ordered.length === 0 && (
          <div style={{ opacity: 0.6, fontFamily: 'var(--mono)', fontSize: 13 }}>
            No posts match the current filters.
          </div>
        )}

        {ordered && ordered.length > 0 && (
          <div>
            {ordered.map((p, i) => (
              <BlogCard
                key={p.slug}
                post={p}
                featured={i === 0 && sort === 'latest'}
                globalCount={globalCounts[p.slug] || 0}
                onClick={trackClick}
              />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
