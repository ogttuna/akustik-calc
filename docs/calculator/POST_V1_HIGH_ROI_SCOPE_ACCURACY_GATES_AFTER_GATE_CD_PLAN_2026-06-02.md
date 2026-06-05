# Post-V1 High-ROI Scope/Accuracy Gates After Gate CD - 2026-06-02

Document role: planning input for Gate CE and the next 5-8 post-V1
calculator capability gates. This file does not move runtime by itself.
If it conflicts with `CALCULATOR_SOURCE_OF_TRUTH.md` or the active
post-V1 capability plan, the source-of-truth chain wins.

## Product Constraint

The only goal of these gates is calculator scope and accuracy:

- more physically valid wall/floor layer combinations calculate owned
  acoustic outputs when route-required physical inputs are present;
- existing routes choose a more correct formula, anchor, metric basis,
  or building/field adapter;
- missing physical inputs still return exact `needs_input` fields;
- unsupported metric/basis requests still return `unsupported`.

These gates must not drift into broad source crawling, finite scenario
packs, confidence wording, report polish, storage/auth work, or generic
UI cleanup. Source rows are useful only as exact answers, anchors,
calibration evidence, holdouts, and regression tests.

## Current Implementation Anchor

Current state after Gate DA:

- latest value-moving runtime slice:
  `post_v1_floor_composite_panel_delta_lw_owner_gate_cy_plan`;
- Gate CY landed with status
  `post_v1_floor_composite_panel_delta_lw_owner_gate_cy_landed_runtime_selected_next_numeric_coverage_gap_gate_cz`;
- Gate CY closes the composite-panel `DeltaLw` owner gap: dry floating
  now calculates `Ln,w 69.4 / Rw 45.1 / DeltaLw 14.6`,
  suspended-ceiling-only calculates `Ln,w 63.3 / Rw 48.6 / DeltaLw 20.7`,
  and combined upper/lower treatment calculates `Ln,w 48.5 / Rw 60.6 /
  DeltaLw 35.5`;
- previous value-moving runtime slice:
  `post_v1_wall_local_substitution_building_adapter_gate_cw_plan`;
- Gate CW landed with status
  `post_v1_wall_local_substitution_building_adapter_gate_cw_landed_runtime_selected_next_numeric_coverage_gap_gate_cx`;
- Gate CW closes the Gate CV selected local-substitution building adapter
  gap: complete local Rockwool / MLV / plaster grouped triple-leaf wall
  requests with explicit `building_prediction` flanking, junction, room,
  panel, RT60, and output-basis inputs now calculate `R'w 51 /
  Dn,w 51 / Dn,A 52.4 / DnT,w 53 / DnT,A 53.9` from the
  local-substitution lab curve plus the building adapter;
- previous value-moving runtime slice:
  `post_v1_wall_flat_layer_order_multicavity_gate_cu_plan`;
- Gate CU landed with status
  `post_v1_wall_flat_layer_order_multicavity_gate_cu_landed_runtime_selected_next_numeric_coverage_gap_gate_cv`;
- latest no-runtime numeric coverage rerank:
  `post_v1_next_numeric_coverage_gap_gate_cx_plan`;
- Gate CX landed with status
  `post_v1_next_numeric_coverage_gap_gate_cx_landed_no_runtime_selected_floor_composite_panel_delta_lw_owner_gate_cy`;
- Gate CX selected
  `floor.composite_panel_delta_lw_published_interaction_owner_gap` as
  the next runtime formula-owner slice;
- latest no-runtime numeric coverage rerank:
  `post_v1_next_numeric_coverage_gap_gate_cz_plan`;
- Gate CZ landed with status
  `post_v1_next_numeric_coverage_gap_gate_cz_landed_no_runtime_selected_floor_lightweight_concrete_delta_lw_owner_contract_gate_da`;
- Gate CZ selected
  `floor.lightweight_concrete_delta_lw_family_owner_contract_gap` as
  the next engine-only owner-contract slice; lightweight-concrete
  `Rw` / `Ln,w` and field-impact companions already have owned routes,
  but ISO `DeltaLw` still needs a family-specific owner contract before
  runtime values can move without borrowing heavy-concrete,
  composite-panel, timber/CLT, or steel corridors;
- latest lightweight-concrete owner-boundary action:
  `post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_plan`;
- Gate DA landed with status
  `post_v1_floor_lightweight_concrete_delta_lw_owner_contract_gate_da_landed_runtime_boundary_selected_delta_lw_runtime_corridor_gate_db`;
- Gate DA closed
  `floor.lightweight_concrete.delta_lw_family_owner_contract` by pinning
  no-default owner fields including
  `resilientLayerDynamicStiffnessMNm3_or_productCurve` and
  `loadBasisKgM2`; it also keeps low-density predictor input from
  borrowing `heavy_concrete_annex_c_delta_lw`, while existing
  lightweight-concrete `Rw` / `Ln,w` and field-impact companions remain
  unchanged and `DeltaLw` waits for Gate DB;
- previous no-runtime numeric coverage rerank:
  `post_v1_next_numeric_coverage_gap_gate_cv_plan`;
- Gate CV landed with status
  `post_v1_next_numeric_coverage_gap_gate_cv_landed_no_runtime_selected_wall_local_substitution_building_adapter_gate_cw`;
- previous value-moving runtime slice:
  `post_v1_wall_common_auto_topology_second_pass_gate_cs_plan`;
- Gate CS landed with status
  `post_v1_wall_common_auto_topology_second_pass_gate_cs_landed_runtime_selected_next_numeric_coverage_gap_gate_ct`;
- previous value-moving runtime slice:
  `post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_plan`;
- Gate CQ landed with status
  `post_v1_floor_common_floating_lower_treatment_anchor_gate_cq_landed_runtime_selected_next_numeric_coverage_gap_gate_cr`;
- previous value-moving runtime slice:
  `post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan`;
- Gate CO landed with status
  `post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_landed_runtime_selected_next_numeric_coverage_gap_gate_cp`;
- earlier value-moving runtime slice:
  `post_v1_opening_leak_composite_wall_adapters_gate_ck_plan`;
- Gate CK landed with status
  `post_v1_opening_leak_composite_wall_adapters_gate_ck_landed_runtime_selected_next_numeric_coverage_gap_gate_cl`;
- latest no-runtime accuracy/rerank slice:
  `post_v1_next_numeric_coverage_gap_gate_cl_plan`;
- Gate CL landed with status
  `post_v1_next_numeric_coverage_gap_gate_cl_landed_no_runtime_selected_required_physical_input_surface_parity_gate_cm`;
- latest no-runtime input-surface guard:
  `post_v1_required_physical_input_surface_parity_gate_cm_plan`;
- Gate CM landed with status
  `post_v1_required_physical_input_surface_parity_gate_cm_landed_no_runtime_selected_next_numeric_coverage_gap_gate_cn`;
- previous no-runtime numeric coverage rerank:
  `post_v1_next_numeric_coverage_gap_gate_cn_plan`;
- Gate CN landed with status
  `post_v1_next_numeric_coverage_gap_gate_cn_landed_no_runtime_selected_floor_visible_layer_upper_package_delta_lw_gate_co`;
- latest no-runtime numeric coverage rerank:
  `post_v1_next_numeric_coverage_gap_gate_cp_plan`;
- Gate CP landed with status
  `post_v1_next_numeric_coverage_gap_gate_cp_landed_no_runtime_selected_floor_common_floating_lower_treatment_anchor_gate_cq`;
- latest no-runtime numeric coverage rerank:
  `post_v1_next_numeric_coverage_gap_gate_ct_plan`;
- Gate CT landed with status
  `post_v1_next_numeric_coverage_gap_gate_ct_landed_no_runtime_selected_wall_flat_layer_order_multicavity_gate_cu`;
- previous no-runtime numeric coverage rerank:
  `post_v1_next_numeric_coverage_gap_gate_cr_plan`;
- Gate CR landed with status
  `post_v1_next_numeric_coverage_gap_gate_cr_landed_no_runtime_selected_wall_common_auto_topology_second_pass_gate_cs`;
