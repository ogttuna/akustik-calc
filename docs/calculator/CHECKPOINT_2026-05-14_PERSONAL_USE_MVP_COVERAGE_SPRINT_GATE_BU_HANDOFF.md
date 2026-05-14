# Checkpoint - Personal-Use MVP Coverage Sprint Gate BU Handoff

Date: 2026-05-14

## Current State

Gate BU has landed:

`gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`

Gate BU selection status:

`gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_exact_source_owner_closed_no_runtime_selected_rating_curve_owner_scaffold_gate_bv`

Selected next action:

`gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv-floor-impact-astm-iic-aiic-rating-curve-owner-scaffold-contract.test.ts`

Next plain label: floor-impact ASTM IIC/AIIC rating curve owner scaffold.

## What Landed

Gate BU closes the ASTM `IIC` / `AIIC` rating-procedure and exact-source
owner slice as no-runtime. Gate BT's bridge proves the shared schema can
carry ASTM ratings safely, but Gate BU does not promote calculator
values because the ASTM E989 rating procedure and exact-source
precedence route are not executable yet.

Lab `IIC` remains blocked by:

- `astmE492NormalizedImpactLevelCurveOwner`
- `astmE989ExecutableIicContourRatingProcedureOwner`
- `exactAstmSourcePrecedenceRuntimeOwner`
- `astmIicSourceAbsentUncertaintyOwner`
- `astmIicVisibleSurfaceParityOwner`

Field `AIIC` remains blocked by:

- `astmE1007ApparentImpactFieldCurveOwner`
- `astmE989ExecutableAiicApparentRatingProcedureOwner`
- `astmAiicFieldContextOwner`
- `exactAstmSourcePrecedenceRuntimeOwner`
- `astmAiicSourceAbsentUncertaintyOwner`
- `astmAiicVisibleSurfaceParityOwner`

Gate BU also pins exact-source precedence boundaries: only a future
true-match ASTM E989 `IIC` or `AIIC` source row can become an exact
precedence candidate, and even that does not promote runtime at Gate BU.
ISO 717-2 impact rows, ISO field impact rows, building-prediction
outputs, and ASTM E413/STC rows must not alias to ASTM E989 impact
ratings.

## Runtime Boundary

Current real floor-impact runtime still reports:

- supported target outputs: `[]`
- unsupported target outputs: `IIC`, `AIIC`
- runtime `IIC`: absent
- runtime `AIIC`: absent
- Gate BT bridge fixture values: not runtime evidence
- exact ASTM source precedence runtime owner: missing
- ASTM E989 rating procedure owner: missing

## Validation

Gate BU adds:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu.ts`

and:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts`

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

## Next Step

Implement Gate BV:

`gate_bv_personal_use_mvp_floor_impact_astm_iic_aiic_rating_curve_owner_scaffold_plan`

Gate BV should define executable ASTM impact curve owners and the rating
curve scaffold needed before any ASTM E989 runtime value can promote.
It must not ingest source documents, must not add broad source crawling,
and must not alias ISO or building-prediction values to ASTM `IIC` /
`AIIC`.
