// Public portfolio facts: existing publication records, the supplied biography,
// and resume evidence. Years for papers are publication years; industry spans
// identify the employment period, not a claimed project launch date.
export const ROOMS = [
  { id: 'code', number: '01', title: 'Code reliability', purpose: 'Repair programs. Test what models understand.', tone: 'blue' },
  { id: 'security', number: '02', title: 'AI security & testing', purpose: 'Study detection, robustness and model behaviour.', tone: 'purple' },
  { id: 'vision', number: '03', title: 'Applied generative AI', purpose: 'Turn vision models into consumer experiences.', tone: 'green' },
  { id: 'systems', number: '04', title: 'Production systems', purpose: 'Build the infrastructure that serves real users.', tone: 'orange' },
];

export const WORK_PROJECTS = [
  { id: 'defects4c', title: 'Defects4C', room: 'code', type: 'research', startYear: 2025, endYear: 2025,
    affiliation: 'SMU · NTU', venue: 'ASE 2025', status: 'Published', figure: 'defects4c', publication: 'defects4c',
    skills: ['C/C++', 'LLM evaluation', 'Benchmark design', 'Python'],
    summary: 'An executable benchmark for evaluating how well language models repair real C/C++ bugs.',
    detail: 'Pairs 350 curated bugs and vulnerabilities with reproduction tests, so repair can be judged against program behaviour. The study evaluates 24 large language models.',
    links: [{ label: 'Code & benchmark', href: 'https://github.com/defects4c/defects4c' }] },
  { id: 'tracewise', title: 'Execution-trace reasoning', room: 'code', type: 'research', startYear: 2025, endYear: 2025,
    affiliation: 'SMU · NTU', venue: 'EMNLP Findings 2025', status: 'Published', figure: 'tracewise', publication: 'code-semantics-execution-traces',
    skills: ['Execution tracing', 'LLM evaluation', 'SFT / PEFT', 'PyTorch', 'Python'],
    summary: 'A study of whether execution traces help code models reason about runtime behaviour.',
    detail: 'Integrates trace information into supervised fine-tuning and inference-time prompts. The paper reports limited usefulness in the settings studied, making the limits of execution evidence part of the result.',
    links: [{ label: 'Code', href: 'https://github.com/jianwang-ntu/tracewise_probing' }] },
  { id: 'ratchet', title: 'RATCHET', room: 'code', type: 'research', startYear: 2024, endYear: 2024,
    affiliation: 'NTU', venue: 'ISSRE 2024', status: 'Published', figure: 'ratchet', publication: 'ratchet',
    skills: ['Program repair', 'Retrieval', 'PyTorch', 'Python'],
    summary: 'Retrieval-augmented program repair, from fault localisation to patch generation.',
    detail: 'Combines a retrieval-augmented transformer with a BiLSTM fault localiser, exploring how relevant code context can support automated repair.',
    links: [{ label: 'Paper PDF', href: '/data/issre_RATCHET.pdf' }] },
  { id: 'aigc-code', title: 'AI-generated code detection', room: 'security', type: 'research', startYear: 2024, endYear: 2024,
    affiliation: 'NTU', venue: 'ASE 2024', status: 'Published', figure: 'aigcdet', publication: 'aigc-detectors-on-code',
    skills: ['AI security', 'LLM evaluation', 'Benchmark design', 'Python'],
    summary: 'Examines how detectors designed for generated prose behave on source code.',
    detail: 'A large-scale empirical evaluation of 13 detectors across code-related tasks. Studies detector behaviour on code rather than assuming that performance on prose transfers.',
    links: [{ label: 'Project website', href: 'https://sites.google.com/view/nlccd' }] },
  { id: 'fgvuldet', title: 'FGVulDet', room: 'security', type: 'research', startYear: 2024, endYear: 2024,
    affiliation: 'NTU', venue: 'LCTES 2024', status: 'Published', figure: 'fgvuldet', publication: 'fgvuldet',
    skills: ['AI security', 'Graph neural networks', 'Data augmentation'],
    summary: 'Fine-grained vulnerability detection with vulnerability-preserving data augmentation.',
    detail: 'Uses an edge-aware gated graph neural network and data augmentation to improve vulnerability detection. A collaborative research contribution.',
    links: [{ label: 'Paper', href: 'https://arxiv.org/abs/2404.09599' }] },
  { id: 'faire', title: 'Faire', room: 'security', type: 'research', startYear: 2023, endYear: 2023,
    affiliation: 'NTU', venue: 'ACM TOSEM 2023', status: 'Published', figure: 'faire', publication: 'faire',
    skills: ['AI security', 'Neural-network testing', 'Symbolic methods'],
    summary: 'Neural-network fairness repair through neuron condition synthesis.',
    detail: 'Studies interventions on internal neural-network behaviour to repair fairness defects. A collaborative research contribution.',
    links: [{ label: 'Paper', href: 'https://dl.acm.org/doi/10.1145/3617168' }] },
  { id: 'xiaomi-emoji', title: 'Xiaomi · GAN-generated emoji', room: 'vision', type: 'industry', startYear: 2017, endYear: 2019,
    affiliation: 'Xiaomi AI Lab', status: 'Published',
    skills: ['GANs', 'PyTorch', 'Computer vision', 'Model deployment'],
    summary: 'Personalised emoji and face cartoonisation from a selfie.',
    detail: 'Industry work on generative models for consumer handsets, balancing identity, style consistency and mobile deployment constraints.',
    links: [{ label: 'Visual case study', href: '/work/xiaomi-portrait-ai' }] },
  { id: 'xiaomi-portrait', title: 'Xiaomi · Portrait processing', room: 'vision', type: 'industry', startYear: 2017, endYear: 2019,
    affiliation: 'Xiaomi AI Lab', status: 'Published',
    skills: ['GANs', 'Computer vision', 'PyTorch', 'CUDA', 'ONNX', 'Model deployment'],
    summary: 'Portrait segmentation, background removal and the path from GPU training to on-device inference.',
    detail: 'Worked on portrait pipelines and model deployment, including quantisation, pruning and conversion for mobile inference.',
    links: [{ label: 'Visual case study', href: '/work/xiaomi-portrait-ai' }] },
  { id: '58-web', title: '58.com · Async web framework', room: 'systems', type: 'industry', startYear: 2011, endYear: 2017,
    affiliation: '58.com · Mobile Web', status: 'Published',
    skills: ['Backend systems', 'API design', 'MySQL / Redis', 'nginx / OpenResty'],
    summary: 'An asynchronous web framework serving 100M+ daily requests.',
    detail: 'Backend and mobile-web infrastructure spanning reusable middleware, common components and Nginx-level traffic routing.',
    links: [{ label: 'Systems case study', href: '/work/58-web-infrastructure' }] },
  { id: 'baidu-data', title: 'Baidu · Data pipelines', room: 'systems', type: 'industry', startYear: 2011, endYear: 2011,
    affiliation: 'Baidu · Internship', status: 'TODO',
    skills: ['Data engineering', 'Backend systems'],
    summary: 'Early production experience contributing to large-scale data pipelines.',
    detail: 'Data-engineering internship. Further project context will be added soon.', links: [] },
];

export const projectYears = [...new Set(WORK_PROJECTS.flatMap(p =>
  Array.from({ length: p.endYear - p.startYear + 1 }, (_, i) => p.startYear + i)
))].sort((a, b) => b - a);

export const projectSkills = [...new Set(WORK_PROJECTS.flatMap(p => p.skills))].sort();

export function filterProjects({ year = '', skill = '', type = '' } = {}) {
  return WORK_PROJECTS.filter(p =>
    (!year || (+year >= p.startYear && +year <= p.endYear)) &&
    (!skill || p.skills.includes(skill)) &&
    (!type || p.type === type)
  );
}

export function projectPeriod(p) {
  return p.startYear === p.endYear ? String(p.startYear) : `${p.startYear}–${p.endYear}`;
}
