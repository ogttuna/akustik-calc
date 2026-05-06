# Checkpoint: Model-First Gate A Revalidation And Commit Handoff

Date: 2026-05-06

Status: checkpoint/revalidation complete; Gate B remains the next step.

## Purpose

This checkpoint is the handoff point after the model-first Gate A
contract landed. It exists so the next agent understands the product
goal before touching implementation:

DynEcho is an acoustic calculator. It must calculate layer-stack
performance with family-specific physics when exact measured data is not
available. Exact/lab/source rows are still the safest answer when they
match the full assembly, and they can also anchor calculated deltas,
calibration, benchmark validation, tolerance ownership, and regression
tests. They are not the whole calculator.

## Current Implementation Reality

- Gate A landed at
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`.
- `tools/dev/run-calculator-current-gate.ts` includes the Gate A
  contract in the current-gate suite.
- Gate B is intentionally absent and remains the next file:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-b-basis-contract.test.ts`.
- `packages/engine/src/calculator-model-first-pivot-gate-a-contract.test.ts`
  may exist as a stale untracked local artifact; do not treat it as the
  landed contract.
- Runtime calculator values did not move.
- Grouped Rockwool triple-leaf still returns `Rw 41` via
  `multileaf_screening_blend`; this is the first planned runtime
  prediction benchmark, not yet fixed.
- `wall-triple-leaf-frequency-solver.ts` can calculate a grouped
  three-leaf/two-cavity curve, but it is still research/runtime
  ineligible until the basis/candidate resolver path is in place.

## Plan Assessment

The active plan is still the correct path. Do not go back to the old
source-packet-first queue as the main implementation strategy.

The next correct implementation step is Gate B:

`gate_b_define_shared_airborne_basis_candidate_schema_without_value_movement`

Why Gate B comes before numeric Rockwool movement:

- airborne/wall currently has no first-class `basis` and `candidateSet`
  equivalent to the impact lane's precedence posture;
- source absence and physical input absence are not yet first-class
  separate fields;
- visible/calculator outputs need exact, anchored-delta, calibrated
  prediction, physics prediction, bounded, screening, needs-input, and
  unsupported origins before the first runtime value move;
- every non-exact result needs `errorBudgetDb` or `toleranceClass`;
- runtime movement needs positive and negative benchmark rows.

## Competitor / INSUL Context

Public INSUL material confirms the category is prediction software, not
a finite lookup table. Marshall Day describes INSUL as software for
predicting sound insulation in walls, floors, roofs, ceilings, and
windows. A distributor description also notes one-third-octave
calculation and construction families including walls, floors, ceilings,
and up to three shells.

DynEcho should treat INSUL as a competitor/category benchmark, not a
target ceiling. The goal is to exceed it for our workflow by making
origin, basis, standards, assumptions, error budget, exact-source
anchors, candidate rejection, UI honesty, and regression tests explicit.

Reference URLs:

- <https://marshallday.com/software>
- <https://www.k5-akustik.de/en/software/insul/>

## Open Gaps

1. Airborne result basis/candidate schema is missing.
2. Rating adapter basis is not explicit enough for `Rw` vs `STC` and
   impact/lab/field separation.
3. Required physical inputs per family are not represented as
   `needs_input` fields.
4. Airborne candidate resolver is still embedded in the current
   `calculate-assembly.ts` / dynamic-airborne flow.
5. Grouped Rockwool triple-leaf prediction is not promoted yet.
6. Material-property widening is needed later for high-accuracy broad
   family coverage, but it should not block the first grouped Rockwool
   prediction gate.

## Validation

Validation completed on 2026-05-06 after this checkpoint update:

- focused Gate A contract passed: 1 file / 5 tests;
- focused V28 history plus Gate A continuity passed: 2 files / 10 tests;
- final `pnpm calculator:gate:current` passed with engine 282 files /
  1592 tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- `git diff --check` passed;
- trailing-whitespace scan passed.

Before implementing Gate B, rerun at minimum:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts --maxWorkers=1
git diff --check
```

Run `pnpm calculator:gate:current` again if any authority doc/string
alignment changes beyond this checkpoint require current-gate contract
coverage.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

## Next Agent Start

1. Read `AGENTS.md`.
2. Read `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`.
3. Read this checkpoint and
   `docs/calculator/CHECKPOINT_2026-05-06_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_GATE_A_HANDOFF.md`.
4. Create the Gate B contract file named above.
5. Do not move numeric runtime values in Gate B.
