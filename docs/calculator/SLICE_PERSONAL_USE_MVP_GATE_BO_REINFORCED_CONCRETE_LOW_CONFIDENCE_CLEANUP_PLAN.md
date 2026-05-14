# Gate BO Reinforced Concrete Low-Confidence Cleanup Plan

Date: 2026-05-14

Gate BO lands the selected Personal-Use MVP cleanup after Gate BN.
The target was the reinforced-concrete combined upper/lower floor route
that could still return a final
`predictor_floor_system_low_confidence_estimate` answer.

## Landed Behavior

- Incomplete reinforced-concrete `combined_upper_lower_system` predictor
  input no longer falls through to the old low-confidence nearby-row
  fallback.
- The route now blocks fallback when physical owners are missing:
  `baseSlabOrFloor`, `resilientLayerDynamicStiffnessMNm3`,
  `loadBasisKgM2`, and `ceilingOrLowerAssembly`.
- Complete explicit owner input promotes to
  `predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`.
- The Gate BO complete pin is lab `Ln,w 58.1` / `DeltaLw 13.7`, with
  `+/-6.5 dB` and `+/-5.5 dB` source-absent formula budgets.
- Visible-derived reinforced-concrete combined stacks keep airborne
  `Rw` / `Ctr` support when available, but impact `Ln,w` / `DeltaLw`
  stays parked until missing physical owners are supplied.

## Protected Boundaries

- Exact floor-system rows still win first.
- Bare heavy concrete floors without combined upper/lower intent still
  use the existing bare-floor formula.
- Upper-only heavy floating-floor input still returns the existing
  `predictor_heavy_floating_floor_iso12354_annexc_estimate` values.
- No broad source crawl, tolerance retune, field/building alias, or
  ASTM/IIC alias was added.

## Next Step

Gate BO selected Gate BP:

`gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan`

Selected file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts`

Gate BP should make the new reinforced-concrete needs-input / formula
corridor posture visible across route cards, output cards, report text,
saved replay, and API payload checks without moving the Gate BO values.
