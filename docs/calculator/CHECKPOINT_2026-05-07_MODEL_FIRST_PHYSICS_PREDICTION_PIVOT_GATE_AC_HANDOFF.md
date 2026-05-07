# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate AC

Status: Gate AC landed. Gate AD steel-floor impact formula corridor is
selected next.

Selection status:

`gate_ac_steel_floor_physics_input_contract_landed_selected_formula_corridor_gate_ad`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ac-steel-floor-physics-input-contract.test.ts`

Landed action:

`gate_ac_steel_floor_physics_input_contract_and_formula_readiness_plan`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ad-steel-floor-impact-formula-corridor-contract.test.ts`

Selected next action:

`gate_ad_steel_floor_impact_formula_numeric_corridor_plan`

## What Changed

Gate AC converts the Gate AB lightweight-steel source guard into an
executable no-runtime input/formula readiness contract. It does not
promote a new steel-floor runtime value yet.

The contract requires these physical inputs before source-absent steel
floor impact formulas can promote:

- steel support form: `open_web_or_rolled` or `joist_or_purlin`;
- steel carrier depth;
- steel carrier spacing;
- upper impact package dynamic stiffness or a truly matching source row;
- load basis;
- lower ceiling isolation/support form, cavity, and board schedule.

Exact measured full-stack source rows remain highest precedence and can
promote without formula readiness. Complete explicit open-web steel
predictor input is now `ready_for_formula_corridor_gate`, while current
runtime output remains on the existing family-estimate lane until Gate
AD owns the numeric corridor.

## Implementation Notes

- `packages/engine/src/steel-floor-impact-physics-input-contract.ts`
  owns the Gate AC contract and scenario pack.
- `packages/shared/src/domain/impact-predictor-input.ts` now accepts
  `carrierSpacingMm` for explicit steel carrier geometry.
- `packages/shared/src/domain/input-completeness.ts` now names steel
  support form, carrier depth/spacing, and lower ceiling isolation as
  promptable physical fields.
- `packages/engine/src/index.ts` exports the contract helper.

## Validation Scope

Gate AC contract covers:

- generic construction-image steel floor negative: targeted physical
  prompts replace wrong-family source borrowing;
- complete open-web steel predictor input positive:
  formula-corridor ready, no runtime movement;
- missing carrier spacing nearby negative;
- missing lower isolation nearby negative;
- exact source row precedence positive.

Validation completed on 2026-05-07:

- focused Gate AC contract: 1 file / 6 tests passed;
- focused Gate AB + Gate AC + predictor input regression: 3 files / 54
  tests passed;
- `pnpm --filter @dynecho/engine typecheck` passed;
- `pnpm calculator:gate:current` passed with engine 309 files / 1760
  tests, web 62 files / 275 tests plus 18 skipped, repo build, and
  whitespace guard.

Known optional `sharp/@img` Next build warnings remain non-fatal.

## Next Step

Gate AD should define the first numeric steel-floor impact formula
corridor around the Gate AC input contract. It must compare against
available same-family source holdouts without treating those rows as the
whole calculator, and it must keep lab `Ln,w` / `DeltaLw`, field
`L'n,w` / `L'nT,w`, and future low-frequency outputs separated by basis.
