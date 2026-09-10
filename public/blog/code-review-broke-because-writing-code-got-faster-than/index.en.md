# Code Review Broke Because Writing Code Got Faster Than Reading It

![Code Review Broke Because Writing Code Got Faster Than Reading It](/images/blog/code-review-broke-because-writing-code-got-faster-than.png)

A recent Chinese-language post on lightnote.com.cn argues that the fifty-year-old practice of human code review — formalised by Fagan in 1976 — has lost the economic condition that made it work. The author's claim is narrow and specific: review functioned because senior engineers could read faster than juniors could write, and coding agents have inverted that ratio. The post builds its case on two 2026 sources: Martin Monperrus's paper *The End of Code Review: Coding Agents Supersede Human Inspection*, and Addy Osmani's blog post *Agentic Code Review*.

## The speed mismatch

The argument's core is a throughput accident. For decades, writing code was slow and expensive; reading it was cheap and fast. Review kept pace almost by default, and teams absorbed system architecture as a side effect of reading each other's diffs — knowledge transfer came free with the bug-hunting.

According to the post, agents like Claude Code, Codex and Copilot now emit a thousand lines of clean-looking code in the time it takes to read a paragraph, while human reading speed has not moved. The author frames the consequence as a change in the hard question: the difficult part of software engineering has shifted from *how do I write this code* to *should I trust this code at all*.

## The numbers the post leans on

The post cites Q1 2026 industry data from Faros AI, tracking 22,000 developers across 4,000 teams. After AI adoption: code churn up 861%, median review time up 441.5%, developer defect rate up from 9% to 54%, incident-to-PR ratio up 242.7%, and zero-review merges up 31.3%.

The author singles out that last figure as the most telling, and reads it as capitulation rather than policy — nobody decided to stop reviewing; the queue simply exceeded what any process could absorb. Alongside it the post cites GitClear founder Bill Harding's estimate that AI users produce roughly 4× the raw code per day while delivering about 12% more actual value. Four times the code, a tenth more value, and humans still expected to read all of it line by line: that trade is the post's summary of the crisis.

## Where the paper and the practitioner disagree

The post is honest that its two sources do not agree, and the tension is the most useful part of the piece.

Monperrus takes the radical position: agents have crossed a threshold, human inspection is now redundant, and machines should check machines. The post relays three supporting claims — state-of-the-art agents resolve over 80% of SWE-bench tasks end to end; agent-generated inline defect comments are competitive with trained human reviewers; and agents catch the full range humans look for, from logic errors and security holes to performance and style. The paper, per the post, explicitly calls the middle path — AI writes, humans mandatorily review — a dead end that neither guarantees quality nor survives the throughput.

Osmani supplies the counterweight, and the post treats that diagnosis as the sharper one. AI code is hard to review because *intent* is missing. Human authors carry their reasoning with them; the alternatives they weighed and discarded surface naturally in review. Agents do reason — they produce thinking traces — but, as the author puts it:

> "That reasoning is discarded the moment the diff is generated."

What reaches the reviewer is code alone, and the reviewer has to reverse-engineer the intent behind it. The post names this as the mechanism behind the 441% jump in review time: not more code to read, but reconstruction of an inner monologue that was never written down.

## Match the review to the blast radius

The post's practical section refuses the online binary of "tests pass, ship it" versus "two humans read every AI line," arguing both camps are right for different situations. It proposes three variables: blast radius (does failure hurt anyone?), code lifespan (throwaway script or heirloom?), and team size (does anyone else need to understand this?).

For a solo prototype, the knowledge-sharing purpose of review is moot; hand verification to automated tests — but the author is clear that skipping review is only safe if coverage is real. For a growing team with users, the post recommends layered review: static analysis and security scanning in CI, an agent doing first-pass logic review, and humans reserved for core business logic, architectural impact and knowledge transfer. The framing is memorable — don't have engineers checking whether the AI's loop is efficient; have them asking whether the loop should exist. For high-risk, long-lived systems, the recommendation is evidence-based review: refuse code-only AI PRs and require a decision log from the agent or its operator.

## Turning review into verification

Three tactics follow. Force the agent to emit its reasoning — a mandated `DECISION_LOG.md` covering why it did what it did and which alternatives it rejected, which the post claims eliminates most of the reverse-engineering cost. Put a dedicated review agent in CI ahead of humans, with concrete rules (the example given: flag circular dependencies the team's `architecture.md` forbids) to filter out code the post calls "plausible but hollow." And reframe the human question from *is this code correct* to *is this the right problem, and does this pull the system off course*.

The author's closing framing is a role change rather than an ending. Writing code got cheap; understanding a system did not. The best teams in the next few years, the post argues, will not be the ones producing the most code but the ones that built a review system they genuinely dare to trust — and that never confuse all-green checks with someone actually understanding what the code does. Knowing a system well enough to point at it and vouch for it is, in the author's view, the hardest and most interesting skill left in software, and now is the moment to max it out.
