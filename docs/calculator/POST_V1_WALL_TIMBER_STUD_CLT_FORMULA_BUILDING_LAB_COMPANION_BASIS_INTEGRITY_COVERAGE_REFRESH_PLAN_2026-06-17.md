# Post-V1 Wall Timber-Stud + CLT Formula Building Lab-Companion Basis Integrity Coverage Refresh - 2026-06-17

## Purpose

This is the selected next no-runtime coverage refresh after the wall
timber-stud + CLT formula building lab-companion basis integrity owner.
It should re-probe the owner values, verify target-output independence,
and confirm that building-only, field, lab, exact/source, missing-input,
ASTM, and impact boundaries did not drift.

This is not UI polish, broad source crawling, confidence-copy work,
process cleanup, or a formula retune.

## Previous Owner

Previous rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-contract.test.ts`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`

Runtime owner:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-owner-contract.test.ts`

Runtime owner status:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.timber_stud_clt_formula_building_lab_companion_basis_integrity_owner`

The owner keeps generated timber-stud complete building outputs on Gate
AR at `R'w 42`, `Dn,w 42`, `Dn,A 42.4`, `DnT,w 43`, and
`DnT,A 43.9`, while publishing lab companions `Rw 50`, `STC 50`,
`C 0.5`, and `Ctr -4.2` when requested. It keeps generated CLT
complete building outputs on Gate AR at `R'w 41`, `Dn,w 41`,
`Dn,A 39.2`, `DnT,w 42`, and `DnT,A 40.7`, while publishing lab
companions `Rw 42`, `STC 43`, `C -1.1`, and `Ctr -7.1`.

Runtime counters: `accuracyPromotedRequestShapes: 4`,
`accuracyPromotedTargetOutputs: 8`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 4`, `newCalculableTargetOutputs: 8`,
`runtimeBasisPromotions: 2`, `runtimeValuesMoved 16`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Coverage Refresh Job

Re-probe:

- timber-stud building lab-only requests for `Rw`, `STC`, `C`, `Ctr`;
- timber-stud single and partial lab/building requests such as `Rw`,
  `C`, and `Rw + R'w`;
- timber-stud full mixed lab/building requests;
- CLT building lab-only requests for `Rw`, `STC`, `C`, `Ctr`;
- CLT single and partial lab/building requests such as `Rw`, `C`, and
  `Rw + R'w`;
- CLT full mixed lab/building requests;
- building-only outputs for both families, confirming that they remain
  Gate AR building values;
- field and element-lab behavior already owned by previous slices;
- exact/source LSF boundaries;
- missing Gate AR physical input boundaries;
- ASTM/impact unsupported boundaries.

## Coverage Refresh Closeout

Coverage refresh action:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Coverage refresh plan doc:

`docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md`

Coverage refresh status:

`post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Coverage counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

The refresh re-probes timber-stud building lab companions `Rw 50`,
`STC 50`, `C 0.5`, and `Ctr -4.2`, CLT building lab companions
`Rw 42`, `STC 43`, `C -1.1`, and `Ctr -7.1`, Gate AR building values,
field/lab context boundaries, exact/source LSF boundaries, missing
building input, ASTM unsupported, and impact `needs_input` boundaries.

## Current Selected Next

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md`

Selected next label:

`post-V1 runtime-first route-family rerank after wall timber-stud + CLT formula building lab-companion basis integrity`

## Validation

For this no-runtime refresh:

1. targeted Vitest for the new coverage refresh contract and adjacent
   owner/rerank contracts;
2. `git diff --check`;
3. full `pnpm calculator:gate:current` if docs or runner references
   change.
