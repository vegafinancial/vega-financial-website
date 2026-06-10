# Contact form setup (Cloudflare Pages Function + Resend + hCaptcha)

The contact form posts to a Cloudflare Pages Function at `functions/api/contact.js`,
which verifies an hCaptcha token and emails the submission to `info@vega-financial.com`
via Resend. This matches the engineering plan (no third-party form host).

## One-time setup

### 1. Resend (email delivery)
1. Create an account at https://resend.com
2. **Add and verify the domain** `vega-financial.com` (Resend → Domains → add the
   DNS records it lists). Email won't send until the domain is verified.
   - ⚠️ DNS changes are part of the migration's strict guardrails — coordinate these
     records with whoever owns DNS; they're sending records (SPF/DKIM), not MX, so
     they won't affect inbound mail to info@.
3. Create an **API key** (Resend → API Keys).

### 2. hCaptcha (spam protection)
1. Create an account at https://www.hcaptcha.com
2. Add the site (vega-financial.com) and copy the **Sitekey** and **Secret key**.
3. Put the **Sitekey** into the form: in `src/pages/contact.astro`, replace
   `YOUR_HCAPTCHA_SITEKEY` on the Send Message button with the real sitekey.
   (The sitekey is public — safe to commit. The secret is NOT — see below.)

### 3. Cloudflare Pages environment variables
In Cloudflare dashboard → your Pages project → **Settings → Environment variables**,
add these (mark them **Secret**) for the Production environment:

| Name              | Value                                                        |
|-------------------|--------------------------------------------------------------|
| `RESEND_API_KEY`  | the Resend API key                                           |
| `HCAPTCHA_SECRET` | the hCaptcha secret key                                      |
| `MAIL_FROM`       | e.g. `Vega Website <website@vega-financial.com>` (verified)  |
| `MAIL_TO`         | `info@vega-financial.com` (optional; this is the default)    |

> Claude cannot enter API keys or secrets — these must be added by you in the
> Cloudflare dashboard.

## How it behaves
- On success the user is redirected to `/contact/?sent=1` and sees a green confirmation.
- On failure: `/contact/?error=captcha|missing|send|server` shows a red message.
- Until the hCaptcha sitekey + env vars are set, submissions will fail the captcha
  check (by design).

## Test after deploy
1. Deploy to Cloudflare Pages.
2. Submit the live form once. Confirm the email arrives at `info@vega-financial.com`.
3. The first send may require clicking a verification step in Resend.
