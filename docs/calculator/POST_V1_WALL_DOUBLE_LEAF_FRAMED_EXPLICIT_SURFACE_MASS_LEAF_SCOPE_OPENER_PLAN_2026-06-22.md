# Post-V1 Wall Double-Leaf/Framed Explicit Surface-Mass Leaf Scope Opener Plan - 2026-06-22

Status:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_landed_runtime_selected_coverage_refresh`

## Purpose

This runtime owner opens a real calculator scope gap after the
frequency-backbone coverage refresh. It lets the owned Gate S / Gate I /
Gate AR double-leaf/framed route calculate explicit side-leaf stacks
when the user supplies `surfaceMassKgM2` directly, even when the leaf
material has no catalog density row. This is calculator scope expansion,
not a source crawl, UI polish pass, or generic library change.

Previous refresh:
`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-frequency-backbone-numeric-sensitivity-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_explicit_surface_mass_leaf_scope_opener`

Previous refresh counters:
`coverageRefreshContractFilesTouched: 1`,
`newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`,
`runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`. This is not a broad source
crawl.

Previous frequency-backbone owner status:
`post_v1_wall_double_leaf_framed_frequency_backbone_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous frequency-backbone owner selected candidate:
`wall.double_leaf_framed.frequency_backbone_numeric_sensitivity_owner`

Owner action:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_scope_opener_plan`

Owner file:
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-scope-opener-contract.test.ts`

Owner plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_SCOPE_OPENER_PLAN_2026-06-22.md`

Owner candidate:
`wall.double_leaf_framed.explicit_surface_mass_leaf_scope_opener`

Selected next action:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_plan`

Selected next file:
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`

Selected next plan doc:
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_EXPLICIT_SURFACE_MASS_LEAF_COVERAGE_REFRESH_PLAN_2026-06-22.md`

Selected next label:
`post-V1 wall double-leaf/framed explicit surface-mass leaf coverage refresh`

Selected coverage refresh closeout:
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-explicit-surface-mass-leaf-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_explicit_surface_mass_leaf_coverage_refresh_landed_no_runtime_selected_single_leaf_explicit_surface_mass_scope_opener`.

Coverage refresh counters: `coverageRefreshContractFilesTouched: 1`,
`newCalculableLayerTemplates: 0`, `newCalculableRequestShapes: 0`,
`newCalculableTargetOutputs: 0`, `runtimeBasisPromotions: 0`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.
This is not a broad source crawl.

Selected next runtime action:
`post_v1_wall_single_leaf_explicit_surface_mass_unknown_material_scope_opener_plan`
/
`packages/engine/src/post-v1-wall-single-leaf-explicit-surface-mass-unknown-material-scope-opener-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_SINGLE_LEAF_EXPLICIT_SURFACE_MASS_UNKNOWN_MATERIAL_SCOPE_OPENER_PLAN_2026-06-22.md`
/
`post-V1 wall single-leaf explicit surface-mass unknown-material scope opener`.

## Selection Card

User construction / formula family:

- double-leaf/framed wall with explicit side A and side B leaf groups;
- leaf layers may use project material ids that are not in the catalog;
- each leaf supplies `surfaceMassKgM2` directly;
- cavity depth, porous damping, independent-frame topology, and support
  spacing are explicit.

Target outputs opened:

- lab `Rw`, `STC`, `C`, and `Ctr`;
- field/building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`.

Route:

- existing Gate S mass-air-mass / bridge / porous damping formula
  route;
- existing Gate I field adapter;
- existing Gate AR building adapter;
- no measured/source rows and no formula retune.

Required physical inputs:

- `sideALeafGroup`, `sideBLeafGroup`;
- `surfaceMassKgM2` for each explicit side leaf when catalog density is
  unavailable;
- `cavity1DepthMm`;
- `flowResistivityPaSM2`;
- `absorberCoverageRatio` and `absorberThicknessMm` when supplied by
  advanced wall context;
- `frameBridgeClass`, `supportTopology`, `supportSpacingMm`;
- field/building geometry and room context for field/building outputs.

`needs_input` behavior:

- missing side leaf `surfaceMassKgM2` stays `needs_input`;
- known `gap` or `insulation` materials remain outside side-leaf mass
  ownership even if a surface mass is accidentally supplied;
- missing cavity depth, flow resistivity, or support spacing stays
  `needs_input`.

`unsupported` boundaries:

- `IIC`, `AIIC`, and other impact aliases remain `unsupported`;
- lab values are not copied into field/building outputs;
- unknown material names are not used to infer density, stiffness, or
  absorber properties.

Expected / landed counters:

- `newCalculableLayerTemplates: 1`;
- `newCalculableRequestShapes: 3`;
- `newCalculableTargetOutputs: 14`;
- `runtimeBasisPromotions: 3`;
- `runtimeValuesMoved 14`;
- `runtimeFormulaRetunes: 0`;
- `sourceRowsImported: 0`;
- `frontendImplementationFilesTouched: 0`.

This is not a broad source crawl.

## Runtime Closeout

The owner landed with shared request intake accepting optional
`surfaceMassKgM2` on `LayerInput`. The double-leaf/framed bridge solver
now uses explicit positive `surfaceMassKgM2` for side-leaf mass before
falling back to catalog density, while preserving known `gap` and
`insulation` exclusions. Unknown material ids without surface mass
remain outside the route.
