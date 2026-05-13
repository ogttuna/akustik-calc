# Personal-Use MVP Coverage Sprint Gate BH Handoff

Date: 2026-05-13

Gate BH has now landed:

`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan`

Gate BH selection status:

`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_landed_no_runtime_selected_field_building_adapter_gate_bi`

Selected Gate BI action:

`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`

Selected Gate BI file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`

Next plain label: floor-impact field/building adapter contract.

## What Landed

Gate BH is a no-runtime floor-impact source-absent coverage matrix
refresh after Gates BA-BG. It does not retune formulas, move runtime
values, add source rows, change workbench/API inputs, or change
card/report behavior.

The refreshed executable matrix now has 21 floor-impact rows. It keeps
the existing lab source-absent, exact-source, field, ASTM/IIC,
missing-input, hostile-topology, safe-reorder, and many-layer rows, and
adds the Gate BF/BG `Heavy concrete combined input surface` rows plus a
floor building-prediction adapter boundary:

- `floor.heavy_concrete_combined_input_surface.lab`;
- `floor.heavy_concrete_combined_safe_reorder.lab`;
- `floor.heavy_concrete_combined_missing_load.needs_input`;
- `floor.heavy_concrete_combined_duplicate_base.refused`;
- `floor.building_impact.prediction_adapter_boundary`.

Complete and safe-reordered heavy-concrete combined input remain lab
`Ln,w 44.4` / `DeltaLw 30.1` through
`predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate`
with `+/-6.5 dB` / `+/-5.5 dB` source-absent not-measured budgets.
The existing heavy floating rows stay `Ln,w 44.9` / `DeltaLw 26.9` and
safe-reorder `Ln,w 39.2` / `DeltaLw 32.6`; steel stays `Ln,w 55.6` /
`DeltaLw 22.4`; timber stays exact `Ln,w 51` plus formula
`DeltaLw 25.2`; CLT stays `Ln,w 50` / `DeltaLw 22.6`; floor field
context stays `L'n,w 53` / `L'nT,w 50.6`; CLT low-frequency guide stays
`L'nT,50 49`.

## Boundaries

- Exact source precedence remains first.
- Missing load basis and missing dynamic stiffness rows stay
  `needs_input` without budgets.
- Duplicate or ambiguous base/carrier ownership stays unsafe and
  budget-free.
- `IIC` / `AIIC` stay ASTM adapter boundaries.
- `L'nT,w` / `L'nT,50` building-prediction requests stay unsupported
  until field/building impact owners exist.
- Lab `Ln,w` / `DeltaLw` budgets are not aliased to field or building
  output bases.
- Broad source crawl and formula retune stay behind explicit owner and
  holdout evidence.

## Next Step

Gate BI is selected because the refreshed matrix shows the highest-ROI
remaining floor-impact gap is basis-safe field/building ownership, not a
broad source crawl. Gate BI should define the floor-impact field and
building adapter contract before numeric promotion:

- apparent field `L'n,w` / `L'nT,w` owner fields;
- building-prediction `L'nT,w` / `L'nT,50` owner fields;
- separating element area, receiving-room volume, RT60 or absorption
  basis, junction/flanking context, coupling length or Kij owner,
  normalization basis, and low-frequency ownership;
- missing-input and unsupported boundaries for partial context,
  ASTM/IIC aliases, and lab-to-field/building leakage.

## Validation

Gate BH validation passed on 2026-05-13:

- focused Gate BH engine contract: 1 file / 6 tests;
- focused Gate BG + Gate BH continuity: 2 files / 10 tests;
- engine typecheck;
- `pnpm calculator:gate:current` with engine 401 files / 2320 tests,
  web 77 files / 328 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean;
- full `pnpm check` with lint/typecheck clean, engine 526 files / 3122
  tests, web 184 files / 1006 passed + 18 skipped, and repo build 5/5.

Known non-fatal warnings remain the existing optional `sharp/@img`
warnings from `@turbodocx/html-to-docx` during Next build and the
existing unavailable test-storage warnings from the Zustand persist
middleware in web tests.
