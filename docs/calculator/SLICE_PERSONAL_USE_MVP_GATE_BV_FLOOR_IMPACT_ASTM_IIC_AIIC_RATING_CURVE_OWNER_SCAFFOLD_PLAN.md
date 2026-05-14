# Personal-Use MVP Gate BV - Floor-Impact ASTM IIC/AIIC Rating Curve Owner Scaffold Plan

Date: 2026-05-14

## Status

Gate BV is landed as a no-runtime rating curve owner scaffold:

`gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`

Gate BV selection status:

`gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_landed_no_runtime_selected_contour_rating_owner_gate_bw`

Selected next action:

`gate_bw_personal_use_mvp_floor_impact_astm_iic_aiic_contour_rating_owner_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bw-floor-impact-astm-iic-aiic-contour-rating-owner-contract.test.ts`

Next plain label: floor-impact ASTM IIC/AIIC contour rating owner.

Implemented contract file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts`

## Product Intent

Gate BU proved that the remaining ASTM blocker is not shared schema
support; it is the executable curve/rating owner. Gate BV should define
the minimal internal contract for ASTM impact curves and the E989 rating
scaffold without ingesting ASTM standard text, source documents, or
measured values.

The goal is to make a later runtime gate possible without guessing:
if the user asks for `IIC` or `AIIC`, DynEcho must either own the ASTM
curve/rating inputs or return precise missing-owner prompts.

## Required Gate BV Scope

Gate BV should define:

- lab `IIC` curve input ownership for normalized impact level bands
- field `AIIC` curve input ownership for apparent field impact bands
- required band-set identity and curve completeness checks
- exact ASTM source precedence hook points, still no runtime promotion
- no-alias negatives for ISO `Ln,w`, `DeltaLw`, `L'n,w`, `L'nT,w`,
  building-prediction outputs, and ASTM E413/STC rows

## Non-Goals

- Do not implement final runtime `IIC` / `AIIC` values unless the rating
  procedure is fully owned and tested.
- Do not use Gate BT bridge fixture values as calculator results.
- Do not ingest standard text, source documents, or measured source
  values.
- Do not add broad source crawling.

## Landed Boundary

Gate BV owns the declared ASTM impact one-third-octave curve
completeness scaffold for lab `IIC` and field `AIIC`. It checks missing,
extra, duplicate, and non-finite band centers and keeps field `AIIC`
blocked until field context is owned. It also opens future exact ASTM
hook points without ingesting source documents or measured values.

Gate BV does not promote runtime because the executable ASTM E989
contour/rating owner, exact ASTM source-precedence runtime owner,
source-absent ASTM uncertainty, and visible parity are still missing.
ISO `Ln,w` / `DeltaLw`, ISO field impact outputs, building-prediction
outputs, and ASTM E413/STC rows remain non-aliasable.

## Validation

Validation passed on 2026-05-14:

- focused Gate BV contract: 1 file / 8 tests passed
- focused Gate BT + Gate BV continuity: 2 files / 15 tests passed
- `@dynecho/engine` typecheck passed
- `pnpm calculator:gate:current` passed with engine 415 files / 2409
  tests, web 78 files / 334 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean
- `git diff --check` passed
- known non-fatal warnings: optional `sharp/@img` build packages and
  Zustand unavailable test storage
