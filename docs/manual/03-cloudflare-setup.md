# 03: Cloudflare setup (step by step)

Everything here is on Cloudflare's **free plan**. The only cost is the domain. On the free Workers plan, going over a limit makes requests fail. **You are never billed automatically**, and no credit card is needed.

> Cloudflare sometimes renames dashboard menus. If a menu below has moved, use the search bar at the top of the dashboard.

Where each section fits:

| § | What | Needed for | Status (2026-11-14) |
|---|---|---|---|
| 1 | Create the account | everything | ✅ done |
| 2 | Connect Wrangler on this PC | deploying from the terminal | ✅ done |
| 3 | Domain → Cloudflare | custom domain, Email Routing | ⏳ to do: domain not bought yet |
| 4 | Email Routing | final email delivery (plan task 2.6), free `info@` inbox | ⏳ after §3 |
| 5 | Turnstile | spam protection (plan task 2.4) | ✅ done 2026-11-17 (site key in `index.html`, secret stored) |
| 6 | Resend (interim email) | emails before the domain is ready (plan task 2.5) | ⏳ to do |
| 7 | First deploy | going live on workers.dev | ✅ done with option B (auto-deploy from GitHub) |
| 8 | Custom domain + HTTPS | going live on aminyrepair.com.au | ⏳ after §3 |
| 9 | Web Analytics | visitor stats | ⏳ after §3 |

---

## §1 Create the Cloudflare account

1. Go to https://dash.cloudflare.com/sign-up and sign up with the business email (or the inbox from 02-business-info §2).
2. Verify the email address.
3. Turn on **two-factor authentication**: profile icon → *My Profile* → *Authentication*. This protects the site and DNS.

## §2 Connect Wrangler (the command-line tool) on this PC

In the project folder, **after Phase 0** (so `package.json` exists):

```bash
npx wrangler login
```

A browser window opens. Click **Allow**. Then check it worked:

```bash
npx wrangler whoami
```

It should show your account email and Account ID.

Register your free `workers.dev` subdomain: dashboard → **Workers & Pages**. The first time, it asks you to choose a subdomain (e.g. `aminy`). Your site will then be at `https://aminy-phone-repair-2.aminy.workers.dev`.

## §3 Domain → Cloudflare

Cloudflare can't sell `.au` domains, so buy the domain elsewhere and point it to Cloudflare.

### 3a. Buy the domain
1. Choose an Australian registrar (e.g. VentraIP, Crazy Domains, Netregistry). Prices vary, so compare them.
2. Search for `aminyrepair.com.au`. **You need an ABN** to register a `.com.au`.
3. **Skip** add-ons like hosting, email and "privacy". You don't need them. Make sure auto-renew is **on**.

### 3b. Add the domain to Cloudflare
1. Dashboard → **Add a domain** (or *Add site*) → enter `aminyrepair.com.au` → choose the **Free** plan.
2. Cloudflare scans for existing DNS records. If this is a brand-new domain, delete any "parked" A records the registrar created. The Worker will handle the website.
3. Cloudflare shows **two nameservers**, e.g. `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`. Copy them.

### 3c. Change nameservers at the registrar
1. Log in to the registrar → domain → **Nameservers / DNS hosts** → choose **custom nameservers**.
2. Replace the existing ones with the **two Cloudflare nameservers**. Save.
3. Back in Cloudflare, click **Check nameservers**. It usually becomes **Active** within 1–24 hours. Cloudflare emails you when it does.

### 3d. SSL settings (once Active)
- **SSL/TLS → Overview:** mode **Full (strict)**.
- **SSL/TLS → Edge Certificates:** **Always Use HTTPS = On**, **Minimum TLS = 1.2**, **Automatic HTTPS Rewrites = On**.

## §4 Email Routing (free inbox forwarding + sending enquiries)

> ⚠️ Email Routing takes over the domain's **MX records**. If the domain already has email hosting somewhere else (e.g. a paid mailbox from the registrar), that email will stop working. A new domain usually has none.

1. Dashboard → your domain → **Email** → **Email Routing** → **Get started / Enable**.
2. Let Cloudflare **add the DNS records** it suggests (MX + SPF). Click *Add records and enable*.
3. **Destination addresses** → **Add destination address** → the enquiry inbox from 02-business-info §2 (e.g. your Gmail).
   - Cloudflare sends a verification email. **Click the link.** The status must show **Verified**.
4. **Routing rules → Create address:**
   - Custom address `info` → action *Send to an email* → your verified inbox.
   - Optional: turn on **Catch-all** → your inbox, so any `@aminyrepair.com.au` address reaches you.
5. Test: email `info@aminyrepair.com.au` from another account. It should arrive in your inbox.
6. Tell Claude Code: *"Email Routing is live, do task 2.6."* It sends enquiries from `quotes@aminyrepair.com.au` to your verified inbox.

**Limitations (free):**
- Email Routing **receives and forwards** mail. The Worker can only send to **verified** destination addresses, which means you. It can't email customers.
- To *reply* as `info@aminyrepair.com.au` you'd need an outgoing mail service. Replying from your Gmail is fine to begin with. Enquiry emails set *Reply-To* to the customer, so pressing Reply just works.

## §5 Turnstile (spam protection)

