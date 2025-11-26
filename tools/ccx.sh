#!/usr/bin/env bash
set -euo pipefail
PROMPT_FILE=""; AGENTS_FILE="${AGENTS_FILE:-}"; CTX=()
while [[ $# -gt 0 ]]; do case "$1" in
  --prompt) PROMPT_FILE="$2"; shift 2;;
  --ctx) shift; while [[ $# -gt 0 && "$1" != "--agents" ]]; do CTX+=("$1"); shift; done;;
  --agents) AGENTS_FILE="$2"; shift 2;;
  *) echo "Unknown arg: $1"; exit 1;;
esac; done
[ -f "$PROMPT_FILE" ] || { echo "prompt missing: $PROMPT_FILE"; exit 1; }
CLAUDE_CMD="${CLAUDE_CMD:-claude}"
TMP="$(mktemp)"
{
  if [[ -f prompts/common-preface.txt ]]; then cat prompts/common-preface.txt; fi
  for f in "${CTX[@]}"; do
    echo; echo "----CTX $f----"; [ -f "$f" ] && cat "$f"; echo; echo "----END $f----";
  done
  echo; cat "$PROMPT_FILE"
} > "$TMP"
if [[ -n "$AGENTS_FILE" && -f "$AGENTS_FILE" ]]; then
  "$CLAUDE_CMD" -p "$(cat "$TMP")" --agents "$(cat "$AGENTS_FILE")" | node tools/apply-files-from-llm.mjs
else
  "$CLAUDE_CMD" -p "$(cat "$TMP")" | node tools/apply-files-from-llm.mjs
fi
rm -f "$TMP"