- current selected next action label:
  `post_v1_floor_lightweight_concrete_delta_lw_runtime_corridor_gate_db_plan`;
- Gate DA selected next file:
  `packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-runtime-corridor-gate-db-contract.test.ts`;
- Gate CZ selected next file:
  `packages/engine/src/post-v1-floor-lightweight-concrete-delta-lw-owner-contract-gate-da-contract.test.ts`;
- Gate CY selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cz-contract.test.ts`;
- Gate CX selected next file:
  `packages/engine/src/post-v1-floor-composite-panel-delta-lw-owner-gate-cy-contract.test.ts`;
- Gate CW selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cx-contract.test.ts`;
- Gate CK selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts`;
- Gate CL selected next file:
  `packages/engine/src/post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts`;
- Gate CM selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cn-contract.test.ts`;
- Gate CN selected next file:
  `packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts`;
- Gate CO selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cp-contract.test.ts`;
- Gate CP selected next file:
  `packages/engine/src/post-v1-floor-common-floating-lower-treatment-anchor-gate-cq-contract.test.ts`;
- Gate CQ selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cr-contract.test.ts`;
- Gate CR selected next file:
  `packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts`;
- Gate CS selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ct-contract.test.ts`;
- Gate CT selected next file:
  `packages/engine/src/post-v1-wall-flat-layer-order-multicavity-gate-cu-contract.test.ts`;
- Gate CU selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cv-contract.test.ts`;
- Gate CV selected next file:
  `packages/engine/src/post-v1-wall-local-substitution-building-adapter-gate-cw-contract.test.ts`;
- Gate CQ coverage counters: `newCalculableLayerTemplates 2`,
  `newCalculableRequestShapes 10`, and
  `runtimeCorrectedRequestShapes 8`;
- Gate CQ value movement: visible heavy-floating reinforced-concrete
  `acoustic_hanger_ceiling` lower-treatment stacks now calculate
  `Ln,w 43`, plus `L'n,w 45 / L'nT,w 42.6 / L'nT,50 46.6` with
  explicit `impactFieldContext`; visible `resilient_stud_ceiling`
  lower-treatment stacks now calculate `Ln,w 51.5`, plus
  `L'n,w 53.5 / L'nT,w 51.1 / L'nT,50 55.1` with explicit
  `impactFieldContext`; `DeltaLw`, complete heavy combined formula
  precedence, and ASTM `IIC` / `AIIC` boundaries remain protected;
- Gate CO coverage counters: `newCalculableLayerTemplates 2`,
  `newCalculableRequestShapes 10`, `runtimeCorrectedLayerTemplates 0`,
  and `runtimeCorrectedRequestShapes 0`;
- Gate CO value movement: visible timber joist upper-package floors keep
  exact `Ln,w 51` and now calculate `DeltaLw 25.2`, plus
  `L'n,w 53 / L'nT,w 50.6 / L'nT,50 53.6` with explicit
  `impactFieldContext`; visible CLT upper-package floors keep
  published-family `Ln,w 50` and now calculate `DeltaLw 22.6`, plus
  `L'n,w 52 / L'nT,w 49.6 / L'nT,50 52.6` with explicit
  `impactFieldContext`;
- Gate CK coverage counters: `newCalculableLayerTemplates 2`,
  `newCalculableRequestShapes 5`, `runtimeCorrectedLayerTemplates 2`,
  `runtimeCorrectedRequestShapes 5`;
- Gate CL no-runtime counters: `residualLedgers 5`,
  `budgetsHeldWide 5`, `budgetsTightened 0`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
  `runtimePromotionsFromSourceProximity 0`;
- Gate CL residual and holdout ledgers cover common flat double-leaf
  building prediction, opening/leak field/building, open-box raw-bare lab
  impact, open-web raw-bare lab impact, and heavy floating
  upper-treatment field companion routes; all five keep wider budgets
  until same-family calibration and same-basis holdout evidence exists;
- Gate CM input-surface counters: `inputSurfaceLedgers 4`,
  `requiredPhysicalInputsPinned 20`, `guardedRequestShapes 15`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
  `runtimeValuesMoved 0`;
- Gate CM pins required physical input and `needs_input` boundaries for
  selected Gate CK/CJ/CG2/CH runtime routes without frontend
  implementation, formula retuning, source crawling, or runtime value
  movement;
- Gate CN no-runtime counters: `candidateCount 7`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
  `runtimeValuesMoved 0`,
  `estimatedNextNewCalculableLayerTemplates 2`, and
  `estimatedNextNewCalculableRequestShapes 10`;
- Gate CN selected
  `floor.visible_layer_upper_package_delta_lw_formula_routing_gap`
  because existing timber/CLT `DeltaLw` formula owners calculate with
  explicit predictor input, while equivalent visible tagged upper-package
  layer stacks still publish only `Ln,w`;
- Gate CP no-runtime counters: `candidateCount 8`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
  `runtimeValuesMoved 0`,
  `estimatedNextNewCalculableLayerTemplates 2`, and
  `estimatedNextNewCalculableRequestShapes 10`;
- Gate CP selected
  `floor.common_floating_lower_treatment_published_anchor_gap` because
  visible heavy-floating reinforced-concrete stacks with lower ceiling
  treatment currently publish airborne `Rw` / `Ctr` but hide requested
  impact outputs behind the combined upper/lower formula
  `loadBasisKgM2` `needs_input` guard, while the published
  upper-treatment family already owns an `Ln,w` anchor for elastic and
  rigid gypsum-ceiling variants;
- Gate CQ kept that published-family `Ln,w` anchor and field impact
  companions live for two common visible lower-treatment templates, kept
  `DeltaLw` `needs_input` until `loadBasisKgM2` and
  `resilientLayerDynamicStiffnessMNm3` are present, preserved the
  complete heavy combined formula corridor, and kept ASTM `IIC` /
  `AIIC` unsupported;
- Gate CR no-runtime counters: `candidateCount 9`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
  `runtimeValuesMoved 0`,
  `estimatedNextRuntimeCorrectedLayerTemplates 5`, and
  `estimatedNextRuntimeCorrectedRequestShapes 25`;
- Gate CR selected
  `wall.common_auto_topology_second_pass_after_cj` because Gate CJ
  already proved support-owned common flat double-leaf
  `building_prediction` requests can use the Gate S double-leaf/framed
  direct curve through the Gate AR building adapter, while explicit
  `flat_layer_order` requests with the same safe segmentation and owner
  inputs still stop behind the older ambiguity guard. Gate CS must admit
  only safely segmentable explicit flat-entry wall stacks, preserve
  missing `supportTopology`, missing `studSpacingMm`, and missing
  `resilientBarSideCount` as `needs_input`, keep ambiguous multicavity
  flat lists blocked, and keep lab metrics separate from field/building
  metrics;
- Gate CS coverage counters: `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 5`, `runtimeCorrectedLayerTemplates 5`,
  and `runtimeCorrectedRequestShapes 25`;
- Gate CS value movement: safe explicit `flat_layer_order` double-leaf
  wall requests with complete support/stud owner inputs now use the Gate
  S double-leaf/framed direct curve through the Gate AR building adapter
  instead of falling into the generic lab/field/building basis boundary.
  The explicit flat-order variants keep the Gate CJ pins: simple
  independent `R'w 39 / Dn,w 40 / Dn,A 38.5 / DnT,w 42 / DnT,A 40.9`,
  resilient both-sides `R'w 41 / Dn,w 42 / Dn,A 40.5 / DnT,w 44 /
  DnT,A 42.9`, multi-board `R'w 46 / Dn,w 47 / Dn,A 45.7 / DnT,w 49 /
  DnT,A 48.1`, split air/porous cavity `R'w 44 / Dn,w 44 / Dn,A 43.1 /
  DnT,w 47 / DnT,A 45.5`, and asymmetric board-count `R'w 43 / Dn,w 43
  / Dn,A 42.1 / DnT,w 46 / DnT,A 44.5`. Gate CS carried explicit
  `flat_layer_order` multicavity stacks forward to a separate grouped
  multicavity owner instead of widening them in the double-leaf slice;
  missing `supportTopology`, missing `studSpacingMm`, and missing
  `resilientBarSideCount` remain `needs_input`; lab metrics still do
  not alias into field/building metrics;
