# Decisions

This is the record of project decisions. **Accepted** means agreed. **Proposed** is a sensible default that Claude Code will implement unless the owner changes it. If you want something different, edit the decision before that phase is implemented.

Hard constraint for every decision: **$0 running cost**. The only accepted expense is the domain name, about AUD $15–25 a year.

---

## D-01 Hosting: Cloudflare Workers with static assets — **Accepted**

- The site is served from `public/` by a Cloudflare Worker using **static assets**. Requests for static files are free and unlimited, and the Worker free tier allows 100,000 requests a day, which only the `/api/*` routes use.
- **Why Workers rather than Pages:** this is what Cloudflare now recommends for new projects, and it supports every binding, including `send_email`, which D-02 needs.
- **Rejected:** Vercel Hobby (non-commercial use only), GitHub Pages (can't run server code, and its terms discourage business use), Netlify (free-tier limits keep changing).

## D-02 Contact and quote emails: Worker endpoint `/api/contact` — **Accepted**

The browser sends the form to `POST /api/contact`. The Worker validates it, checks Turnstile, and emails the owner. The email is sent by one of several **delivery providers**, chosen with the `EMAIL_PROVIDER` setting:

| Provider | When | Requirement |
|---|---|---|
| `log` | Local development | None. It only prints the email to the console. |
| `resend` | **Interim**, before the domain is on Cloudflare | Free Resend account (3,000 emails a month, 100 a day). Without a verified domain, Resend only sends **to the account owner's own email address**, which is fine because only the owner needs these emails. |
| `cloudflare` | **Final**, once the domain is on Cloudflare | Email Routing turned on for the domain, and the owner's inbox verified as a destination address. Free, with no third party involved. |

- Free-tier limitation: **no automatic confirmation email to the customer**. Both free paths can only send to the owner. The website shows the confirmation on screen instead.
- If the API call fails, the page shows the phone number and a `mailto:` link so the enquiry isn't lost.

## D-03 Spam protection: honeypot + Cloudflare Turnstile — **Accepted**

- A hidden `website` field that only bots fill in, plus Turnstile (a free CAPTCHA that's invisible to most visitors), checked on the server.
- During development, use Turnstile's official test keys (see `docs/manual/03-cloudflare-setup.md`).

## D-04 Quote result shows only the GST-inclusive total — **Accepted** (built in task 1.4)

- Remove the made-up Parts / Labour / GST rows (labour was a fixed 30%). Show **"Estimated total $X incl. GST"** and the repair time instead.
- The total shown is **exactly the price-table value**. Table prices already include GST. The old code added 10% on top, which overcharged by 10%, so that was removed.
- Australian Consumer Law requires the total price to be the most prominent one. Showing a parts/labour split that isn't real could be misleading.
- Keep the disclaimer: "Estimate only — final price confirmed after free diagnosis."

## D-05 Price data in its own module — **Accepted** (built in task 1.1)

- Move `QUOTE_DATA` and the shared issue sets out of `js/quote.js` into `public/js/data/prices.js`, a plain ES module that exports data only.
- **Why a JS module and not JSON:** no `fetch` call, no loading state, comments are allowed, and the owner edits one file. The controller logic stays in `quote.js`.

## D-06 Booking: enquiry form only — **Accepted** (built in tasks 1.5 and 2.4)

- No appointment-booking system for now. Free booking tools add branding and limits. The form plus "Book This Repair" pre-filling it with the quote is enough for walk-in repairs.
- Can be revisited later (e.g. Cal.com's free tier).

## D-07 Site structure: one page + legal pages — **Proposed**

- Keep the single landing page. Add `privacy.html`, `terms.html`, `warranty.html` and `404.html`, all sharing the header and footer styles.
- Separate pages for each service or device (for SEO) are left for later.

## D-08 Parts wording — **Proposed** (needs owner input)

- The owner chooses the wording in `docs/manual/02-business-info.md`: "Genuine", "OEM-equivalent / premium aftermarket", or "a choice of part grade". The site copy will follow that choice everywhere.

## D-09 Social proof — **Proposed**

- Show the hero stats only if the owner gives real numbers. Otherwise replace them with true, checkable facts (e.g. "Free diagnosis", "Same-day repairs", "Warranty on every repair").
- Link to Google reviews once a Google Business Profile exists. No embedded widgets, because most are paid or slow down the page.

## D-10 Analytics: Cloudflare Web Analytics — **Accepted** (not turned on yet, see 03 §9)

- Free, no cookies (so no cookie banner needed), and turned on from the Cloudflare dashboard.

## D-11 No framework and no build step — **Accepted**

- Plain HTML, CSS and native ES modules. Node.js and npm are used **only** for Wrangler and the small helper scripts in `scripts/`. Nothing in `public/` is compiled.

## D-12 Domain — **Accepted, owner action**

- The domain is `aminyrepair.com.au` (to confirm). **Cloudflare Registrar can't sell `.au` domains**, so buy it from an Australian registrar and point its nameservers to Cloudflare (free plan).
- `.com.au` requires an **ABN** (Australian Business Number).
- Until the domain is ready, the site runs on the free `aminy-phone-repair-2.<subdomain>.workers.dev` address. The domain hasn't been bought yet.

## D-13 Database: Cloudflare D1 — **Superseded by D-17** (2026-11-17)

- Was: every enquiry saved to a D1 database `aminy-db` first, then emailed. The code, migration and `d1_databases` binding were removed in D-17. The database itself was created in the owner's Cloudflare account on 2026-11-14 and may still exist there (it holds no real enquiries). Deleting it is the owner's choice (D-17).

## D-14 Admin area: `/admin` protected by Cloudflare Access — **Superseded by D-17** (2026-11-17)

- Was: an admin page at `/admin` behind Cloudflare Access, with an admin API that checked the Access token. The admin API (task 2.7, commit e5ff435) was built and then removed. The page (2.8) and the Access setup (2.9) were never built. The code is in git history if it's ever wanted again.

## D-15 Deploys: Workers Builds from GitHub `main` — **Accepted** (live)

- The Cloudflare Worker is named **`aminy-phone-repair-2`** (it must match `name` in `wrangler.jsonc`). It's connected to the GitHub repo `Farid0457/Aminy-Phone-Repair-2`, with root directory `/`, no build command, and deploy command `npx wrangler deploy` (03 §7 option B).
- **Every push to `main` deploys to the live site.** Claude Code asks before pushing (CLAUDE.md rule 7). `npm run deploy` from the PC still works, but isn't needed.

## D-16 Model lists: only confirmed Australian releases — **Accepted** (applied in task 1.3)

- A model is added to the quote tool only when its release is confirmed by the maker or a reliable outlet **and** it's sold in Australia. Rumoured or overseas-only models (e.g. a foldable iPhone, OPPO Find X9 Ultra) are left out until they are.
- New models get a proposed price one step above the model they replace, and are added to the sign-off table in 02 §8 with the source.

## D-17 Enquiries are email only: no database, no admin page — **Accepted** (owner, 2026-11-17)

- The owner reads enquiries in their inbox and doesn't need an admin page. So `/api/contact` validates the form, checks Turnstile and **only sends the email** (D-02: Resend for now, then Cloudflare Email Routing).
- If the email fails, the API returns `502 delivery_failed` and the form shows the shop's phone number and email address instead, so the customer can still get in touch. Nothing is stored, so an enquiry whose email failed isn't kept anywhere. Failures show in `npx wrangler tail` and the Workers logs.
- Removed: `src/admin.js`, `src/access.js`, the admin part of `src/validate.js`, their tests, `scripts/smoke-admin.mjs`, `migrations/`, the `d1_databases` binding and the `db:*` / `smoke:admin` npm scripts. Plan tasks 2.0 and 2.7 are reverted, and 2.8–2.9 are dropped. Cloudflare Access isn't needed.
- Privacy is simpler: the website keeps no copy of enquiries. They exist only in the owner's inbox (and the email provider's logs).
- The live D1 database `aminy-db` is no longer used. The owner can delete it in the dashboard (Storage & Databases → D1 → aminy-db → Settings → Delete), or Claude Code can run `npx wrangler d1 delete aminy-db` after asking. Leaving it costs nothing.
