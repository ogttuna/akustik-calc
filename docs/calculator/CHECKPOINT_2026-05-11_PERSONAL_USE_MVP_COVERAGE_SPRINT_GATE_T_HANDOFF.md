# Checkpoint 2026-05-11 - Personal-Use MVP Coverage Sprint Gate T

## Landed Gate

`gate_t_personal_use_mvp_opening_leak_composite_surface_parity_plan`

Selection status:

`gate_t_personal_use_mvp_opening_leak_composite_surface_parity_landed_selected_input_surface_gate_u`

Selected next action:

`gate_u_personal_use_mvp_opening_leak_composite_input_surface_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts`

## Scope

Gate T is surface parity only. It does not move the Gate S runtime
value, does not promote source rows, and does not add `STC`,
field/apparent, or building-prediction adapters.

The complete element-lab opening/leak fixture still returns lab `Rw
38.2`, supports only `["Rw"]`, parks `STC`, `R'w`, and `DnT,w`, and
keeps `gate_s_opening_leak_composite_area_energy_runtime_corridor`,
`family_physics_prediction`, and `+/-6 dB` visible.

## Implementation Notes

- Added the Gate T engine contract:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts`.
- Exported the Gate S opening/leak runtime constants from the engine
  package index so web parity tests can compare against engine
  identifiers.
- Added `apps/web/features/workbench/opening-leak-composite-surface.ts`
  as the single web helper for Gate S surface labels, report lines,
  unsupported output copy, missing-input copy, and budget labels.
- Added `apps/web/features/workbench/opening-leak-composite-surface-parity.test.ts`
  to cover route summary, output cards, target-output status, scenario
  summary, method/corridor dossiers, saved replay, calculator API
  payload, Markdown report, and hostile input cases.
- Wired the helper into route branch summary, output cards, output
  posture, target-output status, validation posture, method dossier,
  corridor dossier, and Markdown report composition.

## Boundary Rules Preserved

- `STC`, `R'w`, `DnT,w`, field, and building outputs remain
  unsupported on the Gate S opening/leak corridor.
- Missing opening physical fields surface as `needs_input` with exact
  missing field ids.
- Duplicate openings, excessive opening area, source-absent unbudgeted
  openings, and STC-only opening ratings stay `unsupported`.
- A `+/-6 dB` budget is shown only for promoted lab `Rw`, never for
  blocked opening cases.

## Validation

- Focused Gate T engine contract: 1 file / 3 tests passed.
- Focused Gate T web surface parity: 1 file / 4 tests passed.
- Gate L-T engine continuity: 9 files / 49 tests passed.
- Web opening/airborne/building/output/status continuity: 6 files / 37
  tests passed.
- Gate G-K wall continuity: engine 5 files / 30 tests and web 5 files /
  22 tests passed.
- Engine typecheck passed.
- Web typecheck passed.
- `pnpm calculator:gate:current` passed with engine 361 files / 2088
  tests, web 72 files / 310 passed + 18 skipped, and repo build 5/5
  successful.
- Known non-fatal warnings remain the existing test-storage Zustand
  warning and optional `sharp/@img` package warnings during Next build.
