# Company-Internal Airborne Building-Prediction Reconciliation Handoff

Date: 2026-05-14

Landed gate:

`company_internal_airborne_building_prediction_runtime_terms_owner_contract_plan`

Selection status:

`company_internal_airborne_building_prediction_runtime_terms_owner_contract_landed_selected_matrix_v2_refresh`

Selected next action:

`company_internal_calculation_grade_mainline_matrix_v2_refresh_plan`

Selected next file:

`packages/engine/src/company-internal-calculation-grade-mainline-matrix-v2-contract.test.ts`

## What Landed

The selected company-internal building-prediction work is now a
reconciliation contract, not a new solver. It proves that the existing
Gate AR/AS/AT complete-context runtime is acceptable for the
company-internal envelope:

- complete lined massive building context keeps `R'w 58` / `DnT,w 59`;
- basis stays
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`;
- source-absent building uncertainty stays `+/-9 dB`;
- partial building context remains `needs_input` with exact missing
  fields;
- lab `Rw` / `STC` requested beside building metrics remain unsupported;
- opening/leak building requests remain unsupported until a dedicated
  building adapter owns them.

## Matrix Drift To Fix Next

The active 61-row company-internal matrix still lags the runtime:

- it still carries `wall.building_prediction_missing_context.needs_input`
  as the building row;
- it has not imported Gate AT runtime rows
  `wall.complete_building_prediction.runtime` and
  `wall.complete_building_prediction_broad_targets.alias_boundary`;
- `floor.heavy_concrete_floating_floor.lab` still has runtime origin
  `screening_fallback` despite matrix posture `family_physics`.

The next matrix v2 refresh must import the building runtime rows, retain
the precise missing-input building row, keep steel suspended-ceiling
`DeltaLw` owner prompts separate from missing numeric runtime, and either
reclassify the heavy concrete floating-floor origin to an owned ISO
12354 Annex-C basis or split it out of the company-internal complete
envelope.

## Validation

Focused validation for this checkpoint:

`pnpm --filter @dynecho/engine test -- src/company-internal-airborne-building-prediction-runtime-terms-owner-contract.test.ts`
