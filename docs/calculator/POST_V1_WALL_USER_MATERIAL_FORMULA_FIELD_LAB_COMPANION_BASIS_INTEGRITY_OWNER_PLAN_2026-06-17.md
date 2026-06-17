# Post-V1 Wall User-Material Formula Field Lab-Companion Basis Integrity Owner - 2026-06-17

## Purpose

This selected runtime accuracy owner fixes a metric-basis defect on the
custom complete double-leaf/framed wall user-material route. Mixed
`field_between_rooms` requests already support `Rw`, `STC`, `C`, `Ctr`,
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`, but the lab companion
slots currently inherit field-adapter values. They must instead use the
owned direct lab formula curve while the field outputs remain on Gate I.

This improves calculator accuracy and basis integrity for a user-entered
layer combination that is already physically owned. It is not UI work,
source crawling, confidence-labeling, or a formula retune.

## Previous Coverage Refresh And Rerank

Previous coverage refresh:

`post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-wall-user-material-formula-companion-completeness-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_wall_user_material_formula_companion_completeness_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Landed rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_plan`

Rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-companion-completeness-contract.test.ts`

Rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_companion_completeness_landed_no_runtime_selected_wall_user_material_formula_field_lab_companion_basis_integrity_owner`

Selected candidate:

`wall.user_material_formula_field_lab_companion_basis_integrity_owner`

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextAccuracyPromotedTargetOutputs: 4`,
`estimatedNextRuntimeValuesMoved: 3`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Runtime Owner

Owner action:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-owner-contract.test.ts`

Owner plan doc:

`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-17.md`

Owner status:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.user_material_formula_field_lab_companion_basis_integrity_owner`

## Scope

Apply only when all are true:

- route is wall;
- at least one material is user-supplied;
- `airborneContext.contextMode` is `field_between_rooms`;
- field context is complete and Gate I field adapter is selected;
- the underlying dynamic trace is the owned custom
  `double_leaf_framed` formula route with two visible leaves, one porous
  cavity, and complete physical inputs;
- the request is mixed, meaning it asks for at least one field output
  and at least one lab companion.

Correct values for the pinned custom wall stack:

- lab companions from direct formula: `Rw 46`, `STC 46`, `C -1`,
  `Ctr -6.1`;
- field outputs from Gate I adapter: `R'w 40`, `Dn,w 41`,
  `Dn,A 39.5`, `DnT,w 43`, `DnT,A 41.9`.

Expected counters: `accuracyPromotedRequestShapes: 2`,
`accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Boundaries

The owner must not:

- change formula coefficients;
- import source rows;
- alter built-in gypsum/rockwool historical Gate T expectations;
- promote timber-stud, CLT, heavy-core, or lined-massive lanes;
- change field outputs;
- alias `Rw` to `R'w` or copy field values back into lab metrics;
- publish ASTM `IIC` / `AIIC` or impact `Ln,w` / `DeltaLw` for wall
  assemblies;
- widen field-only requests into lab companion publication;
- bypass missing topology or missing field context.

## Current Selected Next

After this owner lands, run a short coverage refresh:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_plan`

Expected file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Expected plan doc:

`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md`

## Owner Closeout

Landed owner:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-owner-contract.test.ts`

Owner status:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh`

The owner keeps custom complete double-leaf/framed wall user-material
field outputs on Gate I while correcting lab companions to direct
formula values: `Rw 46`, `STC 46`, `C -1`, and `Ctr -6.1`, with field
values `R'w 40`, `Dn,w 41`, `Dn,A 39.5`, `DnT,w 43`, and
`DnT,A 41.9`.

Runtime counters: `accuracyPromotedRequestShapes: 2`,
`accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Current selected next action:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_plan`

Current selected next file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md`

## Coverage Refresh Follow-Up Closeout

Landed coverage refresh:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next action:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_plan`

Current selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-basis-integrity-contract.test.ts`

Current selected next plan doc:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-17.md`