- Gate CT no-runtime counters: `candidateCount 10`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`,
  `runtimeValuesMoved 0`,
  `estimatedNextNewCalculableLayerTemplates 1`, and
  `estimatedNextNewCalculableRequestShapes 14`;
- Gate CT selected `wall.flat_layer_order_multicavity_grouped_owner_gap`
  because safe explicit `flat_layer_order` multicavity wall entry can
  be connected to the existing grouped multicavity owner when the layer
  order is leaf/cavity/leaf/cavity/leaf and `supportTopology` is
  explicit, without source crawling, confidence wording, or frontend
  work;
- Gate CU coverage counters: `newCalculableLayerTemplates 1`,
  `newCalculableRequestShapes 14`, `runtimeCorrectedLayerTemplates 1`,
  and `runtimeCorrectedRequestShapes 14`;
- Gate CU value movement: safe explicit `flat_layer_order` multicavity
  wall requests with complete support owner now calculate lab `Rw 53 /
  STC 57 / C -0.6 / Ctr -8` through the Gate AE two-cavity formula and
  field/building `R'w 53 / Dn,w 53 / Dn,A 52 / DnT,w 54 / DnT,A 53.5`
  through the Gate I / Gate AR adapters. Missing `supportTopology`,
  contradictory explicit grouped indices, incomplete field/building
  context, and lab/field/building metric aliasing remain blocked;
  Gate CU exact pins: `Rw 53 / STC 57 / C -0.6 / Ctr -8`; `R'w 53 / Dn,w 53 / Dn,A 52 / DnT,w 54 / DnT,A 53.5`;
- Gate CV no-runtime selection:
  `wall.local_substitution_building_prediction_adapter_gap`. Gate CV
  picks local-substitution triple-leaf wall building prediction because
  lab `Rw/STC/C/Ctr` and field `R'w/DnT,w` are already owned, while the
  same complete `building_prediction` context is still unsupported.
  Gate CV also records that the Gate CQ lower-treatment direct/flanking
  field route is already runtime-capable and should not be selected as a
  fake scope move. Counters: `candidateCount 11`,
  `estimatedNextNewCalculableLayerTemplates 1`,
  `estimatedNextNewCalculableRequestShapes 5`, and
  `runtimeValuesMoved 0`;
- Gate CX no-runtime selection:
  `floor.composite_panel_delta_lw_published_interaction_owner_gap`. Gate
  CX picks composite-panel `DeltaLw` because the existing
  published-interaction estimator already owns same-family bare and
  treated `Ln,w` anchors for dry floating, suspended-ceiling, and
  combined treated stacks, while ISO `DeltaLw` remains unsupported for
  those visible combinations. Gate CX also records that the
  local-substitution flat-order building route and composite-panel field
  companions are already runtime-capable, so they should not be selected
  as fake scope moves. Counters: `candidateCount 12`,
  `estimatedNextNewCalculableLayerTemplates 3`,
  `estimatedNextNewCalculableRequestShapes 3`, and
  `runtimeValuesMoved 0`;
- Gate CY value movement: composite-panel published-interaction floor
  stacks now keep the existing `Rw` / `Ln,w` owner and calculate ISO
  `DeltaLw` from same-family bare-minus-treated `Ln,w`. Dry floating is
  `Ln,w 69.4 / Rw 45.1 / DeltaLw 14.6`; suspended-ceiling-only is
  `Ln,w 63.3 / Rw 48.6 / DeltaLw 20.7`; combined upper/lower treatment
  is `Ln,w 48.5 / Rw 60.6 / DeltaLw 35.5`. Missing owner fields remain
  `needs_input`, exact official PMC rows stay primary, wrong-family
  `DeltaLw` formulas are not borrowed, and ASTM `IIC` / `AIIC` remain
  unsupported. Counters: `newCalculableLayerTemplates 3`,
  `newCalculableRequestShapes 3`, `runtimeCorrectedLayerTemplates 0`,
  and `runtimeCorrectedRequestShapes 0`;
- Gate CK value movement: complete top-level field opening/leak context
  now calculates `R'w 36.4 / Dn,w 36.7 / DnT,w 36.9`, and complete
  top-level building-prediction opening/leak context now calculates
  `R'w 31.6 / DnT,w 32.1`, through owned opening/leak field/building
  adapters without a hidden adapter-boundary flag;
- missing room/flanking terms still stop as `needs_input`, `Dn,A` /
  `DnT,A` still require `frequencyBandSet`, and lab `Rw` / STC do not
  alias into field/building outputs;
- previous value-moving runtime slice:
  `post_v1_wall_common_auto_topology_expansion_gate_cj_plan`;
- Gate CJ landed with status
  `post_v1_wall_common_auto_topology_expansion_gate_cj_landed_runtime_selected_opening_leak_composite_wall_adapters_gate_ck`;
- Gate CJ selected next file:
  `packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts`;
- earlier value-moving runtime slice:
  `post_v1_next_numeric_coverage_gap_gate_ch_plan`;
- Gate CH landed with status
  `post_v1_next_numeric_coverage_gap_gate_ch_landed_runtime_selected_next_numeric_coverage_gap_gate_ci`;
- Gate CH selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts`;
- Gate CH coverage counters: `newCalculableLayerTemplates 2`,
  `newCalculableRequestShapes 4`,
  `runtimeCorrectedRequestShapes 3`;
- Gate CH value movement: complete visible heavy-floating
  reinforced-concrete upper-treatment stacks with explicit
  direct/flanking impact context and explicit
  `impactFieldContext.ci50_2500Db` now keep the Gate CG2 published
  upper-treatment `Ln,w 50` anchor and calculate `L'n,w 57.5 /
  L'nT,w 55.1 / L'nT,50 59.1` through
  `source_absent_field_building_adapter_error_budget`;
- missing `impactFieldContext.ci50_2500Db` still stops only
  `L'nT,50` as `needs_input`;
- ASTM `IIC` / `AIIC` remain unsupported without ASTM E492/E1007
  owners;
- previous value-moving runtime slice:
  `post_v1_floor_common_floating_covering_expansion_gate_cg2_plan`;
- Gate CG2 landed with status
  `post_v1_floor_common_floating_covering_expansion_gate_cg2_landed_selected_next_numeric_coverage_gap_gate_ch`;
- Gate CG2 selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ch-contract.test.ts`;
- Gate CG2 coverage counters: `newCalculableLayerTemplates 2`,
  `newCalculableRequestShapes 10`,
  `runtimeCorrectedRequestShapes 8`;
- Gate CG2 value movement: visible heavy-floating reinforced-concrete
  upper-treatment stacks now keep the published-family `Ln,w 50` anchor
  live when `loadBasisKgM2` or
  `resilientLayerDynamicStiffnessMNm3` is missing, while `DeltaLw`
  remains `needs_input` for the exact missing owner field. With complete
  `impactFieldContext`, the same anchor publishes `L'n,w 52`,
  `L'nT,w 49.6`, and `L'nT,50 53.6`; complete explicit dynamic input
  still uses `Ln,w 50.3` / `DeltaLw 24.3`. ASTM `IIC` / `AIIC` remain
  unsupported without ASTM E492/E1007 owners.
- Gate CG2 added resolver owner
  `floor.heavy_concrete_floating.published_upper_treatment_anchor_owned`;
- previous value-moving runtime slice:
  `post_v1_floor_common_floating_covering_expansion_gate_cg_plan`;
- Gate CG landed with status
  `post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2`;
- Gate CG selected next runtime label:
  `post_v1_floor_common_floating_covering_expansion_gate_cg2_plan`;
- Gate CG selected next file:
  `packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`;
- Gate CG coverage counters: `newCalculableLayerTemplates 4`,
  `newCalculableRequestShapes 20`,
  `runtimeCorrectedRequestShapes 12`;
