# Manual steps (owner only)

These steps need **you**. They involve accounts, payments, passwords, or facts about the business. Claude Code can't do them, and it will stop and point you here when one is needed.

| # | Guide | When | Time |
|---|---|---|---|
| 01 | [Local setup & GitHub](01-local-setup-and-github.md) | Before Phase 0 | 15 min |
| 02 | [Business info (fill in)](02-business-info.md) | Any time before Phase 3; the sooner the better | 30–60 min |
| 03 | [Cloudflare setup](03-cloudflare-setup.md) | §1–2 + §5–6 before Phase 2 (§1–2 done); the rest when the domain is ready | 1–2 h, plus waiting for DNS |
| 04 | [Launch checklist](04-launch-checklist.md) | Phase 6 | 1 h, plus follow-ups |

## Your to-do list

Updated 2026-11-17. Tick each item when it's done. Claude Code's next task (2.5) waits on **(d)**, and **(a), (b), (d) and (e) must be done before launch.**

- [ ] **(a) Review the proposed prices before launch.** There are 43 rows (70 prices in all) in [02 §8](02-business-info.md#8-prices-pending-sign-off), for the MacBook models (task 1.2) and the new 2025–26 models (task 1.3). Write **approved** or a new price in the last column. The live site uses the proposed prices until you do. Also answer "are **all** existing prices correct?" under the table.
- [ ] **(b) Real social links.** The footer's Facebook, Instagram and TikTok icons point to `#` for now. Put the full profile URLs (or `none`) in [02 §4](02-business-info.md#4-social-profiles-full-urls-or-none). Phase 3 (task 3.1) fills them in or removes the icon.
- [ ] **(c) Accessibility checks for the quote tool (task 1.6, deferred).** In Chrome or Edge with the free **axe DevTools** extension ([01 §4](01-local-setup-and-github.md#4-browser-tools-for-testing-free)), scan the "Get your quote" section and note any issues. Then turn on **Narrator** (Ctrl+Win+Enter), go through the quote with the keyboard only (Tab, Enter, Space), and check that each step is read out ("Step 2 of 4…") and that selected options say "pressed". Tell Claude Code what you found.
- [ ] **(d) Turnstile key and email provider.** Without these, the contact form on the live site can't send. First [03 §5](03-cloudflare-setup.md#5-turnstile-spam-protection): create the widget, give Claude Code the **site** key, and store the **secret** with `npx wrangler secret put TURNSTILE_SECRET_KEY`. Then [03 §6](03-cloudflare-setup.md#6-resend-temporary-email-delivery-until-4-is-done) (Resend, for now), or [03 §4](03-cloudflare-setup.md#4-email-routing-free-inbox-forwarding--sending-enquiries) once the domain is on Cloudflare. Also fill in the enquiry inbox in [02 §2](02-business-info.md#2-contact).
- [ ] **(e) Buy the `.com.au` domain** ([03 §3](03-cloudflare-setup.md#3-domain--cloudflare)). It needs your ABN and can take a day or two. Then point it to Cloudflare.
- [ ] **(f) Optional: delete the unused database.** Enquiries are now email only (D-17), so the `aminy-db` database isn't used. Leaving it costs nothing. To remove it: dashboard → **Storage & Databases → D1 → aminy-db → Settings → Delete**, or ask Claude Code to do it.

Already done: 01 (git + GitHub repo `Farid0457/Aminy-Phone-Repair-2`), 03 §1–2 (account, Wrangler login), and automatic deploys from GitHub (03 §7 option B).

## Suggested order

1. Do **01** now. *(done)*
2. Start filling in **02** while Claude Code works on Phases 0–1, which don't need it. *(Phases 0–1 done; 02 still open)*
3. Buy the domain early (**03 §3**). Approving a `.com.au` and updating DNS can take a day or two.
4. Do **03 §1, §2, §5 and §6**, then Claude Code can do Phase 2 for real. *(§1–2 done)*
5. Finish **02**, then let Claude Code do Phases 3–5.
6. **03 §4, §7–9**, then **04**: launch.

## Never paste these into chat, docs or code

- Cloudflare API tokens, the Turnstile **secret** key, the Resend API key.
- Put them in only through `npx wrangler secret put …` (production) or your local `.dev.vars` file, which git ignores.

The Turnstile **site** key is public and safe to share. The **secret** key is not.
