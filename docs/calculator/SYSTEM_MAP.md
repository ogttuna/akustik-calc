# System Map

Last reviewed: 2026-04-24

Document role:

- explain what the acoustic calculator product actually is today
- map the user flow to the real runtime and file boundaries
- separate engine truth, UI truth, API glue, persistence, and test surfaces
- give future agents one place to answer “how does the system work?” before
  changing solver, workbench, or docs

Use this together with the agent resume triangle:

- [CURRENT_STATE.md](./CURRENT_STATE.md) — snapshot (what just closed, what is selected)
- [MASTER_PLAN.md](./MASTER_PLAN.md) — strategic roadmap + implementation state grid (§3)
- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) — tactical slice detail
- [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md)
  — active calculator accuracy/coverage plan
- [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
  — deferred productization plan after calculator final audit

And:

- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)

## Product Contract

This repo is an acoustic calculator for floor and wall assemblies.

The user picks a study mode, builds a layer stack, fills any required context,
and requests outputs such as `Rw`, `R'w`, `DnT,w`, `Ln,w`, `L'n,w`, or
`L'nT,w`. The system must do three things correctly:

- calculate the right value when a route legitimately supports that output
- refuse to fabricate unsupported outputs and instead surface `needs_input` or
  `unsupported`
- keep the same answer/support posture stable under duplicate rows, row reorders,
  save/load replay, study-mode detours, and other hostile operator behavior

A green result is only valid if both the number and its support/origin posture
are correct.

## End-To-End User Flow

1. Auth-gated workbench entry.
   - `/workbench` is server-gated by `requireAuthenticatedPage(...)`.
   - `view=advanced` selects the advanced operator desk; default is the simpler
     guided shell.
   - Files:
     - `apps/web/app/workbench/page.tsx`
     - `apps/web/app/workbench/workbench-client-page.tsx`
2. Client shell selection.
   - `SimpleWorkbenchShell` is the default day-to-day calculator surface.
   - `WorkbenchShell` is the denser operator/debug/reporting desk.
   - Files:
     - `apps/web/features/workbench/simple-workbench-shell.tsx`
     - `apps/web/features/workbench/workbench-shell.tsx`
3. Local scenario state and editing.
   - Zustand store owns study mode, layer rows, requested outputs, optional
     airborne/impact context, criteria/report settings, and saved scenarios.
   - Layer edits, duplicate/reorder, split parity, and scenario save/load all
     start here.
   - File:
     - `apps/web/features/workbench/workbench-store.ts`
4. Request building and engine execution.
   - Web routes validate payloads with shared schemas and call engine entry
     points.
   - Full route:
     - `apps/web/app/api/estimate/route.ts` -> `calculateAssembly(...)`
   - Impact-only route:
     - `apps/web/app/api/impact-only/route.ts` -> `calculateImpactOnly(...)`
5. Engine lane selection and support gating.
   - Engine builds airborne/impact candidates, selects route-specific results,
     then computes supported and unsupported requested outputs.
   - Core files:
     - `packages/engine/src/calculate-assembly.ts`
     - `packages/engine/src/calculate-impact-only.ts`
     - `packages/engine/src/target-output-support.ts`
6. Output-card projection.
   - UI cards do not simply print raw numbers. They combine the engine result,
     support buckets, field blockers, route posture, and requested-output state
     into `live`, `bound`, `needs_input`, or `unsupported` cards.
   - File:
     - `apps/web/features/workbench/simple-workbench-output-model.ts`
7. Save/load and proposal/report surfaces.
   - Local scenario editing is browser-local first.
   - Users can explicitly sync/load owner-scoped server project records.
   - Proposal/report exports can append server project audit events.
   - Project access roles/actions have a pure policy contract, but route
     access is still owner-scoped until the deferred route-integration slice
     wires the policy through an owner-only adapter.

## Runtime Boundaries

### Engine

The engine is the truth surface for numeric and support decisions.

- public package entry:
  `packages/engine/src/index.ts`
- core entry points:
  - `calculate-assembly.ts`
  - `calculate-impact-only.ts`
- support gate:
  - `target-output-support.ts`

The engine decides:

- which lane owns the answer
- whether a requested output is supported
- what provenance/basis metadata accompanies the answer

The UI must not widen unsupported outputs beyond what the engine exposes.

### Web API Glue

The Next API routes are intentionally thin.

They do four things only:

- auth check
- schema validation
- call engine entry point
- serialize JSON result/error

