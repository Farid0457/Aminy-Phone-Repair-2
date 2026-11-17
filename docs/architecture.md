# Architecture

## Overview

```mermaid
flowchart LR
  V[Visitor's browser] -->|GET pages, css, js| CF[Cloudflare edge]
  CF -->|static file exists| A[(public/ static assets)]
  V -->|POST /api/contact| W[Worker src/worker.js]
  W -->|verify token| T[Turnstile siteverify]
  W -->|EMAIL_PROVIDER=cloudflare| E[send_email binding → Email Routing]
  W -->|EMAIL_PROVIDER=resend| R[Resend API]
  W -->|EMAIL_PROVIDER=log| L[console, dev only]
  E --> O[Owner inbox]
  R --> O
```

- Static files are served directly from the edge and never run the Worker.
- `run_worker_first: ["/api/*"]` makes sure API routes always reach the Worker.
- Paths that don't match anything serve `public/404.html` (`not_found_handling: "404-page"`). That file doesn't exist yet (task 3.3), so unknown paths return a plain 404 for now.

## What is live (2026-11-14)

| Piece | State |
|---|---|
| Worker | `aminy-phone-repair-2` on `https://aminy-phone-repair-2.<subdomain>.workers.dev`, deployed by Workers Builds on every push to GitHub `main` (D-15) |
| Site | Phase 0–1 version: quote tool with one GST-inclusive price, new models, accessibility work |
| `/api/contact` | Deployed, but **live submissions fail** until the owner sets the Turnstile secret and an email provider, and the workers.dev URL is added to `ALLOWED_ORIGINS` (03 §5–6) |
| Database | None. Enquiries are email only (D-17) |
| Domain, Email Routing, Web Analytics | Not set up yet |

## File layout

Items marked *(planned)* don't exist yet. The task that creates each one is in brackets.

```
aminy-v2-phone/
├── CLAUDE.md                 # instructions for Claude Code
├── package.json              # wrangler (dev dependency) + scripts (dev, deploy, test, smoke)
├── wrangler.jsonc            # Worker aminy-phone-repair-2 + assets + vars
├── .dev.vars.example         # template for local secrets (copy to .dev.vars)
├── .gitignore                # node_modules, .wrangler, .dev.vars, .claude/settings.local.json
├── src/
│   ├── worker.js             # router: /api/contact → handler, else assets
│   ├── contact.js            # method, origin, size, honeypot, validate, Turnstile, email
│   ├── validate.js           # pure validation functions (unit-tested)
│   ├── email.js              # providers: log | resend | cloudflare
│   └── http.js               # json() helper: JSON + Cache-Control: no-store
├── test/
│   └── validate.test.js      # node:test unit tests: contact form
├── scripts/
│   ├── smoke-contact.mjs     # POSTs sample payloads to a running server
│   └── make-images.mjs       # (planned, 4.3) renders og-image.png + icons from SVG
├── public/                   # ← everything here is publicly served
│   ├── index.html            # still has an inline <script type="module"> until 5.1
│   ├── 404.html  privacy.html  terms.html  warranty.html      # (planned, 3.3)
│   ├── robots.txt  sitemap.xml  _headers  site.webmanifest    # (planned, 4.x / 5.1)
│   ├── assets/               # (planned, 4.3) og-image.png, apple-touch-icon.png, icons
│   ├── css/                  # one stylesheet per section, base.css first (+ legal.css in 3.3)
│   └── js/
│       ├── animations.js  navbar.js  contact.js  quote.js
│       └── data/prices.js    # all pricing data (D-05)
└── docs/
```

> ⚠️ Anything under `public/` is downloadable by anyone. Never put secrets, notes or source files there.

## Configuration

`wrangler.jsonc` (summary of the real file):

