# RUNBOOK v1+（更详细）
更新：2025-11-15 05:41

- 统一协议：仅输出 **FILES/NOTES**，用 `tools/apply-files-from-llm.mjs` 落盘。
- 提示词优先级：`prompts-detailed/**` + 对应 `docs/**` 作为 CC 上下文。
- 失败/回滚：用 git 分支或 worktree；必要时 revert。
