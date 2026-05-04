# Slice Plan - Calculator Source Gap Revalidation v17

Slice id: `calculator_source_gap_revalidation_v17`

Status: GATE A LANDED / COMMON-COMBINATION LANE SENTINEL SELECTED

Selected by:

`floor_raw_role_inference_guardrail_v1` Gate C

Selection status:

`floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`

Landed Gate A status:

`selected_common_combination_lane_misclassification_sentinel_after_v17_rerank_found_no_source_ready_runtime_candidate_and_user_reinforced_always_on_wrong_lane_monitoring`

Landed Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md`

Selected next slice:

`common_combination_lane_misclassification_sentinel_v1`

Selected next file:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`

Selected next action:

`gate_a_inventory_frequent_wall_floor_lane_sentinel_no_runtime`

Selected next planning surface:

`docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md`

## Objective

Re-rank the source and accuracy backlog after the floor raw-role prompt
guard landed. The goal is to decide whether any source-ready runtime
candidate exists now, or whether the next action should be another
bounded no-runtime correctness slice.

Gate A found no source-ready runtime candidate. The original
rockwool triple-leaf lane remains
`paused_waiting_rights_safe_source_packet`; closed manufacturer rows
remain context-only; GA-600 still needs rights-safe current row
payloads; and floor tolerance-edge work should follow the broader
common-combination sentinel.

The wall flat-list guard remains:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

The floor raw-order boundary remains:

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

The selected next slice is
`common_combination_lane_misclassification_sentinel_v1` because the user
reinforced the standing requirement that DynEcho must continuously look
for wrong route-family / wrong source-lane behavior on frequent wall
and floor combinations.

## Standing Monitoring Mandate

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must actively watch for:

- common stacks dropping into the wrong route family or source lane;
- large value jumps after small layer edits;
- duplicate or many-layer stacks changing family or exactness;
- masonry / lined-massive / AAC / pumice / concrete boundary drift;
- raw floor role inference drift;
- near-source false promotion;
- field-output leakage;
- material alias / coalescing mistakes;
- hostile API/import input failures;
- curve digitization or provenance errors.

When a suspicious result appears, use:

`note_test_document_or_easy_fix`

Minimum response:

1. Reproduce with a focused engine or web test when possible.
2. Record `route_family_source_lane_support_confidence_output_warning_snapshot_matrix`.
3. If the fix is small, bounded, and test-backed, implement it.
4. If the fix is not safe, document the risk and keep output
   fail-closed or visibly screening.
5. Do not promote runtime, support, confidence, evidence, route-card,
   output-card, proposal/report, or API behavior from a green nearby
   source alone.

## Gate A Result

Selected rank 1:

`common_combination_lane_misclassification_sentinel_v1`

First missing requirements:

- `frequent_wall_floor_combination_inventory`
- `route_family_source_lane_support_confidence_output_warning_snapshot_matrix`
- `small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants`
- `note_test_document_or_easy_fix_decision_log`
- `paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement`
- `next_closeout_or_bounded_easy_fix_decision`

Ranked but not selected:

- `floor_tolerance_edge_promotion_guard`
- `wall_triple_leaf_uris_2006_source_packet_lane`
- `closed_manufacturer_and_ga600_context`

## Frozen Surfaces

Gate A does not move:

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

Completed on 2026-05-03:

- focused v17 Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts --maxWorkers=1`
  passed 1 file / 10 tests.
- continuity with floor raw-role Gate C / Gate B / Gate A, v16,
  lane-drift Gate E / Gate F, and the route-source risk register
  passed 8 files / 59 tests.
- `pnpm calculator:gate:current` passed: engine 230 files / 1310
  tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed.
- `apps/web/next-env.d.ts` was restored to the repo's
  `.next-typecheck` reference after the Next build rewrote it.
- final `git diff --check` passed after validation docs sync.
