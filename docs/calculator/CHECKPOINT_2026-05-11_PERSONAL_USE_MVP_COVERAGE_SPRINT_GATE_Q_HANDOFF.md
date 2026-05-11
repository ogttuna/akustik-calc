# Personal-Use MVP Coverage Sprint Gate Q Handoff

Date: 2026-05-11

Slice:

`calculator_model_first_physics_prediction_pivot_v1`

Gate Q landed:

`gate_q_personal_use_mvp_opening_leak_composite_transmission_loss_input_contract_plan`

Gate Q selection status:

`gate_q_personal_use_mvp_opening_leak_composite_input_contract_landed_no_runtime_selected_formula_corridor_gate_r`

Gate Q landed files:

- `packages/shared/src/domain/airborne-context.ts`
- `packages/shared/src/domain/input-completeness.ts`
- `packages/engine/src/dynamic-airborne-gate-q-opening-leak-composite-transmission-loss-input-contract.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-q-opening-leak-composite-transmission-loss-input-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`

## Result

Gate Q owns the opening/leak composite transmission-loss input contract
without moving runtime values. It adds first-class schema fields for
`hostWallAreaM2` and `openingLeakElements`, where each opening can name
area, count, element `Rw`, rating basis, seal/leakage class, origin, and
an optional stable id.

Runtime promotion remains blocked in Gate Q. The no-runtime warning is:

`Opening/leak composite transmission-loss inputs are owned, but the area-energy formula corridor is not promoted yet. DAC keeps host wall values unchanged instead of guessing door/window/leak penalties.`

Required physical inputs:

- `hostWallAreaM2`
- `openingAreaM2`
- `openingElementRwDb`
- `openingRatingBasis`
- `openingSealLeakageClass`
- `openingCount`
- `openingOrigin`

Required owner inputs before a later formula corridor can move values:

- `hostWallCandidateBoundaryOwner`
- `compositeAreaTransmissionLossEnergyFormulaOwner`
- `openingLeakagePenaltyFormulaOwner`
- `openingOriginPolicyOwner`

## Boundaries

Gate Q preserves host-wall candidate precedence, exact-source
precedence, lab/field/building separation, and the rule that a
door/window/opening source row cannot silently replace the host wall.
Leakage penalties are also blocked unless `openingSealLeakageClass` is
explicit.

Hostile boundaries covered:

- excessive effective opening area versus host-wall area;
- duplicate opening ids and duplicate opening signatures;
- zero or negative opening area/count;
- unknown rating basis or unknown seal/leakage class;
- safe reorder invariance for multiple openings;
- many-layer host-wall stability with opening inputs present.

## Runtime

Gate Q intentionally does not calculate composite transmission loss yet.
Complete opening inputs parse through the shared schema and evaluate as
`ready_for_formula_corridor`, but output metrics remain the same as the
host-wall route. Building-prediction requests with opening inputs remain
parked on the Gate N/P unsupported boundary; Gate Q does not alias lab
opening data onto `R'w` or `DnT,w`.

## Next

Selected next action:

`gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts`

Gate R should define the area-energy composite transmission-loss formula
corridor and leakage/seal penalty model before any runtime value moves.
It should prove formula terms, basis labels, uncertainty budget,
host-wall precedence, exact-source precedence, and negative boundaries
for missing or unsafe opening inputs.

## Validation

Validation completed on 2026-05-11:

- focused Gate Q passed 1 file / 6 tests;
- Gate Q/P/O/N/M/L plus Gate G/H/I/J/K continuity passed 11 files /
  65 tests;
- final `pnpm calculator:gate:current` passed with engine 358 files /
  2074 tests, web 71 files / 306 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean;
- final standalone `git diff --check` passed after this validation-note
  sync.

The first current-gate attempt caught a DTS-only TypeScript narrowing
issue in the Gate Q helper. The helper now uses type-predicate guards
for positive numbers/integers, and the final current-gate pass is clean.
