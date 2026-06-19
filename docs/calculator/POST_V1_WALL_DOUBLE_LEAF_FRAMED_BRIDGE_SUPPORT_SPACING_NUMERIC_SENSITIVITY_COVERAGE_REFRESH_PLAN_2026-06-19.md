# Post-V1 Wall Double-Leaf/Framed Bridge Support-Spacing Numeric Sensitivity Coverage Refresh - 2026-06-19

## Purpose

This no-runtime refresh follows the support-spacing numeric sensitivity
owner. Its job is to re-probe that `studSpacingMm` / `supportSpacingMm`
remains numerically active in the owned double-leaf/framed bridge route
without retuning formulas or importing source rows.

Refresh action:

`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_plan`

Refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts`

Previous owner:

`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous selected refresh status:

`post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_bridge_support_spacing_numeric_sensitivity_owner`

Previous owner counters:

- `accuracyPromotedRequestShapes: 3`
- `accuracyPromotedTargetOutputs: 13`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 13`
- `runtimeFormulaRetunes: 1`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Selected candidate to re-probe:

`wall.double_leaf_framed.bridge_support_spacing_numeric_sensitivity_owner`

## Coverage Scope

- Re-probe `supportSpacingMm = 400`, `600`, and `1200` lab pins.
- Re-probe spacing-sensitive field/building adapter values.
- Preserve missing `supportSpacingMm` as `needs_input`.
- Preserve impact/ASTM aliases as `unsupported`.
- Preserve direct-fixed double-leaf behavior on the existing direct-fixed owner.

Expected counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

This is not a broad source crawl.

## Landed Closeout

Coverage refresh status:

`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_absorber_thickness_numeric_sensitivity_owner`

Landed coverage file:

`packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts`

The refresh re-probes the support-spacing owner without moving runtime
values: `400 mm` keeps lab `Rw/STC 45`, `600 mm` keeps `Rw/STC 46`,
and `1200 mm` keeps `Rw/STC 47`. Field/building adapters still derive
from the same owned lab curve; missing `supportSpacingMm` remains
`needs_input`; impact aliases remain `unsupported`; direct-fixed
double-leaf remains on the existing direct-fixed owner.

Coverage counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Selected next runtime action:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_plan`

Selected next runtime file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts`

Selected next runtime plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_THICKNESS_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`

Selected next runtime label:

`post-V1 wall double-leaf/framed porous absorber thickness numeric sensitivity owner`

Selection rationale: the double-leaf/framed route already captures
`advancedWall.cavities[].absorberThicknessMm`, and the route-input
contract lists `porousFillThicknessMm` as an optional precision field,
but runtime probing showed `90 mm`, `45 mm`, and `20 mm` absorber
thicknesses currently all return the same lab `Rw/STC 46`. That is an
inert physical input in a user-material formula route, so making it a
bounded damping input directly improves calculator accuracy and user
input coverage. This is not a broad source crawl.
