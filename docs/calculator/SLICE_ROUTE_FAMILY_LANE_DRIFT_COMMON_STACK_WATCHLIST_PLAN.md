# Slice Plan - Route Family Lane Drift Common Stack Watchlist

Slice id: `route_family_lane_drift_common_stack_watchlist_v1`

Status: GATE F CLOSED / SELECTED SOURCE GAP REVALIDATION V16

Landed Gate A file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`

Landed Gate A action:

`gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime`

Gate A status:

`common_stack_lane_drift_inventory_landed_no_runtime_selected_gate_b_reprobes`

Selected Gate B file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`

Selected Gate B action:

`gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime`

Landed Gate B file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`

Landed Gate B action:

`gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime`

Gate B status:

`common_stack_lane_drift_reprobes_landed_no_runtime_selected_gate_c_classification`

Landed Gate C file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`

Landed Gate C action:

`gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime`

Gate C status:

`common_stack_lane_drift_classification_landed_no_runtime_selected_gate_d_flat_list_family_guard_design`

Landed Gate D file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`

Landed Gate D action:

`gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime`

Gate D status:

`common_stack_lane_drift_flat_list_guard_design_landed_no_runtime_selected_gate_e_implementation`

Selected Gate E file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`

Selected Gate E action:

`gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries`

Landed Gate E file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`

Landed Gate E action:

`gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries`

Gate E status:

`common_stack_lane_drift_flat_list_guard_runtime_landed_selected_gate_f_closeout_next_slice`

Selected Gate F file:

`packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts`

Selected Gate F action:

`gate_f_closeout_and_next_slice_selection_after_flat_list_guard_runtime_landing`

Closed Gate F file:

`packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts`

Closed Gate F action:

`gate_f_closeout_and_next_slice_selection_after_flat_list_guard_runtime_landing`

Gate F status:

`closed_route_family_lane_drift_common_stack_watchlist_after_gate_e_guard_landed_and_selected_source_gap_revalidation_v16`

Selected next slice:

`calculator_source_gap_revalidation_v16`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md`

Selection status:

`selected_route_family_lane_drift_common_stack_watchlist_after_v15_rerank_found_no_runtime_ready_source_candidate_and_user_prioritized_rockwool_like_lane_errors`

Selected by:

`calculator_source_gap_revalidation_v15` Gate A

Prior V15 file:

`packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`

Prior V15 checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md`

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_A_HANDOFF.md`

Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B_HANDOFF.md`

Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C_HANDOFF.md`

Gate D checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_D_HANDOFF.md`

Gate E checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_E_HANDOFF.md`

Gate F closeout checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md`

## Objective

Create a no-runtime watchlist for frequent wall and floor combinations
that can fail like the rockwool / triple-leaf reorder defect: the
calculator may select the wrong route family, source lane, support
class, confidence class, field/lab output posture, or material alias
because a user edited layer order, duplicated a stack, added many
layers, crossed a masonry / lined-massive boundary, omitted floor role
tags, or supplied hostile input through API/import paths.

This slice is not a numeric retune and not a runtime import. It must
inventory suspicious common cases, run focused reprobes where possible,
and decide which findings become tests, documentation-only risks, or
small bounded fixes.

## Standing Monitoring Rule

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must keep this rule active:

`note_test_document_or_easy_fix`

If a frequent combination appears to use the wrong lane or returns an
absurd answer, reproduce it with a focused test if possible. If the fix
is small and bounded, implement it with regression tests. If the fix is
not safe yet, document the finding and keep output fail-closed.

This applies especially to:

- flat-list route-family flip;
- duplicate or many-layer stack drift;
- masonry / lined-massive boundary drift;
- raw floor role inference;
- near-source false promotion;
- field-output leakage;
- material alias / coalescing;
- hostile API input;
- curve digitization / provenance.

## Inputs

- `docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md`
- `docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md`
- `docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_GATE_A_HANDOFF.md`
- Current dynamic-airborne and verified-catalog route traces.
- Existing wall and floor order-invariance, hostile-input,
  many-layer, field-output, source-row, and grouped-topology tests.

## Gate A Requirements

Gate A added:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`

Landed artifacts:

