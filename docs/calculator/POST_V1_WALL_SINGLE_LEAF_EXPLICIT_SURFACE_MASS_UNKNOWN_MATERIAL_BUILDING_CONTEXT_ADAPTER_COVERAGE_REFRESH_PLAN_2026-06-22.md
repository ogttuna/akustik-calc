# Post-V1 Wall Single-Leaf Explicit Surface-Mass Unknown-Material Building-Context Adapter Coverage Refresh Plan - 2026-06-22

Status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_landed_no_runtime_selected_building_dntak_characteristic_adapter_owner`

## Purpose

This is the selected next no-runtime guard after the single-leaf
explicit surface-mass unknown-material building-context adapter owner.
It must re-probe the just-opened Gate AR building-prediction route so
complete project/user single-leaf and laminated single-leaf panels keep
calculating building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` from
the owned single-leaf mass-law / banded direct curve plus explicit
building context.

This is not a broad source crawl, UI polish pass, confidence-labeling
task, or generic docs cleanup. It protects a landed calculator behavior
that increased calculable request shapes and target outputs.

Previous runtime owner:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-context-adapter-owner-contract.test.ts`
/
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous owner follows:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_landed_no_runtime_selected_building_context_adapter_owner`

Selected candidate to re-probe:
`wall.single_leaf.explicit_surface_mass_unknown_material_building_context_adapter_owner`

Selected coverage refresh action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-context-adapter-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:
`post-V1 wall single-leaf explicit surface-mass unknown-material building-context adapter coverage refresh`

Selected next runtime owner:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`
/
`post-V1 wall single-leaf explicit surface-mass unknown-material building DnT,A,k characteristic adapter owner`

Selected next candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner`

Selected next status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected next counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 2`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 2`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Current selected next after the runtime owner:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`
/
`post-V1 wall single-leaf explicit surface-mass unknown-material building DnT,A,k characteristic adapter coverage refresh`

Previous owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 10`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 10`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selection Card

User construction / formula family:

- cavity-free project single-leaf panel or laminated project panel;
- positive user-supplied `surfaceMassKgM2`;
- positive `thicknessMm`;
- complete `building_prediction` context.

Target outputs to protect:

- building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` for the project
  single panel;
- building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` for the
  laminated project panel stack.

Route:

- owned single-leaf mass-law / banded calculated lab curve;
- Gate AR building-prediction adapter from base;
- explicit flanking/junction and room-standardization inputs.

Required physical inputs:

- positive user-supplied `surfaceMassKgM2`;
- positive `thicknessMm`;
- `contextMode=building_prediction`;
- partition area or `panelWidthMm` / `panelHeightMm`;
- `sourceRoomVolumeM3`;
- `receivingRoomVolumeM3`;
- `receivingRoomRt60S`;
- `flankingJunctionClass`;
- `conservativeFlankingAssumption`;
- `buildingPredictionOutputBasis`;
- `junctionCouplingLengthM`.

`needs_input` / fail-closed behavior:

- missing or non-positive `surfaceMassKgM2` must stay outside the owner;
- missing building context inputs must return precise `needs_input`;
- cavity, framed, double-leaf, floor, and non-single-leaf topology
  requests must not be rescued by this owner.

`unsupported` boundaries:

- `IIC`, `AIIC`, `Ln,w`, and other impact aliases remain unsupported;
- ASTM aliases remain outside this ISO building owner;
- exact measured/source rows and compatible anchors keep precedence when
  they truly match basis and construction.

Expected counters:

- `coverageRefreshContractFilesTouched: 1`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 0`;
- `runtimeValuesMoved 0`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Implementation Steps

1. Add a no-runtime coverage refresh contract for the building-context
   project single-leaf and laminated project single-leaf Gate AR pins.
2. Re-probe missing mass, missing building inputs, cavity/wrong
   topology, field-context separation, ASTM, and impact boundaries.
3. Select the `DnT,A,k` characteristic adapter owner as the next
   runtime-first action.
