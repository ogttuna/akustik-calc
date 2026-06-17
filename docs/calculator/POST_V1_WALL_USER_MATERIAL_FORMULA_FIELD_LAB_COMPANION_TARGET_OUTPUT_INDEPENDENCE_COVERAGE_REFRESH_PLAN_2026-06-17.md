# Post-V1 Wall User-Material Formula Field Lab-Companion Target-Output Independence Coverage Refresh - 2026-06-17

## Purpose

This is the selected next no-runtime coverage refresh after the wall
user-material formula field lab-companion target-output independence
owner. It should re-probe the owner and choose the next calculator
runtime-first slice.

This is not UI polish, broad source crawling, confidence-copy work,
process cleanup, or a formula retune.

## Previous Owner

Previous coverage refresh:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_plan`

Previous coverage refresh file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-basis-integrity-coverage-refresh-contract.test.ts`

Previous coverage refresh status:

`post_v1_wall_user_material_formula_field_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

Previous rerank:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_plan`

Previous rerank file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-basis-integrity-contract.test.ts`

Previous rerank status:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_basis_integrity_landed_no_runtime_selected_wall_user_material_formula_field_lab_companion_target_output_independence_owner`

Runtime accuracy owner:

`post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_plan`

Runtime accuracy owner file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`

Runtime accuracy owner status:

`post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.user_material_formula_field_lab_companion_target_output_independence_owner`

The owner makes complete custom double-leaf/framed wall user-material
field requests target-output independent for lab companions. Lab-only
field requests now return `Rw 46`, `STC 46`, `C -1`, and `Ctr -6.1`;
field outputs remain `R'w 40`, `Dn,w 41`, `Dn,A 39.5`, `DnT,w 43`,
and `DnT,A 41.9`.

Rerank counters: `candidateCount: 8`, `roiAnalysisIterations: 4`,
`estimatedNextAccuracyPromotedRequestShapes: 2`,
`estimatedNextAccuracyPromotedTargetOutputs: 4`,
`estimatedNextRuntimeBasisPromotions: 1`,
`estimatedNextRuntimeValuesMoved: 3`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Runtime counters: `accuracyPromotedRequestShapes: 2`,
`accuracyPromotedTargetOutputs: 4`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 1`, `runtimeValuesMoved 3`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Analysis Findings Before This Refresh

This selected plan is the right place to carry the latest calculator
analysis because it is the current selected next action. The findings
below do not replace the refresh job; they constrain how the refresh
should close and how the next runtime-first slice should be selected.

Current implementation status:

- the owner contract exists at
  `packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-owner-contract.test.ts`;
- the selected coverage-refresh contract named below is not present yet
  and must be created before selecting a newer slice;
- the current-gate runner already includes the owner contract and the
  prior wall/floor Post-V1 contracts, but it cannot include this refresh
  until the refresh contract exists;
- focused owner validation was green during this analysis:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-owner-contract.test.ts --maxWorkers=1`
  passed `1` file / `5` tests.

Dynamic engine posture:

- `calculateAssembly` now behaves as the main dynamic calculator
  orchestrator: input guards, material catalog merge, dynamic airborne
  route selection, exact/source anchor handling, floor impact lane
  resolution, target-output support, metric-basis parking, and Post-V1
  companion promotion all flow through it;
- the resolver architecture already represents the calculator-first
  answer order: exact measured/source rows, compatible anchors or
  bounded deltas, owned family solvers, field/building adapters, and
  finally precise `needs_input`, `unsupported`, or basis boundaries;
- the wall dynamic airborne route owns several bounded families, but the
  current strongest user-material runtime line is still complete
  double-leaf/framed walls with explicit topology, porous absorber
  input, and complete field/building context;
- the floor dynamic impact line is strongest where exact ASTM,
  lightweight concrete DeltaLw companions, dynamic stiffness, visible
  floating-floor load basis, and direct/flanking context are physically
  supplied or safely derived;
- target-output support protects ISO/ASTM and lab/field/building metric
  integrity, but companion completeness is still handled route by route
  rather than by a fully centralized spectrum-owner policy.

Calculator maturity summary:

- this owner is an accuracy and basis-integrity promotion, not a broad
  calculable-scope widening: it moved `runtimeValuesMoved 3` and
  `runtimeBasisPromotions: 1`, while leaving
  `newCalculableRequestShapes: 0` and `newCalculableTargetOutputs: 0`;
- recent user-material work is aligned with the north star because it
  calculates from user-entered layer physics instead of finite source
  packs;
- the main strategic gaps remain a central frequency-band backbone,
  route-family companion completeness, stronger building prediction and
  flanking ownership, formula-family calibration/holdouts, and a richer
  user-material physical-property model.

Next-selection guard after this refresh:

- close this refresh first by re-probing the owner values and negative
  boundaries listed below;
- then choose a runtime-first route-family owner rather than another
  long no-runtime chain unless the refresh exposes a wrong-answer safety
  blocker;
- compare at least `wall.timber_stud_formula`, `wall.clt_formula`, and
  closely related complete `double_leaf/framed user-material` widening
  against the runtime-first campaign criteria;
- consider floor visible-floating / low-density exact ASTM continuation
  only if it has higher runtime movement than the wall candidates;
- reject UI/report polish, broad source crawling, confidence wording,
  generic cleanup, scalar metric aliasing, and field/building outputs
  without complete context plus an owned adapter.

## Coverage Refresh Job

Re-probe:

- full lab-only field request `Rw`, `STC`, `C`, `Ctr`;
- single and partial lab-only field requests;
- mixed field request with lab and field outputs;
- field-only request boundaries;
- lab-context-only behavior;
- built-in Gate T behavior;
- ASTM and impact unsupported boundaries.

## Coverage Refresh Closeout

Coverage refresh action:

`post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

Coverage refresh plan doc:

`docs/calculator/POST_V1_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md`

Coverage refresh status:

`post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank`

The refresh re-probes full, single, and partial lab-only field requests;
mixed lab/field requests; field-only and lab-context-only behavior;
built-in Gate T behavior; and ASTM/impact unsupported boundaries. It
keeps `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`, `R'w 40`, `Dn,w 41`,
`Dn,A 39.5`, `DnT,w 43`, and `DnT,A 41.9` on their owned bases.

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Current Selected Next

Selected next action:

`post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_plan`

Selected next file:

`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-target-output-independence-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_USER_MATERIAL_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md`

Selected next label:

`post-V1 runtime-first route-family rerank after wall user-material formula field lab-companion target-output independence`
