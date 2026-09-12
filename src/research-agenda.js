// Interpretive links to proposed work, not claims that these papers evaluate agents.
export const PUBLICATION_CONNECTIONS = {
  ratchet: {
    label: 'From patch generation to a maintenance workflow',
    section: 'from-patches-to-maintenance',
    connection: 'Fault localisation and retrieval-based patch generation provide a starting capability for a maintenance agent.',
    boundary: 'RATCHET evaluates program repair. Persistent state, tool use and recovery across a workflow remain new experiments.',
  },
  defects4c: {
    label: 'From executable bugs to outcome-based agent evaluation',
    section: 'from-patches-to-maintenance',
    connection: 'Reproducible C/C++ bugs and tests provide a starting point for checking the effects of a repair workflow.',
    boundary: 'Extending these tasks to multi-step maintenance needs new protocols and held-out checks. Passing the available tests alone does not establish correctness.',
  },
  'code-semantics-execution-traces': {
    label: 'Which execution evidence helps an agent act correctly?',
    section: 'assured-agency',
    connection: 'The limited gains from adding traces motivate testing when an observation actually improves a decision or exposes a failure.',
    boundary: 'This is a lesson for experimental design, not evidence that trace-augmented agents are reliable.',
  },
  'aigc-detectors-on-code': {
    label: 'Check evaluation signals when tasks and models change',
    section: 'published-foundations',
    connection: 'The detector study motivates revalidating evaluation signals when moving between tasks, models and domains.',
    boundary: 'Authorship detection does not measure code correctness, tool-use safety or delegated authority. Its connection to the agent agenda is methodological.',
  },
};

// Existing bookmarks are redirected to the section that absorbs their topic.
export const STATEMENT_ALIASES = {
  'two-directions-and-a-shared-foundation': 'research-path',
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
  'independent-evidence-and-controlled-adaptation': 'assured-agency',
  'outcome-verification': 'from-patches-to-maintenance',
  'failure-attribution-and-recovery': 'assured-agency',
  'evaluated-capability-and-coordination-updates': 'assured-agency',
  'a-staged-research-program-2026-2029': 'evaluation-and-milestones',
  'selected-research-foundations': 'published-foundations',
  'research-status': 'evaluation-and-milestones',
  'research-background': 'published-foundations',
  'code-trustworthiness': 'published-foundations',
  'code-detection': 'published-foundations',
  'long-horizon': 'from-patches-to-maintenance',
  'research-overview': 'research-path',
};

export function resolveStatementHash(hash) {
  const id = hash.replace(/^#/, '');
  return Object.hasOwn(STATEMENT_ALIASES, id) ? STATEMENT_ALIASES[id] : null;
}
