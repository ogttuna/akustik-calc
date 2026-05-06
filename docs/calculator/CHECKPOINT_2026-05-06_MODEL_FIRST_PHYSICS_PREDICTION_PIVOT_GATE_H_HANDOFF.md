# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate H

Slice: `calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_h_calibrate_sources_and_exact_promotion_without_deleting_physics_solver`

Landed file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`

Selection status:

`gate_h_source_calibration_exact_promotion_policy_landed_no_runtime_selected_family_material_expansion_gate_i`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-i-family-material-expansion-contract.test.ts`

Selected next action:

`gate_i_expand_family_material_properties_and_benchmark_scenarios`

## What Changed

Gate H added a no-runtime source-promotion readiness policy for airborne
calculator candidates. It keeps the calculator model-first: source rows
can override, anchor, calibrate, benchmark, and validate results only
inside the scope they actually own. Missing source evidence still blocks
measured-exact and calibration promotion, but it does not delete the
formula-backed physics-prediction candidate.

The new policy surface is:

- `packages/engine/src/airborne-source-promotion.ts`
- `evaluateAirborneSourcePromotionReadiness(...)`

It separates three source-backed candidate modes:

- `exact_full_stack`
  - requires a rights-safe source-owned curve or rating payload;
  - requires topology, material, metric-context, and tolerance ownership;
  - requires the source metric scope to match the requested lab, field,
    or building-prediction scope;
  - requires paired positive tests and negative boundary tests;
  - promotes only as `measured_exact_full_stack`.
- `calibrated_family`
  - requires family scope compatibility;
  - requires rights-safe calibration curves;
  - requires a named calibration set, holdout set, positive holdout
    tolerance, holdout test ids, and documented failure-case ids;
  - promotes as `calibrated_family_physics`, not as measured exact for a
    nearby full-stack variant.
- `anchored_delta`
  - requires an exact subassembly anchor source id;
  - requires a named delta method and delta layer set;
  - promotes as `measured_exact_subassembly_plus_calculated_delta`, not
    as full-stack exact.

The Gate H contract also proves that exact, calibrated, anchored-delta,
and uncalibrated `family_physics_prediction` candidates can coexist. The
resolver may select a higher-precedence source candidate only when it is
eligible; blocked source candidates keep their rejection reasons while
the physics-prediction candidate remains available.

## Runtime Boundaries

Gate H does not move runtime acoustic values, support buckets,
confidence, route-card values, output-card statuses, proposal/report
copy, API shape, or workbench input behavior.

Protected Gate G values remain:

- grouped explicit-topology Rockwool triple-leaf lab:
  `Rw 50 / STC 55 / C 0.8 / Ctr -7.3`;
- origin: `family_physics_prediction`;
- method: `triple_leaf_two_cavity_frequency_solver`;
- tolerance: `uncalibrated_prediction`, `errorBudgetDb: 5`.

The grouped Rockwool prediction is still not measured exact,
source-validated, or design-grade. Direct exact/calibrated promotion
remains blocked until a rights-safe source candidate satisfies Gate H.

Flat-list split/internal gypsum-leaf Rockwool remains guarded and
withheld from supported target outputs at diagnostic `Rw 41` until the
user supplies explicit grouped topology.

## Implementation Surfaces

- `packages/engine/src/airborne-source-promotion.ts`
  - evaluates source-promotion readiness and returns origin, eligibility,
    evidence ids, and rejection reasons.
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-h-source-calibration-exact-promotion-contract.test.ts`
  - locks exact/calibration/anchor boundaries, candidate coexistence, and
    no-runtime movement.
- `tools/dev/run-calculator-current-gate.ts`
  - includes the focused Gate H contract in the current calculator gate.
- `AGENTS.md`, `docs/calculator/README.md`,
  `docs/calculator/CURRENT_STATE.md`,
  `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`, and
  `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
  - promote Gate H as the latest landed gate and select Gate I.

## Validation

Validation completed on 2026-05-06:

- Focused Gate H passed 1 file / 7 tests.
- Gate A/B/C/D/E/G/H continuity passed 7 files / 45 tests.
- `pnpm calculator:gate:current` passed with engine 288 files / 1632
  tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.

Report-export readiness was confirmed in
`docs/calculator/CHECKPOINT_2026-05-06_GATE_H_AND_REPORT_EXPORT_WRAPUP_HANDOFF.md`.

## Next Step

Gate I is next. It should expand family/material properties and benchmark
scenarios so the calculator moves beyond the first Rockwool-specific
prediction while preserving Gate H source-promotion boundaries and Gate
G runtime values.
