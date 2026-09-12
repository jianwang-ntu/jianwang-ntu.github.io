import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Seo from '../components/Seo.jsx';
import ProjectMap from '../components/ProjectMap.jsx';
import Figure from '../components/figures.jsx';
import ResearchConnection from '../components/ResearchConnection.jsx';
import { WORK } from '../data.jsx';
import { ROOMS, WORK_PROJECTS, projectYears, projectSkills, filterProjects, projectPeriod } from '../data-work.js';

export default function WorkProjects() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const filters = { type: params.get('type') || '', year: params.get('year') || '', skill: params.get('skill') || '' };
  const projects = filterProjects(filters);
  const filtered = Object.values(filters).some(Boolean);
  function updateFilter(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value); else next.delete(name);
    navigate({ pathname: '/work', search: next.toString(), hash: '#project-index' });
  }
  function clearFilters() {
    navigate('/work#project-index');
  }
  return <div className="page">
    <Seo title="Work & Projects" description="Research artifacts and industry projects by Jian Wang, indexed by year, skill and project room." path="/work" />
    <Nav skipToContent />
    <main id="main-content" className="portfolio-wide">
      <p className="portfolio-eyebrow">From research to working systems</p>
      <div className="work-heading"><div><h1>Work & projects</h1>
        <p className="page-deck">Different rooms. A shared interest in reliable systems.</p></div>
        <Link className="text-link" to="/cv">Experience & CV ↗</Link></div>
      <p className="work-intro">Explore the map, or find a project by year and skill. Research entries link to
        their papers and artifacts; industry entries describe work in production.
        The <Link to="/statement#published-foundations">research statement</Link> explains how these methods and
        experiences inform the future agenda.</p>
      <section className="work-rooms" id="project-rooms" aria-labelledby="project-rooms-title">
      <header className="work-rooms-heading">
        <p className="portfolio-eyebrow">Explore by function</p>
        <h2 id="project-rooms-title">The project rooms</h2>
        <p>Four areas of work, with the projects and evidence inside each.</p>
      </header>
      <ProjectMap />
      <section className="project-index" id="project-index" aria-labelledby="index-title">
        <div className="section-heading"><h3 id="index-title">Project index</h3>
          <a className="text-link" href="#career">Career timeline ↓</a></div>
        <div className="project-filters">
          <label>Type<select value={filters.type} onChange={e => updateFilter('type', e.target.value)}>
            <option value="">All work</option><option value="research">Research</option><option value="industry">Industry</option>
          </select></label>
          <label>Year<select value={filters.year} onChange={e => updateFilter('year', e.target.value)}>
            <option value="">All years</option>{projectYears.map(year => <option key={year} value={year}>{year}</option>)}
          </select></label>
          <label className="skill-filter">Skill<select value={filters.skill} onChange={e => updateFilter('skill', e.target.value)}>
            <option value="">All skills</option>{projectSkills.map(skill => <option key={skill}>{skill}</option>)}
          </select></label>
          {filtered && <button className="clear-filters" onClick={clearFilters}>Clear filters</button>}
        </div>
        <p className="filter-result" role="status">{projects.length} of {WORK_PROJECTS.length} projects · Paper years are publication years; industry years show the role period.</p>
        {projects.length === 0 && <div className="empty-projects"><h3>No projects match these filters.</h3>
          <p>Try another year or skill, or <button onClick={clearFilters}>show all projects</button>.</p></div>}
        {ROOMS.map(room => {
          const entries = projects.filter(p => p.room === room.id);
          if (!entries.length) return null;
          return <section key={room.id} id={`room-${room.id}`} className={`project-room tone-${room.tone}`} tabIndex={-1}>
            <header className="room-section-heading"><span>{room.number}</span><div>
              <h4><Link to={`/work#room-${room.id}`}>{room.title}</Link></h4><p>{room.purpose}</p>
            </div><a className="back-to-map" href="#project-rooms">Map ↑</a></header>
            {entries.map(p => <article id={p.id} key={p.id} className="project-entry" tabIndex={-1}>
              <div className="project-entry-meta"><span className={`project-type ${p.type}`}>{p.type === 'research' ? 'Research' : 'Industry'}</span>
                <span>{projectPeriod(p)}</span><span>{p.venue || p.affiliation}</span>
                {p.status === 'TODO' && <span className="todo-badge">TODO · Case study coming soon</span>}</div>
              <h5><Link to={`/work#${p.id}`}>{p.title}</Link></h5>
              <p className="project-summary">{p.summary}</p>
              <p className="project-detail">{p.detail}</p>
              {p.publication && <ResearchConnection publication={p.publication} compact />}
              <div className="project-skills" aria-label={`${p.title} skills`}>{p.skills.map(skill =>
                <Link key={skill} to={`/work?skill=${encodeURIComponent(skill)}#project-index`}>{skill}</Link>)}</div>
              <div className="project-resources">
                {p.publication && <Link to={`/pubs/${p.publication}`}>Publication details ↗</Link>}
                {p.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
              </div>
              {p.figure && <details className="project-figure"><summary>View research figure</summary><Figure id={p.figure} /></details>}
            </article>)}
          </section>;
        })}
      </section>
      </section>
      <section id="career" className="career-timeline" tabIndex={-1}>
        <div className="section-heading"><h2>Career timeline</h2><Link className="text-link" to="/cv">Full CV ↗</Link></div>
        <p className="filter-result">Employment and research roles, separate from publication dates.</p>
        {WORK.map((w, i) => <div className="career-row" key={i}>
          <span className="career-period">{w.year}</span><div><span className="small-label">{w.kind}</span>
            <h3>{w.role}</h3><p>{w.where}</p>
            {w.kind === 'INDUSTRY' && <Link to={`/work#room-${w.where.startsWith('Xiaomi') ? 'vision' : 'systems'}`}>Related project room ↑</Link>}
          </div></div>)}
      </section>
    </main><Footer />
  </div>;
}
