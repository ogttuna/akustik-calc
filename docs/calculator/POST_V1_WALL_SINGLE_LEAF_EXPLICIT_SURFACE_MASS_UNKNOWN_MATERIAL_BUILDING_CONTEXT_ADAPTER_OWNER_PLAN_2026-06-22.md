# Post-V1 Wall Single-Leaf Explicit Surface-Mass Unknown-Material Building-Context Adapter Owner Plan - 2026-06-22

Status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This is the selected next runtime calculator slice after the
single-leaf explicit surface-mass unknown-material field-context adapter
coverage refresh. It must move complete `building_prediction` requests
for project/user single-leaf panels from unsupported to the owned Gate
AR building-prediction adapter based on the already owned single-leaf
mass-law / banded lab curve.

This is calculator scope work. It is not a broad source crawl, UI polish
pass, confidence-labeling task, or generic docs cleanup.

Previous no-runtime refresh:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-field-context-adapter-coverage-refresh-contract.test.ts`
/
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_landed_no_runtime_selected_building_context_adapter_owner`

Previous refresh re-probed:
`wall.single_leaf.explicit_surface_mass_unknown_material_field_context_adapter_owner`

Previous refresh follows:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Selected runtime owner action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_owner_plan`

Selected runtime owner file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-context-adapter-owner-contract.test.ts`

Selected runtime owner plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-22.md`

Selected runtime owner label:
`post-V1 wall single-leaf explicit surface-mass unknown-material building-context adapter owner`

Selected runtime owner candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_building_context_adapter_owner`

Selected next action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-context-adapter-coverage-refresh-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:
`post-V1 wall single-leaf explicit surface-mass unknown-material building-context adapter coverage refresh`

Selected next coverage refresh landed status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_landed_no_runtime_selected_building_dntak_characteristic_adapter_owner`

Selected follow-up runtime owner:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_dntak_characteristic_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-dntak-characteristic-adapter-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_DNTAK_CHARACTERISTIC_ADAPTER_OWNER_PLAN_2026-06-22.md`
/
`post-V1 wall single-leaf explicit surface-mass unknown-material building DnT,A,k characteristic adapter owner`

Selected next coverage refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Landed runtime behavior:

- complete `building_prediction` requests for the project single panel
  now calculate `R'w 30`, `Dn,w 31`, `Dn,A 32.8`, `DnT,w 33`, and
  `DnT,A 35.2` through Gate AR from the owned single-leaf mass-law /
  banded direct curve;
- complete `building_prediction` requests for the laminated project
  panel now calculate `R'w 29`, `Dn,w 30`, `Dn,A 31.2`, `DnT,w 32`,
  and `DnT,A 33.6` through the same owned route;
- missing mass and missing building inputs stay `needs_input` or
  fail-closed, cavity/wrong-topology is not rescued, and impact aliases
  stay unsupported.

## Selection Card

User construction / formula family:

- cavity-free project single-leaf panel or laminated project panel;
- positive user-supplied `surfaceMassKgM2`;
- positive `thicknessMm`;
- complete `building_prediction` context.

Target outputs to open:

- building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` for the project
  single panel;
- building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` for the
  laminated project panel stack.

Route:

- owned single-leaf mass-law / banded calculated lab curve as the
  direct separating element;
- existing Gate AR ISO 12354-1 building-prediction adapter from base;
- explicit flanking/junction and room-standardization inputs;
- no source rows and no formula retune.

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
- `junctionCouplingLengthM`;
- Gate AR direct curve, flanking path, junction vibration reduction, room
  absorption normalization, and uncertainty budget owners.

`needs_input` / fail-closed behavior:

- missing or non-positive `surfaceMassKgM2` must stay outside the
  owner;
- missing building context inputs must return precise `needs_input`;
- cavity, framed, double-leaf, floor, and non-single-leaf topology
  requests must not be rescued by this owner.

`unsupported` boundaries:

- `IIC`, `AIIC`, `Ln,w`, and other impact aliases remain unsupported;
- ASTM aliases remain outside this ISO building owner;
- exact measured/source rows and compatible anchors keep precedence
  when they truly match basis and construction.

Expected counters:

- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 10`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved 10`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.

## Implementation Steps

1. Add a runtime owner contract for complete building-context project
   single-leaf and laminated project single-leaf stacks with explicit
   `surfaceMassKgM2`.
2. Route eligible building requests through the owned single-leaf
   mass-law / banded basis plus Gate AR building prediction instead of
   the current unsupported corridor.
3. Preserve missing mass, missing building inputs, cavity/wrong
   topology, ASTM, and impact boundaries.
4. Add the runtime owner contract to the current gate runner.
5. Update live calculator docs with landed counters and select the next
   bounded coverage or runtime action according to support-loop rules.
