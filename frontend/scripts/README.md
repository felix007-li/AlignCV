# SSR Prerender Helper

This patch provides:
- `scripts/routes-from-manifest.js`: read your generated `manifest.json` and emit a routes list that includes **3‑segment** and **5‑segment** content routes.
- `scripts/prerender.sh`: one‑liner to generate routes.txt and run Angular prerender.

## Quick use
```bash
# unzip beside your Angular app folder (e.g., 'resume-suite')
bash ./scripts/prerender.sh resume-suite ./resume-suite/src/assets/content/manifest.json routes.txt
# or:
node ./scripts/routes-from-manifest.js --app=resume-suite --manifest=./resume-suite/src/assets/content/manifest.json --out=routes.txt
npx ng run resume-suite:prerender --routesFile=routes.txt
```
If `manifest.json` is missing, the helper will recursively scan `./<app>/src/assets/content` for `.json` files and derive routes.
