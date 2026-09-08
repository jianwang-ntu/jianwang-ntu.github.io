/* Per-publication detail: linked authors, one-line brief, abstract and BibTeX.
   Kept separate from data.jsx so the existing classic/academic author JSX stays
   untouched. `abstract` is present only where the paper PDF is openly reachable;
   the rest are null until those PDFs are available (ACM DL / AAAI OJS). */

/* Author homepages. Only entries with a source I can point at are listed —
   an invented URL would misattribute a real person, so unknown co-authors
   render as plain text. Add entries here and they become links everywhere. */
export const AUTHOR_LINKS = {
  'Wang J.': '/home',
  'Li Y.': 'https://personal.ntu.edu.sg/yi_li/',
};

export const PUB_META = {
  C6: {
    key: "trustworthy-ai-assisted-programming",
    authors: ["Wang J."],
    brief: "A thesis summary tying vulnerability detection, AI-generated-code detection and automated repair into a single account of what makes AI-written code trustworthy.",
    abstract: null,
    bibtex: "@inproceedings{wang2026trustworthy,\n  author = {Wang J.},\n  title = {Trustworthy AI-Assisted Programming: Detection and Repair of Unreliable Code},\n  booktitle = {AAAI},\n  year = {2026}\n}",
  },
  C5: {
    key: "defects4c",
    authors: ["Wang J.", "Xie X.", "Hu Q.", "Liu S.", "Yu J.", "Kong J.", "Li Y."],
    brief: "Distils 38M+ commits down to 350 expert-validated, buildable C/C++ bugs, then measures how well 24 LLMs actually repair them.",
    abstract: "Automated Program Repair (APR) plays a critical role in enhancing the quality and reliability of software systems. While substantial progress has been made in Java-based APR, largely facilitated by benchmarks like Defects4J, there remains a significant gap in research on C/C++ program repair, despite the widespread use of C/C++ and the prevalence of associated vulnerabilities. This gap is primarily due to the lack of high-quality, open-source benchmarks tailored for C/C++. To address this issue, we introduce Defects4C, a comprehensive and executable benchmark specifically designed for C/C++ program repair. Our dataset is constructed from real-world C/C++ repositories and includes a large collection of bug-relevant commits (9M in total), 248 high-quality buggy functions, and 102 vulnerable functions, all paired with test cases for reproduction. These resources enable rigorous evaluation of repair techniques and support the retraining of learning-based approaches for enhanced performance. Using Defects4C, we conduct a comprehensive empirical study evaluating the effectiveness of 24 state-of-the-art large language models (LLMs) in repairing C/C++ faults. Our findings offer valuable insights into the strengths and limitations of current LLM-based APR techniques in this domain, highlighting both the need for more robust methods and the critical role of Defects4C in advancing future research.",
    bibtex: "@inproceedings{wang2025defects4c,\n  author = {Wang J. and Xie X. and Hu Q. and Liu S. and Yu J. and Kong J. and Li Y.},\n  title = {Defects4C: Benchmarking Large Language Model Repair Capability with C/C++ Bugs},\n  booktitle = {ASE},\n  year = {2025}\n}",
  },
  C4: {
    key: "code-semantics-execution-traces",
    authors: ["Wang J.", "Xie X.", "Hu Q.", "Liu S.", "Li Y."],
    brief: "Asks whether feeding real execution traces to Code LLMs helps \u2014 injecting them both during fine-tuning and at inference, then measuring the difference.",
    abstract: "Code Large Language Models (Code LLMs) have opened a new era in programming with their impressive capabilities. However, recent research has revealed critical limitations in their ability to reason about runtime behavior and understand the actual functionality of programs, which poses significant challenges for their post-training and practical deployment. Specifically, Code LLMs encounter two principal issues: (1) a lack of proficiency in reasoning about program execution behavior, as they struggle to interpret what programs actually do during runtime, and (2) the inconsistent and fragmented representation of semantic information, such as execution traces, across existing methods, which hinders their ability to generalize and reason effectively. These challenges underscore the necessity for more systematic approaches to enhance the reasoning capabilities of Code LLMs. To address these issues, we introduce a generic framework to support integrating semantic information (e.g., execution trace) to code task-relevant prompts, and conduct a comprehensive study to explore the role of semantic information in enhancing the reasoning ability of Code LLMs accordingly. Specifically, we focus on investigating the usefulness of trace-based semantic information in boosting supervised fine-tuning (SFT) and post-phase inference of Code LLMs. The experimental results surprisingly disagree with previous works and demonstrate that semantic information has limited usefulness for SFT and test time scaling of Code LLM.",
    bibtex: "@inproceedings{wang2025code,\n  author = {Wang J. and Xie X. and Hu Q. and Liu S. and Li Y.},\n  title = {Do Code Semantics Help? A Comprehensive Study on Execution Trace-Based Information for Code Large Language Models},\n  booktitle = {EMNLP Findings},\n  year = {2025}\n}",
  },
  C3: {
    key: "ratchet",
    authors: ["Wang J.", "Liu S.", "Xie X.", "Siow J. K.", "Liu K.", "Li Y."],
    brief: "Pairs a retrieval-augmented patch generator with a BiLSTM fault localiser that needs no failing test to point at the bug.",
    abstract: "Automated Program Repair (APR) presents the promising momentum of releasing developers from the burden of manual debugging tasks by automatically fixing bugs in various ways. Recent advances in deep learning inspire many works in employing deep learning techniques to fixing buggy programs. However, several challenges remain unaddressed: (1) state-of-theart fault localization techniques often require additional artifacts, such as bug-triggering test cases or bug reports. These artifacts are not always available in the early development phases; (2) Sequence-to-Sequence model-based APR often requires additional contexts with high quality to generate patches. Yet, it is challenging to identify high-quality contexts that are not common in programs. In this paper, with the redundancy assumption in program repair, we propose a dual deep learning-based APR tool, RATCHET, for localizing (RATCHET-FL) and repairing (RATCHET-PG) buggy programs. RATCHET-FL localizes buggy statements based on the feature learned by a simple BiLSTM model from the code, without any bug-triggering test cases or bug reports. RATCHETPG relies on our proposed retrieval augmented transformer to learn the historical patches and generate patches for fixing bugs. We evaluate the effectiveness of RATCHET with in-the-lab DrRepair dataset and in-the-wild dataset RATCHET-DS (curated in this work). Our experimental results show that RATCHET outperforms state-of-the-art deep learning approaches on fault localization with 39.8-96.4% accuracy and patch generation with 18.4-46.4% repair accuracy.",
    bibtex: "@inproceedings{wang2024ratchet,\n  author = {Wang J. and Liu S. and Xie X. and Siow J. K. and Liu K. and Li Y.},\n  title = {RATCHET: Retrieval Augmented Transformer for Program Repair},\n  booktitle = {ISSRE},\n  year = {2024}\n}",
  },
  C2: {
    key: "aigc-detectors-on-code",
    authors: ["Wang J.", "Liu S.", "Xie X.", "Li Y."],
    brief: "Runs 13 AI-generated-content detectors over 2.23M code samples to test whether detection built for prose survives contact with code.",
    abstract: null,
    bibtex: "@inproceedings{wang2024aigc,\n  author = {Wang J. and Liu S. and Xie X. and Li Y.},\n  title = {An Empirical Study to Evaluate AIGC Detectors on Code Content},\n  booktitle = {ASE},\n  year = {2024}\n}",
  },
  C1: {
    key: "fgvuldet",
    authors: ["Liu S.", "Ma W.", "Wang J.", "Xie X.", "Feng R.", "Liu Y."],
    brief: "Grows scarce vulnerability data with mutations that preserve the flaw being labelled, then detects with an edge-aware GGNN per CWE type.",
    abstract: "Source code vulnerability detection aims to identify inherent vulnerabilities to safeguard software systems from potential attacks. Many prior studies overlook diverse vulnerability characteristics, simplifying the problem into a binary (0-1) classification task for example determining whether it is vulnerable or not. This poses a challenge for a single deeplearning based model to effectively learn the wide array of vulnerability characteristics. Furthermore, due to the challenges associated with collecting large-scale vulnerability data, these detectors often overfit limited training datasets, resulting in lower model generalization performance. To address the aforementioned challenges, in this work, we introduce a fine-grained vulnerability detector namely FGVulDet. Unlike previous approaches, FGVulDet employs multiple classifiers to discern characteristics of various vulnerability types and combines their outputs to identify the specific type of vulnerability. Each classifier is designed to learn type-specific vulnerability semantics. Additionally, to address the scarcity of data for some vulnerability types and enhance data diversity for learning better vulnerability semantics, we propose a novel vulnerability-preserving data augmentation technique to augment the number of vulnerabilities. Taking inspiration from recent advancements in graph neural networks for learning program semantics, we incorporate a Gated Graph Neural Network (GGNN) and extend it to an edge-aware GGNN to capture edge-type information. FGVulDet is trained on a large-scale dataset from GitHub, encompassing five different types of vulnerabilities. \u2217Corresponding author Permission to make digital or hard copies of part or all of this work for personal or classroom use is granted without fee provided that copies are not made or distributed for profit or commercial advantage and that copies bear this notice and the full citation on the first page. Copyrights for thirdparty components of this work must be honored. For all other uses, contact the owner/author(s). LCTES \u201924, June 24, 2024, Copenhagen, Denmark \u00a9 2024 Copyright held by the owner/author(s). ACM ISBN 979-8-4007-0616-5/24/06 https://doi.org/10.1145/3652032.3657564 Extensive experiments compared with static-analysis-based approaches and learning-based approaches have demonstrated the effectiveness of FGVulDet.",
    bibtex: "@inproceedings{wang2024fgvuldet,\n  author = {Liu S. and Ma W. and Wang J. and Xie X. and Feng R. and Liu Y.},\n  title = {Enhancing Code Vulnerability Detection via Vulnerability-Preserving Data Augmentation},\n  booktitle = {LCTES},\n  year = {2024}\n}",
  },
  J2: {
    key: "faire",
    authors: ["Li T.", "Xie X.", "Wang J.", "Guo Q.", "Liu A.", "Ma L.", "Liu Y."],
    brief: "Repairs unfair models by synthesising conditions on individual neurons rather than retraining the network.",
    abstract: null,
    bibtex: "@article{wang2023faire,\n  author = {Li T. and Xie X. and Wang J. and Guo Q. and Liu A. and Ma L. and Liu Y.},\n  title = {Faire: Repairing Fairness of Neural Networks via Neuron Condition Synthesis},\n  journal = {ACM TOSEM},\n  year = {2023}\n}",
  },
  J1: {
    key: "npc",
    authors: ["Xie X.", "Li T.", "Wang J.", "Ma L.", "Guo Q.", "Juefei-Xu F.", "Liu Y."],
    brief: "Defines a coverage criterion over the decision paths neurons actually take, giving DNN testing a structural target.",
    abstract: null,
    bibtex: "@article{wang2022npc,\n  author = {Xie X. and Li T. and Wang J. and Ma L. and Guo Q. and Juefei-Xu F. and Liu Y.},\n  title = {NPC: Neuron Path Coverage via Characterizing Decision Logic of Deep Neural Networks},\n  journal = {ACM TOSEM},\n  year = {2022}\n}",
  },
  C0: {
    key: "rnn-repair",
    authors: ["Xie X.", "Guo W.", "Ma L.", "Le W.", "Wang J.", "Zhou L.", "Liu Y.", "Xing X."],
    brief: "Builds a model-based abstraction of a trained RNN and uses it to locate and repair faulty behaviour automatically.",
    abstract: "Deep neural networks are vulnerable to adversarial attacks. Due to the their black-box nature, it is rather challenging to interpret and properly repair these incorrect behaviors. This paper focuses on interpreting and repairing the incorrect behaviors of Recurrent Neural Networks (RNNs). We propose a lightweight model-based in\ufb02uence analysis, to help understand and repair incorrect behaviors of an RNN. Speci\ufb01cally, we \ufb01rst build an automaton to enable high-quality feature extraction and to characterize the stateful and statistical behaviors of an RNN over all the training data. Compared with the existing techniques on in\ufb02uence function, our method can ef\ufb01ciently estimate the in\ufb02uence of existing or newly added training samples for a given prediction at both sample level and segmentation level. Our empirical evaluation shows that the proposed automaton is able to extract accurate and understandable features. Based on the automaton, our proposed technique could effectively infer the in\ufb02uence instances from not only an entire testing sequence but also a segment within that sequence. Moreover, with the samplelevel and segment-level in\ufb02uence relations, our techniques could further remediate the incorrect predictions at the sample level and segment level. To the best of our knowledge, this is the \ufb01rst work that applies in\ufb02uence analysis as a remediation mechanism, offsetting the misclassi\ufb01cation made by an RNN.",
    bibtex: "@inproceedings{wang2021rnn,\n  author = {Xie X. and Guo W. and Ma L. and Le W. and Wang J. and Zhou L. and Liu Y. and Xing X.},\n  title = {Automatic RNN Repair via Model-based Analysis},\n  booktitle = {ICML},\n  year = {2021}\n}",
  },
  P2: {
    key: "abba",
    authors: ["Guo Q.", "Juefei-Xu F.", "Xie X.", "Ma L.", "Wang J.", "Yu B.", "Feng W.", "Liu Y."],
    brief: "Shows that motion blur \u2014 an everyday camera artefact \u2014 is a viable adversarial channel against vision models.",
    abstract: "The state-of-the-art deep neural networks (DNNs) are vulnerable against adversarial examples with additive random-like noise perturbations. While such examples are hardly found in the physical world, the image blurring effect caused by object motion, on the other hand, commonly occurs in practice, making the study of which greatly important especially for the widely adopted real-time image processing tasks (e.g., object detection, tracking). In this paper, we initiate the \ufb01rst step to comprehensively investigate the potential hazards of blur effect for DNN, caused by object motion. We propose a novel adversarial attack method that can generate visually natural motion-blurred adversarial examples, named motion-based adversarial blur attack (ABBA). To this end, we \ufb01rst formulate the kernel-prediction-based attack where an input image is convolved with kernels in a pixel-wise way, and the misclassi\ufb01cation capability is achieved by tuning the kernel weights. To generate visually more natural and plausible examples, we further propose the saliency-regularized adversarial kernel prediction, where the salient region serves as a moving object, and the predicted kernel is regularized to achieve naturally visual effects. Besides, the attack is further enhanced by adaptively tuning the translations of object and background. A comprehensive evaluation on the NeurIPS\u201917 adversarial competition dataset demonstrates the effectiveness of ABBA by considering various kernel sizes, translations, and regions. The in-depth study further con\ufb01rms that our method shows more effective penetrating capability to the state-of-the-art GAN-based deblurring mechanisms compared with other blurring methods. We release the code to https://github.com/tsingqguo/ABBA.",
    bibtex: "@inproceedings{wang2020abba,\n  author = {Guo Q. and Juefei-Xu F. and Xie X. and Ma L. and Wang J. and Yu B. and Feng W. and Liu Y.},\n  title = {Watch out! Motion is Blurring the Vision of Your Deep Neural Networks},\n  booktitle = {NeurIPS},\n  year = {2020}\n}",
  },
  P1: {
    key: "fakespotter",
    authors: ["Wang R.", "Juefei-Xu F.", "Ma L.", "Xie X.", "Huang Y.", "Wang J.", "Liu Y."],
    brief: "Spots synthesised faces by monitoring neuron behaviour rather than pixel artefacts, which holds up better under perturbation.",
    abstract: "In recent years, generative adversarial networks (GANs) and its variants have achieved unprecedented success in image synthesis. They are widely adopted in synthesizing facial images which brings potential security concerns to humans as the fakes spread and fuel the misinformation. However, robust detectors of these AI-synthesized fake faces are still in their infancy and are not ready to fully tackle this emerging challenge. In this work, we propose a novel approach, named FakeSpotter, based on monitoring neuron behaviors to spot AIsynthesized fake faces. The studies on neuron coverage and interactions have successfully shown that they can be served as testing criteria for deep learning systems, especially under the settings of being exposed to adversarial attacks. Here, we conjecture that monitoring neuron behavior can also serve as an asset in detecting fake faces since layer-bylayer neuron activation patterns may capture more subtle features that are important for the fake detector. Experimental results on detecting four types of fake faces synthesized with the state-of-the-art GANs and evading four perturbation attacks show the effectiveness and robustness of our approach.",
    bibtex: "@inproceedings{wang2020fakespotter,\n  author = {Wang R. and Juefei-Xu F. and Ma L. and Xie X. and Huang Y. and Wang J. and Liu Y.},\n  title = {FakeSpotter: A Simple yet Robust Baseline for Spotting AI-Synthesized Fake Faces},\n  booktitle = {IJCAI},\n  year = {2020}\n}",
  },
};

export const KEY_TO_ID = Object.fromEntries(
  Object.entries(PUB_META).map(([id, m]) => [m.key, id])
);
