# Checkpoint - 2026-05-03 - Calculator Source Gap Revalidation v17 Gate A

Slice:

`calculator_source_gap_revalidation_v17`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`

Status:

`selected_common_combination_lane_misclassification_sentinel_after_v17_rerank_found_no_source_ready_runtime_candidate_and_user_reinforced_always_on_wrong_lane_monitoring`

Selected next slice:

`common_combination_lane_misclassification_sentinel_v1`

Selected next action:

`gate_a_inventory_frequent_wall_floor_lane_sentinel_no_runtime`

Selected next file:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_PLAN.md`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`

Prior closeout:

`floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`

## Summary

Gate A re-ranks source and accuracy work after the floor raw-role
prompt guard landed. It finds no source-ready runtime candidate:
the Uris 2006 triple-leaf lane remains
`paused_waiting_rights_safe_source_packet`, closed manufacturer rows and
GA-600 context remain non-runtime, and floor tolerance-edge work needs
the same common-combination sentinel discipline before any future
promotion.

Because the user explicitly reinforced that DynEcho must continuously
watch for rockwool-like wrong-lane errors, Gate A selects
`common_combination_lane_misclassification_sentinel_v1`. This next
slice is no-runtime first. It must inventory frequent wall and floor
combinations, record route-family/source-lane/support/confidence/output
and warning snapshots, reprobe small layer edits, duplicates,
many-layer stacks, boundary variants, and hostile inputs, then apply
`note_test_document_or_easy_fix`.

## Re-Rank Result

Rank 1, selected:

- `common_combination_lane_misclassification_sentinel_v1`
  - reason: no source-ready runtime pack exists, and the next highest
    correctness value is turning the standing lane-misclassification
    monitoring rule into an executable frequent-combination sentinel;
  - target:
    `packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`;
  - first missing requirements:
    `frequent_wall_floor_combination_inventory`,
    `route_family_source_lane_support_confidence_output_warning_snapshot_matrix`,
    `small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants`,
    `note_test_document_or_easy_fix_decision_log`,
    `paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement`,
    and `next_closeout_or_bounded_easy_fix_decision`.

Ranked but not selected:

- `floor_tolerance_edge_promotion_guard`: still real, but should follow
  the common-combination sentinel.
- `wall_triple_leaf_uris_2006_source_packet_lane`: still urgent but
  blocked on `paused_waiting_rights_safe_source_packet`.
- `closed_manufacturer_and_ga600_context`: source context only until
  exact topology, metric, material mapping, tolerance, negative
  boundaries, and paired visible tests exist.

## Standing Monitoring Mandate

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must keep looking for wrong route-family
or source-lane behavior on frequent wall/floor stacks. If a stack drops
into the wrong lane, jumps after a small layer edit, promotes a
near-source row as exact, leaks field metrics, coalesces materials
without ownership, or returns an absurd value, use:

`note_test_document_or_easy_fix`

Reproduce it with a focused test when possible; fix it immediately only
when the fix is small, bounded, and test-backed; otherwise document the
risk and keep outputs fail-closed or visibly screening.

## Rockwool Posture

The original split-rockwool grouped stack remains low-confidence
`multileaf_screening_blend`, `Rw 41`. The flat-list guard remains
`multileaf_screening_blend_fail_closed_until_grouped_topology`.

This Gate A does not make the triple-leaf result source-validated. The
Uris 2006 lane remains `paused_waiting_rights_safe_source_packet`.

## Floor Guard Posture

`raw_floor_role_inference`

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

Role-tagged exact floor rows remain the promoted exact path. Raw
parity-green rows stay live only with visible no-reorder-invariance
copy. Raw tagged-drift, no-safe-inference, and duplicate single-entry
role cases now prompt for floor roles before exact floor-family
promotion.

## Frozen Surfaces

- runtime
- support
- confidence
- evidence
- API
- route-card
- output-card
- proposal/report
- workbench-input

## Next Step

Implement:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`

with:

`gate_a_inventory_frequent_wall_floor_lane_sentinel_no_runtime`

## Validation

Completed validation on 2026-05-03:

- focused v17 Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts --maxWorkers=1`
  passed 1 file / 10 tests.
- continuity with floor raw-role Gate C / Gate B / Gate A, v16,
  lane-drift watchlist Gate E / Gate F, and the route-source risk
  register passed 8 files / 59 tests.
- `pnpm calculator:gate:current` passed: engine 230 files / 1310
  tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed.
- `apps/web/next-env.d.ts` was restored to the repo's
  `.next-typecheck` reference after the Next build rewrote it.
- final `git diff --check` passed after validation docs sync.
