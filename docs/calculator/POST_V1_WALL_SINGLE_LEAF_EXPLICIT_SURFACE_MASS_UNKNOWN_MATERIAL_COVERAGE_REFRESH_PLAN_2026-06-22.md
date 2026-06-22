# Post-V1 Wall Single-Leaf Explicit Surface-Mass Unknown-Material Coverage Refresh Plan - 2026-06-22

Status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_coverage_refresh_landed_no_runtime_selected_field_context_adapter_owner`

## Purpose

This is the selected next support pass after the single-leaf explicit
surface-mass unknown-material scope opener landed. It must be a
no-runtime regression refresh: re-probe the new lab `Rw`/`STC`/`C`/`Ctr`
request shapes, missing or non-positive `surfaceMassKgM2` boundaries,
cavity/wrong-topology exclusions, field/building non-promotion, and
impact unsupported boundaries without changing formulas or importing
source rows.

This remains calculator work because it protects a newly opened formula
route for user-entered project panels. It is not a UI polish pass,
broad source crawl, generic docs cleanup, or confidence-labeling
project.

Previous runtime owner:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-scope-opener-contract.test.ts`
/
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_landed_runtime_selected_coverage_refresh`

Previous owner follows:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_landed_no_runtime_selected_single_leaf_explicit_surface_mass_scope_opener`

Previous owner selected candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_scope_opener`

Previous owner counters:
`newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 8`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 8`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Selected coverage refresh action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:
`post-V1 wall single-leaf explicit surface-mass unknown-material coverage refresh`

Coverage refresh status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_coverage_refresh_landed_no_runtime_selected_field_context_adapter_owner`

Selected next runtime owner action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_plan`

Selected next runtime owner file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-field-context-adapter-owner-contract.test.ts`

Selected next runtime owner plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_FIELD_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-22.md`

Selected next runtime owner label:
`post-V1 wall single-leaf explicit surface-mass unknown-material field-context adapter owner`

Selected next runtime owner status after landing:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_owner_landed_runtime_selected_coverage_refresh`

Selected next runtime owner candidate after landing:
`wall.single_leaf.explicit_surface_mass_unknown_material_field_context_adapter_owner`

Selected next runtime owner counters after landing:
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

Selected next coverage refresh action after runtime owner:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_field_context_adapter_coverage_refresh_plan`

Selected next coverage refresh file after runtime owner:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-field-context-adapter-coverage-refresh-contract.test.ts`

Selected next coverage refresh plan after runtime owner:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_FIELD_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-22.md`

## Selection Card

User construction / formula family:

- single-leaf wall panel or laminated single-leaf panel;
- project/user material ids are not present in the catalog;
- each solid layer supplies positive `surfaceMassKgM2`;
- `thicknessMm` supplies geometry and sanity bounds.

Target outputs to protect:

- lab `Rw`, `STC`, `C`, and `Ctr` for the project panel stack;
- lab `Rw`, `STC`, `C`, and `Ctr` for the laminated/two-board stack.

Route:

- owned layer-combination resolver single-leaf mass-law / banded formula
  basis;
- ISO 717-1 `Rw`/`C`/`Ctr` and existing STC compatibility adapter from
  the calculated curve;
- no measured/source row import and no formula retune.

Required physical inputs:

- positive user-supplied `surfaceMassKgM2`;
- positive `thicknessMm`;
- cavity-free single visible leaf;
- explicit basis trace that the stiffness/coincidence family is a
  conservative default when no catalog density row exists.

`needs_input` / fail-closed behavior:

- missing or non-positive `surfaceMassKgM2` must not publish numeric
  lab values;
- unknown material without explicit mass remains a precise input problem
  rather than a source alias;
- cavity, framed, multileaf, and floor/impact requests must not use this
  single-leaf owner.

`unsupported` boundaries:

- `IIC`, `AIIC`, `Ln,w`, and other impact aliases remain `unsupported`;
- building-prediction outputs remain parked unless a later owned
  adapter explicitly accepts this project-material basis;
- field outputs may remain on the existing screening/field surface, but
  must not be promoted by this lab-only owner.

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
after this refresh, the selected field-context adapter owner is a
runtime/accuracy behavior move. It should promote complete field
`R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` requests for the same
project single-leaf explicit-mass basis out of `screening_fallback`
without opening building or impact aliases.

## Implementation Steps

1. Add a no-runtime coverage refresh contract that re-probes the single
   project panel and laminated project panel lab outputs through the
   owned basis.
2. Pin missing/zero `surfaceMassKgM2`, cavity/wrong-topology,
   field/building non-promotion, and impact unsupported boundaries.
3. Add the coverage refresh to the current gate runner.
4. Select the next high-ROI runtime calculator scope increment after
   this refreshed owner is protected.
