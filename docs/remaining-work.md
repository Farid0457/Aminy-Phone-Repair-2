# Aminy Phone Repair — Remaining Work

_Last reviewed: 2026-11-14_

A static one-page site (`index.html`, 10 CSS files in `css/`, 4 ES modules in `js/`, no build step). The design, layout and instant-quote tool are mostly done. This document lists what's left before launch, ordered by priority.

**Legend:** 🔴 blocks launch · 🟠 should fix before launch · 🟢 nice to have
**Owner:** **Biz** = needs real business info from the owner · **Dev** = code change

---

## 1. Placeholders and broken pieces 🔴

| # | Item | Location | Problem | Owner |
|---|------|----------|---------|-------|
| 1.1 | Phone number | `index.html:595` | `+61 400 000 000` is a placeholder. | Biz |
| 1.2 | Street address and map | `index.html:591` | Only "Melbourne, VIC, Australia". The site says walk-ins are welcome but doesn't give a shop address. | Biz |
| 1.3 | Social links | `index.html:653-655` | They go to the generic facebook.com, instagram.com and tiktok.com home pages. They show the letters `f` / `in` / `tt` instead of icons, and `in` reads as LinkedIn, not Instagram. | Biz + Dev |
| 1.4 | Legal pages | `index.html:680-682` | Privacy Policy, Terms & Conditions and Repair Warranty all link to `#`. None of these pages exist. A privacy policy is needed because the contact form collects personal information. | Biz + Dev |
| 1.5 | Contact form has no backend | `js/contact.js:147` | It only opens the visitor's email app with a `mailto:` link. If they have no email app set up (common on desktop with webmail), nothing happens and the enquiry is lost. | Dev |
| 1.6 | Business email | `js/contact.js:3`, `index.html:599` | Confirm the `info@aminyrepair.com.au` mailbox exists and someone checks it. | Biz |

## 2. Content and claims (Australian Consumer Law) 🔴

Advertising claims must be accurate and able to be backed up.

| # | Claim | Location | Issue |
|---|-------|----------|-------|
| 2.1 | "Genuine Parts Only" | `index.html:264`, hero copy `:75-76` | The card text says "manufacturer-grade or **OEM-equivalent**", which contradicts the heading. Choose one wording that's true. |
| 2.2 | "500+ repairs", "4.9★", "30 min avg" | `index.html:84-93` | These must be real numbers. The rating needs a source, such as a link to the Google reviews. |
| 2.3 | "Limited lifetime warranty" | `index.html:269-270` | Needs written warranty terms (see 1.4). |
| 2.4 | "We'll get back to you within the hour" | `index.html:587`, `:636` | Only keep this if it's realistic during business hours. |
| 2.5 | Opening hours | `index.html:603` | Confirm Mon–Sat 9–6, Sun 10–4. |

## 3. Instant quote tool (`js/quote.js`) 🟠

| # | Item | Detail |
|---|------|--------|
| 3.1 | **MacBook pricing bug** | ✅ Done in task 1.2: every model now has an explicit screen and battery price (pending sign-off). Was: the M2 Air 13" and 15" have no screen price, so they fall back to `_default: 299`. That's cheaper than the M3 Air's $420. |
| 3.2 | MacBook list incomplete | ✅ Done in task 1.2: added M1, M2 Pro, M4 Air, M5, M6, Neo and Intel 2016–2020 models. Was: only M2–M4 models are listed. There are no Intel, M1 or M5 MacBooks. |
| 3.3 | Apple Watch list out of date | ✅ Done in task 1.3: added Series 11, Series 12, Ultra 3, Ultra 4 and SE 3. Was: It stops at Series 10 and Ultra 2. Series 11, Ultra 3 and SE 3 are missing, and possibly 2026 models too. |
| 3.4 | General model refresh | ✅ Done in task 1.3: added iPhone 18 Pro/Pro Max and 17e, Pixel 11 range, Galaxy S26 FE, Z Fold8 Ultra/Fold8/Flip8, Razr 70 Ultra and Razr Fold. Was: Check every list for 2026 releases (iPhone, Pixel, Galaxy and so on). |
| 3.5 | Made-up parts/labour split | ✅ Done in task 1.4: the result shows one price incl. GST (the table price), with no breakdown. This also fixed a bug where 10% GST was added on top of prices that already include it. Was: Labour is always 30% of the base price (`showResult()`), but it's shown as an itemised breakdown. Either use real numbers or show only the total incl. GST. |
| 3.6 | "Book This Repair" loses the quote | ✅ Done in task 1.5: the quote is attached to the form and fills in Device & Issue. Was: It jumps to `#contact` without filling in the **Device & Issue** field. Pre-fill it with the chosen model, issue and estimate. |
| 3.7 | Pricing data mixed in with code | About 640 lines of prices sit inside `quote.js`. Moving them to a separate `data/prices.json` (or similar) would let the owner update prices without touching the logic. |
| 3.8 | Prices need owner sign-off | All figures are estimates that the business hasn't confirmed. |

