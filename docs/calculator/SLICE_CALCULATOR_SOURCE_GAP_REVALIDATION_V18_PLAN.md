# Slice Plan - Calculator Source Gap Revalidation V18

Slice id: `calculator_source_gap_revalidation_v18`

Status: LANDED / SELECTED FLOOR TOLERANCE-EDGE GUARD

Selected by:

`common_combination_lane_misclassification_sentinel_v1` Gate C closeout

Selection status:

`closed_common_combination_lane_misclassification_sentinel_no_runtime_and_selected_source_gap_revalidation_v18`

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_common_combination_sentinel_closeout`

Landed status:

`selected_floor_tolerance_edge_promotion_guard_after_v18_rerank_found_no_source_ready_runtime_candidate_and_common_combination_sentinel_closed`

Selected next slice:

`floor_tolerance_edge_promotion_guard_v1`

Selected next file:

`packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`

Selected next planning surface:

`docs/calculator/SLICE_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_PLAN.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_C_CLOSEOUT_HANDOFF.md`

Selection validation completed on 2026-05-04: common-combination Gate C
focused closeout passed 1 file / 6 tests; continuity passed 8 files /
58 tests; `pnpm calculator:gate:current` passed engine 233 files / 1333
tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
successful with known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
was restored to `.next-typecheck`; final `git diff --check` passed.

## Objective

Re-rank the source-ready accuracy backlog after the common-combination
sentinel closed no-runtime. The revalidation must use
`gate_b_reprobe_findings` as active evidence before selecting any next
runtime, source-acquisition, mapping/tolerance, or guard slice.

This slice must not import source rows, retune values, promote support,
promote confidence, promote evidence, or move API / route-card /
output-card / proposal/report / workbench-input behavior in Gate A.

## Required Gate A Artifacts

Gate A must produce:

- `common_combination_gate_b_reprobe_summary`
- `sentinel_guard_green_and_fail_closed_boundary_carry_forward`
- `post_sentinel_source_ready_runtime_candidate_rerank`
- `rockwool_uris_2006_source_packet_status`
- `floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status`
- `selected_next_slice_with_target_gate_file_and_validation_scope`

Gate A landed those artifacts no-runtime and selected
`floor_tolerance_edge_promotion_guard` as the next bounded accuracy
slice. Runtime/support/confidence/evidence/API/route-card/output-card/
proposal/report/workbench-input behavior remains frozen.

Gate A validation completed on 2026-05-04: focused v18 Gate A 1 file /
9 tests; continuity with common-combination Gate C / Gate B / Gate A,
v17, floor raw-role Gate C, route-family lane-drift Gate E / Gate F,
and route-source risk register 9 files / 67 tests; `pnpm
calculator:gate:current` engine 234 files / 1342 tests, web 49 files /
234 passed + 18 skipped, repo build 5 / 5 successful with known
non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts` restored to
`.next-typecheck`; final `git diff --check` passed.

## Carry-Forward Sentinel Findings

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

## Standing Mandate

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must keep watching frequent wall/floor
stacks for wrong route-family, wrong source-lane, wrong support,
wrong confidence, field-output leakage, material alias/coalescing, and
hostile API/import behavior.

When suspicious behavior appears, apply:

`note_test_document_or_easy_fix`

Reproduce it with a focused test where possible. If the fix is small,
bounded, and covered by paired engine plus web-visible tests, implement
it. Otherwise document it and keep output fail-closed or visibly
screening.

Protected fix boundaries:

- `frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk`
- `easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests`

## Protected Boundaries

- `paused_waiting_rights_safe_source_packet`
- `multileaf_screening_blend_fail_closed_until_grouped_topology`
- `raw_floor_role_inference`
- `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
- `masonry_lined_massive_boundary_drift`
- `near_source_false_promotion`
- `field_output_leakage`
- `material_alias_coalescing`
- `hostile_api_input`
- `curve_digitization_provenance`

## Gate A Candidate Families

Gate A should re-rank, at minimum:

- rockwool / Uris 2006 triple-leaf source packet lane;
- common wall/floor sentinel carry-forward rows;
- floor tolerance-edge promotions after raw-role prompt guard;
- closed manufacturer contexts from Knauf, British Gypsum, ROCKWOOL,
  USG, National Gypsum, Georgia-Pacific, PABCO, and CertainTeed;
- masonry / lined-massive boundary drift;
- near-source alias / field-output leakage / material coalescing;
- hostile API/import and curve-provenance guard work;
- productization-only work, only after accuracy candidates are found
  not source-ready.

## Rockwool Posture

The original rockwool triple-leaf problem is still unresolved. The
grouped answer remains low-confidence `multileaf_screening_blend`,
`Rw 41`, and must not be presented as fixed, correct, exact, or
source-validated.

Uris 2006 remains:

`paused_waiting_rights_safe_source_packet`

The flat-list guard remains:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

## Frozen Surfaces

Gate A freezes:

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

Required for Gate A:

- focused v18 Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts --maxWorkers=1`;
- continuity with common-combination Gate C / Gate B / Gate A, v17,
  floor raw-role Gate C, route-family lane-drift Gate E / Gate F, and
  route-source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.