If behavior changes here, it should usually be validation/auth/transport, not
acoustic logic.

### Workbench UI

The UI owns operator flow, edit ergonomics, posture wording, and projection of
engine support state into cards, guides, reports, and review surfaces.

The UI must stay parity-safe with the engine. A card can be wrong even when the
engine number is correct if the UI shows `live` for something that should be
`needs_input` or `unsupported`.

### Persistence

Current workbench editing persistence is local-first.

- store uses Zustand `persist(...)`
- storage backend is `createJSONStorage(() => localStorage)`
- saved scenarios are snapshots in the client store
- `server_backed_project_storage_v1` has closed an owner-scoped
  server project repository and `/api/projects` import/list/detail
  routes backed by filesystem JSON records
- the workbench can copy browser-local saved scenarios into a server
  project with `Sync to server`
- the default workbench can sync the current snapshot to a server
  project, list server projects, and load a marked server snapshot
  back into local Zustand
- proposal PDF/DOCX routes append a project audit event when a
  `projectId` is present
- `team_access_model_v1` has closed a pure project-access policy helper
  with owner/editor/reviewer/viewer role-action decisions and stable
  denial reasons
- route behavior remains owner-scoped until
  `project_access_policy_route_integration_v1` wires that policy through
  the current route authorization boundary
- local Zustand remains the live editing source; server persistence is
  explicit sync/load, not shared multi-user editing

This is important because docs should not describe current save/load as shared
multi-user project persistence.

## Answer Model

There is no single universal acoustic formula in the repo.

A visible answer can be owned by:

- exact imported/source-backed rows
- local formula lanes
- predictor/family estimate lanes
- conservative bound lanes
- unsupported state

For the full origin rules, read
[CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md).
This document is the system map; that document is the answer-origin contract.

## Study Mode And Context Model

The main top-level operator switch is `studyMode`.

- `wall` mode biases the flow toward airborne partition behavior
- `floor` mode enables impact lanes and floor companion logic

Requested outputs, context fields, and card behavior depend on:

- study mode
- selected route/lane
- available geometry or field inputs
- support gating from the engine

Important consequence:

- the UI must not assume that selecting an output means it can be shown
- missing context should produce `needs_input`, not guessed values

## Test System

The test system has distinct jobs.

### Engine Truth Tests

These prove numeric values, support buckets, provenance, and fail-closed
boundaries.

Examples:

