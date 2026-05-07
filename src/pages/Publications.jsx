import React from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import PageHead from '../components/PageHead.jsx';
import Seo from '../components/Seo.jsx';
import { Box, Chip, Note, Tag, Thumb } from '../components/primitives.jsx';
import { ALL_PUBS } from '../data.jsx';

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

function YearHead({ y, count }) {
  return (
    <div className="year-head">
      <span className="yr">{y}</span>
      <span className="kicker">{count} ITEM{count !== 1 ? 'S' : ''}</span>
      <div className="rule" />
    </div>
  );
}

function PubItem({ id, thumb, title, authors, venue, year, badges, note }) {
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

export default function Publications() {
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
              <PubItem
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

      <Footer />
    </div>
  );
}
