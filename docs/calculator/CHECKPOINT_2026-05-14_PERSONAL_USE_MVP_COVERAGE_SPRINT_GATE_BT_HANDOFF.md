# Checkpoint - Personal-Use MVP Coverage Sprint Gate BT Handoff

Date: 2026-05-14

## Current State

Gate BT has landed:

`gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`

Gate BT selection status:

`gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_adapter_bridge_landed_no_runtime_selected_rating_procedure_exact_source_owner_gate_bu`

Selected next action:

`gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bu-floor-impact-astm-iic-aiic-rating-procedure-and-exact-source-owner-contract.test.ts`

Next plain label: floor-impact ASTM IIC/AIIC rating procedure and exact-source owner.

## What Landed

Gate BT closed the ASTM `IIC` / `AIIC` metric schema and adapter bridge
as a no-runtime slice. The shared impact schema can now carry future
ASTM lab `IIC` and field `AIIC` values only when the ASTM bridge basis,
metric-basis owner, matching output id, finite value, and lab/field
context are all explicit.

Target-output support now also has a narrow ASTM bridge path:

- lab `IIC` is supported only by finite `IIC` plus
  `astm_e989_iic_metric_schema_adapter_bridge` and explicit lab context
- field `AIIC` is supported only by finite `AIIC` plus
  `astm_e989_aiic_metric_schema_adapter_bridge` and field context
- cross-output requests stay unsupported

This is not a runtime calculator promotion. The bridge fixture values
are not runtime evidence, not measured evidence, not source rows, and
not ASTM E989 rating results. ISO impact values and field/building
metrics remain not aliasable to ASTM ratings.

## Current Runtime Boundary

Current real floor-impact runtime still reports:

- supported target outputs: `[]`
- unsupported target outputs: `IIC`, `AIIC`
- runtime `IIC`: absent
- runtime `AIIC`: absent
- exact ASTM source precedence runtime owner: missing
- ASTM E989 rating procedure owner: missing

## Remaining Runtime Blockers

Lab `IIC` blockers:

- `astmE989ExecutableIicContourRatingProcedureOwner`
- `exactAstmSourcePrecedenceRuntimeOwner`
- `astmIicVisibleSurfaceParityOwner`

Field `AIIC` blockers:

- `astmE989ExecutableAiicApparentRatingProcedureOwner`
- `exactAstmSourcePrecedenceRuntimeOwner`
- `astmAiicVisibleSurfaceParityOwner`

Gate BT removed the schema bridge blockers from the planned ASTM
adapter metadata, but the adapters remain `planned_not_implemented`.

## Validation

Gate BT adds:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt.ts`

and:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts`

Validated on 2026-05-14:

- focused Gate BT contract: 1 file / 7 tests passed
- Gate BS + Gate BT continuity: 2 files / 15 tests passed
- `@dynecho/shared` and `@dynecho/engine` typecheck passed
- `pnpm calculator:gate:current` passed: engine 413 files / 2393
  tests, web 78 files / 334 passed + 18 skipped, repo build 5/5
- known non-fatal warnings: optional `sharp/@img` build packages and
  Zustand unavailable test storage
- whitespace guard clean

## Next Step

Implement Gate BU:

`gate_bu_personal_use_mvp_floor_impact_astm_iic_aiic_rating_procedure_and_exact_source_owner_plan`

Gate BU should own or explicitly block the ASTM E989 rating procedure
and exact ASTM source-precedence route. It must not alias ISO `Ln,w` /
`DeltaLw`, ISO field impact values, or building-prediction outputs to
ASTM `IIC` / `AIIC`, and it should not use broad source crawling as a
substitute for source-absent calculator coverage.