- Gate CG value movement: floor-covering-only heavy/reinforced concrete
  stacks now keep owned bare-heavy `Ln,w` live when `DeltaLw` or field
  impact companions are requested; with explicit `impactFieldContext`
  they also publish `L'n,w`, `L'nT,w`, and `L'nT,50`. `DeltaLw` remains
  `needs_input` for `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, and `loadBasisKgM2`; ASTM
  `IIC` / `AIIC` remain unsupported without ASTM E492/E1007 owners.
- earlier value-moving runtime slice:
  `post_v1_target_output_independence_sweep_gate_cf_plan`;
- earlier no-runtime selection slice:
  `post_v1_next_numeric_coverage_gap_gate_ce_plan`;
- Gate CE landed with status
  `post_v1_next_numeric_coverage_gap_gate_ce_landed_no_runtime_selected_target_output_independence_sweep_gate_cf`;
- Gate CF landed with status
  `post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg`;
- Gate CF coverage counters: `newSingleOutputParityPins 37`,
  `runtimeCorrectedRequestShapes 8`, `newCalculableRequestShapes 8`,
  `newCalculableLayerTemplates 0`;
- resolver surface: 43 declared candidates and 40 active runtime-basis
  mappings;
- latest full `NEXT_DIST_DIR=.next-gate-cw pnpm calculator:gate:current`
  after Gate CW passed with engine 614 files / 3378 tests, web 113 files
  / 438 passed + 18 skipped, repo build 5 / 5, and whitespace guard
  passed.

Gate CD is important evidence: it did not invent a formula. It corrected
target-output independence so already-owned open-box dry
package-transfer and EPS/screed hybrid answers publish for single-output
requests. That pattern should now be searched across the calculator
before opening lower-readiness formula work.

Gate CF closed that search across six existing runtime families. It
repaired the value-moving wall field-context lab companion defect:
single-output `Rw`, STC, `C`, and `Ctr` for flat double-leaf and
full-fill multileaf field contexts now use the owned family route rather
than screening fallback or unsupported publication. Raw-bare open-web /
open-box field impact, heavy-concrete combined lab impact, and steel
suspended-ceiling field impact single-output parity are pinned as
already-safe families. Missing field `receivingRoomRt60S`, unsupported
ASTM `IIC` / `AIIC`, and field-only wall request boundaries remain
protected.

## External Research Anchors

The following external anchors support the selected capability axes:

- INSUL describes professional prediction scope as walls, floors, and
  ceilings with 1/3-octave transmission-loss graphs and construction
  detail choices. Source: https://www.insul.co.nz/
- Public INSUL feature descriptions include single/double/triple/quad
  panel walls/floors/ceilings/windows, `Rw`, STC, OITC, `DnT,w`, `C`,
  `Ctr`, `Ln,w`, IIC, concrete floors with floor coverings, lightweight
  and timber floors, composite transmission loss, leakage calculation,
  and EN/ISO 12354 building calculations. Source:
  https://navcon.com/resources/software/insul/
- Acoulatis describes the same professional shape: airborne and impact
  sound insulation for walls and floors, third-octave precision,
  ISO/ASTM ratings, timber/steel frame walls and floors, CLT/LVL,
  concrete/CMU/brick/aerated concrete, frame systems, panels, impact
  boards, and floor coverings. Source:
  https://www.sonusoft.com/acoulatis
- ISO 12354-1:2017 estimates airborne sound insulation between rooms
  using direct or indirect flanking transmission by participating
  building elements and theoretically derived structural propagation
  methods. Source: https://www.iso.org/standard/70242.html
- ISO 12354-2:2017 estimates impact sound insulation between rooms with
  direct or indirect flanking transmission, frequency-band calculation
  from 100 Hz to 3150 Hz, and optional extension down to 50 Hz when data
  exist. Source: https://www.iso.org/standard/70243.html
- ISO 717-2:2020 defines single-number impact quantities and impact
  reduction for floor coverings and floating floors from one-third-octave
  measurement results. Source: https://www.iso.org/standard/69867.html
- ASTM E989-21 defines ASTM single-number impact metrics. It separates
  E492 lab IIC from E1007 field AIIC/ISR/NISR and requires the ASTM
  impact rating basis rather than an ISO `Ln,w` alias. Source:
  https://store.astm.org/e0989-21.html

These sources support the direction with high confidence. They do not
authorize guessing missing physical inputs or aliasing ISO and ASTM
metrics.

## Implementation Audit - 2026-06-02

This plan was originally checked against the implementation before Gate
CE selection. The Current Implementation Anchor above has since been
refreshed through Gate CH. Findings:

- The plan passes the calculator-only rule: every candidate must either
  increase calculable wall/floor layer/request coverage, route existing
  coverage to the correct metric basis, block a wrong alias/fallback, or
  improve holdout-backed accuracy. Generic source crawling, confidence
  copy, catalog work, auth/storage, and report polish remain non-goals.
- Gate CF fits the current codebase strongly. Target-output support is
  already centralized enough to audit, and Gate CD proved the defect
  class with real output movement.
- Gate CG fits the current codebase strongly. Floor layer/input schemas
  already expose resilient layers, floating screeds, coverings,
  suspended/lower treatments, dynamic stiffness, and load basis fields;
  the gate must expand usage placement without inventing defaults.
- Gate CH fits the current codebase, but must remain basis-strict:
  field/apparent and building-prediction routes are not aliases for lab
  `Rw` or lab `Ln,w`. Direct-only and direct+flanking adapters must
  expose their selected basis and missing physical inputs.
- Gate CI needed one correction from implementation audit: exact ASTM
  E492/E1007 one-third-octave sources already calculate `IIC` / `AIIC`
  through the ASTM E989 contour bridge and already have surface parity.
  Gate CI must therefore be treated as an expansion beyond that baseline
  into additional true ASTM-band owners or user-supplied ASTM band
  inputs, not as re-landing the exact-band bridge.
- Gate CJ is not a start-from-zero wall-topology task. Double-leaf,
  multicavity, full-fill, and field companions already exist for several
  explicit-support flat stacks. Gate CJ should expand remaining common
  flat topologies and protect the existing ambiguity stops.
- Gate CK is not a start-from-zero opening/leak task. Opening/leak
  runtime and A-weighted field/building surfaces already exist in
  company-internal lanes. Gate CK should broaden those adapters only
  where weak-path energy combination and input ownership are explicit.
- Gate CL has high accuracy ROI but lower immediate scope ROI. It should
  be selected when the next runtime move depends on tighter residual
  budgets or when source-owned calibration and holdout rows are ready.
- Gate CM is conditional. It is high ROI only after a selected runtime
  gate names physical fields that the API/workbench/report/replay
  surfaces cannot yet carry.

## Counting Semantics

Gate value must be counted in two ways:

- `newCalculableLayerTemplates`: newly admitted representative
  wall/floor construction families, not infinite material permutations.
- `newCalculableRequestShapes`: newly supported output/request forms for
  already-owned or newly-owned routes.

For example, Gate CD opened 2 representative finished open-box floor
stacks across 6 single-output request shapes. It did not claim infinite
new stacks. Future gates must report these counters explicitly:

- `newCalculableLayerTemplates`;
- `newCalculableRequestShapes`;
- `newMetricBasisOwners`;
- `accuracyOnlyTemplates`;
- `wrongAliasOrFallbackBlocks`;
- `requiredPhysicalInputFields`;
- `surfaceParityRequired`.

The count estimates below are implementation planning estimates until
Gate CE writes an executable matrix.

## ROI Scoring Policy

Gate CE should rank candidates with these weights:

1. user-frequency / industry commonness;
2. number of owned outputs unlocked;
3. implementation readiness in the current codebase;
4. wrong-number risk reduction;
5. source-row independence;
6. ability to prove with focused tests and visible `needs_input` /
   `unsupported` boundaries.

The current provisional order is:

1. target-output independence sweep;
2. common floor floating/covering expansion;
3. field/building direct + flanking adapters;
4. ASTM IIC/AIIC owner expansion;
5. common wall auto-topology expansion;
6. opening/leak/composite wall adapters;
7. residual accuracy + holdout program;
8. required physical input surface parity for the selected runtime
   gates.

## Gate CE - Executable Rerank And Metrics Contract

Type: no-runtime selection gate.

Estimated added calculation coverage:

- `newCalculableLayerTemplates`: 0;
- `newCalculableRequestShapes`: 0.

Why this is required:

Gate CE must stop agent drift. It must select the next value-moving
slice by evidence and counters, not by historical handoff inertia or
agent preference.

Required work:

- create `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ce-contract.test.ts`;
- rank all eight candidates from this document;
- import current Gate CD status and docs paths;
- prove broad source crawling, confidence wording, finite scenario
  packs, and generic UI/report/storage work are blocked non-goals;
- choose exactly one next value-moving Gate CF candidate;
- require future runtime gates to publish the coverage counters listed
  above.

Acceptance:

- no runtime values move;
- Gate CE selects one next action and one next contract file;
- the selected action passes the calculator advancement test;
- the plan cites this document and the source-of-truth file.

Landed status:

- Gate CE landed as `post_v1_next_numeric_coverage_gap_gate_ce_plan`;
- selection status:
  `post_v1_next_numeric_coverage_gap_gate_ce_landed_no_runtime_selected_target_output_independence_sweep_gate_cf`;
- selected candidate: `target_output_independence_sweep`;
- selected next action:
  `post_v1_target_output_independence_sweep_gate_cf_plan`;
- selected next file:
  `packages/engine/src/post-v1-target-output-independence-sweep-gate-cf-contract.test.ts`.

## Gate CF - Target-Output Independence Sweep

Type: runtime scope/correctness sweep.

Estimated added calculation coverage:

- `newCalculableLayerTemplates`: 0-4 physical templates;
- `newCalculableRequestShapes`: 20-60 output/request shapes.

Why this is high ROI:

Gate CD proved a real defect class: the engine can calculate an owned
value internally, but the value may still be parked as unsupported when
the user requests only one output instead of a mixed output set. That is
not an acoustic formula gap; it is a calculator route-publication gap.
Fixing it gives immediate scope without increasing formula risk.

Route families to audit first:

- finished open-box dry and EPS/screed routes beyond the Gate CD pins;
- raw-bare open-box and open-web floor routes;
- heavy/reinforced concrete combined floor routes;
- steel/lightweight floor formula routes;
- wall double-leaf, multileaf, and field/building companion routes;
- opening/leak routes with owned lab or field/building values.

Required implementation:

- add a reusable target-output support audit for all selected candidates;
- for each audited route, run single-output requests for each owned
  metric and compare against the mixed-request answer;
- keep companions parked when the route owns only a subset of metrics;
- never add unsupported `Ctr`, IIC, AIIC, field, or building outputs by
  alias.

Expected outputs unlocked:

- wall: `Rw`, STC, `C`, `Ctr`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`,
  `DnT,A`;
