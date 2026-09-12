import React from 'react';
import { Link } from 'react-router-dom';
import overviewUrl from '../assets/trustworthy_agent_networks.svg';
import { resolveStatementHash } from '../research-agenda.js';

// Coordinates use the original artwork's viewBox, so links scale with the image.
const regions = [
  { id: 'essay-i-assured-agency', label: 'Assured agency', box: [117, 131, 545, 221] },
  { id: 'persistent-mandates-state-and-commitments', label: 'Persistent mandates, state and commitments', box: [117, 365, 545, 56] },
  { id: 'authorized-execution-and-recovery', label: 'Authorized execution and recovery', box: [98, 430, 583, 56] },
  { id: 'capability-growth-under-live-obligations', label: 'Capability growth under live obligations', box: [81, 495, 618, 56] },
  { id: 'essay-ii-collective-agency', label: 'Collective agency', box: [991, 131, 545, 221] },
  { id: 'limited-group-representation', label: 'Limited group representation', box: [991, 365, 545, 56] },
  { id: 'private-coordination-and-conditional-commitments', label: 'Private coordination and conditional commitments', box: [972, 430, 583, 56] },
  { id: 'delivery-exit-and-shared-accountability', label: 'Delivery, exit and shared accountability', box: [955, 495, 618, 56] },
  { id: 'independent-evidence-and-controlled-adaptation', label: 'Independent evidence and controlled adaptation', box: [145, 630, 1380, 74] },
  { id: 'outcome-verification', label: 'Outcome verification', box: [150, 710, 435, 80] },
  { id: 'failure-attribution-and-recovery', label: 'Failure attribution and recovery', box: [588, 710, 482, 80] },
  { id: 'evaluated-capability-and-coordination-updates', label: 'Evaluated capability and coordination updates', box: [1074, 710, 450, 80] },
];

export default function ResearchOverview() {
  return (
    <figure className="research-overview" id="network-overview">
      <svg viewBox="0 0 1672 940" width="1672" height="940" role="group"
        aria-label="Interactive overview of trustworthy agent networks">
        <title>Trustworthy Agent Networks</title>
        <desc>Assured agency and collective agency share a foundation of independent evidence and controlled adaptation. Select a heading or topic box to read its statement section.</desc>
        <image href={overviewUrl} width="1672" height="940" aria-hidden="true" />
        {regions.map(({ id, label, box: [x, y, width, height] }) => (
          <Link key={id} to={`/statement#${resolveStatementHash(id) || id}`} aria-label={`Read about ${label}`}>
            <title>{label}</title>
            <rect className="research-overview-region" x={x} y={y} width={width} height={height} rx="4" />
          </Link>
        ))}
      </svg>
      <figcaption>
        <span>V4 network vision. Topics link to the focused sections that absorb them.</span>
        <a href={overviewUrl} target="_blank" rel="noreferrer">Open full-size overview ↗</a>
      </figcaption>
    </figure>
  );
}
