# Company-Internal Steel Suspended-Ceiling DeltaLw Surface Parity Handoff

Date: 2026-05-14

Landed gate:

`company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan`

Selection status:

`company_internal_steel_suspended_ceiling_delta_lw_surface_parity_landed_selected_matrix_v3_refresh`

Selected next action:

`company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan`

Selected next file:

`packages/engine/src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts`

## What Landed

The company-internal steel suspended-ceiling `DeltaLw` runtime is now
visible across the first user-facing surfaces without moving the
engine values:

- output cards;
- corridor dossier;
- local saved replay;
- server snapshot replay;
- calculator API payload;
- impact-only API payload;
- Markdown report.

Complete lower suspended-ceiling plus upper/reference package input
still returns lab `Ln,w 51.6` / `DeltaLw 22.4` through
`predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`.
The visible trace now names
`Lightweight-steel suspended-ceiling DeltaLw formula corridor`, carries
the `steel_suspended_ceiling_lower_reference` reference-floor marker,
and keeps `+/-4.5 dB` / `+/-2.0 dB` source-absent budgets marked as
not measured evidence.

## Boundaries

- Runtime values did not move at this surface parity gate.
- ASTM `IIC`, `AIIC`, field outputs, and `L'nT,50` remain unsupported
  on this ISO lab route.
- Missing `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, or `loadBasisKgM2` still blocks
  the formula instead of fabricating a broad family fallback.
- Exact source rows still outrank the formula when a true source match
  exists.

## Validation

Focused engine contract:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts`

Result: passed, 1 file / 3 tests.

Focused web surface parity:

`pnpm --filter @dynecho/web exec vitest run features/workbench/company-internal-steel-suspended-ceiling-delta-lw-surface-parity.test.ts`

Result: passed, 1 file / 3 tests.

Nearby engine continuity:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-refresh-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.test.ts`

Result: passed, 6 files / 28 tests.

Nearby web continuity:

`pnpm --filter @dynecho/web exec vitest run features/workbench/company-internal-steel-suspended-ceiling-delta-lw-surface-parity.test.ts features/workbench/steel-floor-formula-input-surface-acceptance.test.ts features/workbench/steel-floor-formula-card-report-parity.test.ts features/workbench/steel-floor-formula-error-budget-surface-parity.test.ts`

Result: passed, 4 files / 11 tests.

Type and lint validation:

- `pnpm --filter @dynecho/engine typecheck` passed.
- `pnpm --filter @dynecho/web typecheck` passed.
- scoped engine eslint passed for the steel formula, impact trace,
  impact support, runtime contract, surface parity contract, and Matrix
  V2 files touched by this slice.
- scoped web eslint passed for the new surface parity test and steel
  formula corridor view.
- full `pnpm calculator:gate:current` passed with engine 419 files /
  2429 tests, web 79 files / 337 passed + 18 skipped, repo build 5/5,
  and whitespace guard clean.
- known non-fatal warnings during the full gate: transient
  `fonts.googleapis.com` DNS retries, optional `sharp/@img` build
  packages, and Zustand unavailable test storage.

The next bounded step is the matrix v3 refresh so the executable
company-internal matrix records the new supported steel
suspended-ceiling `DeltaLw` row instead of the old Matrix V2
`needs_input` owner prompt.
