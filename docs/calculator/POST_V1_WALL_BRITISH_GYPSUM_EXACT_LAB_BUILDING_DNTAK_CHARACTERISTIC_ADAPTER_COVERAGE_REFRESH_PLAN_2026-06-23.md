# Post-V1 Wall British Gypsum Exact Lab Building DnT,A,k Characteristic Adapter Coverage Refresh Plan - 2026-06-23

Status:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_british_gypsum_exact_lab_calculated_lab_companion_owner`

## Purpose

This is the selected next no-runtime coverage refresh after
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_plan`.
The owner status is
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`.

Previous refresh status:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_landed_no_runtime_selected_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner`.

Owner file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-owner-contract.test.ts`.

Owner plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-23.md`.

Selected candidate:
`wall.british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner`.

The owner opened British Gypsum `A046005` / `A046006` exact lab
building `DnT,A,k` through the exact lab `Rw` direct curve, Gate AR
building `DnT,A`, receiving-room volume, partition area with the 7 m2
minimum, and `T0=0.5 s`. The refresh should re-probe those runtime pins
and protect the basis boundaries.

Owner counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 5`.

## Refresh Action

Selected action:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_coverage_refresh_plan`

Selected file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Selected plan doc:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Selected label:
`post-V1 wall British Gypsum exact lab building DnT,A,k characteristic adapter coverage refresh`

Landed status:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_coverage_refresh_landed_no_runtime_selected_british_gypsum_exact_lab_calculated_lab_companion_owner`

Selected next action:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_owner_plan`

Selected next file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-owner-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_OWNER_PLAN_2026-06-23.md`

Selected next label:
`post-V1 wall British Gypsum exact lab calculated lab companion owner`

Follow-up owner landed with status:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_owner_landed_runtime_scope_basis_selected_coverage_refresh`.

Follow-up owner file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-owner-contract.test.ts`

Follow-up owner plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_OWNER_PLAN_2026-06-23.md`

Follow-up selected candidate:
`wall.british_gypsum_exact_lab_calculated_lab_companion_owner`

Follow-up counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 6`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`,
`protectedSingleOutputExactRequestShapes: 2`, and
`protectedFieldOrBuildingAliasRequestShapes: 2`. This is not a broad
source crawl.

Follow-up selected next action:
`post_v1_wall_british_gypsum_exact_lab_calculated_lab_companion_coverage_refresh_plan`

Follow-up selected next file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-calculated-lab-companion-coverage-refresh-contract.test.ts`

Follow-up selected next plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_CALCULATED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md`

## Scope

Re-probe `A046005` and `A046006` complete building requests:

- `A046005`: `DnT,A 49.1`, `DnT,A,k 48.0`.
- `A046006`: `DnT,A 52.1`, `DnT,A,k 51.0`.

Keep missing receiving-room volume, missing `buildingPredictionOutputBasis`,
apparent-only basis, field context, lab context, impact aliases, nearby
British Gypsum rows, legacy `auto` exact-source promotion, and
lab-to-building copying closed.

## Expected Counters

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

This is not a broad source crawl.
