# Gate R Opening/Leak Composite Formula Corridor Handoff

Date: 2026-05-11

Gate R landed:

`gate_r_personal_use_mvp_opening_leak_composite_transmission_loss_formula_corridor_plan`

Selection status:

`gate_r_personal_use_mvp_opening_leak_composite_formula_corridor_landed_no_runtime_selected_runtime_corridor_gate_s`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts`

Selected next action:

`gate_s_personal_use_mvp_opening_leak_composite_transmission_loss_runtime_corridor_plan`

## What Changed

- Added
  `packages/engine/src/dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor.ts`.
- Added the Gate R contract test:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts`.
- Added the Gate R test to `tools/dev/run-calculator-current-gate.ts`
  and exported the helper from `packages/engine/src/index.ts`.
- Defined the source-absent opening/leak composite area-energy formula
  corridor for lab `Rw`:
  host-wall transmission coefficient and opening transmission
  coefficients are area-weighted, then converted back to dB.
- Defined explicit seal/leakage penalties:
  `sealed: 0 dB`, `average: 2 dB`, `leaky: 6 dB`, `open_gap: 12 dB`.
- Added a visible `+/-6 dB` source-absent design budget for lab `Rw`
  with terms for host-wall candidate residual, opening single-number
  simplification, seal leakage surrogate, area precision, and same-stack
  opening holdout absence.

## Runtime Boundary

Gate R is no-runtime. It produces a design-corridor estimate, not a
calculator output value. `calculateAssembly` still returns the same
host-wall `Rw` / `STC` values with or without opening inputs.

Gate S must decide runtime promotion separately. It must not promote
unless cards, report/API payloads, support traces, basis labels, exact
source precedence, and no-runtime negative boundaries are all protected.

## Boundary Rules

- Exact measured host-wall rows remain first when they truly match.
- A door/window/opening row cannot replace the host-wall candidate.
- `STC`-only opening values are blocked; they are not aliased to `Rw`.
- Field/building metrics such as `R'w` and `DnT,w` are blocked in this
  lab `Rw` formula corridor.
- Source-absent opening values require a source-absent opening budget
  owner before the formula corridor can be considered complete.
- Missing Gate Q physical fields, duplicate openings, excessive opening
  area, and zero/negative opening area or count remain blocked before
  any formula estimate.
- Safe opening reorders are invariant: the formula estimate remains the
  same and normalized keys remain stable.

## Validation Result

- focused Gate R passed 1 file / 6 tests:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-r-opening-leak-composite-transmission-loss-formula-corridor-contract.test.ts`
- Gate R/Q/P/O/N/M/L plus Gate G/H/I/J/K continuity passed 12 files /
  71 tests.
- full current gate passed:
  `pnpm calculator:gate:current`
- full current-gate result: engine 359 files / 2080 tests, web 71
  files / 306 passed + 18 skipped, repo build 5/5 successful, and
  whitespace guard clean.
- known non-fatal warnings: existing Zustand unavailable test-storage
  warnings and optional sharp package resolution warnings during web
  build.