- `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
- `packages/engine/src/output-origin-trace-matrix.test.ts`
- source-truth audits and lane-specific route guards across `packages/engine/src`

### Web Parity Tests

These prove that output cards, status labels, replay/save-load posture, and
requested-output surfaces stay aligned with engine truth.

Examples:

- `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts`

### Planning Contracts

These are executable docs for next-slice selection. They pin what just closed,
what is explicitly deferred, and what should be implemented next.

Examples live in `packages/engine/src/post-*.test.ts`.

### Productization Policy Tests

These prove non-calculator product contracts such as auth, project
storage, route authorization, and access policy semantics.

Examples:

- `apps/web/lib/project-access-policy.test.ts`
- `apps/web/lib/server-project-routes.test.ts`
- `apps/web/lib/auth.test.ts`
- `apps/web/lib/auth-routes.test.ts`

### Focused Gate

`pnpm calculator:gate:current` is the current single-command checkpoint gate.

It should stay aligned with the living next slice and gives the shortest safe
validation path before and after a refactor.

## Current Architectural Hotspots

As of `2026-04-24`, the calculator final audit is closed and the broad
repo validation is green. Server-backed project storage,
project/proposal owner authorization, auth-session hardening, and the pure
team-access policy model are all closed. The wall formula-family slice
has now also closed honestly no-runtime: Gate A named the timber
screening vs dynamic surfaces, Gate B proved the live workbench uses the
dynamic route, and Gate C kept runtime unchanged because the current
official timber rows define only a broad corridor. The source-corpus
follow-up then landed two direct timber exact imports. The resilient
side-count slice then landed Gate A no-runtime blind-surface proof, Gate B
explicit `resilientBarSideCount` plumbing with legacy-stable `auto`, and
Gate C exact imports for the four source-backed RB1/RB2 timber rows when
explicit `one_side`/`both_sides` is selected. The floor continuation
slice then closed no-runtime with engine/web card inventories, and the
floor 50+ layer stress slice closed no-runtime after pinning
representative many-layer engine/card surfaces, and the floor
layer-order slice closed no-runtime after pinning explicit-role exact
reorder stability, raw/order-sensitive support changes, and blocked
impact fail-closed posture. The active calculator risk is now
`all_caller_invalid_thickness_guard_v1`: direct engine floor/wall
callers that bypass workbench normalization must not get crashes,
non-finite outputs, unsupported live leakage, or defended-looking
answers from invalid thickness. Productization route integration is
deferred, not cancelled.

Current hotspots:

- selected calculator re-entry anchors:
  - `docs/calculator/CHECKPOINT_2026-04-24_INVALID_THICKNESS_BASELINE_READY_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md`
  - `docs/calculator/SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md`
  - `packages/engine/src/post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_GATE_A_HANDOFF.md`
  - `docs/calculator/SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md`
  - `packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts`
  - `apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_GATE_A_HANDOFF.md`
  - `packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts`
  - `apps/web/features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_GATE_A_HANDOFF.md`
  - `packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts`
  - `apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_C_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/post-wall-resilient-side-count-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_LANDED_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_READY_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
  - `apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
  - `apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts`
  - `packages/engine/src/post-wall-resilient-side-count-gate-b-v1-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-wall-timber-lightweight-source-corpus-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md`
  - `apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts`
  - `apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts`
  - `apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts`
  - `apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts`
  - `packages/engine/src/coverage-grid-consistency.test.ts`
- selected productization anchors:
  - `apps/web/lib/project-access-policy.ts`
  - `apps/web/lib/project-access-policy.test.ts`
  - `apps/web/lib/project-route-auth.ts`
  - `apps/web/lib/project-storage-auth.ts`
  - `apps/web/lib/server-project-routes.test.ts`
  - `docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md` (deferred)
  - `docs/calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md`
- selected closeout and follow-up anchors:
  - `packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts`
  - `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - `packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model.ts`
  - `packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts`
  - `packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-origin-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-partial-order-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts`
  - `packages/engine/src/post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts`
  - `packages/engine/src/tuas-clt-backlog-decision-contract.test.ts`
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts`
  - `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts`
  - `apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts`
  - `packages/engine/src/tuas-c11c-exact-import-readiness.ts`
  - `packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts`
  - `packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts`
  - `packages/engine/src/tuas-c11c-frequency-source-recheck.test.ts`
  - `packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts`
  - `packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts`
  - `packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts`
  - `packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts`
  - `packages/engine/src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts`
- selected broad-audit and raw-helper anchors:
  - `packages/engine/src/post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts`
  - `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
  - `packages/engine/src/raw-concrete-helper-answer-guard.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts`
  - `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
  - `packages/engine/src/raw-floor-safe-bare-split-parity.test.ts`
  - `packages/engine/src/output-origin-trace-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-screening-route-support.test.ts`
  - `apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts`
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`
- final-audit gate additions:
  - `packages/engine/src/coverage-grid-consistency.test.ts`
  - `packages/engine/src/post-good-calculator-final-audit-v1-next-slice-selection-contract.test.ts`
- source-backed widening ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

The current selected next slice is a calculator slice again:
`all_caller_invalid_thickness_guard_v1`. The post-commit baseline has
been revalidated, so it should start with a no-runtime Gate A inventory
of direct floor/wall engine invalid-thickness surfaces. Closed
reinforced, `GDMTXA04A`, `C11c`, raw bare, wall-selector, floor
continuation, floor many-layer, floor layer-order, and timber-stud
formula tracks stay explicit calculator deferrals or closed references
rather than active runtime work.

## What This System Is Not Yet

To avoid docs drift, be explicit about current non-features:

- not yet a complete multi-user/team project persistence system
- not yet route-enabled for team membership; policy exists, but routes
  remain owner-scoped until the active integration slice lands
- not a single-formula calculator
- not allowed to fabricate unsupported field or low-frequency outputs
- not complete across every possible floor/wall family corridor
- not free to reopen deferred source families without explicit source-backed or
  guarded planning work

## Reading Guide

- Want current behavior and risks:
  read [CURRENT_STATE.md](./CURRENT_STATE.md)
- Want the next implementation step:
  read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
- Want the deferred productization plan:
  read [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
- Want the active calculator plan:
  read [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md)
- Want answer-origin or support semantics:
  read [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- Want the last clean resume point:
  read [CHECKPOINT_2026-04-24_INVALID_THICKNESS_BASELINE_READY_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_BASELINE_READY_HANDOFF.md)
