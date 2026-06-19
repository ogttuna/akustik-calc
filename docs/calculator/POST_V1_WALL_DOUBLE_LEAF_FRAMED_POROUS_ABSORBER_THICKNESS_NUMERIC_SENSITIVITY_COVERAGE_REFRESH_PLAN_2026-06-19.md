# Post-V1 Wall Double-Leaf/Framed Porous Absorber Thickness Numeric Sensitivity Coverage Refresh - 2026-06-19

## Purpose

This no-runtime refresh follows the absorber-thickness numeric
sensitivity owner. Its job is to re-probe that
`advancedWall.cavities[].absorberThicknessMm` remains numerically active
in the owned double-leaf/framed porous cavity formula route without
retuning formulas or importing source rows.

Refresh action:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_plan`

Refresh file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts`

Previous owner:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous refresh status:

`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_absorber_thickness_numeric_sensitivity_owner`

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

`wall.double_leaf_framed.porous_absorber_thickness_numeric_sensitivity_owner`

## Coverage Scope

- Re-probe `absorberThicknessMm = 90`, `45`, and `20` lab pins.
- Re-probe thickness-sensitive field/building adapter values.
- Preserve no-thickness legacy behavior and required-input honesty.
- Preserve missing `flowResistivityPaSM2` and missing
  `supportSpacingMm` as `needs_input`.
- Preserve impact aliases as `unsupported`.
- Preserve direct-fixed double-leaf behavior on the existing
  direct-fixed owner.

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

Status:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_cavity_depth_numeric_sensitivity_owner`

Landed file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected candidate re-probed:

`wall.double_leaf_framed.porous_absorber_thickness_numeric_sensitivity_owner`

The refresh protects the runtime owner without retuning formulas:
`absorberThicknessMm = 90`, `45`, and `20` lab pins remain active,
field/building adapters still derive from the thickness-sensitive owned
lab curve, no-thickness input preserves legacy behavior and does not
name `absorberThicknessMm` as required, missing `flowResistivityPaSM2`
and missing `supportSpacingMm` stay `needs_input`, impact aliases stay
`unsupported`, and direct-fixed double-leaf remains on the existing
direct-fixed owner.

Landed counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Selected next:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`
/
`post-V1 wall double-leaf/framed cavity-depth numeric sensitivity owner`

The selected next owner stays in the same high-ROI user-material
physical input coverage stream. It should validate `cavity1DepthMm` /
`advancedWall.cavities[].depthMm` as a numerically active owned
mass-air-mass resonance and cavity-depth-credit input, while preserving
missing-depth `needs_input`, unsupported impact aliases, direct-fixed
ownership, and basis integrity. It is not a broad source crawl.
