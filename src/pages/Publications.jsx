import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import PageHead from '../components/PageHead.jsx';
import Seo from '../components/Seo.jsx';
import { Box, Chip, Note, Tag, Thumb } from '../components/primitives.jsx';
import { useStyleMode } from '../context/StyleCtx.jsx';
import { ALL_PUBS } from '../data.jsx';

/* ─── shared badge ──────────────────────────────────────────────── */
function PubBadge({ b }) {
  if (b.href) {
    return (
      <a href={b.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
        <Tag>{b.label}</Tag>
      </a>
    );
  }
  return <Tag>{b.label}</Tag>;
}

/* ─── Classic layout ─────────────────────────────────────────────── */
function YearHead({ y, count }) {
  return (
    <div className="year-head">
      <span className="yr">{y}</span>
      <span className="kicker">{count} ITEM{count !== 1 ? 'S' : ''}</span>
      <div className="rule" />
    </div>
  );
}

function ClassicPubItem({ id, thumb, title, authors, venue, year, badges, note }) {
  return (
    <div className="pub-item">
      <div className="pub-id">[{id}]</div>
      <Thumb label={thumb} w={110} h={78} />
      <div>
        <div className="pub-title-l">{title}</div>
        <div style={{ fontStyle: 'italic', marginTop: 3, opacity: 0.85, fontSize: 12.5 }}>{authors}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700 }}>{venue} · {year}</span>
          {badges?.map((b, i) => <PubBadge key={i} b={b} />)}
          {note && <Note>{note}</Note>}
        </div>
      </div>
    </div>
  );
}

function ClassicPublications({ byYear, years, kindCount }) {
  return (
    <>
      <PageHead
        kicker={`PUBLICATIONS · ${years[years.length - 1]} — ${years[0]}`}
        title={<span>Papers on code LLMs,<br />repair, & <u>trustworthy AI.</u></span>}
        blurb={<><b>Bold</b> author is me. {ALL_PUBS.length} papers across SE, ML, and security venues. For the work that grounds each paper, see <a href="/work">Work & Projects</a>.</>}
        right={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--mono)', fontSize: 10 }}>
            <div className="kicker">VIEW</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Chip sm solid>by year</Chip>
              <Chip sm href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ">scholar</Chip>
            </div>
          </div>
        }
      />
      <div className="pub-filter">
        <span style={{ opacity: 0.55 }}>filter →</span>
        <Tag>all ({ALL_PUBS.length})</Tag>
        <Tag>conference ({kindCount.conference || 0})</Tag>
        <Tag>journal ({kindCount.journal || 0})</Tag>
        <span style={{ opacity: 0.4, margin: '0 4px' }}>·</span>
        <Tag>code LLMs</Tag><Tag>program repair</Tag><Tag>AIGC detection</Tag><Tag>DL testing</Tag>
        <span style={{ marginLeft: 'auto', opacity: 0.55 }}>
          <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">↗ Google Scholar</a>
        </span>
      </div>
      <section className="content">
        {years.map((y) => (
          <React.Fragment key={y}>
            <YearHead y={y} count={byYear[y].length} />
            {byYear[y].map((p) => (
              <ClassicPubItem
                key={p.id}
                id={p.id}
                thumb={p.venue.split(' ')[0].toLowerCase()}
                title={p.title}
                authors={p.authors}
                venue={p.venue}
                year={p.year}
                badges={p.badges}
                note={p.note}
              />
            ))}
          </React.Fragment>
        ))}
        <Box dashed style={{ marginTop: 36, padding: 16, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 11, gap: 16, flexWrap: 'wrap' }}>
          <span>For older / co-authored work, see <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar</a>.</span>
          <span><a href="/data/JianWang_cv.pdf" target="_blank" rel="noreferrer">↓ cv.pdf</a></span>
        </Box>
      </section>
    </>
  );
}