1. `frequently_used_wall_and_floor_stack_inventory`.
2. `route_family_source_lane_output_value_support_confidence_snapshot_matrix`.
3. `small_layer_reorder_duplicate_many_layer_and_boundary_variant_reprobes`.
4. `rockwool_like_wrong_lane_defect_note_test_document_or_easy_fix_rule`.
5. `field_output_source_metric_material_alias_and_hostile_input_leakage_guards`.
6. `paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement`.
7. `selected_next_slice_or_closeout_with_validation_scope`.

Gate A pinned the current split-rockwool grouped stack at
low-confidence `multileaf_screening_blend`, `Rw 41`, and kept the Uris
2006 lane `paused_waiting_rights_safe_source_packet`. It also pinned
live common-stack snapshots for classic flat-list triple-leaf to
double-leaf lane drift (`Rw 32` -> `Rw 44`), heavy multileaf to
lined-massive boundary drift (`Rw 39` -> `Rw 49`), known raw-floor role
parity, and hostile API/import fail-closed behavior. Runtime, support,
confidence, evidence, API, route-card, output-card, proposal/report,
and workbench-input behavior remain frozen.

## Gate B Requirements

Gate B should add:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`

Landed action:

`gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime`

Gate B ran focused reprobes for:

1. split-rockwool grouped vs flat reorder;
2. ordinary framed insulation reorder;
3. lined-massive / masonry boundary drift;
4. duplicate and many-layer framed stacks;
5. raw floor role inference without tags;
6. near-source gypsum alias false promotion;
7. field-output leakage into lab/screening copy;
8. hostile API/import payloads;
9. curve digitization and provenance rows.

Gate B landed findings:

- `split_rockwool_flat_swap_3_4_wrong_lane_reproduced`: the
  split-rockwool flat stack remains `Rw 41` low-confidence
  `multileaf_screening_blend`, but a small rockwool/internal-board swap
  moves it to `Rw 51` medium-confidence `double_leaf`. The grouped
  topology answer remains `Rw 41`; this is still not a source-validated
  fix.
- `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced`: a common
  framed wall moves from `Rw 32` low-confidence
  `multileaf_screening_blend` to `Rw 44` medium-confidence
  `double_leaf`.
- `heavy_multileaf_lined_massive_boundary_reproduced`: an AAC / board /
  fill / gap hybrid moves from `Rw 39` `multileaf_screening_blend` to
  `Rw 49` `lined_massive_wall` with `family-boundary hold`.
- duplicated classic and heavy stacks stay finite but drift upward
  enough to keep duplicate/many-layer stacks on the watchlist.
- known raw CLT dry floor role inference remains green for raw, tagged,
  and reversed input, but ambiguous raw imports stay a deliberate risk.
- generic gypsum / gypsum board / firestop aliases remain formula-owned
  context only; they do not promote to Knauf, British Gypsum, NRC, or
  other near-source exact rows.
- field outputs, hostile API/import inputs, and curve digitization /
  provenance remain fail-closed or blocked until explicit policy/source
  payload exists.

Gate B selected Gate C classification because confirmed wrong-lane
findings exist, but no small bounded fix was approved in Gate B.

## Gate C Requirements

Gate C added:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`

Landed action:

`gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime`

Gate C landed no-runtime classification and selected Gate D flat-list
family-guard design with:

`common_stack_lane_drift_classification_landed_no_runtime_selected_gate_d_flat_list_family_guard_design`

Gate C classifies:

- `split_rockwool_flat_swap_3_4_wrong_lane_reproduced` as
  `bounded_fix_candidate`;
- `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced` as
  `bounded_fix_candidate`;
- `heavy_multileaf_lined_massive_boundary_reproduced` as
  `negative_boundary_for_fix`.

No runtime behavior, support, confidence, evidence, API, route-card,
output-card, proposal/report, or workbench-input surface moved.

Gate C may choose an immediate easy fix only when:

- the wrong lane/value behavior is reproduced in a focused test;
- the fix is narrow and does not move unrelated route families;
- negative boundaries cover common adjacent stacks;
- web-visible route/output behavior is covered if UI copy or cards can
  change.

Otherwise it must record the finding and keep behavior fail-closed.

## Gate D Requirements

