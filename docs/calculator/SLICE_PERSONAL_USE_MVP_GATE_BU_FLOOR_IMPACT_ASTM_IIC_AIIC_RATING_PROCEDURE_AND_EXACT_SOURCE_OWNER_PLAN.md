# Personal-Use MVP Gate BU - Floor-Impact ASTM IIC/AIIC Rating Procedure And Exact-Source Owner Plan

Date: 2026-05-14

## Status

Gate BU is landed as a no-runtime rating procedure and exact-source
owner boundary:

`gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`

Gate BU selection status:

`gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner_closed_no_runtime_selected_rating_curve_owner_scaffold_gate_bv`

Selected next action:

`gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts`

Next plain label: floor-impact ASTM IIC/AIIC rating curve owner scaffold.

Implemented contract file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts`

## Product Intent

Gate BT made it safe for the shared impact schema and target-output
support to carry future ASTM `IIC` and `AIIC` values. Gate BU must now
decide whether the ASTM E989 rating procedure and exact ASTM
source-precedence owner are executable enough to promote runtime, or
whether the correct result is another no-runtime closeout with precise
blockers.

Gate BU closes no-runtime. The shared schema bridge is ready, but there
is still no executable ASTM E989 contour/rating procedure, no exact ASTM
source-precedence runtime owner, no source-absent ASTM uncertainty
owner, and no visible ASTM parity owner.

This is still calculator-first work. Exact ASTM source rows can win
only on true matches once exact-source precedence is owned, but broad
source crawling cannot replace source-absent rating-procedure coverage.
ISO `Ln,w` / `DeltaLw`, ISO field `L'n,w` / `L'nT,w`, and
building-prediction metrics must not alias to ASTM ratings.

## Required Gate BU Ownership

Lab `IIC` must own:

- normalized ASTM impact level curve input owner
- ASTM E989 lab `IIC` contour/rating procedure owner
- exact ASTM source precedence true-match owner
- source-absent rating result origin and uncertainty owner
- visible card/report/API posture owner

Field `AIIC` must own:

- apparent field impact curve input owner
- ASTM E989 field `AIIC` rating procedure owner
- field room/context boundary owner
- exact ASTM source precedence true-match owner
- source-absent rating result origin and uncertainty owner
- visible card/report/API posture owner

## Acceptance Boundaries

Gate BU must prove:

1. Current ISO impact values are not copied into `IIC` or `AIIC`.
2. Lab `IIC` cannot promote without explicit lab curve/rating owner.
3. Field `AIIC` cannot promote without explicit field curve/context and
   rating owner.
4. Exact ASTM source precedence remains first only for true ASTM basis
   matches.
5. Wrong basis, missing rating procedure, missing exact-source owner,
   and building-prediction requests fail closed.
6. If runtime cannot promote yet, the response names the missing owners
   instead of producing a guessed ASTM rating.

## Implementation Order

1. Add the Gate BU contract module and test file.
2. Reuse Gate BT bridge fixtures to prove schema/support readiness.
3. Add executable owner probes for lab `IIC`, field `AIIC`, exact ASTM
   source precedence, and wrong-basis negatives.
4. Decide whether a minimal rating-procedure adapter can calculate a
   value from owned ASTM curves. If not, close Gate BU no-runtime with
   explicit blockers.
5. Keep cards/reports/API out of runtime promotion until a later surface
   parity gate if Gate BU only closes the owner/rating boundary.

## Non-Goals

- Do not ingest source documents or measured values.
- Do not add broad ASTM source crawling.
- Do not alias ISO impact metrics to ASTM ratings.
- Do not present Gate BT fixture values as runtime or measured evidence.

## Validation

Validation passed on 2026-05-14:

- focused Gate BU contract: 1 file / 8 tests passed
- Gate BT + Gate BU continuity: 2 files / 15 tests passed
- `@dynecho/engine` typecheck passed
- `pnpm calculator:gate:current` passed with engine 414 files / 2401
  tests, web 78 files / 334 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean
- `git diff --check` passed
- known non-fatal warnings: optional `sharp/@img` build packages and
  Zustand unavailable test storage
