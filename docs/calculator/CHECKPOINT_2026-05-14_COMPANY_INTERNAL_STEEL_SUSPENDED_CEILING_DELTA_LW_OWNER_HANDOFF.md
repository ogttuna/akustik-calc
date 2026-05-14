# Checkpoint - 2026-05-14 Company-Internal Steel Suspended-Ceiling DeltaLw Owner

## Status

Landed on the company-internal calculation-grade mainline.

Checkpoint file:

`CHECKPOINT_2026-05-14_COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_OWNER_HANDOFF.md`

This checkpoint implements the selected
`company_internal_steel_suspended_ceiling_delta_lw_owner_contract_plan`
after the heavy-composite matrix refresh.

## Runtime / Input Behavior

Steel suspended-ceiling-only floor input still returns the existing lab
`Ln,w 62.2` through
`predictor_lightweight_steel_suspended_ceiling_corridor_estimate`.

`DeltaLw` is not fabricated for suspended-ceiling-only input. When the
user asks for `DeltaLw` on that route, the input surface now exposes a
per-output missing-input owner set:

- `toppingOrFloatingLayer`;
- `resilientLayerDynamicStiffnessMNm3`;
- `loadBasisKgM2`.

Mixed `Ln,w` / `DeltaLw` requests keep the supported `Ln,w` output live
and mark only `DeltaLw` as blocked until the upper/reference package is
owned. The workbench warning now says the lane needs those physical
inputs before calculating `DeltaLw`.

No numeric `DeltaLw` runtime, tolerance, exact-source promotion, ASTM
alias, field alias, or building alias was added by this checkpoint.

## Executable Contract

The landed contract is:

`packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.test.ts`

The implementation surfaces are:

- `packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.ts`;
- `packages/engine/src/steel-floor-formula-input-surface.ts`;
- `apps/web/features/workbench/steel-floor-formula-input-surface.ts`.

The contract asserts:

- the selected company-internal DeltaLw owner lane landed;
- suspended-ceiling-only `DeltaLw` exposes the exact upper/reference
  package missing fields;
- mixed `Ln,w` / `DeltaLw` requests preserve `Ln,w 62.2`;
- `DeltaLw` remains unsupported without the missing owner inputs;
- exact source precedence remains first.

## Selected Next Lane

Selected next action:

`company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan`

Selected next file:

`packages/engine/src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts`

Reason:

After the steel suspended-ceiling `DeltaLw` owner prompt, the next
highest company-internal blocker is airborne building-prediction runtime
ownership: direct curve, flanking energy terms, junction/coupling, room
standardization, and building-prediction uncertainty must be owned before
`R'w` / `DnT,w` can promote beyond `needs_input` / `unsupported`.

## Validation

Focused validation passed:

- engine steel DeltaLw owner + adjacent matrix/BL/BN contracts:
  4 files / 20 tests passed;
- web steel floor input-surface test: 1 file / 6 tests passed;
- `pnpm --filter @dynecho/engine typecheck` passed;
- `pnpm --filter @dynecho/web typecheck` passed.
