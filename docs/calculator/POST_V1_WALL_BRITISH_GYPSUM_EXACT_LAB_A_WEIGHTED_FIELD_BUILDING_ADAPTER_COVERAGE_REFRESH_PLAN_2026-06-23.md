# Post-V1 Wall British Gypsum Exact Lab A-Weighted Field/Building Adapter Coverage Refresh Plan - 2026-06-23

Status:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_landed_no_runtime_selected_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner`

## Purpose

This is the selected next no-runtime coverage refresh after
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_plan`.
Previous coverage refresh status:
`post_v1_wall_british_gypsum_exact_lab_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_british_gypsum_exact_lab_field_building_adapter_coverage_refresh`.
Owner file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-owner-contract.test.ts`.
Owner plan:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-23.md`.
Owner status:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_owner_landed_runtime_selected_coverage_refresh`.

Re-probed selected candidate:
`wall.british_gypsum_exact_lab_a_weighted_field_building_adapter_owner`.

The owner opened exact British Gypsum `A046005` / `A046006`
field/building `Dn,A` and `DnT,A` companions through the exact lab `Rw`
direct curve plus Gate I / Gate AR. The refresh should re-probe those
runtime pins and protect the boundaries that remain closed.

Owner counters: `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 8`, `runtimeBasisPromotions: 4`,
`runtimeValuesMoved 8`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Refresh Action

Coverage refresh action:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_plan`

Coverage refresh file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-a-weighted-field-building-adapter-coverage-refresh-contract.test.ts`

Coverage refresh plan doc:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_A_WEIGHTED_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md`

Coverage refresh status:
`post_v1_wall_british_gypsum_exact_lab_a_weighted_field_building_adapter_coverage_refresh_landed_no_runtime_selected_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner`

Coverage refresh label:
`post-V1 wall British Gypsum exact lab A-weighted field/building adapter coverage refresh`

## Scope

Re-probe `A046005` and `A046006` complete field/building and A-only
requests:

- `A046005`: `Dn,A 48.0`, `DnT,A 49.1`.
- `A046006`: `Dn,A 51.0`, `DnT,A 52.1`.

Keep missing room context, missing building output basis, lab aliases,
impact aliases, nearby British Gypsum rows, legacy `auto` exact-source
promotion, and lab-to-field/building copying closed.

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

## Selected Next

Selected next action:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_plan`

Selected next file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-owner-contract.test.ts`

Selected next plan doc:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-23.md`

Selected next label:
`post-V1 wall British Gypsum exact lab building DnT,A,k characteristic adapter owner`

## Subsequent Runtime Owner Landed

Owner action:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_plan`

Owner file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-owner-contract.test.ts`

Owner plan doc:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-23.md`

Owner status:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Owner candidate:
`wall.british_gypsum_exact_lab_building_dntak_characteristic_adapter_owner`

Owner counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`, and
`unsupportedBoundariesProtected: 5`.
This is not a broad source crawl.

Owner selected next action:
`post_v1_wall_british_gypsum_exact_lab_building_dntak_characteristic_adapter_coverage_refresh_plan`

Owner selected next file:
`packages/engine/src/post-v1-wall-british-gypsum-exact-lab-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`

Owner selected next plan doc:
`docs/calculator/POST_V1_WALL_BRITISH_GYPSUM_EXACT_LAB_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-23.md`
