# Autonomous AI Hackers Have Arrived — and the Defenders Have Six Months

![Autonomous AI Hackers Have Arrived — and the Defenders Have Six Months](https://publicsg.s3.ap-southeast-1.amazonaws.com/github.io/images/blog/autonomous-ai-hackers-have-arrived-and-the-defenders-have.png)

In a short, pointed talk, the speaker — the founder of an AI offensive-security company called XBOW (rendered "Xbo" in the transcript) — argues that fully autonomous AI hacking is no longer hypothetical. His central claim: a bot given nothing but a target URL is already finding remote-code-execution bugs in production systems run by Microsoft, has briefly held the #1 spot on HackerOne, and the next six to nine months are the window in which defenders still have a head start.

## The Nagashino framing

The speaker opens with the 1575 Battle of Nagashino. On one side, the Takeda clan and its famous, supposedly invincible cavalry. On the other, Oda Nobunaga — a minor warlord who treated warfare as a system to be optimized and equipped his troops with the latest firearms. Nobunaga won. In the speaker's framing, cybersecurity is heading for the same outcome: incumbents with reputation and headcount will lose to whoever weaponizes AI fastest.

## The Bing example

To ground the claim, he describes a specific finding from a few weeks before the talk: Microsoft disclosed a remote code execution vulnerability in Bing image search — "one of the best secured systems in the world," in his words, and continuously hammered by thousands of researchers worldwide. RCE is the most severe class of bug; it lets an attacker run arbitrary code on the target.

XBOW, his company's bot, found it.

The only input the system received was the URL. The list-price cost, he says, was $3,000 — and less than that for them internally. He summarizes the result in three words: fast, cheap, effective.

## How XBOW operates

The speaker describes XBOW as working "very much like a human hacker":

- **Reconnaissance** — agents scout the attack surface.
- **Prioritization** — the system ranks endpoints by how promising they look.
- **Exploitation** — it tries every relevant attack type against the high-value targets.

He stresses that this is fully black-box: no source code, no internal access, just the URL.

## Topping HackerOne, autonomously

Anticipating the "machines can't really do this end-to-end" objection, the speaker points to a public proof. Last year his company entered XBOW into HackerOne, the bug-bounty platform that pairs companies with ethical hackers for points and bounties.

Within weeks, XBOW became the #1 hacker in the United States. By August, it was #1 in the world. He emphasizes again: black-box, autonomous, no human in the loop.

## Alloys: flipping a coin between models

Briefly, he describes a technique he calls an "alloy." Treat each attack as a sequence of actions; at every step, flip a coin to decide whether to consult Sonnet 4 or Gemini 2.5. The combined system substantially outperforms either model alone — he likens it to pair programming, where the two models cover each other's mistakes. The HackerOne #1 result, he says, was achieved with a Sonnet 4 / Gemini 2.5 alloy.

## The GPT-5 extrapolation

Shortly after that ranking, GPT-5 was released. Extrapolating from its measured performance on the speaker's internal benchmarks, he claims XBOW running on GPT-5 would have done at least three times better than its August result — meaning roughly three times the output of the world's best human bug hunter. The benchmarks themselves, he notes, are now nearly saturated; the field needs harder ones.

## Black-box exploitation vs. white-box code review

The speaker contrasts XBOW with what he refers to as "MyChelle's" — a tool that has been reported as reading source code extremely well and flagging potential flaws. That work is white-box: the tool sees the code. XBOW does not.

He argues this is not a small distinction. Source-code analysis answers "is there a bug-shaped pattern here?" An exploit tool has to answer different questions:

- Is this weakness actually exploitable in the wild?
- If it is, what's the impact? Where can the attacker pivot once they're inside?
- What about misconfigurations and deployment flaws, which never appear in the source at all?

Those, he says, are the questions XBOW is built to answer.

## The CVE clock has gone negative

The speaker offers one statistic to argue that perimeter-style defense is already too slow. In 2018, the average lag between a CVE being published and bad actors exploiting it in the wild was about two and a half years. Today, he says, that number has gone negative — for most CVEs, exploitation is already underway before the disclosure is even published.

Given that, he calls it incomprehensible that traditional cybersecurity stocks dip every time there's an AI-and-security headline. The implication, in his framing, is the opposite: defenders need every AI-powered tool they can get.

## What he wants the room to do

After acknowledging he has been "preaching like Nostradamus," he closes with three asks aimed at frontier-model builders and security teams:

- **Stop hedging on cyber capabilities in frontier models.** "We're in an arms race," he says, and the best models need to power this work. He frames the old debate over whether to permit such capabilities as effectively settled by the threat side.
- **Make the tools usable as extensions of human researchers**, so defenders find vulnerabilities before attackers do.
- **Prioritize by real exploitability and impact**, not raw bug counts — which is the gap he positions XBOW as filling.

## The six-to-nine-month window

His closing prediction is the line he wants the audience to leave with. Extrapolating from the trajectory of software-engineering agents, he estimates that within six to nine months, open-weight models will match the white-box code-analysis tool he referenced earlier. At that point, the offensive capability he's been describing is no longer gated behind a paid product — it's commodity.

"If you want to have a nice Thanksgiving dinner with your family," he tells the room, "you better start fixing now."
