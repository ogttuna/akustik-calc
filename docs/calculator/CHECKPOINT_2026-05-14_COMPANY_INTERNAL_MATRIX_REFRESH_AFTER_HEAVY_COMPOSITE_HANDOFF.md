# Checkpoint - 2026-05-14 Company-Internal Matrix Refresh After Heavy-Composite

## Status

Landed on the company-internal calculation-grade mainline.

Checkpoint file:

`CHECKPOINT_2026-05-14_COMPANY_INTERNAL_MATRIX_REFRESH_AFTER_HEAVY_COMPOSITE_HANDOFF.md`

This checkpoint refreshes the executable company-internal matrix after
the heavy-composite wall solver cleanup. It does not move runtime values.
Its job is to make the current supported, `needs_input`, `unsupported`,
and parked-boundary rows visible through one current mainline contract.

## Matrix Result

The refreshed matrix has 61 rows:

- 58 rows inherited from the reinforced-concrete cleanup matrix;
- 3 new company-internal rows for heavy-composite lab, heavy-composite
  field, and wall building-prediction missing-input safety.

Heavy-composite wall rows remain value-stable:

- lab `Rw 63 / STC 63 / C -1.4 / Ctr -6.3`;
- field `R'w 60 / Dn,w 60 / DnT,w 61 / DnT,A 60.1`;
- lab basis
  `company_internal_heavy_composite_wall_mass_air_mass_capped_family_physics_runtime`
  with `errorBudgetDb: 8`;
- field basis through the Gate I adapter with `errorBudgetDb: 10`.

The matrix keeps ASTM `IIC` / `AIIC` rows parked as boundary history.
The active implementation path remains ISO-first.

## Selected Next Lane

Selected next action:

`company_internal_steel_suspended_ceiling_delta_lw_owner_contract_plan`

Selected next file:

`packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.test.ts`

Reason:

The strongest current ISO calculation-grade gap is steel
suspended-ceiling-only `DeltaLw`. The route already returns lab
`Ln,w 62.2` through
`predictor_lightweight_steel_suspended_ceiling_corridor_estimate`, but
`DeltaLw` remains unsupported until an upper/reference package owner is
explicit. This is higher priority than parked ASTM work, broad source
crawling, specialized low-frequency `L'nT,50`, or broad building
prediction runtime terms.

## Executable Contract

The landed contract is:

`packages/engine/src/company-internal-calculation-grade-mainline-matrix-refresh-contract.test.ts`

The implementation surface is:

`packages/engine/src/company-internal-calculation-grade-mainline-matrix.ts`

The contract asserts:

- row count and no duplicate row ids;
- heavy-composite lab and field values, basis ids, candidate ids, and
  error budgets;
- building-prediction requests stay `needs_input` with precise missing
  physical fields and no supported output leakage;
- ASTM rows are parked and not selected for runtime work;
- broad source crawling is not selected over a source-absent ISO solver
  owner.

## Validation

Focused validation passed:

- `pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/company-internal-calculation-grade-mainline-matrix-refresh-contract.test.ts`
  - 1 file / 5 tests passed.
- `pnpm --filter @dynecho/engine typecheck`
  - passed.
- `git diff --check`
  - clean.
