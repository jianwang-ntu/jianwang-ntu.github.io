import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  'i-scalable-oversight-under-adaptation',
  'ii-safety-preserving-learning-and-feedback',
  'iii-control-across-time-and-delegation',
];
const regions = [
  ['Human–agent interaction: oversight before action', 0, 20, 110, 697, 242],
  ['Agent–agent collaboration: delegated workflow authorization', 2, 732, 110, 696, 242],
  ...[0, 1, 2].flatMap(i => [
    [`Human–agent ${['action assurance', 'safety retention', 'workflow control'][i]}`, i, 31, 360 + i * 64, 673, 54],
    [`Agent–agent ${['action assurance', 'safety retention', 'workflow control'][i]}`, i, 745, 360 + i * 64, 672, 54],
  ]),
  ['Shared human-approved requirements: oversight before action', 0, 20, 568, 1408, 90],
  ['Action assurance: oversight before action', 0, 20, 724, 369, 126],
  ['Safety retention: preserving safety through continual updates', 1, 534, 724, 380, 126],
  ['Workflow control: authorization across delegated workflows', 2, 1058, 724, 370, 126],
  ['Assumptions behind formal assurance', 0, 245, 970, 1000, 70],
];

export default function LinkedResearchImage({ loading }) {
  return <div className="linked-research-image">
    <img className="home-research-image" src="/images/research/reliable-agents-human-control.svg"
      width="1448" height="1086" loading={loading} decoding="async"
      alt="Reliable AI agents under human control: human–agent interaction and agent–agent collaboration share approved requirements for action assurance, safety retention, and workflow control." />
    {regions.map(([label, section, x, y, width, height]) =>
      <Link key={label} className="research-image-link" aria-label={label} title={label}
        to={`/statement#${sections[section]}`}
        style={{ left: `${x / 1448 * 100}%`, top: `${y / 1086 * 100}%`, width: `${width / 1448 * 100}%`, height: `${height / 1086 * 100}%` }} />)}
  </div>;
}
