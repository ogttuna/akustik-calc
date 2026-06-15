# Post-V1 Wall Double-Leaf Framed User-Material Missing-Topology Input-Surface Owner Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. The engine now calculates explicit
user-supplied `panel_leaf / porous_absorber / panel_leaf` double-leaf
wall stacks when the route-required physical topology is present. The
next highest-ROI calculator slice is to own the missing-topology input
surface for the same family without silently guessing support details.

This is not a broad source crawl, not material-editor UI work, and not a
formula retune. It is calculator-scope work because it turns a common
user-created material stack from an opaque unsupported edge into a
precise route-input request that can flow into the already-owned formula
route once the user supplies the missing physical fields.

## Previous Rerank

Previous coverage action:

`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan`

Previous coverage file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts`

Previous coverage status:

`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

Previous action:

`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`

Previous file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`

Previous status:

`post_v1_next_numeric_coverage_gap_after_user_material_route_input_landed_no_runtime_selected_user_material_missing_topology_input_surface_owner`

Selected candidate:

`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`

The rerank subtracts the closed compatible anchor-delta,
direct-fixed, default-catalog double-leaf/framed, and explicit
user-material double-leaf/framed lanes. It selects this route-input
surface over triple-leaf widening, floor impact dynamic stiffness,
budget tightening, source crawling, and UI/material-editor work because
the required formula is already live and the remaining blocker is exact
physical topology input ownership.

Counters: `candidateCount 9`, `roiAnalysisIterations: 3`,
`closedUserMaterialRuntimeRowsRechecked: 3`,
`closedUserMaterialBoundaryRowsRechecked: 4`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`runtimeBasisPromotions: 0`, `runtimeFormulaRetunes: 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Work Order

Selected action:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`

Selected file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`

Selected label:

`post-V1 wall double-leaf/framed user-material missing-topology input-surface owner`

Landed status:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`

Implementation scope:

- keep explicit custom `panel_leaf / porous_absorber / panel_leaf`
  double-leaf/framed lab, field, and building values pinned on the
  existing formula route;
- preserve the `needs_input` boundary for the same stack when explicit
  topology is absent;
- make the missing input contract deterministic for
  `sideALeafGroup`, `cavity1DepthMm`, `sideBLeafGroup`,
  `frameBridgeClass`, `supportTopology`, and `supportSpacingMm`;
- keep thick board / panel / membrane Auto stacks from silently
  promoting into `lined_massive_wall`, screening mass-law, or guessed
  support topology;
- do not add source rows, retune formulas, or touch frontend/material
  editor implementation in this owner.

Acceptance:

- the owner contract proves explicit topology still calculates
  `Rw 46 / STC 46 / C -1 / Ctr -6.1` and field/building
  `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`;
- the same custom stack without topology remains
  `acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology`
  with the exact six missing physical inputs above;
- the same custom stack with explicit `topologyMode=double_leaf_framed`
  but incomplete fields remains
  `dynamic_calculator_route_input_contract_missing_physical_fields`,
  again with deterministic missing physical inputs rather than guessed
  support topology;
- unsafe auto-default support candidates remain rejected;
- current gate registration includes the previous coverage refresh, the
  post-user-material rerank, and this owner once implemented.

Closeout counters for this selected owner:
`inputSurfaceOwnerContractFilesTouched: 1`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Selected next action:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_PLAN_2026-06-12.md`

Selected next label:

`post-V1 next numeric coverage gap after user-material missing-topology input surface`
