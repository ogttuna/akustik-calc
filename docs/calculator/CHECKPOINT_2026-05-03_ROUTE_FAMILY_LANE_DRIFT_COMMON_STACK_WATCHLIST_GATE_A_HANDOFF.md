# Checkpoint - 2026-05-03 - Route Family Lane Drift Common Stack Watchlist Gate A

Slice:

`route_family_lane_drift_common_stack_watchlist_v1`

Gate landed:

`gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime`

Status:

`common_stack_lane_drift_inventory_landed_no_runtime_selected_gate_b_reprobes`

Selected next action:

`gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime`

Selected next file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`

Implementation artifact:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`

Prior v15 status:

`selected_route_family_lane_drift_common_stack_watchlist_after_v15_rerank_found_no_runtime_ready_source_candidate_and_user_prioritized_rockwool_like_lane_errors`

## Summary

Gate A lands the no-runtime common-stack lane-drift inventory selected
by v15. It does not move runtime, support, confidence, evidence, API,
route-card, output-card, proposal/report, or workbench-input behavior.

The inventory covers frequent wall/floor risks that can fail like the
original rockwool reorder defect:

- split rockwool / internal-board triple-leaf;
- ordinary framed insulation reorder;
- lined-massive / masonry boundary hybrid;
- duplicate and many-layer framed stacks;
- raw floor role inference;
- near-source gypsum aliases;
- field-output leakage;
- hostile API/import payloads;
- curve digitization / provenance.

## Live Snapshot Pins

The original rockwool issue remains open. The grouped split-rockwool
stack still returns low-confidence `multileaf_screening_blend`, `Rw 41`.
The Uris 2006 source lane remains
`paused_waiting_rights_safe_source_packet`; this gate does not present
the current value as fixed or source-validated.

Gate A also records current route/value drift snapshots for Gate B:

- classic flat-list triple-leaf reorder:
  `multileaf_screening_blend`, `Rw 32` -> `double_leaf_porous_fill_delegate`, `Rw 44`;
- heavy multileaf reorder near the masonry boundary:
  `multileaf_screening_blend`, `Rw 39` -> `lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold`, `Rw 49`;
- known raw CLT dry floor without `floorRole` tags matches the tagged
  exact floor row `dataholz_gdmtxn01_dry_clt_lab_2026`;
- hostile API/import unknown material and invalid thickness payloads
  fail closed before route or value selection.

## Standing Rule

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must continue to look for route-family or
source-lane mistakes on frequent wall/floor stacks. If a common stack
falls into the wrong lane, jumps after a small layer edit, promotes a
near-source row as exact, leaks field metrics, or returns an absurd
value, apply `note_test_document_or_easy_fix`: reproduce with a focused
test, fix only when bounded, or document and keep output fail-closed.

## Gate B Scope

Gate B should add:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`

Gate B must execute focused reprobes for:

1. split-rockwool grouped vs flat reorder;
2. ordinary framed insulation reorder;
3. lined-massive / masonry boundary drift;
4. duplicate and many-layer framed stacks;
5. raw floor role inference without tags;
6. near-source gypsum alias false promotion;
7. field-output leakage into lab/screening copy;
8. hostile API/import payloads;
9. curve digitization and provenance rows.

If Gate B finds a real defect and the fix is small, bounded, and covered
by negative boundaries plus paired engine/web visible tests, it may
select a bounded fix gate. Otherwise it must document the finding and
keep the calculator fail-closed.

## Validation

Required validation for this checkpoint:

- focused Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts --maxWorkers=1`;
- continuity with v15 Gate A and the route/source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Completed validation on 2026-05-03:

- focused Gate A: 1 file / 9 tests passed;
- continuity: v15 Gate A, route-source risk register, and watchlist
  Gate A 3 files / 22 tests passed;
- `pnpm calculator:gate:current`: engine 220 files / 1231 tests passed,
  web 47 files / 227 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  Next build side-effect;
- `git diff --check` passed.