## 4. Accessibility 🟠

| # | Item | Detail |
|---|------|--------|
| 4.1 | Focus lost between quote steps | When a step is hidden, keyboard focus stays on the hidden button. It should move to the new step's heading. |
| 4.2 | Selection state not announced | Device, model and issue buttons toggle a `.selected` class but have no `aria-pressed`. |
| 4.3 | Progress not announced | `.iq-progress` is `aria-hidden` and there's no text such as "Step 2 of 4". |
| 4.4 | Decorative SVGs exposed | Quote-section icons (`index.html:337+`, and the issue icons in `quote.js`) are missing `aria-hidden="true"`. |
| 4.5 | Contrast check | Run an audit (e.g. Lighthouse or axe) on the accent orange against light backgrounds. |

## 5. SEO and local discoverability 🟠

| # | Item |
|---|------|
| 5.1 | `LocalBusiness` / `MobilePhoneRepair` JSON-LD with address, geo, hours, phone and price range. This needs the real details from 1.1–1.2. |
| 5.2 | `og:image` (1200×630), `og:url` and `<link rel="canonical">`. Shared links currently show no preview image. |
| 5.3 | `robots.txt` and `sitemap.xml`. |
| 5.4 | `apple-touch-icon` and a PNG favicon. The current one is an inline SVG only. |
| 5.5 | `404.html`. |
| 5.6 | Google Business Profile, linked from the site. A reviews link or embed could back up claim 2.2. |
| 5.7 | Analytics (e.g. Plausible, GA4) to measure use of the quote tool and form sends. |

## 6. Infrastructure and housekeeping 🟢

| # | Item |
|---|------|
| 6.1 | Not a git repository. Run `git init` and make a first commit before further changes. |
| 6.2 | Choose hosting (Netlify, Vercel or Cloudflare Pages). Netlify Forms would also solve 1.5. |
| 6.3 | Domain and DNS for `aminyrepair.com.au`, plus email records (MX/SPF/DKIM). |
| 6.4 | Optional: minify CSS and JS, and combine the 10 stylesheets. This is low priority at the current size. |
| 6.5 | Cross-browser and real-device testing, especially iOS Safari for the exploded-phone animation and smooth scroll. |

---

## Already in good shape ✅

- Responsive breakpoints in every section.
- `prefers-reduced-motion` handled in CSS (`css/base.css:167`) and in JS (exploded phone animation, price count-up).
- Visible `:focus-visible` styles.
- Contact form validation, including Australian phone formats, with `aria-invalid` on bad fields and a live status message.
- Mobile menu with `aria-expanded`, closing on Escape and outside clicks, and resetting at desktop width.
- Quote buttons are built with `textContent`, so model names containing quote marks are safe.
- Semantic structure: `<main>`, `<nav>`, a single `<h1>` and labelled sections.

---

## Decisions and plan

The open questions from this review are now recorded in [decisions.md](decisions.md):

| Question | Decision |
|---|---|
| Form backend | D-02: Cloudflare Worker `/api/contact` (Resend for now, then Cloudflare Email Routing) |
| Quote breakdown | D-04: GST-inclusive total only *(proposed)* |
| Price data source | D-05: `public/js/data/prices.js` *(proposed)* |
| Parts wording | D-08: owner to choose |
| Booking flow | D-06: enquiry form only *(proposed)* |
| Single vs multi-page | D-07: one page + legal pages *(proposed)* |
| Social proof | D-09: real stats or true facts; link to Google reviews *(proposed)* |
| Hosting and domain | D-01, D-12: Cloudflare Workers (free); `.com.au` from an AU registrar |

How each item above maps to tasks: see [implementation-plan.md](implementation-plan.md). The task numbers quote the item numbers here (e.g. 1.2 fixes 3.1).
