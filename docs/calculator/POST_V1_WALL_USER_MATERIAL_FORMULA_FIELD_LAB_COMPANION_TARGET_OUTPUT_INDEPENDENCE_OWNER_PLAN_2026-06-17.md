# Post-V1 Wall User-Material Formula Field Lab-Companion Target-Output Independence Owner - 2026-06-17

## Purpose

This is the selected runtime accuracy owner after the wall
user-material formula field lab-companion basis integrity coverage
refresh and runtime-first rerank. It fixes a target-output dependence
bug in an already owned wall route: complete custom double-leaf/framed
user-material field requests returned direct lab companions only when a
field output was also requested.

This is calculator runtime work. It is not UI polish, broad source
crawling, confidence-copy work, process cleanup, or a formula retune.

## Previous Coverage Refresh

Previous coverage refresh:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Previous runtime owner:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_plan`

Previous runtime owner file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-owner-contract.test.ts`

Previous runtime owner status:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

## Rerank Selection

Rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_plan`

Rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-basis-integrity-contract.test.ts`

Rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_landed_no_runtime_selected_wall_user_material_formula_field_lab_companion_target_output_independence_owner`

Selected candidate:

`wall.user_material_formula_field_lab_companion_target_output_independence_owner`

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextAccuracyPromotedRequestShapes: 2`,
`estimatedNextAccuracyPromotedTargetOutputs: 4`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 3`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Runtime Owner

Owner action:

`post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`

Owner plan doc:

`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-17.md`

Owner status:

`post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`

The owner removes the artificial requirement that a field output must be
requested before complete custom user-material field requests can
publish their owned direct lab companions. With full Gate I field
context and owned direct lab trace, lab-only field requests now return:

- `Rw 46`
- `STC 46`
- `C -1`
- `Ctr -6.1`

The field adapter values remain owned and unchanged when field outputs
are requested:

- `R'w 40`
- `Dn,w 41`
- `Dn,A 39.5`
- `DnT,w 43`
- `DnT,A 41.9`

Runtime counters: `accuracyPromotedRequestShapes: 2`,
`accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Implementation Scope

Runtime edit:

`packages/engine/src/calculate-assembly.ts`

Contract test:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`

Only `getPostV1WallUserMaterialFormulaFieldLabCompanionOutputs` changes
behavior. The direct lab companion path still requires:

- `contextMode: "field_between_rooms"`;
- user-supplied wall materials;
- complete Gate I field basis with no missing physical inputs;
- owned double-leaf/framed user-material formula lab trace;
- no catalog lab fallback;
- no compatible source anchor taking precedence;
- no opening leak route.

## Boundaries

Keep these outside the owner:

- field-only requests that do not ask for `Rw`, `STC`, `C`, or `Ctr`;
- built-in gypsum/rockwool Gate T behavior;
- missing field context inputs;
- ASTM and impact outputs;
- source crawling or source row imports;
- formula retuning;
- frontend changes.

## Selected Next

Selected next action:

`post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md`

Selected next label:

`post-V1 wall user-material formula field lab-companion target-output independence coverage refresh`
