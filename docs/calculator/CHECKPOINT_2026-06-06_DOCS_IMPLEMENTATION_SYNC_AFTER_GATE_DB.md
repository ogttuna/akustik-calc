# Checkpoint - 2026-06-06 Docs / Implementation Sync After Gate DB

## Scope

This checkpoint records the post-V1 engine slice
`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan`.
It is calculator scope work, not source crawling, confidence wording,
frontend polish, or a finite scenario pack.

Gate DB closes the Gate DA selected runtime corridor:
complete lightweight-concrete / low-density concrete floating-floor
requests now keep the existing lightweight-concrete `Rw` / `Ln,w`
family anchor and additionally calculate ISO `DeltaLw` through
`predictor_lightweight_concrete_delta_lw_dynamic_improvement_estimate`.

## Runtime Result

- visible lightweight-concrete floating-floor stack with
  `loadBasisKgM2 70` and
  `resilientLayerDynamicStiffnessMNm3 25` keeps `Rw 53` /
  `Ln,w 64.3` and now calculates `DeltaLw 24.9`;
- complete low-density predictor input with the same physical inputs
  keeps `Rw 53` / `Ln,w 64.3` and now calculates `DeltaLw 24.9`;
- missing `resilientLayerDynamicStiffnessMNm3` or `loadBasisKgM2`
  remains `needs_input` for `DeltaLw`;
- Gate M's non-dynamic low-density predictor remains `Rw 49` /
  `Ln,w 47` without `DeltaLw`;
- ASTM `IIC` / `AIIC` remain unsupported unless an ASTM E492/E1007/E989
  owner exists;
- the heavy-concrete Annex-C basis is not reused for the lightweight
  metric. `DeltaLw` carries the separate lightweight-concrete metric
  basis while `Ln,w` remains on `predictor_lightweight_concrete_family_estimate`.

## Selection

Latest landed value-moving runtime action:

`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan`

Gate DB status:

`post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_landed_runtime_selected_next_numeric_coverage_gap_gate_dc`

Gate DB selected next action:

`post_v1_next_numeric_coverage_gap_gate_dc_plan`

Gate DB selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dc-contract.test.ts`

## Coverage Counters

- `newCalculableLayerTemplates 2`
- `newCalculableRequestShapes 4`
- `runtimeCorrectedLayerTemplates 2`
- `runtimeCorrectedRequestShapes 4`

## Validation

Targeted validation should include:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da-contract.test.ts src/post-v1-floor-lightweight-concrete-family-solver-owner-gate-m-contract.test.ts src/post-v1-floor-field-building-expansion-gate-n-contract.test.ts src/post-v1-floor-formula-expansion-gate-h-contract.test.ts`

The latest full documented gate remains the Gate DA run until a
post-Gate-DB full `pnpm calculator:gate:current` run is recorded.