- floor: `Rw`, `C`, `Ctr`, `Ln,w`, `DeltaLw`, `CI`, `CI,50-2500`,
  `Ln,w+CI`, `L'n,w`, `L'nT,w`, `L'nT,50`.

Required negative tests:

- requesting only IIC/AIIC from ISO routes remains unsupported;
- requesting field outputs without field context remains `needs_input`;
- requesting building outputs without room/flanking context remains
  `needs_input`;
- lab `Rw` must not be relabelled as field `R'w`.

Exit criteria:

- at least 20 new request-shape pins across at least 4 existing runtime
  families, or Gate CE must document why the sweep is exhausted;
- no broad formula retune;
- full current gate green after runtime changes.

Landed status:

- Gate CF landed as `post_v1_target_output_independence_sweep_gate_cf_plan`;
- selection status:
  `post_v1_target_output_independence_sweep_gate_cf_landed_selected_floor_common_floating_covering_expansion_gate_cg`;
- value-moving correction: wall field-context lab companion
  single-output `Rw`, STC, `C`, and `Ctr` no longer fall to screening or
  unsupported publication on complete explicit-support flat double-leaf
  and full-fill multileaf stacks;
- audited parity pins: raw-bare open-web/open-box field impact,
  heavy-concrete combined lab impact, steel suspended-ceiling field
  impact, wall double-leaf field/lab, and wall multileaf field/lab;
- coverage counters: `newSingleOutputParityPins 37`,
  `runtimeCorrectedRequestShapes 8`, `newCalculableRequestShapes 8`,
  `newCalculableLayerTemplates 0`;
- selected next action:
  `post_v1_floor_common_floating_covering_expansion_gate_cg_plan`;
- selected next file:
  `packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg-contract.test.ts`.

## Gate CG - Common Floor Floating/Covering Expansion

Type: runtime scope expansion.

Estimated added calculation coverage:

- `newCalculableLayerTemplates`: 8-15;
- `newCalculableRequestShapes`: 40-120.

Why this is high ROI:

Common real floor work is not just a bare slab. It is usually a base
structure plus floor covering, resilient layer, floating screed or board
package, and often a suspended ceiling/lower treatment. INSUL and
Acoulatis both treat floor coverings, impact boards, lightweight/timber
floors, and concrete floors as central capabilities. ISO 717-2 also
explicitly covers impact reduction from floor coverings and floating
floors.

Representative layer templates:

1. reinforced/heavy concrete + resilient underlay + floating screed;
2. reinforced/heavy concrete + floor covering only;
3. reinforced/heavy concrete + floating screed + suspended ceiling;
4. hollow-core slab + resilient underlay + topping;
5. timber joist + floor covering + resilient ceiling;
6. mass-timber/CLT + floating dry board package;
7. lightweight steel/open-web + floor covering + resilient ceiling;
8. open-box timber + EPS/screed or dry package variants;
9. mixed upper/lower floor package with one primary carrier and one
   owned lower treatment.

Required physical inputs:

- base carrier family and thickness;
- density or mass-per-area for slabs/boards/toppings;
- resilient layer dynamic stiffness `s'` in MN/m3;
- resilient layer thickness;
- load basis kg/m2;
- screed/topping material, thickness, and mass;
- floor covering type and thickness;
- ceiling/lower assembly type, cavity depth, board layers, and fill;
- field impact context only when field outputs are requested.

Expected outputs:

- lab: `Ln,w`, `DeltaLw`, `CI`, `CI,50-2500`, `Ln,w+CI`;
- field: `L'n,w`, `L'nT,w`, `L'nT,50` with explicit field context;
- airborne companions only when the route separately owns `Rw` / `R'w`
  / `DnT,w`.

Required negative tests:

- missing dynamic stiffness or load basis cannot invent `DeltaLw`;
- ceiling/lower treatment cannot be guessed from visual layer names
  alone when owner fields are required;
- ASTM IIC/AIIC remain unsupported unless the request has current exact
  ASTM E492/E1007 bands or Gate CI owns a new ASTM basis;
- lab impact cannot become field impact without `impactFieldContext`.

Exit criteria:

- at least 8 new representative floor templates calculate at least one
  owned impact output;
- at least 4 templates calculate both lab and field impact when field
  context is complete;
- every stopped output reports exact missing fields.

Partial landed status:

- Gate CG landed as
  `post_v1_floor_common_floating_covering_expansion_gate_cg_plan`;
- selection status:
  `post_v1_floor_common_floating_covering_expansion_gate_cg_landed_partial_selected_floor_common_floating_covering_expansion_gate_cg2`;
- landed coverage: `newCalculableLayerTemplates 4`,
  `newCalculableRequestShapes 20`, and
  `runtimeCorrectedRequestShapes 12`;
- landed scope: four floor-covering-only heavy/reinforced concrete
  templates now preserve owned bare-heavy `Ln,w` and field-impact
  companions from explicit `impactFieldContext` while `DeltaLw` remains
  `needs_input` for `toppingOrFloatingLayer`,
  `resilientLayerDynamicStiffnessMNm3`, and `loadBasisKgM2`;
