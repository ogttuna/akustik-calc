# System Map

Last reviewed for full route map: 2026-06-16
Material catalog support note added: 2026-06-23

Documentation map:
[DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md). Use that file for the
read order and sync rules; use this file for route-level implementation
orientation after the current handoff is understood.

Latest calculator excellence and cleanup review:
[CALCULATOR_EXCELLENCE_AND_CLEANUP_REVIEW_2026-06-15.md](./CALCULATOR_EXCELLENCE_AND_CLEANUP_REVIEW_2026-06-15.md).

Latest material catalog support orientation:
[PUBLIC_SOURCE_MATERIAL_CATALOG_EXPANSION_HANDOFF_2026-06-23.md](./PUBLIC_SOURCE_MATERIAL_CATALOG_EXPANSION_HANDOFF_2026-06-23.md).
The 2026-06-23 catalog expansion adds product-specific public-source
material rows and aliases under `packages/catalogs/src/materials/` and
`packages/engine/src/material-catalog.ts`, then proves those rows can
feed existing dynamic airborne and heavy floating-floor impact routes in
`packages/engine/src/material-catalog-expansion-direct-calculation-contract.test.ts`.
This did not add source result rows, retune formulas, move runtime
values, or replace the selected calculator slice.

Historical route notes below may preserve the `current` or `selected
next` wording from the checkpoint that created them. The current active
route summary immediately below is the route-level handoff for this
checkpoint.

Current active route summary:

- latest wall user-material formula field lab-companion basis integrity
  coverage refresh action:
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_plan`;
- latest wall user-material formula field lab-companion basis integrity
  coverage refresh file:
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest wall user-material formula field lab-companion basis integrity
  coverage refresh status:
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest wall user-material formula field lab-companion basis integrity
  coverage refresh plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md`;
- latest wall user-material formula field lab-companion basis integrity
  owner action:
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_plan`;
- latest wall user-material formula field lab-companion basis integrity
  owner file:
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-owner-contract.test.ts`;
- latest wall user-material formula field lab-companion basis integrity
  owner status:
  `post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest wall user-material formula field lab-companion basis integrity
  owner plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-17.md`;
- latest field lab-companion owner follows:
  `post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-coverage-refresh-contract.test.ts`
  /
  `post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`
  and
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-companion-completeness-contract.test.ts`
  /
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_landed_no_runtime_selected_wall_user_material_formula_field_lab_companion_basis_integrity_owner`;
- latest field lab-companion selected candidate:
  `wall.user_material_formula_field_lab_companion_basis_integrity_owner`;
- latest field lab-companion rerank counters:
  `candidateCount: 8`, `roiAnalysisIterations: 4`,
  `estimatedNextAccuracyPromotedTargetOutputs: 4`,
  `estimatedNextRuntimeValuesMoved: 3`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`;
- latest field lab-companion owner counters:
  `accuracyPromotedRequestShapes: 2`,
  `accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
  `newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
  `runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source
  crawl.
- latest field lab-companion owner values:
  `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`;
- latest field lab-companion coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source
  crawl.
- current selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_plan`;
- current selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-basis-integrity-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-17.md`;
- current selected next label:
  `post-V1 runtime-first route-family rerank after wall user-material formula field lab-companion basis integrity`;
- latest wall user-material formula companion completeness coverage
  refresh action:
  `post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_plan`;
- latest wall user-material formula companion completeness coverage
  refresh file:
  `packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-coverage-refresh-contract.test.ts`;
- latest wall user-material formula companion completeness coverage
  refresh status:
  `post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest wall user-material formula companion completeness coverage
  refresh plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_COVERAGE_REFRESH_PLAN_2026-06-17.md`;
- latest wall user-material formula companion completeness owner action:
  `post_v1_wall_user_material_formula_companion_completeness_owner_plan`;
- latest wall user-material formula companion completeness owner file:
  `packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-owner-contract.test.ts`;
- latest wall user-material formula companion completeness owner status:
  `post_v1_wall_user_material_formula_companion_completeness_owner_landed_runtime_selected_coverage_refresh`;
- latest wall user-material formula companion completeness owner plan:
  `docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_OWNER_PLAN_2026-06-17.md`;
- latest wall owner follows:
  `post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_plan`
  /
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-contract.test.ts`
  /
  `post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_landed_no_runtime_selected_wall_user_material_formula_companion_completeness_owner`;
- that rerank followed:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest wall owner selected candidate:
  `wall.user_material_formula_companion_completeness_owner`;
- latest wall coverage refresh counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source
  crawl.
- latest rerank counters:
  `candidateCount: 9`, `roiAnalysisIterations: 4`,
  `estimatedNextRuntimeValuesMoved: 8`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`;
- latest wall owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 8`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 8`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source
  crawl.
- latest wall owner values:
  `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9`;
- current selected next action:
  `post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_plan`;
- current selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-companion-completeness-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_COMPANION_COMPLETENESS_PLAN_2026-06-17.md`;
- current selected next label:
  `post-V1 runtime-first route-family rerank after wall user-material formula companion completeness`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence coverage refresh action:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence coverage refresh status:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence coverage follows:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`
  /
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`
  /
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence previous owner:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence selected candidate:
  `floor.user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence coverage counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- current selected next action:
  `post_v1_runtime_first_route_family_rerank_after_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_plan`;
- current selected next file:
  `packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md`;
- current selected next label:
  `post-V1 runtime-first route-family rerank after floor user-material low-density exact ASTM lab-airborne impact target-output independence`;
- route family: user-supplied floor exact ASTM impact plus ISO impact
  and lab/field/building companions, custom visible heavy and
  low-density floating-floor stacks;
- formula owners:
  `astm_e989_impact_rating_metric_schema_adapter_bridge`,
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`,
  `predictor_heavy_concrete_floor_airborne_companion_estimate`,
  `predictor_lightweight_concrete_family_estimate`,
  `source_absent_field_building_adapter_error_budget`;
- target outputs:
  `Rw`, `STC`, `C`, `Ctr`, `Ln,w`, `DeltaLw`, `L'n,w`, `L'nT,w`,
  `L'nT,50`, `IIC`, `AIIC`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and
  `DnT,A`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence owner:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_plan`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence owner file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-owner-contract.test.ts`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence owner status:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence follows:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`
  /
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`
  /
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence selected candidate:
  `floor.user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence predecessor owner:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence predecessor coverage:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner`;
- latest low-density exact ASTM lab-airborne impact target-output
  independence rerank counters:
  `candidateCount: 8`, `estimatedNextRuntimeValuesMoved: 7`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- latest low-density exact ASTM lab-airborne impact target-output
  independence runtime counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 4`,
  `newCalculableTargetOutputs: 7`, `runtimeBasisPromotions: 4`,
  `runtimeValuesMoved 7`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- current selected next action:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_coverage_refresh_plan`;
- current selected next file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-coverage-refresh-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-16.md`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  coverage refresh action:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_plan`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  coverage refresh status:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  coverage follows:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_plan`
  /
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-contract.test.ts`
  /
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  previous owner:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  selected candidate:
  `floor.user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  coverage counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- current selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan`;
- current selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts`;
- current selected next plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-16.md`;
- current selected next label:
  `post-V1 next numeric coverage gap after floor user-material low-density exact ASTM lab-airborne companion basis-integrity`;
- latest low-density exact ASTM field direct-flanking rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_plan`;
- latest low-density exact ASTM field direct-flanking rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-direct-flanking-companion-contract.test.ts`;
- latest low-density exact ASTM field direct-flanking rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner`;
- latest low-density exact ASTM field direct-flanking predecessor owner:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM field direct-flanking predecessor coverage:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM field direct-flanking selected candidate:
  `floor.user_material_low_density_exact_astm_field_direct_flanking_companion_owner`;
- latest low-density exact ASTM field direct-flanking rerank counters:
  `candidateCount: 8`, `estimatedNextRuntimeValuesMoved: 6`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- latest low-density exact ASTM field direct-flanking owner action:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_plan`;
- latest low-density exact ASTM field direct-flanking owner file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-owner-contract.test.ts`;
- latest low-density exact ASTM field direct-flanking owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest low-density exact ASTM field direct-flanking owner status:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM field direct-flanking owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 6`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 6`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- latest low-density exact ASTM field direct-flanking coverage refresh
  action:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_plan`;
- latest low-density exact ASTM field direct-flanking coverage refresh
  file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-coverage-refresh-contract.test.ts`;
- latest low-density exact ASTM field direct-flanking coverage refresh
  plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- latest low-density exact ASTM field direct-flanking coverage refresh
  status:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM field direct-flanking coverage counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- latest low-density exact ASTM lab-airborne companion basis-integrity
  rerank action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_plan`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-contract.test.ts`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  rerank plan:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_PLAN_2026-06-16.md`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  selected candidate:
  `floor.user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  rerank predecessor owner:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  rerank predecessor coverage:
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  rerank counters:
  `candidateCount: 9`, `estimatedNextRuntimeValuesMoved: 4`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- latest low-density exact ASTM lab-airborne companion basis-integrity
  owner action:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  owner file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-16.md`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  owner status:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM lab-airborne companion basis-integrity
  owner counters:
  `runtimeValuesMoved 4`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- current selected next action:
  `post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_plan`;
- current selected next route file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-coverage-refresh-contract.test.ts`;
- current selected next plan doc:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- latest low-density exact ASTM direct-flanking rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_plan`;
- latest low-density exact ASTM direct-flanking rerank file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts`;
- latest low-density exact ASTM direct-flanking rerank status:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner`;
- latest low-density exact ASTM direct-flanking rerank predecessor owner:
  `post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM direct-flanking rerank predecessor
  coverage refresh:
  `post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`
  /
  `post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM direct-flanking selected candidate:
  `floor.user_material_low_density_exact_astm_direct_flanking_companion_owner`;
- latest low-density exact ASTM direct-flanking rerank counters:
  `candidateCount: 8`, `estimatedNextRuntimeValuesMoved: 17`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- latest low-density exact ASTM direct-flanking owner action:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan`;
- latest low-density exact ASTM direct-flanking owner file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts`;
- latest low-density exact ASTM direct-flanking owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_OWNER_PLAN_2026-06-16.md`;
- latest low-density exact ASTM direct-flanking owner status:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh`;
- latest low-density exact ASTM direct-flanking owner counters:
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
  `newCalculableTargetOutputs: 17`, `runtimeBasisPromotions: 2`,
  `runtimeValuesMoved 17`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- latest low-density exact ASTM direct-flanking coverage refresh action:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_plan`;
- latest low-density exact ASTM direct-flanking coverage refresh file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-coverage-refresh-contract.test.ts`;
- latest low-density exact ASTM direct-flanking coverage refresh plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`;
- latest low-density exact ASTM direct-flanking coverage refresh status:
  `post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM direct-flanking coverage counters:
  `coverageRefreshContractFilesTouched: 1`,
  `newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
  `newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
  `runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
  `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- current selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_plan`;
- current selected next route file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-direct-flanking-companion-contract.test.ts`;
- current selected next plan doc:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_PLAN_2026-06-16.md`;
- latest low-density exact ASTM coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`;
- latest low-density exact ASTM coverage refresh action:
  `post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan`;
- latest low-density exact ASTM coverage refresh status:
  `post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`;
- latest low-density exact ASTM selected candidate:
  `floor.user_material_low_density_exact_astm_companion_owner`;
- latest low-density exact ASTM selected next route file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts`;
- latest low-density exact ASTM selected next action:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_plan`;
- latest low-density exact ASTM selected next plan doc:
  `docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_PLAN_2026-06-16.md`;
- latest low-density exact ASTM coverage counters:
  `coverageRefreshContractFilesTouched: 1`,
  `runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
  `runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
  `frontendImplementationFilesTouched: 0`; this is not a broad source crawl.
- latest landed rerank:
  `post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan`;
- latest landed owner:
  `floor.user_material_visible_floating_astm_exact_band_field_impact_companion_owner`;
- latest runtime owner:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts`;
- latest closed coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`;
- latest no-runtime rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`.
- latest input-surface owner:
  `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`;
- latest post-missing-topology no-runtime rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`;
- latest porous flow-resistivity input owner:
  `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`;
- latest porous flow-resistivity coverage refresh:
  `packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`;
- latest post-flow no-runtime rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`.
- latest floor user-material impact owner:
  `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`;
- latest floor user-material impact coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`;
- latest floor user-material impact field-only rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`;
- latest floor user-material impact field-only owner:
  `packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`.
- latest floor user-material impact field-only coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`.
- latest floor user-material low-density rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`;
- latest floor user-material low-density owner:
  `packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`;
- latest floor user-material low-density coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`;
- latest floor user-material visible floating load-basis owner:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts`;
- latest floor user-material visible floating load-basis coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts`;
- latest floor user-material visible floating mixed lab-companion rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-load-basis-contract.test.ts`;
- latest floor user-material visible floating mixed lab-companion owner:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`;
- latest floor user-material visible floating mixed lab-companion coverage
  refresh:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`;
- latest floor user-material visible floating heavy airborne companion
  rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts`.
