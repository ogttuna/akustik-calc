# Personal-Use MVP Gate BJ Floor-Impact Field/Building Runtime Corridor Plan

Date: 2026-05-14

Document role: implementation plan and closeout note for the Gate BJ
slice selected by Gate BI. This is intentionally narrow: the goal is to
promote owned floor-impact field/building runtime where the physical
context is complete, not to retune lab formulas, ingest source rows, or
add ASTM adapters.

## Current Status

Gate BI landed:

`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`

Gate BI selected:

`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`

Gate BJ has now landed:

`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`

Gate BJ selection status:

`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_landed_selected_steel_floor_low_confidence_cleanup_gate_bk`

Selected next Gate BK action:

`gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`

Selected Gate BK file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts`

Next plain label: steel-floor low-confidence fallback cleanup.

## What Gate BJ Promotes

Gate BJ promotes only basis-owned floor-impact field/building outputs:

- complete field-apparent source-absent input with lab impact anchor,
  explicit field `K`, and receiving-room volume returns `L'n,w 52.3` and
  `L'nT,w 49.9`;
- complete building-prediction input with explicit direct path offset,
  flanking path, junction/coupling context, and receiving-room volume
  returns `L'nT,w 52.4`; the intermediate `L'n,w 54.8` remains available
  inside the direct/flanking impact payload and budget, but only
  requested supported outputs are surfaced as values;
- impact-only exact-band input with direct/flanking context can support
  `L'n,w 57`, `L'nT,w 55`, and `L'nT,50 54` because the exact source
  packet owns the low-frequency band input.

The runtime basis ids are:

- `mixed_predicted_plus_estimated_standardized_field_volume_normalization`
  for the field-volume adapter;
- `mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum`
  for source-absent building direct+flanking runtime;
- `mixed_exact_plus_estimated_standardized_direct_flanking_energy_sum`
  for impact-only exact-band direct+flanking payloads.

Direct+flanking runtime is no longer a default low-confidence fallback.
It now resolves to medium confidence with the explicit direct/flanking
basis. This is a product requirement: complete physical input should not
finish as vague low confidence when the calculator owns a named route.

## Error Budget Contract

Gate BJ adds structured source-absent field/building adapter budgets with
origin:

`source_absent_field_building_adapter_error_budget`

Field-volume adapter budgets:

- `L'n,w`: `+/-5 dB`, terms
  `lab_anchor_basis_transfer`,
  `field_k_or_mass_ratio_policy`,
  `source_absent_field_holdout_absence`;
- `L'nT,w`: `+/-5.5 dB`, same terms plus
  `room_volume_normalization_precision`.

Direct+flanking adapter budgets:

- `L'n,w`: `+/-6 dB`, terms
  `lab_anchor_basis_transfer`,
  `direct_path_offset_policy`,
  `flanking_path_energy_model`,
  `junction_and_support_family_mapping`;
- `L'nT,w`: `+/-6.5 dB`, same terms plus
  `room_standardization_precision`.

These budgets are not measured evidence and cannot tighten lab
`Ln,w` / `DeltaLw` corridors. They are visible runtime error-budget
payloads for the field/building adapter.

## Boundaries

Gate BJ keeps these fail-closed boundaries:

- missing `impactFieldContext` for field/building impact remains
  `needs_input`;
- source-absent `L'nT,50` remains blocked until
  `lowFrequencyImpactSpectrumOrCI50_2500Owner` exists;
- `IIC` / `AIIC` remain unsupported ASTM boundaries;
- lab `Ln,w` / `DeltaLw` budgets are not aliased to field or building
  metrics;
- existing lab runtime values are not retuned:
  heavy combined `Ln,w 44.4` / `DeltaLw 30.1`,
  steel `Ln,w 55.6` / `DeltaLw 22.4`,
  timber `Ln,w 51` / `DeltaLw 25.2`,
  CLT `Ln,w 50` / `DeltaLw 22.6`.

## Implementation Surfaces

Engine changes:

- `packages/engine/src/impact-field-adapter-error-budget.ts`
  defines the structured field/building adapter budgets.
- `packages/engine/src/impact-field-context.ts` attaches the field-volume
  adapter budgets to `L'n,w` / `L'nT,w`.
- `packages/engine/src/impact-direct-flanking.ts` attaches direct/flanking
  adapter budgets to `L'n,w` / `L'nT,w`.
- `packages/engine/src/impact-confidence.ts` classifies the owned
  direct/flanking bases as medium confidence instead of default low.
- `packages/engine/src/impact-support.ts` exposes the same budget and
  tolerance notes in support traces.
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj.ts`
  pins the executable scenario pack and next Gate BK selection.
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bj-floor-impact-field-building-runtime-corridor-contract.test.ts`
  tests the numeric values, basis ids, budgets, missing-input and
  unsupported boundaries, and docs/runner alignment.

## Validation Result

Gate BJ validation completed on 2026-05-14:

- focused Gate BJ contract: 1 file / 6 tests;
- Gate BI + Gate BJ continuity plus affected field-impact and
  impact-only regression guards: 6 files / 123 tests;
- engine typecheck;
- `pnpm calculator:gate:current` with engine 403 files / 2331 tests,
  web 77 files / 328 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean;
- final `git diff --check`.

Run broader `pnpm check` if later Gate BK changes touch shared schemas,
workbench input/card surfaces, report payloads, or API payloads.
