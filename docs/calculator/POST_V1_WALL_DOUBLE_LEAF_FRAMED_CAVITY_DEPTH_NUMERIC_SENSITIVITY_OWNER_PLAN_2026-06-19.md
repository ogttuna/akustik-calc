# Post-V1 Wall Double-Leaf/Framed Cavity-Depth Numeric Sensitivity Owner - 2026-06-19

## Purpose

This runtime owner follows the absorber-thickness coverage refresh. Its
job is to keep the same calculator-first physical-input campaign moving
by validating and, if necessary, correcting `cavity1DepthMm` /
`advancedWall.cavities[].depthMm` as a numerically active owned formula
input for double-leaf/framed wall calculations.

Owner action:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts`

Previous refresh:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts`
/
`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_cavity_depth_numeric_sensitivity_owner`

Previous owner status:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Previous candidate re-probed:

`wall.double_leaf_framed.porous_absorber_thickness_numeric_sensitivity_owner`

## Selection Card

- User construction / formula family: context-owned double-leaf/framed
  wall with two gypsum leaves, independent frames, porous absorptive
  cavity, explicit flow resistivity, support spacing, absorber coverage,
  absorber thickness, and cavity depth.
- Target outputs to protect/open: lab `Rw`, `STC`, `C`, `Ctr`, plus
  field/building companions `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`
  when the adapters are requested.
- Route: owned Gate R / Gate S double-leaf/framed bridge mass-air-mass
  formula route. `cavityDepthMm` enters both
  `massAirMassResonanceHz` and the bounded cavity-depth credit.
- Required physical inputs: `sideALeafMassKgM2`, `sideBLeafMassKgM2`,
  `cavity1DepthMm`, `flowResistivityPaSM2`,
  `absorberCoverageRatio` when supplied, `absorberThicknessMm` when
  supplied, `frameBridgeClass`, `supportTopology`, and
  `supportSpacingMm`.
- `needs_input` behavior: missing or non-positive cavity depth must
  remain `needs_input` instead of guessing a default physical depth.
  Missing `flowResistivityPaSM2` and missing `supportSpacingMm` must
  remain owned `needs_input` boundaries.
- `unsupported` boundaries: impact aliases such as `IIC` and `AIIC`
  remain unsupported for this wall route. Direct-fixed double-leaf must
  stay on the existing direct-fixed owner and must not receive
  independent-frame mass-air-mass boost.

## Probe Evidence

Before this owner, a local runtime probe confirmed that the selected
route already has depth sensitivity worth protecting and hardening:

- `60 mm` cavity: lab `Rw 44`, `STC 44`, `C -1.2`, `Ctr -6.4`
- `90 mm` cavity: lab `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`
- `140 mm` cavity: lab `Rw 47`, `STC 48`, `C -0.8`, `Ctr -5.8`

The owner should convert that behavior into an explicit contract and
fix any discovered gaps in required-input honesty, depth-source
alignment, field/building propagation, or stale no-depth behavior.

## Expected Counters

The exact runtime movement depends on whether the implementation only
formalizes already-live depth sensitivity or fixes a missed depth
source. Expected minimum:

- `accuracyPromotedRequestShapes: 3`
- `accuracyPromotedTargetOutputs: 13`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 0`
- `newCalculableTargetOutputs: 0`
- `runtimeBasisPromotions: 0`
- `runtimeValuesMoved 0`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

If the owner discovers that a user-entered depth source is ignored or
incorrectly defaulted, it may move runtime values, but only within the
owned mass-air-mass/cavity-depth formula route and with tests proving the
boundary.

This is not a broad source crawl.
