# Checkpoint - 2026-05-04 - Calculator Source Gap Revalidation V18 Gate A

Slice:

`calculator_source_gap_revalidation_v18`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout`

Status:

`selected_floor_tolerance_edge_promotion_guard_after_v18_rerank_found_no_source_ready_runtime_candidate_and_common_combination_sentinel_closed`

Selected next slice:

`floor_tolerance_edge_promotion_guard_v1`

Selected next action:

`gate_a_inventory_exact_floor_tolerance_edges_no_runtime`

Selected next file:

`packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`

Selected next planning surface:

`docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md`

## Summary

Gate A re-ranks the source/accuracy backlog after
`common_combination_lane_misclassification_sentinel_v1` Gate C closed
no-runtime. It consumes `gate_b_reprobe_findings`, keeps
`standing_lane_misclassification_monitoring_mandate` and
`note_test_document_or_easy_fix` active, and finds no source-ready
runtime candidate.

No runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, workbench-input, source import, or value
retune moved.

Because the common-combination sentinel is now executable and closed,
the next bounded accuracy slice is
`floor_tolerance_edge_promotion_guard_v1`. That slice must inventory
exact/bound floor tolerance edges before any new exact floor support,
confidence, field-output copy, or visible wording promotion.

## Gate A Artifacts

`common_combination_gate_b_reprobe_summary`

- Gate B remains the latest executable sentinel evidence for frequent
  wall/floor lane mistakes.
- Grouped split-rockwool remains
  `split_rockwool_grouped_rw41_blocked_source_packet`, low-confidence
  `multileaf_screening_blend`, `Rw 41`, and not source validated.
- Flat-list split-rockwool and classic framed swaps remain
  `multileaf_screening_blend_fail_closed_until_grouped_topology`.

`sentinel_guard_green_and_fail_closed_boundary_carry_forward`

- `split_rockwool_flat_swap_fail_closed_guard_green`
- `classic_framed_adjacent_swap_fail_closed_guard_green`
- `raw_floor_open_box_parity_green`
- `raw_floor_clt_role_prompt_guard_green`
- `aac_board_fill_gap_lined_massive_boundary_documented_fail_closed`
- `near_source_alias_context_only_watch`
- `field_output_copy_leakage_watch`
- `hostile_api_import_fail_closed_green`
- `curve_digitization_provenance_blocked_source_qc`

`post_sentinel_source_ready_runtime_candidate_rerank`

Gate A selected:

`floor_tolerance_edge_promotion_guard`

as rank 1 because role prompts and the common-combination sentinel are
now in place, exact/bound floor rows already exist, and the next
accuracy risk is whether just-inside / just-outside tolerance edges can
change exact, bound, screening, support, confidence, or visible wording
posture without enough test coverage.

The selected slice is still no-runtime. It must produce corridor tests
and visible support requirements before any promotion.

`rockwool_uris_2006_source_packet_status`

The original rockwool triple-leaf issue is still not fixed.
`paused_waiting_rights_safe_source_packet` remains the source-lane
status. The grouped result remains low-confidence
`multileaf_screening_blend`, `Rw 41`, and must not be presented as
fixed, correct, exact, or source validated.

Runtime still requires a rights-safe Uris 2006 source packet or
equivalent source-owned curve payload, rating derivation and
uncertainty, local material mapping, grouped topology runtime guard,
and paired engine/web-visible tests.

`floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status`

- `raw_floor_role_inference` remains active.
- `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  remains active.
- Field-output leakage remains blocked until a field/ISO-style overlay
  owner exists.
- Near-source false promotion remains blocked for manufacturer/manual
  context rows.
- Material alias/coalescing remains blocked without per-role source and
  tolerance ownership.
- Hostile API/import input must stay fail-closed.
- Curve digitization / provenance requires axis, band, rating
  derivation, and uncertainty proof before runtime use.

## Selected Floor Tolerance-Edge Scope

`floor_tolerance_edge_promotion_guard_v1` Gate A must produce:

- `role_tagged_exact_floor_tolerance_edge_inventory`
- `bound_floor_near_miss_and_exact_drop_snapshot_matrix`
- `just_inside_just_outside_thickness_corridor_tests`
- `raw_role_prompt_and_duplicate_role_negative_boundaries`
- `visible_exact_bound_screening_support_wording_requirements`
- `next_guard_or_closeout_decision_before_any_floor_support_promotion`

The first gate file should be:

`packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`

Follow-up Gate A landed after this checkpoint:

`floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`

It produced `role_tagged_exact_floor_tolerance_edge_inventory`,
`bound_floor_near_miss_and_exact_drop_snapshot_matrix`,
`just_inside_just_outside_thickness_corridor_tests`,
`raw_role_prompt_and_duplicate_role_negative_boundaries`,
`visible_exact_bound_screening_support_wording_requirements`, and
`next_guard_or_closeout_decision_before_any_floor_support_promotion`
without runtime movement.

The floor tolerance-edge slice now selects:

`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`

with:

`gate_b_no_runtime_closeout_and_next_slice_selection`

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

## Validation

Required validation for this checkpoint:

- focused v18 Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts --maxWorkers=1`;
- continuity with common-combination Gate C / Gate B / Gate A, v17,
  floor raw-role Gate C, route-family lane-drift Gate E / Gate F, and
  route-source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Validation completed on 2026-05-04:

- focused v18 Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts --maxWorkers=1`
  passed 1 file / 9 tests.
- continuity with common-combination Gate C / Gate B / Gate A, v17,
  floor raw-role Gate C, route-family lane-drift Gate E / Gate F, and
  route-source risk register passed 9 files / 67 tests.
- `pnpm calculator:gate:current` passed: engine 234 files / 1342
  tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings.
- `apps/web/next-env.d.ts` was restored to the repo's
  `.next-typecheck` reference after the Next build rewrote it.
- final `git diff --check` passed.
