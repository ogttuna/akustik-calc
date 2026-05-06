# Checkpoint - 2026-05-06 Model-First Physics Prediction Pivot Gate L

Slice: `calculator_model_first_physics_prediction_pivot_v1`

Landed gate:

`gate_l_define_topology_normalizer_and_hostile_input_guard_for_dynamic_calculator`

Selection status:

`gate_l_topology_normalizer_hostile_input_guard_landed_no_runtime_selected_candidate_resolver_gate_m`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-m-dynamic-candidate-resolver-runtime-contract.test.ts`

Selected next action:

`gate_m_populate_dynamic_candidate_resolver_runtime_for_dynamic_calculator`

## What Landed

Gate L adds a no-runtime Dynamic Calculator topology normalizer and
hostile input guard in
`packages/engine/src/dynamic-calculator-topology-normalizer.ts`.

The helper keeps the calculator-first boundary explicit:

- role-defined floor input can be canonicalized by physical role, not UI
  row order;
- contiguous floor layers with the same role and material can be
  coalesced when the role-defined physics is invariant to the split;
- grouped multi-cavity wall order is preserved because leaf/cavity
  indices are physically meaningful;
- ambiguous flat-list multi-cavity walls are never auto-grouped; they
  delegate missing topology prompts to the Gate K route/input contract;
- unsafe multi-cavity wall reorders are blocked with trace instead of
  being treated as value-invariant edits;
- excessive layer counts and invalid thickness values fail closed before
  any design-grade promotion.

## Runtime Boundary

No numeric runtime values moved in Gate L. The normalizer is an exported
contract/helper and is not wired into `calculateAssembly` selection.
Current Dynamic Calculator pins remain:

- explicit grouped Rockwool triple-leaf remains lab `Rw 50 / STC 55 /
  C 0.8 / Ctr -7.3`;
- ACON-like flat-list multi-cavity wall remains guarded with unsupported
  target outputs until grouped topology is explicit;
- source absence remains a source-promotion blocker only, not a physical
  `needs_input` prompt.

## Files Added Or Updated

- `packages/engine/src/dynamic-calculator-topology-normalizer.ts`
- `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-l-topology-normalizer-hostile-input-contract.test.ts`
- `packages/engine/src/index.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`
- `docs/calculator/README.md`

## Validation

Validation for this checkpoint is green in the current working tree:

- focused Gate L contract: 1 file / 9 tests;
- model-first pivot continuity through Gate L: 11 files / 77 tests;
- engine typecheck: passed;
- `pnpm calculator:gate:current`: passed on rerun with engine 292 files
  / 1664 tests, web 61 files / 273 passed + 18 skipped, repo build 5 /
  5 tasks, and whitespace guard green;
- `git diff --check`: passed.

The first `pnpm calculator:gate:current` attempt reached repo build and
failed on a transient Google Fonts fetch timeout for `Fraunces` and
`Instrument Sans`; the immediate rerun completed. The web build still
prints the known non-fatal `sharp/@img` optional dependency warnings,
then completes successfully.

## Next

Gate M should start populating the Dynamic Calculator candidate resolver
runtime surface. It must keep exact source, anchored delta, calibrated
physics, uncalibrated physics, bounded, screening, `needs_input`, and
`unsupported` candidates separate, with basis-compatible ranking and
visible rejected-candidate reasons. Exact measured rows may win only on
exact owned topology/metric/material/tolerance scope.
