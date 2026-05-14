# Company-Internal Opening/Leak Field/Building Surface Parity Handoff

Date: 2026-05-14

Landed gate:

`company_internal_opening_leak_building_surface_parity_plan`

Selection status:

`company_internal_opening_leak_building_surface_parity_landed_selected_input_surface`

Selected next action:

`company_internal_opening_leak_building_input_surface_plan`

Selected next file:

`apps/web/features/workbench/company-internal-opening-leak-building-input-surface.test.ts`

Selected next label:

opening/leak field/building input surface

## What Landed

The opening/leak field/building runtime values did not move:

- field `R'w 36.4`, `Dn,w 36.7`, `DnT,w 36.9`;
- field method
  `company_internal_opening_leak_field_area_energy_runtime_corridor`;
- field candidate
  `candidate_company_internal_opening_leak_field_family_physics_prediction`;
- field budget `+/-8 dB`;
- building `R'w 31.6`, `DnT,w 32.1`;
- building method
  `company_internal_opening_leak_building_area_energy_runtime_corridor`;
- building candidate
  `candidate_company_internal_opening_leak_building_family_physics_prediction`;
- building budget `+/-10 dB`.

Surface parity now carries those ids, values, and not-measured evidence
warnings through:

- output cards and posture labels;
- route summary and scenario corridor summary;
- method and corridor dossiers;
- local saved replay;
- calculator API payloads;
- Markdown report lines.

Lab `Rw` / `STC` and A-weighted outputs still stay unsupported on this
field/building adapter unless a later route owns them. The Gate S lab
opening/leak `Rw 38.2` / `STC 39` path remains a separate element-lab
runtime, not a field/building alias.

## Next Step

Implement:

`company_internal_opening_leak_building_input_surface_plan`

That step should make `openingLeakFieldBuildingAdapterBoundary` and the
field/building opening/leak physical inputs first-class in the Dynamic
Calculator wall UI input surface, then replay the same field/building
runtime values through live evaluation, saved snapshots, report payloads,
and API payloads.
