# Slice Plan - Floor Raw Role Inference Guardrail

Slice id: `floor_raw_role_inference_guardrail_v1`

Status: GATE C LANDED / SOURCE-GAP REVALIDATION V17 SELECTED

Selected by:

`calculator_source_gap_revalidation_v16` Gate A

Selection status:

`selected_floor_raw_role_inference_guardrail_after_v16_rerank_found_no_source_ready_runtime_candidate_and_prioritized_floor_side_wrong_lane_risk`

Selected first file:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`

Selected first action:

`gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime`

Landed Gate A status:

`floor_raw_role_inference_inventory_landed_no_runtime_selected_gate_b_prompt_guard_design`

Landed Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md`

Landed Gate C file:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts`

Landed Gate C action:

`gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests`

Landed Gate C status:

`floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`

Landed Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_C_HANDOFF.md`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`

Landed Gate B file:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts`

Landed Gate B status:

`floor_raw_role_inference_prompt_guard_design_landed_no_runtime_selected_gate_c_implementation`

Landed Gate B action:

`gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime`

Landed Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B_HANDOFF.md`

Prior Gate A file:

`packages/engine/src/calculator-source-gap-revalidation-v16-gate-a-contract.test.ts`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_CALCULATOR_SOURCE_GAP_REVALIDATION_V16_GATE_A_HANDOFF.md`

## Objective

Inventory and harden the floor-side equivalent of the rockwool wrong-lane
class: raw floor lists whose inferred physical roles can change after
order edits or duplicate-role edits.

This is a no-runtime first gate. It must not move runtime values,
runtime import, support promotion, confidence promotion, evidence
promotion, API shape, output support, route-card value, output-card
status, proposal/report copy, or workbench input behavior.

Gate A must decide whether a bounded runtime/visible guard is safe, or
whether the slice should close with documentation-only risks.

Gate A landed no-runtime. It found the current raw-floor inference
posture is partly guarded but not safe for a direct runtime movement:
173 exact floor rows exist, 167 are manual exact rows, 166 manual exact
rows currently have raw inference evidence, one manual exact row
(`dataholz_gdsnxn01a_timber_frame_lab_2026`) has no safe raw inference,
and 12 manual exact rows drift between raw and role-tagged snapshots.
Therefore Gate A selected Gate B design rather than changing runtime or
visible behavior.

Gate B landed the prompt / guard design no-runtime. It keeps the
current role-tagged exact floor path intact, lets current raw-parity
green controls remain only without an arbitrary reorder-invariance
claim, and blocks exact/support/confidence/route-card/output-card
promotion behind role prompts for
`raw_tagged_drift_requires_floor_role_prompt`,
`raw_no_safe_inference_requires_floor_role_prompt`, and
`duplicate_single_entry_role_requires_floor_role_prompt`. Gate C may
implement the prompt / guard only with
`paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement`.

Gate C landed the bounded prompt guard with paired engine and web
visible tests. It does not import a source row, promote confidence,
promote evidence, or widen support. It adds visible warnings for raw
tagged-drift, raw no-safe-inference, and duplicate single-entry raw
roles; raw parity-green exact rows remain live but state that
`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.
Unsupported impact output cards now tell the user to assign floor roles
when the prompt guard is active.

## Why This Is Next

Gate E guarded the wall flat-list lane jump with
`multileaf_screening_blend_fail_closed_until_grouped_topology`, and
Gate F closed `route_family_lane_drift_common_stack_watchlist_v1`.
V16 found no source-ready runtime candidate: Uris 2006 remains
`paused_waiting_rights_safe_source_packet`, GA-600 lacks rights-safe
current row payloads, and closed manufacturer rows remain context-only.

The next actionable risk is `raw_floor_role_inference`, already tracked
as the floor-side equivalent of the rockwool issue. Exact role-tagged
floor rows are the promoted path; arbitrary raw floor reorder value
invariance remains unclaimed.

Required token:

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

## Gate A Requirements

Gate A should add:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`

Required artifacts:

1. `role_tagged_exact_floor_row_inventory`
2. `raw_floor_inference_snapshot_matrix`
3. `duplicate_role_and_order_edit_negative_boundaries`
4. `missing_role_prompt_policy_for_exact_floor_outputs`
5. `engine_and_web_visible_test_plan_before_support_confidence_or_output_copy_movement`
6. `next_closeout_or_bounded_runtime_guard_decision`

Gate A landed artifacts:

1. `role_tagged_exact_floor_row_inventory`: 173 exact rows, 167 manual
   exact rows, 166 raw-inference rows, one no-safe-inference row, and
   12 raw-vs-tagged drift rows.
