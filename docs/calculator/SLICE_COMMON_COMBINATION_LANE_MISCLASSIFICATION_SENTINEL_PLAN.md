# Slice Plan - Common Combination Lane Misclassification Sentinel

Slice id: `common_combination_lane_misclassification_sentinel_v1`

Status: CLOSED / SELECTED SOURCE GAP REVALIDATION V18

Selected by:

`calculator_source_gap_revalidation_v17` Gate A

Selection status:

`selected_common_combination_lane_misclassification_sentinel_after_v17_rerank_found_no_source_ready_runtime_candidate_and_user_reinforced_always_on_wrong_lane_monitoring`

Selected first file:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`

Selected first action:

`gate_a_inventory_frequent_wall_floor_lane_sentinel_no_runtime`

Gate A status:

`common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes`

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md`

Gate B status:

`common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice`

Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md`

Gate C status:

`closed_common_combination_lane_misclassification_sentinel_no_runtime_and_selected_source_gap_revalidation_v18`

Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout`

Selected next slice:

`calculator_source_gap_revalidation_v18`

Prior source-gap checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md`

## Objective

Create an always-on no-runtime sentinel matrix for frequent wall and
floor combinations that can fail like the rockwool triple-leaf reorder
defect: the calculator can appear plausible while it selected the
wrong route family, wrong source lane, wrong support class, wrong
confidence class, wrong lab/field posture, or wrong material alias.

This slice must not tune numeric values or import a source row. Gate A
must inventory the common combinations, snapshot current behavior, and
classify suspicious results into:

`note_test_document_or_easy_fix`

## Standing Rule

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must keep watching for lane errors on
frequent wall/floor stacks. The required response when suspicious
behavior appears:

1. Reproduce it with a focused test when possible.
2. Record
   `route_family_source_lane_support_confidence_output_warning_snapshot_matrix`.
3. If the fix is small, bounded, and test-backed, implement it
   immediately.
4. If not, document it in the risk register / slice docs and keep
   outputs fail-closed or visibly screening.

## Gate A Landing

Gate A added:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`

Status:

`common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes`

Landed artifacts:

1. `frequent_wall_floor_combination_inventory`
2. `route_family_source_lane_support_confidence_output_warning_snapshot_matrix`
3. `small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants`
4. `note_test_document_or_easy_fix_decision_log`
5. `paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement`
6. `next_closeout_or_bounded_easy_fix_decision`

Current snapshot pins include grouped split-rockwool `Rw 41`
low-confidence `multileaf_screening_blend` as not fixed/source
validated, split-rockwool and classic framed flat-list swaps held by
`multileaf_screening_blend_fail_closed_until_grouped_topology`,
AAC/board/fill/gap lined-massive `family-boundary hold`, duplicate
many-layer finite drift, raw TUAS R5b parity with
`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`, raw
TUAS X4 CLT floor-role prompt carrying `raw_floor_role_inference`,
near-source alias / field-output context-only rows, and hostile input
fail-closed rows.

Gate A remains no-runtime: runtime, support, confidence, evidence, API,
route-card, output-card, proposal/report, and workbench-input behavior
stay frozen.

## Gate B Requirements

Gate B added:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`

with:

`gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`

Gate B reprobed the Gate A matrix row by row and landed
`gate_b_reprobe_findings`. It did not find a small bounded fix ready to
implement. The split-rockwool and classic framed adjacent-swap rows are
guard-green under
`multileaf_screening_blend_fail_closed_until_grouped_topology`; grouped
split-rockwool remains blocked at
`paused_waiting_rights_safe_source_packet`; masonry / lined-massive
boundary drift remains documented fail-closed risk; duplicate many-layer
drift, field-output leakage, near-source aliases, hostile payloads, and
curve-digitization provenance remain documented sentinel rows.

Gate B selected:

`packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts`

with:

`gate_c_closeout_and_next_slice_selection_after_gate_b_reprobes_no_runtime`

Status:

`common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice`

## Gate C Closeout

Gate C added:

`packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts`

with:

`gate_c_closeout_and_next_slice_selection_after_gate_b_reprobes_no_runtime`

Status:

`closed_common_combination_lane_misclassification_sentinel_no_runtime_and_selected_source_gap_revalidation_v18`

Gate C closed the sentinel no-runtime and selected:

`calculator_source_gap_revalidation_v18`

with:

`gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout`

Target first gate file:

`packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`

Selected v18 planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_PLAN.md`

Gate C keeps every `gate_b_reprobe_findings` row active as a source-gap
revalidation boundary. It found no runtime candidate, no source import,
and no small bounded fix ready now.

