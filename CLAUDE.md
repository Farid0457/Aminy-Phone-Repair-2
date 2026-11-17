# CLAUDE.md

A marketing site with an instant-quote tool for **Aminy Phone Repair**, a walk-in device repair shop in Melbourne, Australia. Plain HTML, CSS and ES modules, hosted free on **Cloudflare Workers (static assets)**. A small Worker handles `POST /api/contact`.

## Start here
- **What to build next:** `docs/implementation-plan.md`. Work phase by phase, tick the boxes, and meet each task's *Accept* criteria.
- **Why things are the way they are:** `docs/decisions.md` (D-xx). Don't go against an Accepted decision without asking.
- **How it fits together:** `docs/architecture.md` (file layout, config, API contract).
- **Original gap list:** `docs/remaining-work.md`.
- **Owner-only steps:** `docs/manual/`. Business facts come **only** from `docs/manual/02-business-info.md`.

## Hard rules
1. **$0 running cost.** Only free tiers: Cloudflare Workers, Turnstile, Email Routing, Web Analytics, and Resend free as a temporary option. Don't add paid services, and don't add free services that need a paid plan to work.
2. **No framework, no bundler, no build step** for `public/` (D-11). npm is only for `wrangler` and the scripts and tests in `scripts/` and `test/`.
3. **Never invent business facts.** That covers phone, address, hours, ABN, ratings, stats, warranty terms and social URLs. If a value is `TBD` in `02-business-info.md`, stop and tell the owner which fields are missing. Claims must be true under Australian Consumer Law.
4. **Prices are owner-approved.** Any new or changed price you propose must be added to the sign-off table in `02-business-info.md` §8.
5. **Secrets never go in the repo, chat or `public/`.** Use `npx wrangler secret put NAME` for production and `.dev.vars` locally (git-ignored). The Turnstile *site* key is public. The *secret* key is not.
6. Everything in `public/` is publicly downloadable. Don't put notes, drafts or source files there.
7. Ask before you deploy (`npm run deploy`), push, or change Cloudflare settings. These are actions other people see. **A push to `main` is a deploy:** Cloudflare Workers Builds rebuilds the live Worker `aminy-phone-repair-2` from GitHub `Farid0457/Aminy-Phone-Repair-2` on every push.

## Where things stand
See the "Current status" block at the top of `docs/implementation-plan.md`. In short: Phases 0–1 are done (1.6 needs the owner's axe and Narrator checks), the contact API and the admin API (2.7) are built, and the live D1 database `aminy-db` exists. The admin page (2.8) is next.

## Layout (Phase 0 done)
```
public/            served as-is: index.html, legal pages, css/, js/, assets/, _headers
public/js/data/prices.js   all quote pricing data (edit prices here)
src/               Worker: worker.js (router), contact.js, validate.js, email.js, http.js (JSON helper), access.js + admin.js (admin API)
migrations/        D1 schema, numbered SQL files (never edit one that's been applied)
test/              node:test unit tests
scripts/           smoke-contact.mjs, smoke-admin.mjs (make-images.mjs comes in Phase 4)
docs/              plans, decisions, owner guides
wrangler.jsonc     Worker aminy-phone-repair-2 + assets config, D1 binding DB, vars (EMAIL_PROVIDER, MAIL_FROM, MAIL_TO, ALLOWED_ORIGINS)
```

## Commands
```bash
npm install            # once
npm run dev            # wrangler dev → http://localhost:8787 (site + API, uses .dev.vars)
npm test               # node --test test/
npm run smoke          # POST sample payloads to BASE_URL (default localhost:8787)
npm run smoke:admin    # admin API checks (local: needs ADMIN_DEV_BYPASS=true in .dev.vars)
npm run deploy         # wrangler deploy (ask first; pushing to main also deploys)
npx wrangler tail      # live logs from production
npm run db:migrate:local   # create/update the local D1 tables (once per machine)
npm run db:migrate:remote  # apply new migrations to the LIVE database (ask first)
npm run db:enquiries       # list the latest local enquiries
```
Local dev uses `EMAIL_PROVIDER=log` (emails are printed to the console) and the Turnstile test keys from `.dev.vars.example`.

## Code conventions
- **JS:** native ES modules, no dependencies in the browser. Each feature module exports a `setupX()`/`buildX()` called from `public/js/main.js` (`index.html` has the inline module until Phase 5.1). Build DOM with `createElement`/`textContent`. Use `innerHTML` only for trusted static SVG strings.
- **CSS:** one file per section in `public/css/`, loaded in order from `index.html` (`base.css` first). Use the design tokens (CSS custom properties) in `base.css` rather than raw colours. Breakpoints in use are 1100, 1000, 900, 720, 640, 560, 480 and 400px.
- **Accessibility is required:** every interactive element is a real `<button>`/`<a>`, and decorative SVGs get `aria-hidden="true" focusable="false"`. Keep `:focus-visible` styles, respect `prefers-reduced-motion` in both CSS and JS, and give form fields a `<label>`.
- **Locale:** Australian English ("colour", "labour"), AUD, prices **include GST**, phone format `04XX XXX XXX` / `03 XXXX XXXX`, time zone `Australia/Melbourne`.
- **Worker:** `src/validate.js` stays pure (no `env`, no `fetch`) so it can be unit-tested. Every response from `/api/*` is JSON with `Cache-Control: no-store`.
- Keep the visual design as it is unless a task says otherwise. The owner will make design decisions separately.

## Workflow
- One plan task, then one commit, in conventional-commit style (`feat:`, `fix:`, `chore:`, `docs:`), e.g. `feat(quote): pre-fill contact form from quote (1.5)`.
- After finishing a task: tick it in `docs/implementation-plan.md`, update `docs/remaining-work.md` if it covers an item there, and record any new decision in `docs/decisions.md`.
- Check UI changes in the running dev server at 375px and 1280px, and check the keyboard flow, before calling a task done.
- When blocked by an owner step, mark the task `[!]`, name the exact guide section (e.g. "03-cloudflare-setup §5"), and move on to tasks that aren't blocked.
