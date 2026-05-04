# Checkpoint - 2026-05-03 - Route Family Lane Drift Common Stack Watchlist Gate C

Slice:

`route_family_lane_drift_common_stack_watchlist_v1`

Gate landed:

`gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime`

Status:

`common_stack_lane_drift_classification_landed_no_runtime_selected_gate_d_flat_list_family_guard_design`

Selected next action:

`gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime`

Selected next file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`

Implementation artifact:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`

Prior Gate B status:

`common_stack_lane_drift_reprobes_landed_no_runtime_selected_gate_c_classification`

Prior Gate B file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`

Planning surface:

`docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`

## Summary

Gate C classifies the Gate B reprobe findings without moving runtime,
support, confidence, evidence, API, route-card, output-card,
proposal/report, or workbench-input behavior.

Classifications:

- `split_rockwool_flat_swap_3_4_wrong_lane_reproduced`:
  `bounded_fix_candidate`. The flat split-rockwool stack still has the
  reprobed jump from `Rw 41` low-confidence `multileaf_screening_blend`
  to `Rw 51` medium-confidence `double_leaf`; this is the primary Gate D
  fix candidate.
- `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced`:
  `bounded_fix_candidate`. The common framed stack jump from `Rw 32` to
  `Rw 44` shares the same flat-list multileaf ambiguity family.
- `heavy_multileaf_lined_massive_boundary_reproduced`:
  `negative_boundary_for_fix`. The `Rw 39` to `Rw 49`
  `lined_massive_wall` boundary case must protect legitimate masonry /
  lined-massive behavior; Gate D must not force it into the double-leaf
  guard.

Duplicate/many-layer findings remain `watch_only`; known raw floor role
inference and hostile API/import remain `guard_green`; near-source
gypsum alias and curve provenance remain `blocked_source_qc`; field
output leakage remains `watch_only` until visible policy and paired web
tests exist.

## Gate D Scope

Gate D should add:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts`

Gate D should run:

`gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime`

Gate D is still no-runtime. It must design a narrow flat-list ambiguity
guard and prove the required boundaries before any implementation gate:

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

Only a later gate may move runtime, and only if it includes engine
negative boundaries plus web-visible route/output tests.

## Rockwool Status

The original rockwool issue is still open. The Uris 2006 source lane
remains `paused_waiting_rights_safe_source_packet`; the current grouped
`Rw 41` `multileaf_screening_blend` answer must not be presented as
fixed, correct, or source-validated. Gate C only classifies the flat-list
wrong-lane finding as a bounded fix candidate.

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

- focused Gate C classification contract:
  `pnpm --filter @dynecho/engine exec vitest run src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts --maxWorkers=1`;
- continuity with Gate B, Gate A, v15 Gate A, and route-source risk
  register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Completed validation on 2026-05-03:

- focused Gate C classification: 1 file / 7 tests passed;
- v14 compatibility spot-check after risk-register source-label sync:
  1 file / 8 tests passed;
- continuity with v15 Gate A, watchlist Gate A, watchlist Gate B,
  watchlist Gate C, and route-source risk register: 5 files / 39 tests
  passed;
- `pnpm calculator:gate:current`: engine 222 files / 1248 tests
  passed, web 47 files / 227 passed + 18 skipped, repo build 5 / 5
  passed with known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after final validation docs sync.
