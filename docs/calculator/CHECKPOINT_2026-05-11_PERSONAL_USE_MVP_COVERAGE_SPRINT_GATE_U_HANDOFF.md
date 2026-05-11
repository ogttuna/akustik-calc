# Personal-Use MVP Coverage Sprint Gate U Handoff - 2026-05-11

## Status

Gate U has landed:

`gate_u_personal_use_mvp_opening_leak_composite_input_surface_landed_selected_revalidation_gate_v`

Selected next action:

`gate_v_personal_use_mvp_post_opening_leak_input_surface_revalidation_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts`

## What Changed

- Added the workbench opening/leak composite input surface for wall
  studies: host wall area, stable opening ids, opening area/count,
  element `Rw`, rating basis, seal/leakage class, and origin.
- Wired the surface through live scenario evaluation, local saved
  scenario replay, server project snapshots, output cards, Markdown
  report payloads, estimate API payloads, and hostile UI edit checks.
- Kept runtime behavior on the existing Gate S corridor: complete
  UI-derived input returns lab `Rw 38.2`, method
  `gate_s_opening_leak_composite_area_energy_runtime_corridor`, origin
  `family_physics_prediction`, support `["Rw"]`, unsupported
  `["STC", "R'w", "DnT,w"]`, and `+/-6 dB` budget.
- Kept boundaries explicit: partial input is `needs_input`; duplicate
  ids/signatures, excessive opening area, source-absent opening values,
  and STC-only opening ratings are `unsupported` without a promoted
  budget.

## Validation

- `pnpm --filter @dynecho/web typecheck` - passed.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/opening-leak-composite-input-surface-acceptance.test.ts --maxWorkers=1` - passed, with existing Zustand persist storage warnings in the test harness.
- `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts --maxWorkers=1` - 1 file / 3 tests passed.
- `pnpm --filter @dynecho/engine typecheck` - passed.
- Gate G-U engine continuity - 15 files / 82 tests passed.
- Web opening/airborne/wall continuity - 10 files / 55 tests passed.
- `pnpm calculator:gate:current` - passed with engine 362 files /
  2091 tests, web 73 files / 314 passed + 18 skipped, repo build 5/5
  successful, and the current-gate whitespace guard green.
- `git diff --check` - passed.
- Known non-fatal warnings remain the existing Zustand persist storage
  warnings in focused web tests and optional `sharp/@img` package
  warnings during Next build.

## Handoff Notes

Gate V should be a no-runtime revalidation gate. It should prove Gate U
did not disturb Gate T/S/R/Q/P/O/N/M/L opening/building boundaries or
Gate G/H/I/J/K wall route/input-surface continuity, then select the next
bounded personal-use MVP lane from the current ROI matrix.
