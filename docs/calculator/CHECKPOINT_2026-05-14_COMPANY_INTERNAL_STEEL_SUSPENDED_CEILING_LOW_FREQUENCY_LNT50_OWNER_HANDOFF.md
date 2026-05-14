# Company-Internal Steel Suspended-Ceiling Low-Frequency L'nT,50 Owner Handoff

Date: 2026-05-14

Landed gate:

`company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan`

Selection status:

`company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_landed_no_runtime_selected_runtime_corridor`

Selected next action:

`company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`

Selected next file:

`packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts`

## What Landed

This is a no-runtime owner contract for the steel suspended-ceiling
`L'nT,50` gap selected by Matrix V3.

The landed steel lab anchor remains frozen:

- lab `Ln,w 51.6`
- lab `DeltaLw 22.4`
- basis:
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`
- budgets: `Ln,w +/-4.5 dB` and `DeltaLw +/-2 dB`

The complete field adapter can still derive `L'n,w 54.6` and
`L'nT,w 51.8` from explicit `fieldKDb` and receiving-room volume, but
`L'nT,50` remains unsupported because no low-frequency owner exists yet.

The owner contract names the required owner surface for runtime
promotion:

- `impactFieldContext`
- `receivingRoomVolumeM3`
- `lowFrequencyImpactSpectrumOrCI50_2500Owner`
- `lnt50MetricBasisOwner`
- `lnt50SourceAbsentErrorBudgetOwner`

Allowed future owner routes are:

- `field_volume_plus_ci50_2500`
- `local_guide_lnwci_plus_k_plus_hd`
- `exact_field_band_curve`

## Boundaries

- `L'nT,50` does not inherit the lab `Ln,w` / `DeltaLw` formula budget.
- `L'nT,50` does not inherit the field `L'n,w` / `L'nT,w` adapter
  budget.
- ASTM `IIC` / `AIIC` are still blocked and are not aliases for ISO
  low-frequency impact metrics.
- Exact field band packets can already own `L'nT,50` as exact evidence,
  but that is separate from the source-absent steel runtime corridor and
  does not move the current formula values.

## Validation

Focused owner contract:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`

Result: passed, 1 file / 6 tests.

Nearby company-internal continuity:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts`

Result: passed, 4 files / 21 tests.

Full current gate:

`pnpm calculator:gate:current`

Result: passed with engine 421 files / 2441 tests, web 79 files / 337
passed + 18 skipped, repo build 5/5, and whitespace guard clean.
Known non-fatal warnings: optional `sharp/@img` build packages and
Zustand unavailable test storage.

The next bounded step is the steel suspended-ceiling low-frequency
`L'nT,50` runtime corridor. It should only promote when the owner
contract's low-frequency spectrum / `CI,50-2500` route, metric basis,
and `L'nT,50` error budget are executable and visible.
