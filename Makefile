-include .env
FRONTEND_DIR ?= frontend
BACKEND_DIR  ?= backend
AGENTS_FILE  ?= prompts/agents.json

# CC with detailed contexts
cc-ngxs:      ; @tools/ccx.sh --prompt prompts/frontend/prompt-ngxs.txt --ctx prompts-detailed/frontend/ngxs.md docs/frontend/03-ngxs.md docs/frontend/02-components.md --agents $(AGENTS_FILE)
cc-editor:    ; @tools/ccx.sh --prompt prompts/frontend/prompt-editor.txt --ctx prompts-detailed/frontend/editor.md docs/frontend/04-editor-wireframe.md docs/frontend/02-components.md --agents $(AGENTS_FILE)
cc-i18n:      ; @tools/ccx.sh --prompt prompts/frontend/prompt-i18n-seo.txt --ctx prompts-detailed/frontend/i18n-seo-mdx.md docs/frontend/05-routing.md docs/frontend/06-i18n-seo.md docs/content/20-mdx-prerender.md --agents $(AGENTS_FILE)
cc-pricing:   ; @tools/ccx.sh --prompt prompts/frontend/prompt-pricing.txt --ctx prompts-detailed/frontend/pricing-ab.md docs/backend/12-stripe.md docs/quality/31-analytics-ab.md --agents $(AGENTS_FILE)
cc-backend:   ; @tools/ccx.sh --prompt prompts/backend/prompt-backend.txt --ctx prompts-detailed/backend/fastify-stripe-ai-import.md docs/backend/10-arch.md docs/backend/11-apis.md docs/backend/12-stripe.md docs/backend/13-ai-jd.md docs/backend/14-importers.md --agents $(AGENTS_FILE)
cc-mdx:       ; @tools/ccx.sh --prompt prompts/content/prompt-mdx.txt --ctx prompts-detailed/frontend/i18n-seo-mdx.md docs/content/20-mdx-prerender.md docs/content/21-templates-tokens.md --agents $(AGENTS_FILE)
cc-checks:    ; @tools/ccx.sh --prompt prompts/ops/prompt-preflight.txt --ctx prompts-detailed/ops/preflight.md docs/ops/40-preflight.md --agents $(AGENTS_FILE)
cc-ship:      ; @tools/ccx.sh --prompt prompts/ops/prompt-ship.txt --ctx prompts-detailed/ops/ship.md docs/ops/50-ship.md docs/backend/12-stripe.md --agents $(AGENTS_FILE)

# Subagents
cc-review-gate:      ; @tools/ccx.sh --prompt prompts/subagents/prompt-reviewer-agent.txt    --ctx RUNBOOK-CC-v1-PLUS.md --agents $(AGENTS_FILE)
cc-security:         ; @tools/ccx.sh --prompt prompts/subagents/prompt-security-agent.txt    --ctx prompts-detailed/ops/preflight.md docs/backend/12-stripe.md --agents $(AGENTS_FILE)
cc-e2e:              ; @tools/ccx.sh --prompt prompts/subagents/prompt-e2e-agent.txt         --ctx prompts-detailed/ops/preflight.md --agents $(AGENTS_FILE)
cc-release-notes:    ; @tools/ccx.sh --prompt prompts/subagents/prompt-release-mgr-agent.txt --ctx prompts-detailed/ops/ship.md ship/rollback.md --agents $(AGENTS_FILE)
cc-orchestrate-baton:; @scripts/orchestrate-baton.sh

# Dev/build/prerender
fe-install: ; @cd $(FRONTEND_DIR) && npm i
fe-build:   ; @cd $(FRONTEND_DIR) && npm run build || npx -y @angular/cli@latest build --configuration=production || npm run build:prod
fe-start:   ; @cd $(FRONTEND_DIR) && npm run start

be-install: ; @cd $(BACKEND_DIR) && npm i
be-build:   ; @cd $(BACKEND_DIR) && npm run build || true
be-start:   ; @cd $(BACKEND_DIR) && npm run start

mdx-json:         ; @node scripts/mdx-to-json.mjs --in content --out dist-mdx/json --routes-out dist-mdx/prerender/routes.txt
prerender-routes: ; @node scripts/generate-prerender-routes.mjs --in dist-mdx/json --out dist-mdx/prerender/routes.txt
prerender-manifest: ; @node scripts/generate-routes-from-manifest.mjs --manifest frontend/src/assets/content/manifest.json --out dist-mdx/prerender/routes-from-manifest.txt
prerender-all:    ; @make mdx-json && make prerender-routes && make prerender-manifest && cat dist-mdx/prerender/routes.txt dist-mdx/prerender/routes-from-manifest.txt | sort -u > dist-mdx/prerender/all-routes.txt && echo "[combined] $$(wc -l < dist-mdx/prerender/all-routes.txt) routes"
prerender-merge:  ; @node scripts/merge-prerender-routes.mjs --routes dist-mdx/prerender/routes.txt --angular frontend/angular.json
prerender-merge-all: ; @node scripts/merge-prerender-routes.mjs --routes dist-mdx/prerender/all-routes.txt --angular frontend/angular.json
generate-content: ; @node scripts/generate-additional-content.mjs

dev-all:    ; @npm run dev
build-all:  ; @make fe-build && make be-build && make prerender-all && make prerender-merge-all
deploy-all: ; @echo "Deploy FE via Vercel & BE via Fly (configure secrets)."