- latest floor user-material visible floating heavy airborne companion
  owner:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts`.
- latest floor user-material visible floating heavy airborne companion
  coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts`.
- latest floor user-material visible floating ASTM exact-band mixed ISO
  rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts`.
- latest floor user-material visible floating ASTM exact-band mixed ISO
  owner:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts`.
- latest floor user-material visible floating ASTM exact-band mixed ISO
  coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts`.
- latest floor user-material visible floating ASTM exact-band field
  impact companion rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts`.
- latest floor user-material visible floating ASTM exact-band field
  impact companion owner:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts`.
- latest floor user-material visible floating ASTM exact-band field
  impact companion coverage refresh:
  `packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`.
- latest floor user-material low-density exact ASTM companion rerank:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`.
- latest floor user-material low-density exact ASTM companion owner:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts`.
- latest floor user-material low-density exact ASTM companion owner plan:
  `docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_OWNER_PLAN_2026-06-16.md`.
- selected next route file:
  `packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`.

Latest floor user-material low-density exact ASTM companion owner
2026-06-16:
`post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts`
with plan doc
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_OWNER_PLAN_2026-06-16.md`
with status
`post_v1_floor_user_material_low_density_exact_astm_companion_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_companion_owner`.
That rerank followed
`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`,
ran `candidateCount: 11`, and estimated
`estimatedNextRuntimeValuesMoved: 12` with `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Selected candidate:
`floor.user_material_low_density_exact_astm_companion_owner`.
The owner calculates `Rw 53`, `Ln,w 64.3`, `DeltaLw 24.3`,
`L'n,w 66.3`, `L'nT,w 63.9`, `L'nT,50 66.9`, and exact ASTM
`IIC 50` / `AIIC 50`. Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 10`,
`runtimeBasisPromotions: 4`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Current selected next:
`post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`
/
`post-V1 floor user-material low-density exact ASTM companion coverage refresh`.

Latest floor user-material visible floating ASTM exact-band field impact
companion coverage refresh 2026-06-16:
`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_landed_runtime_selected_coverage_refresh`.
Selected candidate re-probed:
`floor.user_material_visible_floating_astm_exact_band_field_impact_companion_owner`.
The refresh protects exact ASTM `IIC 50` / `AIIC 50`, ISO
`Ln,w 50.1` / `DeltaLw 24.4`, field companions `L'n,w 52.1`,
`L'nT,w 49.7`, `L'nT,50 52.7`, and airborne companions `Rw 58`,
`STC 57`, `C -1.8`, and `Ctr -7.3`. Missing physical inputs, generic
aliases, source crawling, and formula retuning remain outside. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_PLAN_2026-06-16.md`
/
`post-V1 next numeric coverage gap after floor user-material visible floating ASTM exact-band field impact companion`.

Latest floor user-material visible floating ASTM exact-band field impact
companion owner 2026-06-16:
`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_landed_runtime_selected_coverage_refresh`.
Runtime owner plan doc:
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_OWNER_PLAN_2026-06-16.md`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner`.
That rerank carried `candidateCount: 10`,
`estimatedNextRuntimeValuesMoved: 6`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Selected candidate:
`floor.user_material_visible_floating_astm_exact_band_field_impact_companion_owner`.
The owner keeps exact ASTM `IIC 50` / `AIIC 50`, ISO `Ln,w 50.1` /
`DeltaLw 24.4`, field companions `L'n,w 52.1`, `L'nT,w 49.7`, and
`L'nT,50 52.7`, plus airborne companions `Rw 58`, `STC 57`, `C -1.8`,
and `Ctr -7.3`. Generic aliases, missing field inputs, source crawling,
and formula retuning remain outside. Counters:
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 6`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 6`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next:
`post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`
/
`post-V1 floor user-material visible floating ASTM exact-band field impact companion coverage refresh`.

Latest floor user-material visible floating ASTM exact-band mixed ISO
companion coverage refresh 2026-06-16:
`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_landed_runtime_selected_coverage_refresh`.
Selected candidate re-probed:
`floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`.
The refresh protects exact ASTM `IIC` / `AIIC`, same-stack ISO
`Ln,w 50.1` and `DeltaLw 24.4`, and heavy airborne companions `Rw 58`,
`STC 57`, `C -1.8`, and `Ctr -7.3`; generic ASTM aliases, non-ASTM
exact methods, missing dynamic stiffness, and missing load basis remain
outside the mixed owner. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_PLAN_2026-06-16.md`
/
`post-V1 next numeric coverage gap after floor user-material visible floating ASTM exact-band mixed ISO companion`.

Latest floor user-material visible floating ASTM exact-band mixed ISO
companion owner 2026-06-16:
`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`.
Selected candidate:
`floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`.
The owner composes three owned routes for the same custom visible heavy
floating-floor stack: exact ASTM `IIC` / `AIIC`, ISO `Ln,w 50.1` /
`DeltaLw 24.4`, and heavy airborne `Rw 58`, `STC 57`, `C -1.8`,
`Ctr -7.3`. It keeps generic ASTM aliases, missing dynamic
stiffness/load basis, and broad source crawling outside. Counters:
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 12`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next:
`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`
/
`post-V1 floor user-material visible floating ASTM exact-band mixed ISO companion coverage refresh`.

Latest floor user-material visible floating ASTM exact-band mixed ISO
rerank 2026-06-16:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_landed_no_runtime_selected_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`.
It follows
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
Previous owner:
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_landed_runtime_selected_coverage_refresh`.
Selected candidate:
`floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner`.
The rerank selects the mixed runtime owner because exact ASTM
`IIC`/`AIIC` requests currently keep the ASTM rating but suppress owned
ISO `Ln,w`/`DeltaLw` and downgrade heavy airborne companions to
screening. Counters: `candidateCount 9`, `roiAnalysisIterations: 4`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextRuntimeValuesMoved: 12`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextCalculableTargetOutputs: 12`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Current selected next:
`post_v1_floor_user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-mixed-iso-companion-owner-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_MIXED_ISO_COMPANION_OWNER_PLAN_2026-06-16.md`
/
`post-V1 floor user-material visible floating ASTM exact-band mixed ISO companion owner`.

Historical floor user-material visible floating heavy airborne companion
coverage refresh 2026-06-16:
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_landed_runtime_selected_coverage_refresh`.
Selected candidate re-probed:
`floor.user_material_visible_floating_heavy_airborne_companion_owner`.
The refresh keeps the heavy airborne companion basis at
`predictor_heavy_concrete_floor_airborne_companion_estimate` for custom
visible heavy floating floors, re-probes `Rw 58`, `Ctr -7.3`,
`Ln,w 50.1`, `DeltaLw 24.4`, and field `L'n,w 52.1`,
`L'nT,w 49.7`, `L'nT,50 52.7`, while preserving low-density,
missing-dynamic-stiffness, default-catalog, and ASTM impact boundaries.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_heavy_airborne_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-heavy-airborne-companion-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_PLAN_2026-06-16.md`
/
`post-V1 next numeric coverage gap after floor user-material visible floating heavy airborne companion`.

Historical floor user-material visible floating heavy airborne companion
owner 2026-06-16:
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_landed_no_runtime_selected_floor_user_material_visible_floating_heavy_airborne_companion_owner`.
Selected candidate:
`floor.user_material_visible_floating_heavy_airborne_companion_owner`.
The owner promotes the custom visible heavy floating-floor lab airborne
companion basis to `predictor_heavy_concrete_floor_airborne_companion_estimate`,
moving `Rw 58` and `Ctr -7.3` while preserving `Ln,w 50.1` and
`DeltaLw 24.4`. Counters: `accuracyPromotedRequestShapes: 1`,
`accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Historical selected next at the heavy airborne companion owner checkpoint:
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`
/
`post-V1 floor user-material visible floating heavy airborne companion coverage refresh`.

Historical floor user-material visible floating heavy airborne companion
rerank 2026-06-16:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_landed_no_runtime_selected_floor_user_material_visible_floating_heavy_airborne_companion_owner`.
It follows
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh`
and
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
Selected candidate:
`floor.user_material_visible_floating_heavy_airborne_companion_owner`.
The rerank keeps the scope on calculator accuracy: custom visible heavy
floating floors already calculate `Ln,w 50.1` and `DeltaLw 24.4`
through `predictor_heavy_floating_floor_iso12354_annexc_estimate`, while
`Rw`, `STC`, `C`, and `Ctr` remain on
`screening_mass_law_curve_seed_v3`. Counters: `candidateCount 8`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 2`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 4`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Historical selected next at the heavy airborne companion rerank checkpoint:
`post_v1_floor_user_material_visible_floating_heavy_airborne_companion_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-heavy-airborne-companion-owner-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_HEAVY_AIRBORNE_COMPANION_OWNER_PLAN_2026-06-16.md`
/
`post-V1 floor user-material visible floating heavy airborne companion owner`.

Historical floor user-material visible floating mixed lab-companion
coverage refresh 2026-06-16:
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh`.
Selected candidate re-probed:
`floor.user_material_visible_floating_mixed_lab_companion_owner`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the mixed lab-companion coverage refresh checkpoint:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_mixed_lab_companion_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-mixed-lab-companion-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_PLAN_2026-06-16.md`
/
`post-V1 next numeric coverage gap after floor user-material visible floating mixed lab-companion`.

Latest floor user-material visible floating mixed lab-companion owner
2026-06-16:
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-load-basis-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_landed_no_runtime_selected_floor_user_material_visible_floating_mixed_lab_companion_owner`.
Selected candidate:
`floor.user_material_visible_floating_mixed_lab_companion_owner`.
The route keeps explicit `CI`, `CI,50-2500`, and `Ln,w+CI` supported in
mixed custom heavy floating-floor requests while incomplete field output
`L'nT,50` remains unsupported. Complete field context still supports
`L'n,w`, `L'nT,w`, and `L'nT,50`.

Historical selected next at the mixed lab-companion owner checkpoint:
`post_v1_floor_user_material_visible_floating_mixed_lab_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-16.md`
/
`post-V1 floor user-material visible floating mixed lab-companion coverage refresh`.

Historical floor user-material visible floating load-basis coverage
refresh 2026-06-16:
`post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_visible_floating_load_basis_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts`
/
`post_v1_floor_user_material_visible_floating_load_basis_owner_landed_runtime_selected_coverage_refresh`
and the prior selected action
`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan`.
Selected candidate re-probed:
`floor.user_material_visible_floating_load_basis_owner`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the load-basis coverage refresh checkpoint:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-load-basis-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_PLAN_2026-06-16.md`
/
`post-V1 next numeric coverage gap after floor user-material visible floating load-basis`.

Latest floor user-material low-density floating-floor family coverage
refresh 2026-06-15:
`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_low_density_floating_floor_family_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`
/
`post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh`
and
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner`.
Selected candidate re-probed:
`floor.user_material_low_density_floating_floor_family_owner`.
The refresh keeps custom low-density values at `Rw 53`, `Ln,w 64.3`,
`DeltaLw 24.3`, `L'n,w 66.3`, `L'nT,w 63.9`, and `L'nT,50 66.9`;
heavy custom concrete remains on the heavy floating-floor basis and
generic `IIC` / `AIIC` remains unsupported. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the low-density coverage refresh checkpoint:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_floating_floor_family_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-floating-floor-family-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_PLAN_2026-06-15.md`
/
`post-V1 next numeric coverage gap after floor user-material low-density floating-floor family`.

Latest floor user-material low-density floating-floor family owner
2026-06-15:
`post_v1_floor_user_material_low_density_floating_floor_family_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts`
with status
`post_v1_floor_user_material_low_density_floating_floor_family_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner`.
Selected candidate:
`floor.user_material_low_density_floating_floor_family_owner`.
The owner calculates `Rw 53`, `Ln,w 64.3`, `DeltaLw 24.3`, `L'n,w
66.3`, `L'nT,w 63.9`, and `L'nT,50 66.9` for a custom visible
low-density concrete floating-floor stack. Generic `IIC` / `AIIC`
remains unsupported, and heavy custom concrete remains on the heavy
floating-floor basis. Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 6`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 6`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Historical selected next at the owner checkpoint:
`post_v1_floor_user_material_low_density_floating_floor_family_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_COVERAGE_REFRESH_PLAN_2026-06-15.md`
/
`post-V1 floor user-material low-density floating-floor family coverage refresh`.

Latest floor user-material impact context field-only adapter coverage
refresh 2026-06-15:
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`
and
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`.
It re-probes
`floor.user_material_impact_context_field_only_adapter_owner` without
moving runtime values. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Current selected next:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_PLAN_2026-06-15.md`
/
`post-V1 next numeric coverage gap after floor user-material impact context field-only adapter`.