- Gate CG is intentionally partial and selects
  `post_v1_floor_common_floating_covering_expansion_gate_cg2_plan` in
  `packages/engine/src/post-v1-floor-common-floating-covering-expansion-gate-cg2-contract.test.ts`
  to continue the same high-ROI floor floating/covering expansion
  before Gate CH is selected.

## Gate CH - Field/Building Direct + Flanking Adapters

Type: runtime scope and accuracy expansion.

Estimated added calculation coverage:

- `newCalculableLayerTemplates`: 8-14 basis templates;
- `newCalculableRequestShapes`: 50-120.

Why this is high ROI:

Lab values are not field/building values. ISO 12354-1 and ISO 12354-2
estimate building performance from direct and indirect/flanking
transmission through participating building elements. Without this gate,
the calculator can look good in lab metrics while still being incomplete
or wrong for real `R'w`, `DnT,w`, `L'n,w`, and `L'nT,w` use.

Representative scope:

- wall double-leaf and multileaf lab routes to field/building airborne;
- wall single-leaf/massive and lined massive routes to field/building
  airborne;
- floor airborne routes to `R'w`, `Dn,w`, `DnT,w`;
- floor impact routes to `L'n,w`, `L'nT,w`, `L'nT,50`;
- direct+flanking explicit path adapters for common junction cases.

Required physical inputs:

- separating element area;
- receiving room volume;
- receiving room RT60;
- source/receiving room geometry when required by the chosen route;
- junction class and junction length;
- flanking element family, area, and path type;
- path penalty or Kij where explicitly supplied;
- edge isolation class and short-circuit risk;
- lower-treatment/flanking reduction where applicable.

Expected outputs:

- airborne: `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`;
- impact: `L'n,w`, `L'nT,w`, `L'nT,50`.

Required negative tests:

- lab `Rw` cannot become `R'w`;
- field/apparent output cannot become building-prediction output unless
  the selected adapter owns that basis;
- missing RT60 or room volume returns `needs_input`;
- direct-only output must not hide flanking penalties when flanking
  paths are supplied.

Exit criteria:

- at least 8 field/building basis templates publish owned outputs;
- at least 4 templates include explicit flanking path effects;
- all adapters expose basis, missing inputs, and value pins through
  engine/API/workbench/report surfaces required by the selected gate.

Landed status:

- Gate CH landed as `post_v1_next_numeric_coverage_gap_gate_ch_plan`;
- selection status:
  `post_v1_next_numeric_coverage_gap_gate_ch_landed_runtime_selected_next_numeric_coverage_gap_gate_ci`;
- value-moving correction: the Gate CG2 visible heavy-floating
  upper-treatment field adapter now uses explicit
  `impactFieldContext.ci50_2500Db` on the direct+flanking path and
  publishes `L'n,w 57.5 / L'nT,w 55.1 / L'nT,50 59.1`;
- missing `impactFieldContext.ci50_2500Db` still stops only
  `L'nT,50` as `needs_input`;
- ASTM `IIC` / `AIIC` remain unsupported without ASTM E492/E1007
  owners;
- coverage counters: `newCalculableLayerTemplates 2`,
  `newCalculableRequestShapes 4`, and
  `runtimeCorrectedRequestShapes 3`;
- selected next action:
  `post_v1_next_numeric_coverage_gap_gate_ci_plan`;
- selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ci-contract.test.ts`.

## Gate CI - ASTM IIC/AIIC Owner Expansion Beyond Exact Bands

Type: metric-basis owner expansion.

Estimated added calculation coverage:

- `newCalculableLayerTemplates`: 0-4 metric-basis templates;
- `newCalculableRequestShapes`: 2-20, depending on whether a new ASTM
  band owner or user ASTM band input route is evidence-ready.

Why this is high ROI:

IIC/AIIC are common in North American floor decisions and codes. ASTM
E989 separates lab IIC from field AIIC/ISR/NISR and relies on ASTM E492
or E1007 one-third-octave impact data. The current engine already
calculates complete exact ASTM E492 lab bands into `IIC` and complete
ASTM E1007 field bands into `AIIC` through
`packages/engine/src/impact-astm-e989.ts`, and the shared rating-adapter
schema blocks ISO/ASTM metric aliases. Gate CI therefore must not repeat
Gate F/G. Its value is to admit additional true ASTM-band routes or an
explicit user ASTM-band input surface while preserving the current exact
ASTM baseline.

Required physical / data inputs:

- complete ASTM impact one-third-octave band data from 100 Hz to
  3150 Hz;
- source method marking E492 for lab IIC or E1007 for field AIIC;
- lab/field basis flag;
- no ISO-only `Ln,w`, `CI`, or `L'nT,w` shortcut.

Implementation focus:

- reuse `packages/engine/src/impact-astm-e989.ts`;
- preserve the existing exact ASTM E492 -> `IIC` and ASTM E1007 ->
  `AIIC` baseline as regression guards;
- evaluate whether any formula route truly owns an ASTM one-third-octave
  impact curve. If not, keep formula-derived ASTM ratings blocked;
- if selected, add explicit user-supplied ASTM band input ownership
  through API/workbench/report/replay surfaces instead of copying ISO
  single-number values;
- make unsupported ASTM outputs visible beside supported ISO outputs
  without marking ISO routes as ASTM-capable.

Required negative tests:

- ISO `Ln,w` does not become IIC;
- ISO `L'nT,w` does not become AIIC;
- incomplete ASTM bands return unsupported/needs-input rather than a
  guessed rating;
- E492 data cannot publish AIIC; E1007 data cannot publish lab IIC.

Exit criteria:

- existing lab ASTM E492 exact-band `IIC` and field ASTM E1007
  exact-band `AIIC` tests remain green;
- either at least one new true ASTM-band owner/input route is admitted,
  or Gate CI lands no-runtime evidence that no safe expansion is ready
  and reranks to the next value-moving gate;
- at least four ISO impact routes prove ASTM aliases remain blocked.

Landed status:

- Gate CI landed as `post_v1_next_numeric_coverage_gap_gate_ci_plan`;
- selection status:
  `post_v1_next_numeric_coverage_gap_gate_ci_landed_no_runtime_selected_wall_common_auto_topology_expansion_gate_cj`;
- selected candidate: `wall.common_auto_topology_expansion`;
- selected next action:
  `post_v1_wall_common_auto_topology_expansion_gate_cj_plan`;
- selected next file:
  `packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts`;
- no runtime values moved; the exact ASTM E492/E1007 owner remains live,
  four representative ISO impact routes keep `IIC` / `AIIC`
  unsupported, and user-supplied ASTM band input is deferred until a
  separately selected API/workbench/report/replay surface slice.
- implementation comparison plan:
  `docs/calculator/POST_V1_GATE_CI_CJ_ENGINE_PLAN_2026-06-05.md`.

## Gate CJ - Common Wall Auto-Topology Expansion

Type: runtime scope expansion through safer route selection.

Landed status:

- Gate CJ landed as
  `post_v1_wall_common_auto_topology_expansion_gate_cj_plan`;
- selection status:
  `post_v1_wall_common_auto_topology_expansion_gate_cj_landed_runtime_selected_opening_leak_composite_wall_adapters_gate_ck`;
- runtime correction: common flat double-leaf wall
  `building_prediction` requests with explicit `supportTopology`,
  `studSpacingMm`, complete room/flanking context, and any required
  `resilientBarSideCount` now use the Gate S double-leaf/framed direct
  curve inside the Gate AR building adapter instead of the generic
  building fallback;
- newly/correctly covered templates include simple independent,
  resilient both-sides, multi-board, split air/porous cavity,
  asymmetric board-count, and explicit double-leaf building topology;
- missing `supportTopology`, missing `studSpacingMm`, explicit
  `flat_layer_order`, missing `sourceRoomVolumeM3`, and missing
  `resilientBarSideCount` remain `needs_input` / `unsupported`
  boundaries instead of publishing a generic building number;
