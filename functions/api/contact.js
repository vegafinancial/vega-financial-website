// Cloudflare Pages Function — handles POST /api/contact
// Verifies hCaptcha, then sends the message via Resend to info@vega-financial.com.
//
// Required environment variables (set in Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY   — secret API key from resend.com
//   HCAPTCHA_SECRET  — secret key from hcaptcha.com
//   MAIL_FROM        — verified Resend sender, e.g. "Vega Website <website@vega-financial.com>"
//   MAIL_TO          — destination, defaults to info@vega-financial.com if unset

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = new URL(request.url).origin;
  const back = (status) => Response.redirect(`${origin}/contact/?${status}`, 303);

  try {
    const form = await request.formData();
    const name = (form.get('name') || '').toString().trim();
    const email = (form.get('email') || '').toString().trim();
    const phone = (form.get('phone') || '').toString().trim();
    const subject = (form.get('subject') || '').toString().trim();
    const message = (form.get('message') || '').toString().trim();
    const newClient = form.get('new_client') ? 'Yes' : 'No';
    const token = (form.get('h-captcha-response') || '').toString();

    // --- Required fields ---
    if (!name || !email || !message) return back('error=missing');

    // --- Verify hCaptcha ---
    const verifyRes = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.HCAPTCHA_SECRET || '', response: token }),
    });
    const verify = await verifyRes.json();
    if (!verify.success) return back('error=captcha');

    // --- Send via Resend ---
    const text =
      `New inquiry from the Vega Financial website\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || '—'}\n` +
      `Subject: ${subject || '—'}\n` +
      `Wants to become a new client: ${newClient}\n\n` +
      `Message:\n${message}\n`;

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.MAIL_FROM || 'Vega Website <website@vega-financial.com>',
        to: [env.MAIL_TO || 'info@vega-financial.com'],
        reply_to: email,
        subject: `Website inquiry${subject ? ': ' + subject : ''} — ${name}`,
        text,
      }),
    });

    if (!sendRes.ok) {
      console.error('Resend error', sendRes.status, await sendRes.text());
      return back('error=send');
    }

    return back('sent=1');
  } catch (err) {
    console.error('Contact function error', err);
    return back('error=server');
  }
}

// Reject non-POST requests politely.
export async function onRequestGet() {
  return new Response('Method Not Allowed', { status: 405 });
}
