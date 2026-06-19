# Post-V1 Wall Double-Leaf/Framed Porous Absorber Thickness Numeric Sensitivity Owner - 2026-06-19

## Purpose

Make `advancedWall.cavities[].absorberThicknessMm` numerically active
in the owned double-leaf/framed porous cavity formula route.

This is a calculator-runtime slice. The engine already accepts the
physical input and the input contract already treats porous fill
thickness as a precision field, but current runtime probing shows `90
mm`, `45 mm`, and `20 mm` absorber thicknesses all return the same lab
`Rw/STC 46`. That means a user can change a physically meaningful
absorber thickness and receive no numeric change.

Owner action:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts`

Previous refresh:

`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_absorber_thickness_numeric_sensitivity_owner`

Previous owner status before that refresh:

`post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous refresh selected candidate re-probed:

`wall.double_leaf_framed.bridge_support_spacing_numeric_sensitivity_owner`

Previous refresh counters:

- `coverageRefreshContractFilesTouched: 1`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Selected candidate:

`wall.double_leaf_framed.porous_absorber_thickness_numeric_sensitivity_owner`

## Selection Card

- User construction / formula family:
  explicit double-leaf/framed wall with two gypsum-board leaf groups,
  independent frames, a sealed porous cavity, user-supplied
  `flowResistivityPaSM2`, explicit `absorberCoverageRatio`, explicit
  `absorberThicknessMm`, and explicit `supportSpacingMm`.
- Target outputs:
  lab `Rw`, `STC`, `C`, `Ctr`; field/building companions `R'w`,
  `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A` where the existing adapters own
  the requested context.
- Formula route:
  existing double-leaf/framed mass-air-mass + bridge coupling + porous
  cavity damping route. This owner scales the porous damping credit by
  the absorber-thickness-to-cavity-depth fill ratio when numeric
  thickness is supplied. Unsupplied thickness preserves legacy behavior.
- Required physical inputs:
  existing route requirements plus `absorberThicknessMm` only when the
  advanced-wall cavity supplies it. Missing `flowResistivityPaSM2` and
  missing `supportSpacingMm` remain `needs_input`.
- Unsupported boundaries:
  impact aliases (`IIC`, `AIIC`) stay `unsupported`; direct-fixed
  double-leaf stays on the existing direct-fixed owner; no source rows
  are imported; no generic ASTM or metric aliasing is added.

## Expected Runtime Movement

- Full-depth `90/90 mm` absorber keeps the established baseline:
  lab `Rw/STC 46`, `C -1`, `Ctr -6.1`, field/building values derived
  from the same owned base curve.
- Half-depth `45/90 mm` absorber reduces porous damping credit and
  moves lab `Rw/STC` below the full-depth case.
- Thin `20/90 mm` absorber further reduces porous damping credit and
  moves field/building companions from the same owned base curve.
- No numeric `absorberThicknessMm` preserves current legacy behavior and
  does not add `absorberThicknessMm` to `requiredInputs`.

Expected counters:

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

## Implementation Steps

1. Add `absorberThicknessMm` to the double-leaf/framed bridge solver
   physical input contract by reading
   `advancedWall.cavities[0].absorberThicknessMm`.
2. Scale porous damping credit by `absorberThicknessMm / cavityDepthMm`
   when both are positive finite numbers; clamp the ratio to `[0, 1]`.
3. Include `absorberThicknessMm` in candidate-basis `requiredInputs`
   only when supplied.
4. Add an owner contract that pins full/half/thin lab values,
   field/building propagation, no-thickness legacy behavior,
   missing-input boundaries, and unsupported impact boundaries.
5. Update current-gate and live docs with the landed owner and selected
   coverage refresh.

This is not a broad source crawl.

## Landed Closeout

Owner status:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Landed owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts`

The owner makes `advancedWall.cavities[].absorberThicknessMm`
numerically active in the context-owned double-leaf/framed porous
damping route. Full-depth `90 mm` in a `90 mm` cavity keeps lab
`Rw/STC 46`, `C -1`, and `Ctr -6.1`; half-depth `45 mm` returns lab
`Rw/STC 44`; thin `20 mm` returns lab `Rw/STC 43`. Field/building
adapters move from the same owned base curve. No-thickness input
preserves legacy behavior and does not add `absorberThicknessMm` to
`requiredInputs`. Missing `flowResistivityPaSM2` and missing
`supportSpacingMm` remain `needs_input`; impact aliases remain
`unsupported`.

Owner counters:

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

Selected next action:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts`

Selected next plan:

`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_THICKNESS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md`

Selected next label:

`post-V1 wall double-leaf/framed porous absorber thickness numeric sensitivity coverage refresh`

This is not a broad source crawl.
