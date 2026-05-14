# Personal-Use MVP Gate BW - Floor-Impact ASTM IIC/AIIC Contour Rating Owner Plan

Date: 2026-05-14

## Status

Gate BW is selected but not implemented:

`gate_bw_personal_use_mvp_floor_impact_astm_iic_aiic_contour_rating_owner_plan`

Selected implementation file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bw-floor-impact-astm-iic-aiic-contour-rating-owner-contract.test.ts`

Next plain label: floor-impact ASTM IIC/AIIC contour rating owner.

## Product Intent

Gate BV owns the curve completeness scaffold, but it intentionally does
not calculate `IIC` or `AIIC`. Gate BW should define whether DynEcho can
own an executable ASTM E989 contour/rating procedure without ingesting
standard text or fabricating values.

The goal is calculator-first: if the user requests ASTM `IIC` or
`AIIC`, the engine should either calculate from owned curve/rating terms
or return precise missing-owner prompts. ISO `Ln,w`, `DeltaLw`,
field-impact, building-prediction, and ASTM E413/STC rows remain
separate bases.

## Required Gate BW Scope

Gate BW should define:

- executable rating-procedure ownership over the Gate BV curve scaffold
- separate lab `IIC` and field `AIIC` rating-owner boundaries
- exact ASTM source-precedence runtime owner requirements
- source-absent ASTM uncertainty requirements
- negative boundaries for ISO impact, field/building prediction, and
  ASTM E413/STC aliases
- selection of either a runtime corridor or a no-runtime closeout with
  explicit blockers

## Non-Goals

- Do not ingest ASTM standard text, source documents, or measured source
  values.
- Do not add broad ASTM source crawling.
- Do not alias ISO impact metrics to ASTM ratings.
- Do not present Gate BT fixture values or Gate BV curve probes as
  runtime or measured evidence.
