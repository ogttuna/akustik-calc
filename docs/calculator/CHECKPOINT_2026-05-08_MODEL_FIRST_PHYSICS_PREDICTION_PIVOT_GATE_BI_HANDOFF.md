# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate BI

Gate:

`gate_bi_steel_floor_formula_same_stack_iso_delta_lw_tighten_candidate_governance_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bi-steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-tighten-candidate-governance.ts`

Status:

Gate BI landed as a no-runtime governance guard for the same-stack ISO
lab `DeltaLw` steel-floor formula `tighten` candidate.

Summary:

- Gate BI consumes Gate BH's selected tighten-candidate governance lane;
- Gate BH's `tighten` signal is accepted only as a governance proposal;
- `Ln,w 55.6` / `DeltaLw 22.4` remain unchanged;
- `+/-4.5 dB` / `+/-2.0 dB` tolerances remain unchanged;
- formula coefficients, exact-source precedence, source text/document
  ingestion, measured runtime evidence, card/report/API runtime
  surfaces, and lab/field/building boundaries remain frozen;
- future tolerance movement still requires independent measured
  residual packet ownership, steel topology diversity, rights/citation
  posture, exact-source precedence boundaries, basis-separation runtime
  owner, tolerance-delta runtime proposal, and card/report/API parity;
- closure fixture rows cannot satisfy those future-runtime
  prerequisites;
- the selected next lane is
  `personal_use_mvp_coverage_sprint_after_gate_bi`.

Selection status:

`gate_bi_same_stack_iso_delta_lw_tighten_candidate_governance_landed_no_runtime_selected_personal_use_mvp_coverage_sprint_gate_a`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`

Selected next action:

`gate_a_personal_use_mvp_coverage_matrix_plan`

Next step:

Gate A should build an executable wall/floor scenario matrix through
current engine entry points. The starter target is 24 common and hostile
calculator rows covering wall and floor routes, lab/field/building
basis requests, missing-input behavior, exact/source-anchored/family
physics/bounded/screening/unsupported postures, tolerance/error budget,
and visible surface parity targets. Gate B must be selected from matrix
failures by coverage ROI and accuracy risk.

Validation result:

Focused Gate BI validation completed on 2026-05-08. Gate BI passed 1
file / 7 tests, focused Gate BH/BI continuity passed 2 files / 15
tests, focused Gate BD/BE/BF/BG/BH/BI closure continuity passed 6 files
/ 52 tests, engine typecheck passed, engine build/DTS passed, and full
`pnpm calculator:gate:current` passed with engine 341 files / 1972
tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
successful, and whitespace guard clean. Known warnings were the existing
Zustand unavailable test-storage warnings and optional sharp package
resolution warnings during web build. Broad `pnpm check` was not rerun
because Gate BI has no runtime/API/UI surface change.
