// Vercel serverless function — sends the contact form via the Resend API.
// Requires env vars on the Vercel project: RESEND_API_KEY, CONTACT_TO_EMAIL
// (optional: CONTACT_FROM_EMAIL, defaults to Resend's shared sandbox sender).
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const body = req.body || {};
  const clean = (v, max) => String(v ?? '').trim().slice(0, max);

  const name = clean(body.name, 120);
  const email = clean(body.email, 180);
  const company = clean(body.company, 180);
  const message = clean(body.message, 5000);
  const services = Array.isArray(body.services) ? body.services.map(s => clean(s, 60)).filter(Boolean) : [];
  const honeypot = clean(body._hp, 200);

  // Bots fill hidden fields; pretend success without sending anything.
  if (honeypot) return res.status(200).json({ ok: true });

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !emailPattern.test(email) || message.length < 10) {
    return res.status(400).json({ error: 'Preenche o nome, um email válido e uma mensagem com pelo menos 10 caracteres.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return res.status(500).json({ error: 'O envio de emails ainda não está configurado.' });
  }

  const servicesLabel = services.join(', ') || 'A definir';
  const text = `Novo pedido de contacto via kepptrust\n\nNome: ${name}\nEmail: ${email}\nEmpresa: ${company || 'Não indicada'}\nInteresse: ${servicesLabel}\n\nMensagem:\n${message}`;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'KeppTrust <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `Novo contacto: ${name}`,
        text,
      }),
    });

    if (!resendRes.ok) {
      console.error('Resend error', resendRes.status, await resendRes.text());
      return res.status(502).json({ error: 'Não foi possível enviar a mensagem.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form error', err);
    return res.status(500).json({ error: 'Erro inesperado ao enviar a mensagem.' });
  }
}
