# Gate BM Post Steel Suspended-Ceiling Input Surface Revalidation Plan

Status: LANDED / NO-RUNTIME / SELECTED GATE BN

Date: 2026-05-14

## Purpose

Gate BL moved a user-facing steel-floor input surface. Gate BM is the
post-input-surface revalidation gate: it proves that movement did not
retune or leak adjacent steel/floor-impact routes.

Gate BM does not add a new formula, source row, UI field, or tolerance.
It re-runs the owned steel suspended-ceiling-only path and adjacent
impact routes through executable checks.

## Revalidated Pins

- Gate BK steel suspended-ceiling-only runtime stays lab `Ln,w 62.2`.
- Gate BK suspended-ceiling `Ln,w` budget stays `+/-6 dB`.
- Gate AD steel upper/lower runtime stays lab `Ln,w 55.6` /
  `DeltaLw 22.4`.
- Gate AD tolerances stay `+/-4.5 dB` for `Ln,w` and `+/-2 dB` for
  `DeltaLw`.
- Exact steel source rows still outrank both steel formula lanes.
- Gate BJ field/building impact adapters keep separate basis and error
  budgets.
- `DeltaLw`, ASTM `IIC` / `AIIC`, and `L'nT,50` remain unsupported from
  the suspended-ceiling-only lane unless a later owner lands them.
- Adjacent heavy-concrete source-absent lane stays `Ln,w 44.4` /
  `DeltaLw 30.1`.

## Acceptance

Gate BM is accepted only if:

1. complete UI-derived steel suspended-ceiling input returns the Gate BK
   `predictor_lightweight_steel_suspended_ceiling_corridor_estimate`;
2. safe floor-row reorder keeps the same value and budget;
3. partial steel owner input names missing physical fields instead of
   returning a final low-confidence value;
4. duplicate steel carrier ownership stays `unsafe_topology`;
5. field/building adapters stay basis-separated and keep `L'nT,50`
   blocked;
6. exact source precedence and adjacent source-absent lanes are
   unchanged;
7. docs and `pnpm calculator:gate:current` include the Gate BM contract.

## Selected Next

Gate BM selects a no-runtime coverage matrix refresh:

`gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_plan`

Selected file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bn-coverage-matrix-refresh-after-steel-suspended-ceiling-contract.test.ts`

Gate BN should add the new steel suspended-ceiling rows to the executable
Personal-Use MVP coverage matrix and then choose the next highest-ROI
calculator coverage lane. It should not retune Gate BK or reopen broad
source crawling.