- counters: `newCalculableLayerTemplates 1`,
  `newCalculableRequestShapes 5`, `runtimeCorrectedLayerTemplates 5`,
  and `runtimeCorrectedRequestShapes 25`;
- selected next action:
  `post_v1_opening_leak_composite_wall_adapters_gate_ck_plan`;
- selected next file:
  `packages/engine/src/post-v1-opening-leak-composite-wall-adapters-gate-ck-contract.test.ts`.

Estimated added calculation coverage:

- `newCalculableLayerTemplates`: 10-18;
- `newCalculableRequestShapes`: 60-150.

Why this is high ROI:

Users usually enter flat layers such as gypsum / stud cavity / gypsum.
They do not naturally enter acoustic leaf/cavity grouping. If the
calculator cannot safely infer common double-leaf and multileaf
topologies from flat layers, scope remains artificially narrow even when
the formulas already exist.

Representative layer templates:

1. gypsum / mineral wool cavity / gypsum independent stud;
2. gypsum / mineral wool cavity / gypsum resilient one-side;
3. gypsum / mineral wool cavity / gypsum resilient both-sides;
4. double-stud wall;
5. staggered-stud wall;
6. masonry or concrete core with framed liner;
7. CLT or mass-timber panel with independent lining;
8. full-fill multicavity gypsum / wool / gypsum / wool / gypsum;
9. air-gap multicavity with explicit air segments;
10. asymmetric board-count framed walls.

Required physical inputs:

- support/stud type;
- stud spacing;
- connection/shared-track state;
- resilient bar side count;
- explicit air-gap and porous-fill layers;
- board layer count and thickness;
- material density/mass where not known;
- field/building context only for field/building outputs.

Required negative tests:

- ambiguous flat order does not guess;
- duplicate cavity groups do not merge silently;
- resilient side count missing remains `needs_input` when required;
- single-leaf mass law does not steal double-leaf or multileaf stacks;
- lab route does not leak field outputs.

Exit criteria:

- at least 10 new representative wall templates calculate lab outputs;
- at least 4 of those templates calculate field/building outputs when
  complete context is present;
- no unsafe topology promotion from ambiguous layers.

## Gate CK - Opening/Leak/Composite Wall Adapters

Type: runtime scope and wrong-number prevention.

Landed status:

- Gate CK landed as
  `post_v1_opening_leak_composite_wall_adapters_gate_ck_plan`;
- selection status:
  `post_v1_opening_leak_composite_wall_adapters_gate_ck_landed_runtime_selected_next_numeric_coverage_gap_gate_cl`;
- runtime correction: explicit top-level `openingLeakElements` plus
  `hostWallAreaM2` now route through the owned Gate S opening/leak lab
  composite anchor and the company-internal field/building area-energy
  adapters without requiring a hidden
  `openingLeakFieldBuildingAdapterBoundary` flag;
- complete field opening/leak context publishes `R'w 36.4 / Dn,w 36.7 /
  DnT,w 36.9`;
- complete building-prediction opening/leak context publishes
  `R'w 31.6 / DnT,w 32.1`;
- missing room/flanking physical inputs remain `needs_input`,
  A-weighted outputs remain blocked without `frequencyBandSet`, and lab
  `Rw` / STC remain separate from field/building metrics;
- counters: `newCalculableLayerTemplates 2`,
  `newCalculableRequestShapes 5`, `runtimeCorrectedLayerTemplates 2`,
  and `runtimeCorrectedRequestShapes 5`;
- selected next action:
  `post_v1_next_numeric_coverage_gap_gate_cl_plan`;
- selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts`.

Estimated added calculation coverage:

- `newCalculableLayerTemplates`: 6-12;
- `newCalculableRequestShapes`: 30-80.

Why this is high ROI:

Real walls often include doors, windows, penetrations, service gaps, or
perimeter leakage. Ignoring them overstates performance. Professional
prediction tools expose composite transmission loss and leakage
calculation because these weak paths frequently dominate final airborne
performance.

Representative layer templates:

1. wall + single door opening;
2. wall + window/glazing opening;
3. wall + multiple openings;
4. wall + service penetration leak;
5. wall + perimeter seal leakage;
6. composite wall with two or more component TL curves;
7. opening/leak field-between-rooms adapter;
8. opening/leak building-prediction adapter.

Required physical inputs:

- total separating area;
- each component/opening area;
- component TL curve or owned `Rw`/STC basis;
- leakage path class or equivalent gap area/path length;
- perimeter seal state;
- room/RT60/flanking context for field/building outputs;
- A-weighted spectrum only when `Dn,A` / `DnT,A` owners exist.

Required negative tests:

- base wall result cannot ignore an opening when opening inputs exist;
- opening lab `Rw` does not become field `R'w` without adapter context;
- A-weighted outputs remain unsupported without spectrum owner;
- missing component area returns `needs_input`.

Exit criteria:

- at least 6 composite/opening/leak templates publish owned outputs;
- at least 3 include field/building outputs;
- weak-path energy combination lowers or bounds the result instead of
  leaving the base wall value optimistic.

## Gate CL - Residual Accuracy + Holdout Program

Type: accuracy/calibration program.

Landed status:

- Gate CL landed as `post_v1_next_numeric_coverage_gap_gate_cl_plan`;
- selection status:
  `post_v1_next_numeric_coverage_gap_gate_cl_landed_no_runtime_selected_required_physical_input_surface_parity_gate_cm`;
- no runtime values moved; Gate CK opening/leak pins and Gate CJ common
  wall building pins remain frozen;
- residual ledgers were created for common flat double-leaf building
  prediction, opening/leak field/building, open-box raw-bare lab impact,
  open-web raw-bare lab impact, and heavy floating upper-treatment field
  companion routes;
- every ledger holds the current wider error budget because same-family
  calibration rows and same-basis holdout rows are not yet sufficient for
  budget tightening;
- near-source rows are blocked from runtime promotion unless they become
  owned exact answers, anchors, calibration rows, or holdout rows with
  matching metric/basis ownership;
- counters: `residualLedgers 5`, `budgetsHeldWide 5`,
  `budgetsTightened 0`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, and
  `runtimePromotionsFromSourceProximity 0`;
- selected next action:
  `post_v1_required_physical_input_surface_parity_gate_cm_plan`;
- selected next file:
  `packages/engine/src/post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts`.

Estimated added calculation coverage:

- `newCalculableLayerTemplates`: 0-3;
- `newCalculableRequestShapes`: 0-15.

Why this is high ROI:

Opening more routes is not enough. Source-absent families such as
open-box/open-web floors and multileaf walls need holdouts to prove
numeric quality and tighten error budgets. Without holdouts, the product
can become broader while remaining too uncertain for industry-grade use.

Initial target families:

- open-box timber raw-bare and finished package transfer;
- open-web steel raw-bare and supported-band routes;
- common wall double-leaf and multileaf auto-topology routes;
- opening/leak composite wall routes;
- floating floor / covering routes from Gate CG.

Required evidence:

- source-owned calibration rows;
- source-owned holdout rows not used for fitting;
- paired negative rows for unsafe near-matches;
- residual/error-budget policy per metric and basis;
- before/after predictions stored as executable tests.

Initial acceptance thresholds:

- do not tighten an error budget without at least one calibration row
  and one holdout row for the same family/basis;
- target MAE <= 3 dB for airborne one-number lab routes where the
  evidence set supports that claim;
- target MAE <= 5 dB for impact one-number routes where the evidence
  set supports that claim;
- if holdouts fail, keep the wider budget and document why.

Required negative tests:

- a holdout row cannot also be used as a calibration row;
- source rows cannot override a different topology or metric basis;
- exact rows still win only for same stack/topology/metric/basis;
- budget tightening cannot hide unsupported outputs.

Exit criteria:

- at least 3 family/basis residual ledgers exist;
- at least 2 families either tighten a budget with holdout proof or
  explicitly hold the wider budget with failing evidence preserved;
- no runtime route is promoted solely by source-row proximity.

## Gate CM - Required Physical Input Surface Parity

Type: input-surface unlock for selected runtime gates only.

Landed status:

