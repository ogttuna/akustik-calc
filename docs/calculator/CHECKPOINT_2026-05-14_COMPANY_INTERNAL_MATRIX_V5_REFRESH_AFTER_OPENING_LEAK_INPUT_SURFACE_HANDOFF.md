# Company-Internal Matrix V5 Refresh After Opening/Leak Input Surface Handoff

Date: 2026-05-14

Landed gate:

`company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`

Selection status:

`company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_landed_selected_opening_leak_a_weighted_adapter_owner`

Selected next action:

`company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`

Selected next file:

`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts`

Selected next label:

opening/leak `Dn,A` / `DnT,A` spectrum-adapter owner contract

## What Landed

Matrix V5 records the already-landed opening/leak field/building input
surface as company-internal calculation-grade coverage without moving
runtime values:

- field opening/leak row:
  `wall.opening_leak_field_runtime.input_surface`;
- field values: `R'w 36.4`, `Dn,w 36.7`, `DnT,w 36.9`;
- field basis:
  `company_internal_opening_leak_field_area_energy_runtime_corridor`;
- field budget: `+/-8 dB`;
- building opening/leak row:
  `wall.opening_leak_building_runtime.input_surface`;
- building values: `R'w 31.6`, `DnT,w 32.1`;
- building basis:
  `company_internal_opening_leak_building_area_energy_runtime_corridor`;
- building budget: `+/-10 dB`.

The stale unsupported row
`wall.opening_leak_composite_building_boundary.unsupported` is retired
only after both supported field and building rows are pinned.

## Boundaries

- `Dn,A` and `DnT,A` stay unsupported for opening/leak field/building
  requests until a spectrum-adapter owner exists.
- Missing opening/leak building owners still return `needs_input`; the
  matrix keeps `sourceRoomVolumeM3` as a precise missing-owner example.
- Lab `Rw` / `STC`, field `R'w` / `Dn,w` / `DnT,w`, and building
  `R'w` / `DnT,w` remain separate output bases.
- ASTM `IIC` / `AIIC` remains parked and is not reselected by this
  company-internal ISO-first mainline.
- No broad source crawl is selected while a bounded source-absent
  adapter can increase calculator coverage.

## Matrix Result

The executable matrix now has 65 rows:

- no hidden complete `screening_fallback` rows;
- 0 `coverage_gap` rows;
- supported opening/leak field/building runtime rows visible with
  values, basis, and budgets;
- unsupported A-weighted opening/leak outputs isolated in their own
  row;
- exact-source and exact field-band precedence rows preserved.

## Next Step

Implement:

`company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`

That gate should define the source-absent owner contract for
opening/leak `Dn,A` / `DnT,A` without aliasing lab `Rw` / `STC`, without
reopening ASTM `IIC` / `AIIC`, and without presenting unsupported
A-weighted values with the existing `+/-8 dB` / `+/-10 dB`
field/building budgets.
