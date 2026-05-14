# Personal-Use MVP Gate BT - Floor-Impact ASTM IIC/AIIC Metric Schema And Adapter Bridge Plan

Date: 2026-05-14

## Status

Gate BT is landed as a no-runtime metric schema and adapter bridge:

`gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`

Gate BT selection status:

`gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge_landed_no_runtime_selected_rating_procedure_exact_source_owner_gate_bu`

Selected next action:

`gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts`

Next plain label: floor-impact ASTM IIC/AIIC rating procedure and exact-source owner.

## Product Intent

Gate BS proved that the ASTM lab `IIC` and field `AIIC` owner groups
could not promote runtime because the shared impact result surface did
not own ASTM metric value slots, ASTM metric-basis labels, or target
output support. Gate BT closes only that bridge. It does not implement
the ASTM E989 rating procedure, does not ingest source rows, and does
not move runtime calculator values.

This keeps DynEcho calculator-first: the schema can now carry future
ASTM impact ratings honestly when a later gate owns the rating
procedure and exact ASTM source precedence. ISO `Ln,w` / `DeltaLw`,
ISO field impact values, and building-prediction values still must not
alias to ASTM ratings.

## What Gate BT Owns

Gate BT adds explicit shared impact ownership for:

- `impactCalculationIicMetricValueOwner`
- `impactCalculationAiicMetricValueOwner`
- `impactMetricBasisIicOwner`
- `impactMetricBasisAiicOwner`
- `targetOutputSupportAstmIicOwner`
- `targetOutputSupportAstmAiicOwner`

`ImpactCalculation` may carry `IIC` only with:

- basis `astm_e989_impact_rating_metric_schema_adapter_bridge`
- metric basis `astm_e989_iic_metric_schema_adapter_bridge`
- explicit lab context
- matching `availableOutputs: ["IIC"]`

`ImpactCalculation` may carry `AIIC` only with:

- basis `astm_e989_impact_rating_metric_schema_adapter_bridge`
- metric basis `astm_e989_aiic_metric_schema_adapter_bridge`
- field context
- matching `availableOutputs: ["AIIC"]`

Target-output support opens only when those value, basis, context, and
metric-basis checks all pass.

## Runtime Boundary

Current real floor-impact runtime remains unchanged:

- supported ASTM target outputs: `[]`
- unsupported ASTM target outputs: `IIC`, `AIIC`
- current runtime `IIC` value: absent
- current runtime `AIIC` value: absent
- ASTM E989 rating calculation: not implemented
- exact ASTM source precedence runtime owner: missing

Gate BT bridge probes with `IIC 52` and `AIIC 48` are schema/support
fixtures only. They are not runtime evidence, not source rows, not
rating results, and not measured values.

## Remaining Runtime Blockers

Lab `IIC` still cannot promote until Gate BU or later owns:

- `astmE989ExecutableIicContourRatingProcedureOwner`
- `exactAstmSourcePrecedenceRuntimeOwner`
- `astmIicVisibleSurfaceParityOwner`

Field `AIIC` still cannot promote until Gate BU or later owns:

- `astmE989ExecutableAiicApparentRatingProcedureOwner`
- `exactAstmSourcePrecedenceRuntimeOwner`
- `astmAiicVisibleSurfaceParityOwner`

## Tests

Executable contract:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts`

The test asserts:

1. Gate BT lands no-runtime and selects Gate BU.
2. `ImpactCalculation` accepts ASTM `IIC` / `AIIC` only with owned ASTM
   value, metric-basis, output, and lab/field context.
3. Missing metric basis, wrong AIIC context, and available output
   without value are rejected.
4. Target-output support opens only for matching bridge probes.
5. Current runtime still leaves `IIC` / `AIIC` unsupported.
6. Planned ASTM adapters no longer list schema bridge blockers, but
   still list rating-procedure, exact-source, and visible-parity
   blockers.
7. Gate BU rating procedure and exact-source owner outranks ISO reuse
   and broad source crawling.

Validation on 2026-05-14:

- focused Gate BT contract: 1 file / 7 tests passed
- Gate BS + Gate BT continuity: 2 files / 15 tests passed
- `@dynecho/shared` and `@dynecho/engine` typecheck passed
- `pnpm calculator:gate:current` passed: engine 413 files / 2393
  tests, web 78 files / 334 passed + 18 skipped, repo build 5/5
- known non-fatal warnings: optional `sharp/@img` build packages and
  Zustand unavailable test storage
- whitespace guard clean

## Next Implementation Order

1. Add Gate BU rating-procedure and exact-source owner contract.
2. Define the executable ASTM E989 rating owner needed for lab `IIC`
   and field `AIIC` without copying ISO `Ln,w`, `DeltaLw`, `L'n,w`, or
   `L'nT,w`.
3. Keep exact ASTM source precedence as a separate true-match path.
4. Decide whether Gate BU can promote runtime or must close no-runtime
   if the contour/rating procedure is not yet executable.
5. Do not add broad source crawling as a substitute for the rating
   procedure.
