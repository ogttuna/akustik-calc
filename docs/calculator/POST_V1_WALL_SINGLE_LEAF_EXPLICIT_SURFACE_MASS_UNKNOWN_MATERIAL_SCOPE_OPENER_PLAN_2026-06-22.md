# Post-V1 Wall Single-Leaf Explicit Surface-Mass Unknown-Material Scope Opener Plan - 2026-06-22

Status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_landed_runtime_selected_coverage_refresh`

## Purpose

This selected runtime slice follows the double-leaf/framed explicit
surface-mass coverage refresh. The high-ROI gap is now single-leaf wall
panels whose material id is not in the catalog but whose physical
`surfaceMassKgM2` is supplied by the user. Today these stacks can return
a diagnostic `screening_fallback`; the next calculator improvement is to
move the safe subset onto an owned single-leaf mass-law / banded formula
route with explicit required inputs and basis labels.

This is calculator scope expansion. It is not a UI polish pass, broad
source crawl, generic docs cleanup, or confidence-labeling project.

Previous coverage refresh:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_landed_no_runtime_selected_single_leaf_explicit_surface_mass_scope_opener`

Previous coverage refresh follows:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_landed_runtime_selected_coverage_refresh`

Previous coverage refresh selected candidate:
`wall.double_leaf_framed.explicit_surface_mass_leaf_scope_opener`

Previous coverage refresh counters:
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

Selected runtime action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_plan`

Selected runtime file:
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-scope-opener-contract.test.ts`

Selected runtime plan:
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_SCOPE_OPENER_PLAN_2026-06-22.md`

Selected runtime label:
`post-V1 wall single-leaf explicit surface-mass unknown-material scope opener`

Selected candidate:
`wall.single_leaf.explicit_surface_mass_unknown_material_scope_opener`

Owner status:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_landed_runtime_selected_coverage_refresh`

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

Coverage refresh counters:
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

Owner counters:
`newCalculableLayerTemplates: 1`,
`newCalculableRequestShapes: 2`,
`newCalculableTargetOutputs: 8`,
`runtimeBasisPromotions: 2`,
`runtimeValuesMoved 8`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

## Selection Card

User construction / formula family:

- single-leaf wall panel or laminated single-leaf panel;
- material id is project/user supplied and not present in the catalog;
- user supplies `surfaceMassKgM2` directly;
- thickness is still required for layer geometry and sanity bounds.

Target outputs to open:

- first runtime slice: lab `Rw`, `STC`, `C`, and `Ctr`;
- field/building outputs remain out unless an owned adapter path is
  explicitly added in a later slice.

Route:

- existing source-absent single-leaf mass-law / banded formula family;
- existing ISO 717-1 and ASTM E413 rating adapters where a calculated
  curve is owned;
- no measured/source row import and no broad formula retune.

Required physical inputs:

- `surfaceMassKgM2`;
- `thicknessMm`;
- a route-safe single-leaf family classification derived from explicit
  topology or a conservative default for project panel leaves;
- critical-frequency or stiffness assumption must be explicit in the
  basis trace when a default is used.

`needs_input` behavior:

- missing or non-positive `surfaceMassKgM2` stays `needs_input`;
- unknown material without explicit single-leaf panel intent stays
  `needs_input` or fail-closed rather than becoming a generic source
  alias;
- missing critical-frequency/stiffness input must either be prompted or
  represented as an explicit conservative default in the basis trace.

`unsupported` boundaries:

- `IIC`, `AIIC`, `Ln,w`, and other impact aliases remain
  `unsupported`;
- field/building outputs are not copied from lab values;
- multi-leaf, cavity, framed, or floor stacks must not be routed through
  this single-leaf owner.

Expected counters:

- `newCalculableLayerTemplates: 1`;
- `newCalculableRequestShapes: 2`;
- `newCalculableTargetOutputs: 8`;
- `runtimeBasisPromotions: 2`;
- `runtimeValuesMoved 8`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

## Implementation Steps

1. Add a runtime owner contract for one project unknown single-leaf panel
   and one laminated/two-board single-leaf stack with explicit
   `surfaceMassKgM2`.
2. Route the safe subset away from `screening_fallback` and into the
   owned single-leaf mass-law / banded formula basis.
3. Expose required inputs, assumptions, and curve/rating provenance in
   `airborneBasis`.
4. Preserve fail-closed behavior for missing mass, wrong topology,
   floor/impact requests, and field/building aliases.
5. Add focused tests first, then code changes only inside the calculator
   route and input-boundary surface needed for this scope opener.
