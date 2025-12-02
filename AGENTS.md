# Repository Guidelines

## Project Structure & Module Organization
- `frontend/`: Angular app; core routes/components under `src/app` (components, pages, state, i18n, seo, ui); assets live in `src/assets`.
- `backend/`: Fastify + TypeScript API; entry at `src/index.ts`, feature modules in `src/modules`, shared utilities/config in `src/shared`, Prisma schema at `src/shared/database/schema.prisma`.
- `content/`, `dist-mdx/`, `docusaurus/`, `docs/`: marketing/docs content and prerender artifacts; `scripts/` holds content+route generators.
- `assets/`, `figma/`, `prompts*/`, `ship/`, `tools/`: design exports, agent prompts/runbooks, release/ops helpers.

## Build, Test, and Development Commands
- Install: `make fe-install` and `make be-install` (or `npm --prefix frontend|backend install`).
- Run both apps in dev: `npm run dev` (spawns Angular at 4200 + Fastify via tsx).
- Frontend: `npm --prefix frontend run start`; build with `npm --prefix frontend run build` or `build:prod`.
- Backend: `npm --prefix backend run dev` for watch mode; build with `npm --prefix backend run build`; run compiled server via `npm --prefix backend run start`.
- Formatting/linting: `npm run format` / `npm run format:check` at root; `npm --prefix backend run lint` and `typecheck`; `npm --prefix frontend run typecheck`.
- Content prerender pipeline: `make prerender-all` (MDX to JSON + route manifests); `make build-all` chains FE/BE builds and prerender merge.

## Coding Style & Naming Conventions
- TypeScript-first across frontend and backend; keep modules small and typed.
- Prettier is the formatter of record; run before committing. Stick to 2-space indentation, trailing commas, and single quotes where applicable.
- Filenames in kebab-case; Angular components/services/pipes in PascalCase classes; functions/vars camelCase; env keys UPPER_SNAKE_CASE.
- Keep UI strings in `i18n`/content files; avoid hardcoding; place shared UI primitives in `src/app/ui`.

## Testing Guidelines
- Automated tests are minimal today—prioritize adding targeted specs alongside changes. Use `*.spec.ts` near the code (Angular TestBed for UI/services; backend unit/integration around Fastify handlers and Prisma data flows).
- Favor type safety (`typecheck` scripts) and lightweight unit coverage over brittle E2E. When adding DB logic, include migration-safe tests against a transient database and validate zod schemas.
- Document manual test notes in PRs until stable suites exist.

## Commit & Pull Request Guidelines
- Commit style in history is short, present-tense, and imperative (e.g., “optimize preview-pane component”); keep scopes concise and focused.
- PRs should explain intent, list test/formatting commands run, and call out migrations, env additions, or Stripe/AI config changes. Attach UI screenshots or short clips for visible changes and note any content/regeneration commands used.
- Keep diffs small and cohesive; link tracking issues when relevant and ensure lint/format/typecheck pass before review.

## Security & Configuration Tips
- Never commit secrets; rely on local `.env` files read by `backend/src/shared/config/environment.ts`. Add sample keys to docs, not code.
- Run Prisma workflows (`npm --prefix backend run prisma:generate` / `prisma:migrate`) when changing the schema; include migration filenames in PR notes.
- Sanitize user-uploaded resumes and log with `pino`; avoid verbose logs in production builds.
