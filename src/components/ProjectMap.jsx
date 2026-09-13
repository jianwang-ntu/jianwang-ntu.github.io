import React from 'react';
import { Link } from 'react-router-dom';
import { ROOMS, WORK_PROJECTS } from '../data-work.js';

export default function ProjectMap() {
  return (
    <div className="project-map">
      <div className="map-caption"><span>FOUR ROOMS · RESEARCH & INDUSTRY</span><span>Choose a room or a project ↓</span></div>
      <svg className="work-map-svg" viewBox="0 0 800 470" role="group" aria-labelledby="map-title map-description">
        <title id="map-title">A floor plan of the project rooms</title>
        <desc id="map-description">Four rooms connect skills to research and industry projects. Each room title and project is a link to its detail section below.</desc>
        <defs><pattern id="floor-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8edef" strokeWidth="1" /></pattern></defs>
        <rect width="800" height="470" rx="6" fill="url(#floor-grid)" />
        <path d="M400 24V446M24 235H776" stroke="#c9d4d8" strokeWidth="1.5" strokeDasharray="4 6" />
        <rect x="326" y="220" width="148" height="30" rx="15" fill="#fff" stroke="#d7e0e3" />
        <text x="400" y="239" textAnchor="middle" className="map-corridor">RESEARCH ↔ PRACTICE</text>
        {ROOMS.map((room, index) => {
          const x = index % 2 ? 424 : 24;
          const y = index < 2 ? 20 : 262;
          const projects = WORK_PROJECTS.filter(p => p.room === room.id);
          return <g key={room.id} className={`map-room tone-${room.tone}`}>
            <rect x={x} y={y} width="352" height="188" rx="3" className="room-outline" />
            <path d={`M${x + 144} ${y + 188}h48`} stroke="#fafcfc" strokeWidth="5" />
            <Link to={`/work#room-${room.id}`} className="map-room-heading" aria-label={`Room ${room.number}: ${room.title}`}>
              <rect x={x + 12} y={y + 12} width="328" height="40" rx="3" className="map-hit" />
              <circle cx={x + 33} cy={y + 31} r="15" className="room-number" />
              <text x={x + 33} y={y + 36} textAnchor="middle" className="map-number">{room.number}</text>
              <text x={x + 58} y={y + 36} className="map-title">{room.title}</text>
              <text x={x + 328} y={y + 36} className="map-arrow">↗</text>
            </Link>
            <text x={x + 22} y={y + 69} className="map-type">{index < 2 ? 'RESEARCH · PAPER ARTIFACTS' : 'INDUSTRY · PROJECT RECORDS'}</text>
            {projects.map((p, i) => <Link key={p.id} to={`/work#${p.id}`} className="map-project" aria-label={`View ${p.title}`}>
              <rect x={x + 16} y={y + 82 + i * 30} width="320" height="27" rx="2" className="map-hit" />
              <text x={x + 25} y={y + 100 + i * 30} className="map-label">{p.title}</text>
              <text x={x + 316} y={y + 100 + i * 30} className="map-arrow">→</text>
            </Link>)}
          </g>;
        })}
      </svg>
      <nav className="work-map-list" aria-label="Project rooms">
        {ROOMS.map(room => <div key={room.id} className={`mobile-room tone-${room.tone}`}>
          <Link className="mobile-room-title" to={`/work#room-${room.id}`}>{room.number} · {room.title} ↗</Link>
          {WORK_PROJECTS.filter(p => p.room === room.id).map(p => <Link to={`/work#${p.id}`} key={p.id}>{p.title} →</Link>)}
        </div>)}
      </nav>
    </div>
  );
}
