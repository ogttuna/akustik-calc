# Company-Internal Matrix V2 Refresh Handoff

Date: 2026-05-14

Landed gate:

`company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`

Selection status:

`company_internal_calculation_grade_mainline_matrix_v2_refresh_landed_selected_steel_suspended_ceiling_delta_lw_runtime_corridor`

Selected next action:

`company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`

Selected next file:

`packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts`

## What Landed

Matrix v2 is a no-runtime refresh of the company-internal
calculation-grade acceptance envelope.

It now has 60 rows and fixes the main drift found during the 2026-05-14
audit:

- imports Gate AT building-prediction runtime rows:
  `wall.complete_building_prediction.runtime`,
  `wall.complete_building_prediction_broad_targets.alias_boundary`, and
  `wall.building_prediction_partial_context.needs_input`;
- retires the stale
  `wall.building_prediction_missing_context.needs_input` row;
- replaces
  `floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported` with
  `floor.lightweight_steel_suspended_ceiling_delta_lw.needs_input`;
- keeps the steel `DeltaLw` owner prompt precise:
  `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, and `loadBasisKgM2`;
- normalizes `floor.heavy_concrete_floating_floor.lab` so the matrix no
  longer hides a `screening_fallback` origin on a complete
  `family_physics` row. It now records the impact formula origin as
  `predictor_heavy_floating_floor_iso12354_annexc_estimate` while
  keeping `Ln,w 44.9` / `DeltaLw 26.9` unchanged.

## Remaining Blockers

The matrix v2 remaining calculation-grade blockers are now explicit:

- `floor.lightweight_steel_suspended_ceiling_delta_lw.needs_input`;
- `floor.lightweight_steel_suspended_ceiling_lnt50.unsupported`.

The next selected lane is the steel suspended-ceiling ISO `DeltaLw`
numeric runtime corridor. It should promote only when the upper/reference
package owner inputs are complete. ASTM `IIC` / `AIIC`, broad source
crawling, and low-frequency `L'nT,50` remain parked behind this lane.

## Validation

Focused validation for this checkpoint:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`

Result: passed, 1 file / 6 tests.

Nearby continuity validation:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-refresh-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.test.ts`

Result: passed, 4 files / 19 tests.

Static checks:

- `pnpm --filter @dynecho/engine typecheck`
- `pnpm --filter @dynecho/engine exec eslint src/company-internal-calculation-grade-mainline-matrix.ts src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`

Both passed.
