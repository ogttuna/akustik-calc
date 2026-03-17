# DynEcho Project Plan

## 1. Product Direction

DynEcho will be built as a web product first.

Reasoning:

- The immediate commercial path is SaaS.
- Browser delivery removes installation friction.
- Team workflows, billing, auth, sharing, and analytics fit the web model naturally.
- The current source application is already browser-oriented, so migration risk is lower.

Desktop is not a v1 requirement, but the architecture will leave that option open.

## 2. Non-Negotiable Constraints

### 2.1 Source Repo Rule

`/home/ogttuna/Dev/Machinity/Acoustic2` is still actively evolving, especially around `Ln,w`.

That repo must be treated as upstream and must not be modified from this project.

Rules:

- Do not edit files inside `Acoustic2`.
- Do not move `Acoustic2` files in place.
- Do not build this project by importing files directly from the live upstream path at runtime.
- Do not use symlinks to point this repo into `Acoustic2`.
- Do not create a fragile shared-code setup between the two repos while upstream is still changing.

Upstream changes are adopted only by deliberate import/porting work. See `docs/SOURCE_REPO_POLICY.md`.

### 2.2 Engine Rule

The engine must always remain portable.

The engine package must have:

- zero DOM usage
- zero React usage
- zero Next.js usage
- zero database imports
- zero Stripe/Auth imports

The engine must run in:

- browser
- server
- tests
- CLI
- future desktop app

## 3. Recommended Stack

## 3.1 Monorepo

- `pnpm` workspaces
- `Turborepo`

Why:

- clean package boundaries
- fast incremental builds
- good fit for `apps/*` + `packages/*`

## 3.2 Language and Validation

- `TypeScript` with `strict: true`
- `zod` for runtime boundary validation

Why:

- the domain surface is large and getting larger
- migration from untyped JS needs hard boundaries

## 3.3 Web App

- `Next.js 15` App Router

Why:

- web app + marketing site in one deployment
- easy Vercel hosting
- route handlers/server actions available when needed

## 3.4 UI

- `Tailwind CSS`
- `shadcn/ui`
- shared UI primitives in a reusable package

Why:

- fast implementation without locking the product into a rigid component vendor
- enough control for dense engineering UI

## 3.5 State and Data Fetching

- `Zustand` for client application state
- simple server boundaries via `Next.js` route handlers and server actions

Decision:

- no `tRPC` in v1

Reason:

- the main migration risk is domain separation, not API typing
- `tRPC` is optional complexity at this stage

## 3.6 Charts and Reporting

- `Recharts` for charts
- PDF/report export decision deferred until the first app shell is stable

Likely direction later:

- HTML-to-PDF server export for SaaS reports
- client-side chart image export where needed

## 3.7 Database and Auth

- `Supabase` for PostgreSQL + Auth
- `Prisma` for schema and data access

Decision:

- database and auth are Phase 4 concerns, not Phase 0

## 3.8 Billing and Monitoring

- `Stripe Billing`
- `Sentry`
- `Vercel Analytics`

Decision:

- add only after the first authenticated app flow exists

## 3.9 Testing

- `Vitest` for unit/integration
- `Playwright` for E2E

## 4. Repository Shape

```text
dynecho/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── apps/
│   ├── web/
│   └── desktop/                # future, not created in v1 unless needed
├── packages/
│   ├── engine/
│   ├── catalogs/
│   ├── shared/
│   └── ui/
└── tooling/
    ├── eslint/
    └── tsconfig/
```

Package intent:

- `packages/engine`: pure acoustic calculations and domain algorithms
- `packages/catalogs`: typed source catalogs and source metadata
- `packages/shared`: shared types, schemas, constants, feature flags
- `packages/ui`: reusable client components and design primitives
- `apps/web`: SaaS app, auth, dashboard, project CRUD, billing
- `apps/desktop`: future desktop shell if justified

## 5. Desktop-Ready Strategy

The project should be web-first, not desktop-first.

That means:

- do not distort v1 architecture around hypothetical desktop needs
- do keep core logic portable so desktop stays feasible later

Guardrails:

- domain logic goes in `packages/engine`
- domain schemas go in `packages/shared`
- reusable client UI can live in `packages/ui`
- Next-specific server code stays inside `apps/web`
- browser storage, auth, payments, analytics stay outside portable packages

If a desktop app is later justified:

- preferred direction: `Tauri` + React app in `apps/desktop`
- reuse `engine`, `shared`, and selected `ui` parts
- do not reuse Next server code directly in desktop

Why `Tauri` over `Electron` as the default assumption:

