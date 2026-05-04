# Checkpoint - 2026-05-03 - Calculator Source Gap Revalidation v16 Gate A

Slice:

`calculator_source_gap_revalidation_v16`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing`

Status:

`selected_floor_raw_role_inference_guardrail_after_v16_rerank_found_no_source_ready_runtime_candidate_and_prioritized_floor_side_wrong_lane_risk`

Selected next slice:

`floor_raw_role_inference_guardrail_v1`

Selected next action:

`gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime`

Selected next file:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`

Prior closeout:

`closed_route_family_lane_drift_common_stack_watchlist_after_gate_e_guard_landed_and_selected_source_gap_revalidation_v16`

## Summary

Gate A re-ranks source and accuracy work after the wall flat-list
lane-drift guard landed. It finds no source-ready runtime candidate:
the Uris 2006 triple-leaf lane remains
`paused_waiting_rights_safe_source_packet`, GA-600 still lacks
rights-safe current row payloads, and closed manufacturer rows remain
context-only.

Because the wall flat-list symptom is now guarded by
`multileaf_screening_blend_fail_closed_until_grouped_topology`, Gate A
selects the floor-side equivalent risk:
`floor_raw_role_inference_guardrail_v1`. The selected slice must
inventory role-tagged exact floor rows, raw inferred floor rows,
duplicate-role cases, and order edits before any runtime or visible
movement.

This gate does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

## Re-Rank Result

Rank 1, selected:

- `floor_raw_role_inference_guardrail_v1`
  - reason: after the wall wrong-lane symptom is guarded and source
    runtime remains blocked, `raw_floor_role_inference` is the next
    actionable floor-side wrong-lane risk;
  - target:
    `packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`;
  - first missing requirement:
    `role_tagged_exact_floor_row_inventory`,
    `raw_floor_inference_snapshot_matrix`,
    `duplicate_role_and_order_edit_negative_boundaries`,
    `missing_role_prompt_policy_for_exact_floor_outputs`,
    `engine_and_web_visible_test_plan_before_support_confidence_or_output_copy_movement`,
    and `next_closeout_or_bounded_runtime_guard_decision`.

Ranked but not selected:

- `wall_triple_leaf_uris_2006_source_packet_lane`: still urgent but
  blocked on `paused_waiting_rights_safe_source_packet`.
- `gypsum_association_ga600_2024_context`: authoritative context but
  blocked on current rights-safe row payloads.
- `closed_manufacturer_rows_after_lane_drift_guard`: context-only
  negative boundaries.
- `remaining_route_family_boundary_watch_items`: need new repro or
  source coupling evidence before more wall runtime guard work.
- `floor_tolerance_edge_promotion_guard`: should follow role ownership
  guardrails.

## Rockwool Posture

The original split-rockwool grouped stack remains low-confidence
`multileaf_screening_blend`, `Rw 41`. Gate E guards flat-list lane
jumps but does not make the triple-leaf result source-validated.

The Uris 2006 lane remains `paused_waiting_rights_safe_source_packet`.

## Floor Boundary

`raw_floor_role_inference`

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

Exact role-tagged floor rows are the promoted exact path. Raw floor
inference must stay screening-only or prompt for missing roles when
exact floor outputs require role ownership.

## Standing Monitoring Mandate

`standing_lane_misclassification_monitoring_mandate`

If a frequent wall or floor combination appears to fall into the wrong
lane, produces a large value jump after a small layer edit, promotes a
near-source row as exact truth, leaks field metrics into lab outputs, or
returns an obviously absurd value, the next action is:

`note_test_document_or_easy_fix`

## Frozen Surfaces

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Next Step

Implement:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`

with:

`gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime`

## Validation

Required validation:

- focused v16 Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts --maxWorkers=1`;
- continuity with Gate F, Gate E, Gate D, Gate C, Gate B, Gate A, v15
  Gate A, and route-source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Completed validation on 2026-05-03:

- focused v16 Gate A: 1 file / 10 tests passed;
- continuity with v15 Gate A, watchlist Gate A/B/C/D/E/F, and the
  route-source risk register: 9 files / 68 tests passed;
- `pnpm calculator:gate:current`: engine 226 files / 1277 tests,
  web 48 files / 230 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- final `git diff --check` passed after validation docs sync.
