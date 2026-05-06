# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate U

Status: Gate U landed for
`calculator_model_first_physics_prediction_pivot_v1`.

Gate U landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`

Gate U landed action:

`gate_u_select_next_solver_or_calibration_lane_after_material_gap_closure`

Selection status:

`gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`

Selected next Gate V file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`

Selected next Gate V action:

`gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`

## What Landed

Gate U selects the next solver/calibration lane after Gate T material
property gap closure. The selected lane is floor-impact dynamic-stiffness
input and adapter ownership for Gate V.

This is a calculator-first coverage decision:

- floor impact remains a large personal-use readiness gap after wall
  single-leaf and double-leaf/framed runtime lanes landed;
- Gate T closed the resilient layer, floor deck/screed, and limp
  membrane material-property gaps needed by this route;
- the next safe move is an input and rating-adapter contract, not
  runtime promotion;
- calibration holdouts for existing wall runtime lanes remain later
  error-budget tightening work, not the next broad coverage move.

Code surfaces:

- `packages/engine/src/dynamic-calculator-next-solver-or-calibration-selection.ts`
  ranks floor impact, field/building continuation, generalized
  multi-cavity, lined masonry/CLT, and calibration holdout candidates.
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts`
  pins the Gate U selection, negative boundaries, and runtime stability.
- `tools/dev/run-calculator-current-gate.ts` includes the Gate U contract
  in the current calculator gate runner.

## Boundaries

- Runtime numeric behavior did not move.
- Output support buckets, route cards, workbench input behavior, and
  proposal report copy did not move.
- Exact/source rows remain override, calibration, benchmark, and holdout
  evidence; they do not replace the floor-impact algorithm.
- `Ln,w`, `L'n,w`, `L'nT,w`, `IIC`, and `AIIC` remain basis-separated.
  Gate V must define ISO 717-2 and ASTM E989 adapter boundaries before
  any impact runtime promotion.
- Missing dynamic stiffness or load-basis inputs must become
  `needs_input`, not guessed values.

## Next Step

Gate V should define the floor-impact dynamic-stiffness input and adapter
contract for Dynamic Calculator. It should own
`resilientLayerDynamicStiffnessMNm3`, `loadBasisKgM2`, ISO 717-2
`Ln,w` handling, field-impact boundaries, and ASTM E989 `IIC`/`AIIC`
separation with positive and nearby-negative tests before runtime values
move.

## Validation

Completed on 2026-05-06:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts --maxWorkers=1`
  - 1 file passed, 5 tests passed.
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-t-family-material-gap-closure-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-u-next-solver-or-calibration-selection-contract.test.ts --maxWorkers=1`
  - 2 files passed, 11 tests passed.
- `pnpm --filter @dynecho/engine typecheck`
- `pnpm calculator:gate:current`
  - engine: 301 files passed, 1716 tests passed.
  - web: 62 files passed, 275 tests passed, 18 skipped.
  - repo build passed with the known non-fatal `sharp/@img` optional
    dependency warnings.
- `git diff --check`
  - clean.
