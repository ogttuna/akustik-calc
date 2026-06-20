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

Owner status:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh`

Selected candidate:

`wall.double_leaf_framed.cavity_depth_numeric_sensitivity_owner`

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

Before implementation, the expected minimum for this selected owner was
`runtimeValuesMoved 0` if it only formalized already-live topology-depth
sensitivity. The landed owner moved values because it found and fixed a
missed user-entered depth source.

The owner found and fixed a missed depth source:
`advancedWall.cavities[0].depthMm` was usable by the solver contract
only after the runtime input contract and advanced-wall route guard were
aligned. Landed counters:

- `accuracyPromotedRequestShapes: 6`
- `accuracyPromotedTargetOutputs: 26`
- `newCalculableLayerTemplates: 0`
- `newCalculableRequestShapes: 3`
- `newCalculableTargetOutputs: 13`
- `runtimeBasisPromotions: 3`
- `runtimeValuesMoved 13`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

Landed behavior:

- Topology `cavity1DepthMm` values `60`, `90`, and `140 mm` remain
  numerically active for lab `Rw`, `STC`, `C`, and `Ctr`.
- Advanced-only `advancedWall.cavities[0].depthMm` now feeds the owned
  Gate S / Gate I / Gate AR formula route when topology depth is omitted.
- Advanced-only depth now calculates lab `Rw`/`STC`/`C`/`Ctr` and
  field/building `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, and `DnT,A`.
- Missing and non-positive cavity depth remain `needs_input` in the Gate
  R input contract.
- When topology and advanced depth are both supplied, topology depth
  remains authoritative and a mismatch withholds the porous-thickness
  precision credit instead of overriding topology.
- Impact aliases remain `unsupported`.

Selected next:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-20.md`

This is not a broad source crawl.
