# Personal-Use MVP Coverage Sprint Gate AA Handoff

Date: 2026-05-11

## Status

Gate AA has landed:

`gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_plan`

Selection status:

`gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_landed_selected_flat_multicavity_input_surface_gate_ab`

Selected next action:

`gate_ab_personal_use_mvp_flat_multicavity_topology_input_surface_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ab-flat-multicavity-topology-input-surface-contract.test.ts`

## What Changed

Gate AA is a no-runtime scenario matrix v2 expansion. It extends the
gap-free Gate Z matrix from 28 to 40 rows, adds broader realistic and
hostile wall/floor calculator cases, and ranks the next bounded
implementation lane from executable evidence.

No acoustic runtime values, formula constants, tolerances, source rows,
API shapes, workbench inputs, report surfaces, or lab/field/building
basis rules moved in Gate AA.

The current matrix summary is:

- 40 rows total.
- 12 Gate AA matrix v2 rows added.
- `coverage_gap`: 0.
- `none`: 23.
- `correct_block`: 10.
- `hostile_input_refusal`: 3.
- `unsupported_metric`: 2.
- `basis_boundary`: 2.

## Added Matrix Rows

Gate AA adds these rows:

- `wall.double_leaf_split_board_layers.lab`
- `wall.grouped_triple_leaf_safe_reverse_order.lab`
- `wall.flat_multicavity_many_layer_schedule.needs_input`
- `wall.opening_leak_two_openings.lab`
- `wall.opening_leak_stc_target.lab`
- `wall.opening_leak_duplicate_id.refused`
- `wall.building_prediction_partial_context.needs_input`
- `floor.timber_joist_formula_missing_dynamic_stiffness.needs_input`
- `floor.lightweight_steel_formula_missing_spacing.needs_input`
- `floor.lightweight_steel_formula_wrong_family.inactive`
- `floor.clt_mass_timber_field_lnt50.local_guide`
- `floor.heavy_concrete_floating_floor_safe_reorder.lab`

## Pinned Value Continuity

Gate AA keeps the existing Gate Z pins stable and adds value assertions
for realistic rows that already reach owned runtime paths:

- Split-board double-leaf wall:
  `Rw 53 / STC 53 / C -1.7 / Ctr -6.7` through
  `gate_s_double_leaf_framed_bridge_mass_air_mass_bridge_damping_runtime`
  with `+/-7 dB`.
- Safe-reordered grouped triple-leaf wall:
  `Rw 50 / STC 55 / C 0.8 / Ctr -7.3` through
  `triple_leaf_two_cavity_frequency_solver` with `+/-5 dB`.
- Two-opening/leak composite wall:
  `Rw 33.7` through
  `gate_s_opening_leak_composite_area_energy_runtime_corridor` with
  `+/-6 dB`; `STC`, `R'w`, and `DnT,w` remain unsupported.
- CLT / mass-timber field low-frequency local guide:
  `L'nT,50 49` through `mixed_predicted_plus_estimated_local_guide`.
- Heavy concrete floating floor safe reorder:
  `Ln,w 39.2 / DeltaLw 32.6` through
  `predictor_heavy_floating_floor_iso12354_annexc_estimate`.

## Guardrails

- Flat-list multi-cavity walls still block as `needs_input` until the
  user supplies explicit leaf, cavity, internal-leaf, coupling, and
  support-topology ownership. Gate AA does not infer a triple-leaf
  topology from layer order alone.
- Opening/leak `STC` remains unsupported until a spectrum adapter owns
  that rating basis. Duplicate opening ids are refused.
- Building-prediction rows remain blocked until room, flanking,
  junction/coupling, and output-basis owners are explicit.
- Timber and lightweight-steel floor formula rows keep exact missing
  physical input prompts instead of borrowing adjacent family rows.
- ASTM `IIC` / `AIIC` remains a boundary and is not aliased from ISO
  `Ln,w`.
- Broad source crawling remains unselected. Source rows are still exact
  overrides, anchors, calibration evidence, holdouts, and bounds rather
  than the product itself.

## Gate AB Selection

Gate AA selects the flat multicavity topology input surface for Gate AB.
The evidence is the new many-layer wall row: it is realistic,
user-frequency is high, basis leakage risk is low if it stays
`needs_input`, and the next unlock is explicit topology capture rather
than a runtime formula retune.

Gate AB should:

1. Add a first-class input contract for flat multi-cavity wall stacks
   that asks for side A leaf group, cavity depths, internal leaf group,
   internal leaf coupling, side B leaf group, and support topology.
2. Keep ambiguous many-layer stacks parked as `needs_input` until that
   owner set is explicit.
3. Preserve safe grouped triple-leaf runtime and safe reorder behavior.
4. Avoid opening/STC, ASTM, building-prediction, and broad source-crawl
   promotion unless the matrix evidence changes.

## Implementation Surfaces

- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/README.md`
- `AGENTS.md`

## Validation Result

Validation completed on 2026-05-11:

- Focused Gate AA engine contract passed: 1 file / 6 tests.
- Gate X/Y/Z/AA continuity passed: 4 files / 26 tests.
- Engine typecheck passed.
- `pnpm calculator:gate:current` passed: engine 368 files / 2128
  tests, web 73 files / 314 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean.

Known non-fatal output remained unchanged: Zustand storage warnings in
web tests where storage is unavailable, and optional `sharp` package
resolution warnings during Next build. Neither warning failed the check.
