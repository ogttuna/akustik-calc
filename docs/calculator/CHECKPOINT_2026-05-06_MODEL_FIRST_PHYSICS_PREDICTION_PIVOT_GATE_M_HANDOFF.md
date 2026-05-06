# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate M

Gate M landed:

`gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`

Selection status:

`gate_m_dynamic_candidate_resolver_runtime_landed_no_value_selected_family_solver_upgrade_gate_n`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-n-family-solver-upgrade-contract.test.ts`

Selected next action:

`gate_n_select_first_family_solver_upgrade_runtime_gate_for_dynamic_calculator`

## What Changed

- Added `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`.
- Wired Dynamic Calculator results through the Gate M resolver in
  `packages/engine/src/calculate-assembly.ts`.
- Exported the helper from `packages/engine/src/index.ts`.
- Added the Gate M contract test.

Gate M does not move numeric runtime values or output support buckets.
It populates the candidate resolver surface that already existed in the
shared assembly schema, so Dynamic Calculator calls can expose exact
source, anchored delta, calibrated family, family physics, bounded,
screening, `needs_input`, and `unsupported` candidates together.

## Runtime Posture

- The grouped explicit-topology Rockwool wall still returns lab
  `Rw 50 / STC 55 / C 0.8 / Ctr -7.3` from the Gate G uncalibrated
  family physics path.
- That grouped wall now carries the full eight-origin candidate set.
  Source/callibration candidates are rejected with source-evidence
  reasons; family physics remains selected.
- ACON-like flat-list multi-cavity walls still keep target outputs
  unsupported and stay at the diagnostic screening value, but now expose
  a selected `needs_input` candidate naming the missing grouped topology
  fields.
- Field/apparent requests remain separated from lab outputs. Missing
  room/partition/RT60 context selects `needs_input`; lab candidates do
  not silently replace field/building predictions.
- Unsupported floor rating adapters such as `IIC` / `AIIC` stay
  `unsupported`; this is not treated as a source acquisition task.

## Tests Added

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`

The test covers:

- all eight candidate origins staying live under model-first precedence;
- exact source winning only when exact basis is eligible;
- source-absent grouped wall selecting family physics without deleting
  rejected source candidates;
- ACON-like flat-list multi-cavity selecting `needs_input`;
- field/basis missing-context separation;
- unsupported floor rating adapters;
- current grouped and ACON-like runtime values remaining unchanged;
- docs and current-gate runner alignment.

## Next

Gate N should pick the first family solver runtime upgrade. Candidate
resolver visibility is now in place, so Gate N can move one family at a
time with numeric benchmark tests, nearby negatives, missing-input
guards, and basis/error-budget ownership.