- Gate CM landed as
  `post_v1_required_physical_input_surface_parity_gate_cm_plan`;
- selection status:
  `post_v1_required_physical_input_surface_parity_gate_cm_landed_no_runtime_selected_next_numeric_coverage_gap_gate_cn`;
- no runtime values moved, no formulas were retuned, no frontend
  implementation was touched, and no source rows were crawled;
- selected-route required physical input and `needs_input` boundaries
  are pinned for Gate CK opening/leak field/building, Gate CJ common flat
  double-leaf building prediction, Gate CG2 heavy-floating dynamic
  `DeltaLw`, and Gate CH direct/flanking field-impact `L'nT,50`;
- counters: `inputSurfaceLedgers 4`,
  `requiredPhysicalInputsPinned 20`, `guardedRequestShapes 15`,
  `newCalculableLayerTemplates 0`, `newCalculableRequestShapes 0`, and
  `runtimeValuesMoved 0`;
- selected next action:
  `post_v1_next_numeric_coverage_gap_gate_cn_plan`;
- selected next file:
  `packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cn-contract.test.ts`.

Estimated added calculation coverage:

- `newCalculableLayerTemplates`: 0 engine templates;
- `newCalculableRequestShapes`: 5-20 user-usable request shapes.

Why this is high ROI:

An engine route is not useful if users cannot supply the required
physical inputs through the API/workbench/report/replay surfaces. This
gate is allowed only when a selected runtime gate already requires these
fields. It is not generic UI polish.

Required fields depend on the selected runtime gates, but likely include:

- `resilientLayerDynamicStiffnessMNm3`;
- `loadBasisKgM2`;
- `impactFieldContext.fieldKDb`;
- `impactFieldContext.receivingRoomVolumeM3`;
- `impactFieldContext.receivingRoomRt60S`;
- flanking path descriptors and path penalties;
- opening/component areas;
- stud/support topology fields;
- ASTM impact band arrays.

Acceptance:

- workbench can enter every required field for the selected route;
- `/api/estimate`, `/api/impact-only`, saved replay, server snapshot
  replay, and reports preserve the fields;
- missing fields surface as exact `needs_input`, not hidden defaults;
- no formula moves solely because a UI default was saved.

## Gate CN - Numeric Coverage Rerank After Input Guards

Type: no-runtime selection gate.

Landed status:

- Gate CN landed as `post_v1_next_numeric_coverage_gap_gate_cn_plan`;
- selection status:
  `post_v1_next_numeric_coverage_gap_gate_cn_landed_no_runtime_selected_floor_visible_layer_upper_package_delta_lw_gate_co`;
- selected candidate:
  `floor.visible_layer_upper_package_delta_lw_formula_routing_gap`;
- selected next action:
  `post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan`;
- selected next file:
  `packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts`;
- counters: `candidateCount 7`, `newCalculableLayerTemplates 0`,
  `newCalculableRequestShapes 0`, `runtimeValuesMoved 0`,
  `estimatedNextNewCalculableLayerTemplates 2`, and
  `estimatedNextNewCalculableRequestShapes 10`.

Why this is the highest-ROI next slice for the stated calculator goal:

The engine already owns timber/CLT `DeltaLw` formula routes when the
same construction is supplied as explicit `impactPredictorInput`.
However, users normally enter visible layer stacks. Tagged CLT and
timber upper-package layers with equivalent physical inputs currently
publish only `Ln,w`; `DeltaLw` remains hidden behind the missing
visible-layer-to-formula routing. Gate CO therefore increases real
calculator scope by binding layer-entered floor packages to the existing
family formula owner. It does not require broad source crawling,
confidence wording, or frontend implementation.

Gate CO acceptance preview:

- visible CLT dry upper-package layers with complete load basis and
  resilient dynamic stiffness publish `DeltaLw` from the existing
  mass-timber CLT owner while preserving the existing `Ln,w` anchor;
- visible timber joist upper/lower package layers publish `DeltaLw` from
  the existing timber joist owner while preserving the existing `Ln,w`
  anchor;
- missing `loadBasisKgM2`, missing
  `resilientLayerDynamicStiffnessMNm3`, or missing lower assembly still
  returns `needs_input`;
- ISO `DeltaLw` does not publish ASTM `IIC` / `AIIC`;
- no source-proximity row can promote runtime values.

## Expected Product State After These Gates

If Gates CE-CN land with the stated acceptance, DynEcho should move from
"usable V1 plus strong post-V1 slices" to a much stronger internal
professional calculator:

- common wall/floor stacks calculate more consistently from flat layer
  input;
- common floating floor and floor-covering packages produce impact
  outputs when physical inputs exist;
- field/building outputs become more broadly available with explicit
  room/flanking context;
- ASTM IIC/AIIC coverage expands only from true ASTM band ownership;
  the existing exact E492/E1007 E989 bridge remains protected from ISO
  aliasing;
- openings/leaks/composite weak paths reduce optimistic wall numbers;
- selected families have holdout-backed accuracy posture.

This still would not close every industry-grade gap. Remaining large
programs after these gates:

- facade/glazing/roof/rain/noise-from-outside coverage if selected as
  product scope;
- broader third-octave curve ownership for every formula family;
- larger source-owned calibration and holdout corpus;
- regional code output adapters beyond ISO/ASTM core metrics;
- richer material-property governance for density, stiffness, loss
  factor, damping, and dynamic stiffness.

## Immediate Next Action

Start Gate CO:
`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan`.
Gate CH closed the field/building direct+flanking low-frequency
correction for the Gate CG2 visible heavy-floating upper-treatment
route. Gate CI then closed no-runtime: exact ASTM E492/E1007
one-third-octave `IIC` / `AIIC` remains the only ASTM runtime owner, ISO
impact outputs still do not become ASTM aliases, and
`wall.common_auto_topology_expansion` was selected as the next
value-moving engine slice. Gate CJ then landed: complete flat
double-leaf wall `building_prediction` requests now use the Gate S
double-leaf/framed direct curve through the Gate AR building adapter,
while ambiguous topology, missing resilient side count, missing support
topology, missing stud spacing, and explicit `flat_layer_order`
boundaries remain closed. Gate CJ selects opening/leak/composite wall
adapters as the next calculator slice. Gate CK then landed: complete
top-level field opening/leak context calculates `R'w 36.4 / Dn,w 36.7 /
DnT,w 36.9`, complete top-level building-prediction opening/leak context
calculates `R'w 31.6 / DnT,w 32.1`, and missing room/flanking,
A-weighted frequency, and lab/field/building metric boundaries remain
closed. Gate CK selected the next numeric coverage gap rerank. Gate CL
then landed no-runtime: residual and holdout ledgers were created for
five existing runtime families, all wider budgets were held, no
source-proximity runtime promotion was admitted, and budget tightening is
blocked until same-family calibration plus same-basis holdout evidence
exists. Gate CL selected required physical input surface parity as the
next calculator slice:
`post_v1_required_physical_input_surface_parity_gate_cm_plan` in
`packages/engine/src/post-v1-required-physical-input-surface-parity-gate-cm-contract.test.ts`.
Gate CM then landed no-runtime: selected-route required physical input
and `needs_input` boundaries were pinned for Gate CK/CJ/CG2/CH runtime
routes without frontend implementation, formula retuning, source
crawling, or runtime value movement. Gate CM returns the chain to
numeric scope/accuracy work by selecting
`post_v1_next_numeric_coverage_gap_gate_cn_plan` in
`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cn-contract.test.ts`.
Gate CN then landed no-runtime: it selected
`floor.visible_layer_upper_package_delta_lw_formula_routing_gap` as the
highest-ROI next engine slice and selected
`post_v1_floor_visible_layer_upper_package_delta_lw_gate_co_plan` in
`packages/engine/src/post-v1-floor-visible-layer-upper-package-delta-lw-gate-co-contract.test.ts`.
Gate CO must move runtime only by routing visible tagged CLT/timber
upper-package layer stacks to the existing `DeltaLw` formula owners when
the route-required physical inputs are present.
