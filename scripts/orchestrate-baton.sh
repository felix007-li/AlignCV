#!/usr/bin/env bash
set -euo pipefail
tools/ccx.sh --prompt prompts/subagents/prompt-frontend-agent.txt --ctx prompts-detailed/frontend/editor.md docs/frontend/02-components.md --agents prompts/agents.json
tools/ccx.sh --prompt prompts/subagents/prompt-ops-preflight-agent.txt --ctx prompts-detailed/ops/preflight.md docs/ops/40-preflight.md --agents prompts/agents.json
echo "[ok] baton pass done"
