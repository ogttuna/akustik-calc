# Personal-Use MVP Gate BS - Floor-Impact ASTM IIC/AIIC Runtime Corridor Plan

Date: 2026-05-14

## Status

Gate BS is landed as a no-runtime runtime-corridor probe:

`gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_plan`

Gate BS selection status:

`gate_bs_personal_use_mvp_floor_impact_astm_iic_aiic_runtime_corridor_closed_no_runtime_selected_metric_schema_adapter_bridge_gate_bt`

Selected next action:

`gate_bt_personal_use_mvp_floor_impact_astm_iic_aiic_metric_schema_and_adapter_bridge_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bt-floor-impact-astm-iic-aiic-metric-schema-and-adapter-bridge-contract.test.ts`

Next plain label: floor-impact ASTM IIC/AIIC metric schema and adapter bridge.

## Product Intent

Gate BR made ASTM lab `IIC` and field `AIIC` owner groups explicit. Gate
BS tested whether that owner set is enough to promote runtime values.
It is not enough yet. DynEcho has planned ASTM E989 rating-adapter
metadata, but the impact runtime cannot safely expose ASTM `IIC` or
`AIIC` because the numeric result schema, metric-basis payload,
target-output support, exact-source precedence route, and visible
surface parity do not own those ASTM metrics.

This is intentionally no-runtime. ISO `Ln,w` / `DeltaLw`, ISO field
`L'n,w` / `L'nT,w`, and building-prediction values must not alias to
ASTM ratings.

## Runtime Boundary

Current complete ISO impact formula rows still return no supported
ASTM outputs when `IIC` / `AIIC` are requested:

- supported target outputs: `[]`
- unsupported target outputs: `IIC`, `AIIC`
- `IIC` value: absent
- `AIIC` value: absent
- ASTM rating basis: absent
- exact ASTM source precedence runtime owner: missing

The current ISO impact basis may still be present internally, but it is
not an ASTM E989 adapter and must not be displayed as one.

## Gate BS Runtime Blockers

Lab `IIC` cannot promote until Gate BT or later owns:

- `impactCalculationIicMetricValueOwner`
- `impactMetricBasisIicOwner`
- `astmE989ExecutableIicContourRatingProcedureOwner`
- `targetOutputSupportAstmIicOwner`
- `exactAstmSourcePrecedenceRuntimeOwner`
- `astmIicVisibleSurfaceParityOwner`

Field `AIIC` cannot promote until Gate BT or later owns:

- `impactCalculationAiicMetricValueOwner`
- `impactMetricBasisAiicOwner`
- `astmE989ExecutableAiicApparentRatingProcedureOwner`
- `targetOutputSupportAstmAiicOwner`
- `exactAstmSourcePrecedenceRuntimeOwner`
- `astmAiicVisibleSurfaceParityOwner`

Missing ASTM physical inputs remain `needs_input`; missing Gate BR
rating/uncertainty owners remain `runtime_owner_missing`.

## Standards Metadata Refresh

Gate BS used only public locator metadata, not standard text or measured
values:

- ASTM E492 public locator: `https://store.astm.org/e0492-25.html`
- ASTM E989 public locator: `https://store.astm.org/e0989-21.html`
- ASTM E1007 public locator: `https://store.astm.org/e1007-25.html`

These references justify owner separation only. They do not become
runtime evidence, exact source rows, rating formulas, or measured
values.

## Tests

Executable contract:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bs-floor-impact-astm-iic-aiic-runtime-corridor-contract.test.ts`

The test asserts:

1. Gate BS lands as no-runtime and selects Gate BT.
2. Current runtime still leaves `IIC` / `AIIC` unsupported.
3. ASTM E989 adapter metadata stays `planned_not_implemented`.
4. Gate BR ready probes become runtime-owner blockers, not values.
5. Missing physical inputs, missing owners, ISO aliases, field aliases,
   and building boundaries remain protected.
6. Gate BT metric schema and adapter bridge outranks broad ASTM source
   crawling.
7. Docs and `pnpm calculator:gate:current` include Gate BS.

## Next Implementation Order

1. Add the Gate BT metric schema and adapter bridge contract.
2. Decide the minimal shared/schema changes needed to carry `IIC` and
   `AIIC` without disturbing ISO impact values.
3. Add target-output support only when the ASTM metric values and basis
   are present.
4. Preserve exact ASTM source precedence as a separate owner; do not
   invent source rows.
5. Keep runtime values frozen until the bridge and negative boundaries
   are executable.
