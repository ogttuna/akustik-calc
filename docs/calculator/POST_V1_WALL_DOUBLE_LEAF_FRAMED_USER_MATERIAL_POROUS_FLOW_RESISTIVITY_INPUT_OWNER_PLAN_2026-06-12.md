# Post-V1 Wall Double-Leaf/Framed User-Material Porous Flow-Resistivity Input Owner Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. User-created materials should flow
into the existing double-leaf/framed wall formula only when the route's
physical inputs are owned. The route already calculates arbitrary
custom `panel_leaf / porous_absorber / panel_leaf` stacks when topology
and absorber flow evidence are present. The selected next accuracy
slice is to close the remaining porous fill input boundary: a
user-supplied porous absorber must provide `flowResistivityPaSM2`, or
the calculation must explicitly adopt an engineering default with a
visible default and wider budget.

This is not a broad source crawl, not material-editor UI work, not
catalog CRUD, and not a formula retune. It is a bounded calculator
accuracy owner for the route-required `absorberFlowResistivityOrDefault`
input.

## Previous Rerank

Previous owner action:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`

Previous owner status:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`

Current rerank action:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`

Current rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`

Current rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`

Selected candidate:

`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`

The rerank ran `roiAnalysisIterations: 3`, subtracted closed compatible
anchor-delta, direct-fixed, default-catalog double-leaf/framed,
explicit user-material, and user-material missing-topology lanes, then
selected the porous flow-resistivity input owner. Counters:
`candidateCount 10`, `closedCompatibleAnchorDeltaRowsRechecked: 12`,
`closedDirectFixedRowsRechecked: 24`,
`closedDefaultCatalogDoubleLeafRowsRechecked: 9`,
`closedUserMaterialExplicitRuntimeRowsRechecked: 3`,
`closedUserMaterialMissingTopologyRowsRechecked: 4`,
`flowResistivityRiskRowsRechecked: 3`,
`estimatedNextAccuracyBoundaryRowsMoved: 2`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesProtectedAfterInputCapture: 12`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

## Selected Work

Selected action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`

Selected file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`

Selected plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_OWNER_PLAN_2026-06-12.md`

Selected label:

`post-V1 wall double-leaf/framed user-material porous flow-resistivity input owner`

## Landed Owner

Owner status:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`

The owner is implemented in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`.
It preserves numeric user-supplied porous flow, preserves explicit
engineering-default flow with `propertyDefaults` and a widened budget,
accepts context-owned absorber flow from
`advancedWall.cavities[0].absorberFlowResistivityPaSM2`, and parks
user-supplied or unknown porous absorbers with missing
`flowResistivityPaSM2` at `needs_input` for lab, field, and building
requests. No source rows were imported, no formula was retuned, and no
frontend implementation files were touched.

Landed counters: `accuracyBoundaryRowsMoved: 2`,
`needsInputBoundaryRowsAdded: 1`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Selected next action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md`

Selected next label:

`post-V1 wall double-leaf/framed user-material porous flow-resistivity input coverage refresh`

## Implementation Rules

- Preserve explicit user-supplied porous absorber values: custom
  double-leaf/framed stacks with numeric `flowResistivityPaSM2` keep the
  current lab values `Rw 46 / STC 46 / C -1 / Ctr -6.1` and the current
  field/building route values.
- Preserve explicit engineering-default posture: porous absorbers with
  numeric `flowResistivityPaSM2` and
  `propertySourceStatus: engineering_default` may calculate with the
  existing property default disclosure and widened error budget.
- Do not silently treat a `user_supplied` porous absorber with missing
  `flowResistivityPaSM2` as fully complete. It must either return a
  precise `needs_input` for `flowResistivityPaSM2` or use an explicit
  engineering-default adoption path with `propertyDefaults` and the
  wider budget.
- Preserve missing topology, unknown custom material, ASTM/IIC/AIIC,
  impact-output, lab/field/building metric-basis, and thick-board Auto
  family boundaries.
- Do not import source rows, retune the double-leaf formula, or touch
  frontend/material-editor files in this owner.

## Expected Counters

Expected owner counters: `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`,
`accuracyBoundaryRowsMoved: 2`, and
`needsInputBoundaryRowsAdded: 1`.

## Follow-Up Coverage Refresh Landed

The selected follow-up
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`
has now landed in
`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`
with status
`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`.
It re-probes the owner candidate
`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`
without moving values, importing source rows, retuning formulas, or
touching frontend implementation files. Coverage counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Current selected next action:
`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`.
Current selected next file:
`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`.
Current selected next plan:
`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_PLAN_2026-06-12.md`.
Current selected next label:
`post-V1 next numeric coverage gap after user-material porous flow-resistivity input`.
