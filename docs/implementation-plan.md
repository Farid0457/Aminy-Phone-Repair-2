# Implementation Plan

This is the step-by-step plan for Claude Code. Work through the phases **in order**. Each task has an ID, the files it touches, steps, and **acceptance criteria**. A task is only done when every criterion is checked.

**How to use with Claude Code:** say *"Implement Phase 1 from docs/implementation-plan.md"* (or a single task, e.g. *"Do task 1.3"*). Claude Code ticks the status box and commits after each task.

**🧑 Manual:** some tasks depend on steps only the owner can do. These are marked with 🧑 and a link to the guide in `docs/manual/`. Claude Code must **stop and ask** instead of inventing values. Any value still marked `TBD` in `docs/manual/02-business-info.md` counts as missing.

Status key: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked (waiting on 🧑)

| Phase | Goal | Blocked by 🧑 |
|---|---|---|
| 0 | Repo, restructure, local dev server | 01-local-setup (git identity only) |
| 1 | Front-end fixes that need no business info | none |
| 2 | Contact API + Turnstile + email | 03-cloudflare-setup §4–6 for real keys (it works with test keys before that) |
| 3 | Real business content, claims, legal pages | 02-business-info |
| 4 | SEO, social preview, icons | 02-business-info (address, domain) |
| 5 | Security headers, performance, QA | none |
| 6 | Deploy and launch | 03-cloudflare-setup, 04-launch-checklist |

---

## Phase 0: Foundation

### [ ] 0.1 Initialise git
- `git init`, default branch `main`.
- Create `.gitignore`: `node_modules/`, `.wrangler/`, `.dev.vars`, `.DS_Store`, `Thumbs.db`, `*.log`.
- First commit of the project **as it is now**, before restructuring: `chore: initial import of static site`.
- **Accept:** `git log` shows one commit, and `.dev.vars` is ignored.

### [ ] 0.2 Move the site into `public/`
- `git mv index.html css js public/`. Relative paths don't change, because everything moves together.
- **Accept:** opening `public/index.html` through the dev server (0.3) looks exactly like before, with no 404s in the network tab.

