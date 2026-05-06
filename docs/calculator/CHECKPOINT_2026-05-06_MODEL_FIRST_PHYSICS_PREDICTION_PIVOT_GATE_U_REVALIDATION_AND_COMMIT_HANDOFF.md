# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate U Revalidation

Status: Gate U revalidated for
`calculator_model_first_physics_prediction_pivot_v1`; Gate V remains the
selected next implementation.

Selection status remains:

`gate_u_next_solver_or_calibration_selection_landed_no_runtime_selected_floor_impact_gate_v`

Selected next Gate V file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-v-floor-impact-dynamic-stiffness-contract.test.ts`

Selected next Gate V action:

`gate_v_define_floor_impact_dynamic_stiffness_input_and_adapter_contract_for_dynamic_calculator`

## Revalidation Summary

The zoom-out pass confirms that the current direction is still correct:
the next useful move is not more source-row collection and not a runtime
number jump. It is a no-runtime floor-impact input and adapter contract
for Dynamic Calculator, because floor impact is the largest remaining
personal-use floor coverage gap after Gate T material-property closure
and Gate U lane selection.

`git fetch origin --prune` completed cleanly, and local `main` is not
ahead or behind `origin/main`.

## What The Tests Found

`pnpm calculator:gate:current` passed:

- engine focused gate: 301 files passed, 1716 tests passed;
- web focused gate: 62 files passed, 275 tests passed, 18 skipped;
- repo build passed with the known non-fatal `sharp/@img` optional
  dependency warnings;
- whitespace guard was clean.

The first broad `pnpm check` run caught two web proposal regressions that
the focused current gate did not cover:

- developer and lab-ready report profiles had collapsed back to the
  generic `Acoustic Proposal` cover title;
- the client printable proposal included the raw heading `Warnings`,
  which confused the branded/client-facing HTML contract even though the
  underlying missing-input warning should remain visible.

Both were fixed before this checkpoint:

- developer profile now renders `Acoustic Coordination Memo`;
- lab-ready profile now renders `Laboratory Submission Brief` and keeps a
  lab submission profile detail;
- printable proposal HTML keeps the missing-input caveat visible under
  `Calculation caveats` / `Open issue notes` without exposing the raw
  `Warnings` heading.

Targeted re-run passed:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-proposal-branding.test.ts features/workbench/simple-workbench-proposal.test.ts --maxWorkers=1`
  - 2 files passed, 7 tests passed.

Full re-run passed:

- `pnpm check`
  - lint passed;
  - typecheck passed;
  - engine full test suite passed: 426 files, 2518 tests;
  - web full test suite passed across 168 files: 950 tests passed, 18
    skipped;
  - build passed with the known non-fatal `sharp/@img` optional
    dependency warnings.

`git diff --check` is clean after the fixes.

## Next Implementation Decision

Gate V should define the floor-impact dynamic-stiffness input and
adapter contract before any runtime promotion. It should create an
executable contract around:

- required resilient-layer dynamic stiffness:
  `resilientLayerDynamicStiffnessMNm3`;
- required load basis: `loadBasisKgM2`;
- base slab/deck, floating screed or topping, resilient layer, limp
  membrane, and finish role ownership where the floor route needs them;
- ISO 717-2 `Ln,w` / `DeltaLw` adapter boundary;
- field-impact context boundaries for `L'n,w` and `L'nT,w`;
- ASTM E989 `IIC` and `AIIC` adapter separation, with no `Ln,w` aliasing.

Gate V should remain no-runtime unless the contract proves all of the
above with positive and nearby-negative tests. Expected test shape:

- complete heavy floating-floor input is classified as ready for the
  floor-impact dynamic-stiffness lane;
- missing dynamic stiffness returns `needs_input`;
- missing load basis returns `needs_input`;
- field/apparent impact outputs require explicit field context instead
  of borrowing lab `Ln,w`;
- `IIC` and `AIIC` remain unsupported or adapter-blocked until the ASTM
  E989 owner is executable;
- hostile floor edits, splits, duplicates, and safe reorders do not move
  support posture accidentally.

Source rows remain exact overrides, anchors, calibration evidence, and
holdouts. They do not replace the algorithm, because the calculator must
handle source-absent combinations when the physical inputs are
sufficient.

## Commit Scope Notes

Commit the calculator/source-code/docs changes for Gates J-U, the
Gate U revalidation docs, and the web proposal regression fix. Do not
include generated Playwright traces, generated report outputs, ad hoc PDF
files, or temporary source-research artifacts.