- smaller runtime footprint
- good fit if the desktop app becomes a premium engineering tool

This is not a locked decision. It is a future option, not a current commitment.

## 6. Current Source Assessment

The current upstream source repo contains:

- a very large browser UI controller in `app.js`
- a calculation core in `core.js`
- separate catalog files
- a Node CLI path
- a sizeable test suite

What this means for migration:

- engine extraction is feasible
- UI migration is the largest cost center
- typed catalog extraction is moderate risk
- test migration is not just a package move; it also requires harness cleanup

Observed implications:

- `core.js` already runs in Node and browser style environments
- `app.js` is strongly tied to `window`, `document`, and `localStorage`
- the source test suite is heavy and should not be assumed ready for direct drop-in migration

## 7. Phase Plan

## Phase 0: Planning and Monorepo Scaffold

Deliverables:

- repo scaffold
- shared TS config
- shared ESLint config
- CI skeleton
- documentation baseline

Do not do yet:

- auth
- billing
- production database schema
- desktop app

Exit criteria:

- workspace installs cleanly
- build/lint/test commands exist
- package boundaries are explicit

## Phase 1: Engine Extraction

Goal:

- turn the calculation core into `packages/engine`

Tasks:

- split `core.js` into TypeScript modules
- define stable public API
- remove UMD-era packaging from internal source
- isolate pure functions from file-local globals
- make catalogs injectable where useful
- add `Vitest` coverage for the public API

Important:

- preserve behavior before improving formulas
- do not refactor algorithm semantics and architecture at the same time

Exit criteria:

- engine builds independently
- engine tests pass without web app context
- CLI-style invocation works against package API

## Phase 2: Catalog Extraction

Goal:

- turn source catalogs into typed data packages

Tasks:

- migrate material catalogs
- migrate verified assembly catalogs
- migrate impact/Ln,w related catalogs
- attach source metadata and trust tier metadata in typed form
- normalize IDs and enum-like fields

Exit criteria:

- catalogs compile as TypeScript
- engine imports typed catalog data through stable boundaries
- source provenance is preserved

## Phase 3: Web Shell

Goal:

- create the first usable web app

Tasks:

- Next.js app shell
- layout, navigation, landing page
- app workspace shell
- calculator page shell
- basic result rendering

Decision:

- ship one focused calculation workflow first
- do not migrate the entire source UI in one pass

Exit criteria:

- users can load the app and run at least one real workflow

## Phase 4: Auth and Project Persistence

Goal:

- authenticated users and saved projects

Tasks:

- Supabase Auth
- Prisma schema
- protected routes
- project create/save/load/update

Suggested initial schema:

- `User`
- `Project`
- `Subscription`

Do not add team collaboration yet unless needed for an active milestone.

## Phase 5: UI Migration

Goal:

- progressively replace legacy UI behaviors with React UI

Tasks:

- layer editor
- dynamic inputs
- result panels
- comparison views
- source trace views
- export/report UX

This is the largest phase.

Rules:

- move workflow by workflow
- avoid porting legacy DOM code line-for-line
- redesign interaction structure where the current controller is too coupled

## Phase 6: Billing and Feature Gating

Goal:

- commercial SaaS controls

Tasks:

- Stripe checkout
- subscription sync
- feature gates
- usage and plan checks

## Phase 7: Collaboration and Team Features

Goal:

- unlock team value if the product requires it

Possible tasks:

- shared projects
- org/team membership
- permission model
- catalog overrides by account

This phase is optional until product demand is proven.

## Phase 8: E2E, Hardening, Release Readiness

Tasks:

- Playwright coverage for critical flows
- error handling polish
- loading/empty/error states
- audit logging where needed
- release checklist

## 8. What We Will Not Do Early

- no microservices
- no Redis
- no queue system
- no Kubernetes
- no separate backend repo
- no submodule dependency on `Acoustic2`
- no desktop build in the first implementation phase

## 9. Delivery Strategy

Release strategy:

1. Get the engine and typed catalogs under control.
2. Ship a narrow but real web workflow.
3. Add auth and saved projects.
4. Add billing only when the app has durable value.

This sequence reduces migration risk and avoids building SaaS infrastructure around unstable foundations.

## 10. Success Criteria

Technical success means:

- engine can be versioned independently
- web app can call the engine without leaking framework concerns into it
- source imports from `Acoustic2` are deliberate and traceable
- later desktop work remains possible without redoing the engine

Product success means:

- users can run calculations reliably
- save projects
- understand results
- trust source provenance
- pay only for features that already work
