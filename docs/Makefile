-include .env
FRONTEND_DIR ?= frontend
BACKEND_DIR  ?= backend
AGENTS_FILE  ?= prompts/agents.json

# CC-driven targets with detailed contexts
cc-ngxs:      ; @tools/ccx.sh --prompt prompts/frontend/prompt-ngxs.txt --ctx prompts-detailed/frontend/ngxs.md docs/frontend/03-ngxs.md docs/frontend/02-components.md --agents $(AGENTS_FILE)
cc-editor:    ; @tools/ccx.sh --prompt prompts/50-prompts-frontend.md --ctx prompts-detailed/frontend/editor.md docs/frontend/04-editor-wireframe.md docs/frontend/02-components.md --agents $(AGENTS_FILE)
cc-i18n:      ; @tools/ccx.sh --prompt prompts/frontend/prompt-i18n-seo.txt --ctx prompts-detailed/frontend/i18n-seo-mdx.md docs/frontend/05-frontend-routing-navigation.md docs/frontend/06-i18n-seo.md docs/content/20-mdx-prerender.md --agents $(AGENTS_FILE)
cc-pricing:   ; @tools/ccx.sh --prompt prompts/frontend/prompt-pricing.txt --ctx prompts-detailed/frontend/pricing-ab.md docs/backend/12-stripe.md docs/quality/31-analytics-ab.md --agents $(AGENTS_FILE)
cc-backend:   ; @tools/ccx.sh --prompt prompts/backend/prompt-backend.txt --ctx prompts-detailed/backend/fastify-stripe-ai-import.md docs/backend/10-arch.md docs/backend/11-apis.md docs/backend/12-stripe.md docs/backend/13-ai-jd.md docs/backend/14-importers.md --agents $(AGENTS_FILE)
cc-mdx:       ; @tools/ccx.sh --prompt prompts/content/prompt-mdx.txt --ctx prompts-detailed/frontend/i18n-seo-mdx.md docs/content-seo/20-content-mdx-and-prerender.md docs/content-seo/21-templates-tokens-thumbnails.md --agents $(AGENTS_FILE)
cc-checks:    ; @tools/ccx.sh --prompt prompts/ops/prompt-preflight.txt --ctx prompts-detailed/ops/preflight.md docs/ops/40-preflight.md --agents $(AGENTS_FILE)
cc-ship:      ; @tools/ccx.sh --prompt prompts/ops/prompt-ship.txt --ctx prompts-detailed/ops/ship.md docs/ops/50-ship.md docs/backend/12-stripe.md --agents $(AGENTS_FILE)

# Dev/build/deploy orchestration
fe-install: ; @cd $(FRONTEND_DIR) && npm i
fe-build:   ; @cd $(FRONTEND_DIR) && npm run build || npx -y @angular/cli@latest build --configuration=production || npm run build:prod
fe-start:   ; @cd $(FRONTEND_DIR) && npm run start

be-install: ; @cd $(BACKEND_DIR) && npm i
be-build:   ; @cd $(BACKEND_DIR) && npm run build || true
be-start:   ; @cd $(BACKEND_DIR) && npm run start

mdx-json:         ; @node scripts/mdx-to-json.mjs --in content --out dist-mdx/json --routes-out dist-mdx/prerender/routes.txt
prerender-routes: ; @node scripts/generate-prerender-routes.mjs --in dist-mdx/json --out dist-mdx/prerender/routes.txt
prerender-merge:  ; @node scripts/merge-prerender-routes.mjs --routes dist-mdx/prerender/routes.txt --angular frontend/angular.json

dev-all:    ; @npm run dev
build-all:  ; @make fe-build && make be-build && make mdx-json prerender-routes prerender-merge
deploy-all: ; @echo "Deploy FE via Vercel & BE via Fly (require secrets). See .github/workflows/*"
