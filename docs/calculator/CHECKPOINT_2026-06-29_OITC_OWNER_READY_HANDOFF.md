# Checkpoint 2026-06-29 OITC Owner Ready Handoff

## Purpose

This checkpoint records the docs/implementation reconciliation after the
ceiling multileaf/plenum runtime sequence, ceiling/roof/suspended-ceiling
route split boundary closeout, and the follow-up runtime-first rerank
landed with no runtime movement.

It is a checkpoint and documentation sync, not a new runtime owner. It
keeps the calculator-first handoff explicit before implementing the
opening/facade outdoor-indoor OITC spectral rating owner.

## Documents Reviewed

- `AGENTS.md`
- `docs/calculator/DOCUMENTATION_MAP.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/NEXT_AGENT_BRIEF.md`
- `docs/calculator/README.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/CALCULATOR_OPENING_SEQUENCE_DRIFT_LOCK_2026-06-29.md`
- `docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_OWNER_PLAN_2026-06-29.md`
- `docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_ELEMENT_LAB_FORMULA_OWNER_PLAN_2026-06-29.md`
- `docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-29.md`
- `docs/calculator/POST_V1_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_OWNER_PLAN_2026-06-29.md`
- `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_ROOF_SUSPENDED_CEILING_ROUTE_SPLIT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-29.md`
- `docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`

## Implementation Comparison

The active top-level docs now select:

`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan`

with next implementation file:

`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`

That selected file is intentionally not implemented yet. The latest
landed implementation file is the no-runtime rerank:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`

The current gate runner includes the ceiling/plenum and route-boundary
chain through that rerank:

- `packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-owner-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-input-boundary-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-element-lab-formula-owner-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-multileaf-airborne-plenum-field-building-adapter-owner-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts`
- `packages/engine/src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`
- `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts`

The implementation state matches the docs:

- complete ceiling multileaf/plenum element-lab context is calculable
  through the ceiling route and remains pinned at `Rw 48`, `STC 48`,
  `C -1.7`, and `Ctr -6.5`;
- complete ceiling multileaf/plenum field requests remain pinned at
  `R'w 47`, `Dn,w 44.9`, `Dn,A 43.2`, `DnT,w 45.7`, and `DnT,A 44`;
- complete ceiling multileaf/plenum building requests remain pinned at
  those field values plus `DnT,A,k 41.1`;
- ambiguous roof/ceiling/suspended-ceiling plenum stacks return precise
  route-context `needs_input`;
- explicit roof/facade, ceiling-airborne impact, and lower-treatment
  airborne aliases remain unsupported;
- exact ASTM `IIC` / `AIIC` band routes are already landed and should
  not be re-selected as the next OITC-related work;
- complete outdoor-indoor facade `OITC` requests still remain
  `unsupported` until the selected spectral rating owner lands.

## Plan Reconciliation

The selected OITC owner plan is still logical and calculator-aligned.
The OITC bridge already made `OITC` requestable, but no owned
outdoor-indoor spectral rating adapter has moved runtime values yet.
The next implementation should calculate `OITC` only from explicit
outdoor-indoor facade spectral input and area-energy context.

Current selected next after this checkpoint:

`post_v1_opening_facade_outdoor_indoor_oitc_spectral_rating_owner_plan`

Selected next file:

`packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-spectral-rating-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_SPECTRAL_RATING_OWNER_PLAN_2026-06-29.md`

Selected next label:

`post-V1 opening/facade outdoor-indoor OITC spectral rating owner`

Expected next counters:

- `newCalculableRequestShapes: 1`
- `newCalculableTargetOutputs: 1`
- `requiredPhysicalInputsCaptured: 4`
- `runtimeBasisPromotions: 1`
- `runtimeValuesMoved 1`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `unsupportedBoundariesProtected: 7`

## Open Gaps

- The selected OITC owner contract file has not been created yet.
- The runtime does not yet calculate `OITC` for complete
  outdoor-indoor facade spectral requests.
- Missing OITC spectral bands, missing facade outdoor context, missing
  area-energy context, indoor partition metrics, scalar `STC` / `Rw`,
  `NISR` / `ISR`, source-report scalar substitution, and ISO impact
  aliases must remain blocked or `needs_input` until physically owned.

No broader source crawl, confidence-label work, cosmetic UI pass, or
generic library-style catalog expansion is needed before the selected
OITC owner.

## Validation

Targeted rerank validation before this checkpoint:

```bash
pnpm exec vitest run \
  src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts \
  --maxWorkers=1
```

Result: `1 file / 5 tests` passed.

Related route bundle before this checkpoint:

```bash
pnpm exec vitest run \
  src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-owner-contract.test.ts \
  src/post-v1-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts \
  src/post-v1-runtime-first-route-family-rerank-after-ceiling-roof-suspended-ceiling-route-split-boundary-coverage-refresh-contract.test.ts \
  src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner-contract.test.ts \
  src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts \
  src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts \
  src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts \
  --maxWorkers=1
```

Result: `7 files / 38 tests` passed.

Full current gate before this checkpoint:

```bash
pnpm calculator:gate:current
```

Result:

- shared: `2 files / 23 tests` passed;
- engine: `889 files / 4820 tests` passed;
- web: `127 files / 508 passed / 18 skipped`;
- repo build: `5/5` tasks passed.

Known non-fatal warnings:

- Zustand persist storage warnings in focused web tests.
- optional `sharp/@img` package warnings through
  `@turbodocx/html-to-docx` during Next build.

Whitespace guard:

```bash
git diff --check
```

Result: passed.

## Worktree Boundary

This checkpoint is documentation-only. It does not change formulas,
runtime values, resolver scoring, schema behavior, source rows, or
frontend behavior.

The active worktree also contains the uncommitted calculator milestone
chain through ceiling/plenum runtime owners, route-boundary closeout,
the OITC rerank selection, and this checkpoint. Those changes are
calculator-scope work and are ready to be committed together once the
post-checkpoint targeted validation remains green.

## Progress Ledger

- Calculator behavior opened: no new runtime behavior in this
  checkpoint; it records and protects the landed ceiling/plenum and
  route-boundary chain and the selected OITC owner.
- New calculable request shapes: `0` in this checkpoint; the selected
  next owner is expected to open `1`.
- New calculable target outputs: `0` in this checkpoint; the selected
  next owner is expected to open `1`.
- Required inputs captured: `0` in this checkpoint; the selected next
  owner is expected to capture `4` route-required input groups.
- Runtime/formula values moved: `0` in this checkpoint; the selected
  next owner is expected to move `1`.
- Support work done: docs/implementation reconciliation, checkpoint
  handoff, stale selected-next cleanup, and commit-readiness check.
- Stop reason: this is a clean stop point because the current gate is
  green, the selected next runtime owner is explicit, and the remaining
  gap is the bounded OITC owner implementation rather than more
  support work.
