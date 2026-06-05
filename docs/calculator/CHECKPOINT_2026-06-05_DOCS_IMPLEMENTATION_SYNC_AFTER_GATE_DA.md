# Checkpoint - Docs / Implementation Sync After Gate DA - 2026-06-05

Document role: reconciliation checkpoint for the calculator engine after
Gate DA. Read this before older checkpoint handoffs when resuming
post-V1 calculator work.

## Product Guard

DynEcho remains an acoustic calculator. The current work must improve
calculator scope or accuracy, or preserve the `needs_input` /
`unsupported` boundaries needed for correct calculation. Source rows are
allowed as exact answers, anchors, calibration evidence, holdouts, and
regression tests; they are not the product goal.

Frontend work is currently being changed by other agents and is outside
this checkpoint. This checkpoint covers the engine/docs state only.

## Documents Re-read

- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/USABLE_V1_EXECUTION_PLAN.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`
- `docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/README.md`
- `docs/README.md`
- `AGENTS.md`

## Implementation Compared

The current engine chain has advanced through:

- Gate CX:
  `post_v1_next_numeric_coverage_gap_gate_cx_plan`
- Gate CY:
  `post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan`
- Gate CZ:
  `post_v1_next_numeric_coverage_gap_gate_cz_plan`
- Gate DA:
  `post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan`

The compared runtime files are:

- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/calculate-impact-only.ts`
- `packages/engine/src/composite-panel-published-interaction-estimate.ts`
- `packages/engine/src/composite-panel-published-interaction-runtime-constants.ts`
- `packages/engine/src/impact-lane.ts`
- `packages/engine/src/layer-combination-resolver-registry.ts`
- the Gate CX/CY/CZ/DA contract and summary files under
  `packages/engine/src/`
- `tools/dev/run-calculator-current-gate.ts`

## Landed Calculator State

Gate CY is the latest value-moving new-output runtime slice. It closes
the composite-panel `DeltaLw` owner gap by using the same-family
bare-minus-treated `Ln,w` relationship:

- dry floating composite-panel stack:
  `Ln,w 69.4 / Rw 45.1 / DeltaLw 14.6`
- suspended-ceiling-only composite-panel stack:
  `Ln,w 63.3 / Rw 48.6 / DeltaLw 20.7`
- combined upper/lower composite-panel stack:
  `Ln,w 48.5 / Rw 60.6 / DeltaLw 35.5`

Existing `Rw` / `Ln,w` pins remain unchanged. Missing owner fields still
return `needs_input`, exact PMC rows remain primary, wrong-family
`DeltaLw` formulas are not borrowed, and ASTM `IIC` / `AIIC` remain
unsupported.

Gate CZ is the latest no-runtime numeric coverage rerank. It selected
`floor.lightweight_concrete_delta_lw_family_owner_contract_gap` and the
Gate DA owner-contract step.

Gate DA is the latest lightweight-concrete owner-boundary action. It
does not publish new lightweight-concrete `DeltaLw` values yet. It pins
`floor.lightweight_concrete.delta_lw_family_owner_contract` and these
no-default owner fields:

- `baseSlabThicknessMm`
- `baseSlabDensityKgM3_or_lightweightConcreteMaterialClass`
- `upperTreatmentState`
- `floorCoveringOrWalkingSurface`
- `resilientLayerOrToppingState`
- `resilientLayerDynamicStiffnessMNm3_or_productCurve`
- `loadBasisKgM2`
- `elementLabMetricBasis`

Gate DA also fixes a runtime accuracy boundary: low-density predictor
input with complete dynamic stiffness and load basis no longer borrows
`heavy_concrete_annex_c_delta_lw`. It remains on the lightweight
`Rw 53 / Ln,w 64.3` route without `DeltaLw`.

The Gate M non-dynamic low-density predictor remains
`Rw 49 / Ln,w 47`, visible lightweight-concrete remains
`Rw 53 / Ln,w 64.3`, field-impact companions remain unchanged, and
ASTM `IIC` / `AIIC` remain unsupported.

## Current Selected Next

The active selected next action is:

`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan`

Selected next file:

`packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts`

Gate DB is the next value-moving opportunity. It should add the
lightweight-concrete `DeltaLw` runtime corridor only for the pinned
family-specific owner basis from Gate DA. It must not borrow
heavy-concrete, composite-panel, timber/CLT, or steel `DeltaLw`
formulas, and it must preserve existing `Rw` / `Ln,w` / field-impact
pins and metric/basis boundaries.

## Validation Evidence

Latest full documented gate is the Gate DA full gate:

`NEXT_DIST_DIR=.next-gate-da pnpm calculator:gate:current`

It passed on 2026-06-05 with engine 618 files / 3396 tests, web 113
files / 438 passed + 18 skipped, repo build 5 / 5, and whitespace guard
passed. The web build emitted the known non-fatal optional `sharp` /
`@img` package warnings.

Post-Gate-DA targeted engine validation passed:

- Gate DA targeted contract: 5 tests passed
- Gate M/N/CZ/DA regression set: 19 tests passed
- Gate CX/CY/CZ/DA regression set: 18 tests passed
- `git diff --check` on intended engine/docs files passed

The worktree still contains unrelated frontend changes from other
agents. Do not treat those frontend changes as part of this engine
checkpoint or commit boundary.

## Commit Boundary

Safe checkpoint commit scope is limited to calculator engine and
calculator docs:

- Gate CX/CY/CZ/DA engine files and tests
- `packages/engine/src/impact-lane.ts`
- composite-panel runtime updates
- current-gate runner update
- calculator living docs and this checkpoint

Do not include unrelated `apps/web`, `docs/ui`, generated output, PDF,
or Playwright artifact changes in the engine checkpoint commit.
