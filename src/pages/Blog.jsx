import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import SiteFrame from '../components/SiteFrame.jsx';

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
  if (typeof window === 'undefined') return {};
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
      aria-pressed={active}
      onClick={() => onToggle(axis, value)}
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
    <div className="blog-filter-options">
      {AXES.map((ax) => {
        const entries = Object.entries(counts[ax.key])
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
        if (entries.length === 0) return null;
        return (
          <fieldset key={ax.key}>
            <legend>{ax.label}</legend>
            <div className="blog-filter-chips">
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
          </fieldset>
        );
      })}
      {anySelected && (
        <button
          type="button"
          className="chip sm"
          onClick={onClear}
        >
          Clear filters ✕
        </button>
      )}
    </div>
  );
}


function BlogCard({ post, globalCount, onClick }) {
  const langs = post.languages || ['en'];
  return (
    <article className="blog-entry">
      <p className="blog-entry-meta">
        <time dateTime={post.date}>{post.date}</time>
        {langs.length > 1 && <span> · EN / 中文</span>}
        {globalCount > 0 && <span> · {globalCount} reads</span>}
      </p>
      <h2><Link to={`/blog/${post.slug}`} onClick={() => onClick(post.slug)}>{post.title_en}</Link></h2>
      {post.dek_en && <p className="blog-entry-deck">{post.dek_en}</p>}
    </article>
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
      <Seo
        title="Blog"
        description="Notes and summaries on agents, harnesses, and engineering — auto-drafted from talks, papers, and posts; edited by hand."
        path="/blog"
      />
      <Nav skipToContent />
      <SiteFrame mainClassName="blog-index">
        <header>
          <h1 className="blog-page-title">Reading notes</h1>
          <p className="page-deck">Notes on talks, papers and posts by other researchers and practitioners.</p>
          <p className="text-index-intro">
            Drafted with AI assistance and edited by hand. For my own work, see the{' '}
            <Link to="/pubs">publications</Link> and <Link to="/statement">research statement</Link>.
          </p>
        </header>
        <div className="blog-toolbar">
          {posts && posts.length > 0 && (
            <details className="blog-filters">
              <summary>Filter notes{Object.values(selected).some(s => s.size > 0) ? ` (${Object.values(selected).reduce((n, s) => n + s.size, 0)} active)` : ''}</summary>
              <FilterBar posts={posts} selected={selected} onToggle={toggle} onClear={clearAll} />
            </details>
          )}
          {posts && posts.length > 0 && (
            <label className="blog-sort">Sort
            <select
              aria-label="Sort reading notes"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular (most reads)</option>
              <option value="foryou">For you</option>
            </select>
            </label>
          )}
        </div>

        {error && <div style={{ color: 'crimson' }}>Could not load posts: {error}</div>}
        {posts === null && !error && <div>Loading…</div>}

        {ordered && <p className="blog-result-count" role="status">{ordered.length} notes</p>}

        {ordered && ordered.length === 0 && (
          <p className="text-index-intro">
            No posts match the current filters.
          </p>
        )}

        {ordered && ordered.length > 0 && (
          <div>
            {ordered.map((p) => (
              <BlogCard
                key={p.slug}
                post={p}
                globalCount={globalCounts[p.slug] || 0}
                onClick={trackClick}
              />
            ))}
          </div>
        )}
      </SiteFrame>
      <Footer />
    </div>
  );
}
