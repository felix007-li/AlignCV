#!/usr/bin/env bash
set -eo pipefail
APP=${1:-resume-suite}
MANIFEST=${2:-./$APP/src/assets/content/manifest.json}
OUT=${3:-routes.txt}

node ./scripts/routes-from-manifest.js --app="$APP" --manifest="$MANIFEST" --out="$OUT"

echo "[prerender] Starting Angular prerender for app: $APP"
npx ng run "$APP":prerender --routesFile="$OUT"