### [ ] 0.3 Wrangler project
- `package.json`: `"private": true`, `"type": "module"`, devDependency `wrangler` (pin the current major), scripts:
  - `"dev": "wrangler dev"` (serves at http://localhost:8787)
  - `"deploy": "wrangler deploy"`
  - `"test": "node --test test/"`
  - `"smoke": "node scripts/smoke-contact.mjs"`
- Create `wrangler.jsonc` as in `docs/architecture.md`, with `compatibility_date` = today and `EMAIL_PROVIDER: "log"` for now.
- `src/worker.js`: minimal router. `/api/*` returns 404 JSON until Phase 2, and everything else goes to `env.ASSETS.fetch(request)`.
- `.dev.vars.example` lists every secret with the Turnstile test values and a comment for each. Copy it to `.dev.vars`.
- **Accept:** `npm install && npm run dev` serves the site at :8787. `GET /does-not-exist` returns a 404, because 404.html doesn't exist yet. `GET /api/x` returns JSON 404.

### [ ] 0.4 Commit: `chore: restructure into public/ and add wrangler`

---

## Phase 1: Front-end fixes (no business info needed)

### [ ] 1.1 Extract pricing data (D-05)
- Create `public/js/data/prices.js` that exports `QUOTE_DATA` and the shared issue sets and helpers. It must contain data only, plus a header comment explaining how the owner edits prices.
- `quote.js` imports from it. Remove the duplicated data.
- **Accept:** the quote tool works the same for every category. Spot-check iPhone 15 Pro screen, Galaxy S24 battery, MacBook keyboard, Watch crown and Moto G84 screen.

### [ ] 1.2 Fix the MacBook price fallback (remaining-work 3.1, 3.2)
- Add explicit prices for **every** model so none depends on `_default` for screen and battery. Add M1, M5 and the main Intel models (2016–2020 Pro and Air).
- New prices are **proposals**. Add each one to the "Prices pending sign-off" table in `docs/manual/02-business-info.md`.
- **Accept:** no MacBook model has a screen price lower than an older or smaller sibling. The table is updated.

### [ ] 1.3 Refresh model lists (3.3, 3.4)
- Use web search to check the current lineups (as of the implementation date) for Apple Watch, iPhone, iPad, MacBook, Galaxy S/A/Z/Tab, Pixel, OPPO and Motorola. Add any missing models released up to today.
- New models get proposed prices, which also go in the sign-off table.
- **Accept:** each list is ordered newest first, and every addition is in the sign-off table with its source.

### [ ] 1.4 Quote result: total only (D-04, 3.5)
- Remove the Parts, Labour and GST rows and the 30% labour calculation.
- Show the price, `incl. GST`, the time badge, and the disclaimer "Estimate only — final price confirmed after free diagnosis."
- Update the hero card copy, "see an itemised price with parts, labour and GST", to match (e.g. "see an estimated price incl. GST").
- **Accept:** the result card shows one price, which equals the price-table value. No text anywhere still says "parts, labour".

### [ ] 1.5 "Book This Repair" pre-fills the contact form (3.6)
- Follow the hand-off in `docs/architecture.md` ("Front-end ↔ quote hand-off").
- Export a small function from `contact.js`, e.g. `attachQuote({model, issue, total})`, and have `quote.js` call it. Don't let the two modules reach into each other's DOM.
- The "Quote attached" note has a remove (×) button that clears the attached quote.
- **Accept:** choose a quote, click Book: `#device` is filled in, the note is visible, focus is on `#firstName`, and the hash is `#contact`. Starting over or removing the note clears the attached quote.

### [ ] 1.6 Quote tool accessibility (4.1–4.4)
- When the step changes, focus moves to the new step's label. Make the labels headings (`<h3 class="iq-step-label" tabindex="-1">`).
- Add `type="button"` to every quote button, and `aria-pressed` to device, series, model and issue buttons, kept in step with `.selected`.
- Add a visually hidden live region (`aria-live="polite"`) that announces "Step N of 4: <label>".
- Add `aria-hidden="true"` and `focusable="false"` to every decorative SVG in `index.html` and `quote.js`.
- Respect reduced motion: `scrollIntoView` uses `behavior: 'auto'` when `prefers-reduced-motion` is set. `animateHero` skips the transition in that case too.
- **Accept:** the whole quote flow works with the keyboard alone (Tab, Enter, Space). With NVDA or Narrator, each step change is announced and selected options say "pressed". The axe DevTools extension reports no issues in `#instant-quote`.

### [ ] 1.7 Social links: SVG icons
- Replace the text `f`, `in` and `tt` with inline SVG icons (Facebook, Instagram, TikTok) that have `aria-hidden`. The link keeps its `aria-label`.
- Leave `href`s that are still `TBD` in business-info as `#` with a `data-todo` attribute. Phase 3 either fills them in or removes the link.
- **Accept:** the icons render in both the light and dark parts of the footer, and screen reader names stay correct.

### [ ] 1.8 Commit after each task. Run a final check across the whole page at 375px, 768px and 1280px.

---

## Phase 2: Contact API (D-02, D-03)

### [ ] 2.1 Validation module + tests
- `src/validate.js`: a pure `validateContact(body)` that returns `{ok, data, fields}` and follows **every** rule in the architecture API contract.
- `test/validate.test.js` uses `node:test` and covers: valid minimal input, valid full input, each required field missing, a bad email, AU phone variants (`0412 345 678`, `+61412345678`, `(03) 9123 4567`), fields that are too long, a malformed quote, and the honeypot filled in.
- **Accept:** `npm test` passes.

### [ ] 2.2 Email providers
- `src/email.js` exports `sendEnquiry(env, data)` and switches on `env.EMAIL_PROVIDER`:
  - `log`: `console.log` the formatted email.
  - `resend`: `fetch('https://api.resend.com/emails', …)` with `Authorization: Bearer ${env.RESEND_API_KEY}`, `from: env.MAIL_FROM`, `to: env.MAIL_TO`, `reply_to` set to the customer, and a text body.
  - `cloudflare`: build the MIME message (use the `mimetext` package, as Cloudflare's docs recommend), then `new EmailMessage(env.MAIL_FROM, env.MAIL_TO, raw)` and `env.SEND_EMAIL.send(msg)`. Import with `import { EmailMessage } from 'cloudflare:email'`, but **only load it** when this provider is selected (dynamic `import()`), so local `log` mode still works.
- Format the body as plain text: every field, the quote, and the timestamp in `Australia/Melbourne`. Escape nothing (it's plain text), but strip CR/LF characters from header values to prevent header injection.
- **Accept:** with `log`, a submission prints a well-formed email in the `wrangler dev` console.

### [ ] 2.3 `/api/contact` handler
- `src/contact.js`. Order of checks: method → Origin → body size → JSON parse → honeypot → validate → Turnstile siteverify (`POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret`, `response` and `remoteip` from `CF-Connecting-IP`) → send.
- Return JSON as described in the contract, with `Cache-Control: no-store`.
- Wire it into `src/worker.js`.
- `scripts/smoke-contact.mjs` POSTs a valid payload, an invalid one, a honeypot one and a wrong-method request to `process.env.BASE_URL ?? 'http://localhost:8787'`, then prints the results.
- **Accept:** `npm run smoke` gives 200, 400, 200 (and no email logged for the honeypot) and 405.

### [ ] 2.4 Front-end form
- Add a Turnstile widget to the form: `<div class="cf-turnstile" data-sitekey="…">` and the script `https://challenges.cloudflare.com/turnstile/v0/api.js` with `async defer`. Use the **test site key** until 🧑 03-cloudflare-setup §5 is done, and keep the key in one obvious place.
- Add the honeypot: `<div class="hp" aria-hidden="true"><label>Website <input name="website" tabindex="-1" autocomplete="off"></label></div>`, hidden off-screen with CSS (not `display:none`).
- Rewrite `public/js/contact.js` to keep the existing client-side validation, then `fetch('/api/contact')` with JSON. While sending, disable the button and change its text to "Sending…".
  - On success: reset the form and Turnstile, then show "Thanks <firstName> — we'll be in touch shortly."
  - On 400: mark the returned fields with `aria-invalid`.
  - On any other failure: show an error with the phone number and a `mailto:` link as a fallback.
- Remove "Sending opens your email app…" from `.form-note`.
- **Accept:** in `wrangler dev`, a submission succeeds and the email appears in the console. Stopping the dev server and submitting shows the fallback message. It works on a mobile viewport.

### [ ] 2.5 Switch to Resend (interim) 🧑 03-cloudflare-setup §6
- Set `EMAIL_PROVIDER: "resend"`, `MAIL_FROM: "onboarding@resend.dev"` and `MAIL_TO` from business-info. The owner runs `wrangler secret put RESEND_API_KEY`.
- **Accept:** after deploying, a test enquiry arrives in the owner's inbox, and replying goes to the customer's address.

### [ ] 2.6 Switch to Cloudflare Email Routing (final) 🧑 03-cloudflare-setup §3–4
- Add the `send_email` binding to `wrangler.jsonc`, then set `EMAIL_PROVIDER: "cloudflare"` and `MAIL_FROM: "quotes@<domain>"`.
- **Accept:** a test enquiry arrives. The Resend key can then be deleted (`wrangler secret delete RESEND_API_KEY`).

---

## Phase 3: Business content 🧑 02-business-info

Before starting, read `docs/manual/02-business-info.md`. **Stop and list** any `TBD` fields this phase needs.

### [ ] 3.1 Contact details
- Phone (both the `tel:` link and the displayed text), full street address with a "Get directions" link to Google Maps (a plain link, not an embed), hours, email and social URLs. Remove any social link that has no URL.
- **Accept:** `grep -r "400 000 000\|data-todo" public/` returns nothing.

### [ ] 3.2 Claims (remaining-work §2)
- Apply the chosen parts wording (D-08) **everywhere**: hero, why-us card, footer and meta description.
- Stats (D-09): use the real numbers, or replace them with the fallback facts. If a rating is shown, link it to its source.
- Make the warranty wording match `warranty.html` exactly.
- **Accept:** every claim on the page appears in business-info with a source or the owner's confirmation.

### [ ] 3.3 Legal pages (D-07)
- Create `public/css/legal.css` and `privacy.html`, `terms.html`, `warranty.html` and `404.html`, reusing the navbar and footer markup. Nav links point to `/#services` and so on, so they work from sub-pages.
- Base the privacy policy on the Australian Privacy Principles: what is collected (the form fields), why, who processes it (Cloudflare; Resend while it's in use), how long it's kept, how to request access or deletion, and the contact address.
- Terms: the free diagnosis, that quotes are estimates, data backup is the customer's responsibility, unclaimed devices, payment, and that ACL consumer guarantees are not excluded.
- Warranty: taken from the owner's terms in business-info.
- At the top of each page, add a comment `<!-- DRAFT: review by owner before launch -->`, and add a row for it in the launch checklist.
- Update the footer links. Make `404.html` friendly, with links home and to the quote tool.
- **Accept:** all footer links work, the pages are usable on mobile, and `wrangler dev` serves `404.html` for unknown paths.

### [ ] 3.4 Prices sign-off
- Once the owner marks prices as approved in business-info, update `prices.js` to match.

---

## Phase 4: SEO and social sharing

### [ ] 4.1 Structured data
- Add a JSON-LD `MobilePhoneRepair` block (schema.org, a type of `LocalBusiness`) in `index.html` with name, url, telephone, email, address (`PostalAddress`), geo, `openingHoursSpecification`, `priceRange`, `areaServed` and `sameAs` (social links). Leave out any field without a real value.
- **Accept:** passes https://validator.schema.org with no errors (paste the HTML).

### [ ] 4.2 Meta tags
- Add `<link rel="canonical">`, `og:url`, `og:image` (absolute URL), `og:image:width/height`, `og:site_name` and the `twitter:card=summary_large_image` set. Do the same on the legal pages with their own titles and descriptions.
- The site URL comes from business-info. Before the domain exists, use the workers.dev URL and leave a `TODO(domain)` comment.

### [ ] 4.3 Images
- `scripts/make-images.mjs` (devDependency `@resvg/resvg-js`) renders `public/assets/og-image.png` (1200×630, brand colours, logo mark, "Aminy Phone Repair — Melbourne" and a tagline), `apple-touch-icon.png` (180×180), `icon-192.png` and `icon-512.png` from inline SVG.
- Add `site.webmanifest` and the `<link>` tags for it.
- **Accept:** the images exist and look right. Check them with the Read tool.

### [ ] 4.4 Crawling
- `robots.txt` that allows everything and points to the sitemap. `sitemap.xml` lists `/`, `/privacy.html`, `/terms.html` and `/warranty.html`.

---

## Phase 5: Hardening and QA

### [ ] 5.1 `public/_headers`
- Applied to every page (`/*`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY` and a **Content-Security-Policy** that allows:
  - `script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com`
  - `frame-src https://challenges.cloudflare.com`
  - `style-src 'self' https://fonts.googleapis.com 'unsafe-inline'` (the hero animation uses inline styles)
  - `font-src https://fonts.gstatic.com`
  - `img-src 'self' data:`
  - `connect-src 'self' https://cloudflareinsights.com`
- The current inline `<script type="module">` in index.html breaks a strict CSP, so move it into `public/js/main.js`.
- Cache headers: `/css/*` and `/js/*` get `Cache-Control: public, max-age=3600`. HTML stays at the default (always revalidated).
- **Accept:** no CSP errors in the console on any page, including during Turnstile and a form submission.

### [ ] 5.2 Performance
- Fonts: check the three families are all needed and trim unused weights. Consider `<link rel="preload">` for the hero font.
- Run Lighthouse on mobile. The target is **≥ 90** for Performance, Accessibility, Best Practices and SEO. Fix anything below that.

### [ ] 5.3 Accessibility pass (4.5)
- Run axe on every page and fix the issues. Check the accent colour's contrast for small text, which needs at least 4.5:1.

### [ ] 5.4 Cross-browser checklist
- Write the results to `docs/qa-results.md`: Chrome, Edge and Firefox on desktop, and Safari on iOS (🧑 the owner tests on a real iPhone) and Chrome on Android. Cover the quote flow, the form, the mobile menu and the exploded-phone animation.

---

## Phase 6: Deploy and launch 🧑

### [ ] 6.1 First deploy to workers.dev 🧑 03-cloudflare-setup §1–2, §7
- `npm run deploy`. Run the smoke test against the deployed URL with `BASE_URL=https://… npm run smoke`, using a real Turnstile token where possible, or test by hand in the browser.

### [ ] 6.2 Connect the domain 🧑 03-cloudflare-setup §3, §8–9
- Update `ALLOWED_ORIGINS`, the canonical and OG URLs, the sitemap and the JSON-LD `url` to the real domain. Remove the `TODO(domain)` comments, then redeploy.

### [ ] 6.3 Launch checklist 🧑 04-launch-checklist
- Claude Code runs the automated checks in the checklist. The owner does the rest.

---

## Definition of done (whole project)
- Every box above is checked, and `docs/remaining-work.md` has every item marked done or deliberately skipped (with a reason in `decisions.md`).
- `grep -rn "TBD\|TODO\|DRAFT\|400 000 000\|data-todo" public/` returns nothing.
- A real enquiry sent from the live domain arrives in the owner's inbox.
