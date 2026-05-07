# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate AN

Document role: handoff for the active Dynamic Calculator slice after
Gate AN.

## Scope

Gate AN follows Gate AM's narrow source-packet acquisition ledger. Gate
AM found no qualifying source-owned same-stack ISO lab `DeltaLw`
steel-floor packet, so Gate AN pivots back to calculator-first formula
quality: the source-absent steel-floor formula must expose a structured
error budget instead of hiding the tolerance behind free-form copy.

This gate does not retune runtime values and does not loosen the
source-owned holdout rule.

## Landed

- New Gate AN contract:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-an-steel-floor-formula-source-absent-uncertainty-contract.test.ts`.
- New Gate AN helper:
  `packages/engine/src/steel-floor-formula-source-absent-uncertainty.ts`.
- Complete source-absent steel formula cases still produce the same
  runtime estimates:
  - `Ln,w 55.6`;
  - `DeltaLw 22.4`.
- `Ln,w` keeps the existing `+/-4.5 dB` corridor and `DeltaLw` keeps
  the existing `+/-2.0 dB` corridor.
- The tolerance is now decomposed into structured terms:
  - missing source-owned `DeltaLw` holdout absence;
  - source-absent bare steel reference modelling;
  - steel transfer efficiency;
  - dynamic stiffness precision;
  - load-basis precision;
  - lower support class simplification;
  - upper resilient topology simplification.
- Exact-source precedence, missing-input cases, and unsafe-topology
  cases do not expose a formula error budget.
- Gate AK/AM source-packet rules remain strict, with zero accepted
  source-owned same-stack ISO lab `DeltaLw` holdouts.
- Runtime calculator values did not move.

## Selection

Gate AN landed status:

`gate_an_source_absent_uncertainty_landed_no_runtime_selected_error_budget_surface_parity_gate_ao`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts`

Selected next action:

`gate_ao_steel_floor_formula_error_budget_surface_parity_plan`

Gate AO should carry the structured error-budget payload through output
cards, method dossier, Markdown report, calculator API payload, and
impact-only API payload without changing the `Ln,w` / `DeltaLw` numbers
or presenting the formula budget as measured evidence.

## Validation

Focused validation completed on 2026-05-07:

- Gate AN focused engine contract passed 1 file / 6 tests;
- engine typecheck passed;
- focused Gate AM/AN contracts passed 2 files / 11 tests;
- focused Gate AJ/AK/AL/AM/AN contracts passed 5 files / 25 tests;
- full `pnpm calculator:gate:current` passed: engine 320 files / 1813
  tests, web 65 files / 284 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean;
- `git diff --check` passed before this validation-doc sync.