1. Dashboard → **Turnstile** (in the left sidebar; not tied to a domain) → **Add widget**.
2. **Widget name:** `Aminy contact form`
3. **Hostnames**, one per line:
   - `aminy-phone-repair-2.<your-subdomain>.workers.dev`
   - `aminyrepair.com.au` (you can add this before the domain is active)
   - `www.aminyrepair.com.au`
4. **Widget mode:** **Managed**. Leave pre-clearance off.
5. Click **Create**. You get two keys:
   - **Site key** (public): give it to Claude Code, or add it to `docs/manual/02-business-info.md` §1 as a new row "Turnstile site key".
   - **Secret key** (private): **don't paste it anywhere**. Store it as a Worker secret (after the first deploy, §7):

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Paste the secret key when asked and press Enter. It's stored encrypted on Cloudflare.

To test the form on the workers.dev address before the domain is live, also ask Claude Code to add `https://aminy-phone-repair-2.<your-subdomain>.workers.dev` to `ALLOWED_ORIGINS` in `wrangler.jsonc`. Otherwise the API rejects the form with "forbidden_origin".

**Local development** uses Cloudflare's official test keys, so you don't need to do anything. They're already in `.dev.vars.example`:
- site key `1x00000000000000000000AA` (always passes)
- secret `1x0000000000000000000000000000000AA`

## §6 Resend: temporary email delivery until §4 is done

Skip this if Email Routing (§4) is already working.

1. Sign up at https://resend.com (free plan) **using the same inbox** that should receive enquiries. Without a verified domain, Resend only delivers to the account's own email.
2. **API Keys → Create API key**: name `aminy-worker`, permission **Sending access**. Copy it **once**.
3. In the project folder:

```bash
npx wrangler secret put RESEND_API_KEY
```

4. Tell Claude Code: *"Resend is set up, do task 2.5."*
5. Once §4 works and task 2.6 is done, delete the key in Resend and run `npx wrangler secret delete RESEND_API_KEY`.

## §7 First deploy

Choose **A** (simplest) or **B** (automatic deploys from GitHub). You can switch to B later.

### Option A: deploy from this PC
```bash
npm run deploy
```
Wrangler prints the live URL, e.g. `https://aminy-phone-repair-2.aminy.workers.dev`. Then set the secrets (§5, §6) if you haven't. Run `npm run deploy` again whenever the site changes.

### Option B: automatic deploy on every `git push` (Workers Builds)
Requires the GitHub repo from 01 §2.
1. Dashboard → **Workers & Pages** → **Create** → **Import a repository** → connect GitHub → choose `Aminy-Phone-Repair-2`.
2. Settings:
   - **Project name:** `aminy-phone-repair-2` (must match `name` in `wrangler.jsonc`)
   - **Build command:** *(leave empty)*
   - **Deploy command:** `npx wrangler deploy`
   - **Production branch:** `main`
3. Click **Deploy**. From now on every push to `main` goes live within about a minute.
4. Secrets set with `wrangler secret put` stay in place across deploys. You can also manage them in the dashboard: Worker → **Settings → Variables and Secrets**.

**Check the deploy:** open the URL, submit a test enquiry, and make sure it arrives. Check the logs if it doesn't: Worker → **Logs**, or `npx wrangler tail` in a terminal while you submit.

## §8 Custom domain + www redirect

Once the domain shows **Active** (§3c):

1. Dashboard → **Workers & Pages** → `aminy-phone-repair-2` → **Settings → Domains & Routes → Add → Custom domain**:
   - `aminyrepair.com.au` → Add
   - Repeat for `www.aminyrepair.com.au`
   Cloudflare creates the DNS records and the HTTPS certificate automatically (a few minutes).
2. **Redirect www → the bare domain** (one canonical address is better for SEO): your domain → **Rules → Redirect Rules → Create from template → "Redirect from WWW to root"** → status **301** → Deploy.
3. Optional: turn off the `workers.dev` URL so there's only one public address. Worker → Settings → Domains & Routes → workers.dev → **Disable**. Do this **after** the domain works, and remove the workers.dev hostname from Turnstile.
4. Tell Claude Code: *"Domain is live, do task 6.2."*

## §9 Web Analytics (free, no cookies)

1. Dashboard → **Analytics & Logs → Web Analytics → Add a site**.
2. Choose `aminyrepair.com.au`. Because the domain is on Cloudflare, choose **automatic setup** (Cloudflare adds the script for you, nothing to change in code).
3. Stats appear within a few hours. The CSP in plan task 5.1 already allows the analytics script.

## Troubleshooting

| Problem | Fix |
|---|---|
| `wrangler secret put` says the Worker doesn't exist | Deploy once first (§7), then set the secrets. |
| Form says "verification failed" on the live site | The site's hostname isn't in the Turnstile widget's list (§5.3), or the site key / secret don't match. |
| Form works locally but not live | Check `ALLOWED_ORIGINS` in `wrangler.jsonc` includes the live URL. Run `npx wrangler tail` and submit again to see the error. |
| No enquiry email (Email Routing) | The destination must show **Verified** (§4.3). `MAIL_FROM` must be an address **on your domain**. |
| No enquiry email (Resend) | `MAIL_TO` must be the **exact** email your Resend account signed up with. Check Resend → *Logs*. |
| Domain stuck on "Pending" | Re-check the nameservers at the registrar (must be exactly the two from Cloudflare). Allow up to 24 h. |
| Too many redirects | SSL mode must be **Full (strict)**, not *Flexible* (§3d). |
