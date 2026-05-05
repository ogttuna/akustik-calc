# Slice Plan - Company Internal Controlled Use Handoff V1

Slice id: `company_internal_controlled_use_handoff_v1`

Status: GATE C CLOSED / SOURCE-GAP REVALIDATION V24 SELECTED

Selected by:

`company_internal_high_accuracy_opening_rehearsal_v1` Gate C closeout

Selection status:

`closed_company_internal_high_accuracy_opening_rehearsal_no_runtime_and_selected_controlled_use_handoff`

Selected first file:

`packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`

Selected first action:

`gate_a_prepare_company_internal_controlled_use_handoff_pack_no_runtime`

Landed Gate A file:

`packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`

Landed Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_A_HANDOFF.md`

Landed controlled-use handoff:

`docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md`

Selected closeout file:

`packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`

Selected closeout action:

`gate_c_closeout_company_internal_controlled_use_handoff_and_next_slice_selection`

Landed closeout file:

`packages/engine/src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts`

Landed closeout checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md`

Closeout status:

`closed_company_internal_controlled_use_handoff_no_runtime_and_selected_source_gap_revalidation_v24`

Selected next slice:

`calculator_source_gap_revalidation_v24`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_HIGH_ACCURACY_OPENING_REHEARSAL_GATE_C_CLOSEOUT_HANDOFF.md`

Planning surface:

`docs/calculator/SLICE_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_V1_PLAN.md`

Selection validation:

Focused Gate C passed 1 file / 5 tests; continuity passed 9 files / 47
tests; `pnpm calculator:gate:current` passed with engine 254 files /
1470 tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
tasks, and whitespace guard green; broad `pnpm check` passed with lint
and typecheck clean, engine 387 files / 2290 tests, web 165 files / 933
passed + 18 skipped, repo build 5 / 5 tasks, and final
`git diff --check` green.

## Objective

Prepare the current controlled-use handoff pack for a knowledgeable
personal/company-internal operator. This is a no-runtime documentation
and contract slice. It must turn the latest opening rehearsal evidence
into an operator-facing handoff without claiming external certification
or broad high-accuracy coverage.

The high-accuracy label remains forbidden. The handoff may describe
controlled use only inside the current ready/caveated/blocked envelope.

## Required Carry-Forward

Gate C selected this handoff only after consuming:

- `company_internal_opening_acceptance_matrix`
- `final_validation_evidence_map`
- `rockwool_screening_and_source_blocker_registry`
- `source_promotion_no_runtime_boundary_register`
- `hostile_api_import_fail_closed_evidence`
- `operator_caveat_and_usage_handoff_pack`
- `selected_opening_handoff_or_backlog_followup`
- `company_internal_controlled_use_handoff_selected`

Current ready source/benchmark corridors are limited to:

- `wall_lsf_exact_preset`
- `wall_aac_single_leaf_benchmark`
- `wall_masonry_single_leaf_benchmark`
- `floor_pliteq_exact_source_corridor`
- `floor_ubiq_bound_source_corridor`

Rockwool remains explicit screening-only: grouped `Rw 41`, flat-list
`Rw 42`, field `R'w 34`, `DnT,w 36`, not exact/source-validated.
Uris 2006 remains `paused_waiting_rights_safe_source_packet`.

## Gate A Plan

Created:

`packages/engine/src/company-internal-controlled-use-handoff-gate-a-contract.test.ts`

Gate A produced:

- `current_operator_workflow`
- `current_acceptance_bucket_table`
- `ready_values_snapshot`
- `caveated_blocked_stop_rules`
- `validation_command_log`
- `rockwool_screening_only_notice`
- `selected_closeout_or_source_gap_followup`

Gate A created `docs/calculator/COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF.md`
as the current handoff document superseding the old pilot values for this
slice. It preserves the old warning: controlled use is not regulatory
certification, not external/client certification, and not permission to
treat screening or source-gated lanes as exact.

Current acceptance buckets now documented in the handoff:

- `ready_with_current_source_or_benchmark_owner`
- `caveated_screening_or_field_continuation`
- `blocked_source_owner_missing_or_needs_input`
- `hostile_many_layer_reorder_and_import_edges`

No runtime/support/confidence/evidence/API/route-card/output-card,
proposal/report/workbench-input behavior is allowed to move in this
slice.

Gate A validation completed on 2026-05-05: focused Gate A passed 1 file
/ 6 tests; continuity passed 6 files / 33 tests; `pnpm
calculator:gate:current` passed with engine 255 files / 1476 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; final `git diff --check` passed after restoring
`apps/web/next-env.d.ts` to `.next-typecheck`. Broad `pnpm check` is
reserved for the selected Gate C closeout or later runtime/user-visible
movement.

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/company-internal-controlled-use-handoff-gate-a-contract.test.ts --maxWorkers=1
```

Continuity should include at least:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts src/company-internal-high-accuracy-opening-rehearsal-gate-a-contract.test.ts src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts --maxWorkers=1
```

Before any handoff closeout, run:

```sh
pnpm calculator:gate:current
pnpm check
git diff --check
```

Known non-fatal `sharp/@img` warnings through
`@turbodocx/html-to-docx` do not change calculator posture.

## Gate C Closeout

Gate C closed this slice no-runtime. It consumed:

- `current_operator_workflow`
- `current_acceptance_bucket_table`
- `ready_values_snapshot`
- `caveated_blocked_stop_rules`
- `validation_command_log`
- `rockwool_screening_only_notice`
- `selected_closeout_or_source_gap_followup`

Gate C landed:

- `company_internal_controlled_use_handoff_closed`
- `controlled_use_pack_is_current_operator_handoff`
- `calculator_source_gap_revalidation_v24_selected`

The controlled-use handoff remains the current operator pack, but the
high-accuracy label stays forbidden. Runtime values, support,
confidence, evidence, API, route-card values, output-card status,
proposal/report values, and workbench-input behavior stayed frozen.

V24 must carry forward `controlled_use_pack_is_current_operator_handoff`,
`rockwool_screening_only_not_fixed`, `field_outputs_non_design_grade`,
`source_promotion_owner_set_required`, `hostile_api_import_fail_closed`,
and `frequent_combination_snapshots_stay_green`.

Gate C validation completed on 2026-05-05: focused Gate C passed 1 file
/ 5 tests; continuity passed 8 files / 43 tests; `pnpm
calculator:gate:current` passed with engine 256 files / 1481 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; broad `pnpm check` passed with lint/typecheck
clean, engine 389 files / 2301 tests, web 165 files / 933 passed + 18
skipped, repo build 5 / 5 tasks, and final `git diff --check` green.
