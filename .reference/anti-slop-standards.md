# Anti-Slop Standards — Locked Reference
*Copywriting and UI rules applied across all portfolio case studies and site copy. Pull this into any copy/design pass so nothing drifts back into generic AI output.*

---

## Copywriting Standard

- **Sell the end state** — describe what life/work looks like after, not the mechanism getting there
- **Pass the stranger test** — a reader with zero context should understand the point on first read
- **Cut, then cut again** — first draft is never the final length; always trim further than feels comfortable
- **Select your reader** — write for one specific person, not a general audience
- **No em dashes**
- **Tone matches slot** — hero tone ≠ footer tone ≠ error-state tone; each section earns its own register
- **Kill empty edges** — no throat-clearing openers, no vague closers, every line starts and ends on content
- **Angles, not synonyms** — when repeating a point, change the angle of attack, don't just reword it
- **One idea per unit** — one sentence, one paragraph, one section = one idea each, no stacking
- **Never invent claims** — no stats, features, or benefits that aren't real
- **Truth beats style** — accuracy wins over a punchier but misleading line
- **Benefits, not mechanism** — say what it does for the user, not how it technically works (unless mechanism IS the benefit)
- **Numbers beat adjectives** — "3% cashback" beats "great rewards"
- **Front-load the point** — lead with the conclusion, don't build up to it
- **Sound unmistakably brand** — copy should be identifiable without a logo attached
- **No AI lexicon** — banned words: leverage, seamless, robust, unlock, elevate, and the rest of that family

---

## UI/Design Standard

- Senior-level, non-generic UI output — React + Tailwind as default stack
- Editorial/magazine-grid aesthetics
- Linear.app-level restraint — spacious, quiet, confident, nothing decorative without function
- No gradients, no glassmorphism, no generic SaaS-template patterns
- blnkfinance.com is the primary design quality reference point

---

## Expanded Word Blacklist
Beyond leverage/seamless/robust/unlock/elevate — the current 2026 tell-list to also kill on sight:

delve, tapestry, multifaceted, underscore, testament, landscape ("digital landscape," "ever-evolving landscape"), navigate, realm, journey (as a metaphor for anything non-literal), holistic, cutting-edge, game-changer, revolutionize, empower, transform, streamline, foster, harness, bolster, unparalleled, robust (again, it's that common), synergy, ecosystem, paradigm, dive in / "let's dive in," unlock your potential, take it to the next level, it's important to note, it's worth noting, needless to say, at the end of the day, in today's fast-paced world, in the ever-evolving world of, comprehensive, seamlessly, effortlessly

## Banned Openers & Transitions
- "In today's [fast-paced/digital/ever-evolving] world/landscape..."
- "Imagine a world where..."
- "Let's dive in"
- "Great question!" / "Absolutely!" / "That's a really interesting point"
- "In conclusion," / "At the end of the day," / "Ultimately," / "In essence"
- "As we move forward..." / "Only time will tell"
- Rhetorical question-into-answer openers ("What if I told you...")

## Structural Tells (the ones that actually matter for design/copy work)
- **The false-contrast sentence** — "It's not just X, it's Y" / "That's not X, that's Y" / "Not because X, but because Y." One or two of these is fine; a whole page of them reads like a template
- **The rule of three, forced** — AI defaults to grouping things in exactly three even when two or four is the honest count ("clear, concise, and compelling"). Use the real number, not the tidy one
- **Bolded-header list syndrome** — every bullet starting with a bolded 2-3 word phrase followed by a colon and explainer sentence. Extremely common in AI-generated docs and READMEs — vary list structure instead of defaulting to this every time
- **"And the X? Y."** and similar dramatic one-line-payoff constructions — reads as marketing-copy performance, not real writing
- **"What nobody tells you is..." / "What most people miss..."** — only earns its place if the insight is genuinely non-obvious and backed by something real, not used as a rhetorical hook
- **Em dash overuse** — nicknamed the "ChatGPT hyphen." Not proof of AI writing on its own, but since your standard already bans it, treat any em dash as a flag to rewrite the sentence structure instead
- **Unicode arrows (→) and curly/smart quotes** — small tell, easy fix, keep to plain characters

## Quick Self-Check (run this before shipping any copy)
1. Read it out loud — if you'd never say it in conversation, flag it
2. Search for trigger words from the blacklist above
3. For every sentence: does this say something specific, or could it be dropped into any other fintech's homepage unchanged? If the latter, rewrite with a real number or a real detail

---

## Enforcement
These rules live inside a custom Claude skill: `anti-slop-ui-design` — built specifically to catch and prevent generic AI-flavored copy and UI from slipping into portfolio work. Every case study (RoundSync, Margin, the logistics project, and this Kast redesign) runs through this standard before anything ships.
