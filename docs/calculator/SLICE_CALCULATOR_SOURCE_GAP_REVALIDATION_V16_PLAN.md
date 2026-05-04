# Slice Plan - Calculator Source Gap Revalidation v16

Slice id: `calculator_source_gap_revalidation_v16`

Status: GATE A LANDED / FLOOR RAW ROLE INFERENCE GUARDRAIL SELECTED

Selected by:

`route_family_lane_drift_common_stack_watchlist_v1` Gate F closeout

Selection status:

`closed_route_family_lane_drift_common_stack_watchlist_after_gate_e_guard_landed_and_selected_source_gap_revalidation_v16`

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_lane_drift_guard_runtime_landing`

Landed Gate A status:

`selected_floor_raw_role_inference_guardrail_after_v16_rerank_found_no_source_ready_runtime_candidate_and_prioritized_floor_side_wrong_lane_risk`

Selected next slice:

`floor_raw_role_inference_guardrail_v1`

Selected next file:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`

Selected next action:

`gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime`

Selected next planning surface:

`docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md`

Landed checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md`

Prior closeout file:

`packages/engine/src/post-route-family-lane-drift-common-stack-watchlist-v1-next-slice-selection-contract.test.ts`

Prior watchlist checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_F_CLOSEOUT_HANDOFF.md`

## Objective

Re-rank source-readiness and accuracy work after Gate E landed the
bounded flat-list multileaf guard:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

This is a no-runtime first gate. It must not move runtime values,
runtime import, support promotion, confidence promotion, evidence
promotion, API shape, output support, route-card value, output-card
status, proposal/report copy, or workbench input behavior.

Gate A must decide the next highest-value source/accuracy slice after
the flat-list lane-jump symptom was guarded but before anyone treats
the original rockwool triple-leaf answer as exact.

Gate A has now selected `floor_raw_role_inference_guardrail_v1` because
no source-ready runtime candidate exists and `raw_floor_role_inference`
is the next actionable floor-side equivalent of the rockwool wrong-lane
class. The next slice must preserve:

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

## Inputs

- Gate E flat-list guard landing summary.
- Gate F closeout decision for
  `route_family_lane_drift_common_stack_watchlist_v1`.
- `docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md`.
- `docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md`.
- `docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md`.
- Closed CertainTeed, PABCO, Georgia-Pacific, National Gypsum, USG,
  ROCKWOOL, British Gypsum, and Knauf source rows.
- GA-600 context and remaining official locators.
- Floor/wall boundary, raw role inference, field-output, alias,
  hostile-input, and curve-provenance risk history.

## Gate A Requirements

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`

Required artifacts:

1. `gate_e_flat_list_guard_landing_summary`.
2. `post_guard_rockwool_triple_leaf_exact_source_packet_status`.
3. `post_guard_closed_manufacturer_and_ga600_source_context_rerank`.
4. `common_stack_lane_misclassification_watchlist_carry_forward`.
5. `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_negative_boundary_and_visible_test_flags`.
6. `selected_next_slice_with_target_gate_file_and_validation_scope`.

Gate A may select a new source-pack extraction, source-acquisition,
mapping/tolerance, source-packet, accuracy-hardening, or runtime-guard
slice only if it names exact blockers and keeps every source/readiness
claim honest.

## Protected Boundaries

- The original split-rockwool grouped stack remains low-confidence
  `multileaf_screening_blend`, `Rw 41`. It is not fixed by the Gate E
  guard.
- The Uris 2006 source lane remains
  `paused_waiting_rights_safe_source_packet` until a rights-safe source
  packet or equivalent source-owned curve/table payload exists.
- The flat-list wrong-lane symptom is guarded, not source-validated:
  split-rockwool swap `Rw 42`, adjacent rockwool `Rw 41`, classic swap
  `Rw 33`, all low-confidence screening on
  `multileaf_screening_blend_fail_closed_until_grouped_topology`.
- Closed manufacturer rows and GA-600 context do not promote runtime,
  support, confidence, evidence, route cards, output cards, field
  outputs, or proposal/report copy without exact topology, metric,
  material mapping, tolerance, negative boundaries, and paired visible
  tests.
- `ordinary_double_leaf_negative_boundary` and
  `lined_massive_boundary_hold_negative_boundary` remain protected.
- `raw_floor_role_inference` must remain explicit: exact role-tagged
  floor rows are the promoted path, while raw floor inference must stay
  screening-only or prompt for missing roles when exact floor outputs
  require role ownership.
- `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.

Standing boundary:

- `standing_lane_misclassification_monitoring_mandate`: every future
  calculator slice must keep looking for wrong route-family/source-lane
  behavior on frequent stacks. If suspicious behavior is found, use
  `note_test_document_or_easy_fix`: reproduce with a focused test,
  document it when not safe to fix immediately, or fix it with
  regression tests if the change is small and bounded.

## Validation

Required for Gate A:

- focused v16 Gate A contract;
- continuity with route-family watchlist Gate F, Gate E, Gate D,
  Gate C, Gate B, Gate A, v15 Gate A, and route-source risk register;
- targeted engine/web tests if Gate A selects any visible or runtime
  movement for the next slice;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Focused command:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts --maxWorkers=1`

Pre-Gate-A selection validation completed on 2026-05-03:

- focused watchlist Gate F closeout: 1 file / 6 tests passed;
- continuity with v15 Gate A, watchlist Gate A/B/C/D/E/F, and the
  route-source risk register: 8 files / 58 tests passed;
- `pnpm calculator:gate:current`: engine 225 files / 1267 tests,
  web 48 files / 230 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build
  side-effect;
- final `git diff --check` passed after validation docs sync.

Gate A validation:

- focused v16 Gate A: 1 file / 10 tests passed;
- continuity with v15 Gate A, watchlist Gate A/B/C/D/E/F, and the
  route-source risk register: 9 files / 68 tests passed;
- `pnpm calculator:gate:current`: engine 226 files / 1277 tests,
  web 48 files / 230 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- final `git diff --check` passed after validation docs sync.
