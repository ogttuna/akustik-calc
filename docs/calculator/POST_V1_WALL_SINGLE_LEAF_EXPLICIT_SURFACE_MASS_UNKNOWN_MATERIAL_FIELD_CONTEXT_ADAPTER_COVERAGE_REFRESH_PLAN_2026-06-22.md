# Post-V1 Wall Single-Leaf Explicit Surface-Mass Unknown-Material Field-Context Adapter Coverage Refresh Plan - 2026-06-22

Status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_landed_no_runtime_selected_building_context_adapter_owner`

## Purpose

This is the selected next no-runtime refresh after the single-leaf
explicit surface-mass unknown-material field-context adapter owner lands.
It must re-probe the complete field `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
and `DnT,A` outputs for project single-leaf and laminated project
single-leaf panels on the owned Gate I basis, while preserving missing
input, cavity/wrong-topology, building, ASTM, and impact boundaries.

This remains calculator work because it protects a newly promoted
formula/adapter route for user-entered project panels. It is not a broad
source crawl, UI polish pass, confidence-labeling task, or generic docs
cleanup.

Previous runtime owner:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-field-context-adapter-owner-contract.test.ts`
/
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_landed_runtime_selected_coverage_refresh`

Previous owner follows:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_coverage_refresh_landed_no_runtime_selected_field_context_adapter_owner`

Previous owner selected candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_field_context_adapter_owner`

Previous owner counters:
`accuracyPromotedRequestShapes: 2`,
`accuracyPromotedTargetOutputs: 10`,
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 10`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Selected coverage refresh action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-field-context-adapter-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_FIELD_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:
`post-V1 wall single-leaf explicit surface-mass unknown-material field-context adapter coverage refresh`

Coverage refresh status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_landed_no_runtime_selected_building_context_adapter_owner`

Selected next runtime owner action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_owner_plan`

Selected next runtime owner file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-context-adapter-owner-contract.test.ts`

Selected next runtime owner plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-22.md`

Selected next runtime owner label:
`post-V1 wall single-leaf explicit surface-mass unknown-material building-context adapter owner`

Selected next runtime owner candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_building_context_adapter_owner`

Successor runtime owner landed:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_owner_landed_runtime_selected_coverage_refresh`

Successor runtime owner counters:
`newCalculableLayerTemplates: 0`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 10`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 10`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Successor selected next action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_building_context_adapter_coverage_refresh_plan`

Successor selected next file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-building-context-adapter-coverage-refresh-contract.test.ts`

Successor selected next plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Successor selected next label:
`post-V1 wall single-leaf explicit surface-mass unknown-material building-context adapter coverage refresh`

## Selection Card

User construction / formula family:

- cavity-free project single-leaf panel or laminated project panel;
- positive user-supplied `surfaceMassKgM2`;
- positive `thicknessMm`;
- complete `field_between_rooms` context.

Target outputs to protect:

- field `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` for the project
  single panel;
- field `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` for the laminated
  project panel stack.

Route:

- owned single-leaf mass-law / banded lab curve;
- existing Gate I field-context adapter;
- no source rows and no formula retune.

Required physical inputs:

- `surfaceMassKgM2`;
- `thicknessMm`;
- `contextMode=field_between_rooms`;
- partition area or `panelWidthMm` / `panelHeightMm`;
- `receivingRoomVolumeM3`;
- `receivingRoomRt60S`.

`needs_input` / fail-closed behavior:

- missing mass remains outside;
- missing field inputs return `needs_input`;
- cavity/wrong-topology requests do not use the single-leaf owner.

`unsupported` boundaries:

- building-prediction outputs remain unsupported;
- impact and ASTM aliases remain unsupported.

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

This is not a broad source crawl. The support-only loop limit applies:
after this refresh, the next selected action should move runtime,
accuracy, or input-surface behavior unless a specific blocker prevents a
safe move.

## Implementation Steps

1. Add the no-runtime coverage refresh contract for the field-context
   adapter owner.
2. Pin complete field single-panel and laminated-panel values and basis.
3. Pin missing-input, cavity/wrong-topology, building, ASTM, and impact
   boundaries.
4. Add the refresh to the current gate runner.
5. Select the next high-ROI runtime calculator scope increment.