Gate D added:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`

Landed action:

`gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime`

Gate D designed:

`flat_list_adjacent_swap_sensitivity_probe`

The future target stays fail-closed:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

Gate D proves the explicit flat-list multileaf ambiguity predicate
before any behavior movement. It protects these boundaries:

- `explicit_flat_list_multileaf_ambiguity_predicate`;
- `ordinary_double_leaf_negative_boundary`;
- `simple_stud_negative_boundary`;
- `lined_massive_boundary_hold_negative_boundary`;
- `grouped_triple_leaf_topology_negative_boundary`;
- `duplicate_many_layer_finite_output_negative_boundary`;
- `known_floor_exact_row_negative_boundary`;
- `near_source_alias_no_promotion_boundary`;
- `field_output_visible_policy_boundary`;
- `paired_engine_and_web_visible_tests_before_runtime`.

Gate D keeps runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, and workbench-input behavior frozen.

## Gate E Landing

Gate E added:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`

Landed action:

`gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries`

Gate E landed the bounded runtime guard strategy:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

The implementation artifact is:

`packages/engine/src/dynamic-airborne-flat-list-multileaf-guard.ts`

The paired web visible test is:

`apps/web/features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts`

Gate E moves only ambiguous flat-list wall stacks that previously
fell into overconfident `double_leaf` after a small adjacent swap. It
does not import a source row, does not promote support/evidence/
confidence/API/workbench input, and does not make the original
rockwool triple-leaf answer exact.

Runtime proof tokens:

- `engine_split_rockwool_swapped_flat_list_holds_multileaf_fail_closed`
  now holds the split-rockwool swap at low-confidence
  `multileaf_multicavity`, `Rw 42`, `R'w 40`, `DnT,w 41` on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`
  instead of the historical wrong-lane `Rw 51` `double_leaf`.
- The adjacent PDF-like rockwool stack now holds at low-confidence
  `multileaf_multicavity`, `Rw 41`, `R'w 39`, `DnT,w 41`.
- `engine_classic_swapped_flat_list_holds_multileaf_fail_closed` now
  holds the ordinary classic swap at low-confidence
  `multileaf_multicavity`, `Rw 33`, `R'w 31`, `DnT,w 33` instead of
  the historical wrong-lane `Rw 44` `double_leaf`.

Gate E protects:

- `ordinary_double_leaf_negative_boundary`;
- simple stud route boundaries;
- `lined_massive_boundary_hold_negative_boundary`;
- grouped triple-leaf topology boundaries;
- duplicate/many-layer finite-output boundaries;
- known floor exact-row boundaries;
- near-source alias no-promotion boundaries.

Web proof tokens:

- `web_route_card_shows_fail_closed_multileaf_screening_not_exact`;
- `web_output_card_does_not_promote_rw_prime_or_dntw_as_exact`.

## Gate F Closeout

Gate F added:

`packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts`

Landed action:

`gate_f_closeout_and_next_slice_selection_after_flat_list_guard_runtime_landing`

Gate F closes the lane-drift watchlist after Gate E validation stayed
green, keeps the Uris 2006 source lane on
`paused_waiting_rights_safe_source_packet`, and selects the next source /
accuracy slice without claiming the rockwool triple-leaf calculation is
source-validated.

Closed status:

`closed_route_family_lane_drift_common_stack_watchlist_after_gate_e_guard_landed_and_selected_source_gap_revalidation_v16`

Selected next slice:

