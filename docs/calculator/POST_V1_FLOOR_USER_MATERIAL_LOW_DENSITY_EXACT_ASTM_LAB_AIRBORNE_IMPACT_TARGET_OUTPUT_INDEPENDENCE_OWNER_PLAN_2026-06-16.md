# Post-V1 Floor User-Material Low-Density Exact ASTM Lab-Airborne Impact Target-Output Independence Owner - 2026-06-16

## Purpose

This runtime owner removes target-output ordering dependence from the
custom low-density exact ASTM floor route. The calculator already owned
the same-stack lightweight-family companion when `DeltaLw` was included,
but single-output or partial-output requests for `Rw`, `C`, `Ln,w`, and
`L'nT,50` could still park even with complete physical inputs.

This is a calculator-scope and accuracy task. It is not UI work, source
crawling, confidence copy, a generic refactor, or a formula retune.

## Provenance

Previous rerank:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`

Predecessor owner:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan`

Predecessor owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts`

Predecessor owner status:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Predecessor coverage refresh:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_plan`

Predecessor coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-coverage-refresh-contract.test.ts`

Predecessor coverage refresh status:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Rerank counters: `candidateCount: 8`,
`estimatedNextRuntimeValuesMoved: 7`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Runtime Owner

Owner action:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_plan`

Owner file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-owner-contract.test.ts`

Owner plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-16.md`

Owner status:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`floor.user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`

Runtime movement:

- single-output `Rw` now returns `Rw 53` from
  `predictor_lightweight_concrete_family_estimate`;
- single-output `C` now returns `C -5.5` from `Rw + C 47.5`;
- single-output `Ln,w` now returns `Ln,w 64.3` while preserving exact
  ASTM `AIIC 50`;
- partial mixed building/impact requests now carry `Rw 53`, `C -5.5`,
  `R'w 51`, `DnT,w 54`, `L'nT,50 66.7`, and `AIIC 50` without
  requiring `DeltaLw` in the requested output list.

Boundaries:

- `STC` and `Ctr` remain unsupported for this owner because the
  lightweight family companion carries `Rw + C`, not STC/Ctr basis.
- missing dynamic stiffness/load basis remains unsupported or
  `needs_input`.
- generic ASTM `IIC`/`AIIC` aliases remain unsupported without exact
  ASTM bands.
- no source rows are imported and no formula coefficients are retuned.

Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 7`,
`runtimeBasisPromotions: 4`, `runtimeValuesMoved 7`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Current Selected Next

Selected next action:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-16.md`

Selected next label:

`post-V1 floor user-material low-density exact ASTM lab-airborne impact target-output independence coverage refresh`

## Post-Owner Coverage Closeout

Coverage refresh:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`
and previous owner
`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-owner-contract.test.ts`
/
`post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_landed_runtime_selected_coverage_refresh`.
Selected candidate re-probed:
`floor.user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`.

Coverage counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next action:

`post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_plan`

Current selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md`

Current selected next label:

`post-V1 runtime-first route-family rerank after floor user-material low-density exact ASTM lab-airborne impact target-output independence`
