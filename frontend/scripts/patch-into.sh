#!/usr/bin/env bash
set -euo pipefail

APP_DIR=${1:-resume-suite}
if [ ! -d "$APP_DIR/src" ]; then
  echo "✗ $APP_DIR/src not found. Run inside your Angular project root or pass the path."
  exit 1
fi

echo "→ Copying components/pages/services/state into $APP_DIR/src"
rsync -a ./frontend/src/ "$APP_DIR/src/"

echo "→ Creating content assets under $APP_DIR/src/assets/content"
mkdir -p "$APP_DIR/src/assets/content"
rsync -a ./frontend/src/assets/content/ "$APP_DIR/src/assets/content/"

echo "→ i18n stays unchanged; you can update if needed."
echo "✓ Done. Start dev with: cd $APP_DIR && npm run dev"
