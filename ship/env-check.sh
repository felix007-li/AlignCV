#!/usr/bin/env bash
set -euo pipefail
MISS=0
for k in STRIPE_SECRET STRIPE_WEBHOOK_SECRET VERCEL_TOKEN VERCEL_PROJECT_ID VERCEL_ORG_ID FLY_API_TOKEN; do
  if [[ -z "${!k:-}" ]]; then echo "Missing $k"; MISS=1; fi
done
if [[ "$MISS" -eq 1 ]]; then echo "❌ Missing required env. Export above vars and retry."; exit 2; fi
echo "✅ Env OK"