/* ─── Academic layout ────────────────────────────────────────────── */
function AcademicPubEntry({ p }) {
  const firstLink = p.badges?.[0];
  return (
    <article className="pub-entry">
      <div className="pub-entry-title">
        {firstLink?.href
          ? <a href={firstLink.href} target="_blank" rel="noreferrer">{p.title}</a>
          : p.title}
        {p.note && <span className="pub-entry-feat">{p.note}</span>}
      </div>
      <div className="pub-entry-authors">{p.authors}</div>
      <div className="pub-entry-venue">{p.venue} · {p.year}</div>
      {p.badges && p.badges.length > 0 && (
        <div className="pub-entry-links">
          {p.badges.map((b, i) =>
            b.href
              ? <a key={i} href={b.href} target="_blank" rel="noreferrer" className="pub-entry-lnk">{b.label}</a>
              : <span key={i} className="pub-entry-lnk">{b.label}</span>
          )}
        </div>
      )}
    </article>
  );
}

function AcademicPublications({ byYear, years }) {
  return (
    <div className="pubs-page">
      {/* Left sidebar */}
      <div className="pubs-sidebar">
        <img
          src="/images/jornbowrl_circle.jpg"
          alt="Jian Wang"
          className="sidebar-avatar"
          onError={(e) => { e.currentTarget.src = '/images/headshot-ai.png'; e.currentTarget.onerror = null; }}
        />
        <h3 className="sidebar-name">Jian Wang</h3>
        <p className="sidebar-bio">
          PhD · NTU Singapore<br />
          Code LLM Security &amp; Program Repair
        </p>
        <div className="sidebar-links">
          <a href="mailto:jian004@e.ntu.edu.sg">Email</a>
          <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar</a>
          <a href="https://github.com/jianwang-ntu" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://twitter.com/jornbowrl" target="_blank" rel="noreferrer">Twitter</a>
          <a href="/data/JianWang_cv.pdf" target="_blank" rel="noreferrer">CV (PDF)</a>
        </div>
      </div>

      {/* Main publications list */}
      <div className="pubs-main">
        <h1 className="pubs-page-title">Publications</h1>
        <p className="pubs-intro">
          <b>Bold</b> author is me. {ALL_PUBS.length} papers across SE, ML, and security venues.{' '}
          See also <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar</a>.
        </p>

        {years.map((y) => (
          <React.Fragment key={y}>
            <h2 className="pubs-year-h">{y}</h2>
            {byYear[y].map((p) => <AcademicPubEntry key={p.id} p={p} />)}
          </React.Fragment>
        ))}

        <p style={{ marginTop: 36, fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.55, lineHeight: 1.6 }}>
          For older / co-authored work, see{' '}
          <a href="https://scholar.google.com/citations?hl=en&user=GAe_mJUAAAAJ" target="_blank" rel="noreferrer">Google Scholar</a>.{' '}·{' '}
          <a href="/data/JianWang_cv.pdf" target="_blank" rel="noreferrer">↓ cv.pdf</a>
        </p>
      </div>
    </div>
  );
}

/* ─── Page shell ──────────────────────────────────────────────────── */
export default function Publications() {
  const { mode } = useStyleMode();

  const byYear = {};
  ALL_PUBS.forEach((p) => { (byYear[p.year] = byYear[p.year] || []).push(p); });
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);
  const kindCount = ALL_PUBS.reduce((acc, p) => { acc[p.kind] = (acc[p.kind] || 0) + 1; return acc; }, {});

  return (
    <div className="page">
      <Seo
        title="Publications"
        description={`Peer-reviewed research and preprints by Jian Wang on code LLM security, fake-content detection, and program repair. ${ALL_PUBS.length} papers across SE, ML, and security venues.`}
        path="/pubs"
      />
      <Nav />
      {mode === 'academic'
        ? <AcademicPublications byYear={byYear} years={years} />
        : <ClassicPublications byYear={byYear} years={years} kindCount={kindCount} />
      }
      <Footer />
    </div>
  );
}
