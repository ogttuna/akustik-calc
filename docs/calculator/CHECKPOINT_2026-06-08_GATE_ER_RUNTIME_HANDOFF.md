# Checkpoint 2026-06-08 - Gate ER Runtime Handoff

Document role: docs/implementation reconciliation after Gate ER. This
checkpoint supersedes the Gate EQ owner-proof handoff for current
post-V1 selected-next status.

## Product Guard

DynEcho remains an acoustic calculator, not a source-row catalog or
confidence-label project. Gate ER moved calculator scope/accuracy by
connecting an owned direct-fixed double-leaf base curve to owned
field/building adapters. It imported no source rows and touched no
frontend implementation.

## Gate ER Landed

Landed gate:

`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`

Status:

`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es`

Runtime behavior:

- complete direct-fixed `field_between_rooms` requests now select
  `gate_i_airborne_field_apparent_context_adapter_runtime`;
- complete direct-fixed `building_prediction` requests now select
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor`;
- both use the Gate EO direct separating-element curve and calculate
  `R'w 23 / Dn,w 24 / DnT,w 27` for the representative
  `gypsum_board 12.5 / air_gap 45 / gypsum_board 12.5` stack;
- lab output remains Gate EO at `Rw 31 / STC 31 / C -1.2 / Ctr -5.9`;
- missing `receivingRoomRt60S` and missing `supportSpacingMm` remain
  `needs_input`.

Counters: `fieldBuildingRequestShapesWidened 3`,
`newCalculableLayerTemplates 1`, `newCalculableRequestShapes 3`,
`runtimeBasisPromotions 2`, `runtimeCorrectedLayerTemplates 1`,
`runtimeCorrectedRequestShapes 3`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 6`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Selected Next

Gate ER selects Gate ES:

`post_v1_next_numeric_coverage_gap_gate_es_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts`

Gate ES should rerank remaining calculator coverage/accuracy gaps after
subtracting the now-closed direct-fixed double-leaf field/building
runtime. It must not reopen source crawling, confidence wording,
frontend polish, or finite scenario packs unless a calculator
scope/accuracy gate explicitly selects them.

## Validation

Focused runtime evidence:

- `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts --maxWorkers=1`

Known broader status: the historical repo-wide current gate was already
red before Gate ER on independent reinforced-concrete visible-derived
missing-input expectations that ask for `ceilingOrLowerAssembly`; the
runtime reports narrower required inputs
`resilientLayerDynamicStiffnessMNm3` and `loadBasisKgM2`.
