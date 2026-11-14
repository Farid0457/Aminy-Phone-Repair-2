# 02: Business info (fill this in)

Claude Code reads this file to replace the placeholders on the site. **It will never make these values up.** Replace every `TBD`. If something doesn't apply, write `none` and the site will leave it out.

> ⚠️ This file is committed to git. Only put information here that you're happy to show publicly on the website (except the inbox in §2, which isn't displayed). **No passwords or API keys.**

## 1. Business identity

| Field | Value |
|---|---|
| Trading name (as shown on site) | Aminy Phone Repair |
| Legal entity name (for Terms/Privacy) | TBD |
| ABN | TBD |
| Domain to use | aminyrepair.com.au *(confirm, or change)* |
| Year established (optional) | TBD |

## 2. Contact

| Field | Value |
|---|---|
| Public phone (display format) | TBD *(e.g. 03 9123 4567)* |
| Public email (shown on site) | info@aminyrepair.com.au *(confirm)* |
| **Inbox that receives enquiries** (not shown on site) | TBD *(e.g. your Gmail; it must match the Resend account and the Cloudflare verified destination)* |
| Street address | TBD |
| Suburb, State, Postcode | TBD, VIC, TBD |
| Google Maps link to the shop | TBD |
| Parking / access notes (optional) | TBD |

## 3. Opening hours

| Day | Hours |
|---|---|
| Mon–Fri | TBD *(site currently says 9am–6pm)* |
| Sat | TBD *(site currently says 9am–6pm)* |
| Sun | TBD *(site currently says 10am–4pm)* |
| Public holidays | TBD |

## 4. Social profiles (full URLs, or `none`)

| Network | URL |
|---|---|
| Facebook | TBD |
| Instagram | TBD |
| TikTok | TBD |
| Google Business Profile / reviews | TBD *(create one, see 04-launch-checklist)* |

## 5. Claims on the site: confirm or correct

| Claim | Currently says | Your answer |
|---|---|---|
| Parts wording (D-08) | "Genuine parts" in the hero **and** "manufacturer-grade or OEM-equivalent" in Why Us | Choose one: **genuine** / **OEM-equivalent (premium aftermarket)** / **choice of grades** → TBD |
| Repairs completed | 500+ | Real number, or `remove` → TBD |
| Average rating | 4.9★ | Real rating **and its source** (e.g. Google, 37 reviews), or `remove` → TBD |
| Average repair time | 30 min | True? → TBD |
| Same-day turnaround | "Most repairs 30 min–2 hrs" | True? → TBD |
| No fix, no fee | Yes | True for **every** device? Any exceptions (e.g. water damage diagnostic fee)? → TBD |
| Free diagnosis | Yes | → TBD |
| Response time | "within the hour" | Realistic? Otherwise e.g. "same business day" → TBD |
| Walk-ins, no appointment | Yes | → TBD |

## 6. Warranty terms

| Question | Answer |
|---|---|
| Warranty length | TBD *(site says "limited lifetime". Is that really what you offer? 3, 6 or 12 months is common.)* |
| Covers | TBD *(e.g. part defects and workmanship)* |
| Excludes | TBD *(e.g. new physical or liquid damage, third-party repairs, software)* |
| Does a battery warranty differ? | TBD |
| How to claim | TBD *(e.g. bring the device + receipt)* |

## 7. Terms details

| Question | Answer |
|---|---|
| Payment methods | TBD |
| Deposit required for parts ordered in? | TBD |
| Unclaimed devices: after how many days? | TBD |
| Do you back up customer data? | TBD *(usually "no, the customer's responsibility")* |
| Data recovery: fee if unsuccessful? | TBD |

## 8. Prices pending sign-off

Claude Code adds a row here for every price it **proposes** (new models, fixed fallbacks). Check each one, then write **approved** or a new price in the last column. The site keeps using the proposed price until you answer.

