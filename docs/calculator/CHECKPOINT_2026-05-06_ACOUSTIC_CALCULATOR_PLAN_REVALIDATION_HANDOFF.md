# Checkpoint: Acoustic Calculator Plan Revalidation Handoff

Date: 2026-05-06

Status: planning and implementation revalidation complete. Runtime
values remain frozen. The active slice is still
`calculator_model_first_physics_prediction_pivot_v1`; at the time of
this planning handoff Gate B was the next implementation step.

Supersession note: Gate B has since landed no-runtime in
`docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_B_HANDOFF.md`.
This document remains valid as the planning rationale; the current next
implementation step is now Gate C rating-adapter integrity.

## Purpose

This checkpoint records one additional analysis/planning pass after the
product goal was restated: DynEcho is an acoustic calculator for
wall/floor layer combinations, not a source-library/catalog app.

The near-term target is personal-use readiness:

1. user chooses wall or floor;
2. UI asks for the physical inputs required by that route;
3. user selects layer materials and thicknesses;
4. engine returns defensible `Rw`, `R'w`, `DnT,w`, `Ln,w`, and related
   outputs;
5. missing physical inputs produce named `needs_input` diagnostics;
6. exact measured/source rows win only when they truly match, and
   otherwise calibrate, anchor, benchmark, or validate physics
   predictions.

## Implementation Comparison

Current implementation state checked in this pass:

- the selected Gate B file is absent:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`;
- shared `AssemblyCalculation` currently has `dynamicAirborneTrace`, but
  no first-class `airborneBasis` or `airborneCandidateSet`;
- `dynamic-airborne.ts` can classify multi-leaf/multi-cavity topology,
  but current grouped Rockwool still resolves through
  `multileaf_screening_blend`;
- `wall-triple-leaf-frequency-solver.ts` can calculate grouped
  three-leaf/two-cavity curves and ratings, but is still
  `researchOnly` / `runtimeEligible: false`;
- `calculate-assembly.ts` still composes airborne curves directly
  rather than through a first-class airborne candidate resolver;
- `impact-lane.ts` already has the closest correct pattern for
  precedence: exact/source/system rows, explicit deltas, predictor
  estimates, family estimates, and bounded fallbacks;
- current protected values remain unchanged:
  adjacent Rockwool is `Rw 51 / R'w 49 / DnT,w 51`; unresolved grouped
  or split Rockwool remains `Rw 41` screening until the later runtime
  prediction gate.

Conclusion: the plan is incomplete, not finished. Do not select a new
slice. Gate B must land before runtime prediction movement.

## Standards Recheck

This pass rechecked public/current official source pages. The plan still
matches the standards frame:

- ISO 12354-1 and ISO 12354-2 are the building-acoustics calculation
  frame for airborne and impact prediction:
  <https://www.iso.org/standard/70242.html>
  <https://www.iso.org/standard/70243.html>
- ISO 717-1 and ISO 717-2 are rating adapters for airborne and impact
  single-number quantities:
  <https://www.iso.org/standard/77435.html>
  <https://www.iso.org/fr/standard/69867.html>
- ASTM E90 and E492 are lab measurement lanes; ASTM E413 and E989 are
  single-number rating lanes:
  <https://store.astm.org/e0090-23.html>
  <https://store.astm.org/standards/e492>
  <https://store.astm.org/e0413-22.html>
  <https://store.astm.org/e0989-21.html>
- INSUL's public technical notes reinforce that professional tools use
  family-specific prediction models for single and double panels, not
  finite lookup tables:
  <https://www.insul.co.nz/tech-info/>

Planning implication:

- source rows are exact evidence, anchors, calibration data, holdouts,
  and benchmarks;
- family-specific physics remains required because real layer
  combinations are effectively unbounded;
- `Rw`/`STC`, `Ln,w`/`IIC`, lab, field, and building-prediction outputs
  must carry explicit basis metadata and must not be silently aliased;
- every non-exact result must expose uncertainty through
  `errorBudgetDb` or `toleranceClass`.

## Clean Execution Plan

### Step 1 - Gate B Shared Airborne Basis Schema

Target:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`

Action:

`gate_b_define_shared_airborne_basis_candidate_schema_without_value_movement`

Implementation scope:

1. add shared airborne basis/candidate schemas, preferably in
   `packages/shared/src/domain/airborne-basis.ts`;
2. export them from `packages/shared/src/index.ts`;
3. add optional `airborneBasis` and `airborneCandidateSet` fields to
   `packages/shared/src/domain/assembly.ts`;
4. create the focused Gate B contract test;
5. add Gate B to `tools/dev/run-calculator-current-gate.ts` only after
   the focused test passes.

Gate B must prove:

- legacy `AssemblyCalculation` payloads still parse without the new
  fields;
- exact/source candidates can carry `measurementStandard` and
  `ratingStandard`;
- prediction candidates can carry `calculationStandard`,
  `ratingStandard`, and `errorBudgetDb` or `toleranceClass`;
- `missingSourceEvidence` and `missingPhysicalInputs` are separate;
- source absence blocks exact/calibration promotion only;
- current Rockwool values remain frozen.

Validation:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts --maxWorkers=1
git diff --check
```

Run `pnpm calculator:gate:current` after Gate B is added to the current
gate runner or after any authority/current-gate alignment change.

### Step 2 - Gate C Rating Adapter Integrity

Inventory and pin ISO 717-1, ISO 717-2, ASTM E413, and ASTM E989
rating paths. Tests must fail if `STC` is copied from `Rw` without a
compatible basis, or if impact ratings are inferred from airborne
curves.

### Step 3 - Gate D Input Completeness Matrix

Define the minimum physical inputs for single leaf, double/framed leaf,
triple leaf, porous fill, floating floor, and field/apparent outputs.
Missing source rows must never become `needs_input`; missing physical
topology, room context, dynamic stiffness, cavity depth, frame coupling,
or absorber properties can.

### Step 4 - Gate E Airborne Candidate Resolver

Extract airborne selection out of `calculate-assembly.ts`. The resolver
must collect exact full-stack source, exact subassembly plus calculated
delta, calibrated physics, uncalibrated family physics, bounded,
screening, `needs_input`, and `unsupported` candidates. It must return
selected and rejected candidates.

### Step 5 - Gate G / M6 First Runtime Prediction

Move grouped Rockwool triple-leaf from `Rw 41` screening to a labelled
`family_physics_prediction` only after Gates B through E have made the
basis, input, resolver, and rating boundaries executable. Exact and
source-validated flags stay false until calibration/exact promotion.

### Step 6 - Calibration, Expansion, Personal-Use Readiness

After the first prediction path exists, source packets return as exact
override, calibration, anchor, benchmark, and holdout work. Then widen
material properties and family solvers, and close with a personal-use
scenario pack that covers wall, floor, exact, anchored, predicted,
field, `needs_input`, unsupported, and hostile layer cases.

## Stop Rules

- no runtime value move in Gate B;
- no non-exact result without uncertainty metadata;
- no field/apparent metric without required room/flanking/context basis;
- no exact/source label without source-owned topology, metric, tolerance,
  and negative boundaries;
- no source-packet absence may block a valid formula-backed prediction;
- no hostile input path may silently become exact, supported, or
  high-confidence.

## Next Agent Instruction

Start with Gate B. Do not re-rank slices, do not return to the old
Rockwool source-packet refresh as the active path, and do not move
runtime numbers. The correct next deliverable is the shared airborne
basis/candidate schema contract plus compatibility tests.
