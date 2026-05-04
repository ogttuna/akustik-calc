# Checkpoint - 2026-05-04 - Common Combination Lane Misclassification Sentinel Gate B

Slice:

`common_combination_lane_misclassification_sentinel_v1`

Gate landed:

`gate_b_reprobe_frequent_wall_floor_lane_sentinel_matrix_no_runtime`

Status:

`common_combination_lane_sentinel_reprobes_landed_no_runtime_selected_gate_c_closeout_next_slice`

Selected next action:

`gate_c_closeout_and_next_slice_selection_after_gate_b_reprobes_no_runtime`

Selected next file:

`packages/engine/src/post-common-combination-lane-misclassification-sentinel-v1-next-slice-selection-contract.test.ts`

Implementation artifact:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts`

Prior Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMMON_COMBINATION_LANE_MISCLASSIFICATION_SENTINEL_GATE_A_HANDOFF.md`

Prior Gate A artifact:

`packages/engine/src/common-combination-lane-misclassification-sentinel-gate-a-contract.test.ts`

Prior Gate A status:

`common_combination_lane_sentinel_inventory_landed_no_runtime_selected_gate_b_reprobes`

## Summary

Gate B lands the no-runtime reprobe matrix for the frequent wall/floor
lane sentinel. It reruns the Gate A rows against live calculator
behavior and records `gate_b_reprobe_findings`.

No runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, or workbench-input behavior moved.

Gate B did not find a small bounded fix ready to implement. The
existing flat-list guards are green for the split-rockwool and classic
framed adjacent-swap rows; the remaining risks are source-blocked,
fail-closed, or watch-only. The selected next step is a no-runtime Gate
C closeout / next-slice decision.

## Gate B Findings

`gate_b_reprobe_findings`

- `split_rockwool_grouped_rw41_blocked_source_packet`: grouped
  split-rockwool remains low-confidence `multileaf_screening_blend`,
  `Rw 41`, and not exact/source-validated. Uris 2006 remains
  `paused_waiting_rights_safe_source_packet`.
- `split_rockwool_flat_swap_fail_closed_guard_green`: the adjacent
  flat-list split-rockwool swap stays low-confidence at `Rw 42` with
  `multileaf_screening_blend_fail_closed_until_grouped_topology`; no
  value retune or source promotion is allowed.
- `classic_framed_adjacent_swap_fail_closed_guard_green`: the classic
  framed adjacent swap stays low-confidence at `Rw 33` under the same
  fail-closed guard.
- `aac_board_fill_gap_lined_massive_boundary_documented_fail_closed`:
  AAC / board / fill / gap hybrid still shows a 10 dB boundary move into
  `lined_massive_wall` with family-boundary hold. This remains
  documented fail-closed risk, not a smoothing target.
- `duplicate_many_layer_classic_stack_finite_watch`: duplicated classic
  stack remains finite at `Rw 37` and stays watch-only.
- `raw_floor_open_box_parity_green`: raw TUAS R5b open-box remains
  exact/parity green while warning that
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.
- `raw_floor_clt_role_prompt_guard_green`: raw TUAS X4 CLT without
  roles still prompts before impact output promotion and carries
  `raw_floor_role_inference`.
- `near_source_alias_context_only_watch`: generic gypsum / board alias
  stacks stay context/formula-owned; material aliases do not coalesce
  without a source/tolerance owner.
- `field_output_copy_leakage_watch`: `R'w` and `DnT,w` remain
  building-prediction/screening outputs for these rows unless explicit
  field-output and visible-copy policy lands.
- `hostile_api_import_fail_closed_green`: unknown material and infinite
  thickness payloads fail closed before route or value selection.
- `curve_digitization_provenance_blocked_source_qc`: future graph rows
  remain blocked until axis, band, rating derivation, and uncertainty
  provenance are present.

## Standing Rule

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must keep watching frequent wall/floor
stacks for wrong route-family, wrong source-lane, wrong support,
wrong confidence, field-output leakage, material alias/coalescing, and
hostile API/import behavior. Suspicious results must use:

`note_test_document_or_easy_fix`

That means reproduce with a focused test, document the snapshot, and
only implement a fix when it is small, bounded, and covered by paired
engine plus web-visible tests.

Protected fix boundaries remain:

`frequent_combination_wrong_lane_suspicion_requires_repro_or_documented_fail_closed_risk`

`easy_fix_requires_small_bounded_change_with_engine_and_web_visible_regression_tests`

## Rockwool Posture

The original rockwool triple-leaf issue is still not fixed by Gate B.
The live grouped answer remains low-confidence
`multileaf_screening_blend`, `Rw 41`. It must not be presented as
fixed, correct, exact, or source-validated.

The safe source lane remains:

`paused_waiting_rights_safe_source_packet`

The flat-list guard remains:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

## Floor Boundary

`raw_floor_role_inference`

and

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

remain active. Raw parity rows can stay green only with honest warning
copy; ambiguous raw rows must prompt before exact impact promotion.

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

- focused Gate B contract:
  `pnpm --filter @dynecho/engine exec vitest run src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts --maxWorkers=1`;
- continuity with Gate A, v17, route-source risk register, wall
  flat-list guard, floor raw-role guard, and common-stack watchlist
  closeout;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Validation completed on 2026-05-04:

- focused Gate B contract:
  `pnpm --filter @dynecho/engine exec vitest run src/common-combination-lane-misclassification-sentinel-gate-b-reprobes.test.ts --maxWorkers=1`
  passed 1 file / 9 tests.
- continuity with Gate A, v17, floor raw-role Gate C, route-family
  lane-drift Gate E / Gate F, and route-source risk register passed 7
  files / 52 tests.
- `pnpm calculator:gate:current` passed: engine 232 files / 1327
  tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  successful with known non-fatal `sharp/@img` warnings.
- `apps/web/next-env.d.ts` was restored to the repo's
  `.next-typecheck` reference after the Next build rewrote it.
- final `git diff --check` passed.

## Gate C Follow-Up

Gate C closed `common_combination_lane_misclassification_sentinel_v1`
no-runtime with:

`closed_common_combination_lane_misclassification_sentinel_no_runtime_and_selected_source_gap_revalidation_v18`

Selected next slice:

`calculator_source_gap_revalidation_v18`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`

The Gate B `gate_b_reprobe_findings` remain active carry-forward
boundaries for v18, including
`split_rockwool_grouped_rw41_blocked_source_packet`,
`paused_waiting_rights_safe_source_packet`,
`multileaf_screening_blend_fail_closed_until_grouped_topology`,
`raw_floor_role_inference`, and
`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.
