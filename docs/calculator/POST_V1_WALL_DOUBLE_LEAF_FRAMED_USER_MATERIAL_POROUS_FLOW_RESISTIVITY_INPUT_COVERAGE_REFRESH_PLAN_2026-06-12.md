# Post-V1 Wall Double-Leaf/Framed User-Material Porous Flow-Resistivity Input Coverage Refresh Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. The porous flow-resistivity input
owner protects the double-leaf/framed wall route from publishing porous
damping for user-created absorbers unless the route-required
`flowResistivityPaSM2` is physically owned or an explicit engineering
default is adopted.

This coverage refresh is the next bounded no-runtime follow-up. It
should prove that the owner remains wired through resolver selection,
runtime surface, input completeness, docs, and current gate registration.
It is not a broad source crawl, not material-editor UI work, not catalog
CRUD, and not a formula retune.

## Previous Owner

Previous rerank action:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner`

Owner action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts`

Owner status:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner`

The owner moves no published numeric values and retunes no formula. It
preserves numeric user-supplied porous flow, preserves explicit
engineering-default flow with widened budget, accepts context-owned
absorber flow, and parks user-supplied or unknown porous absorbers with
missing `flowResistivityPaSM2` at `needs_input`.

Counters: `accuracyBoundaryRowsMoved: 2`,
`needsInputBoundaryRowsAdded: 1`, `newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selected Work

Selected action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`

Selected file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`

Selected plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md`

Selected label:

`post-V1 wall double-leaf/framed user-material porous flow-resistivity input coverage refresh`

## Refresh Rules

- Re-probe explicit user-supplied numeric
  `flowResistivityPaSM2`: lab must remain `Rw 46 / STC 46 / C -1 /
  Ctr -6.1` with `runtimeValuesMoved 0`.
- Re-probe explicit engineering-default flow: lab must remain
  `Rw 45 / STC 45 / C -1 / Ctr -6.1` with
  `propertyDefaults` for `porousFill.flowResistivityPaSM2` and the
  widened budget.
- Re-probe context-owned absorber flow: missing material-level flow may
  calculate only when `advancedWall.cavities[0].absorberFlowResistivityPaSM2`
  is positive and finite.
- Re-probe missing user-supplied or unknown porous absorber flow: lab,
  field, and building requests must return `needs_input` for
  `flowResistivityPaSM2`, supported outputs must be empty, and requested
  outputs must be parked as unsupported.
- Preserve missing topology, unknown custom material, ASTM/IIC/AIIC,
  impact-output, lab/field/building metric-basis, thick-board Auto
  family, and non-user-material route boundaries.
- Do not import source rows, retune the double-leaf formula, widen to
  triple-leaf, or touch frontend/material-editor implementation files in
  this refresh.

## Expected Counters

Expected refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

## Landed Status

Landed action:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan`

Landed file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts`

Landed status:

`post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap`

The refresh re-probes numeric user-supplied porous flow, explicit
engineering-default flow, context-owned absorber flow, and missing
user/unknown `flowResistivityPaSM2` for lab, field, and building bases.
It keeps missing flow at `needs_input`, moves no runtime values, imports
no source rows, retunes no formula, and touches no frontend
implementation files. This is not a broad source crawl.

Selected next action:

`post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_PLAN_2026-06-12.md`

Selected next label:

`post-V1 next numeric coverage gap after user-material porous flow-resistivity input`
