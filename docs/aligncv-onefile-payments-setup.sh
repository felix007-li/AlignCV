#!/usr/bin/env bash
# AlignCV — ONE-FILE Payments & CI Setup
# Generated: 2025-11-14 15:44
# Usage:
#   bash aligncv-onefile-payments-setup.sh
# It will create (or overwrite) the following files relative to repo root:
#   backend/src/billing/stripe.ts
#   backend/src/billing/checkout.controller.ts
#   backend/src/billing/webhook.controller.ts
#   backend/src/healthz.ts
#   payments-tests/package.json
#   payments-tests/smoke.mjs
#   .github/workflows/payments-sandbox-smoke.yml
#   .github/workflows/fly-rolling-deploy.yml
#   .github/workflows/fly-rollback.yml
#   (keeps your existing server; see README notes printed at end)

set -euo pipefail

mkdir -p backend/src/billing backend/src .github/workflows payments-tests

# --- backend/src/billing/stripe.ts ---
cat > backend/src/billing/stripe.ts <<'TS'
import Stripe from 'stripe';

export type PlanKind = 'pass14' | 'monthly';
export type Currency = 'USD' | 'CAD' | 'MXN' | 'BRL' | 'CLP' | 'ARS';

// Mapping example — replace with your real Stripe price IDs
const PRICE_MAP: Record<PlanKind, Record<Currency, string>> = {
  pass14: { USD: 'price_pass14_usd', CAD: 'price_pass14_cad', MXN: 'price_pass14_mxn', BRL: 'price_pass14_brl', CLP: 'price_pass14_clp', ARS: 'price_pass14_ars' },
  monthly: { USD: 'price_monthly_usd', CAD: 'price_monthly_cad', MXN: 'price_monthly_mxn', BRL: 'price_monthly_brl', CLP: 'price_monthly_clp', ARS: 'price_monthly_ars' }
};

export function getPriceId(plan: PlanKind, currency: Currency): string {
  const pid = PRICE_MAP[plan]?.[currency];
  if (!pid) throw new Error(`Missing priceId for plan=${plan} currency=${currency}`);
  return pid;
}

let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (_stripe) return _stripe;
  const apiKey = process.env.STRIPE_SECRET;
  if (!apiKey) throw new Error('STRIPE_SECRET missing');
  const useMock = process.env.STRIPE_MOCK === 'true';
  const host = process.env.STRIPE_MOCK_HOST || '127.0.0.1';
  const port = Number(process.env.STRIPE_MOCK_PORT || 12111);

  _stripe = new Stripe(apiKey, {
    apiVersion: '2020-08-27',
    ...(useMock ? { host, port, protocol: 'http' as const } : {})
  });
  return _stripe;
}
TS

# --- backend/src/billing/checkout.controller.ts ---
cat > backend/src/billing/checkout.controller.ts <<'TS'
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { getStripeClient, getPriceId, PlanKind, Currency } from './stripe';

const CreateSchema = z.object({
  plan: z.enum(['pass14','monthly'] as [PlanKind, ...PlanKind[]]),
  currency: z.enum(['USD','CAD','MXN','BRL','CLP','ARS'] as [Currency, ...Currency[]]),
  success_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
});

export const checkoutController: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post('/api/checkout/create', async (req, reply) => {
    const parse = CreateSchema.safeParse(req.body);
    if (!parse.success) return reply.code(400).send({ error: 'invalid_body', details: parse.error.issues });
    const { plan, currency, success_url, cancel_url } = parse.data;

    const stripe = getStripeClient();
    const price = getPriceId(plan, currency);
    const origin = (req.headers['x-origin'] as string) || `http://localhost:5173`;
    const successUrl = success_url || `${origin}/payments/success`;
    const cancelUrl = cancel_url || `${origin}/payments/cancel`;

    const idemp = (req.headers['x-idempotency-key'] as string) || `sess_${Math.random().toString(36).slice(2)}`;

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      line_items: [{ price, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl
    }, { idempotencyKey: idemp });

    return reply.send({ url: session.url });
  });
};

export default checkoutController;
TS

# --- backend/src/billing/webhook.controller.ts ---
cat > backend/src/billing/webhook.controller.ts <<'TS'
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { getStripeClient } from './stripe';

