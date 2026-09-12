// Interpretive links to proposed work, not claims that these papers evaluate agents.
export const PUBLICATION_CONNECTIONS = {
  ratchet: {
    label: 'How can an agent diagnose failure and recover?',
    section: 'assured-agency',
    connection: 'Fault localisation and retrieval-based repair contribute methods for diagnosing failure and constructing corrective actions.',
    boundary: 'The agent agenda extends this experience to recovery under changing authority and commitments, which RATCHET does not evaluate.',
  },
  defects4c: {
    label: 'From executable bugs to outcome-based agent evaluation',
    section: 'independent-evidence-and-controlled-adaptation',
    connection: 'Reproducible C/C++ bugs and tests contribute an approach to observing effects and evaluating whether a corrective action works.',
    boundary: 'Agent contributions need their own acceptance evidence and evaluation protocols. Available tests provide evidence with limited coverage.',
  },
  'code-semantics-execution-traces': {
    label: 'Which execution evidence helps an agent act correctly?',
    section: 'independent-evidence-and-controlled-adaptation',
    connection: 'The limited gains from adding traces motivate testing when an observation actually improves a decision or exposes a failure.',
    boundary: 'This is a lesson for experimental design, not evidence that trace-augmented agents are reliable.',
  },
  'aigc-detectors-on-code': {
    label: 'Check evaluation signals when tasks and models change',
    section: 'independent-evidence-and-controlled-adaptation',
    connection: 'The detector study motivates revalidating evaluation signals when moving between tasks, models and domains.',
    boundary: 'Authorship detection does not measure code correctness, tool-use safety or delegated authority. Its connection to the agent agenda is methodological.',
  },
};

// Existing bookmarks are redirected to the section that absorbs their topic.
export const STATEMENT_ALIASES = {
  'two-directions-and-a-shared-foundation': 'network-overview',
  'essay-i-assured-agency': 'assured-agency',
  'persistent-mandates-state-and-commitments': 'assured-agency',
  'authorized-execution-and-recovery': 'assured-agency',
  'capability-growth-under-live-obligations': 'assured-agency',
  'hypothesis-and-evidence': 'evaluation-and-milestones',
  'essay-ii-collective-agency': 'collective-agency',
  'limited-group-representation': 'collective-agency',
  'private-coordination-and-conditional-commitments': 'collective-agency',
  'delivery-exit-and-shared-accountability': 'collective-agency',
  'hypothesis-and-evidence-2': 'evaluation-and-milestones',
  'outcome-verification': 'independent-evidence-and-controlled-adaptation',
  'failure-attribution-and-recovery': 'independent-evidence-and-controlled-adaptation',
  'evaluated-capability-and-coordination-updates': 'independent-evidence-and-controlled-adaptation',
  'a-staged-research-program-2026-2029': 'evaluation-and-milestones',
  'selected-research-foundations': 'published-foundations',
  'research-status': 'evaluation-and-milestones',
  'research-background': 'published-foundations',
  'code-trustworthiness': 'published-foundations',
  'code-detection': 'published-foundations',
  'long-horizon': 'assured-agency',
  'from-patches-to-maintenance': 'published-foundations',
  'research-overview': 'network-overview',
};

export function resolveStatementHash(hash) {
  const id = hash.replace(/^#/, '');
  return Object.hasOwn(STATEMENT_ALIASES, id) ? STATEMENT_ALIASES[id] : null;
}
