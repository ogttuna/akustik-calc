# Company-Internal Matrix V3 Refresh Handoff

Date: 2026-05-14

Landed gate:

`company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`

Selection status:

`company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_landed_selected_steel_suspended_ceiling_low_frequency_lnt50_owner`

Selected next action:

`company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`

Selected next file:

`packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`

## What Landed

Matrix V3 refresh records the already-landed steel suspended-ceiling
`DeltaLw` runtime as calculation-grade matrix evidence instead of the
old Matrix V2 owner prompt:

- retired row:
  `floor.lightweight_steel_suspended_ceiling_delta_lw.needs_input`
- promoted row:
  `floor.lightweight_steel_suspended_ceiling_delta_lw.runtime`
- value pins: lab `Ln,w 51.6` / `DeltaLw 22.4`
- basis:
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`
- error budget: `Ln,w +/-4.5 dB` / `DeltaLw +/-2 dB`
- reference marker: `steel_suspended_ceiling_lower_reference`

This refresh does not move runtime behavior. It records the runtime and
surface parity already landed by the preceding contracts.

## Boundaries

- `L'nT,50` stays unsupported until a low-frequency impact spectrum
  owner exists.
- ASTM `IIC` / `AIIC` stays parked as a boundary and is not selected in
  this mainline.
- Field `L'n,w` / `L'nT,w` remains separate from lab `Ln,w` /
  `DeltaLw`; no field or building alias was added.
- Broad source crawling stays behind source-absent owner contracts when
  the calculator can unlock coverage with an explicit physical owner.

## Validation

Focused Matrix V3 contract:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts`

Result: passed, 1 file / 6 tests.

Nearby company-internal continuity:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-refresh-contract.test.ts`

Result: passed, 6 files / 31 tests.

Type and lint validation:

- `pnpm --filter @dynecho/engine typecheck` passed.
- scoped engine eslint passed for the matrix, Matrix V3 contract, Matrix
  V2 contract, and steel surface-parity contract files touched by this
  slice.
- full `pnpm calculator:gate:current` passed with engine 420 files /
  2435 tests, web 79 files / 337 passed + 18 skipped, repo build 5/5,
  and whitespace guard clean.
- known non-fatal warnings during the full gate: optional `sharp/@img`
  build packages and Zustand unavailable test storage.

The next bounded step is the steel suspended-ceiling low-frequency
`L'nT,50` owner contract. That step should define the physical spectrum
or low-frequency correction owner before any `L'nT,50` runtime can
promote.
