import React from 'react';
import { Link } from 'react-router-dom';

export default function ResearchPath() {
  return <figure className="research-path" id="research-path" tabIndex={-1} aria-label="From published code research to proposed agent research">
    <figcaption>From existing work to the next research question</figcaption>
    <ol className="research-path-stages">
      <li>
        <span className="path-stage-label">01 · Published foundation</span>
        <h3><Link to="/statement#published-foundations">Repair & evaluate code</Link></h3>
        <p>Generate patches. Reproduce faults. Test the limits of model evidence.</p>
        <div className="path-papers"><Link to="/pubs/ratchet">RATCHET</Link><Link to="/pubs/defects4c">Defects4C</Link></div>
      </li>
      <li>
        <span className="path-stage-label">02 · Proposed bridge</span>
        <h3><Link to="/statement#from-patches-to-maintenance">Multi-step maintenance</Link></h3>
        <p>Inspect → patch → test → revise. Check the outcome of the whole workflow.</p>
        <Link className="path-next" to="/statement#from-patches-to-maintenance">From a patch to a sequence ↗</Link>
      </li>
      <li>
        <span className="path-stage-label">03 · Core research question</span>
        <h3><Link to="/statement#assured-agency">Assured agency</Link></h3>
        <p>When code, tools or permissions change, which checks must be repeated?</p>
        <Link className="path-next" to="/statement#assured-agency">Revalidate, continue or recover ↗</Link>
      </li>
    </ol>
    <div className="research-path-horizon">
      <span className="path-horizon-arrow" aria-hidden="true">↓</span>
      <div><span className="path-stage-label">Longer term · conditional on earlier evidence</span>
        <h3><Link to="/statement#collective-agency">Collective agency across owners</Link></h3>
        <p>Extend from one maintainer to dependent work across separately governed repositories.</p></div>
    </div>
  </figure>;
}
