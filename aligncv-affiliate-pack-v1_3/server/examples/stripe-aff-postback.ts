// server/examples/stripe-aff-postback.ts
import express from 'express';
import Stripe from 'stripe';
import crypto from 'crypto';
import fetch from 'node-fetch';

const app = express();
// Stripe needs the raw body to validate the signature:
app.use('/stripe/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });
const AFF_POSTBACK_URL = process.env.AFF_POSTBACK_URL!;        // e.g. https://api.aligncv.com/affiliates/postback
const AFF_POSTBACK_SECRET = process.env.AFF_POSTBACK_SECRET!;  // HMAC secret for signing
const STRIPE_WH = process.env.STRIPE_WEBHOOK_SECRET!;          // webhook signing secret from Stripe dashboard

// simple in-memory dedupe; replace with persistent store (Redis/DB)
const sent = new Set<string>();

function sign(body: string) {
  return crypto.createHmac('sha256', AFF_POSTBACK_SECRET).update(body).digest('hex');
}

async function sendPostback(payload: any) {
  const body = JSON.stringify(payload);
  const sig = sign(body);
  const res = await fetch(AFF_POSTBACK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-aff-signature': sig },
    body
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Postback failed: ${res.status} ${text}`);
  }
}

app.post('/stripe/webhook', async (req, res) => {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'] as string, STRIPE_WH);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object as Stripe.Checkout.Session;
      const partner_id = s.metadata?.partner_id;
      const click_id = s.metadata?.click_id;
      const amount = (s.amount_total ?? 0) / 100;
      const currency = (s.currency ?? 'cad').toUpperCase();
      const tx = s.id;
      if (partner_id && click_id && amount > 0 && !sent.has(tx)) {
        await sendPostback({ event: 'first_paid', partner_id, click_id, amount, currency, tx, ts: new Date().toISOString() });
        sent.add(tx);
      }
    }

    if (event.type === 'invoice.payment_succeeded') {
      const inv = event.data.object as Stripe.Invoice;
      // Only send first-paid (avoid sending renewals)
      const isFirstInvoice = inv.billing_reason === 'subscription_create';
      if (!isFirstInvoice) return res.json({ received: true });
      // pull metadata from subscription or invoice line item
      const line = inv.lines?.data?.[0];
      const md = (line?.metadata as any) || (inv.metadata as any) || {};
      const partner_id = md.partner_id;
      const click_id = md.click_id;
      const amount = (inv.amount_paid ?? 0) / 100;
      const currency = (inv.currency ?? 'cad').toUpperCase();
      const tx = inv.id;
      if (partner_id && click_id && amount > 0 && !sent.has(tx)) {
        await sendPostback({ event: 'first_paid', partner_id, click_id, amount, currency, tx, ts: new Date().toISOString() });
        sent.add(tx);
      }
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).send('Internal error');
  }
  res.json({ received: true });
});

app.get('/healthz', (_req, res) => res.send('ok'));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Stripe bridge on :${port}`));
