# Docs index

| File | For | What |
|---|---|---|
| [remaining-work.md](remaining-work.md) | everyone | The original review: everything left before launch |
| [decisions.md](decisions.md) | everyone | Decisions D-01…D-12 (hosting, email, quote display…). Edit the *Proposed* ones if you disagree. |
| [architecture.md](architecture.md) | Claude Code | File layout, Cloudflare config, `/api/contact` contract |
| [implementation-plan.md](implementation-plan.md) | Claude Code | Phased tasks 0.1 → 6.3 with acceptance criteria |
| [manual/](manual/README.md) | **owner** | Steps only you can do: setup, business info, Cloudflare, launch |

## Quick start

1. Do [manual/01](manual/01-local-setup-and-github.md) (git identity).
2. In Claude Code: **"Implement Phase 0 and Phase 1 from docs/implementation-plan.md."**
3. Meanwhile, fill in [manual/02-business-info.md](manual/02-business-info.md) and buy the domain ([manual/03 §3](manual/03-cloudflare-setup.md#3-domain--cloudflare)).
4. Do [manual/03](manual/03-cloudflare-setup.md) §1, §2 and §5, then: **"Implement Phase 2."**
5. **"Implement Phases 3–5."**
6. Deploy and launch with [manual/03](manual/03-cloudflare-setup.md) §7–9 and [manual/04](manual/04-launch-checklist.md).
