// Interpretive links to proposed work, not claims that these papers evaluate agents.
export const PUBLICATION_CONNECTIONS = {
  ratchet: {
    label: 'Which feedback changes improve later agent behaviour?',
    section: 'ii-safety-preserving-learning-and-feedback',
    connection: 'Retrieval-based repair contributes experience with learning corrective actions from relevant prior cases.',
    boundary: 'RATCHET evaluates program repair, not safety retention through agent post-training. The connection is methodological.',
  },
  defects4c: {
    label: 'From executable bugs to outcome-based agent evaluation',
    section: 'appendix-a-execution-evidence-and-a-staged-program',
    connection: 'Reproducible C/C++ bugs and tests contribute an approach to observing effects and evaluating whether a corrective action works.',
    boundary: 'Agent contributions need their own acceptance evidence and evaluation protocols. Available tests provide evidence with limited coverage.',
  },
  'code-semantics-execution-traces': {
    label: 'Which evidence changes an oversight decision?',
    section: 'i-scalable-oversight-under-adaptation',
    connection: 'The limited gains from adding traces motivate testing when an observation actually improves a decision or exposes a failure.',
    boundary: 'This is a lesson for experimental design, not evidence that trace-augmented agents are reliable.',
  },
  'aigc-detectors-on-code': {
    label: 'Test whether safety signals survive model and task changes',
    section: 'ii-safety-preserving-learning-and-feedback',
    connection: 'The detector study motivates revalidating evaluation signals when moving between tasks, models and domains.',
    boundary: 'Authorship detection does not measure code correctness, tool-use safety or delegated authority. Its connection to the agent agenda is methodological.',
  },
};

// Existing bookmarks are redirected to the section that absorbs their topic.
export const STATEMENT_ALIASES = {
  'two-directions-and-a-shared-foundation': 'research-overview',
  'network-overview': 'research-overview',
  'essay-i-assured-agency': 'iii-control-across-time-and-delegation',
  'assured-agency': 'iii-control-across-time-and-delegation',
  'persistent-mandates-state-and-commitments': 'iii-control-across-time-and-delegation',
  'authorized-execution-and-recovery': 'iii-control-across-time-and-delegation',
  'capability-growth-under-live-obligations': 'ii-safety-preserving-learning-and-feedback',
  'essay-ii-collective-agency': 'iii-control-across-time-and-delegation',
  'collective-agency': 'iii-control-across-time-and-delegation',
  'limited-group-representation': 'iii-control-across-time-and-delegation',
  'private-coordination-and-conditional-commitments': 'iii-control-across-time-and-delegation',
  'delivery-exit-and-shared-accountability': 'iii-control-across-time-and-delegation',
  'long-horizon': 'iii-control-across-time-and-delegation',
  'outcome-verification': 'i-scalable-oversight-under-adaptation',
  'failure-attribution-and-recovery': 'i-scalable-oversight-under-adaptation',
  'independent-evidence-and-controlled-adaptation': 'i-scalable-oversight-under-adaptation',
  'evaluated-capability-and-coordination-updates': 'ii-safety-preserving-learning-and-feedback',
  'hypothesis-and-evidence': 'appendix-a-execution-evidence-and-a-staged-program',
  'hypothesis-and-evidence-2': 'appendix-a-execution-evidence-and-a-staged-program',
  'a-staged-research-program-2026-2029': 'appendix-a-execution-evidence-and-a-staged-program',
  'evaluation-and-milestones': 'appendix-a-execution-evidence-and-a-staged-program',
  'research-status': 'appendix-a-execution-evidence-and-a-staged-program',
  'selected-research-foundations': 'how-my-existing-methods-carry-forward',
  'published-foundations': 'how-my-existing-methods-carry-forward',
  'research-background': 'research-foundation-and-approach',
  'research-path': 'research-foundation-and-approach',
  'code-trustworthiness': 'how-my-existing-methods-carry-forward',
  'code-detection': 'how-my-existing-methods-carry-forward',
  'from-patches-to-maintenance': 'how-my-existing-methods-carry-forward',
};

export function resolveStatementHash(hash) {
  const id = hash.replace(/^#/, '');
  return Object.hasOwn(STATEMENT_ALIASES, id) ? STATEMENT_ALIASES[id] : null;
}
