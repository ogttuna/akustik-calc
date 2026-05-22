# Checkpoint - Acoustic Calculator Answer Engine V1 Reconciliation - 2026-05-22

Status: checkpoint after reading active docs, comparing the current
implementation, running probes, and re-running the current calculator
gate.

## User Intent

The requested product is simple:

- user brings an acoustic project;
- user chooses wall or floor;
- user enters layers, order, thicknesses, and the extra physical inputs
  that are genuinely required by the selected acoustic route;
- DynEcho returns the acoustic answer: `Rw`, `R'w`, `DnT,w`, `Ln,w`,
  `L'n,w`, STC, `C`, `Ctr`, `CI`, `CI,50-2500`, and related outputs on
  the correct basis.

The product is the answer, not the test suite.

## Method

The answer method must be:

1. exact measured answer when the same construction, metric, and basis
   truly match;
2. compatible measured anchor only when family, topology, metric basis,
   and physical delta are owned;
3. calibrated formula family when calibration evidence applies;
4. source-absent formula family when no matching measured row exists;
5. `needs_input` only when a real physical input needed by that formula
   is missing;
6. `unsupported` only when DynEcho has no bounded method for that basis.

Basis boundaries are mandatory. Lab `Rw` is not field `R'w`, lab
`Ln,w` is not ASTM IIC, and STC must not be copied from `Rw` unless a
named adapter owns that relationship.

## Not Wanted

Do not steer the project toward:

- a source-row catalog as the product;
- a finite scenario library;
- another narrow scenario pack instead of answer selection;
- a broad source crawl as the next move;
- tolerance retuning without measured holdouts;
- low-confidence wording as a substitute for choosing the best owned
  formula;
- lab/field/building or ISO/ASTM aliasing;
- deleting existing solver lanes that can feed the answer engine.

## Documents Reviewed

- `AGENTS.md`
- `docs/README.md`
- `docs/foundation/PROJECT_PLAN.md`
- `docs/calculator/README.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/MASTER_PLAN.md`
- `docs/calculator/PERSONAL_USE_READINESS_ROADMAP.md`
- `docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md`
- `docs/calculator/CALCULATION_MODEL_AND_VALIDATION.md`
- `docs/calculator/SYSTEM_MAP.md`
- `docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md`
- `docs/calculator/ACOUSTIC_CALCULATOR_ANSWER_ENGINE_V1_PLAN_2026-05-21.md`

These documents now agree that the active next work is
`acoustic_calculator_answer_engine_v1_plan` in
`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`.

## Implementation Read

Useful pieces that exist and should be reused:

- exact/source rows and source precedence rules;
- shared layer-combination candidate registry;
- runtime-basis-to-candidate adapter;
- candidate trace surface on engine, API, workbench, replay, and report
  paths;
- single-leaf source-absent formula runtime;
- explicit double-leaf/framed wall source-absent formula runtime;
- grouped/triple-leaf wall lanes;
- floor exact, package-transfer, supported-band, raw-bare,
  helper-only, direct-fixed, field/building boundary, and ASTM/IIC
  blocker lanes.

Missing product layer:

- `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`
  does not exist yet;
- there is not yet one final answer-selection layer that chooses exact
  measured, compatible anchor, calibrated formula, source-absent formula,
  `needs_input`, or `unsupported` before publishing answer values;
- some selected `needs_input` paths still leave acoustic numeric metrics
  in the result object;
- flat double-leaf-like stacks can still fall into screening without a
  layer-combination resolver trace.

## Runtime Probes

Local probes through `calculateAssembly` confirmed:

- single 12.5 mm gypsum board works through
  `candidate_layer_combination_resolver_single_leaf_mass_law_banded_source_absent_family_solver`
  and returns `Rw 31` / STC 31 with candidate trace;
- explicit gypsum / rockwool / gypsum double-leaf context works through
  `candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`
  and returns `Rw 45` / STC 45 / `C -1` / `Ctr -6.1` with candidate
  trace;
- flat gypsum / rockwool / gypsum without topology still returns
  screening fallback `Rw 41` / STC 41 and no layer-combination resolver
  trace;
- resilient-channel double-leaf with missing `resilientBarSideCount`
  selects a `needs_input` airborne basis and candidate, but still
  exposes `Rw 45` / STC 45 / `C -1.7` / `Ctr -6.6` as supported
  metrics. This is the clearest value-leakage gap for Answer Engine V1.

## Validation

Initial `pnpm calculator:gate:current` run failed one stale
documentation-alignment assertion:

- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-a-contract.test.ts`
  still required the active calculator README to contain
  `calculator_model_first_physics_prediction_pivot_v1`.

That test was updated so active docs assert the answer-engine plan, while
the old model-first Gate A remains preserved as historical foundation.

Validation after the update:

- targeted Gate A test: 1 file / 5 tests passed;
- `pnpm calculator:gate:current`: engine 508 files / 2889 tests passed,
  web 94 files / 388 passed + 18 skipped, repo build 5 / 5, whitespace
  guard passed.

Known non-fatal warnings remain:

- Zustand test-storage warnings in web tests;
- optional `sharp/@img` warnings during Next build.

## Current Verdict

This is a good checkpoint for documentation and test-alignment work.
It is not product-ready acoustic calculator behavior yet.

The correct next implementation slice is still:

`acoustic_calculator_answer_engine_v1_plan`

Next file:

`packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`

The next slice should make the existing solver lanes feed one final
calculator answer and should prevent value publication when the selected
answer is `needs_input` or `unsupported`.
