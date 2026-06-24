# Post-V1 Wall British Gypsum Exact Lab Calculated Lab Companion Owner Plan - 2026-06-23

Status:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_owner_landed_runtime_scope_basis_selected_coverage_refresh`

Follow-up coverage refresh:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md`
/
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh`.
The refresh re-probes selected candidate
`wall.british_gypsum_exact_lab_calculated_lab_companion_owner` and
keeps the owner values and boundaries unchanged.

Selected next action after the refresh:
`post_v1_runtime_first_route_family_rerank_after_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-24.md`
/
`post-V1 runtime-first route-family rerank after wall British Gypsum exact lab calculated lab companion coverage refresh`.
Refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Purpose

This runtime/scope-basis owner follows the no-runtime coverage refresh:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_british_gypsum_exact_lab_calculated_lab_companion_owner`.

Previous owner status:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`.

Previous refresh action:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_coverage_refresh_plan`.

Previous refresh file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`.

Previous refresh plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md`.

Previous refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Selection Card

- User construction / formula family: British Gypsum `A046005`
  one-side RB1 and `A046006` both-side RB2 exact element-lab timber
  resilient-bar rows.
- Target outputs opened: calculated `STC`, `C`, and `Ctr` beside the
  exact measured `Rw` row for mixed lab requests.
- Route: exact British Gypsum `Rw` row remains the measured anchor;
  `STC`, `C`, and `Ctr` are calculated from the selected dynamic
  transmission-loss curve and the existing ISO 717-1 / ASTM E413
  rating adapters.
- Required physical inputs: exact source row identity, explicit
  `resilientBarSideCount`, calculated transmission-loss curve, ISO
  717-1 C/Ctr adapter, and ASTM E413 STC adapter.
- `needs_input` behavior: unrelated singleton companion requests and
  missing topology routes must not be promoted by this owner.
- `unsupported` boundaries: single-output `Rw` stays measured exact;
  field/building aliases, impact aliases, nearby BG rows, legacy
  `auto` exact-source promotion, and lab-to-field/building copying stay
  closed.

## Landed Owner

Owner action:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-owner-contract.test.ts`

Owner plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_OWNER_PLAN_2026-06-23.md`

Selected candidate:
`wall.british_gypsum_exact_lab_calculated_lab_companion_owner`

Runtime method:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_runtime`

The owner makes mixed lab `Rw + STC + C + Ctr` requests calculable for:

- `A046005`: `Rw 55`, calculated `STC 55`, `C -0.6`, `Ctr -5.4`.
- `A046006`: `Rw 58`, calculated `STC 58`, `C -0.6`, `Ctr -5.4`.

The exact source row still owns only `Rw`; companion metrics are
published on a calculated lab companion basis, not as source-measured
values.

## Counters

- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 2`
- `newCalculableTargetOutputs: 6`
- `runtimeBasisPromotions: 2`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`
- `protectedSingleOutputExactRequestShapes: 2`
- `protectedFieldOrBuildingAliasRequestShapes: 2`

This is not a broad source crawl.

## Selected Next

Selected next action:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Selected next label:
`post-V1 wall British Gypsum exact lab calculated lab companion coverage refresh`

## Validation Plan

1. Run targeted BG owner and coverage-refresh Vitest files.
2. Run `pnpm calculator:gate:current` because the current gate runner
   and live handoff docs are updated.
3. Run `git diff --check`.

## Validation Completed

- Targeted British Gypsum suite passed `4 files / 24 tests`.
- `pnpm calculator:gate:current` passed with engine
  `827 files / 4529 tests`, web `127 files / 506 passed / 18 skipped`,
  and repo build `5/5` tasks.
- `git diff --check` passed.