`calculator_source_gap_revalidation_v16`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing`

Selected next target:

`packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_PLAN.md`

## Initial Common-Stack Watchlist

- split rockwool / internal-board triple-leaf wall:
  current answer remains low-confidence `multileaf_screening_blend`,
  `Rw 41`, not fixed; the Uris 2006 lane remains
  `paused_waiting_rights_safe_source_packet`.
- ordinary double-leaf framed wall with insulation reordered near the
  boards.
- lined massive / masonry wall with AAC, pumice, concrete, board, fill,
  and gap hybrids near boundary conditions.
- duplicated framed-wall stacks with repeated boards, membranes,
  cavities, and porous fill.
- raw floor stacks without role tags, especially topping / slab /
  resilient / ceiling order variants.
- source-near gypsum board rows: SilentFX, QuietRock, Type X, Type C,
  SoundBloc, Wallboard, and generic gypsum.
- field-output-labeled rows that can leak into lab `Rw` / screening
  `DnT,w` outputs.
- hostile API/import payloads with NaN, Infinity, negative thickness,
  unknown materials, and excessive layer counts.

## Protected Boundaries

- `common_stack_watchlist_is_not_runtime_import_or_value_retune`
- `wrong_lane_suspicion_requires_repro_test_before_documented_defect_or_easy_fix`
- `frequently_used_combinations_must_keep_route_family_source_lane_support_confidence_and_output_copy_honest`
- `paused_uris_2006_source_packet_lane_stays_blocked_until_rights_safe_payload_exists`
- `near_source_rows_do_not_override_existing_exact_anchors_or_fix_uris_2006`
- `field_metrics_do_not_promote_lab_rw_dntw_or_output_cards_without_policy`
- `material_aliases_do_not_coalesce_without_source_tolerance_owner`
- `hostile_api_input_must_fail_closed_before_route_or_value_selection`

## Validation

Required for Gate F:

- focused watchlist Gate F closeout contract;
- continuity with v15 Gate A, watchlist Gate A, watchlist Gate B,
  watchlist Gate C, watchlist Gate D, watchlist Gate E, watchlist Gate F,
  and route-source risk register;
- engine route/value repro tests for any suspicious case promoted to a
  defect;
- web visible tests if route cards, output cards, or proposal/report
  copy can change;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Focused command:

`pnpm --filter @dynecho/engine exec vitest run src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts --maxWorkers=1`

Completed Gate B validation on 2026-05-03:

- focused Gate B: 1 file / 10 tests passed;
- continuity with v15 Gate A, watchlist Gate A, watchlist Gate B, and
  route-source risk register: 4 files / 32 tests passed;
- `pnpm calculator:gate:current`: engine 221 files / 1241 tests passed,
  web 47 files / 227 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck`;
- `git diff --check` passed.

Completed Gate C validation on 2026-05-03:

- focused Gate C classification: 1 file / 7 tests passed;
- v14 compatibility spot-check after risk-register source-label sync:
  1 file / 8 tests passed;
- continuity with v15 Gate A, watchlist Gate A, watchlist Gate B,
  watchlist Gate C, and route-source risk register: 5 files / 39 tests
  passed;
- `pnpm calculator:gate:current`: engine 222 files / 1248 tests passed,
  web 47 files / 227 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build
  side-effects;
- `git diff --check` passed after final validation docs sync.

Completed Gate D validation on 2026-05-03:

- focused Gate D guard design: 1 file / 7 tests passed;
- continuity with v15 Gate A, watchlist Gate A, watchlist Gate B,
  watchlist Gate C, watchlist Gate D, and route-source risk register:
  6 files / 46 tests passed;
- `pnpm calculator:gate:current`: engine 223 files / 1255 tests passed,
  web 47 files / 227 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build
  side-effects;
- `git diff --check` passed after final validation docs sync.

Completed Gate E validation on 2026-05-03:

- focused Gate E guard implementation: 1 file / 6 tests passed;
- focused web route/output proof: 1 file / 3 tests passed;
- affected web order-sensitivity / company acceptance / guard proof:
  3 files / 13 tests passed;
- continuity with v15 Gate A, watchlist Gate A, watchlist Gate B,
  watchlist Gate C, watchlist Gate D, watchlist Gate E, and
  route-source risk register: 7 files / 52 tests passed;
- triple-leaf legacy compatibility after the guarded flat-list movement:
  3 files / 17 tests passed;
- split-refactor composer-size guard: 1 file / 5 tests passed;
- `pnpm calculator:gate:current`: engine 224 files / 1261 tests passed,
  web 48 files / 230 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build
  side-effects;
- final `git diff --check` passed after validation docs sync.

Completed Gate F validation on 2026-05-03:

- focused Gate F closeout contract: 1 file / 6 tests passed;
- continuity with v15 Gate A, Gate A/B/C/D/E, Gate F, and the
  route-source risk register: 8 files / 58 tests passed;
- `pnpm calculator:gate:current`: engine 225 files / 1267 tests,
  web 48 files / 230 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build
  side-effect;
- final `git diff --check` passed after validation docs sync.
