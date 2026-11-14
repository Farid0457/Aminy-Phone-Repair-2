# 04: Launch checklist

**🤖** = Claude Code can check this (ask *"run the automated launch checks"*). **🧑** = you.

## Before launch

### Content
- [ ] 🧑 Every `TBD` in `02-business-info.md` is filled in.
- [ ] 🧑 Read every page once, start to finish, on your phone. Is the phone number, address and hours all correct?
- [ ] 🧑 Read `privacy.html`, `terms.html` and `warranty.html` and approve them. Ideally get a quick professional review, since this is legal text. Then ask Claude Code to remove the `DRAFT` comments.
- [ ] 🧑 Approve the prices in the 02 §8 sign-off table.
- [ ] 🤖 `grep -rn "TBD\|TODO\|DRAFT\|400 000 000\|data-todo" public/` returns nothing.

### Function
- [ ] 🧑 Submit a real enquiry on the **live** site and check it arrives, that Reply goes to the customer address, and the quote details are included.
- [ ] 🧑 Submit with your phone on **mobile data** (not Wi-Fi).
- [ ] 🤖 `BASE_URL=<live url> npm run smoke` gives the expected status codes (honeypot and invalid input are rejected correctly).
- [ ] 🧑 Quote tool: try one model from every device category through to "Book This Repair".
- [ ] 🧑 Tap the phone number on a mobile: it opens the dialler. Tap "Get directions": it opens the right place in Maps.
- [ ] 🤖 Every internal link and footer link works, with no 404s (crawl the live site).
- [ ] 🤖 An unknown URL shows the custom 404 page.

### Quality
- [ ] 🤖 Lighthouse (mobile) ≥ 90 in all four categories for `/`.
- [ ] 🤖 axe: no serious or critical issues on any page.
- [ ] 🧑 Quote tool with Narrator or NVDA: each step is announced and selected options say "pressed" (task 1.6, to-do (c) in the [manual README](README.md#your-to-do-list)).
- [ ] 🤖 No console errors or CSP violations on any page.
- [ ] 🧑 Test on a real iPhone (Safari) and a real Android phone.
- [ ] 🤖 https://validator.schema.org: JSON-LD has no errors.
- [ ] 🧑 Paste the URL into a Facebook or WhatsApp message and check the preview image and title look right.

### Cloudflare
- [ ] 🧑 SSL **Full (strict)**, Always Use HTTPS **on** (03 §3d).
- [ ] 🧑 www redirects to the bare domain (03 §8.2).
- [ ] 🧑 Turnstile hostnames include the live domain (03 §5).
- [ ] 🧑 Web Analytics enabled (03 §9).
- [ ] 🧑 Two-factor authentication on Cloudflare, GitHub and the registrar.
- [ ] 🧑 Domain auto-renew is **on** at the registrar.

## Launch day
- [ ] 🧑 Final deploy. Option B is set up, so pushing to `main` deploys (D-15). `npm run deploy` also works.
- [ ] 🧑 Send one more real test enquiry.
- [ ] 🧑 Share the link and announce on your social pages.

## First week after launch

### Google (free, very important for local customers)
- [ ] 🧑 **Google Business Profile**: https://business.google.com → add the shop, verify it (Google may send a postcard or ask for a video), and add the website URL, hours, photos and services. Then add its review link to 02 §4 and ask Claude Code to link the rating.
- [ ] 🧑 **Google Search Console**: https://search.google.com/search-console → add the property `aminyrepair.com.au` (Domain type). It gives you a TXT record, so add it in Cloudflare **DNS → Records**. Then **Sitemaps** → submit `https://aminyrepair.com.au/sitemap.xml`.
- [ ] 🧑 Optional: **Bing Webmaster Tools** (it can import from Search Console).

### Monitor
- [ ] 🧑 Check Cloudflare Web Analytics after a few days.
- [ ] 🧑 Check the Worker → **Logs** for errors on `/api/contact`.
- [ ] 🧑 Ask the first happy customers for Google reviews.

## Ongoing maintenance

| Task | How |
|---|---|
| Change a price or add a model | Ask Claude Code: *"Update the price of X to $Y"*. It edits `public/js/data/prices.js`, then pushes to `main` (which deploys). |
| Change hours or phone | Update `02-business-info.md`, then ask Claude Code to apply it. |
| New phone models each September (iPhone) and February (Galaxy) | Ask Claude Code: *"Refresh model lists (task 1.3)"*. |
| Renew the domain | Yearly at the registrar (auto-renew). |
| Back up | `git push` to GitHub. |
