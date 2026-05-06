# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate J

Slice:
`calculator_model_first_physics_prediction_pivot_v1`

Gate landed:
`gate_j_build_personal_use_readiness_scenario_pack`

Selection status:
`gate_j_personal_use_readiness_scenario_pack_landed_no_runtime_selected_route_input_topology_gate_k`

Selected next file:
`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`

Selected next action:
`gate_k_define_route_input_topology_contracts_for_dynamic_calculator`

## Summary

Gate J lands the Dynamic Calculator personal-use readiness scenario pack.
It does not move runtime values. The goal is to make the calculator-first
direction executable before input/topology and solver work continues.

Implemented surfaces:

- `packages/engine/src/airborne-personal-use-readiness-scenario-pack.ts`
  - defines wall/floor personal-use scenarios for exact source, similar
    source anchored delta, calibrated family, source-absent family
    physics, bounded prediction, screening, `needs_input`, and
    `unsupported` outcomes.
  - records the current KS, mass-law, Sharp, Kurtovic, and dynamic
    delegate posture as seed engines, not full solver coverage.
  - provides a Gate J candidate-resolution helper proving source absence
    blocks exact/calibration promotion only and leaves the source-absent
    family solver candidate live.
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-j-personal-use-readiness-scenario-pack-contract.test.ts`
  - asserts scenario coverage across engine, visible card, saved replay,
    PDF, and DOCX report surfaces.
  - pins the grouped Rockwool source-absent runtime prediction at
    `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`.
  - keeps the ACON-like flat-list multi-cavity wall guarded on
    `multileaf_screening_blend` with unsupported requested outputs until
    grouped topology inputs land.
  - keeps the current floor impact route honest: `Rw` and `Ln,w` can be
    supported in the narrow heavy-floor path, while `DeltaLw`, `L'n,w`,
    and `L'nT,w` remain explicit gaps.
- `tools/dev/run-calculator-current-gate.ts`
  - now includes the Gate J focused contract in the current gate pack.

## Runtime Boundary

Runtime values stay frozen. Gate J is a contract and readiness gate:

- no source rows were imported;
- no exact source promotion occurred;
- no solver retuning occurred;
- no output support widening occurred;
- no route-card, API, or calculator runtime output behavior changed.

One report-surface parity fix landed during validation:

- `apps/web/features/workbench/simple-workbench-proposal.ts` now prints
  existing calculator warnings into the HTML proposal as escaped
  calculation caveats. This matches the text/PDF report snapshot posture
  and keeps source-gated family-physics caveats visible; it does not
  change any acoustic value.

The ACON-like wall case is now explicitly represented as an
anti-library-drift scenario. It demonstrates why the next work must be
route input and grouped topology, not another catalog expansion.

## Validation

Validation completed in this working tree:

- focused Gate J contract: 1 file / 8 tests;
- model-first pivot continuity Gate A/B/C/D/E/G/H/I/J: 9 files / 60
  tests;
- focused web report parity after the HTML caveat fix: 1 file / 7
  tests;
- `pnpm calculator:gate:current`: engine 290 files / 1647 tests, web 61
  files / 273 passed + 18 skipped, repo build 5 / 5 tasks, whitespace
  guard green.

The web build still emits the known non-fatal `sharp` optional package
warnings for DOCX/PDF support, then completes successfully.

## Next Step

Gate K should define the route input and topology contract for Dynamic
Calculator personal use:

- wall/floor route selection;
- lab, field, and building-prediction output basis;
- grouped leaves/cavities for multi-leaf walls;
- MLV surface mass, cavity depth, frame/bridge coupling, porous flow
  resistivity, dynamic stiffness, room/flanking context;
- exact `needs_input` prompts when physical inputs are missing.

Gate K should still avoid runtime value movement unless a narrow contract
explicitly proves the value change with positive/negative cases and
error-budget ownership.
