# Post-V1 Next Numeric Coverage Gap After User-Material Missing-Topology Input Surface Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. The user-material double-leaf/framed
route now has two separate postures: explicit topology calculates, and
missing topology produces a precise `needs_input` boundary instead of a
guessed support default. The next calculator action is to rerank numeric
coverage gaps from that new baseline and select the highest-ROI runtime
or input-surface slice.

This is not a broad source crawl, not material-editor UI work, not a
catalog-management task, and not a formula retune by default. It exists
only to choose the next value-moving or route-input owner after the
user-material missing-topology boundary is closed.

## Previous Owner

Previous rerank action:

`post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_route_input_landed_no_runtime_selected_user_material_missing_topology_input_surface_owner`

Previous selected action:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan`

Previous selected file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts`

Previous status:

`post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap`

Previous selected candidate:

`wall.double_leaf_framed.user_material_missing_topology_input_surface_owner`

The owner pins the custom user-material
`panel_leaf / porous_absorber / panel_leaf` route so explicit topology
still calculates lab `Rw 46 / STC 46 / C -1 / Ctr -6.1` and
field/building `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 /
DnT,A 41.9`, while missing topology stays on
`acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology`
with `sideALeafGroup`, `cavity1DepthMm`, `sideBLeafGroup`,
`frameBridgeClass`, `supportTopology`, and `supportSpacingMm`.

Counters: `inputSurfaceOwnerContractFilesTouched: 1`,
`estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Landed Rerank

Landed action:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`

Landed file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`

Landed plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_PLAN_2026-06-12.md`

Landed status:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`

Selected candidate:

`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`

Selected next action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_OWNER_PLAN_2026-06-12.md`

Selected next label:

`post-V1 wall double-leaf/framed user-material porous flow-resistivity input owner`

Previous selected label:

`post-V1 next numeric coverage gap after user-material missing-topology input surface`

The rerank selection rules were:

- subtract the closed compatible anchor-delta, direct-fixed,
  default-catalog double-leaf/framed, explicit user-material, and
  user-material missing-topology input-surface lanes;
- prefer a runtime or route-input slice that increases calculator scope
  or accuracy for arbitrary user-built layer stacks;
- keep `needs_input` / `unsupported` boundaries intact for missing
  metric basis, missing topology, ASTM/IIC/AIIC aliases, unsupported
  impact outputs, and unknown material IDs;
- reject material-editor UI, catalog CRUD, source-row crawling, and
  report polish as calculator-engine next slices unless they unlock a
  named formula route or owned calibration/holdout;
- do at least two ROI iterations before selecting the next owner.

The rerank ran `roiAnalysisIterations: 3`. It selected the porous
flow-resistivity owner because the existing double-leaf/framed formula
route lists `absorberFlowResistivityOrDefault` as a required input, and
user-supplied porous absorbers without a numeric `flowResistivityPaSM2`
must not publish with the same budget/default posture as fully supplied
materials.

Counters: `candidateCount 10`,
`closedCompatibleAnchorDeltaRowsRechecked: 12`,
`closedDefaultCatalogDoubleLeafRowsRechecked: 9`,
`closedDirectFixedRowsRechecked: 24`,
`closedUserMaterialExplicitRuntimeRowsRechecked: 3`,
`closedUserMaterialMissingTopologyRowsRechecked: 4`,
`flowResistivityRiskRowsRechecked: 3`,
`estimatedNextAccuracyBoundaryRowsMoved: 2`,
`estimatedNextRuntimeValuesMoved: 0`,
`estimatedFollowOnRuntimeValuesProtectedAfterInputCapture: 12`,
`immediateRuntimeValuesMoved: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.
