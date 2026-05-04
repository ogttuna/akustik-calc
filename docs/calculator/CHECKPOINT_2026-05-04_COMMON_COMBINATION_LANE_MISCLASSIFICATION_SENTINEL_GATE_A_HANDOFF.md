# Checkpoint - 2026-05-04 - Common Combination Lane Misclassification Sentinel Gate A

Slice:

`common_combination_lane_misclassification_sentinel_v1`

Gate landed:

`gate_a_inventory_frequent_wall_floor_lane_sentinel_no_runtime`

Status:

`common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes`

Selected next action:

`gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`

Selected next file:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`

Implementation artifact:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`

Prior source-gap status:

`selected_common_combination_lane_misclassification_sentinel_after_v17_rerank_found_no_source_ready_runtime_candidate_and_user_reinforced_always_on_wrong_lane_monitoring`

Prior source-gap checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V17_GATE_A_HANDOFF.md`

## Summary

Gate A lands the always-on no-runtime sentinel inventory for frequent
wall and floor combinations. It does not move runtime, support,
confidence, evidence, API, route-card, output-card, proposal/report, or
workbench-input behavior.

The checkpoint makes the standing user rule executable:

`standing_lane_misclassification_monitoring_mandate`

When a frequent wall/floor stack appears to drop into a wrong route
family, wrong source lane, wrong support/confidence posture, wrong
lab/field copy, wrong material alias, or absurd output, apply:

`note_test_document_or_easy_fix`

That means reproduce with a focused test when possible, record the
snapshot, implement only a small bounded regression-tested fix, or
document the risk and keep output fail-closed or visibly screening.

## Gate A Artifacts

Implemented artifact:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`

Required artifacts now landed in the executable contract:

- `frequent_wall_floor_combination_inventory`
- `route_family_source_lane_support_confidence_output_warning_snapshot_matrix`
- `small_layer_reorder_duplicate_many_layer_boundary_and_hostile_input_variants`
- `note_test_document_or_easy_fix_decision_log`
- `paired_engine_and_web_visible_tests_before_any_route_or_output_copy_movement`
- `next_closeout_or_bounded_easy_fix_decision`

## Inventory Coverage

Gate A inventories these common-use families:

- rockwool-like triple-leaf and double-leaf wall stacks;
- LSF and timber stud double-board wall stacks;
- lined masonry and masonry boundary wall stacks;
- duplicate and many-layer wall stack drift;
- CLT, open-box, open-web, and raw floor role stacks;
- near-source manufacturer rows and material aliases;
- field-output lab/screening leakage;
- hostile API or import layer payloads.

## Snapshot Pins

Gate A records the current behavior without changing it:

- grouped split-rockwool remains low-confidence
  `multileaf_screening_blend`, `Rw 41`, and not source validated;
- split-rockwool small flat-list swap is held by
  `multileaf_screening_blend_fail_closed_until_grouped_topology` at
  low confidence rather than re-promoted into a precise double-leaf
  lane;
- classic framed adjacent swap is held by the same fail-closed
  multileaf guard;
- AAC / board / fill / gap hybrid still shows a documented
  lined-massive `family-boundary hold`;
- duplicate many-layer stacks remain finite but watchlisted;
- raw TUAS R5b open-box floor remains a raw parity-green exact row with
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`;
- raw TUAS X4 CLT drift prompts for roles before impact output
  promotion, carrying `raw_floor_role_inference`;
- unknown material and invalid thickness payloads fail closed before
  route or value selection;
- near-source aliases and field outputs stay context/screening unless
  exact metric, material mapping, tolerance, and visible-copy owners are
  named.

## Rockwool Posture

The original rockwool triple-leaf issue is not fixed by this gate. The
Uris 2006 source lane remains:

`paused_waiting_rights_safe_source_packet`

The live grouped result remains low-confidence
`multileaf_screening_blend`, `Rw 41`. That answer must not be presented
as fixed, exact, correct, or source-validated.

## Gate B Scope

Gate B should add:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`

with:

`gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`

Gate B should reprobe the Gate A matrix row by row and decide whether
anything is a bounded fix candidate. Any bounded fix still requires:

`frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk`

and:

`easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests`

If a finding is not a small bounded fix, it stays documented and
fail-closed.

## Gate B Follow-Up Addendum

Gate B later landed no-runtime in:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`

with:

`gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`

Gate B status:

`common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice`

Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_B_HANDOFF.md`

Gate B selected:

`packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts`

with:

`gate_c_closeout_and_next_slice_selection_after_gate_b_reprobes_no_runtime`

Gate B landed `gate_b_reprobe_findings` including
`split_rockwool_grouped_rw41_blocked_source_packet`,
`split_rockwool_flat_swap_fail_closed_guard_green`,
`classic_framed_adjacent_swap_fail_closed_guard_green`,
`aac_board_fill_gap_lined_massive_boundary_documented_fail_closed`,
and `hostile_api_import_fail_closed_green`. It made no runtime,
support, confidence, evidence, API, route-card, output-card,
proposal/report, workbench-input, source-promotion, or value-retune
movement.

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

- focused Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts --maxWorkers=1`;
- continuity with v17, route-source risk register, wall flat-list
  guard, floor raw-role guard, hostile-input and floor/order tests, and
  the common-stack watchlist closeout;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Completed validation on 2026-05-04:

- focused Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts --maxWorkers=1`
  passed 1 file / 8 tests.
- continuity with v17, floor raw-role Gate C, route-family lane-drift
  Gate E / Gate F, and route-source risk register passed 6 files / 43
  tests.
- `pnpm calculator:gate:current` passed: engine 231 files / 1318
  tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings.
- `apps/web/next-env.d.ts` was restored to the repo's
  `.next-typecheck` reference after the Next build rewrote it.
- final `git diff --check` passed.
