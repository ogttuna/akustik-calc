# System Map

Last reviewed: 2026-04-16

Document role:

- explain what the acoustic calculator product actually is today
- map the user flow to the real runtime and file boundaries
- separate engine truth, UI truth, API glue, persistence, and test surfaces
- give future agents one place to answer “how does the system work?” before
  changing solver, workbench, or docs

Use this together with:

- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
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
   - Saved scenarios are currently browser-local, not server-backed project
     records.
   - Proposal/report exports exist, but project persistence is not a DB-backed
     SaaS layer yet.

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

Current persistence is browser-local scenario storage.

- store uses Zustand `persist(...)`
- storage backend is `createJSONStorage(() => localStorage)`
- saved scenarios are snapshots in the client store
- there is no server-backed project database yet

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

### Focused Gate

`pnpm calculator:gate:current` is the current single-command checkpoint gate.

It should stay aligned with the living next slice and gives the shortest safe
validation path before and after a refactor.

## Current Architectural Hotspots

As of `2026-04-16`, the requested-output output-card harness chain is frozen at
a clean green baseline. The active risk is no longer harness sprawl; it is the
next real runtime widening on the reinforced-concrete impact corridor.

Current hotspots:

- selected runtime widening anchors:
  - `packages/engine/src/impact-estimate.ts`
  - `packages/engine/src/floor-system-estimate.ts`
  - `packages/engine/src/dynamic-impact.ts`
  - `packages/engine/src/impact-support.ts`
- selected heavy-concrete engine evidence:
  - `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
  - `packages/engine/src/reinforced-concrete-floor-monotonicity.test.ts`
  - `packages/engine/src/floor-widening-candidate-contract.test.ts`
  - `packages/engine/src/calculate-impact-only.test.ts`
- selected heavy-concrete workbench evidence:
  - `apps/web/features/workbench/heavy-concrete-formula-history-card-matrix.test.ts`
  - `apps/web/features/workbench/heavy-concrete-formula-provenance-report-surface.test.ts`
- held second-candidate evidence:
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed widening ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

The current selected next slice exists to widen the already-owned
reinforced-concrete formula family honestly, not to reopen another harness
refactor chain or a blocked source anomaly.

## What This System Is Not Yet

To avoid docs drift, be explicit about current non-features:

- not a server-backed multi-project persistence system
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
- Want answer-origin or support semantics:
  read [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- Want the last clean resume point:
  read [CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md](./CHECKPOINT_2026-04-16_RUNTIME_CANDIDATE_RERANK_HANDOFF.md)
