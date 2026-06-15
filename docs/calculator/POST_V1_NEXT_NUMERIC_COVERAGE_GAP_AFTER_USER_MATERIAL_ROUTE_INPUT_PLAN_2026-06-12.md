# Post-V1 Next Numeric Coverage Gap After User-Material Route Input Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. The previous runtime owner made
explicit user-supplied `panel_leaf / porous_absorber / panel_leaf`
double-leaf/framed wall stacks calculable when the required physical
topology inputs are present. The coverage refresh froze that behavior
without moving new runtime values.

The next action is a no-runtime rerank. It must subtract the now-closed
user-material route-input lane and select the next highest-ROI calculator
slice that can improve scope or accuracy. This is not a broad source
crawl and not material-editor UI work.

## Previous Coverage Refresh

Previous coverage action:

`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan`

Previous coverage file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts`

Previous coverage status:

`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Previous owner:

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan`

Previous owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`

Previous owner status:

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_landed_runtime_selected_coverage_refresh`

The frozen user-material route calculates lab
`Rw 46 / STC 46 / C -1 / Ctr -6.1` through
`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`
and field/building `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 /
DnT,A 41.9` through Gate I / Gate AR. Unknown custom material IDs,
missing explicit topology, ASTM/IIC/AIIC, and impact outputs remain
outside the owner.

Coverage counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Work Order

Selected action:

`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`

Selected file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`

Selected plan doc:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_ROUTE_INPUT_PLAN_2026-06-12.md`

Selected label:

`post-V1 next numeric coverage gap after user-material route input`

Expected rerank scope:

- subtract closed compatible anchor-delta, direct-fixed, default-catalog
  double-leaf/framed, and user-material double-leaf/framed lanes;
- compare remaining numeric calculator candidates by runtime value
  movement, calculable request shapes, evidence ownership, and boundary
  risk;
- prefer formula-route or route-input owners over finite scenario packs;
- keep material-editor UI, broad source crawling, auth/storage,
  reporting polish, and source catalog expansion out of scope;
- move no runtime values in the rerank itself.

Expected counters: `candidateCount` and `roiAnalysisIterations` should
be recorded by the rerank contract; `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0` must remain true for the rerank
step.

## Landed Rerank Decision

Status:

`post_v1_next_numeric_coverage_gap_after_user_material_route_input_landed_no_runtime_selected_user_material_missing_topology_input_surface_owner`

Landed file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`

Selected candidate:

`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`

Selected next action:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_OWNER_PLAN_2026-06-12.md`

Selected next label:

`post-V1 wall double-leaf/framed user-material missing-topology input-surface owner`

The rerank ran `roiAnalysisIterations: 3`. It subtracted closed
compatible anchor-delta, direct-fixed, default-catalog double-leaf/framed,
and explicit user-material double-leaf/framed lanes. It rejected silent
support-topology defaults because they would publish values for
physically different constructions, and it rejected broad source crawling
and material-editor UI as non-engine work for this slice.

The selected owner moves no runtime values by itself, but it is the
highest-ROI next calculator slice because missing topology is the common
remaining blocker for arbitrary user-created `panel_leaf /
porous_absorber / panel_leaf` wall stacks. The already-live formula route
can calculate once the user supplies `sideALeafGroup`, `cavity1DepthMm`,
`sideBLeafGroup`, `frameBridgeClass`, `supportTopology`, and
`supportSpacingMm`.

Counters: `candidateCount 9`, `roiAnalysisIterations: 3`,
`closedUserMaterialRuntimeRowsRechecked: 3`,
`closedUserMaterialBoundaryRowsRechecked: 4`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.
