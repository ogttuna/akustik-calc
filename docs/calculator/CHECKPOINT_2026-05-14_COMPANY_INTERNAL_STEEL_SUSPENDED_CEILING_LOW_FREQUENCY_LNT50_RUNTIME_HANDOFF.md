# Company-Internal Steel Suspended-Ceiling Low-Frequency L'nT,50 Runtime Handoff

Date: 2026-05-14

Landed gate:

`company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_plan`

Selection status:

`company_internal_steel_suspended_ceiling_low_frequency_lnt50_runtime_corridor_landed_selected_surface_parity`

Selected next action:

`company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`

Selected next file:

`packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`

Selected next label:

steel suspended-ceiling L'nT,50 card/report/API parity

## What Landed

The steel suspended-ceiling source-absent field route now calculates
`L'nT,50` when the low-frequency owner is explicit.

Complete runtime input keeps the lab anchor frozen:

- lab `Ln,w 51.6`
- lab `DeltaLw 22.4`
- basis:
  `predictor_lightweight_steel_mass_spring_holdout_corridor_estimate`
- lab budgets: `Ln,w +/-4.5 dB` and `DeltaLw +/-2 dB`

The complete field context is:

- `fieldKDb = 3`
- receiving-room volume `60 m3`
- `CI,50-2500 = -1 dB`

That complete route now returns:

- `L'n,w 54.6`
- `L'nT,w 51.8`
- `L'nT,50 50.8`
- `L'nT,50` metric basis:
  `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`
- `L'nT,50` source-absent field adapter budget: `+/-7 dB`

The Dynamic Calculator gate now treats explicit `ci50_2500Db` in
`impactFieldContext` as the low-frequency owner. Without that owner,
`L'n,w` / `L'nT,w` remain available but `L'nT,50` stays unsupported and
budget-free.

## Boundaries

- ASTM `IIC` / `AIIC` remain unsupported and are not aliases for ISO
  low-frequency impact metrics.
- `L'nT,50` does not promote from lab `Ln,w` / `DeltaLw` alone.
- Missing `CI,50-2500` / low-frequency spectrum ownership still blocks
  `L'nT,50`.
- Exact field band packets still win as exact evidence and remain
  separate from this source-absent steel runtime corridor.
- The new `L'nT,50` budget is not measured evidence.

## Validation

Focused runtime contract:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts`

Result: passed, 1 file / 8 tests.

Continuity set:

`pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts`

Result: passed, 5 files / 29 tests.

Typecheck and lint:

- `pnpm --filter @dynecho/shared typecheck`: passed.
- `pnpm --filter @dynecho/engine typecheck`: passed.
- `pnpm --filter @dynecho/web typecheck`: passed.
- `pnpm --filter @dynecho/shared lint`: passed.
- `pnpm --filter @dynecho/engine lint`: passed after unused-symbol
  cleanup.
- `pnpm --filter @dynecho/web lint`: passed.

Full current gate:

`pnpm calculator:gate:current`

Result: passed. Engine focused gate: 422 files / 2449 tests. Web
focused gate: 79 files / 337 passed + 18 skipped. Repo build: 5/5
tasks successful. The only build warnings were the known optional
`sharp/@img` resolution warnings from `@turbodocx/html-to-docx`.

Whitespace guard:

`git diff --check`

Result: passed.

The next bounded step is surface parity for the same `L'nT,50` runtime:
cards, dynamic trace, support notes, saved replay, calculator API,
impact-only API, and Markdown report must all show the same value,
metric basis, and `+/-7 dB` source-absent budget.
