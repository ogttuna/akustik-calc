# Post-V1 Wall Double-Leaf/Framed Explicit Surface-Mass Leaf Coverage Refresh Plan - 2026-06-22

Status:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_landed_no_runtime_selected_single_leaf_explicit_surface_mass_scope_opener`

## Purpose

This is the selected next support pass after the explicit surface-mass
leaf scope opener landed. It must be a no-runtime regression refresh:
re-probe the new `surfaceMassKgM2` request shapes, missing-input
honesty, known insulation/gap exclusions, field/building adapters, and
impact unsupported boundaries without changing formulas or importing
source rows.

Previous owner:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_landed_runtime_selected_coverage_refresh`

Previous owner follows:
`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_explicit_surface_mass_leaf_scope_opener`

Previous owner selected candidate:
`wall.double_leaf_framed.explicit_surface_mass_leaf_scope_opener`

Previous owner counters: `newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 3`, `newCalculableTargetOutputs: 14`,
`runtimeBasisPromotions: 3`, `runtimeValuesMoved 14`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Selected coverage refresh action:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_plan`

Selected coverage refresh file:
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`

Selected coverage refresh plan:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected coverage refresh label:
`post-V1 wall double-leaf/framed explicit surface-mass leaf coverage refresh`

Selected next runtime action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_plan`

Selected next runtime file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-scope-opener-contract.test.ts`

Selected next runtime plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_SCOPE_OPENER_PLAN_2026-06-22.md`

Selected next runtime label:
`post-V1 wall single-leaf explicit surface-mass unknown-material scope opener`

Selected next candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_scope_opener`

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
after this refresh, the selected next action moves a runtime calculator
behavior by opening unknown-material single-leaf wall panels with
explicit `surfaceMassKgM2` onto an owned single-leaf formula route.
