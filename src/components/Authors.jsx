import React from 'react';
import { AUTHOR_LINKS } from '../data-pubs.js';

/* Renders an author list with per-author links where a homepage is known.
   Unknown co-authors render as plain text rather than a guessed URL. */
export default function Authors({ names, me = 'Wang J.' }) {
  return (
    <span className="ap-authors">
      {names.map((n, i) => {
        const href = AUTHOR_LINKS[n];
        const self = n === me;
        const label = self ? <b>{n}</b> : n;
        return (
          <React.Fragment key={n + i}>
            {href
              ? <a href={href} className={self ? 'ap-author ap-author-me' : 'ap-author'}
                   {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a>
              : <span className={self ? 'ap-author-me' : undefined}>{label}</span>}
            {i < names.length - 1 && ', '}
          </React.Fragment>
        );
      })}
    </span>
  );
}