Latest floor user-material impact context field-only adapter owner
2026-06-15:
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`.
Selected candidate:
`floor.user_material_impact_context_field_only_adapter_owner`.
The owner connects the context-owned lab impact anchor to field-only
requests and publishes `L'n,w 52.3`, `L'nT,w 49.9`, and `L'nT,50
52.9` when field K, receiving-room volume, and `ci50_2500Db` are
present. Counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Current selected next:
`post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-15.md`
/
`post-V1 floor user-material impact context field-only adapter coverage refresh`.

Latest floor user-material impact context field-only adapter rerank
2026-06-15:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`.
It follows
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`
and
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
Selected candidate:
`floor.user_material_impact_context_field_only_adapter_owner`.
The rerank ran `roiAnalysisIterations: 4` and selected field-only
custom heavy floating-floor impact ownership after mixed field requests
were proven already live. Counters: `candidateCount 12`,
`estimatedNextRuntimeValuesMoved: 3`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 3`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Historical selected next at the rerank checkpoint:
`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_OWNER_PLAN_2026-06-15.md`
/
`post-V1 floor user-material impact context field-only adapter owner`.

Latest floor user-material impact context dynamic-stiffness coverage
refresh 2026-06-15:
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`
/
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`.
It closes
`floor.user_material_impact_context_dynamic_stiffness_owner`.
The refresh re-probes the custom heavy floating-floor stack at
`Ln,w 50.3` and `DeltaLw 24.3`, keeps
`predictor_heavy_floating_floor_iso12354_annexc_estimate`, keeps missing
`resilientLayerDynamicStiffnessMNm3` or `loadBasisKgM2` at
`needs_input`, keeps low-density custom concrete outside the heavy
concrete route, and keeps ASTM/IIC/AIIC plus field/building impact
outputs outside this owner. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the coverage refresh checkpoint:
`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md`
/
`post-V1 next numeric coverage gap after floor user-material impact context dynamic stiffness`.

Latest floor user-material impact context dynamic-stiffness owner
2026-06-12:
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`
landed in
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`
with status
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`.
Selected candidate:
`floor.user_material_impact_context_dynamic_stiffness_owner`.
The owner lets custom visible heavy floating-floor stacks use
`floorImpactContext.resilientLayerDynamicStiffnessMNm3` and
`floorImpactContext.loadBasisKgM2`; the pinned custom stack calculates
`Ln,w 50.3` and `DeltaLw 24.3` through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`. Missing
dynamic stiffness/load basis remains `needs_input`, and low-density
custom concrete remains outside the heavy concrete carrier route.
Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Historical selected next at the owner checkpoint:
`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_COVERAGE_REFRESH_PLAN_2026-06-12.md`
/
`post-V1 floor user-material impact context dynamic-stiffness coverage refresh`.

Latest post-flow numeric coverage-gap rerank 2026-06-12:
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`.
It follows
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
Selected candidate:
`floor.user_material_impact_context_dynamic_stiffness_owner`.
The rerank ran `roiAnalysisIterations: 3`, subtracted closed wall
user-material lanes, and selected the floor user-material impact context
dynamic-stiffness owner. Counters: `candidateCount 11`,
`estimatedNextRuntimeValuesMoved: 2`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 2`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Historical selected next at the post-flow rerank checkpoint:
`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`
/
`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`
/
`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_OWNER_PLAN_2026-06-12.md`
/
`post-V1 floor user-material impact context dynamic-stiffness owner`.

Latest user-material porous flow-resistivity input coverage refresh
2026-06-12:
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`
and the prior rerank
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`.
It closes
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`
without moving values. Numeric user flow, explicit engineering default,
and context-owned absorber flow remain pinned; missing user/unknown
`flowResistivityPaSM2` remains `needs_input`. Counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the coverage refresh checkpoint:
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_PLAN_2026-06-12.md`
/
`post-V1 next numeric coverage gap after user-material porous flow-resistivity input`.

Latest user-material porous flow-resistivity input owner 2026-06-12:
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`.
It follows
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`
and owns
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`.
The owner preserves numeric user-supplied porous flow, explicit
engineering-default flow with wider budget, and context-owned absorber
flow; missing user-supplied or unknown `flowResistivityPaSM2` stays at
`needs_input` for lab, field, and building requests. Counters:
`accuracyBoundaryRowsMoved: 2`, `needsInputBoundaryRowsAdded: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at the owner checkpoint:
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md`
/
`post-V1 wall double-leaf/framed user-material porous flow-resistivity input coverage refresh`.

Latest post-missing-topology numeric gap rerank 2026-06-12:
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`.
It follows
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`.
It selected
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`
after `roiAnalysisIterations: 3`; counters include
`candidateCount 10`, `estimatedNextAccuracyBoundaryRowsMoved: 2`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesProtectedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at that rerank checkpoint:
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_OWNER_PLAN_2026-06-12.md`
/
`post-V1 wall double-leaf/framed user-material porous flow-resistivity input owner`.

Latest user-material missing-topology input-surface owner 2026-06-12:
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`.
It owns
`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`
without moving runtime values. Explicit custom user-material topology
still calculates through the formula owner / Gate I / Gate AR, while
missing topology asks for `sideALeafGroup`, `cavity1DepthMm`,
`sideBLeafGroup`, `frameBridgeClass`, `supportTopology`, and
`supportSpacingMm`. Counters: `inputSurfaceOwnerContractFilesTouched: 1`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next at that checkpoint:
`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_PLAN_2026-06-12.md`
/
`post-V1 next numeric coverage gap after user-material missing-topology input surface`.

Latest post-user-material numeric gap rerank 2026-06-12:
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_landed_no_runtime_selected_user_material_missing_topology_input_surface_owner`.
It selected
`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`
after `roiAnalysisIterations: 3`; counters include
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Historical selected next:
`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_OWNER_PLAN_2026-06-12.md`
/
`post-V1 wall double-leaf/framed user-material missing-topology input-surface owner`.

Latest user-material double-leaf route-input rerank and owner 2026-06-12:
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_landed_no_runtime_selected_user_material_double_leaf_route_input_owner`.
It selected `wall.double_leaf_framed.user_material_route_input_owner`
after `roiAnalysisIterations: 3`; counters include
`estimatedNextRuntimeValuesMoved: 12`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_route_input_owner_landed_runtime_selected_coverage_refresh`.
System route: custom explicit `panel_leaf / porous_absorber /
panel_leaf` double-leaf/framed user materials now calculate lab
`Rw/STC/C/Ctr` through the formula owner, and field/building
`R'w/Dn,w/Dn,A/DnT,w/DnT,A` through Gate I / Gate AR. Counters:
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 3`,
`newCalculableTargetOutputs: 12`, `runtimeBasisPromotions: 3`,
`runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 0`. This is not a broad source
crawl.

Coverage refresh:
`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It re-probes lab `Rw 46 / STC 46 / C -1 / Ctr -6.1`,
field `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`,
and building `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 /
DnT,A 41.9`. Unknown custom material IDs, missing explicit topology,
ASTM/IIC/AIIC, and impact outputs remain outside the owner. This is not
a broad source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Coverage refresh selected rerank, now landed:
`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_ROUTE_INPUT_PLAN_2026-06-12.md`
/
`post-V1 next numeric coverage gap after user-material route input`.

Latest direct-fixed A-weighted field/building coverage refresh 2026-06-12:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
System route: empty `Dn,A 24.9` / `DnT,A 27`, full absorptive
`Dn,A 28.9` / `DnT,A 31`, and partial absorptive `Dn,A 26.9` /
`DnT,A 29` stay on Gate EO + Gate I / Gate AR. Field uses
`gate_i_airborne_field_apparent_context_adapter_runtime`; building uses
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
use `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
The Gate I / Gate AR rows remain `ready_with_budget` and
`allowed_with_budget`; route boundaries remain explicit for missing
absorber ownership, Gate AY panelized input, non-direct-fixed stacks,
lab aliases, ASTM/IIC/AIIC, and impact outputs. This is not a broad
source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next:
`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-12.md`
/
`post-V1 next numeric coverage gap after direct-fixed A-weighted field/building`.

Latest direct-fixed A-weighted field/building surface parity 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
System route: workbench/API/replay/card/status/report surfaces now keep
empty `Dn,A 24.9` / `DnT,A 27`, full absorptive `Dn,A 28.9` /
`DnT,A 31`, and partial absorptive `Dn,A 26.9` / `DnT,A 29` on Gate
EO + Gate I / Gate AR. Field uses
`gate_i_airborne_field_apparent_context_adapter_runtime`; building uses
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
use `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_COVERAGE_REFRESH_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building coverage refresh`.

Latest direct-fixed A-weighted field/building owner 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_landed_runtime_selected_surface_parity`.
Selected candidate:
`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`.
It follows
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
/
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`.
System route: A-only direct-fixed field/building requests now use Gate
EO + Gate I / Gate AR, with empty `Dn,A 24.9` / `DnT,A 27`, full
absorptive `Dn,A 28.9` / `DnT,A 31`, and partial absorptive
`Dn,A 26.9` / `DnT,A 29`. This is not a broad source crawl. Counters:
`newCalculableRequestShapes: 4`, `correctedRequestShapes: 2`,
`newCalculableTargetOutputs: 2`, `runtimeBasisPromotions: 2`,
`runtimeValuesMoved 12`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_SURFACE_PARITY_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building surface parity`.

Latest numeric gap after direct-fixed context absorptive cavity field/building adapter 2026-06-11:
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
landed in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner`.
Selected candidate:
`wall.direct_fixed_double_leaf.a_weighted_field_building_owner`.
The rerank ran `roiAnalysisIterations: 3` and selected
`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_OWNER_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed A-weighted field/building owner`.
System reason: Gate ER mixed base+A direct-fixed requests already
calculate `Dn,A` / `DnT,A`, but A-only full/partial absorptive rows stay
unsupported and empty direct-fixed A-only rows can miss the Gate ER base
curve. This is not a broad source crawl. Counters: `candidateCount 7`,
`aWeightedOnlyUnsupportedRowsRechecked 4`,
`aWeightedOnlyMisroutedRowsRechecked 2`,
`estimatedNextRuntimeValuesMoved: 12`,
`immediateRuntimeValuesMoved: 0`, `runtimeBasisPromotions: 0`,
`runtimeFormulaRetunes: 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest direct-fixed context absorptive cavity field/building adapter coverage refresh 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`
and closes
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_landed_no_runtime_selected_coverage_refresh`.
System posture: field `gate_i_airborne_field_apparent_context_adapter_runtime`,
building `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`,
Gate EO base
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
Pinned values: full `R'w 29`, `Dn,w 30`, `DnT,w 32`; partial
`R'w 27`, `Dn,w 28`, `DnT,w 30`. Coverage and company-internal V0 stay
`ready_with_budget` / `allowed_with_budget`. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next:
`post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan`
/
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts`
/
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_PLAN_2026-06-11.md`
/
`post-V1 next numeric coverage gap after direct-fixed context absorptive cavity field/building adapter`.

Latest direct-fixed context absorptive cavity field/building adapter surface parity 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
Surface route map: workbench live calculation, API payloads, saved
replay, server snapshot replay, cards, target-output status, and report
summaries expose the same field/building bases:
`gate_i_airborne_field_apparent_context_adapter_runtime`,
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`, and
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`.
Full values are `R'w 29`, `Dn,w 30`, `DnT,w 32`; partial values are
`R'w 27`, `Dn,w 28`, `DnT,w 30`. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`.
Current selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter coverage refresh`.

Latest direct-fixed context absorptive cavity field/building adapter owner 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner`.
Runtime route map: direct-fixed context-owned absorptive field requests
use `gate_i_airborne_field_apparent_context_adapter_runtime`; direct-
fixed context-owned absorptive building requests use
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
use `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the Gate EO direct curve. Full values are `R'w 29`, `Dn,w 30`,
`DnT,w 32`; partial values are `R'w 27`, `Dn,w 28`, `DnT,w 30`.
Lab pins remain `Rw 35`, `STC 35`, `C -1.2`, `Ctr -5.9`; `Rw 33`,
`STC 33`, `C -1.2`, `Ctr -5.9`; and `Rw 31`, `STC 31`, `C -1.2`,
`Ctr -5.9`. This is not a broad source crawl. Counters:
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`.
Current selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_SURFACE_PARITY_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter surface parity`.

Latest direct-fixed context absorptive cavity coverage refresh 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_field_building_adapter_owner`.
It closes
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
The engine path stays
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`.
Full direct-fixed context-owned absorptive cavity pins `Rw 35`,
`STC 35`, `C -1.2`, `Ctr -5.9`; partial pins `Rw 33`, `STC 33`,
`C -1.2`, `Ctr -5.9`; empty pins `Rw 31`, `STC 31`, `C -1.2`,
`Ctr -5.9`. The open high-ROI field/building gap is now explicit:
full/partial direct-fixed context-owned absorptive cavity
field/building requests still fall to the Gate AY unsupported boundary.
This is not a broad source crawl. Counters:
`coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextRuntimeValuesMoved: 12`, and
`broadSourceCrawlSelected false`.
Current selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity field/building adapter owner`.

Latest direct-fixed context absorptive cavity surface parity 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
The workbench and report surface now expose
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`.
Full direct-fixed context-owned absorptive cavity pins `Rw 35`,
`STC 35`, `C -1.2`, `Ctr -5.9`; partial pins `Rw 33`, `STC 33`,
`C -1.2`, `Ctr -5.9`; empty remains `Rw 31`, `STC 31`, `C -1.2`,
`Ctr -5.9`. This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Current selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner coverage refresh`.

Latest direct-fixed context absorptive cavity owner 2026-06-11:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner`.
The runtime path is
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
with selected candidate
`candidate_wall_direct_fixed_double_leaf_bridge_loss_equivalent_coupled_mass`.
Full direct-fixed context-owned absorptive cavity now pins `Rw 35`,
`STC 35`, `C -1.2`, `Ctr -5.9`; partial pins `Rw 33`, `STC 33`,
`C -1.2`, `Ctr -5.9`; empty remains `Rw 31`, `STC 31`, `C -1.2`,
`Ctr -5.9`. This is not a broad source crawl. Counters:
`newCalculableRequestShapes: 1`, `newCalculableTargetOutputs: 4`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 4`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`.
Historical selected surface-parity follow-up:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_surface_parity_plan`
/
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-surface-parity.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner surface parity`.

