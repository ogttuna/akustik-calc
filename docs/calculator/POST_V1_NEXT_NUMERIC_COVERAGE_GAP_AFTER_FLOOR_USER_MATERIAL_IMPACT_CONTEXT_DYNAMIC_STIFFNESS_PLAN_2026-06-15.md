# Post-V1 Next Numeric Coverage Gap After Floor User-Material Impact Context Dynamic Stiffness Plan - 2026-06-15

## North Star

DynEcho is an acoustic calculator. The next step after the floor
user-material impact-context dynamic-stiffness coverage refresh is a
no-runtime numeric coverage/accuracy rerank that chooses the next
highest-ROI calculator slice.

The rerank must favor work that helps the engine calculate more
user-entered layer combinations, or calculate current combinations more
accurately, while preserving exact `needs_input` and `unsupported`
boundaries for missing physical inputs, metric bases, and unsupported
families.

This is not UI/UX work, broad source crawling, material-editor CRUD,
or formula retuning by default.

## Previous Refresh

Prior rerank action:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`

Prior rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`

Prior rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner`

Previous owner action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts`

Previous owner status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh`

Closed owner candidate:

`floor.user_material_impact_context_dynamic_stiffness_owner`

Coverage refresh action:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan`

Coverage refresh file:

`packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts`

Coverage refresh status:

`post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

The refresh re-probes the context-owned custom visible heavy
floating-floor stack at `Ln,w 50.3` and `DeltaLw 24.3` through
`predictor_heavy_floating_floor_iso12354_annexc_estimate`. It keeps
missing `resilientLayerDynamicStiffnessMNm3` or `loadBasisKgM2` at
`needs_input`, keeps low-density custom concrete outside the heavy
concrete carrier route, keeps ASTM/IIC/AIIC and field/building impact
outputs outside this owner, moves no runtime values, imports no source
rows, retunes no formula, and touches no frontend implementation files.
This is not a broad source crawl.

Counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Selected Work

Selected action:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan`

Selected file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts`

Selected plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md`

Selected label:

`post-V1 next numeric coverage gap after floor user-material impact context dynamic stiffness`

## Closeout - 2026-06-15

Landed status:

`post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner`

Selected candidate:

`floor.user_material_impact_context_field_only_adapter_owner`

Selected next action:

`post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan`

Selected next file:

`packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_OWNER_PLAN_2026-06-15.md`

Selected next label:

`post-V1 floor user-material impact context field-only adapter owner`

The rerank ran `roiAnalysisIterations: 4`, subtracted closed wall
user-material, floor impact-context dynamic-stiffness, and mixed custom
floor field-adapter lanes, then selected the direct field-only custom
floor impact owner. Mixed `Ln,w` + field requests already calculate
`Ln,w 50.3`, `DeltaLw 24.3`, `L'n,w 52.3`, `L'nT,w 49.9`, and
`L'nT,50 52.9` when the route-required field inputs are supplied.
Field-only requests for the same stack are the next runtime gap.
Counters: `candidateCount 12`, `estimatedNextRuntimeValuesMoved: 3`,
`estimatedNextCalculableRequestShapes: 1`,
`estimatedNextCalculableTargetOutputs: 3`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## ROI Iteration Rules

The rerank must run at least two explicit ROI iterations before naming
another runtime owner. It should subtract already-closed lanes first:

- compatible anchor-delta lab, field, building, A-weighted, and lab
  companion lanes;
- direct-fixed double-leaf/framed lab, field, building, and A-weighted
  lanes;
- default-catalog double-leaf/framed lab, field, and building lanes;
- explicit user-material double-leaf/framed route-input lanes;
- user-material missing-topology input-surface lanes;
- user-material porous flow-resistivity input boundary lanes;
- floor user-material impact-context dynamic-stiffness owner and
  coverage-refresh lane.

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
- measured-row widening without owned same-basis evidence;
- silent defaults for missing route topology, missing porous flow,
  missing floor dynamic stiffness/load basis, ASTM aliases, impact
  aliases, or field/building basis mismatches.

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
