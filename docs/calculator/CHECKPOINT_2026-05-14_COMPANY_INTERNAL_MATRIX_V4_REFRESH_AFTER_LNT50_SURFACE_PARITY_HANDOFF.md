# Company-Internal Matrix V4 Refresh After L'nT,50 Surface Parity Handoff

Date: 2026-05-14

Landed gate:

`company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan`

Selection status:

`company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_landed_selected_opening_leak_building_adapter_owner`

Selected next action:

`company_internal_opening_leak_building_adapter_owner_contract_plan`

Selected next file:

`packages/engine/src/company-internal-opening-leak-building-adapter-owner-contract.test.ts`

Selected next label:

opening/leak building-context adapter owner contract

## What Landed

This is a no-runtime executable matrix refresh after the steel
suspended-ceiling low-frequency `L'nT,50` surface parity gate.

Matrix V4 now has 62 rows. It retires the stale
`floor.lightweight_steel_suspended_ceiling_lnt50.unsupported` row and
imports three explicit rows:

- `floor.lightweight_steel_suspended_ceiling_lnt50.runtime`: complete
  steel suspended-ceiling input with field context and `CI,50-2500 = -1`
  supports lab `Ln,w 51.6`, lab `DeltaLw 22.4`, field `L'n,w 54.6`,
  standardized field `L'nT,w 51.8`, and low-frequency standardized
  field `L'nT,50 50.8`;
- `floor.lightweight_steel_suspended_ceiling_lnt50_missing_ci.unsupported`:
  the same route still supports `Ln,w`, `DeltaLw`, `L'n,w`, and
  `L'nT,w`, but blocks `L'nT,50` when `CI,50-2500` / low-frequency
  spectrum ownership is missing and shows no `L'nT,50` budget;
- `floor.lightweight_steel_suspended_ceiling_lnt50_exact_field_precedence.field`:
  an exact field-band packet supports `L'nT,50 55.0` through
  `exact_source_band_curve_iso7172` and remains separate from the
  source-absent steel adapter.

The promoted runtime row keeps the same landed surface-parity values and
budgets:

- `Ln,w +/-4.5 dB`
- `DeltaLw +/-2 dB`
- `L'n,w +/-5 dB`
- `L'nT,w +/-5.5 dB`
- `L'nT,50 +/-7 dB`

No new calculator runtime value moved in Matrix V4.

## Boundaries

- `L'nT,50 50.8` is source-absent field-adapter output, not measured
  field evidence.
- Missing `CI,50-2500` / low-frequency spectrum ownership keeps
  `L'nT,50` blocked without a promoted `L'nT,50` budget.
- Exact field band packets remain exact precedence and are not merged
  into the source-absent steel row.
- ASTM `IIC` / `AIIC` remain unsupported and are not aliases of ISO
  `Ln,w`, `L'n,w`, `L'nT,w`, or `L'nT,50`.
- Broad source crawling remains lower priority than bounded
  source-absent calculator coverage.

## Next Step

The next bounded action is:

`company_internal_opening_leak_building_adapter_owner_contract_plan`

It should define the owner boundary for opening/leak composite wall
requests when field or building outputs are requested. The selected lane
is ISO-first: it must keep lab `Rw` / `STC`, field/apparent `R'w` /
`DnT,w`, and building-prediction outputs basis-separated, require the
physical field/building context it owns, and avoid reusing the lab
opening/leak area-energy result as a field or building alias.

## Validation

Passed in this working slice:

- Focused engine Matrix V4 contract:
  `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts`
  passed 1 file / 6 tests.
- Adjacent steel low-frequency owner/runtime/surface parity continuity:
  `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-runtime-corridor-contract.test.ts src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-surface-parity-contract.test.ts src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts`
  passed 5 files / 30 tests.
- Engine typecheck passed:
  `pnpm --filter @dynecho/engine typecheck`.
- Engine lint passed:
  `pnpm --filter @dynecho/engine lint`.
- Current gate passed:
  `pnpm calculator:gate:current`.
  Engine final-audit passed 424 files / 2459 tests; web final-audit
  passed 80 files / 340 passed + 18 skipped; repo build passed 5/5.
- Whitespace guard passed through the current gate, and a follow-up
  `git diff --check` was clean.

Known non-fatal validation noise:

- Web tests print expected Zustand persist storage warnings in the
  Node/Vitest environment.
- Next build prints optional `sharp` / `@img` package resolution
  warnings through the proposal document route, then completes
  successfully.