Latest coverage refresh 2026-06-11:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_landed_no_runtime_selected_direct_fixed_context_absorptive_cavity_owner`.
It closes
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`
and follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`.
The active source-absent route remains
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`
as `ready_with_budget` and `allowed_with_budget`. Full context-owned
absorptive cavity stays `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`;
partial stays `Rw 44`, `STC 44`, `C -1`, `Ctr -6.1`; empty stays
`Rw 42`, `STC 42`, `C -1`, `Ctr -6.1`. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextNewCalculableRequestShapes: 1`,
`estimatedNextNewCalculableTargetOutputs: 4`, and
`estimatedNextRuntimeBasisPromotions: 1`.
Current selected next:
`post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_OWNER_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed direct-fixed context absorptive cavity owner`.
Route family: `wall.double_leaf_framed`; target outputs: `Rw`, `STC`,
`C`, `Ctr`; required physical inputs: side leaf groups, side leaf masses,
cavity depth, direct-fixed support topology, support spacing, absorptive
cavity coverage/class, and context-level absorber flow-resistivity
ownership. Expected scope: direct-fixed context-owned absorptive cavity
assemblies calculate through an owned direct-fixed bridge-loss formula
path instead of Gate AY `needs_input`.

Latest surface parity 2026-06-11:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`
landed in
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`
with status
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_landed_no_runtime_selected_coverage_refresh`.
It follows
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`
and
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
Workbench live calculation, API payloads, saved replay, server snapshot
replay, cards, target status, and reports now expose the same `Rw 46`,
`STC 46`, `C -1`, and `Ctr -6.1` answer on runtime basis
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Current selected next:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_COVERAGE_REFRESH_PLAN_2026-06-11.md`
/
`post-V1 wall double-leaf/framed context absorptive cavity input owner coverage refresh`.

Latest runtime owner 2026-06-11:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_landed_runtime_selected_surface_parity`.
It follows
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
The context-owned full absorptive cavity owner maps explicit absorber
input to `flowResistivitySource=user_supplied` and calculates `Rw 46`,
`STC 46`, `C -1`, and `Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
with selected candidate
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`.
This is not a broad source crawl. Counters:
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Historical selected next action:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_surface_parity_plan`.
Historical selected next file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-surface-parity.test.ts`.
Historical selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_SURFACE_PARITY_PLAN_2026-06-11.md`.
Historical selected next label:
`post-V1 wall double-leaf/framed context absorptive cavity input owner surface parity`.

Latest calculator closeout 2026-06-11:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`
landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_landed_no_runtime_selected_context_absorptive_cavity_input_owner`.
It follows
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`
/
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh`,
freezes `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
and
`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`,
and keeps the route `ready_with_budget` / `allowed_with_budget`. This is
not a broad source crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.

Current selected next:
`post_v1_wall_double_leaf_framed_context_absorptive_cavity_input_owner_plan`
in
`packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts`
with plan
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CONTEXT_ABSORPTIVE_CAVITY_INPUT_OWNER_PLAN_2026-06-11.md`
and label `post-V1 wall double-leaf/framed context absorptive cavity input
owner`. Route family `wall.double_leaf_framed`; target outputs `Rw`,
`STC`, `C`, `Ctr`; required physical inputs include side leaf groups,
cavity depth, non-direct-fixed support topology, support spacing,
absorptive cavity coverage/class, and context-level absorber
flow-resistivity ownership. Expected scope: absorptive cavity assemblies
calculate without requiring a visible porous layer.

Document role:

- explain what the acoustic calculator product actually is today
- map the user flow to the real runtime and file boundaries
- separate engine truth, UI truth, API glue, persistence, and test surfaces
- give future agents one place to answer “how does the system work?” before
  changing solver, workbench, or docs

Use this together with the calculator source-of-truth chain:

- [NEXT_AGENT_BRIEF.md](./NEXT_AGENT_BRIEF.md)
  — fastest current handoff for mission, checkpoint, selected next action,
  and validation status
