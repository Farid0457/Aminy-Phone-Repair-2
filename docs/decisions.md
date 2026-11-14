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

## D-04 Quote result shows only the GST-inclusive total — **Proposed**

- Remove the made-up Parts / Labour / GST rows (labour was a fixed 30%). Show **"Estimated total $X incl. GST"** and the repair time instead.
- Australian Consumer Law requires the total price to be the most prominent one. Showing a parts/labour split that isn't real could be misleading.
- Keep the disclaimer: "Estimate only — final price confirmed after free diagnosis."

## D-05 Price data in its own module — **Proposed**

- Move `QUOTE_DATA` and the shared issue sets out of `js/quote.js` into `public/js/data/prices.js`, a plain ES module that exports data only.
- **Why a JS module and not JSON:** no `fetch` call, no loading state, comments are allowed, and the owner edits one file. The controller logic stays in `quote.js`.

## D-06 Booking: enquiry form only — **Proposed**

- No appointment-booking system for now. Free booking tools add branding and limits. The form plus "Book This Repair" pre-filling it with the quote is enough for walk-in repairs.
- Can be revisited later (e.g. Cal.com's free tier).

## D-07 Site structure: one page + legal pages — **Proposed**

- Keep the single landing page. Add `privacy.html`, `terms.html`, `warranty.html` and `404.html`, all sharing the header and footer styles.
- Separate pages for each service or device (for SEO) are left for later.

## D-08 Parts wording — **Needs owner input**

- The owner chooses the wording in `docs/manual/02-business-info.md`: "Genuine", "OEM-equivalent / premium aftermarket", or "a choice of part grade". The site copy will follow that choice everywhere.

## D-09 Social proof — **Proposed**

- Show the hero stats only if the owner gives real numbers. Otherwise replace them with true, checkable facts (e.g. "Free diagnosis", "Same-day repairs", "Warranty on every repair").
- Link to Google reviews once a Google Business Profile exists. No embedded widgets, because most are paid or slow down the page.

## D-10 Analytics: Cloudflare Web Analytics — **Accepted**

- Free, no cookies (so no cookie banner needed), and turned on from the Cloudflare dashboard.

## D-11 No framework and no build step — **Accepted**

- Plain HTML, CSS and native ES modules. Node.js and npm are used **only** for Wrangler and the small helper scripts in `scripts/`. Nothing in `public/` is compiled.

## D-12 Domain — **Accepted, owner action**

- The domain is `aminyrepair.com.au` (to confirm). **Cloudflare Registrar can't sell `.au` domains**, so buy it from an Australian registrar and point its nameservers to Cloudflare (free plan).
- `.com.au` requires an **ABN** (Australian Business Number).
- Until the domain is ready, the site runs on the free `aminy-phone-repair.<account>.workers.dev` address.

## D-13 Database: Cloudflare D1 — **Accepted**

- A free D1 (SQLite) database `aminy-db`, bound to the Worker as `env.DB`. Every enquiry is **saved first, then emailed**, so a failed email never loses a lead (`email_sent` records whether the email went out).
- The schema lives in `migrations/` (numbered SQL files). **Never edit a migration that has already been applied.** Add a new numbered file instead.
- Local development uses a local copy of the database in `.wrangler/state` (git-ignored). Real data only exists in the remote database.
- Privacy: only the form fields are stored. No IP addresses or tracking data. Enquiries marked done or spam can be deleted from the admin page (retention policy to be stated in privacy.html).

## D-14 Admin area: `/admin` protected by Cloudflare Access — **Accepted**

- `public/admin/` is a static page that calls `/api/admin/*`.
- **Login is Cloudflare Access** (free for up to 50 users, one-time PIN by email), so we don't build a password system.
- Defence in depth: Access blocks `/admin*` and `/api/admin/*` at the edge, **and** the Worker checks the `Cf-Access-Jwt-Assertion` token on every `/api/admin/*` request (team domain and AUD tag from `wrangler.jsonc` vars).
- Local development only: `ADMIN_DEV_BYPASS=true` in `.dev.vars` skips the token check. It must never be set in production, and the Worker refuses the bypass unless the request is to `localhost`/`127.0.0.1`.
- Later options (not yet planned): editing prices from the admin page, and repair-status tracking for customers.