| Category | Model | Repair | Proposed AUD (incl. GST) | Source / reasoning | Owner decision |
|---|---|---|---|---|---|
| MacBook | Pro 14" (M6) | Screen · Battery | $620 · $249 | New model (on sale 6 Nov 2026, [Apple AU newsroom](https://www.apple.com/au/newsroom/2026/10/apple-introduces-the-new-14-inch-macbook-pro-with-m6/)). One step above the 14" M5. | TBD |
| MacBook | Pro 16" (M5 Pro/Max) | Screen · Battery | $700 · $259 | New model (Mar 2026). One step above the 16" M4 ($680 · $249). | TBD |
| MacBook | Pro 14" (M5 Pro/Max) | Screen · Battery | $600 · $239 | New model (Mar 2026). One step above the 14" M4 ($580 · $229). | TBD |
| MacBook | Pro 14" (M5) | Screen · Battery | $600 · $239 | New model (Oct 2025). Same chassis as the 14" M5 Pro/Max. | TBD |
| MacBook | Air 15" (M5) | Screen · Battery | $520 · $219 | New model (Mar 2026). One step above the Air 15" M4. | TBD |
| MacBook | Air 13" (M5) | Screen · Battery | $460 · $199 | New model (Mar 2026). One step above the Air 13" M4. | TBD |
| MacBook | MacBook Neo | Screen · Battery | $349 · $179 | New budget model (2026). Priced below the Airs, since it's the entry model. Please check part costs. | TBD |
| MacBook | Air 15" (M4) | Screen · Battery | $500 · $209 | Model was missing (Mar 2025). Between the Air 15" M3 and M5. | TBD |
| MacBook | Air 13" (M4) | Screen · Battery | $440 · $189 | Model was missing (Mar 2025). Between the Air 13" M3 and M5. | TBD |
| MacBook | Pro 16" (M3) | Battery | $239 | Was $179 via the fallback. Now sits between the 16" M2 and M4. Screen ($650) unchanged. | TBD |
| MacBook | Pro 14" (M3) | Battery | $219 | Was $179 via the fallback. Now sits between the 14" M2 and M4. Screen ($550) unchanged. | TBD |
| MacBook | Air 15" (M3) | Battery | $199 | Was $179 via the fallback. Larger than the Air 13". Screen ($480) unchanged. | TBD |
| MacBook | Pro 16" (M2) | Screen · Battery | $620 · $229 | Model was missing (2023). One step below the 16" M3. | TBD |
| MacBook | Pro 14" (M2) | Screen · Battery | $520 · $209 | Model was missing (2023). One step below the 14" M3. | TBD |
| MacBook | Pro 13" (M2) | Screen · Battery | $400 · $189 | Model was missing (2022). Older 13" design. | TBD |
| MacBook | Air 15" (M2) | Screen · Battery | $460 · $189 | **Bug fix:** was $299 · $179 via the fallback, cheaper than the M3 (remaining-work 3.1). | TBD |
| MacBook | Air 13" (M2) | Screen | $399 | **Bug fix:** was $299 via the fallback. Battery ($179) unchanged. | TBD |
| MacBook | Pro 16" (M1) | Screen · Battery | $590 · $219 | Model was missing (2021). One step below the 16" M2. | TBD |
| MacBook | Pro 14" (M1) | Screen · Battery | $490 · $199 | Model was missing (2021). One step below the 14" M2. | TBD |
| MacBook | Pro 13" (M1) | Screen · Battery | $380 · $179 | Model was missing (2020). Below the 13" M2. | TBD |
| MacBook | Air 13" (M1) | Screen · Battery | $340 · $169 | Model was missing (2020). Older wedge design, below the Air 13" M2. | TBD |
| MacBook | Pro 16" (Intel, 2019) | Screen · Battery | $450 · $199 | Model was missing. Older Intel model. | TBD |
| MacBook | Pro 15" (Intel, 2016–2019) | Screen · Battery | $420 · $189 | Model was missing. Older Intel model. | TBD |
| MacBook | Pro 13" (Intel, 2016–2020) | Screen · Battery | $360 · $169 | Model was missing. Older Intel model. | TBD |
| MacBook | Air 13" (Intel, 2018–2020) | Screen · Battery | $320 · $159 | Model was missing. Older Intel Retina Air. | TBD |

*MacBook rows: other repairs (keyboard, water damage and so on) still use one price for all models. Tell Claude Code if any should differ by model.*

**Also confirm:** are **all** existing prices in the quote tool correct? → TBD *(if not, list the changes or attach your price list)*

## 9. Optional

| Field | Value |
|---|---|
| Logo file (if you have a real one) | TBD *(put it in `docs/brand/`; otherwise the current wrench mark stays)* |
| Shop photos for the site | TBD *(put them in `docs/brand/photos/`)* |
| Languages spoken in store | TBD |
| Business / corporate accounts offered? | TBD |