```jsonc
{
  "name": "aminy-phone-repair-2",        // must match the Cloudflare Worker name (D-15)
  "main": "src/worker.js",
  "compatibility_date": "2026-11-01",
  "assets": {
    "directory": "./public",
    "binding": "ASSETS",
    "not_found_handling": "404-page",
    "run_worker_first": ["/api/*"]
  },
  "observability": { "enabled": true },
  // No database (D-17)
  "vars": {
    "EMAIL_PROVIDER": "log",             // now: log. Next: resend (2.5), then cloudflare (2.6)
    "MAIL_FROM": "",                     // resend: onboarding@resend.dev; later quotes@aminyrepair.com.au
    "MAIL_TO": "",                       // owner's inbox (02 §2)
    "ALLOWED_ORIGINS": "https://aminyrepair.com.au,https://www.aminyrepair.com.au"
                                         // add the workers.dev URL to test the form live
  }
  // Added in 2.6 once Email Routing is live:
  // "send_email": [{ "name": "SEND_EMAIL", "destination_address": "<owner inbox>" }]
}
```

Secrets are set with `npx wrangler secret put <NAME>` and never committed:

| Secret | Used by | Local value (`.dev.vars`) |
|---|---|---|
| `TURNSTILE_SECRET_KEY` | contact.js | `1x0000000000000000000000000000000AA` (test key: always passes) |
| `RESEND_API_KEY` | email.js (`resend`) | Not needed locally when `EMAIL_PROVIDER=log` |

The public Turnstile **site key** is in `index.html` (`data-sitekey` on `#turnstile`). `js/contact.js` loads Turnstile with explicit rendering and uses the test site key `1x00000000000000000000AA` on localhost, so local dev works with the test secret in `.dev.vars`.

## API contract: `POST /api/contact`

Request: `Content-Type: application/json`

```json
{
  "firstName": "Jane", "lastName": "Citizen",
  "email": "jane@example.com", "phone": "0412 345 678",
  "device": "iPhone 15 Pro — Screen Replacement",
  "message": "Cracked top-left corner",
  "quote": { "model": "iPhone 15 Pro", "issue": "Screen Replacement", "total": 385 },
  "website": "",
  "turnstileToken": "<token>"
}
```

| Rule | Detail |
|---|---|
| Required | firstName, lastName, email, device (after trimming) |
| Max lengths | names 60, email 254, phone 20, device 200, message 2000 |
| Phone | optional; once spaces, dashes and brackets are removed it must match `^(\+61\|0)\d{9}$` |
| `quote` | optional; if present it must be `{model:string, issue:string, total:number}` |
| Honeypot | if `website` is non-empty, return `200 {ok:true}` but **don't send anything** (silently drop the bot) |
| Origin | reject with 403 if the `Origin` header isn't in `ALLOWED_ORIGINS` (localhost is allowed in dev) |
| Body size | reject with 413 if larger than 10 KB |

Responses: `200 {ok:true}` (email sent, or honeypot) · `400 {ok:false, error, fields:[...]}` · `403 {ok:false, error:"verification_failed"}` or `"forbidden_origin"` · `405` for anything other than POST · `413` · `502 {ok:false, error:"delivery_failed"}` when the email can't be sent (the form then shows the phone number; nothing is stored, D-17).

Order of checks (as built in `src/contact.js`): method → Origin → body size → JSON → honeypot → validate → Turnstile → email.

The email sent to the owner has the subject `New repair enquiry — <device>`, `reply-to` set to the customer's email, and a plain-text body listing every field, the quote, and the time in Australia/Melbourne.

## Front-end ↔ quote hand-off

As built (task 1.5): `quote.js` calls `attachQuote({model, issue, total})` and `clearQuote()`, both exported from `contact.js`. Neither module touches the other's DOM.

1. "Book This Repair" stores the chosen model, issue and total on the contact form (in a JS module variable).
2. It pre-fills `#device` with `"<model> — <issue>"` and shows a small "Quote attached: $X incl. GST" note, which can be removed.
3. It scrolls to the form and moves focus to `#firstName`.
