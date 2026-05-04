# Checkpoint - 2026-05-04 - Floor Tolerance-Edge Promotion Guard Gate A

Slice:

`floor_tolerance_edge_promotion_guard_v1`

Gate landed:

`gate_a_inventory_exact_floor_tolerance_edges_no_runtime`

Status:

`floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`

Selected next action:

`gate_b_no_runtime_closeout_and_next_slice_selection`

Selected next file:

`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`

Implementation artifact:

`packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md`

## Summary

Gate A inventories exact and bound floor tolerance edges without moving
runtime behavior. It pins the current `+/- 2 mm` thickness corridor for
explicit role checks, proves just-outside exact rows drop out of the
exact path, proves just-outside bound rows drop to a bound-estimate
lane, and keeps raw-role prompt / duplicate-role / hostile-input
negative boundaries active.

No runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, workbench-input, source import, or value
retune moved.

## Gate A Artifacts

`role_tagged_exact_floor_tolerance_edge_inventory`

- Exact floor rows: 173.
- Manual exact floor rows: 167.
- Bound floor rows: 23.
- Manual exact rows with numeric thickness criteria: 167.
- Bound rows with numeric thickness criteria: 23.
- Representative protected exact rows:
  `tuas_x3_clt140_measured_2026`,
  `tuas_r5b_open_box_timber_measured_2026`,
  `ubiq_fl28_open_web_steel_200_exact_lab_2026`.
- Representative protected bound rows:
  `ubiq_fl33_open_web_steel_300_lab_2026`,
  `ubiq_fl32_steel_300_lab_2026`.

`bound_floor_near_miss_and_exact_drop_snapshot_matrix`

- `tuas_x3_clt140_measured_2026` stays exact at `+2 mm` on the
  `base_structure` role and drops to
  `predictor_floor_system_family_general_estimate` at `+2.1 mm`.
- `ubiq_fl33_open_web_steel_300_lab_2026` stays bound at `+2 mm` on
  the `base_structure` role and drops to
  `predictor_lightweight_steel_bound_interpolation_estimate` at
  `+2.1 mm`.

`just_inside_just_outside_thickness_corridor_tests`

- `THICKNESS_TOLERANCE_MM` remains `2`.
- The test covers both exact and bound row behavior around the
  tolerance edge.
- The just-outside cases are not treated as exact or source-validated
  promotions even when a fallback estimate remains finite.

`raw_role_prompt_and_duplicate_role_negative_boundaries`

- `raw_floor_role_inference` remains active.
- `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  remains active.
- Raw tagged-drift rows still require the floor-role prompt before
  impact output promotion.
- Duplicate single-entry roles still stay away from exact floor-family
  promotion.
- Hostile API/import input still fails closed before any exact/bound
  classification.

`visible_exact_bound_screening_support_wording_requirements`

- `visible_support_wording_must_distinguish_exact_bound_and_screening_floor_outputs`
- `exact_floor_match_wording_must_say_curated_exact_floor_system_match_active`
- `bound_floor_match_wording_must_say_impact_stays_conservative_upper_bound`
- `just_outside_bound_wording_must_say_family_estimate_not_exact_bound_row`
- `field_output_leakage_policy_required_before_rprime_dnt_lprime_copy`

`next_guard_or_closeout_decision_before_any_floor_support_promotion`

Gate A selects no-runtime closeout / next-slice selection because the
inventory is now executable and no safe support promotion was found:

`gate_b_no_runtime_closeout_and_next_slice_selection`

Next file:

`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`

## Carry-Forward Boundaries

`common_combination_gate_b_reprobe_summary`

`sentinel_guard_green_and_fail_closed_boundary_carry_forward`

`post_sentinel_source_ready_runtime_candidate_rerank`

`rockwool_uris_2006_source_packet_status`

`floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status`

`gate_b_reprobe_findings`

`floor_tolerance_edge_promotion_guard`

`standing_lane_misclassification_monitoring_mandate`

`note_test_document_or_easy_fix`

`paused_waiting_rights_safe_source_packet`

`multileaf_screening_blend_fail_closed_until_grouped_topology`

`raw_floor_role_inference`

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

## Rockwool Posture

The original rockwool triple-leaf issue is still unresolved. The live
grouped answer remains low-confidence `multileaf_screening_blend`,
`Rw 41`, and must not be presented as fixed, correct, exact, or source
validated.

Uris 2006 remains:

`paused_waiting_rights_safe_source_packet`

The flat-list guard remains:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

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
  `pnpm --filter @dynecho/engine exec vitest run src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts --maxWorkers=1`;
- continuity with v18, common-combination Gate C / Gate B / Gate A,
  floor raw-role Gate C, route-family lane-drift Gate E / Gate F, and
  route-source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Validation completed on 2026-05-04:

- focused Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts --maxWorkers=1`
  passed 1 file / 7 tests.
- continuity with v18, common-combination Gate C / Gate B / Gate A,
  floor raw-role Gate C, route-family lane-drift Gate E / Gate F, and
  route-source risk register passed 9 files / 64 tests.
- `pnpm calculator:gate:current` passed: engine 235 files / 1349
  tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings.
- `apps/web/next-env.d.ts` was restored to the repo's
  `.next-typecheck` reference after the Next build rewrote it.
- final `git diff --check` passed.

## Post-Gate General Review - 2026-05-04

The broad post-Gate review does not change Gate A's no-runtime
decision. The correct next implementation remains:

`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`

with:

`gate_b_no_runtime_closeout_and_next_slice_selection`

`pnpm check` initially caught three non-runtime issues:

- strict `noImplicitAny` warnings in engine/web contract callback
  parameters;
- complete-topology typing in the triple-leaf frequency solver, fixed
  by defaulting required grouped-topology fields before return;
- a stale order-sensitivity snapshot that still expected lightweight
  flat-list triple-leaf swaps to promote to the double-leaf lane.

The current intended behavior is that suspicious flat-list
board/fill/gap swaps stay on low-confidence
`multileaf_screening_blend_fail_closed_until_grouped_topology` with a
flat-list adjacent-swap guard warning. This is not the rockwool exact
fix; it is the fail-closed safety boundary while the Uris 2006 source
packet remains unavailable.

After fixes, broad `pnpm check` passed on 2026-05-04: lint passed,
typecheck passed, engine tests passed 368 files / 2169 tests, web
tests passed 161 files / 908 passed + 18 skipped, and build passed
5 / 5 packages with the known non-fatal `sharp/@img` warnings.