// Ensure raw body support in Fastify for signature verification:
// app.addContentTypeParser('*', { parseAs: 'buffer' }, (req, body, done) => done(null, body));

export const webhookController: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post('/api/stripe/webhook', async (req, reply) => {
    const skipVerify = process.env.STRIPE_WEBHOOK_SKIP_VERIFY === '1';
    const stripe = getStripeClient();

    try {
      let event: any;
      if (skipVerify) {
        // CI/Mock mode: assume JSON already parsed
        event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      } else {
        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!sig || !webhookSecret) return reply.code(400).send({ error: 'missing_signature' });
        // @ts-ignore fastify rawBody type
        const raw = (req as any).rawBody ?? (req.body as any);
        event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
      }

      switch (event.type) {
        case 'checkout.session.completed':
          // TODO: mark license/plan active by customer/email
          break;
        case 'invoice.paid':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          // TODO: sync subscription status
          break;
        default:
          // ignore others
          break;
      }
      return reply.send({ received: true });
    } catch (err: any) {
      return reply.code(400).send({ error: 'webhook_error', message: err?.message });
    }
  });
};

export default webhookController;
TS

# --- backend/src/healthz.ts ---
cat > backend/src/healthz.ts <<'TS'
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

export const healthz: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get('/healthz', async () => ({ ok: true, ts: Date.now() }));
};

export default healthz;
TS

# --- payments-tests/package.json ---
cat > payments-tests/package.json <<'JSON'
{
  "name": "aligncv-payments-tests",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node smoke.mjs"
  },
  "dependencies": {
    "axios": "^1.7.7"
  }
}
JSON

# --- payments-tests/smoke.mjs ---
cat > payments-tests/smoke.mjs <<'JS'
import axios from 'axios';

const FRONTEND = process.env.FRONTEND_BASE_URL || '';
const BACKEND = process.env.BACKEND_BASE_URL || 'http://127.0.0.1:8080';

function log(...args){ console.log('[payments-smoke]', ...args); }

async function checkPricing() {
  if (!FRONTEND) { log('FRONTEND_BASE_URL not set, skip pricing page check'); return; }
  const url = FRONTEND.replace(/\/$/, '') + '/pricing';
  log('GET', url);
  const res = await axios.get(url, { validateStatus: () => true });
  if (res.status < 200 || res.status >= 300) throw new Error('pricing page non-2xx: ' + res.status);
  log('pricing page OK');
}

async function createCheckout() {
  const url = BACKEND.replace(/\/$/, '') + '/api/checkout/create';
  log('POST', url);
  const payload = { plan: 'pass14', currency: 'USD' };
  const res = await axios.post(url, payload, { validateStatus: () => true });
  if (res.status < 200 || res.status >= 300) throw new Error('checkout create non-2xx: ' + res.status + ' body=' + JSON.stringify(res.data));
  if (!res.data || !res.data.url) throw new Error('response missing url');
  log('checkout created:', res.data.url);
}

async function simulateWebhook() {
  const url = BACKEND.replace(/\/$/, '') + '/api/stripe/webhook';
  log('POST webhook', url);
  const event = {
    id: 'evt_test_checkout_completed',
    type: 'checkout.session.completed',
    api_version: '2020-08-27',
    created: Math.floor(Date.now()/1000),
    data: {
      object: {
        id: 'cs_test_123',
        mode: 'payment',
        payment_status: 'paid',
        amount_total: 99,
        currency: 'usd'
      }
    },
    livemode: false,
    pending_webhooks: 1
  };
  const res = await axios.post(url, event, {
    headers: { 'Content-Type': 'application/json', 'Stripe-Signature': 't=0,v1=test' },
    validateStatus: () => true
  });
  if (res.status < 200 || res.status >= 300) throw new Error('webhook non-2xx: ' + res.status + ' body=' + JSON.stringify(res.data));
  log('webhook accepted');
}

