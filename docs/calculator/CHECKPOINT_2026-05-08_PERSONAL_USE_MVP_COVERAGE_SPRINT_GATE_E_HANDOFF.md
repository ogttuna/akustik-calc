# Checkpoint 2026-05-08 - Personal-Use MVP Coverage Sprint Gate E Handoff

## Scope

Gate E lands visible/API/report parity for the timber/CLT floor-impact
`DeltaLw` runtime corridor promoted in Gate D. This is a surface-parity
move, not a formula retune and not a source-row promotion.

Landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-e-timber-clt-floor-impact-delta-lw-surface-parity-contract.test.ts`

Landed web proof:

`apps/web/features/workbench/timber-clt-delta-lw-surface-parity.test.ts`

Landed action:

`gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_plan`

Selection status:

`gate_e_personal_use_mvp_timber_clt_floor_impact_delta_lw_surface_parity_landed_selected_input_surface_gate_f`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-f-timber-clt-floor-impact-delta-lw-input-surface-contract.test.ts`

Selected next action:

`gate_f_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_surface_plan`

## Result

- Added a web-facing timber/CLT `DeltaLw` corridor view helper so output
  cards can label the formula companion without relabelling `Ln,w`.
- Timber exact `Ln,w 51` remains an exact floor-family metric, while
  timber `DeltaLw 25.2` is shown as a source-absent timber joist formula
  corridor with `+/-7.5 dB` budget and not-measured-evidence copy.
- CLT family `Ln,w 50` remains a family estimate, while CLT
  `DeltaLw 22.6` is shown as a source-absent mass-timber CLT formula
  corridor with the same visible budget posture.
- Output cards, output posture, metric-basis copy, corridor dossier,
  method dossier, dynamic trace panel, Markdown report, calculator API,
  and impact-only API all preserve the same value, metric basis, and
  structured error budget.
- Missing physical inputs, field-impact requests, ASTM `IIC` / `AIIC`,
  `Ln,w`-only requests, and wrong-family steel requests remain
  budget-free and do not alias into timber/CLT `DeltaLw`.

## Gate F Entry Criteria

Gate F is selected for the first-class input surface. It must make the
same timber/CLT physical fields enter from the Dynamic Calculator UI and
snapshot/API bridge instead of requiring only explicit engine predictor
input. Runtime formulas must remain unchanged, exact rows must still
win, and partial input must stay parked with precise missing fields.

## Validation

Validation completed on 2026-05-08:

- focused Gate E engine contract passed 1 file / 4 tests;
- focused Gate E web surface/API contract passed 1 file / 4 tests;
- Gate D/E continuity passed 2 files / 11 tests;
- Gate BI/A/B/C/D/E continuity passed 6 files / 40 tests;
- web steel/timber parity continuity passed 3 files / 7 tests;
- engine typecheck passed;
- final `pnpm calculator:gate:current` passed with engine 346 files /
  2005 tests, web 67 files / 290 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean;
- `git diff --check` passed after the validation-result doc updates.

Known non-fatal warnings remain the existing Zustand unavailable
test-storage warnings and optional `sharp/@img` package resolution
warnings during the Next build.
