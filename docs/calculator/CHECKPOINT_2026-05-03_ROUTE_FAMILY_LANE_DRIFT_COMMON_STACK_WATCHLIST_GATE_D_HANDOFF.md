# Checkpoint - 2026-05-03 - Route Family Lane Drift Common Stack Watchlist Gate D

Slice:

`route_family_lane_drift_common_stack_watchlist_v1`

Gate landed:

`gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime`

Status:

`common_stack_lane_drift_flat_list_guard_design_landed_no_runtime_selected_gate_e_implementation`

Selected next action:

`gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries`

Selected next file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`

Implementation artifact:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`

Prior Gate C status:

`common_stack_lane_drift_classification_landed_no_runtime_selected_gate_d_flat_list_family_guard_design`

Prior Gate C file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`

Planning surface:

`docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`

## Summary

Gate D lands a no-runtime design for the flat-list route-family guard.
It does not change runtime, support, confidence, evidence, API,
route-card, output-card, proposal/report, or workbench-input behavior.

The design is:

`flat_list_adjacent_swap_sensitivity_probe`

The probe is intentionally narrow:

- only wall flat-list inputs without explicit grouped triple-leaf
  topology or explicit framed-wall metadata are eligible;
- the stack must have at least three board-like/light leaf layers and
  at least one compliant fill/gap layer;
- the stack must have no heavy masonry / AAC / concrete core;
- the stack must stay within `maximumProbeLayerCount = 9`;
- adjacent board/fill swaps must show a route flip between
  `multileaf_multicavity` and `double_leaf`;
- the maximum adjacent-swap `Rw` delta must be at least `8 dB`.

The proposed future target is still fail-closed:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

This is not an exact triple-leaf solver, not a source import, and not a
numeric retune. It is a bounded guard design intended to stop the
overconfident wrong-lane jump until grouped topology or a validated
source-backed solver is present.

## Positive Guard Candidates

- `split_rockwool_flat_swap_3_4_wrong_lane_reproduced`: current flat
  base is `Rw 41`, low-confidence `multileaf_screening_blend`; adjacent
  swap probe reaches `Rw 51`, medium-confidence `double_leaf`. The
  design marks both directions as guard candidates.
- `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced`: current
  base is `Rw 32`, low-confidence `multileaf_screening_blend`; adjacent
  swap probe reaches `Rw 44`, medium-confidence `double_leaf`. The
  design marks both directions as guard candidates.

## Negative Boundaries

Gate D proves these boundaries before allowing any implementation gate:

- `ordinary_double_leaf_negative_boundary`;
- `simple_stud_negative_boundary`;
- `lined_massive_boundary_hold_negative_boundary`;
- `grouped_triple_leaf_topology_negative_boundary`;
- `duplicate_many_layer_finite_output_negative_boundary`;
- `known_floor_exact_row_negative_boundary`;
- `near_source_alias_no_promotion_boundary`;
- `field_output_visible_policy_boundary`;
- `paired_engine_and_web_visible_tests_before_runtime`.

The heavy AAC / lined-massive finding stays a negative boundary for the
guard. It must not be forced into the flat-list double-leaf/multileaf
guard because its current `lined_massive_wall` behavior is protected by
family-boundary hold logic.

## Gate E Scope

Gate E should add:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-e-flat-list-family-guard-implementation.test.ts`

Gate E should run:

`gate_e_implement_flat_list_multileaf_family_guard_with_engine_web_negative_boundaries`

Gate E may move runtime only if it lands:

- engine tests proving split-rockwool and ordinary flat-list swapped
  inputs are held on fail-closed multileaf posture instead of
  overconfident `double_leaf`;
- engine negative boundaries for ordinary double-leaf, simple stud,
  lined-massive, grouped topology, duplicate/many-layer, known floor,
  and near-source alias stacks;
- web route-card tests showing the guarded route as fail-closed
  multileaf screening, not exact;
- web output-card tests showing `R'w` / `DnT,w` do not become exact or
  source-promoted.

## Rockwool Status

The original rockwool issue is still not solved as a validated
triple-leaf calculation. The Uris 2006 source lane remains
`paused_waiting_rights_safe_source_packet`; the current grouped `Rw 41`
`multileaf_screening_blend` answer must not be presented as fixed,
correct, or source-validated.

Gate D does, however, define the bounded path to stop the specific
flat-list wrong-lane jump: use
`flat_list_adjacent_swap_sensitivity_probe` and future
`multileaf_screening_blend_fail_closed_until_grouped_topology`.

## Standing Rule

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must keep looking for route-family or
source-lane mistakes on frequent wall/floor stacks. If a common stack
falls into the wrong lane, jumps after a small layer edit, promotes a
near-source row as exact, leaks field metrics, or returns an absurd
value, apply `note_test_document_or_easy_fix`: reproduce with a focused
test, fix only when bounded, or document and keep output fail-closed.

## Validation

Required validation for this checkpoint:

- focused Gate D guard-design contract:
  `pnpm --filter @dynecho/engine exec vitest run src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts --maxWorkers=1`;
- continuity with Gate C, Gate B, Gate A, v15 Gate A, and route-source
  risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Completed validation on 2026-05-03:

- focused Gate D guard design: 1 file / 7 tests passed;
- continuity with v15 Gate A, watchlist Gate A, watchlist Gate B,
  watchlist Gate C, watchlist Gate D, and route-source risk register:
  6 files / 46 tests passed;
- `pnpm calculator:gate:current`: engine 223 files / 1255 tests
  passed, web 47 files / 227 passed + 18 skipped, repo build 5 / 5
  passed with known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build
  side-effects;
- `git diff --check` passed after final validation docs sync.
