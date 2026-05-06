# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate K

Slice: `calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_k_define_route_input_topology_contracts_for_dynamic_calculator`

Selection status:

`gate_k_route_input_topology_contract_landed_no_runtime_selected_topology_normalizer_gate_l`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`

Selected next action:

`gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator`

## What Landed

Gate K adds a no-runtime Dynamic Calculator route/input topology contract
in `packages/engine/src/dynamic-calculator-route-input-topology.ts`.
The helper assesses `wall` and `floor` routes, output basis
(`element_lab`, `field_apparent`, `building_prediction`), route family,
unsupported outputs, missing physical inputs, source-evidence absence,
and machine-readable prompts before runtime values move.

The contract keeps the calculator-first boundary explicit:

- source absence is recorded as `exact_full_stack_source_absent`, but it
  blocks exact/calibrated source promotion only and does not become a
  `needs_input` prompt by itself;
- missing physical topology, material, floor-role, or room/context data
  does produce targeted `needs_input` prompts;
- complete grouped Rockwool triple-leaf topology stays calculable with
  explicit engineering-default uncertainty posture;
- ACON-like flat-list multi-cavity walls ask for side A leaf group,
  cavity 1 depth, internal leaf group/coupling, cavity 2 depth, side B
  leaf group, and support topology instead of inventing a design-grade
  answer;
- field/apparent and building-prediction outputs ask for output basis,
  partition area, receiving-room volume, receiving-room RT60, and
  flanking/junction class where required;
- floating-floor impact routes ask for resilient-layer dynamic stiffness
  and load basis, while unsupported `IIC`/`AIIC` style outputs stay out
  of runtime support.

## Runtime Boundary

No numeric runtime values moved in Gate K. The existing Dynamic
Calculator behavior is intentionally pinned:

- explicit grouped Rockwool triple-leaf remains lab `Rw 50 / STC 55 /
  C 0.8 / Ctr -7.3`;
- ACON-like flat-list multi-cavity wall remains guarded with unsupported
  target outputs until grouped topology is explicit;
- current floor runtime support remains `Rw` and `Ln,w`; `DeltaLw`,
  `L'n,w`, and `L'nT,w` stay unsupported in the current calculator
  output path.

## Files Added Or Updated

- `packages/engine/src/dynamic-calculator-route-input-topology.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-k-route-input-topology-contract.test.ts`
- `packages/engine/src/index.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
- `docs/calculator/README.md`

## Validation

Validation for this checkpoint is green in the current working tree:

- focused Gate K contract: 1 file / 8 tests;
- model-first pivot continuity through Gate K: 10 files / 68 tests;
- engine typecheck: passed;
- `pnpm calculator:gate:current`: passed with engine 291 files / 1655
  tests, web 61 files / 273 passed + 18 skipped, repo build 5 / 5 tasks,
  and whitespace guard green;
- `git diff --check`: passed.

The web build still prints the known non-fatal `sharp/@img` optional
dependency warnings, then completes successfully.

## Next

Gate L should define the topology normalizer and hostile input guard for
the Dynamic Calculator. It should normalize only physically invariant
input edits, keep order where order is acoustically meaningful, ask for
grouped topology when flat input is ambiguous, and stress-test many
layers, duplicates, splits, unsafe reorders, and invalid thicknesses
before any further runtime promotion.
