# Slice Plan - Company Internal High-Accuracy Opening Rehearsal V1

Slice id: `company_internal_high_accuracy_opening_rehearsal_v1`

Status: GATE C CLOSED / CONTROLLED USE HANDOFF SELECTED

Selected by:

`source_promotion_hostile_input_readiness_guard_v1` Gate C closeout

Selection status:

`closed_source_promotion_hostile_input_readiness_guard_no_runtime_and_selected_company_internal_high_accuracy_opening_rehearsal`

Selected first file:

`packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`

Selected first action:

`gate_a_rehearse_company_internal_high_accuracy_opening_evidence_no_runtime`

Gate A landed file:

`packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`

Gate A status:

`gate_a_rehearsed_company_internal_high_accuracy_opening_no_runtime_selected_closeout`

Selected closeout file:

`packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`

Selected closeout action:

`gate_c_closeout_company_internal_opening_rehearsal_and_next_slice_selection`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md`

Gate C landed file:

`packages/engine/src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts`

Gate C status:

`closed_company_internal_high_accuracy_opening_rehearsal_no_runtime_and_selected_controlled_use_handoff`

Selected next slice:

`company_internal_controlled_use_handoff_v1`

Selected next file:

`packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`

Selected next action:

`gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime`

Selected next planning surface:

`docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md`

Prior Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_A_HANDOFF.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_HOSTILE_INPUT_READINESS_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Planning surface:

`docs/calculator/SLICE_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_V1_PLAN.md`

## Objective

Rehearse the current calculator posture before any company-internal
high-accuracy handoff label is allowed. This is a final evidence and
acceptance matrix slice, not a runtime import, source promotion, value
retune, report polish, or UI redesign.

The slice must separate:

- ready lanes that are defensible with current source/formula owners;
- caveated lanes that are usable only with visible screening or
  continuation caveats;
- blocked lanes that must fail closed, remain `needs_input`, or stay
  source-gated;
- hostile API/import and excessive/reordered-layer edges that must not
  emit exact-looking values.

## Required Carry-Forward

Gate C selected this rehearsal only after these artifacts were consumed:

- `source_promotion_surface_inventory`
- `hostile_api_import_fail_closed_surface_inventory`
- `estimate_json_1e309_rejected_by_finite_layer_schema`
- `server_import_snapshot_not_runtime_promotion_surface`
- `near_source_rows_context_only_until_owner_set_exists`
- `rockwool_gate_c_policy_freeze_carry_forward`
- `selected_source_promotion_hostile_closeout_with_target_file`
- `company_internal_high_accuracy_opening_rehearsal_selected`

Rockwool triple-leaf remains explicit screening-only, not fixed:
grouped split-rockwool is still `Rw 41`, flat-list adjacent swap is
still `Rw 42`, field `R'w 34` and `DnT,w 36` remain continuations, and
Uris 2006 remains `paused_waiting_rights_safe_source_packet`.

## Gate A Result

Gate A created:

`packages/engine/src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts`

Gate A produced:

- `company_internal_opening_acceptance_matrix`;
- `final_validation_evidence_map`;
- `rockwool_screening_and_source_blocker_registry`;
- `source_promotion_no_runtime_boundary_register`;
- `hostile_api_import_fail_closed_evidence`;
- `operator_caveat_and_usage_handoff_pack`;
- `selected_opening_handoff_or_backlog_followup`.

Gate A did not move runtime values, support, confidence, evidence,
route-card values, output-card status, proposal/report values, API
shape, or workbench-input behavior. It rehearsed current ready,
caveated, blocked, hostile, many-layer, and reorder lanes and selected
closeout.

The rehearsal still does not mark the calculator high-accuracy-ready.
Only the ready source/benchmark corridors are marked as current-posture
usable; Rockwool triple-leaf, generated/screening lanes, field
continuations, near-source rows, Uris 2006, hostile API/import payloads,
and raw-order edge lanes remain caveated, blocked, or fail-closed.

Gate A validation completed on 2026-05-05: focused Gate A passed 1
file / 6 tests; continuity passed 8 files / 42 tests;
`pnpm calculator:gate:current` passed with engine 253 files / 1465
tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green; broad `pnpm check` passed with lint and
typecheck clean, engine 386 files / 2285 tests, web 165 files / 933
passed + 18 skipped, and repo build 5 / 5 tasks. `apps/web/next-env.d.ts`
was restored to `.next-typecheck` after Next rewrote it.

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts --maxWorkers=1
```

Continuity should include at least:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts src/raw-wall-hostile-input-answer-matrix.test.ts src/raw-floor-hostile-input-answer-matrix.test.ts src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts --maxWorkers=1
```

Selected Gate C closeout:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts --maxWorkers=1
```

Before any opening handoff, run:

```sh
pnpm calculator:gate:current
pnpm check
git diff --check
```

Known non-fatal `sharp/@img` warnings through
`@turbodocx/html-to-docx` do not change calculator posture.

## Gate C Result

Gate C closed no-runtime and consumed:

- `company_internal_opening_acceptance_matrix`
- `final_validation_evidence_map`
- `rockwool_screening_and_source_blocker_registry`
- `source_promotion_no_runtime_boundary_register`
- `hostile_api_import_fail_closed_evidence`
- `operator_caveat_and_usage_handoff_pack`
- `selected_opening_handoff_or_backlog_followup`

Gate C landed `company_internal_controlled_use_handoff_selected` and
selected `company_internal_controlled_use_handoff_v1`. It did not open a
direct high-accuracy label. The next slice must create a current
controlled-use handoff pack with updated values, Rockwool
screening-only language, caveats, and stop rules before any use label is
refreshed.

Gate C validation completed on 2026-05-05: focused Gate C passed 1 file
/ 5 tests; continuity passed 9 files / 47 tests; `pnpm
calculator:gate:current` passed with engine 254 files / 1470 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; broad `pnpm check` passed with lint/typecheck
clean, engine 387 files / 2290 tests, web 165 files / 933 passed + 18
skipped, repo build 5 / 5 tasks, and final `git diff --check` green.
