# Company-Internal Steel Suspended-Ceiling DeltaLw Runtime Handoff

Date: 2026-05-14

Landed gate:

`company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan`

Selection status:

`company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_landed_selected_surface_parity`

Selected next action:

`company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan`

Selected next file:

`packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts`

## What Landed

The steel suspended-ceiling route now has a numeric ISO lab `DeltaLw`
runtime corridor when both owner groups are complete:

- the lower suspended-ceiling steel owner inputs from Gate BK/BL;
- the upper/reference package owner inputs:
  `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, and `loadBasisKgM2`.

The complete company-internal probe returns lab `Ln,w 51.6` /
`DeltaLw 22.4` through
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`.
The bare lower suspended-ceiling reference remains `Ln,w 62.2`, and the
new `DeltaLw` carries the existing source-absent `+/-2 dB` budget. This
is formula evidence, not a measured source row.

The runtime is deliberately blocked when stiffness and load are present
but no real topping/floating layer is owned. That case now returns
`needs_input` for `toppingOrFloatingLayer` and blocks broad impact
fallback instead of fabricating `Ln,w` / `DeltaLw`.

## Boundaries

- Exact source rows still stay first.
- Suspended-ceiling-only input without the upper package still preserves
  `Ln,w 62.2` and prompts for `DeltaLw` owner fields.
- ASTM `IIC` / `AIIC`, field/building outputs, and `L'nT,50` are not
  aliased to the new lab `DeltaLw` runtime.
- Broad source crawling remains behind solver coverage work.

## Validation

Focused validation for this checkpoint:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts`

Result: passed, 1 file / 6 tests.

Nearby company-internal continuity validation:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-refresh-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.test.ts`

Result: passed, 5 files / 25 tests.

Type and lint validation:

- `pnpm --filter @dynecho/engine typecheck` passed.
- `pnpm --filter @dynecho/engine exec eslint src/steel-floor-impact-formula-corridor.ts src/steel-floor-formula-input-surface.ts src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.ts src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts src/company-internal-calculation-grade-mainline-matrix.ts src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`
  passed.

Run the next surface parity gate against cards, scenario analysis,
saved replay, API payloads, and Markdown reports before calling the
steel suspended-ceiling `DeltaLw` route user-visible complete.
