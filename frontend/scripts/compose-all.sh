#!/usr/bin/env bash
set -euo pipefail

APP_NAME=${1:-resume-suite}

# Create Angular app if not exists (SSR + PWA + Tailwind)
if [ ! -d "$APP_NAME" ]; then
  echo "[init] Creating Angular app $APP_NAME"
  npm i -g @angular/cli@latest
  ng new "$APP_NAME" --standalone --routing --style=scss --strict
  cd "$APP_NAME"
  ng add @angular/ssr --skip-confirmation
  ng add @angular/pwa --skip-confirmation
  npm i -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  cat > tailwind.config.js <<'TW'
module.exports = { content: ['./src/**/*.{html,ts}'], theme: { extend: {} }, plugins: [] };
TW
  sed -i.bak '1s;^;@tailwind base;\n@tailwind components;\n@tailwind utilities;\n;' src/styles.scss || true
  npm i @ngxs/store @ngxs/storage-plugin @ngxs/logger-plugin @angular/cdk @angular/material @ngneat/transloco @stripe/stripe-js
  cd - >/dev/null
fi

# Copy frontend & assets
echo "[copy] frontend → $APP_NAME/src"
rsync -a ./frontend/src/ "$APP_NAME/src/"
mkdir -p "$APP_NAME/src/assets/i18n"
rsync -a ./frontend/src/assets/i18n/ "$APP_NAME/src/assets/i18n/"

# Patch main.ts to use appConfig (idempotent)
MAIN="$APP_NAME/src/main.ts"
APP_CONFIG_IMPORT="import { appConfig } from './app/app.config';"
BOOTSTRAP_LINE="bootstrapApplication(AppComponent, appConfig)"
if ! grep -q "app.config" "$MAIN"; then
  sed -i.bak "1s|^|$APP_CONFIG_IMPORT\n|" "$MAIN"
  sed -i.bak "s/bootstrapApplication(AppComponent)/$BOOTSTRAP_LINE/" "$MAIN"
fi

# Backend deps
echo "[setup] backend"
pushd backend >/dev/null
npm i
popd >/dev/null

cat <<'NEXT'

All set!

Terminal A:
  cd backend
  cp .env.example .env   # 填写 Stripe/LLM 等密钥
  npm start              # http://localhost:8790

Terminal B:
  cd '"$APP_NAME"'
  npm i
  npm run dev            # http://localhost:4200/editor/demo

# 预渲染 SEO：
# node ./scripts/generate-prerender-routes.js > routes.txt
# npx ng run '"$APP_NAME"':prerender --routesFile=routes.txt

NEXT
