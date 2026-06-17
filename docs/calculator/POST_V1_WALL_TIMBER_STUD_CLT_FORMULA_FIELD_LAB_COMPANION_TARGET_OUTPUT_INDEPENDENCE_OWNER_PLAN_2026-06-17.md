# Post-V1 Wall Timber-Stud + CLT Formula Field Lab-Companion Target-Output Independence Owner - 2026-06-17

## Purpose

This is the selected runtime accuracy owner after the wall
user-material formula field lab-companion target-output independence
coverage refresh and runtime-first rerank. It fixes a target-output and
metric-basis bug in two already owned wall formula families:

- generated timber-stud walls with the Gate DN bounded lab-family curve;
- generated CLT / mass-timber walls with the Gate H / Gate Y calculated
  lab-family curve.

This is calculator runtime work. It is not UI polish, broad source
crawling, confidence-copy work, source promotion, or a formula retune.

## Rerank Selection

Rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_plan`

Rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-target-output-independence-contract.test.ts`

Rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner`

Selected candidate:

`wall.timber_stud_clt_formula_field_lab_companion_target_output_independence_owner`

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextAccuracyPromotedRequestShapes: 4`,
`estimatedNextAccuracyPromotedTargetOutputs: 8`,
`estimatedNextNewCalculableRequestShapes: 3`,
`estimatedNextNewCalculableTargetOutputs: 3`,
`estimatedNextRuntimeBasisPromotions: 2`,
`estimatedNextRuntimeValuesMoved: 6`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Runtime Owner

Owner action:

`post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`

Owner plan doc:

`docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-17.md`

Owner status:

`post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`

The owner keeps field outputs on the Gate I field adapter while letting
requested lab companions use the direct calculated lab-family curve.

Timber-stud field requests now return lab companions:

- `Rw 50`
- `STC 50`
- `C 0.5`
- `Ctr -4.2`

while field outputs remain:

- `R'w 42`
- `Dn,w 42`
- `DnT,w 43`
- `DnT,A 43.9`

CLT field requests now return lab companions:

- `Rw 42`
- `STC 43`
- `C -1.1`
- `Ctr -7.1`

while field outputs remain:

- `R'w 41`
- `Dn,w 41`
- `DnT,w 42`
- `DnT,A 40.7`

Runtime counters: `accuracyPromotedRequestShapes: 4`,
`accuracyPromotedTargetOutputs: 8`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 3`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 6`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Implementation Scope

Runtime edit:

`packages/engine/src/calculate-assembly.ts`

Contract test:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`

The owner adds a bounded field lab-companion helper for two route
families only. The direct lab companion path requires:

- `contextMode: "field_between_rooms"`;
- complete Gate I field basis with no missing physical inputs;
- Gate DN timber-stud bounded lab-family base, or Gate H CLT /
  mass-timber lab-family base;
- timber route: explicit `wood_stud`, line connection, 600 mm spacing,
  and `stud_surrogate_blend+framed_wall_calibration`;
- CLT route: `laminated_single_leaf` or `single_leaf_panel` with
  `laminated_leaf_sharp_delegate`;
- no catalog lab fallback;
- no compatible or exact source anchor taking precedence;
- no opening leak route.

## Boundaries

Keep these outside the owner:

- field-only requests that do not ask for `Rw`, `STC`, `C`, or `Ctr`;
- exact/source LSF rows and their Gate DV / Gate DX companions;
- numeric timber-stud or CLT retuning;
- measured source promotion or source row imports;
- missing field context inputs;
- ASTM and impact outputs;
- frontend changes.

## Selected Next

Selected next action:

`post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md`

Selected next label:

`post-V1 wall timber-stud + CLT formula field lab-companion target-output independence coverage refresh`
