# Gate AH Opening/Leak STC Spectrum Adapter Handoff - 2026-05-12

## Landed Gate

`gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_plan`

## Selection Status

`gate_ah_personal_use_mvp_opening_leak_stc_spectrum_adapter_landed_selected_surface_parity_gate_ai`

## Selected Next Action

`gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_plan`

## Selected Next File

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ai-opening-leak-stc-surface-parity-contract.test.ts`

## What Changed

Gate AH promotes complete element-lab opening/leak `STC` without
aliasing it from `Rw`. The runtime keeps Gate S as the lab `Rw` owner
and adds an ASTM E413 rating adapter:

`astm_e413_stc_from_airborne_transmission_loss_curve`

The adapter applies the Gate S area-energy opening loss to the selected
host-wall transmission-loss spectrum and then re-rates the shifted curve
with the ASTM E413 contour.

## Runtime Pins

- Complete average-seal opening fixture: `Rw 38.2 / STC 39`.
- High-leakage two-opening matrix row: `Rw 33.7 / STC 34`.
- Error budget stays `+/-6 dB` from the source-absent opening/leak
  corridor.
- `ratingAdapterBasisSet` exposes the ASTM E413 runtime adapter and
  alias blocks.

## Boundaries

- STC-only opening input basis (`stc_single_number`) remains blocked.
- Source-absent opening values without the owned budget remain blocked.
- Duplicate/excessive/hostile opening inputs remain budget-free.
- `R'w`, `DnT,w`, field, and building outputs still do not alias from
  lab `Rw` or lab `STC`.
- No source row, tolerance retune, or broad source crawl is promoted.

## Validation

- `pnpm --filter @dynecho/engine exec vitest run
  src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-s-opening-leak-composite-transmission-loss-runtime-corridor-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-t-opening-leak-composite-surface-parity-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-u-opening-leak-composite-input-surface-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-v-post-opening-leak-input-surface-revalidation-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-w-coverage-matrix-refresh-after-opening-leak-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-z-post-clt-ctr-coverage-revalidation-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-aa-scenario-matrix-v2-expansion-contract.test.ts
  --maxWorkers=1`: 8 files / 39 tests passed.
- `pnpm --filter @dynecho/engine exec vitest run
  src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts
  src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts
  --maxWorkers=1`: 2 files / 11 tests passed.
- `pnpm --filter @dynecho/web exec vitest run
  features/workbench/opening-leak-composite-surface-parity.test.ts
  features/workbench/opening-leak-composite-input-surface-acceptance.test.ts
  --maxWorkers=1`: 2 files / 8 tests passed.
- `pnpm calculator:gate:current`: engine 375 files / 2163 tests passed;
  web 74 files / 318 passed + 18 skipped; repo build 5/5 passed. The
  only build warnings were the existing optional `sharp/@img` package
  warnings through `@turbodocx/html-to-docx`.
- `pnpm check`: lint, typecheck, full test, and build passed. Full test
  included engine 500 files / 2965 tests passed and web 180 files /
  780 passed + 18 skipped.
- `git diff --check`: passed.

## Next Step

Gate AI has now consumed this handoff as
`gate_ai_personal_use_mvp_opening_leak_stc_surface_parity_plan`. Read
[CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md](./CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AI_HANDOFF.md)
for the current Gate AJ revalidation handoff.
