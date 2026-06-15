# Post-V1 Wall Double-Leaf/Framed User-Material Route-Input Owner Plan - 2026-06-12

## North Star

DynEcho is an acoustic calculator. User-added materials must become
usable calculator inputs when they carry the physical properties required
by an owned formula route. This slice keeps exact measured/source rows
first, but when no exact row exists it lets a user-supplied
`panel_leaf / porous_absorber / panel_leaf` double-leaf stack calculate
through the existing source-absent double-leaf/framed formula corridor
instead of falling to `needs_input` or screening.

This is not a broad source crawl and not material-editor UI work.

## Previous Rerank

Previous rerank action:

`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan`

Previous rerank file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts`

Previous rerank status:

`post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_landed_no_runtime_selected_user_material_double_leaf_route_input_owner`

Selected candidate:

`wall.double_leaf_framed.user_material_route_input_owner`

The rerank ran `roiAnalysisIterations: 3` and selected this owner because
direct-fixed lab/base/A-weighted rows and default-catalog double-leaf
lab/field/building rows were already closed, while custom user materials
with density, acoustic behavior, absorber class, and flow resistivity
still lost catalog ownership before the double-leaf/framed formula route.

Rerank counters: `candidateCount 8`,
`closedDirectFixedAWeightedRowsRechecked: 6`,
`closedDirectFixedBaseAndLabRowsRechecked: 9`,
`closedNonDirectDoubleLeafRowsRechecked: 9`,
`userMaterialBoundaryRowsRechecked: 3`,
`estimatedNextCalculableRequestShapes: 3`,
`estimatedNextRuntimeValuesMoved: 12`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Runtime Work

Owner action:

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts`

Owner status:

`post_v1_wall_double_leaf_framed_user_material_route_input_owner_landed_runtime_selected_coverage_refresh`

Implementation:

- `calculateAssembly` passes the merged material catalog into the
  dynamic candidate resolver;
- the dynamic candidate resolver passes that catalog into topology
  normalization and route-input assessment;
- Gate Q and Gate R double-leaf/framed input/solver contracts consume
  `ResolvedLayer.material` and `ResolvedLayer.surfaceMassKgM2` when the
  caller has already resolved user-supplied catalog materials;
- no formula coefficients, measured rows, error-budget constants, or
  source precedence rules are changed.

Runtime values moved:

- custom explicit double-leaf/framed element-lab request now calculates
  `Rw 46 / STC 46 / C -1 / Ctr -6.1` through
  `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`;
- the same custom base curve now feeds field and building adapters for
  `R'w 40 / Dn,w 41 / Dn,A 39.5 / DnT,w 43 / DnT,A 41.9`;
- unknown custom material IDs without a supplied catalog still fail as
  unknown materials;
- ASTM/IIC/AIIC and impact outputs remain outside this airborne owner.

Counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 12`,
`runtimeBasisPromotions: 3`, `runtimeValuesMoved 12`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`,
`frontendImplementationFilesTouched: 0`,
`webSurfaceParityContractFilesTouched: 0`.

## Guardrails

- Do not use material names as special-case route switches. The owner is
  based on catalog-resolved physical properties and explicit topology.
- Keep exact/source/anchor rows ahead of formula routes.
- Keep unknown custom materials unsupported until their catalog
  definitions are supplied.
- Keep metric bases separate: lab `Rw/STC/C/Ctr`, field/building
  `R'w/Dn,w/Dn,A/DnT,w/DnT,A`, ASTM/IIC/AIIC, and impact outputs must
  not alias each other.
- Preserve the thick-board auto-family guard: generic board/panel leaves
  must not silently become massive substrates by mass threshold alone.

## Selected Next

Selected next action:

`post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts`

Selected next plan doc:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_ROUTE_INPUT_COVERAGE_REFRESH_PLAN_2026-06-12.md`

Selected next label:

`post-V1 wall double-leaf/framed user-material route-input coverage refresh`

The next step should freeze the owner in resolver registry, coverage
matrix, and company-internal V0 without moving new runtime values.
