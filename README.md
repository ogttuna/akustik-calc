# DynEcho

This repository is the new product track for DynEcho.

Current scope:

- Build a production web application around the existing acoustic calculation domain.
- Keep the calculation engine portable so it can later power a desktop app.
- Treat `/home/ogttuna/Dev/Machinity/Acoustic2` as an external upstream source, not as a working directory for this repo.

Project status:

- Monorepo scaffold is in place.
- A first web shell exists in `apps/web`.
- A seed `engine`, `catalogs`, `shared`, and `ui` package set exists.
- Docker build and compose structure exist.
- The web app now has auth-gated workbench flows and proposal PDF/DOCX export.
- Server-backed project storage v1 is available through explicit
  workbench sync/list/load; editing remains local-first.
- Project access roles/actions now have a shared pure policy contract,
  but project/proposal routes remain owner-scoped; route integration is
  deferred while the active slice returns to calculator accuracy and
  coverage.
- No code should be copied from `Acoustic2` until the import policy in [`docs/foundation/SOURCE_REPO_POLICY.md`](./docs/foundation/SOURCE_REPO_POLICY.md) is followed.

Primary documents (agent resume triangle):

- [`docs/calculator/CURRENT_STATE.md`](./docs/calculator/CURRENT_STATE.md) — current snapshot
- [`docs/calculator/MASTER_PLAN.md`](./docs/calculator/MASTER_PLAN.md) — strategic roadmap + next ten moves
- [`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`](./docs/calculator/NEXT_IMPLEMENTATION_PLAN.md) — tactical slice detail

Supporting documents:

- [`docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md`](./docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_B_HANDOFF.md) — latest calculator checkpoint
- [`docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md`](./docs/calculator/SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md) — active wall source catalog acquisition slice plan
- [`docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md`](./docs/calculator/CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md) — prior wall source catalog checkpoint
- [`docs/calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md`](./docs/calculator/CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md) — prior broad revalidation checkpoint
- [`docs/calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md`](./docs/calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md) — team-access model checkpoint
- [`docs/calculator/CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md`](./docs/calculator/CHECKPOINT_2026-04-23_AUTH_SESSION_HARDENING_HANDOFF.md) — auth-session hardening checkpoint
- [`docs/calculator/CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md`](./docs/calculator/CHECKPOINT_2026-04-23_PROJECT_ACCESS_AUTHORIZATION_HANDOFF.md) — project-access authorization checkpoint
- [`docs/calculator/CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md`](./docs/calculator/CHECKPOINT_2026-04-23_SERVER_BACKED_PROJECT_STORAGE_HANDOFF.md) — server-backed project storage checkpoint
- [`docs/calculator/CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md`](./docs/calculator/CHECKPOINT_2026-04-23_FINAL_AUDIT_HANDOFF.md) — prior final-audit checkpoint
- [`docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`](./docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md) — active productization roadmap
- [`docs/calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md`](./docs/calculator/SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md) — closed wall formula-family widening slice plan
- [`docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md`](./docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md) — deferred project-access policy route integration slice plan
- [`docs/calculator/SLICE_TEAM_ACCESS_MODEL_PLAN.md`](./docs/calculator/SLICE_TEAM_ACCESS_MODEL_PLAN.md) — closed team-access model slice plan
- [`docs/calculator/SLICE_AUTH_SESSION_HARDENING_PLAN.md`](./docs/calculator/SLICE_AUTH_SESSION_HARDENING_PLAN.md) — closed auth-session hardening slice plan
- [`docs/calculator/SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md`](./docs/calculator/SLICE_PROJECT_ACCESS_AUTHORIZATION_PLAN.md) — closed project-access slice plan
- [`docs/calculator/SLICE_SERVER_BACKED_PROJECT_STORAGE_PLAN.md`](./docs/calculator/SLICE_SERVER_BACKED_PROJECT_STORAGE_PLAN.md) — closed project-storage slice plan
- [`docs/calculator/SYSTEM_MAP.md`](./docs/calculator/SYSTEM_MAP.md) — runtime and test-surface map
- [`docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`](./docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md) — answer-origin semantics
- [`docs/README.md`](./docs/README.md) — docs hierarchy entry point
- [`docs/foundation/PROJECT_PLAN.md`](./docs/foundation/PROJECT_PLAN.md)
- [`docs/foundation/SOURCE_REPO_POLICY.md`](./docs/foundation/SOURCE_REPO_POLICY.md)

Working principles:

- Web-first delivery.
- Desktop-ready architecture.
- Engine stays framework-free.
- No edits to `Acoustic2` from this project.

Run locally:

- `pnpm install`
- optional: set `DYNECHO_AUTH_USERNAME`, `DYNECHO_AUTH_PASSWORD`, and `DYNECHO_AUTH_SECRET`
- `pnpm dev`
- `pnpm calculator:gate:current`
- `pnpm check`
- `pnpm build`
- `pnpm e2e`
- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm engine:estimate --layers "concrete:100,gypsum_board:12.5"`
- `pnpm upstream:inventory`
- `pnpm upstream:estimate --layers "gypsum_board:12.5,rockwool:50,air_gap:50,concrete:100"`
- `pnpm upstream:compare`
- `pnpm upstream:status`
- `pnpm upstream:note`

Run with Docker:

- `docker build -t dynecho-web .`
- `docker compose up --build`

Useful endpoints:

- `GET /api/health`
- `POST /api/estimate`
- `POST /api/impact-only`
- `GET /api/projects`
- `POST /api/projects/import-local`
- `POST /api/proposal-pdf`
- `POST /api/proposal-docx`

Authentication:

- the landing page remains public
- when auth is configured, `/workbench`, `/workbench/proposal`,
  project APIs, estimate APIs, and proposal PDF/DOCX APIs require
  sign-in
- if auth env vars are not configured locally, the app falls back to preview mode instead of forcing login
- copy [`apps/web/.env.example`](./apps/web/.env.example) into your local env setup if you want authenticated local runs instead of preview mode

Agent workflow:

- read [`AGENTS.md`](./AGENTS.md) before changing calculator behavior
- use [`docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`](./docs/calculator/NEXT_IMPLEMENTATION_PLAN.md)
  as the current next-step authority
- run `pnpm calculator:gate:current` for the focused current-slice confidence
  gate

Read-only upstream tooling:

- `upstream:status` reads branch, SHA, and dirty working tree state from `Acoustic2`.
- `upstream:inventory` writes a snapshot report into `docs/imports` without modifying upstream.
- `upstream:estimate` runs a one-off estimate inside upstream for comparison work.
- `upstream:compare` compares seeded DynEcho estimates against upstream smoke cases.
