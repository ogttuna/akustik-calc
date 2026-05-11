# Personal-Use MVP Coverage Sprint Gate V Handoff - 2026-05-11

## Status

Gate V has landed:

`gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_w`

Selected next action:

`gate_w_personal_use_mvp_coverage_matrix_refresh_after_opening_leak_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts`

## What Changed

- Added a no-runtime revalidation contract after the Gate U
  opening/leak input surface.
- Re-pinned the UI-derived opening/leak runtime fixture at lab
  `Rw 38.2`, method
  `gate_s_opening_leak_composite_area_energy_runtime_corridor`, origin
  `family_physics_prediction`, supported `["Rw"]`, unsupported
  `["STC", "R'w", "DnT,w"]`, and `+/-6 dB` budget.
- Re-asserted that field airborne requests stay on the Gate I field
  adapter and that building-prediction requests with opening inputs stay
  parked on the Gate N/O/P building boundary rather than borrowing the
  Gate S lab opening corridor.
- Recorded the next-lane decision: after Gates B-U, the original MVP
  matrix lanes have either landed or been deliberately parked behind
  missing owners, so Gate W should refresh the executable coverage
  matrix before selecting another solver lane or source target.

## Validation

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts --maxWorkers=1`
  - 1 file / 5 tests passed.
- Gate G-U/V engine continuity
  - 16 files / 87 tests passed.
- `pnpm --filter @dynecho/engine typecheck`
  - passed.
- `pnpm calculator:gate:current`
  - engine: 363 files / 2096 tests passed.
  - web: 73 files / 314 passed + 18 skipped.
  - repo build: 5/5 successful.
  - whitespace guard: passed.
- Known non-fatal warnings remain the existing Zustand persist
  test-storage warnings and optional `sharp/@img` package warnings
  during Next build.

## Handoff Notes

Gate W should not be a broad source crawl. It should refresh the
Personal-Use MVP matrix with current runtime values, basis labels,
support buckets, visible-surface parity targets, hostile variants, and
remaining `needs_input` / `unsupported` blockers, then select exactly
one bounded Gate X lane by coverage ROI and basis-leakage risk.