## Gate B Findings

`gate_b_reprobe_findings`

- `split_rockwool_grouped_rw41_blocked_source_packet`
- `split_rockwool_flat_swap_fail_closed_guard_green`
- `classic_framed_adjacent_swap_fail_closed_guard_green`
- `aac_board_fill_gap_lined_massive_boundary_documented_fail_closed`
- `duplicate_many_layer_classic_stack_finite_watch`
- `raw_floor_open_box_parity_green`
- `raw_floor_clt_role_prompt_guard_green`
- `near_source_alias_context_only_watch`
- `field_output_copy_leakage_watch`
- `hostile_api_import_fail_closed_green`
- `curve_digitization_provenance_blocked_source_qc`

## Initial Frequent Combination Families

- rockwool-like triple-leaf and double-leaf wall stacks;
- LSF and timber stud double-board wall stacks;
- lined masonry, massive masonry, AAC, pumice, concrete, and board/fill/gap
  hybrid stacks;
- CLT, open-box, open-web, and Dataholz/TUAS-style floor stacks;
- raw floor order and duplicate-role floor stacks;
- near-source manufacturer rows carrying STC, IIC, ASTC, field, or
  non-DynEcho metrics;
- hostile API/import payloads.

## Protected Boundaries

- `standing_lane_misclassification_monitoring_mandate`
- `note_test_document_or_easy_fix`
- `frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk`
- `easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests`
- `paused_waiting_rights_safe_source_packet`
- `multileaf_screening_blend_fail_closed_until_grouped_topology`
- `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
- `raw_floor_role_inference`

## Frozen Surfaces

Until Gate B selects a bounded fix, this slice freezes:

- runtime
- support
- confidence
- evidence
- API
- route-card
- output-card
- proposal/report
- workbench-input

## Validation

Required for Gate C:

- focused common-combination sentinel Gate C closeout contract:
  `pnpm --filter @dynecho/engine exec vitest run src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts --maxWorkers=1`;
- continuity with Gate B, Gate A, v17, floor raw-role Gate C,
  route-family lane-drift Gate E / Gate F, and route-source risk
  register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Gate C validation completed on 2026-05-04:

- focused Gate C closeout: 1 file / 6 tests passed;
- continuity with Gate A, Gate B, v17, floor raw-role Gate C,
  route-family lane-drift Gate E / Gate F, and route-source risk
  register: 8 files / 58 tests passed;
- `pnpm calculator:gate:current`: engine 233 files / 1333 tests, web
  49 files / 234 passed + 18 skipped, repo build 5 / 5 successful with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck`;
- final `git diff --check` passed.

Required for Gate B:

- focused common-combination sentinel Gate B reprobe contract;
- continuity with Gate A, v17, route-source risk register, wall
  flat-list guard, floor raw-role guard, hostile input, floor/order, and
  common-stack watchlist tests;
- paired web-visible tests if route-card, output-card, warning copy,
  support, confidence, or output status moves;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Gate B validation requirement:

- focused common-combination sentinel Gate B contract:
  `pnpm --filter @dynecho/engine exec vitest run src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts --maxWorkers=1`;
- continuity with Gate A, v17, route-source risk register, wall
  flat-list guard, floor raw-role guard, and common-stack watchlist
  closeout;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Gate B validation completed on 2026-05-04:

- focused Gate B: 1 file / 9 tests passed;
- continuity with Gate A, v17, floor raw-role Gate C, route-family
  lane-drift Gate E / Gate F, and route-source risk register: 7 files /
  52 tests passed;
- `pnpm calculator:gate:current`: engine 232 files / 1327 tests, web
  49 files / 234 passed + 18 skipped, repo build 5 / 5 successful with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck`;
- final `git diff --check` passed.

Gate A validation requirement:

- focused common-combination sentinel Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts --maxWorkers=1`;
- continuity with v17, route-source risk register, wall flat-list
  guard, floor raw-role guard, hostile input, floor/order, and
  common-stack watchlist tests;
- paired web-visible tests if route-card, output-card, warning copy,
  support, confidence, or output status moves;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Gate A validation completed on 2026-05-04:

- focused Gate A: 1 file / 8 tests passed;
- continuity with v17, floor raw-role Gate C, route-family lane-drift
  Gate E / Gate F, and route-source risk register: 6 files / 43 tests
  passed;
- `pnpm calculator:gate:current`: engine 231 files / 1318 tests, web
  49 files / 234 passed + 18 skipped, repo build 5 / 5 successful with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck`;
- final `git diff --check` passed.
