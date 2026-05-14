# Company-Internal Opening/Leak Field/Building Runtime Handoff

Date: 2026-05-14

Landed gate:

`company_internal_opening_leak_building_runtime_corridor_plan`

Selection status:

`company_internal_opening_leak_building_runtime_corridor_landed_selected_surface_parity`

Selected next action:

`company_internal_opening_leak_building_surface_parity_plan`

Selected next file:

`packages/engine/src/company-internal-opening-leak-building-surface-parity-contract.test.ts`

Selected next label:

opening/leak field/building card/report/API parity

## What Landed

The Gate S element-lab opening/leak corridor remains unchanged:

- lab `Rw 38.2`;
- lab `STC 39`;
- `gate_s_opening_leak_composite_area_energy_runtime_corridor`;
- `+/-6 dB` source-absent lab opening/leak budget.

This gate adds the first company-internal field/building runtime
adapter for opening/leak wall routes when the explicit
`openingLeakFieldBuildingAdapterBoundary` is present.

Complete field/apparent opening/leak context now calculates:

- `R'w 36.4`;
- `Dn,w 36.7`;
- `DnT,w 36.9`;
- `company_internal_opening_leak_field_area_energy_runtime_corridor`;
- `+/-8 dB` source-absent field adapter budget.

Complete building-prediction opening/leak context now calculates:

- `R'w 31.6`;
- `DnT,w 32.1`;
- `company_internal_opening_leak_building_area_energy_runtime_corridor`;
- `+/-10 dB` source-absent building adapter budget.

The adapter does not alias lab `Rw` to field/building values. It starts
from the Gate S lab composite opening/leak anchor, then applies explicit
field flanking, building junction/flanking, partition-area, room-volume,
and RT60 normalization terms before exposing `R'w` / `DnT,w`.

## Boundaries

- `Dn,A` and `DnT,A` remain unsupported until an A-weighted spectrum
  adapter owns those metrics.
- Legacy top-level opening contexts without
  `openingLeakFieldBuildingAdapterBoundary` keep the previous Gate S /
  Gate I / Gate N boundary posture, so older lab-only and no-runtime
  tests stay meaningful.
- Exact field/building opening packets still have precedence once a
  rights-safe exact row exists; this runtime is source-absent
  family-physics prediction, not measured evidence.
- Missing or hostile opening inputs still fail closed.

## Next Step

Implement:

`company_internal_opening_leak_building_surface_parity_plan`

The next gate should make cards, report payloads, calculator API
payloads, saved replay, and Dynamic Calculator input surface copy show
the same basis ids, supported outputs, and not-measured error budgets
for the new opening/leak field/building runtime.
