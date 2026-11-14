# Manual steps (owner only)

These steps need **you**. They involve accounts, payments, passwords, or facts about the business. Claude Code can't do them, and it will stop and point you here when one is needed.

| # | Guide | When | Time |
|---|---|---|---|
| 01 | [Local setup & GitHub](01-local-setup-and-github.md) | Before Phase 0 | 15 min |
| 02 | [Business info (fill in)](02-business-info.md) | Any time before Phase 3; the sooner the better | 30–60 min |
| 03 | [Cloudflare setup](03-cloudflare-setup.md) | §1–2 + §5 before Phase 2; the rest when the domain is ready | 1–2 h, plus waiting for DNS |
| 04 | [Launch checklist](04-launch-checklist.md) | Phase 6 | 1 h, plus follow-ups |

## Suggested order

1. Do **01** now.
2. Start filling in **02** while Claude Code works on Phases 0–1, which don't need it.
3. Buy the domain early (**03 §3**). Approving a `.com.au` and updating DNS can take a day or two.
4. Do **03 §1, §2, §5 and §6**, then Claude Code can do Phase 2 for real.
5. Finish **02**, then let Claude Code do Phases 3–5.
6. **03 §4, §7–9**, then **04**: launch.

## Never paste these into chat, docs or code

- Cloudflare API tokens, the Turnstile **secret** key, the Resend API key.
- Put them in only through `npx wrangler secret put …` (production) or your local `.dev.vars` file, which git ignores.

The Turnstile **site** key is public and safe to share. The **secret** key is not.
