# ccx 样例
tools/ccx.sh --prompt prompts/frontend/prompt-editor.txt --ctx prompts-detailed/frontend/editor.md docs/frontend/04-editor-wireframe.md --agents prompts/agents.json
tools/ccx.sh --prompt prompts/frontend/prompt-ngxs.txt   --ctx prompts-detailed/frontend/ngxs.md  docs/frontend/03-ngxs.md             --agents prompts/agents.json
tools/ccx.sh --prompt prompts/frontend/prompt-i18n-seo.txt --ctx prompts-detailed/frontend/i18n-seo-mdx.md docs/content/20-mdx-prerender.md --agents prompts/agents.json
