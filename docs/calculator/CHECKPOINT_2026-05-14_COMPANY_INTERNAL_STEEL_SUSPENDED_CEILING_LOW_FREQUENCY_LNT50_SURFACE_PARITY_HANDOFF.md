# Company-Internal Steel Suspended-Ceiling Low-Frequency L'nT,50 Surface Parity Handoff

Date: 2026-05-14

Landed gate:

`company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan`

Selection status:

`company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_landed_selected_matrix_v4_refresh`

Selected next action:

`company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`

Selected next file:

`packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts`

Selected next label:

company-internal matrix v4 refresh after steel L'nT,50 surface parity

## What Landed

This is a no-runtime surface parity closeout for the steel suspended-
ceiling low-frequency field route. It keeps the runtime from the
preceding corridor unchanged:

- lab `Ln,w 51.6`
- lab `DeltaLw 22.4`
- field `L'n,w 54.6`
- standardized field `L'nT,w 51.8`
- low-frequency standardized field `L'nT,50 50.8`
- `CI,50-2500 = -1 dB`
- `L'nT,50` basis:
  `estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500`
- `L'nT,50` source-absent field adapter budget: `+/-7 dB`

The visible surfaces now preserve the same low-frequency basis and
budget:

- output cards;
- corridor dossier;
- local saved replay;
- server snapshot replay;
- calculator API payload;
- impact-only API payload;
- Markdown report.

The card copy explicitly says the value is derived from `L'nT,w +
CI,50-2500`, is source-absent field-adapter output, and is not measured
field evidence. Report and dossier copy carry the `+/-7 dB` budget and
the `low_frequency_ci50_2500_owner_precision` term.

## Boundaries

- No runtime value moved in this gate.
- Lab `Ln,w` / `DeltaLw` are not relabelled as measured field evidence.
- ASTM `IIC` / `AIIC` remain unsupported and are not aliases for ISO
  `Ln,w`, `L'n,w`, `L'nT,w`, or `L'nT,50`.
- Missing `CI,50-2500` / low-frequency spectrum ownership still blocks
  `L'nT,50` and carries no `L'nT,50` budget.
- Exact field band packets remain exact precedence and separate from
  this source-absent steel route.

## Next Step

The next bounded action is a company-internal matrix V4 refresh:

`company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`

It should import the landed `L'nT,50 50.8` supported row, keep
missing-`CI,50-2500`, ASTM `IIC` / `AIIC`, and exact-field precedence
negatives, and then re-rank the next company-internal ISO calculator
lane.

## Validation

Passed in this working slice:

- focused engine surface parity contract:
  `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts`
  passed 1 file / 4 tests;
- focused web surface parity test:
  `pnpm --filter @dynecho/web exec vitest run --maxWorkers=1 features/workbench/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity.test.ts`
  passed 1 file / 3 tests;
- adjacent low-frequency runtime / surface parity continuity:
  `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.test.ts`
  passed 4 files / 21 tests;
- adjacent workbench/card/report/API continuity:
  `pnpm --filter @dynecho/web exec vitest run --maxWorkers=1 features/workbench/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity.test.ts features/workbench/company-internal-steel-suspended-ceiling-delta-lw-surface-parity.test.ts features/workbench/steel-floor-formula-card-report-parity.test.ts features/workbench/steel-floor-formula-error-budget-surface-parity.test.ts`
  passed 4 files / 9 tests;
- `pnpm --filter @dynecho/engine typecheck`;
- `pnpm --filter @dynecho/web typecheck`;
- `pnpm --filter @dynecho/engine lint`;
- `pnpm --filter @dynecho/web lint`;
- `pnpm calculator:gate:current` passed:
  engine current gate 423 files / 2453 tests, web current gate 80 files
  / 340 passed + 18 skipped, repo build 5 successful tasks;
- `git diff --check`.

Known non-fatal validation noise remains unchanged: Zustand persist
test-storage warnings in workbench tests and optional `sharp/@img`
package warnings during the Next.js build through the DOCX route.
