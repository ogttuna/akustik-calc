# Post-V1 Wall Single-Leaf Explicit Surface-Mass Unknown-Material Field-Context Adapter Owner Plan - 2026-06-22

Status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_landed_runtime_selected_coverage_refresh`

## Purpose

This is the selected next runtime calculator slice after the
single-leaf explicit surface-mass unknown-material coverage refresh. It
must move complete field-context `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and
`DnT,A` requests for project/user single-leaf panels from diagnostic
`screening_fallback` to an owned field adapter based on the already
landed single-leaf mass-law / banded lab curve.

This is calculator scope and accuracy work. It is not a broad source
crawl, UI polish pass, confidence-labeling task, or generic docs
cleanup.

Previous no-runtime refresh:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-coverage-refresh-contract.test.ts`
/
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_coverage_refresh_landed_no_runtime_selected_field_context_adapter_owner`

Previous no-runtime refresh re-probed:
`wall.single_leaf.explicit_surface_mass_unknown_material_scope_opener`

Previous no-runtime refresh counters:
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

Previous runtime owner:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-scope-opener-contract.test.ts`
/
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_landed_runtime_selected_coverage_refresh`

Selected runtime owner action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_plan`

Selected runtime owner file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-field-context-adapter-owner-contract.test.ts`

Selected runtime owner plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_FIELD_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-22.md`

Selected runtime owner label:
`post-V1 wall single-leaf explicit surface-mass unknown-material field-context adapter owner`

Owner status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_landed_runtime_selected_coverage_refresh`

Owner candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_field_context_adapter_owner`

Selected coverage refresh action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-field-context-adapter-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_FIELD_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:
`post-V1 wall single-leaf explicit surface-mass unknown-material field-context adapter coverage refresh`

Selected coverage refresh status after landing:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_landed_no_runtime_selected_building_context_adapter_owner`

Selected coverage refresh counters after landing:
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

Selected next runtime owner action after coverage refresh:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_owner_plan`

Selected next runtime owner file after coverage refresh:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-context-adapter-owner-contract.test.ts`

Selected next runtime owner plan after coverage refresh:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-22.md`

## Selection Card

User construction / formula family:

- cavity-free single-leaf wall panel or laminated single-leaf panel;
- project/user material ids are not present in the catalog;
- each solid layer supplies positive `surfaceMassKgM2`;
- `thicknessMm` supplies geometry and sanity bounds;
- complete field context supplies element area / room absorption inputs.

Target outputs to open or promote:

- field `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` for the single
  project panel;
- field `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` for the laminated
  project panel stack.

Route:

- use the already owned layer-combination resolver single-leaf
  mass-law / banded calculated lab curve as the direct separating
  element basis;
- adapt through the existing Gate I field-context runtime math for
  partition area, receiving-room volume, and reverberation time;
- do not import source rows and do not retune the lab formula.

Required physical inputs:

- positive user-supplied `surfaceMassKgM2`;
- positive `thicknessMm`;
- cavity-free single visible leaf;
- `contextMode=field_between_rooms`;
- partition area from `panelWidthMm` and `panelHeightMm`;
- `receivingRoomVolumeM3`;
- `receivingRoomRt60S`;
- field adapter basis trace from the owned calculated lab TL curve.

`needs_input` / fail-closed behavior:

- missing or non-positive `surfaceMassKgM2` must remain outside the
  owner;
- missing area, receiving-room volume, or RT must return precise
  field-context `needs_input`;
- unknown material without explicit mass remains an input problem;
- cavity, framed, multileaf, and double-leaf topology intent must not
  be rescued by this owner.

`unsupported` boundaries:

- building-prediction outputs remain blocked until a later building
  adapter owner accepts this project-material basis;
- `IIC`, `AIIC`, `Ln,w`, and other impact aliases remain unsupported;
- ASTM aliases remain outside this ISO field-context owner.

Expected counters:

- `accuracyPromotedRequestShapes: 2`;
- `accuracyPromotedTargetOutputs: 10`;
- `newCalculableLayerTemplates: 0`;
- `newCalculableRequestShapes: 0`;
- `newCalculableTargetOutputs: 0`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved 10`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.

## Implementation Steps

1. Add a runtime owner contract for complete field-context project
   single-leaf and laminated project single-leaf stacks with explicit
   `surfaceMassKgM2`.
2. Route eligible field requests through the owned single-leaf
   mass-law / banded basis plus Gate I field adapter instead of the
   screening fallback.
3. Preserve missing mass, missing field inputs, cavity/wrong topology,
   building-prediction, ASTM, and impact boundaries.
4. Add the runtime owner contract to the current gate runner.
5. Update the live calculator docs with landed counters and select the
   next bounded runtime or coverage action according to support-loop
   rules.
