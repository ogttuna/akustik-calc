# Checkpoint - Floor Raw Role Inference Guardrail Gate C

Date: 2026-05-03

Slice: `floor_raw_role_inference_guardrail_v1`

Status:

`floor_raw_role_prompt_guard_runtime_landed_selected_source_gap_revalidation_v17`

Gate C action:

`gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v17-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_floor_raw_role_prompt_guard_landing`

## What Landed

Gate C lands a bounded runtime/visible tightening for raw floor role
inference. It does not import a new source row, does not promote
confidence or evidence, and does not widen numeric support. It makes
the existing raw-floor risk visible before users read a raw stack as an
exact floor-family topology.

Implemented files:

- `packages/engine/src/impact-predictor-input.ts`
- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts`
- `apps/web/features/workbench/simple-workbench-output-model.ts`
- `apps/web/features/workbench/floor-raw-role-prompt-guard-route-card.test.ts`

Gate C behavior:

- Role-tagged exact floor rows remain the promoted exact path.
- Raw parity-green rows can remain live only with visible copy that
  `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`.
- `raw_tagged_drift_requires_floor_role_prompt` now surfaces when a
  raw stack has floor-family hints but does not land on a defended exact
  impact row.
- `raw_no_safe_inference_requires_floor_role_prompt` now surfaces when
  DynEcho cannot safely infer the base / ceiling / upper-floor roles.
- `duplicate_single_entry_role_requires_floor_role_prompt` now surfaces
  alongside the existing duplicate-role blocker before exact
  floor-family promotion.
- Hostile API input still fails closed before any floor-role prompt
  classification.

## Protected Boundaries

- `raw_floor_role_inference`
- `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
- `raw_tagged_drift_requires_floor_role_prompt`
- `raw_no_safe_inference_requires_floor_role_prompt`
- `duplicate_single_entry_role_requires_floor_role_prompt`
- `many_layer_duplicate_floor_stack_stays_finite_no_exact_promotion`
- `hostile_api_input_stays_fail_closed_before_prompt_guard`
- `paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement`
- `standing_lane_misclassification_monitoring_mandate`
- `note_test_document_or_easy_fix`
- `paused_waiting_rights_safe_source_packet`
- `multileaf_screening_blend_fail_closed_until_grouped_topology`

## Rockwool Posture

This Gate C floor guard does not fix the source-validated rockwool
triple-leaf calculation. The Uris 2006 source lane remains
`paused_waiting_rights_safe_source_packet`. The flat-list wall guard
still holds suspicious multi-leaf flat-list swaps on
`multileaf_screening_blend_fail_closed_until_grouped_topology`, but
the split-rockwool `Rw 41` screening answer must not be presented as
fixed, correct, or exact.

## Validation

Completed on 2026-05-03:

- focused Gate C engine test:
  `pnpm --filter @dynecho/engine exec vitest run src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts --maxWorkers=1`
  passed 1 file / 9 tests.
- focused Gate C web route/output proof:
  `pnpm --filter @dynecho/web exec vitest run features/workbench/floor-raw-role-prompt-guard-route-card.test.ts --maxWorkers=1`
  passed 1 file / 4 tests.
- engine continuity with Gate A / Gate B, raw floor parity, raw floor
  inferred split parity, floor-order edit stability, hostile input, and
  route/source risk register tests passed 7 files / 30 tests.
- web continuity with raw-floor inferred split parity, floor-order edit
  stability, hostile input, and the Gate C route/output proof passed 4
  files / 7 tests.
- regression continuity for Dataholz CLT source-truth and lane-drift
  watchlist raw/tagged parity passed 3 files / 24 tests after the raw
  role guard warning contract was made explicit.
- `pnpm calculator:gate:current` passed: engine 229 files / 1300
  tests, web 49 files / 234 passed + 18 skipped, repo build 5 / 5
  tasks successful with known non-fatal `sharp/@img` warnings, and the
  whitespace guard passed.
- `apps/web/next-env.d.ts` was restored to the repo's
  `.next-typecheck` reference after the Next build rewrote it.
