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
- No code should be copied from `Acoustic2` until the import policy in [`docs/SOURCE_REPO_POLICY.md`](./docs/SOURCE_REPO_POLICY.md) is followed.

Primary documents:

- [`docs/PROJECT_PLAN.md`](./docs/PROJECT_PLAN.md)
- [`docs/SOURCE_REPO_POLICY.md`](./docs/SOURCE_REPO_POLICY.md)

Working principles:

- Web-first delivery.
- Desktop-ready architecture.
- Engine stays framework-free.
- No edits to `Acoustic2` from this project.

Run locally:

- `pnpm install`
- set `DYNECHO_AUTH_USERNAME`, `DYNECHO_AUTH_PASSWORD`, and `DYNECHO_AUTH_SECRET` first
- `pnpm dev`
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

Authentication:

- the landing page remains public
- `/workbench`, `/workbench/proposal`, `POST /api/estimate`, `POST /api/impact-only`, and `POST /api/proposal-pdf` now require sign-in
- copy [`apps/web/.env.example`](./apps/web/.env.example) into your local env setup and replace the placeholder credentials before starting the web app

Read-only upstream tooling:

- `upstream:status` reads branch, SHA, and dirty working tree state from `Acoustic2`.
- `upstream:inventory` writes a snapshot report into `docs/imports` without modifying upstream.
- `upstream:estimate` runs a one-off estimate inside upstream for comparison work.
- `upstream:compare` compares seeded DynEcho estimates against upstream smoke cases.
