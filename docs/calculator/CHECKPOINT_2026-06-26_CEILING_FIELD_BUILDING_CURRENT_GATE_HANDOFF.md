# Checkpoint 2026-06-26 Ceiling Field/Building Current Gate Handoff

## Purpose

This checkpoint records the docs/implementation reconciliation after
the runtime-first opening, floor, and ceiling route-family sequence
landed in commit `45ffc12`.

It is a checkpoint and documentation sync, not a new runtime owner. It
keeps the calculator-first handoff explicit after the ceiling
single-leaf field/building context adapter owner was wired into the
current gate, and it marks the next selected step as the ceiling
field/building coverage refresh.

## Documents Reviewed

- `AGENTS.md`
- `docs/calculator/DOCUMENTATION_MAP.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/NEXT_AGENT_BRIEF.md`
- `docs/calculator/README.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_OWNER_PLAN_2026-06-26.md`
- `docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md`
- `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md`
- `docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-26.md`
- `docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-26.md`

## Implementation Comparison

The active top-level docs now select:

`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`

with next implementation file:

`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`

That selected file is the next coverage-refresh contract to create. It
is intentionally not a landed runtime file yet. The landed runtime owner
is:

`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts`

The current gate runner includes the ceiling route chain through the
runtime owner:

- `packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts`

The runtime resolver registry now exposes the ceiling field/building
adapters:

- `ceiling.single_leaf_airborne_field_context_adapter`
- `ceiling.single_leaf_airborne_building_prediction_adapter`

Complete ceiling-only `field_between_rooms` requests publish `R'w 33`,
`Dn,w 33`, `Dn,A 36.5`, `DnT,w 36`, and `DnT,A 38.9` on route
`ceiling`. Complete ceiling-only `building_prediction` requests publish
`R'w 33`, `Dn,w 33`, `Dn,A 36.5`, `DnT,w 36`, `DnT,A 38.9`, and
`DnT,A,k 36` on route `ceiling`.

Lab companions remain separate from field/building outputs. Missing
field or building context remains `needs_input`; impact metrics, ASTM
ratings, OITC, source-row proximity substitution, and lab-to-building
aliases remain blocked.

## Plan Reconciliation

The active selected next is a no-runtime coverage refresh for the
ceiling field/building owner. It should re-probe the landed owner, pin
the same field/building values and required inputs, and keep the
unsupported boundaries above intact.

This checkpoint supersedes the 2026-06-24 advanced-wall current-gate
checkpoint as the latest reconciliation point. The 2026-06-24
checkpoint remains historical evidence for the advanced-wall gate and
the fresh runtime-first sequence that followed it.

Current selected next after this checkpoint:

`post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-26.md`

Selected next label:

`post-V1 ceiling single-leaf field/building context adapter coverage refresh`

## Validation

Focused runtime validation before this docs sync:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts \
  src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts \
  src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts \
  src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts \
  --maxWorkers=1
```

Result: `4 files / 18 tests` passed.

Full current gate before commit `45ffc12`:

```bash
pnpm calculator:gate:current
```

Result:

- engine focused suites reached `875` passed tests and the broad engine
  current-gate suite reached `4749` passed tests;
- web focused suites reached `127` passed tests and the broader web
  gate reached `508 passed / 18 skipped`;
- repo build completed `5/5` tasks.

Known non-fatal warnings:

- Zustand persist storage warnings in focused web tests.
- optional `sharp/@img` package warnings through
  `@turbodocx/html-to-docx` during Next build.

Whitespace guards:

```bash
git diff --check
git diff --cached --check
```

Result: passed before commit `45ffc12`.

## Worktree Boundary

This checkpoint is documentation-only. It does not change formulas,
runtime values, resolver scoring, schema behavior, source rows, or
frontend behavior.

## Progress Ledger

- Calculator behavior opened: no new runtime behavior in this docs sync;
  it records and protects the landed ceiling field/building context
  adapter owner.
- New calculable request shapes: `0` in this checkpoint; the protected
  owner opened `2`.
- New calculable target outputs: `0` in this checkpoint; the protected
  owner opened `6`.
- Required inputs captured: `0` in this checkpoint; the protected owner
  captured `3` route-required input groups.
- Runtime/formula values moved: `0` in this checkpoint; the protected
  owner moved `11`.
- Support work done: new current-gate checkpoint and live docs sync.
- Stop reason: the next safe step is the selected no-runtime coverage
  refresh, not a new route owner, because the landed runtime owner needs
  a pinned regression contract before the next runtime-first rerank.
