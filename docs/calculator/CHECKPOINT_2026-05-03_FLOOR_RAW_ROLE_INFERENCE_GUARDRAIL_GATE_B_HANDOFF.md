# Checkpoint - Floor Raw Role Inference Guardrail Gate B

Date: 2026-05-03

Slice id: `floor_raw_role_inference_guardrail_v1`

Landed gate:

`gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime`

Landed status:

`floor_raw_role_inference_prompt_guard_design_landed_no_runtime_selected_gate_c_implementation`

Selected next file:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts`

Selected next action:

`gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests`

Implementation artifact:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts`

Prior Gate A artifact:

`packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts`

Planning surface:

`docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md`

## Summary

Gate B landed a no-runtime prompt / guard design for:

`raw_floor_role_inference`

It does not move runtime values, route-card copy, output-card status,
support/confidence/evidence, API shape, proposal/report copy, warnings,
or workbench input behavior.

The design keeps role-tagged exact floor rows as the promoted path and
keeps this boundary explicit:

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

## Prompt / Guard Rules

Allowed current paths:

- `role_tagged_exact_floor_row`: exact promotion is allowed only when
  explicit floor roles, source row material/thickness tolerance, and
  role-tagged reorder negative tests own the match.
- `raw_parity_green_control`: the current raw inference can remain only
  when it equals the role-tagged snapshot; route cards must not claim
  arbitrary raw floor reorder value invariance.

Blocked paths before Gate C:

- `raw_tagged_drift_requires_floor_role_prompt`
- `raw_no_safe_inference_requires_floor_role_prompt`
- `duplicate_single_entry_role_requires_floor_role_prompt`

These blocked paths must not promote exact floor output copy, support,
confidence, route-card status, or output-card status until the user
confirms floor roles and paired tests prove the movement.

## Representative Runtime Boundaries

Gate B pins representative current behavior without changing it:

- TUAS X3 tagged stays an exact floor row.
- TUAS R5b raw stays a current green raw-parity control, but without an
  arbitrary raw reorder invariance claim.
- TUAS X3 raw requires a floor-role prompt before exact promotion.
- Dataholz GDSNXN01A raw has no safe inference and requires a prompt.
- TUAS R7b raw duplicate role remains on the warned family-general lane
  and requires a prompt before exact copy.

## Gate C Test Plan

Gate C may implement the prompt / guard only with paired engine and web
visible tests:

`paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement`

Required engine proof:

- `engine_role_tagged_exact_positive_control`
- `engine_raw_parity_green_no_arbitrary_reorder_invariance_claim`
- `engine_raw_tagged_drift_requires_floor_role_prompt`
- `engine_raw_no_safe_inference_requires_floor_role_prompt`
- `engine_duplicate_single_entry_role_requires_floor_role_prompt`
- `engine_many_layer_duplicate_stays_finite_no_exact_promotion`
- `engine_hostile_input_stays_fail_closed_before_prompt_guard`

Required web proof:

- `web_route_card_shows_floor_role_prompt_for_raw_drift`
- `web_output_card_does_not_promote_lnw_or_lnw_ci_without_roles`
- `web_raw_parity_green_route_card_does_not_claim_arbitrary_reorder_invariance`
- `web_duplicate_role_warning_stays_visible_before_exact_copy`

## Original Rockwool Posture

This floor slice does not fix the original wall triple-leaf rockwool
calculation. The Uris 2006 lane remains:

`paused_waiting_rights_safe_source_packet`

The current flat-list guard remains:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

That guard prevents the confirmed flat-list wrong-lane jump, but it is
not a source-validated triple-leaf solver and must not be presented as
the rockwool exact fix.

## Standing Mandate

`standing_lane_misclassification_monitoring_mandate`

When suspicious wrong-lane, source-lane, field-output, material-alias,
hostile-input, or provenance behavior appears, apply:

`note_test_document_or_easy_fix`

Reproduce with a focused test, fix immediately only if bounded, or
document the risk and keep output fail-closed.

## Validation

Completed on 2026-05-03:

- focused Gate B contract: 1 file / 7 tests.
- continuity with v16 Gate A, Gate A, floor-library raw parity,
  raw-floor inferred split parity, floor order invariance/edit
  stability, raw-floor hostile input, and route-source risk register:
  9 files / 46 tests.
- `pnpm calculator:gate:current`: engine 228 files / 1291 tests,
  web 48 files / 230 passed + 18 skipped, repo build 5 / 5 passed.
- known non-fatal build warnings: optional `sharp/@img` packages via
  `@turbodocx/html-to-docx`.
- whitespace guard passed through current-gate, and
  `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build side effect.
