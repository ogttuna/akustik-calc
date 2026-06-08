# Post-V1 Gate EQ/ER Wall Direct-Fixed Double-Leaf Field/Building Adapter Runtime Plan - 2026-06-08

Document role: landed Gate ER runtime plan. This is a bounded calculator
scope/accuracy slice for one complete visible wall subset. It is not a
source-row crawl, confidence-label pass, frontend task, or finite
scenario library.

## Gate ER Result

Gate ER lands as:

`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`

Gate ER status:

`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_landed_runtime_selected_next_numeric_coverage_gap_gate_es`

Readable label: direct-fixed double-leaf field/building adapter runtime.

Runtime movement:

- complete direct-fixed `field_between_rooms` requests for `R'w`,
  `Dn,w`, and `DnT,w` now select
  `gate_i_airborne_field_apparent_context_adapter_runtime` over the Gate
  EO direct separating-element curve and calculate `R'w 23 / Dn,w 24 /
  DnT,w 27`;
- complete direct-fixed `building_prediction` requests for the same
  outputs now select
  `gate_ar_airborne_building_prediction_all_owner_runtime_corridor` over
  the Gate EO direct separating-element curve and calculate `R'w 23 /
  Dn,w 24 / DnT,w 27`;
- element-lab direct-fixed output remains Gate EO with `Rw 31 / STC 31 /
  C -1.2 / Ctr -5.9`;
- missing `receivingRoomRt60S` and missing `supportSpacingMm` remain
  `needs_input`.

Counters: `fieldBuildingRequestShapesWidened 3`,
`newCalculableLayerTemplates 1`, `newCalculableRequestShapes 3`,
`runtimeBasisPromotions 2`, `runtimeCorrectedLayerTemplates 1`,
`runtimeCorrectedRequestShapes 3`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 6`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

Gate ER selects:

`post_v1_next_numeric_coverage_gap_gate_es_plan`

Selected next file:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts`

## Gate EQ Result

Gate EQ lands as:

`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_plan`

Gate EQ status:

`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_landed_no_runtime_selected_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er`

Accepted adapter owners:

- `wall.direct_fixed_double_leaf.field_between_rooms_adapter_owner`;
- `wall.direct_fixed_double_leaf.building_prediction_adapter_owner`.

Selected next action:

`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_runtime_gate_er_plan`

Selected next file:

`packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts`

Readable selected next label: Gate ER, the direct-fixed double-leaf
field/building adapter runtime.

Gate EQ is no-runtime. Counters: `acceptedAdapterOwnerLedgers 2`,
`boundaryLedgersPinned 8`, `estimatedNextNewCalculableLayerTemplates 1`,
`estimatedNextNewCalculableRequestShapes 3`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`,
`estimatedNextRuntimeCorrectedRequestShapes 3`,
`newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
`runtimeBasisPromotions 0`, `runtimeFormulaRetunes 0`,
`runtimeValuesMoved 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 0`.

## Current Runtime Evidence

The representative direct-fixed double-leaf stack is still the Gate EO
empty-cavity wall:

`gypsum_board 12.5 / air_gap 45 / gypsum_board 12.5`

with `supportTopology=direct_fixed`, `connectionType=direct_fix`,
`studSpacingMm 400`, leaf groups, and `cavity1DepthMm 45`.

Current runtime before Gate ER:

- element-lab `Rw` / STC / `C` / `Ctr` selects
  `wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
  and calculates `Rw 31 / STC 31 / C -1.2 / Ctr -5.9`;
- complete `field_between_rooms` requests for `R'w`, `Dn,w`, and
  `DnT,w` still select `screening_mass_law_curve_seed_v3` with
  `candidate_multileaf_screening_fallback`, calculating `R'w 25 /
  Dn,w 26 / DnT,w 28`;
- complete `building_prediction` requests for the same outputs still
  stop as `dynamic_calculator_building_prediction_runtime_adapter_owner_missing`;
- missing `receivingRoomRt60S` remains `needs_input`;
- missing `supportSpacingMm` remains a Gate EO `needs_input` boundary.

## Gate ER Iteration 1

Subtract work that Gate EQ already proved or still blocks:

- do not prove owner again; Gate EQ accepted the field and building
  adapter owners;
- do not relabel lab `Rw` or STC as field/building metrics;
- do not guess missing room RT60, missing support spacing, flanking
  class, output basis, or coupling length;
- do not touch independent/resilient/shared/twin-frame double-leaf
  routes, because they already have Gate S plus Gate I/AR adapters;
- do not crawl source rows.

Result: the runtime slice should only connect the already-owned Gate EO
direct separating-element curve to the already-owned Gate I and Gate AR
adapter semantics for the bounded direct-fixed subset.

## Gate ER Iteration 2

Rank the runtime movement against the calculator advancement test:

1. Complete direct-fixed `field_between_rooms` requests should move from
   the weaker `screening_mass_law_curve_seed_v3` route to the Gate EO
   direct curve plus Gate I field adapter. This improves accuracy for
   currently calculable `R'w`, `Dn,w`, and `DnT,w`.
2. Complete direct-fixed `building_prediction` requests should move from
   unsupported to the Gate EO direct curve plus Gate AR building adapter.
   This improves calculable scope for the same visible layer template.
3. Missing field/building/support inputs must stay `needs_input`, and
   lab metrics must stay separate.
4. Formula retuning and holdout calibration remain future work after
   runtime route correctness lands.

Result: Gate ER should move runtime values for exactly the complete
direct-fixed double-leaf field/building adapter subset.

## Gate ER Work Order

Gate ER must move runtime values without widening owner boundaries:

- route complete direct-fixed `field_between_rooms` requests through the
  Gate EO direct curve plus Gate I field adapter;
- route complete direct-fixed `building_prediction` requests through the
  Gate EO direct curve plus Gate AR building adapter;
- keep `R'w`, `Dn,w`, and `DnT,w` field/building metrics distinct from
  lab `Rw`, STC, `C`, and `Ctr`;
- keep missing `receivingRoomRt60S`, missing support spacing, and
  missing building/flanking context as `needs_input`;
- keep multicavity/triple-leaf and non-direct-fixed double-leaf routes
  out of this runtime movement;
- import no source rows and touch no frontend implementation.

Expected movement: `estimatedNextNewCalculableLayerTemplates 1`,
`estimatedNextNewCalculableRequestShapes 3`,
`estimatedNextRuntimeCorrectedLayerTemplates 1`, and
`estimatedNextRuntimeCorrectedRequestShapes 3`.

## Non-Goals

- Do not crawl source rows or build a finite field/building catalog.
- Do not retune the Gate EO lab formula.
- Do not change frontend/workbench behavior.
- Do not weaken `needs_input` / `unsupported` boundaries.
