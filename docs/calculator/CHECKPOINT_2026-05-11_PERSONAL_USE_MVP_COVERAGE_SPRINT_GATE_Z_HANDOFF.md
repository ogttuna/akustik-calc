# Personal-Use MVP Coverage Sprint Gate Z Handoff

Date: 2026-05-11

## Status

Gate Z has landed:

`gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_plan`

Selection status:

`gate_z_personal_use_mvp_post_clt_ctr_coverage_revalidation_landed_selected_matrix_v2_expansion_gate_aa`

Selected next action:

`gate_aa_personal_use_mvp_scenario_matrix_v2_expansion_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts`

## What Changed

Gate Z is a no-runtime post-Gate-Y revalidation. It carries the Gate Y
matrix forward, proves the 28-row personal-use MVP coverage matrix has
zero remaining `coverage_gap` rows after the Gate X AAC solver and Gate
Y CLT `Ctr` adapter, and selects the next calculator lane.

No acoustic runtime values, API shapes, workbench input behavior, route
cards, source rows, tolerances, or basis rules moved in Gate Z.

The current matrix summary is:

- 28 rows total.
- `coverage_gap`: 0.
- `none`: 18.
- `correct_block`: 5.
- `hostile_input_refusal`: 2.
- `unsupported_metric`: 1.
- `basis_boundary`: 2.

## Pinned Value Continuity

Gate Z keeps the landed algorithmic rows numerically stable:

- AAC / non-homogeneous masonry lab wall:
  `Rw 44 / STC 44 / C -0.7 / Ctr -5.2` through
  `gate_x_aac_nonhomogeneous_masonry_sharp_davy_family_physics_runtime`.
- CLT / mass-timber lab wall:
  `Rw 42 / STC 42 / C -1.2 / Ctr -6.1` through
  `gate_y_clt_mass_timber_ctr_spectrum_adapter_runtime`.
- Opening/leak composite lab wall:
  `Rw 38.2` through
  `gate_s_opening_leak_composite_area_energy_runtime_corridor`.
- Timber joist impact lab floor:
  `Ln,w 51 / DeltaLw 25.2`.
- CLT / mass-timber impact lab floor:
  `Ln,w 50 / DeltaLw 22.6`.
- Lightweight-steel explicit formula lab floor:
  `Ln,w 55.6 / DeltaLw 22.4`.

## Guardrails

- Building-prediction rows remain `unsupported` until executable
  path-by-path direct, flanking, junction/coupling, room-standardization,
  and budget owners exist.
- ASTM `IIC` / `AIIC` rows remain `unsupported` and are not aliased from
  ISO `Ln,w`.
- Opening/leak `STC`, field, and building requests remain parked until
  their own spectrum/context adapters exist.
- Flat-list multi-cavity stacks still require explicit grouped topology
  instead of guessing leaf/cavity ownership.
- Broad source crawling is not selected because source rows are
  anchors, holdouts, and exact overrides; the current gap-free matrix
  needs broader executable scenario coverage first.

## Gate AA Selection

Gate AA is selected as a scenario matrix v2 expansion because the first
28-row matrix is now gap-free but still too small to call the calculator
personal-use-ready. The next highest-ROI work is to add more realistic
and hostile wall/floor combinations before promoting high-leakage
adapters.

Gate AA should:

1. Add a second matrix layer with realistic combinations not already
   covered by the Gate W/Y matrix.
2. Include common hostile edits: many layers, duplicated roles, split
   leaves, ambiguous support forms, safe reorders, unsafe reorders, and
   partial physical inputs.
3. Preserve exact source precedence, lab/field/building separation,
   missing-input prompts, and numeric pins for all existing rows.
4. Rank the next runtime/input lane from executable matrix evidence
   instead of broad source-row collection.

## Implementation Surfaces

- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-z-post-clt-ctr-coverage-revalidation-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/README.md`
- `AGENTS.md`

## Validation Result

Validation completed on 2026-05-11:

- Focused Gate Z engine contract passed: 1 file / 6 tests.
- Gate X/Y/Z continuity passed: 3 files / 20 tests.
- Engine typecheck passed.
- `pnpm calculator:gate:current` passed: engine 367 files / 2122
  tests, web 73 files / 314 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean.

Known non-fatal output remained unchanged: Zustand storage warnings in
web tests where storage is unavailable, and optional `sharp` package
resolution warnings during Next build. Neither warning failed the check.
