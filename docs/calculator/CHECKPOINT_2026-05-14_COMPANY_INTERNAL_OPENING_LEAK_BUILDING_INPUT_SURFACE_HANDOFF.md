# Company-Internal Opening/Leak Field/Building Input Surface Handoff

Date: 2026-05-14

Landed gate:

`company_internal_opening_leak_building_input_surface_plan`

Selection status:

`company_internal_opening_leak_building_input_surface_landed_selected_matrix_v5_refresh`

Selected next action:

`company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`

Selected next file:

`packages/engine/src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts`

Selected next label:

company-internal matrix v5 refresh after opening/leak field/building input surface

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

The Dynamic Calculator wall input surface now owns the physical fields
needed to reach those existing runtime corridors from UI-derived input:

- opening/leak host wall area;
- stable opening ids;
- per-opening area, count, element `Rw`, rating basis, seal/leakage
  class, and value origin;
- partition width and height;
- receiving-room volume and RT60;
- source-room volume for building prediction;
- flanking/junction class;
- conservative flanking assumption;
- junction coupling length;
- building output basis.

The workbench now sets
`openingLeakFieldBuildingAdapterBoundary: true` only when the active wall
route has opening/leak input, field/building outputs are requested, and
the context is `field_between_rooms` or `building_prediction`. Lab
opening/leak `Rw` / `STC` stays on the separate Gate S element-lab route.

## Visible / Persistence Coverage

The new web acceptance test proves:

- live UI-derived field input reaches the field adapter values and
  surface copy;
- live UI-derived building input reaches the building adapter values and
  surface copy;
- saved local scenarios preserve the new building owner fields;
- server snapshot replay preserves the same building basis;
- calculator API payloads can be built from the same input-surface
  patches;
- Markdown report lines still show the same field/building basis ids;
- missing building owner fields return `needs_input`;
- duplicate opening inputs fail closed without a field/building budget;
- lab context does not set the field/building adapter boundary.

## Boundaries

- No lab/field/building alias was added.
- A-weighted opening/leak outputs remain unsupported until a later
  spectrum adapter owns them.
- Exact source precedence remains first.
- Source-absent field/building budgets are still not measured evidence.
- Hostile opening inputs still return unsupported/needs-input posture
  instead of a broad fallback.

## Validation

Focused validation completed:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/company-internal-opening-leak-building-input-surface.test.ts features/workbench/airborne-field-context-input-surface.test.ts features/workbench/opening-leak-composite-input-surface-acceptance.test.ts --maxWorkers=1`
  passed: 3 files / 12 tests.
- `pnpm --filter @dynecho/web typecheck` passed.
- `pnpm --filter @dynecho/web lint` passed.

The initial package test command entered the full web runner because the
script expands the current web gate list. It was stopped during the
second long deep-swap batch and replaced with the focused direct Vitest
command above.

## Next Step

Implement:

`company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan`

That gate should refresh the company-internal executable matrix after
the input-surface promotion, retire any stale opening/leak
field/building unsupported row, preserve the supported field/building
runtime rows, and choose the next highest-ROI company-internal
calculator lane without reopening ASTM `IIC` / `AIIC`.
