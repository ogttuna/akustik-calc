# Post-V1 Next Numeric Coverage Gap After User-Material Porous Flow-Resistivity Input Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. The next step after the porous
flow-resistivity input coverage refresh is not another source catalog or
finite scenario pack; it is a no-runtime numeric coverage/accuracy
rerank that chooses the next highest-ROI calculator slice.

The rerank must favor work that helps the engine calculate more
user-entered layer combinations, or calculate existing combinations more
accurately, while preserving exact `needs_input` and `unsupported`
boundaries for missing physical inputs, metric bases, and unsupported
families.

## Previous Refresh

Prior rerank action:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`

Prior rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`

Prior rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`

Previous owner action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`

Previous owner status:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`

Closed owner candidate:

`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`

Coverage refresh action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

The refresh re-probes numeric user-supplied porous flow, explicit
engineering-default flow, context-owned absorber flow, and missing
user/unknown `flowResistivityPaSM2` for lab, field, and building bases.
It moves no runtime values, imports no source rows, and retunes no
formula. Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Selected Work

Selected action:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`

Selected file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`

Selected plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_PLAN_2026-06-12.md`

Selected label:

`post-V1 next numeric coverage gap after user-material porous flow-resistivity input`

## Landed Result

Status:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`

Selected candidate:

`floor.user_material_impact_context_dynamic_stiffness_owner`

Selected next action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_OWNER_PLAN_2026-06-12.md`

Selected next label:

`post-V1 floor user-material impact context dynamic-stiffness owner`

The rerank ran `roiAnalysisIterations: 3`, subtracted closed compatible
anchor-delta, direct-fixed, default-catalog double-leaf/framed,
explicit user-material, missing-topology, and porous flow-resistivity
lanes, then selected the custom floor impact context dynamic-stiffness
owner. Embedded custom resilient-layer `impact.dynamicStiffnessMNm3`
already calculates through the heavy floating-floor formula; the open
gap is custom visible stacks where the same physical value is supplied
through `floorImpactContext.resilientLayerDynamicStiffnessMNm3`.

Counters: `candidateCount 11`, `estimatedNextRuntimeValuesMoved: 2`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 2`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## ROI Iteration Rules

The rerank must run at least two explicit ROI iterations before naming a
runtime owner. It should subtract already-closed lanes first:

- compatible anchor-delta lab, field, building, A-weighted, and lab
  companion lanes;
- direct-fixed double-leaf/framed lab, field, building, and A-weighted
  lanes;
- default-catalog double-leaf/framed lab, field, and building lanes;
- explicit user-material double-leaf/framed route-input lanes;
- user-material missing-topology input-surface lanes;
- user-material porous flow-resistivity input boundary lanes.

Candidate ranking should prioritize:

- owned formula/input-surface work that unlocks many arbitrary
  user-entered layer combinations;
- runtime basis promotion only when metric basis, route owner, and
  required physical inputs are already proven;
- calibration or holdout work only when admissible same-basis evidence
  exists and can tighten a live formula without weakening pinned values;
- bounded source research only when a selected route names the exact
  evidence needed for a formula, anchor, delta, or holdout decision.

Candidate ranking must reject or park:

- broad source crawling;
- material-editor UI, auth/storage, reporting, and proposal polish;
- finite scenario packs that do not improve dynamic calculation scope;
- non-Knauf or other measured-row widening without owned evidence;
- silent defaults for missing route topology, missing porous flow, ASTM
  aliases, impact aliases, or field/building basis mismatches.

## Expected Counters

The rerank itself is expected to move no runtime values:
`immediateRuntimeValuesMoved: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

The selected follow-up may move runtime values only if it has a bounded
owner, required physical inputs, and metric-basis evidence. If no such
owner is ready, the rerank should choose the highest-ROI input-surface,
coverage, or calibration prerequisite that directly protects future
calculator scope or accuracy.
