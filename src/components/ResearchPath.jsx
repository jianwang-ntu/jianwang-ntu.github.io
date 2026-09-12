import React from 'react';
import { Link } from 'react-router-dom';

export default function ResearchPath() {
  return <figure className="research-path" id="research-path" tabIndex={-1} aria-label="How published research informs the future agenda">
    <figcaption>How earlier work informs the agenda</figcaption>
    <ol className="research-path-stages">
      <li>
        <span className="path-stage-label">Published research</span>
        <h3><Link to="/pubs">Repair, detection & testing</Link></h3>
        <p>Locate failures, construct repairs and evaluate model behaviour.</p>
        <div className="path-papers"><Link to="/pubs/ratchet">RATCHET</Link><Link to="/pubs/defects4c">Defects4C</Link></div>
      </li>
      <li>
        <span className="path-stage-label">Transferable methods</span>
        <h3><Link to="/statement#independent-evidence-and-controlled-adaptation">Evidence & diagnosis</Link></h3>
        <p>Observe effects, test evaluation signals and assess whether a repair improves outcomes.</p>
        <Link className="path-next" to="/statement#independent-evidence-and-controlled-adaptation">The shared foundation ↗</Link>
      </li>
      <li>
        <span className="path-stage-label">Future research</span>
        <h3><Link to="/statement#network-overview">Trustworthy agent networks</Link></h3>
        <p>Study accountable representation, cooperation and adaptation across independent owners.</p>
        <div className="path-papers"><Link to="/statement#assured-agency">Assured agency</Link><Link to="/statement#collective-agency">Collective agency</Link></div>
      </li>
    </ol>
  </figure>;
}