2. `raw_floor_inference_snapshot_matrix`: green TUAS R5b raw parity,
   drift TUAS X3 CLT raw snapshot, and no-safe-inference Dataholz
   GDSNXN01A snapshot.
3. `duplicate_role_and_order_edit_negative_boundaries`: TUAS R7b raw
   duplicate role drift remains on a warned family-general lane.
4. `missing_role_prompt_policy_for_exact_floor_outputs`: exact output
   promotion requires role ownership; raw drift rows need a role prompt
   before support/confidence/route-card/exact copy movement.
5. `engine_and_web_visible_test_plan_before_support_confidence_or_output_copy_movement`.
6. `next_closeout_or_bounded_runtime_guard_decision`: Gate B prompt /
   guard design selected no-runtime.

## Protected Boundaries

- `raw_floor_role_inference` must remain visible as inference, not
  silently promoted to exact role ownership.
- `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.
- Role-tagged exact floor rows are the promoted exact path.
- Raw floor inference must stay screening-only or prompt for missing
  roles when exact floor outputs require role ownership.
- Duplicate role and many-layer floor stacks must stay finite and
  explicit without fabricating exact or bound support.
- New exact floor rows need role-tagged reorder tests plus raw-order and
  duplicate-role negative tests.
- `standing_lane_misclassification_monitoring_mandate` remains active.
  If suspicious behavior appears, use `note_test_document_or_easy_fix`.
- `floor_raw_role_inference_inventory_landed_no_runtime_selected_gate_b_prompt_guard_design`.
- `floor_raw_role_inference_prompt_guard_design_landed_no_runtime_selected_gate_c_implementation`.
- `floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`.
- `packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts`.
- `gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests`.
- `packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`.
- `gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`.
- `raw_tagged_drift_requires_floor_role_prompt`.
- `raw_no_safe_inference_requires_floor_role_prompt`.
- `duplicate_single_entry_role_requires_floor_role_prompt`.
- `paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement`.

## Inputs

- `docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md`
- `packages/engine/src/floor-layer-order-invariance-expansion-gate-a-contract.test.ts`
- `packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts`
- `packages/engine/src/raw-floor-inferred-split-parity.test.ts`
- `packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts`
- `apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts`
- `apps/web/features/workbench/raw-floor-inferred-split-parity.test.ts`
- `apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts`

## Validation

Required for Gate A:

- focused floor raw-role guardrail Gate A contract;
- continuity with v16 Gate A and current raw-floor/floor-order matrices;
- paired web-visible tests if route-card, output-card, proposal/report,
  support, confidence, or warning copy moves;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Focused command:

`pnpm --filter @dynecho/engine exec vitest run src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts --maxWorkers=1`

Gate A validation:

- completed on 2026-05-03: focused floor raw-role Gate A 1 file / 7
  tests; continuity with v16 Gate A, floor-library raw parity,
  raw-floor inferred split parity, floor order invariance/edit
  stability, raw-floor hostile input, and route-source risk register 8
  files / 39 tests; `pnpm calculator:gate:current` engine 227 files /
  1284 tests, web 48 files / 230 passed + 18 skipped, repo build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed; `apps/web/next-env.d.ts` restored to `.next-typecheck`.

Gate B validation:

- completed on 2026-05-03: focused floor raw-role Gate B 1 file / 7
  tests; continuity with v16 Gate A, Gate A, floor-library raw parity,
  raw-floor inferred split parity, floor order invariance/edit
  stability, raw-floor hostile input, and route-source risk register 9
  files / 46 tests; `pnpm calculator:gate:current` engine 228 files /
  1291 tests, web 48 files / 230 passed + 18 skipped, repo build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed; `apps/web/next-env.d.ts` restored to `.next-typecheck`.

Gate C validation:

- completed on 2026-05-03: focused engine Gate C 1 file / 9 tests;
  focused web route/output proof 1 file / 4 tests; engine continuity
  with Gate A / Gate B, raw-floor parity, raw-floor inferred split
  parity, floor-order edit stability, raw-floor hostile input, and
  route-source risk register 7 files / 30 tests; web continuity with
  raw-floor inferred split parity, floor-order edit stability,
  raw-floor hostile input, and Gate C route/output proof 4 files / 7
  tests; Dataholz CLT / lane-drift raw-tagged warning regression
  continuity 3 files / 24 tests; `pnpm calculator:gate:current` engine
  229 files / 1300 tests, web 49 files / 234 passed + 18 skipped, repo
  build 5 / 5 passed with known non-fatal `sharp/@img` warnings, and
  whitespace guard passed; `apps/web/next-env.d.ts` restored to
  `.next-typecheck`.
