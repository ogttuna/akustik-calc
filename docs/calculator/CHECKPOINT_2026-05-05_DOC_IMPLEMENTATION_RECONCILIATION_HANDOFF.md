# Checkpoint: Doc / Implementation Reconciliation Handoff

Date: 2026-05-05

Status: documentation and implementation reconciliation complete; no
runtime behavior changed.

## Purpose

Remove the active-direction confusion around source packets versus
calculation. The calculator direction is:

- use exact lab/source rows when a whole-stack match exists;
- use exact subassemblies as anchors when they help;
- otherwise calculate with family-specific physics when required inputs
  are sufficient;
- use source/lab data for exact override, calibration, benchmark
  validation, tolerance ownership, and regression tests;
- do not let missing source packets block labelled formula-backed
  predictions.

## Docs Inventory

- repository docs inventoried: 398 files under `docs`;
- calculator docs inventoried: 355 files under `docs/calculator`;
- active/current/source-blocked references searched across
  `docs/calculator` and `AGENTS.md`;
- authority docs read and compared against implementation:
  - `AGENTS.md`;
  - `docs/calculator/README.md`;
  - `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`;
  - `docs/calculator/CURRENT_STATE.md`;
  - `docs/calculator/SYSTEM_MAP.md`;
  - `docs/calculator/MASTER_PLAN.md`;
  - `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`;
  - `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`;
  - `docs/calculator/CHECKPOINT_2026-05-05_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_REPLAN_HANDOFF.md`.

Older dated `CHECKPOINT_*` and `SLICE_*` files are intentionally kept as
historical snapshots. Their "current", "active", and "selected next"
phrases are only authoritative for the date/slice they recorded unless
promoted again by the current authority docs.

## Implementation Comparison

| Claim | Implementation state | Result |
| --- | --- | --- |
| Active slice is `calculator_model_first_physics_prediction_pivot_v1`. | `AGENTS.md`, `NEXT_IMPLEMENTATION_PLAN.md`, and `CURRENT_STATE.md` now point to this slice. | Aligned. |
| Selected Gate A file is `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`. | File is intentionally absent until the next implementation step. | Aligned as next action. |
| Stale similarly named model-first test must not be treated as landed. | `packages/engine/src/calculator-model-first-pivot-gate-a-contract.test.ts` exists as an untracked local artifact. | Documented as stale/partial unless reviewed and replaced. |
| Runtime grouped Rockwool triple-leaf is not fixed yet. | `dynamic-airborne.ts` still selects `multileaf_screening_blend`; current grouped path remains `Rw 41`. | Aligned with docs. |
| Missing Rockwool/Uris source packet blocks exact promotion only. | Existing source-packet blockers still exist, but the active plan now demotes them to exact-source/calibration backlog. | Aligned in docs; runtime pivot still pending. |
| Airborne needs a first-class candidate/basis resolver. | `calculate-assembly.ts` composes dynamic/catalog/support decisions without unified airborne candidate origins. | Correctly identified as implementation gap. |
| Whole-stack exact anchoring exists, partial anchor plus delta does not. | `airborne-verified-catalog.ts` contains exact/lab-fallback matching; no partial anchor-plus-delta candidate path found. | Correctly identified as implementation gap. |
| Impact has the closest precedent model. | `impact-lane.ts` already encodes precedence across exact, bounds, catalog, explicit deltas, predictor lanes, and fallback states. | Correctly identified as pattern to copy. |
| Triple-leaf physics code exists but is not live. | `wall-triple-leaf-frequency-solver.ts` returns finite ratings but marks results `researchOnly: true`, `runtimeEligible: false`, `sourceOwned: false`. | Correctly identified as benchmark, not live answer. |
| Shared API lacks model-first airborne basis fields. | `packages/shared/src/domain/assembly.ts` and `dynamic-airborne.ts` expose current method/trace shapes, not the planned exact/anchored/calibrated/prediction basis model. | Correctly identified as implementation gap. |

## Docs Fixed In This Pass

- `docs/calculator/README.md`
  - replaced stale April resume triangle with 2026-05-05 model-first
    source of truth;
  - explicitly marked old checkpoints/slices as historical snapshots;
  - documented the absent selected Gate A file and stale local artifact.
- `docs/calculator/SYSTEM_MAP.md`
  - updated review date and read order;
  - added active model-first correction;
  - replaced stale "wall single-leaf selected" wording with historical
    context;
  - updated answer model and reading guide to point to the model-first
    plan.
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
  - renamed the old V28/Rockwool source-packet section to a historical
    decision map;
  - added an explicit chronology boundary before older plan blocks.
- `docs/calculator/CURRENT_STATE.md`
  - kept the active model-first slice as current;
  - marked the V28 section as historical;
  - added an explicit chronology boundary before older state blocks.
- `AGENTS.md`
  - promoted this reconciliation checkpoint directly under the active
    next plan;
  - marked older authority entries as historical/backlog context unless
    promoted by current workflow.

## Current Next Step

Create the selected Gate A contract:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`

Gate A must stay no-runtime and lock the corrected airborne candidate
basis contract:

1. exact full-stack source row;
2. exact subassembly plus calculated delta;
3. calibrated family physics;
4. family physics prediction;
5. bounded prediction;
6. screening fallback;
7. `needs_input`;
8. `unsupported`.

It must assert that the Rockwool/Uris source packet is only an
exact-promotion blocker and not a blocker for formula-backed prediction.

## Validation

This pass changed docs only. Runtime tests were not run because runtime
behavior did not change. Handoff checks passed:

- `git diff --check`;
- trailing-whitespace scan over changed authority docs.
