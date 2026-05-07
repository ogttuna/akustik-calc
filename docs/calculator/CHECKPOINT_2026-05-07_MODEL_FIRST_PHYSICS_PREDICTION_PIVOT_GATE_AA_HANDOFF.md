# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate AA

Status: Gate AA landed. Gate AB floor-family/source guard is selected
next.

Selection status:

`gate_aa_construction_image_route_selection_recovered_selected_floor_family_guard_gate_ab`

Landed action:

`gate_aa_construction_image_accuracy_incident_route_selection_and_solver_recovery_plan`

Selected next action:

`gate_ab_construction_image_floor_family_source_guard_and_steel_impact_route_plan`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ab-floor-family-source-guard-contract.test.ts`

## What Changed

Gate AA treats the construction-image shared-wall issue as an accuracy
incident. The previous Dynamic Calculator route selector only promoted
the grouped triple-leaf solver for the old 50/50 mm Rockwool benchmark
fixture. Complete grouped 80/80 mm construction-image topology could
therefore fall to `multileaf_screening_blend` and return about `Rw 40`.

Gate AA replaced that fixture-specific eligibility with a physical
domain gate:

- explicit `grouped_triple_leaf` wall topology;
- side A, cavity 1, internal leaf, cavity 2, and side B groups present;
- two owned positive cavity depths in the current solver domain;
- both cavities full porous absorptive mineral wool;
- internal gypsum leaf present;
- known internal-leaf coupling and support topology.

The shared-wall construction-image stack now reaches
`triple_leaf_two_cavity_frequency_solver` and matches the direct solver:

- `Rw 61`;
- `STC 61`;
- `C -1.7`;
- `Ctr -6.8`;
- selected origin `family_physics_prediction`;
- rejected screening candidate remains lower precedence.

The test also checks 65/95 and 95/65 cavity depths, so this is not a new
80/80 fixture patch. Flat-list ACON-like input still returns
`needs_input` for grouped topology instead of fake solver support.

## Files Touched

- `packages/engine/src/dynamic-airborne-gate-g-rockwool.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-aa-construction-image-accuracy-incident-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/README.md`
- `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
- `docs/calculator/ACCURACY_INCIDENT_2026-05-07_CONSTRUCTION_IMAGE_ROUTE_SELECTION.md`

## Why Gate AB Is Next

Gate AA closes the wall-side route miss for complete grouped
multi-cavity topology. The remaining construction-image incident risk is
floor-side: explicit lightweight-steel / modular floors must not borrow
concrete, timber, or other wrong-family nearby rows as numeric anchors.

Gate AB should add a floor-family source guard and steel/lightweight
impact route plan. It should classify modular steel floors as exact
same-family source, same-family bound, steel-family physics,
`needs_input`, or `unsupported`; it must not use unrelated concrete or
timber rows to own `Ln,w`, `L'n,w`, `L'nT,w`, `Rw`, or `Rw+Ctr`.

## Validation

Baseline before Gate AA changes: `pnpm calculator:gate:current` passed
on 2026-05-07 with engine 306 files / 1744 tests, web 62 files / 275
tests plus 18 skipped, repo build, and whitespace guard. Known optional
`sharp/@img` Next build warnings remained non-fatal.

Post-change validation completed on 2026-05-07:

- focused Gate I/AA/G/J/M regression passed: 5 files / 32 tests;
- `pnpm --filter @dynecho/engine typecheck` passed;
- `pnpm calculator:gate:current` passed with engine 307 files / 1749
  tests, web 62 files / 275 tests plus 18 skipped, repo build, and
  whitespace guard;
- known optional `sharp/@img` Next build warnings remained non-fatal;
- `git diff --check` passed after the validation note update.
