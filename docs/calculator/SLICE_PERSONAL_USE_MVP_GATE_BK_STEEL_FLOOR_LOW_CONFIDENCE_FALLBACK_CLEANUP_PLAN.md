# Gate BK Steel-Floor Low-Confidence Fallback Cleanup Plan

Date: 2026-05-14

Selected action:

`gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`

Selected file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts`

## Goal

Remove steel-floor cases with complete physical owners from vague
low-confidence fallback behavior. Exact measured steel floor rows still
win first. Gate AD upper/lower steel formula values stay frozen. When a
steel suspended-ceiling-only case owns support form, carrier depth,
carrier spacing, and lower-isolation geometry, it should produce a
named source-absent formula result rather than borrowing nearby Pliteq /
UBIQ rows.

## Runtime Scope

Gate BK adds:

- `predictor_lightweight_steel_suspended_ceiling_corridor_estimate`;
- lab `Ln,w` only for complete steel suspended-ceiling-only predictor
  input;
- a structured `source_absent_formula_error_budget` for that `Ln,w`;
- `+/-6 dB` corridor tolerance for the new suspended-ceiling-only lane.

Gate BK keeps frozen:

- Gate AD steel upper/lower formula values:
  `Ln,w 55.6` / `DeltaLw 22.4`;
- Gate AD tolerances: `+/-4.5 dB` for `Ln,w`,
  `+/-2.0 dB` for `DeltaLw`;
- exact steel source precedence;
- ASTM/IIC/AIIC, field, building, and low-frequency `L'nT,50`
  boundaries unless a separate owner exists.

## Missing Input Boundary

The generated `floor-steel-fallback` stack is not promoted by Gate BK.
Its visible layers still lack explicit carrier spacing and lower ceiling
isolation support-form ownership, so the next selected slice is the
steel suspended-ceiling input surface:

`gate_bl_personal_use_mvp_steel_floor_suspended_ceiling_input_surface_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts`

Gate BL should make those owner fields first-class on the Dynamic
Calculator input surface and convert partial input into precise
`needs_input` prompts instead of leaving users with a low-confidence
final answer.

## Tests

Gate BK is covered by:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts`

The contract asserts:

- complete steel suspended-ceiling-only input returns `Ln,w 62.2` on
  the new named basis and no low-confidence fallback;
- exact steel source rows stay first;
- Gate AD upper/lower steel runtime stays frozen;
- generated steel fallback remains classified as missing input for the
  next input-surface gate;
- no `DeltaLw`, `IIC`, `AIIC`, or `L'nT,50` is fabricated on the new
  suspended-ceiling-only lab lane.