(async () => {
  try {
    await checkPricing();
    await createCheckout();
    await simulateWebhook();
    log('ALL GREEN');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
JS

# --- .github/workflows/payments-sandbox-smoke.yml ---
cat > .github/workflows/payments-sandbox-smoke.yml <<'YML'
name: payments-sandbox-smoke
on:
  push:
    branches: [ main, master ]
    paths:
      - 'apps/backend/**'
      - 'backend/**'
      - 'apps/frontend/**'
      - 'frontend/**'
      - 'payments-tests/**'
      - '.github/workflows/payments-sandbox-smoke.yml'
  pull_request:
    paths:
      - 'apps/backend/**'
      - 'backend/**'
      - 'apps/frontend/**'
      - 'frontend/**'
      - 'payments-tests/**'
      - '.github/workflows/payments-sandbox-smoke.yml'
  workflow_dispatch:

jobs:
  smoke:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    services:
      stripe-mock:
        image: stripe/stripe-mock:latest
        ports: [ '12111:12111', '12112:12112' ]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Locate backend dir
        id: backdir
        run: |
          if [ -d "apps/backend" ]; then echo "dir=apps/backend" >> $GITHUB_OUTPUT; elif [ -d "backend" ]; then echo "dir=backend" >> $GITHUB_OUTPUT; else echo "No backend dir found"; exit 1; fi

      - name: Install & build backend
        working-directory: ${{ steps.backdir.outputs.dir }}
        run: |
          npm ci || npm i
          npm run build || true

      - name: Start backend (best-effort)
        env:
          PORT: 8080
          STRIPE_SECRET: sk_test_xxx
          STRIPE_WEBHOOK_SECRET: whsec_test
          STRIPE_MOCK: "true"
          STRIPE_MOCK_HOST: 127.0.0.1
          STRIPE_MOCK_PORT: "12111"
          STRIPE_WEBHOOK_SKIP_VERIFY: "1"
        run: |
          set -e
          DIR="${{ steps.backdir.outputs.dir }}"
          (cd "$DIR" && npm run start:ci) &
          sleep 8
          if ! curl -sSf "http://127.0.0.1:8080/healthz" >/dev/null; then
            echo "start:ci not responding, try npm start"
            pkill -f "$DIR" || true
            (cd "$DIR" && npm start) &
            sleep 8
          fi
          if ! curl -s "http://127.0.0.1:8080/healthz" >/dev/null; then
            echo "try node dist"
            pkill -f "$DIR" || true
            if [ -f "$DIR/dist/main.js" ]; then (cd "$DIR" && node dist/main.js) & else echo "no dist main.js"; fi
            sleep 8
          fi

      - name: Locate frontend dir (optional)
        id: frontdir
        run: |
          if [ -d "apps/frontend" ]; then echo "dir=apps/frontend" >> $GITHUB_OUTPUT; elif [ -d "frontend" ]; then echo "dir=frontend" >> $GITHUB_OUTPUT; else echo "dir=" >> $GITHUB_OUTPUT; fi

      - name: Build & serve frontend (if any)
        if: steps.frontdir.outputs.dir != ''
        env:
          FRONT_DIR: ${{ steps.frontdir.outputs.dir }}
        run: |
          set -e
          cd "$FRONT_DIR"
          npm ci || npm i
          npm run build || npx -y @angular/cli@latest build --configuration=production || npm run build:prod || true
          cd -
          DIST="$FRONT_DIR/dist"
          CAND=$(ls -d $DIST/*/browser 2>/dev/null | head -n1 || true)
          ROOTDIR=${CAND:-$DIST}
          echo "Serving from: $ROOTDIR"
          npx http-server "$ROOTDIR" -p 5174 --silent &
          npx wait-on http://127.0.0.1:5174 || true

      - name: Run payments smoke
        working-directory: payments-tests
        env:
          FRONTEND_BASE_URL: http://127.0.0.1:5174
          BACKEND_BASE_URL: http://127.0.0.1:8080
        run: |
          npm i
          node smoke.mjs
YML

# --- .github/workflows/fly-rolling-deploy.yml ---
cat > .github/workflows/fly-rolling-deploy.yml <<'YML'
name: fly-rolling-deploy
on:
  push:
    branches: [ main, master ]
    paths:
      - 'apps/backend/**'
      - 'backend/**'
      - 'Dockerfile'
      - '.github/workflows/fly-rolling-deploy.yml'
  workflow_dispatch:
    inputs:
      app:
        description: 'Fly app name (overrides secret)'
        required: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - name: Resolve app name
        id: vars
        run: |
          APP="${{ github.event.inputs.app }}"
          if [ -z "$APP" ]; then APP="${{ secrets.FLY_APP_NAME }}"; fi
          if [ -z "$APP" ]; then echo "::error::No app name provided (input app or secret FLY_APP_NAME)"; exit 1; fi
          echo "app=$APP" >> $GITHUB_OUTPUT
      - name: Deploy (rolling)
        env: { FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }} }
        run: |
          flyctl status -a "${{ steps.vars.outputs.app }}" || true
          flyctl deploy -a "${{ steps.vars.outputs.app }}" --remote-only --strategy rolling --detach
      - name: Show releases
        env: { FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }} }
        run: flyctl releases -a "${{ steps.vars.outputs.app }}"
YML

# --- .github/workflows/fly-rollback.yml ---
cat > .github/workflows/fly-rollback.yml <<'YML'
name: fly-rollback
on:
  workflow_dispatch:
    inputs:
      app:
        description: 'Fly app name (overrides secret)'
        required: false
      target_version:
        description: 'Release version to rollback to (optional; default = previous release)'
        required: false

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - name: Resolve app name
        id: vars
        run: |
          APP="${{ github.event.inputs.app }}"
          if [ -z "$APP" ]; then APP="${{ secrets.FLY_APP_NAME }}"; fi
          if [ -z "$APP" ]; then echo "::error::No app name provided (input app or secret FLY_APP_NAME)"; exit 1; fi
          echo "app=$APP" >> $GITHUB_OUTPUT
      - name: Determine target version
        id: ver
        env: { FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }} }
        run: |
          set -e
          APP="${{ steps.vars.outputs.app }}"
          TARGET="${{ github.event.inputs.target_version }}"
          if [ -z "$TARGET" ]; then
            echo "Fetching previous release for $APP"
            PREV=$(flyctl releases -a "$APP" --json | jq -r '.[1].Version // .[1].version // empty')
            if [ -z "$PREV" ]; then echo "::error::Cannot determine previous release"; exit 1; fi
            TARGET="$PREV"
          fi
          echo "version=$TARGET" >> $GITHUB_OUTPUT
      - name: Rollback
        env: { FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }} }
        run: |
          set -e
          APP="${{ steps.vars.outputs.app }}"
          VER="${{ steps.ver.outputs.version }}"
          echo "Rolling back $APP to version $VER"
          flyctl rollback -a "$APP" "$VER" || flyctl restore -a "$APP" --release-id "$VER"
      - name: Show releases
        env: { FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }} }
        run: flyctl releases -a "${{ steps.vars.outputs.app }}"
YML

echo "✅ Done. Created files:"
find backend/src/billing -maxdepth 1 -type f -print
find .github/workflows -maxdepth 1 -type f -print
find payments-tests -maxdepth 1 -type f -print

cat <<'NEXT'

---
Next steps:

1) 将 PRICE_MAP 替换为你在 Stripe Dashboard 创建的真实 price IDs：backend/src/billing/stripe.ts
2) 在你的 Fastify 服务器中注册路由（示例）：
   import fastify from 'fastify';
   import checkoutController from './billing/checkout.controller';
   import webhookController from './billing/webhook.controller';
   import healthz from './healthz';

   const app = fastify({ logger: true });
   // raw body parser for webhook (if不跳过 verify)
   app.addContentTypeParser('*', { parseAs: 'buffer' }, (req, body, done) => done(null, body));
   app.register(healthz);
   app.register(checkoutController);
   app.register(webhookController);

   app.listen({ port: Number(process.env.PORT || 8080), host: '0.0.0.0' });

3) CI 环境使用的关键变量：
   STRIPE_SECRET, STRIPE_WEBHOOK_SECRET, STRIPE_MOCK, STRIPE_MOCK_HOST, STRIPE_MOCK_PORT, STRIPE_WEBHOOK_SKIP_VERIFY

4) 运行支付冒烟测试：
   # 后端本地 8080 端口已起
   cd payments-tests && npm i && BACKEND_BASE_URL=http://127.0.0.1:8080 npm test

5) 如需 Fly.io 部署/回滚：在仓库 Secrets 配置 FLY_API_TOKEN 与 FLY_APP_NAME。

---
ONE-FILE setup finished.
NEXT