- [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
  — first authority for product goal, current status, and next-slice
  selection
- [../../AGENTS.md](../../AGENTS.md) — repository-level calculator
  authority order
- [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md)
  — closed company-internal usable V1 acceptance contract
- [CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md](./CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md)
  — latest docs/implementation/test reconciliation after the
  post-Gate-ET double-leaf route-input boundary fix; also records the
  thick `gypsum_board` vs `lined_massive_wall` ambiguity; Gate EU has
  since landed
- [CHECKPOINT_2026-06-08_GATE_ET_BOUNDARY_HANDOFF.md](./CHECKPOINT_2026-06-08_GATE_ET_BOUNDARY_HANDOFF.md)
  — Gate ET boundary closeout; Gate EM/EN/EO/EP/EQ/ER/ES/ET evidence is
  focused-green, and Gate EU has since landed
- [POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md](./POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md)
  — selected post-V1 capability plan; the chain has advanced past
  Gate FF, post double-leaf/framed revalidation, and compatible
  anchor-delta building `Dn,A` owner
- [POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md](./POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md)
  — landed Gate FE numeric coverage/accuracy rerank, landed Gate FF
  current formula scope/accuracy ledger, and historical post
  double-leaf/framed coverage revalidation selection
- [POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md](./POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md)
  — landed Gate FD floor raw-bare/floating holdout owner rejection and
  selected Gate FE numeric coverage/accuracy rerank
- [POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md](./POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md)
  — landed Gate FC numeric coverage/accuracy rerank and selected Gate
  FD floor raw-bare/floating holdout prerequisite
- [POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md](./POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md)
  — landed Gate FB owner rejection and selected Gate FC numeric
  coverage/accuracy rerank
- [POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md](./POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md)
  — landed Gate FA current coverage/accuracy gap ledger and selected
  Gate FB opening/leak common wall residual owner proof
- [POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md](./POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md)
  — landed Gate EZ numeric rerank and selected Gate FA current
  coverage/accuracy gap ledger
- [POST_V1_GATE_EY_EZ_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_CLOSEOUT_PLAN_2026-06-09.md](./POST_V1_GATE_EY_EZ_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_CLOSEOUT_PLAN_2026-06-09.md)
  — landed Gate EY targeted evidence closeout and selected Gate EZ
  rerank
- [POST_V1_GATE_EX_EY_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_PLAN_2026-06-09.md](./POST_V1_GATE_EX_EY_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_PLAN_2026-06-09.md)
  — landed Gate EX numeric rerank and selected Gate EY targeted evidence
  action
- [POST_V1_GATE_EV_EW_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_PLAN_2026-06-09.md](./POST_V1_GATE_EV_EW_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_PLAN_2026-06-09.md)
  — landed Gate EV current coverage/accuracy gap ledger and landed Gate
  EW heavy-core / lined-massive calibration owner proof
- [POST_V1_GATE_EU_EV_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md](./POST_V1_GATE_EU_EV_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md)
  — landed Gate EU rerank and selected Gate EV current coverage/accuracy
  gap ledger work order
- [POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md](./POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md)
  — landed Gate ES/ET plan for the reinforced-concrete visible-derived missing-input boundary
- [POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md](./POST_V1_GATE_EQ_ER_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_PLAN_2026-06-08.md)
  — landed Gate ER runtime plan for direct-fixed double-leaf
  field/building adapters
- [POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md](./POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md)
  — landed Gate EQ owner-proof plan
- [POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md](./POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md)
  — high-ROI candidate framework; useful planning input, not an older
  selected-next override
- [POST_V1_GATE_CD_OPEN_BOX_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-01.md](./POST_V1_GATE_CD_OPEN_BOX_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-01.md)
  — landed historical Gate CD target-output independence scope/correctness slice
- [ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md](./ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md)
  — historical product correction that is now landed for usable V1
- [SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md](./SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md)
  — historical model-first physics prediction pivot; still useful as
  foundation, but no longer the active next-action document
- [CURRENT_STATE.md](./CURRENT_STATE.md) — snapshot (what just closed, what is selected)
- [MASTER_PLAN.md](./MASTER_PLAN.md) — historical strategic roadmap; not a selector
- [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) — tactical slice detail
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
  — answer-origin and validation contract
- [CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md](./CHECKPOINT_2026-06-10_COMPATIBLE_ANCHOR_DELTA_BUILDING_DN_A_OWNER.md)
  — latest checkpoint: compatible anchor-delta building `Dn,A` owner
  landed and selected coverage refresh

And:

- [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
  for productization backlog only; it is not the active calculator
  behavior plan.

## Product Contract

Latest no-runtime formula scope/accuracy ledger: Gate FF landed
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`
with status
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_landed_no_runtime_selected_post_double_leaf_framed_wall_banded_coverage_revalidation`.
Gate FF selected
`wall.double_leaf_framed_post_runtime_coverage_revalidation_after_direct_fixed_gate_er`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate FF
subtracts already-live single-leaf mass-law, non-direct-fixed
double-leaf/framed, direct-fixed double-leaf field/building, historical
candidate-matrix/company-internal rehearsal, Gate FD floor holdout, Gate
FB opening/leak common-wall residual, Gate EY heavy-core / lined-massive,
and broad-source-crawl lanes. Gate FF is not a broad source crawl and
moves no runtime values. Gate FF selects:
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
in
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextPostDoubleLeafRevalidationRows 1`,
`estimatedNextRuntimeCandidateFamiliesToRerank 4`,
`closedRuntimeRowsRechecked 5`, `blockedOwnerOrHoldoutRows 3`,
`openHistoricalSelectedNextFilesStillMissing 1`,
`immediateRuntimeCandidatesSelected 0`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate FE/FF plan:
`docs/calculator/POST_V1_GATE_FE_FF_CURRENT_FORMULA_SCOPE_ACCURACY_LEDGER_PLAN_2026-06-09.md`.

Latest post double-leaf/framed revalidation landed no-runtime as
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`
in
`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`
with status
`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_landed_no_runtime_selected_wall_compatible_anchor_delta_scope_expansion`.
It rechecked the live non-direct-fixed double-leaf/framed lab route, safe
flat double-leaf auto-topology lab/field/building routes, and direct-fixed
Gate EO / Gate ER lab/field/building routes; those are closed runtime
routes, not the next slice. Missing support topology, missing
`studSpacingMm`, missing `resilientBarSideCount`, floor-impact outputs,
and ASTM/IIC outputs remain guarded as `needs_input` / unsupported
boundaries. The revalidation selected
`post_v1_wall_compatible_anchor_delta_scope_expansion_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-scope-expansion-contract.test.ts`
with label `post-V1 wall compatible measured-anchor delta scope expansion`.
Counters: `roiAnalysisIterations: 3`,
`closedRuntimeRouteRowsRevalidated 3`, `runtimeScopeCandidates 1`,
`needsInputSurfaceCandidates 1`, `accuracyCandidatesBlocked 1`,
`blockedNonGoalRows 1`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta runtime scope expansion landed as
`post_v1_wall_compatible_anchor_delta_scope_expansion_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-scope-expansion-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_scope_expansion_landed_runtime_selected_field_building_adapter_owner`.
It keeps the existing one-side exterior board anchor delta at `Rw 57`
and opens the paired exterior board shape at `Rw 59` from the exact
`knauf_lab_416889_primary_2026` `Rw 55` source row. `STC`, `C`, and
`Ctr` remain guarded until separate owners exist.
The scope expansion selected
`post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-field-building-adapter-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta field/building adapter owner`.
Counters: `newCalculableLayerTemplates 1`,
`newCalculableRequestShapes 1`, `runtimeBasisPromotions 1`,
`runtimeValuesMoved 1`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta field/building adapter owner landed as
`post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-field-building-adapter-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance`.
The paired exterior-board Knauf LSF compatible anchor-delta direct curve
(`Rw 59`) now feeds Gate I for complete `field_between_rooms` and Gate
AR for complete `building_prediction`, publishing `R'w 50 / Dn,w 51 /
DnT,w 53` in the pinned contexts. Missing `receivingRoomRt60S` or
`buildingPredictionOutputBasis` remains `needs_input`; `STC`, `C`,
`Ctr`, `Dn,A`, `DnT,A`, and ASTM outputs stay outside this owner. The
adapter owner selected
`post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts`
with label `post-V1 wall compatible anchor-delta field/building surface parity input acceptance`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 2`, `runtimeBasisPromotions 2`,
`runtimeValuesMoved 6`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta field/building surface parity landed as
`post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_landed_no_runtime_selected_lab_metric_companion_owner`.
Workbench live calculation, calculator API payloads, saved replay,
server snapshot replay, cards, and report summaries now keep the paired
exterior-board Knauf LSF compatible anchor-delta values aligned:
`R'w 50 / Dn,w 51 / DnT,w 53` for both field and building contexts.
The existing web input surface carries the required stud/connection,
room, RT60, flanking/junction, and building-output-basis inputs, so no
frontend implementation file changed. Missing RT60 stays `needs_input`;
`STC`, `Dn,A`, and `DnT,A` remain unsupported. The surface parity selected
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta lab metric companion owner`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

Latest compatible anchor-delta lab metric companion owner landed as
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_landed_runtime_selected_surface_parity`.
The paired exterior-board Knauf LSF compatible anchor-delta lab route now
publishes `Rw 59 / STC 59 / C -1.1 / Ctr -6` for complete
`element_lab` mixed `Rw+STC/C/Ctr` requests. `STC`, `C`, and `Ctr` are
calculated from the shifted direct curve and rating adapters; the Knauf
source row remains measured `Rw` evidence only. Single `Rw`, `STC`-only,
field/building, A-weighted, and ASTM impact requests remain on their
existing owners or boundaries. The owner selected
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-lab-metric-companion-surface-parity.test.ts`
with label `post-V1 wall compatible anchor-delta lab metric companion surface parity`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 1`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions 1`, `runtimeValuesMoved: 0`,
`runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta lab metric companion surface parity landed
as
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-lab-metric-companion-surface-parity.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
Workbench live calculation, calculator API, saved replay, server snapshot
replay, cards, and report summaries now preserve the paired exterior-board
Knauf LSF lab companion values `Rw 59 / STC 59 / C -1.1 / Ctr -6`.
`STC`-only and one-side exterior-board requests stay off the lab companion
candidate. The surface parity selected
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-coverage-refresh-contract.test.ts`
with label `post-V1 wall compatible anchor-delta lab metric companion coverage refresh`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

Latest compatible anchor-delta lab metric companion coverage refresh
landed as
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_one_side_lab_metric_companion_owner`.
The refresh pins
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
as `ready_with_budget` in the candidate coverage matrix and
`allowed_with_budget` in company-internal V0. It re-probes the paired
exterior-board Knauf LSF values
`Rw 59 / STC 59 / C -1.1 / Ctr -6` and keeps single `Rw`, `STC`-only,
field/building, and one-side exterior-board mixed requests off the
paired-board lab companion owner. This is not a broad source crawl.
The refresh selected
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta one-side lab metric companion owner`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta one-side lab metric companion owner landed
as
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_landed_runtime_selected_surface_parity`.
It reuses candidate
`wall.compatible_anchor_delta.calculated_lab_companions` and runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
for the one-side exterior-board Knauf LSF route. One-side `element_lab`
mixed `Rw+STC/C/Ctr` requests now publish
`Rw 57 / STC 57 / C -0.6 / Ctr -5.5`. Single `Rw`, STC-only,
field/building, A-weighted, ASTM, and non-Knauf rows remain on their
existing owners or boundaries. This is not a broad source crawl.
The owner selected
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-surface-parity.test.ts`
with label `post-V1 wall compatible anchor-delta one-side lab metric companion surface parity`.
Counters: `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 1`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta one-side lab metric companion surface
parity landed as
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-surface-parity.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
Workbench live calculation, calculator API, saved replay, server snapshot
replay, cards, and report summaries now preserve the one-side
exterior-board Knauf LSF lab companion values
`Rw 57 / STC 57 / C -0.6 / Ctr -5.5`. The surface shows candidate
`wall.compatible_anchor_delta.calculated_lab_companions` and runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
Direct single `Rw` remains on
`wall.compatible_anchor_delta.extra_board_on_verified_lsf`, STC-only
remains unsupported, and field/building, A-weighted, ASTM, and non-Knauf
rows remain outside this owner. This is not a broad source crawl.
The surface parity selected
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts`
with label `post-V1 wall compatible anchor-delta one-side lab metric companion coverage refresh`.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest compatible anchor-delta one-side lab metric companion coverage
refresh landed as
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_one_side_lab_companion`.
The refresh pins candidate
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`
as a one-side-aware `ready_with_budget` coverage-matrix row and
`allowed_with_budget` company-internal V0 row. It re-probes the one-side
exterior-board Knauf LSF values
`Rw 57 / STC 57 / C -0.6 / Ctr -5.5` and keeps direct single `Rw`,
STC-only, field/building, A-weighted, ASTM, and non-Knauf rows outside
the lab companion owner. This is not a broad source crawl.
The refresh selected
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts`
with label `post-V1 next numeric coverage gap after one-side lab companion`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest numeric coverage gap after one-side lab companion landed as
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_landed_no_runtime_selected_compatible_anchor_delta_a_weighted_owner`.
Plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_ONE_SIDE_LAB_COMPANION_PLAN_2026-06-10.md`.
The selected candidate is
`wall.compatible_anchor_delta.a_weighted_field_building_adapter_owner`.
The rerank compares formula-scope, route-input, and accuracy/holdout
candidates against the closed compatible anchor-delta direct, field,
building, paired lab companion, and one-side lab companion lanes. It
selects the A-weighted owner because the engine already computes
compatible anchor-delta `Dn,A` / `DnT,A` values but keeps them
unsupported until a metric owner lands. Expected follow-up movement is
paired and one-side field `Dn,A` / `DnT,A` plus paired and one-side
building `DnT,A`; building `Dn,A`, STC-only, field/building lab aliases,
ASTM/IIC/AIIC, and non-Knauf rows remain outside the owner. This is not
a broad source crawl.
The rerank selected
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta A-weighted field/building adapter owner`.
Counters: `candidateCount: 6`, `roiAnalysisIterations: 3`,
`estimatedNextRuntimeValuesMoved: 6`, `immediateRuntimeValuesMoved: 0`,
`runtimeBasisPromotions: 0`, `runtimeFormulaRetunes 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta A-weighted field/building adapter owner
landed as
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_landed_runtime_selected_surface_parity_input_acceptance`.
The owner uses the same compatible anchor-delta direct curve plus Gate I
/ Gate AR route, but only for the Knauf `416889` reduced-stack anchor.
It publishes paired field `Dn,A 49.5 / DnT,A 51.9`, one-side field
`Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
building `DnT,A 50.4`. At this owner checkpoint, building `Dn,A` stayed
parked until the later building `Dn,A` owner below landed. Lab aliases,
ASTM/IIC/AIIC, and non-`416889` compatible anchors remain unsupported.
The owner selected
`post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts`
with label `post-V1 wall compatible anchor-delta A-weighted field/building surface parity input acceptance`.
Counters: `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 4`,
`runtimeBasisPromotions 2`, `runtimeValuesMoved 6`,
`runtimeFormulaRetunes 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Latest compatible anchor-delta A-weighted field/building surface parity
landed as
`post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_a_weighted_surface_parity_input_acceptance_landed_no_runtime_selected_coverage_refresh`.
The surface locks the workbench live path, output cards, target-output
status, report summaries, calculator API, saved replay, and server
snapshot replay for paired and one-side A-only compatible anchor-delta
requests. At this surface checkpoint, field published `Dn,A` and
`DnT,A`; building published `DnT,A` while `Dn,A` was still parked. The
later building `Dn,A` owner below now promotes building `Dn,A`. Gate AR
building outputs use the `Airborne building prediction` posture label on
the workbench.
The surface selected
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts`
with label `post-V1 wall compatible anchor-delta A-weighted field/building coverage refresh`.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 1`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest compatible anchor-delta A-weighted field/building coverage refresh
landed as
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_a_weighted_field_building`.
The refresh pins the Knauf `416889` A-weighted field/building owner in
resolver registry, runtime adapter, runtime surface, coverage matrix,
and company-internal V0. `wall.airborne_field_context.field_apparent_adapter`
stays `ready_with_budget` / `allowed_with_budget` on
`gate_i_airborne_field_apparent_context_adapter_runtime`; the Gate AR
building candidate
`candidate_airborne_building_prediction_all_owner_family_physics_prediction`
stays `ready_with_budget` / `allowed_with_budget` on
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`.
It re-probes paired field `Dn,A 49.5 / DnT,A 51.9`, one-side field
`Dn,A 48 / DnT,A 50.4`, paired building `DnT,A 51.9`, and one-side
building `DnT,A 50.4`; at that refresh checkpoint building `Dn,A` was
still outside the owner. The later building `Dn,A` owner below now
promotes it, while lab aliases, ASTM/IIC/AIIC, missing-input, and
non-`416889` rows remain outside the route. This is not a broad source
crawl and moves no runtime values.
The refresh selected
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`
with label `post-V1 next numeric coverage gap after A-weighted field/building`.
Counters: `coverageRefreshContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes 0`, and `sourceRowsImported: 0`.

Latest numeric coverage gap after A-weighted field/building landed as
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts`
with status
`post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner`.
Plan doc:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-10.md`.
Selected candidate:
`wall.compatible_anchor_delta.building_dn_a_owner`.
The rerank subtracts the closed compatible anchor-delta direct `Rw`,
field/building base metrics, paired and one-side lab companions, field
`Dn,A`/`DnT,A`, and building `DnT,A`. It selects the building Dn,A owner
because the Gate AR compatible anchor-delta route already carries paired
building `Dn,A 49.5` and one-side building `Dn,A 48` as computed values,
but they remain unsupported behind an explicit separate-owner warning.
Non-Knauf formula widening, route-input work, and A-weighted budget
tightening stay lower-ranked until they have owned evidence or inputs.
This is not a broad source crawl and moves no runtime values in the
selection step.
The rerank selected
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`
with label `post-V1 wall compatible anchor-delta building Dn,A owner`.
Counters: `candidateCount: 6`, `roiAnalysisIterations: 3`,
`closedAWeightedRowsRechecked: 4`,
`buildingDnAUnsupportedRowsRechecked: 2`,
`estimatedNextCalculableRequestShapes: 2`,
`estimatedNextRuntimeValuesMoved: 2`, `immediateRuntimeValuesMoved: 0`,
`frontendImplementationFilesTouched: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes 0`, and
`sourceRowsImported: 0`.

Latest compatible anchor-delta building Dn,A owner landed as
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_building_dn_a_owner_landed_runtime_selected_coverage_refresh`.
It promotes the already-computed Gate AR compatible anchor-delta building
`Dn,A` values: paired exterior-board building `Dn,A 49.5` and one-side
exterior-board building `Dn,A 48`. The route keeps the shifted Knauf
`416889` direct curve, Gate AR building-prediction basis, and ISO 717 C
adapter term; no source rows were imported and no formula was retuned.
Lab aliases, missing `buildingPredictionOutputBasis`, non-selected
anchors, and ASTM/IIC/AIIC remain boundary rows. It selected
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`
with label `post-V1 wall compatible anchor-delta building Dn,A coverage refresh`.
Counters: `newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 1`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 2`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, `frontendImplementationFilesTouched: 0`, and
`webSurfaceParityContractFilesTouched: 1`.

Latest compatible anchor-delta building Dn,A coverage refresh landed as
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_landed_no_runtime_selected_stc_only_lab_companion_owner`.
It freezes paired exterior-board building `Dn,A 49.5` and one-side
exterior-board building `Dn,A 48`, moves no runtime values, imports no
source rows, and retunes no formula. STC-only remains pinned as a
boundary here and is selected as the next value-moving owner. Counters:
`coverageRefreshContractFilesTouched: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Selected next action:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall compatible anchor-delta STC-only lab companion owner`.

Latest compatible anchor-delta STC-only lab companion owner landed as
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_landed_runtime_selected_surface_parity`.
It promotes the bounded calculated lab companion route for paired
exterior-board `STC 59` and one-side exterior-board `STC 57` Knauf
`416889` compatible anchor-delta element-lab requests. The owner uses
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`;
it does not import source rows, claim measured STC evidence, or retune
formulas. Direct `Rw`, mixed `Rw+STC/C/Ctr`, field/building,
A-weighted, C/Ctr-only, ASTM/IIC/AIIC, missing-input, and non-Knauf
boundaries remain pinned. This is value-moving. Counters:
`newCalculableRequestShapes: 2`, `newCalculableTargetOutputs: 1`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Selected next action:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan`.
Selected next file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall compatible anchor-delta STC-only lab companion surface parity`.

Latest landed compatible anchor-delta STC-only lab companion surface
parity:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan`.
Surface parity file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
Workbench live calculation, calculator API payloads, saved replay, server
snapshot replay, output cards, target-output status, and report summaries
now keep paired exterior-board `STC 59` and one-side exterior-board
`STC 57` aligned through
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
Direct `Rw`, mixed `Rw+STC/C/Ctr`, C/Ctr-only, field/building,
A-weighted, ASTM/IIC/AIIC, missing-input, and non-Knauf rows remain
pinned. This is not a broad source crawl. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next action:
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall compatible anchor-delta STC-only lab companion coverage refresh`.

Latest compatible anchor-delta STC-only lab companion coverage refresh
landed as
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_landed_no_runtime_selected_c_ctr_only_lab_companion_owner`.
It freezes paired exterior-board `STC 59` and one-side exterior-board
`STC 57` for Knauf `416889` compatible anchor-delta STC-only element-lab
requests through
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
The resolver registry, runtime adapter, runtime surface, coverage
matrix, and company-internal V0 expose the candidate as
`ready_with_budget` / `allowed_with_budget`; this is not a broad source
crawl. Direct `Rw`, mixed `Rw+STC/C/Ctr`, C/Ctr-only, field/building,
A-weighted, ASTM/IIC/AIIC, missing-input, and non-Knauf boundaries
remain pinned. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableRequestShapes: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`estimatedNextCalculableRequestShapes: 4`, and
`estimatedNextRuntimeBasisPromotions: 1`.
Selected next action:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion owner`.
The selected next was value-moving because standalone C-only and
Ctr-only requests were unsupported at the closeout checkpoint while the
mixed lab companion already calculated those values from the owned
shifted curve. The owner below now lands that support.

Latest compatible anchor-delta C/Ctr-only lab companion owner landed as
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_plan`
in
`packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_landed_runtime_selected_surface_parity`.
It opens standalone element-lab C-only and Ctr-only requests through
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`:
paired `C -1.1`, paired `Ctr -6`, one-side `C -0.6`, and one-side
`Ctr -5.5`. These are calculated companion values, not measured source
evidence. Direct `Rw`, STC-only, mixed `Rw+STC/C/Ctr`, C+Ctr without
`Rw`/`STC`, field/building, A-weighted, ASTM/IIC/AIIC, missing-input,
and non-Knauf boundaries remain pinned. This is not a broad source crawl.
Counters: `newCalculableRequestShapes: 4`,
`newCalculableTargetOutputs: 2`, `runtimeBasisPromotions: 1`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Selected next action:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_plan`.
Selected next file:
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion surface parity`.

Latest compatible anchor-delta C/Ctr-only lab companion surface parity
landed as
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_plan`
in
`apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts`
with status
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_landed_no_runtime_selected_coverage_refresh`.
Workbench live calculation, calculator API payloads, saved replay, server
snapshot replay, output cards, target-output status, and report summaries
now keep paired `C -1.1`, paired `Ctr -6`, one-side `C -0.6`, and
one-side `Ctr -5.5` aligned through
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
Direct `Rw`, STC-only, mixed `Rw+STC/C/Ctr`, C+Ctr without `Rw`/`STC`,
field/building, A-weighted, ASTM/IIC/AIIC, missing-input, and non-Knauf
boundaries remain pinned. This is not a broad source crawl.
Counters: `webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next action:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-coverage-refresh-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall compatible anchor-delta C/Ctr-only lab companion coverage refresh`.

Latest landed compatible anchor-delta C/Ctr-only lab companion coverage
refresh:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_plan`.
Coverage refresh file:
`packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-coverage-refresh-contract.test.ts`.
Status:
`post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_coverage_refresh_landed_no_runtime_selected_wall_double_leaf_framed_route_input_runtime_widening`.
It freezes paired `C -1.1`, paired `Ctr -6`, one-side `C -0.6`, and
one-side `Ctr -5.5` through
`wall.compatible_anchor_delta.calculated_lab_companions` with runtime
basis
`post_v1_wall_compatible_anchor_delta_calculated_lab_companion_runtime`.
The route remains `ready_with_budget` in coverage and
`allowed_with_budget` in company-internal V0. This is not a broad source
crawl. Counters: `coverageRefreshContractFilesTouched: 1`,
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next action:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed route-input runtime widening`.
High-ROI declaration: route family `wall.double_leaf_framed`; target
outputs `Rw`, `STC`, `C`, and `Ctr`; required physical inputs include
side leaf groups, side leaf masses, cavity depth, absorber class/fill
and flow resistivity, support topology, stud/support spacing, resilient
side count when needed, and bridge class. The expected scope movement is
more board/panel/cavity/porous-fill double-leaf/framed walls calculating
through the owned formula route while exact-source precedence, the
thick-board Auto boundary, field/building aliases, ASTM/IIC/AIIC,
direct-fixed, grouped triple-leaf/multicavity, and floor-impact
boundaries stay pinned.

Latest landed wall double-leaf/framed route-input runtime widening:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_plan`.
Runtime owner file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts`.
Status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_landed_runtime_selected_surface_parity`.
It opens context-only empty-cavity double-leaf/framed walls: two visible
board leaves plus explicit `cavity1DepthMm`, `cavity1FillCoverage empty`,
`cavity1AbsorptionClass none`, side leaf groups, support topology, and
support spacing calculate `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1`
through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`.
Context-only absorptive cavities without a visible porous-fill layer stay
`needs_input` for `cavity1FillCoverage` and `absorberClass`; direct-fixed,
exact/anchor, thick-board Auto, field/building alias, ASTM/IIC/AIIC,
grouped triple-leaf, and floor-impact boundaries stay pinned. Counters:
`newCalculableLayerTemplates: 1`, `newCalculableRequestShapes: 1`,
`newCalculableTargetOutputs: 4`, `runtimeBasisPromotions: 1`,
`frontendImplementationFilesTouched: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next action:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`.
Selected next file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-route-input-runtime-widening-surface-parity.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_SURFACE_PARITY_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed route-input runtime widening surface parity`.

Latest landed wall double-leaf/framed route-input runtime widening surface
parity:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_plan`.
Surface parity file:
`apps/web/features/workbench/post-v1-wall-double-leaf-framed-route-input-runtime-widening-surface-parity.test.ts`.
Status:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_surface_parity_landed_no_runtime_selected_coverage_refresh`.
The surface parity preserves live workbench calculation, calculator API,
saved replay, server snapshot replay, output cards, target-output status,
and report summaries for `Rw 42`, `STC 42`, `C -1`, and `Ctr -6.1` on
runtime basis
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`.
Missing cavity classification stays `needs_input` for
`cavity1FillCoverage` and `absorberClass`; field/building aliases plus
ASTM/IIC/AIIC remain outside this owner. Counters:
`webSurfaceParityContractFilesTouched: 1`,
`frontendImplementationFilesTouched: 0`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, and `sourceRowsImported: 0`.
Selected next action:
`post_v1_wall_double_leaf_framed_route_input_runtime_widening_coverage_refresh_plan`.
Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-coverage-refresh-contract.test.ts`.
Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_ROUTE_INPUT_RUNTIME_WIDENING_COVERAGE_REFRESH_PLAN_2026-06-11.md`.
Selected next label:
`post-V1 wall double-leaf/framed route-input runtime widening coverage refresh`.

Previous no-runtime numeric coverage/accuracy rerank: Gate FE landed
`post_v1_next_numeric_coverage_gap_gate_fe_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_fe_landed_no_runtime_selected_current_formula_scope_accuracy_gap_ledger_gate_ff`.
Gate FE selected
`calculator.current_formula_scope_accuracy_gap_ledger_after_gate_fd_closeout`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate FE
subtracts Gate FD floor holdout rejection, Gate FB opening/leak and
common-wall owner rejection, Gate EY heavy-core / lined-massive owner
rejection, stale cartography `runtime_widening` labels for heavy-core,
timber stud, CLT, and steel fallback, and the blocked Rockwool source
packet lane. Gate FE is not a broad source crawl and moves no runtime
values. Gate FE selects Gate FF:
`post_v1_current_formula_scope_accuracy_gap_ledger_gate_ff_plan`
in
`packages/engine/src/post-v1-current-formula-scope-accuracy-gap-ledger-gate-ff-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextFormulaScopeLedgerRows 1`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`staleCartographyRuntimeWideningRows 4`,
`blockedOwnerOrHoldoutRows 3`,
`sourcePacketRowsRejectedAsCurrentRuntime 1`,
`immediateRuntimeCandidatesSelected 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Previous no-runtime floor raw-bare/floating holdout closeout: Gate FD landed
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`
with status
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fe`.
Gate FD owner rejected:
`floor.raw_bare_and_floating.same_basis_holdout_owner_rejected_missing_admissible_holdouts`.
Gate FD evaluated only the three Gate CL floor residual ledgers selected
by Gate FC. Open-box/open-web raw-bare formula outputs remain
source-absent, packaged/finished/supported-band rows are not raw-bare
same-basis holdouts, and the Gate CH published `Ln,w` anchor plus field
adapter outputs are not measured direct+flanking field holdouts. Runtime
values and budgets remain frozen. Gate FD selects Gate FE:
`post_v1_next_numeric_coverage_gap_gate_fe_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fe-contract.test.ts`.
Counters: `ownerLedgersRejected 3`, `admissibleHoldoutLedgers 0`,
`evaluatedGateCLResidualLedgers 3`,
`rejectedCandidateEvidenceLedgers 6`, `boundaryLedgersPinned 7`,
`runtimeBudgetTighteningAdmitted 0`, `broadSourceCrawlSelected false`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Gate FD/FE plan:
`docs/calculator/POST_V1_GATE_FD_FE_FLOOR_RAW_BARE_FLOATING_HOLDOUT_CLOSEOUT_PLAN_2026-06-09.md`.

Previous no-runtime numeric coverage/accuracy rerank: Gate FC landed
`post_v1_next_numeric_coverage_gap_gate_fc_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_fc_landed_no_runtime_selected_floor_raw_bare_and_floating_same_basis_holdout_gate_fd`.
Gate FC selected
`floor.raw_bare_and_floating_same_basis_holdout_prerequisite_after_gate_fb`
after two ROI plan iterations (`roiAnalysisIterations: 2`). Gate FC
subtracts Gate FB-rejected opening/leak/common-wall budget tightening,
Gate EY/EW-rejected heavy-core retune, and already-closed direct-fixed,
reinforced-concrete visible-derived, thick-board safety, ASTM
exact-band, and steel visible input-surface repeats. No safe immediate
value-moving runtime candidate remains from current evidence; Gate FC
therefore selects Gate FD, a bounded targeted same-basis holdout
prerequisite for floor raw-bare/floating residual accuracy. It is not a
broad source crawl. Gate FC selects
`post_v1_floor_raw_bare_and_floating_same_basis_holdout_gate_fd_plan`
in
`packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`blockedByGateFBOwnerRejectionRows 2`,
`blockedHeavyCoreOwnerRejectedRows 1`, `closedRepeatRows 5`,
`estimatedNextTargetedHoldoutLedgers 3`,
`floorResidualLedgersSelected 3`, `immediateRuntimeCandidatesSelected
0`, `broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate FC/FD plan:
`docs/calculator/POST_V1_GATE_FC_FD_FLOOR_RAW_BARE_FLOATING_HOLDOUT_PLAN_2026-06-09.md`.

Previous no-runtime opening/leak common wall owner closeout: Gate FB landed
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`
with status
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_fc`.
Gate FB owner rejected:
`wall.opening_leak_common_wall.same_basis_residual_owner_rejected_missing_holdouts`.
Gate FB rejected runtime budget tightening for
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`
because source-owned same-basis holdouts are absent for opening/leak
field, opening/leak building, opening/leak A-weighted, and common wall
building residuals. Field/building/A-weighted values and budgets remain
frozen: field `8`, building `10`, A-weighted field `9`, and A-weighted
building `11`. Gate FB selected Gate FC:
`post_v1_next_numeric_coverage_gap_gate_fc_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-fc-contract.test.ts`.
Counters: `ownerLedgersRejected 5`, `sameBasisHoldoutLedgersMissing 5`,
`boundaryLedgersPinned 7`, `runtimeBudgetTighteningAdmitted 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.
Gate FB/FC plan:
`docs/calculator/POST_V1_GATE_FB_FC_OPENING_LEAK_COMMON_WALL_OWNER_CLOSEOUT_AND_NEXT_NUMERIC_GAP_PLAN_2026-06-09.md`.

Previous no-runtime current coverage/accuracy gap ledger: Gate FA landed
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`
with status
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_landed_no_runtime_selected_opening_leak_common_wall_same_basis_residual_owner_gate_fb`.
Gate FA selected
`wall.opening_leak_common_wall_same_basis_residual_owner_gap_after_gate_ey_owner_rejection_closeout`.
Gate FA re-read current implementation after Gate EY/EZ: opening/leak
field/building and A-weighted runtime rows are live, but they remain
source-absent with wide budgets; Gate CL also left the common wall
building residual and opening/leak residuals without same-basis
holdouts. Gate FA selected Gate FB, a no-runtime same-basis residual
owner proof:
`post_v1_opening_leak_common_wall_same_basis_residual_owner_gate_fb_plan`
in
`packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts`.
Counters: `ledgerRows 11`, `candidateCount 11`, `ownerGapRows 1`,
`runtimeCandidateRowsHeldBehindOwner 2`, `closedRepeatRows 5`,
`blockedHeavyCoreOwnerRejectedRows 1`, `blockedNonGoalRows 1`,
`estimatedNextOwnerLedgers 1`,
`estimatedNextRuntimeCandidateFamiliesAfterOwner 2`,
`estimatedNextBoundaryLedgers 3`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate FA/FB plan:
`docs/calculator/POST_V1_GATE_FA_FB_OPENING_LEAK_COMMON_WALL_RESIDUAL_OWNER_PLAN_2026-06-09.md`.

Previous no-runtime numeric coverage/accuracy rerank: Gate EZ landed
`post_v1_next_numeric_coverage_gap_gate_ez_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ez_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_fa`.
Gate EZ selected
`calculator.current_coverage_accuracy_gap_ledger_after_gate_ey_owner_rejection_closeout`.
Gate EY left the heavy-core / lined-massive owner rejected: MWI.2A and
B226010 remain targeted evidence context only, not runtime owners. Gate
EZ selected Gate FA, a fresh current coverage/accuracy gap ledger:
`post_v1_current_coverage_accuracy_gap_ledger_gate_fa_plan`
in
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-fa-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations: 2`,
`estimatedNextGapLedgers 1`, `estimatedNextBoundaryLedgers 2`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`heavyCoreLinedMassiveRuntimeStillBlocked true`,
`broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
Gate EZ/FA plan:
`docs/calculator/POST_V1_GATE_EZ_FA_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_PLAN_2026-06-09.md`.

Previous no-runtime targeted evidence action: Gate EY landed
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan`
with status
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_landed_no_runtime_owner_remains_rejected_selected_next_numeric_coverage_gap_gate_ez`.
Gate EY decision:
`wall.heavy_core_lined_massive.targeted_evidence_acquired_owner_still_rejected_no_runtime_admissible_row_or_rule`.
Gate EY accepted MWI.2A and B226010 only as targeted wall-specific
evidence contexts. The owner remains rejected because neither context is
runtime-admissible for the live generic heavy-core / lined-massive route
and no bounded wall lining rule was accepted. This is not a broad source
crawl. Current Gate DG `bounded_prediction` values remain frozen. Gate
EY selected Gate EZ:
`post_v1_next_numeric_coverage_gap_gate_ez_plan`
in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts`.
Counters: `targetedEvidenceLedgers 6`,
`acceptedTargetedEvidenceLedgers 2`,
`runtimeAdmissibleEvidenceLedgers 0`,
`acceptedBoundedWallLiningRules 0`,
`calibrationOwnerRemainsRejected true`,
`broadSourceCrawlSelected false`, `newCalculableLayerTemplates 0`,
`newCalculableRequestShapes 0`, `runtimeBasisPromotions 0`,
`runtimeFormulaRetunes 0`, `runtimeValuesMoved 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Previous no-runtime numeric coverage/accuracy rerank: Gate EX landed
`post_v1_next_numeric_coverage_gap_gate_ex_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_ex_landed_no_runtime_selected_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey`.
Gate EX selected
`wall.heavy_core_lined_massive_targeted_evidence_acquisition_after_owner_rejection`.
This is targeted evidence acquisition, not a broad source crawl: Gate EY
must look only for a wall-specific lined concrete or heavy-masonry source
row, or a bounded wall lining rule with coefficient scope, local
tolerance, holdouts, and negative boundaries. Current Gate DG
`bounded_prediction` values remain frozen. Gate EX selected Gate EY:
`post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan`
in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts`.
Counters: `candidateCount 10`, `roiAnalysisIterations 2`,
`targetedEvidenceAcquisitionSelected true`, `broadSourceCrawlSelected false`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Previous no-runtime calibration owner proof: Gate EW landed
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`
with status
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_ex`.
Gate EW owner rejected:
`wall.heavy_core_lined_massive.calibration_owner_rejected_missing_wall_specific_source_or_bounded_rule`.
The current evidence still lacks a wall-specific lined concrete or
heavy-masonry source row and lacks a named bounded wall lining rule with
coefficient scope, local tolerance, holdouts, and protected negative
boundaries. Gate EW keeps bounded_prediction values frozen and selected
Gate EX:
`post_v1_next_numeric_coverage_gap_gate_ex_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts`.
Counters: `acceptedOwnerLedgers 0`,
`calibrationOwnerRejectedLedgers 1`, `evidenceBoundaryLedgersPinned 8`,
`metricBasisBoundariesPinned 4`, `wallSpecificPositiveRowsAccepted 0`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Previous no-runtime current coverage/accuracy gap ledger: Gate EV landed
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan`
with status
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_landed_no_runtime_selected_wall_heavy_core_lined_massive_calibration_owner_gate_ew`.
It selected
`wall.heavy_core_lined_massive_calibration_owner_gap_after_bounded_basis`
and selected the heavy-core / lined-massive calibration owner Gate EW:
`post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan`
in
`packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts`.
Counters: `ledgerRows 10`, `currentEvidenceSurfaces 10`,
`ownerGapRows 1`, `runtimeCandidateRowsHeldBehindOwner 1`,
`estimatedNextOwnerLedgers 1`,
`estimatedNextRuntimeCandidateFamiliesAfterOwner 1`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Previous no-runtime rerank: Gate EU landed
`post_v1_next_numeric_coverage_gap_gate_eu_plan`
with status
`post_v1_next_numeric_coverage_gap_gate_eu_landed_no_runtime_selected_current_coverage_accuracy_gap_ledger_gate_ev`.
It selected
`calculator.current_coverage_accuracy_gap_ledger_after_gate_et_and_thick_board`
after two ROI iterations (`roiAnalysisIterations: 2`) and selected the
current coverage/accuracy gap ledger. Counters:
`candidateCount 10`, `estimatedNextGapLedgers 1`,
`estimatedNextBoundaryLedgers 2`,
`estimatedNextRuntimeCandidateFamiliesToEvaluate 6`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. Gate EU selects Gate EV:
`post_v1_current_coverage_accuracy_gap_ledger_gate_ev_plan` in
`packages/engine/src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts`.

Latest boundary closeout: Gate ET landed
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan`
with status
`post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu`.
Boundary id:
`floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load`.
Visible-derived reinforced-concrete combined upper/lower floors park
`Ln,w` / `DeltaLw` as `needs_input` for exactly
`resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`; explicit
partial predictor input still asks for `loadBasisKgM2` and
`ceilingOrLowerAssembly`. This moved `runtimeValuesMoved 0`, cleared
`currentGateFailuresCleared 6`, imported `sourceRowsImported: 0`, and
touched `frontendImplementationFilesTouched: 1`. Gate ET selects
`post_v1_next_numeric_coverage_gap_gate_eu_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`.

Latest boundary-preservation checkpoint: commit `fb0ea67 Fix
double-leaf route input boundary` keeps flat `leaf / porous absorber /
leaf` wall stacks without complete double-leaf topology/support inputs
parked as `needs_input`; complete topology still calculates through the
owned double-leaf/framed route. This is not a value-moving slice and it
does not import source rows. Gate EV has since landed and selected Gate
EW, Gate EW selected Gate EX, and Gate EX has since landed and selected
Gate EY targeted evidence acquisition.

Route-family ambiguity to preserve: generic
`gypsum_board 12.5 / rockwool 50 / gypsum_board 100` is now guarded
from flipping to `lined_massive_wall` by surface mass alone. Treat this
as a classification/boundary rule, not a mandate to park all
lined-massive fallback routes. Existing concrete/AAC/brick/CLT
massive-core lanes are separate and must stay pinned unless a selected
calculator slice changes them with tests.

Previous no-runtime rerank: Gate ES landed
`post_v1_next_numeric_coverage_gap_gate_es_plan` with status
`post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et`.
It selected
`floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh`
after two ROI iterations (`roiAnalysisIterations: 2`) and selected Gate
ET in
`packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts`.
Gate ES estimated the selected boundary-surface touch as
`estimatedNextFrontendImplementationFilesTouched 1`.
Gate ES moved `runtimeValuesMoved 0`, imported `sourceRowsImported: 0`,
and touched `frontendImplementationFilesTouched: 0`.

Latest runtime closeout: Gate ER landed
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`
with status
`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es`.
Readable label: direct-fixed double-leaf field/building adapter runtime.
Complete direct-fixed double-leaf `field_between_rooms` requests now use
`gate_i_airborne_field_apparent_context_adapter_runtime`, and complete
`building_prediction` requests now use
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`; both
calculate `R'w 23 / Dn,w 24 / DnT,w 27` over the Gate EO direct
separating-element curve. This moved `runtimeValuesMoved 6` with
`sourceRowsImported: 0` and `frontendImplementationFilesTouched: 0`.
Gate ER selected Gate ES file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts`.

This repo is an acoustic calculator for floor and wall assemblies.
Its product direction is scope and accuracy: more physically valid
layer combinations should calculate owned acoustic outputs when required
inputs are present, and existing calculation routes should become more
correct, calibrated, or better bounded over time. Work that does not
advance calculator scope or accuracy is product drift unless explicitly
requested outside calculator behavior.

The user picks wall or floor, enters the layer stack, layer order,
thicknesses, and any extra physical inputs genuinely required by that
route, then receives acoustic outputs such as `Rw`, `R'w`, `DnT,w`,
`Ln,w`, `L'n,w`, or `L'nT,w`. The system must do three things correctly:

- calculate the right value when a route legitimately supports that
  output, using exact data when available and family-specific physics
  when exact data is absent
- surface `needs_input` only when required physical/context inputs are
  missing, and `unsupported` only when the route genuinely has no
  bounded calculation path
- keep the same answer/support posture stable under duplicate rows, row reorders,
  save/load replay, study-mode detours, and other hostile operator behavior

A green result is only valid if both the number and its support/origin posture
are correct.

## Answer-Engine Baseline

This project is not a lookup database, a catalog project, or a test
environment. Lab/source rows are allowed to win exact whole-stack
matches, anchor known compatible constructions, calibrate formula
families, benchmark tolerances, and provide regression tests. They must
not replace the calculator engine.

When no exact whole-stack row exists, the engine must still calculate
through the best physically appropriate route it owns:

- exact full-stack measured row when it truly matches;
- compatible measured anchor plus calculated delta when the algorithm
  owns the topology, metric, and basis;
- calibrated family formula;
- source-absent family formula with a visible error budget;
- `needs_input` only when a required physical field is missing;
- `unsupported` only when DynEcho has no bounded calculation path.

The answer-engine V1 correction is now landed for the current
company-internal usable V1 envelope. The selected answer surface is
implemented through resolver candidate declarations, runtime candidate
mapping, answer-boundary payloads, owner audit, value parking, trace
building, and UI/API/report parity tests. Wall and floor paths both
publish answers through selected candidates or explicit `needs_input` /
`unsupported` stops.

## End-To-End User Flow

1. Auth-gated workbench entry.
   - `/workbench` is server-gated by `requireAuthenticatedPage(...)`.
   - `view=advanced` selects the advanced operator desk; default is the simpler
     guided shell.
   - Files:
     - `apps/web/app/workbench/page.tsx`
     - `apps/web/app/workbench/workbench-client-page.tsx`
2. Client shell selection.
   - `SimpleWorkbenchShell` is the default day-to-day calculator surface.
   - `WorkbenchShell` is the denser operator/debug/reporting desk.
   - Files:
     - `apps/web/features/workbench/simple-workbench-shell.tsx`
     - `apps/web/features/workbench/workbench-shell.tsx`
3. Local scenario state and editing.
   - Zustand store owns study mode, layer rows, requested outputs, optional
     airborne/impact context, criteria/report settings, and saved scenarios.
   - Layer edits, duplicate/reorder, split parity, and scenario save/load all
     start here.
   - File:
     - `apps/web/features/workbench/workbench-store.ts`
4. Request building and engine execution.
   - Web routes validate payloads with shared schemas and call engine entry
     points.
   - Full route:
     - `apps/web/app/api/estimate/route.ts` -> `calculateAssembly(...)`
   - Impact-only route:
     - `apps/web/app/api/impact-only/route.ts` -> `calculateImpactOnly(...)`
5. Engine lane selection and support gating.
   - Engine builds airborne/impact candidates, selects route-specific results,
     then computes supported and unsupported requested outputs.
   - Core files:
     - `packages/engine/src/calculate-assembly.ts`
     - `packages/engine/src/calculate-impact-only.ts`
     - `packages/engine/src/target-output-support.ts`
6. Output-card projection.
   - UI cards do not simply print raw numbers. They combine the engine result,
     support buckets, field blockers, route posture, and requested-output state
     into `live`, `bound`, `needs_input`, or `unsupported` cards.
   - File:
     - `apps/web/features/workbench/simple-workbench-output-model.ts`
7. Save/load and proposal/report surfaces.
   - Local scenario editing is browser-local first.
   - Users can explicitly sync/load owner-scoped server project records.
   - Proposal/report exports can append server project audit events.
   - Project access roles/actions have a pure policy contract, but route
     access is still owner-scoped until the deferred route-integration slice
     wires the policy through an owner-only adapter.

## Runtime Boundaries

### Engine

The engine is the truth surface for numeric and support decisions.

- public package entry:
  `packages/engine/src/index.ts`
- core entry points:
  - `calculate-assembly.ts`
  - `calculate-impact-only.ts`
- support gate:
  - `target-output-support.ts`

The engine decides:

- which lane owns the answer
- whether a requested output is supported
- what provenance/basis metadata accompanies the answer

The UI must not widen unsupported outputs beyond what the engine exposes.

### Web API Glue

The Next API routes are intentionally thin.

They do four things only:

- auth check
- schema validation
- call engine entry point
- serialize JSON result/error

If behavior changes here, it should usually be validation/auth/transport, not
acoustic logic.

### Workbench UI

The UI owns operator flow, edit ergonomics, posture wording, and projection of
engine support state into cards, guides, reports, and review surfaces.

The UI must stay parity-safe with the engine. A card can be wrong even when the
engine number is correct if the UI shows `live` for something that should be
`needs_input` or `unsupported`.

### Persistence

Current workbench editing persistence is local-first.

- store uses Zustand `persist(...)`
- storage backend is `createJSONStorage(() => localStorage)`
- saved scenarios are snapshots in the client store
- `server_backed_project_storage_v1` has closed an owner-scoped
  server project repository and `/api/projects` import/list/detail
  routes backed by filesystem JSON records
- the workbench can copy browser-local saved scenarios into a server
  project with `Sync to server`
- the default workbench can sync the current snapshot to a server
  project, list server projects, and load a marked server snapshot
  back into local Zustand
- `/workbench/proposal/configure` edits the packaged proposal/report
  snapshot only. This is the manual report-correction path for issued
  PDF and DOCX output; it must not mutate calculator inputs, solver
  routes, or engine result state.
- proposal PDF/DOCX routes append a project audit event when a
  `projectId` is present
- `team_access_model_v1` has closed a pure project-access policy helper
  with owner/editor/reviewer/viewer role-action decisions and stable
  denial reasons
- `project_access_policy_route_integration_v1` has closed; route
  decisions now flow through an owner-only policy adapter while team
  route access remains disabled until membership storage exists
- local Zustand remains the live editing source; server persistence is
  explicit sync/load, not shared multi-user editing

This is important because docs should not describe current save/load as shared
multi-user project persistence.

## Answer Model

There is no single universal acoustic formula in the repo, and there
must not be a lookup-only answer path either.

A visible answer can be owned by:

- exact imported/source-backed rows
- exact subassembly anchors plus calculated deltas
- calibrated family-specific formula lanes
- family physics prediction lanes
- conservative bound lanes
- screening fallback lanes
- needs-input state
- unsupported state

For the full origin rules, read
[CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md).
This document is the system map; that document is the answer-origin contract.

## Study Mode And Context Model

The main top-level operator switch is `studyMode`.

- `wall` mode biases the flow toward airborne partition behavior
- `floor` mode enables impact lanes and floor companion logic

Requested outputs, context fields, and card behavior depend on:

- study mode
- selected route/lane
- available geometry or field inputs
- support gating from the engine

Important consequence:

- the UI must not assume that selecting an output means it can be shown
- missing context should produce `needs_input`, not guessed values

## Test System

The test system has distinct jobs.

### Engine Truth Tests

These prove numeric values, support buckets, provenance, and fail-closed
boundaries.

Examples:

- `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
- `packages/engine/src/output-origin-trace-matrix.test.ts`
- source-truth audits and lane-specific route guards across `packages/engine/src`

### Web Parity Tests

These prove that output cards, status labels, replay/save-load posture, and
requested-output surfaces stay aligned with engine truth.

Examples:

- `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`
- `apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts`

### Planning Contracts

These are executable docs for next-slice selection. They pin what just closed,
what is explicitly deferred, and what should be implemented next.

Examples live in `packages/engine/src/post-*.test.ts`.

### Productization Policy Tests

These prove non-calculator product contracts such as auth, project
storage, route authorization, and access policy semantics.

Examples:

- `apps/web/lib/project-access-policy.test.ts`
- `apps/web/lib/server-project-routes.test.ts`
- `apps/web/lib/auth.test.ts`
- `apps/web/lib/auth-routes.test.ts`

### Focused Gate

`pnpm calculator:gate:current` is the current single-command checkpoint gate.

It should stay aligned with the living next slice and gives the shortest safe
validation path before and after a refactor.

## Current Architectural Hotspots

As of 2026-06-08, the current calculator hotspots are post-V1 product
gaps, not missing answer-engine architecture:

- `packages/engine/src/layer-combination-resolver-registry.ts` is the
  declared candidate surface. Keep it lightweight and free of heavy
  runtime imports.
- `packages/engine/src/layer-combination-resolver-runtime-candidate-adapter.ts`
  maps runtime basis ids and answer-boundary states onto selected
  candidates. New formula families should enter here instead of leaking
  untraced outputs.
- `packages/engine/src/acoustic-answer-engine-v1-owner-audit.ts` parks
  outputs that the selected candidate does not own. New mixed-output
  behavior must prove ownership instead of weakening this guard.
- `packages/engine/src/calculate-assembly.ts` and
  `packages/engine/src/calculate-impact-only.ts` can compute diagnostic
  lanes, but publication must still go through selected answer
  candidates, value parking, and resolver traces.
- `apps/web/features/workbench/layer-combination-resolver-candidate-surface.ts`
  is the visible projection path. Cards, reports, API payloads, and
  replay must not infer acoustic basis from display labels.
- Post-V1 work should broaden formula coverage, adapters, calibration,
  holdouts, and required-input ergonomics while preserving exact /
  anchor / formula / `needs_input` / `unsupported` answer order.

Current selected hotspot: Gate ER direct-fixed double-leaf
field/building adapter runtime. Gate EQ accepted
`wall.direct_fixed_double_leaf.field_between_rooms_adapter_owner` and
`wall.direct_fixed_double_leaf.building_prediction_adapter_owner`
without moving runtime values. Complete `field_between_rooms` requests
still use `screening_mass_law_curve_seed_v3` and complete
`building_prediction` requests still stop as
`dynamic_calculator_building_prediction_runtime_adapter_owner_missing`.
Gate ER is the value-moving step that should connect the Gate EO direct
curve to Gate I/AR adapter semantics for the bounded direct-fixed
subset while preserving `needs_input` / `unsupported` boundaries.

### Historical 2026-04-27 Snapshot

The following anchors are retained as historical architecture context.
They are not the active next-slice map.

Current hotspots:

- selected wall single-leaf calibration anchors:
  - `docs/calculator/CHECKPOINT_2026-04-27_WALL_COVERAGE_EXPANSION_PLANNING_V2_GATE_A_HANDOFF.md`
  - `docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md`
  - `packages/engine/src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts`
  - `tools/dev/run-calculator-current-gate.ts`
- closed wall coverage planning anchors:
  - `docs/calculator/SLICE_WALL_COVERAGE_EXPANSION_PLANNING_V2_PLAN.md`
  - `packages/engine/src/calculator-source-gap-revalidation-gate-a-contract.test.ts`
- closed source-gap revalidation anchors:
  - `docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_PLAN.md`
  - `docs/calculator/SOURCE_GAP_LEDGER.md`
  - `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
  - `packages/engine/src/post-proposal-report-polish-next-slice-selection-contract.test.ts`
- closed proposal/report polish anchors:
  - `docs/calculator/SLICE_PROPOSAL_REPORT_POLISH_PLAN.md`
  - `apps/web/features/workbench/simple-workbench-proposal-generated-document-honesty.test.ts`
  - `apps/web/features/workbench/simple-workbench-proposal.test.ts`
  - `apps/web/features/workbench/simple-workbench-proposal-simple.ts`
  - `apps/web/features/workbench/simple-workbench-proposal.ts`
- closed route-policy integration anchors:
  - `docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md`
  - `docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md`
  - `apps/web/lib/project-route-auth.test.ts`
  - `apps/web/lib/server-project-routes.test.ts`
- closed calculator re-entry anchors:
  - `docs/calculator/CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_C_CLOSEOUT_HANDOFF.md`
  - `docs/calculator/SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md`
  - `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`
  - `packages/engine/src/post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_INVALID_THICKNESS_BASELINE_READY_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_CLOSEOUT_HANDOFF.md`
  - `docs/calculator/SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md`
  - `packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`
  - `packages/engine/src/post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_LAYER_ORDER_GATE_A_HANDOFF.md`
  - `docs/calculator/SLICE_FLOOR_LAYER_ORDER_EDIT_STABILITY_PLAN.md`
  - `packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts`
  - `apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_FLOOR_MANY_LAYER_STRESS_REGRESSION_PLAN.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_MANY_LAYER_GATE_A_HANDOFF.md`
  - `packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts`
  - `apps/web/features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_FLOOR_FIELD_CONTINUATION_EXPANSION_PLAN.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_FLOOR_FIELD_CONTINUATION_GATE_A_HANDOFF.md`
  - `packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts`
  - `apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts`
  - `docs/calculator/CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_C_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/post-wall-resilient-side-count-gate-c-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_LANDED_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_READY_HANDOFF.md`
  - `docs/calculator/CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md`
  - `packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
  - `apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
  - `apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts`
  - `packages/engine/src/post-wall-resilient-side-count-gate-b-v1-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-wall-timber-lightweight-source-corpus-v1-next-slice-selection-contract.test.ts`
  - `docs/calculator/SLICE_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_PLAN.md`
  - `apps/web/features/workbench/wall-lsf-timber-stud-preset-benchmarks.test.ts`
  - `apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts`
  - `apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts`
  - `apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts`
  - `packages/engine/src/coverage-grid-consistency.test.ts`
- selected productization anchors:
  - `apps/web/lib/project-access-policy.ts`
  - `apps/web/lib/project-access-policy.test.ts`
  - `apps/web/lib/project-route-auth.ts`
  - `apps/web/lib/project-storage-auth.ts`
  - `apps/web/lib/server-project-routes.test.ts`
  - `docs/calculator/SLICE_PROJECT_ACCESS_POLICY_ROUTE_INTEGRATION_PLAN.md` (deferred)
  - `docs/calculator/CHECKPOINT_2026-04-23_TEAM_ACCESS_MODEL_HANDOFF.md`
- selected closeout and follow-up anchors:
  - `packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts`
  - `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - `packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model.ts`
  - `packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts`
  - `packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-origin-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-partial-order-matrix.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts`
  - `packages/engine/src/post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts`
  - `packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts`
  - `packages/engine/src/tuas-clt-backlog-decision-contract.test.ts`
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts`
  - `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts`
  - `packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts`
  - `apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts`
  - `apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts`
  - `packages/engine/src/tuas-c11c-exact-import-readiness.ts`
  - `packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts`
  - `packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts`
  - `packages/engine/src/tuas-c11c-frequency-source-recheck.test.ts`
  - `packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts`
  - `packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts`
  - `packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts`
  - `packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts`
  - `packages/engine/src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts`
- selected broad-audit and raw-helper anchors:
  - `packages/engine/src/post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts`
  - `packages/engine/src/raw-floor-screening-carrier-support.test.ts`
  - `packages/engine/src/raw-concrete-helper-answer-guard.test.ts`
  - `packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts`
  - `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
  - `packages/engine/src/raw-floor-safe-bare-split-parity.test.ts`
  - `packages/engine/src/output-origin-trace-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-screening-route-support.test.ts`
  - `apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts`
  - `apps/web/features/workbench/raw-terminal-concrete-helper-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
  - `apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts`
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`
- final-audit gate additions:
  - `packages/engine/src/coverage-grid-consistency.test.ts`
  - `packages/engine/src/post-good-calculator-final-audit-v1-next-slice-selection-contract.test.ts`
- source-backed widening ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

In this historical 2026-04-27 snapshot, the then-selected next slice was
a wall single-leaf source/formula contract slice:
`wall_single_leaf_mass_law_calibration_v1`. It started by
defining unmatched massive single-leaf wall signatures, formula/source
basis, positive cases, negative cases, exact/lab-fallback precedence,
and UI/card coverage without changing acoustic values, support,
confidence, evidence tiers, or formulas. `calculator_source_gap_revalidation_v1`
and `wall_coverage_expansion_planning_v2` Gate A are closed
no-runtime: closed reinforced, `GDMTXA04A`, `C11c`, raw bare,
wall-selector, floor continuation, floor many-layer, floor layer-order,
timber-stud formula, CLT wall, floor fallback, UI honesty, and route
policy integration tracks stay explicit deferrals or closed references.

## What This System Is Not Yet

To avoid docs drift, be explicit about current non-features:

- not yet a complete multi-user/team project persistence system
- not yet route-enabled for team membership; policy exists, but routes
  remain owner-scoped through the landed owner-only adapter
- not a single-formula calculator
- not a lookup-only calculator; missing exact source data must not block
  a labelled physics prediction when the required inputs are sufficient
- not allowed to fabricate unsupported field or low-frequency outputs
- not complete across every possible floor/wall family corridor
- not free to promote measured-exact/source-validated claims without
  explicit source-backed or guarded planning work

## Reading Guide

- Want current behavior and risks:
  read [CURRENT_STATE.md](./CURRENT_STATE.md)
- Want the next implementation step:
  read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)
- Want the productization roadmap:
  read [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md)
- Want the active implementation plan:
  read [SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md](./SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md)
- Want answer-origin or support semantics:
  read [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- Want the last clean resume point:
  read [CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md](./CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md)
