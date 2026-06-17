# Post-V1 Wall Timber-Stud + CLT Formula Field Lab-Companion Target-Output Independence Coverage Refresh - 2026-06-17

## Purpose

This is the selected next no-runtime coverage refresh after the wall
timber-stud + CLT formula field lab-companion target-output independence
owner. It should re-probe the owner values, verify the source and
field-only boundaries, and select the next calculator runtime-first
slice.

This is not UI polish, broad source crawling, confidence-copy work,
process cleanup, or a formula retune.

## Previous Owner

Previous coverage refresh:

`post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Previous rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-target-output-independence-contract.test.ts`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner`

Runtime accuracy owner:

`post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_plan`

Runtime accuracy owner file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`

Runtime accuracy owner status:

`post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.timber_stud_clt_formula_field_lab_companion_target_output_independence_owner`

The owner makes generated timber-stud and CLT formula field requests
target-output independent for lab companions. Timber-stud lab
companions remain `Rw 50`, `STC 50`, `C 0.5`, and `Ctr -4.2`;
timber-stud field outputs remain `R'w 42`, `Dn,w 42`, `DnT,w 43`,
and `DnT,A 43.9`. CLT lab companions remain `Rw 42`, `STC 43`,
`C -1.1`, and `Ctr -7.1`; CLT field outputs remain `R'w 41`,
`Dn,w 41`, `DnT,w 42`, and `DnT,A 40.7`.

Runtime counters: `accuracyPromotedRequestShapes: 4`,
`accuracyPromotedTargetOutputs: 8`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 6`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Coverage Refresh Job

Re-probe:

- timber-stud lab-only field request `Rw`, `STC`, `C`, `Ctr`;
- timber-stud mixed lab/field request;
- CLT lab-only field request `Rw`, `STC`, `C`, `Ctr`;
- CLT mixed lab/field request;
- field-only requests for both families;
- element-lab behavior for both families;
- LSF exact/source boundary;
- ASTM and impact unsupported boundaries if any adjacent request tries
  to pull them into the owner.

## Coverage Refresh Closeout

Coverage refresh action:

`post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Coverage refresh plan doc:

`docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md`

Coverage refresh status:

`post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

The refresh closes no-runtime and chooses a new runtime-first rerank
after the probes above pass.

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Current Selected Next

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md`

Selected next label:

`post-V1 runtime-first route-family rerank after wall timber-stud + CLT formula field lab-companion target-output independence`
