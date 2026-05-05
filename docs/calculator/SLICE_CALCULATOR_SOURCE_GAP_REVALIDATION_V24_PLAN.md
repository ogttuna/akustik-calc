# Slice Plan - Calculator Source Gap Revalidation V24

Slice id: `calculator_source_gap_revalidation_v24`

Status: GATE A LANDED / SOURCE-PROMOTION OWNER-SET GUARD SELECTED

Selected by:

`company_internal_controlled_use_handoff_v1` Gate C closeout

Selection status:

`closed_company_internal_controlled_use_handoff_no_runtime_and_selected_source_gap_revalidation_v24`

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_controlled_use_handoff_closeout`

Landed Gate A file:

`packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`

Landed Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A_HANDOFF.md`

Landed Gate A status:

`selected_source_promotion_owner_set_readiness_guard_after_v24_confirmed_rockwool_uris_blocked_and_controlled_use_handoff_closed`

Selected next slice:

`source_promotion_owner_set_readiness_guard_v1`

Selected next file:

`packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts`

Selected next action:

`gate_a_inventory_source_promotion_owner_set_after_v24_rerank`

Selected next planning surface:

`docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_COMPANY_INTERNAL_CONTROLLED_USE_HANDOFF_GATE_C_CLOSEOUT_HANDOFF.md`

Planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_PLAN.md`

Selection validation:

Focused Gate C passed 1 file / 5 tests; continuity passed 8 files / 43
tests; `pnpm calculator:gate:current` passed with engine 256 files /
1481 tests, web 53 files / 260 passed + 18 skipped, repo build 5 / 5
tasks, and whitespace guard green; broad `pnpm check` passed with
lint/typecheck clean, engine 389 files / 2301 tests, web 165 files /
933 passed + 18 skipped, repo build 5 / 5 tasks, and final
`git diff --check` green.

## Objective

Re-rank the source/accuracy backlog after the controlled-use handoff is
closed and kept as the current operator pack. V24 must choose the next
bounded calculator correctness step from current evidence, not from
optimism around a visible handoff.

This is the current accuracy queue after handoff closeout. It must keep
runtime values frozen unless the selected next candidate names a
complete source-owned runtime owner set with topology, material mapping,
metric context, tolerance, negative boundaries, and paired engine plus
visible tests.

## Gate A Result

V24 Gate A landed no-runtime. It consumed
`controlled_use_handoff_gate_c_closeout_consumed`, kept Rockwool/Uris
as `rockwool_uris_exact_runtime_still_blocked_after_controlled_use`,
selected `source_promotion_owner_set_guard_selected`, and carried
forward `hostile_api_import_and_frequent_combination_green_carry_forward`
plus `field_outputs_non_design_grade_carry_forward`.

The selected next slice is
`source_promotion_owner_set_readiness_guard_v1`. That slice must prevent
near-source aliases, source rows, source locator metadata, imported
snapshots, and official-sounding material names from becoming runtime
evidence unless source provenance, topology owner, material mapping
owner, metric context owner, tolerance owner, negative boundaries,
paired engine tests, and paired visible tests are all named and green.

Runtime values, support, confidence, evidence, API shape, route-card
values, output-card status, proposal/report values, and workbench-input
behavior stayed frozen.

Gate A validation completed on 2026-05-05: focused V24 Gate A passed 1
file / 7 tests; engine continuity passed 8 files / 47 tests; web
visible frequent-combination continuity passed 1 file / 8 tests; `pnpm
calculator:gate:current` passed with engine 257 files / 1488 tests, web
53 files / 260 passed + 18 skipped, repo build 5 / 5 tasks, and
whitespace guard green; final `git diff --check` passed after restoring
`apps/web/next-env.d.ts` to `.next-typecheck`. Broad `pnpm check` was
not run because V24 Gate A made no runtime, visible, shared-schema, API,
report/proposal, or workbench-input behavior movement.

## Required Carry-Forward

V24 starts with these carry-forward artifacts:

- `controlled_use_pack_is_current_operator_handoff`
- `rockwool_screening_only_not_fixed`
- `field_outputs_non_design_grade`
- `source_promotion_owner_set_required`
- `hostile_api_import_fail_closed`
- `frequent_combination_snapshots_stay_green`

The controlled-use handoff remains current for knowledgeable personal /
company-internal use inside the documented envelope. It is not
regulatory certification, not external/client certification, and not a
broad high-accuracy opening.

Rockwool remains explicit screening-only: grouped `Rw 41`, flat-list
`Rw 42`, field `R'w 34`, `DnT,w 36`, low confidence, not exact, and not
source-validated. Uris 2006 remains
`paused_waiting_rights_safe_source_packet`.

Field outputs remain continuations from the active lab/screening/
apparent/bound basis. They are not independent design-grade field
measurements without a future field-output owner set and source basis.

## Candidate Order For Gate A

Gate A must compare at least:

1. Rockwool/Uris exact source-owned runtime readiness.
2. Source-promotion ownership for near-source aliases, source rows, and
   source locator metadata.
3. Hostile API/import fail-closed and finite input boundaries.
4. Frequent wall/floor lane snapshots after the controlled-use handoff.
5. Field-output owner policy follow-up only if a concrete remaining
   design-grade leak path is found.
6. Productization/report polish only after correctness blockers are
   controlled.

No candidate may use visible copy, a finite screening number, a
near-source alias, or imported snapshot metadata as runtime evidence.

## Gate A Plan

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts`.
2. Consume `company_internal_controlled_use_handoff_closed`,
   `controlled_use_pack_is_current_operator_handoff`, and
   `calculator_source_gap_revalidation_v24_selected`.
3. Recompute the Rockwool grouped/flat/field snapshots and keep them
   screening-only unless a rights-safe source-owned packet exists.
4. Recheck source-promotion owner completeness for topology, material
   mapping, metric context, tolerance, negative boundaries, and paired
   visible tests.
5. Confirm hostile API/import payloads still fail closed and frequent
   wall/floor snapshot lanes still guard common combinations.
6. Select exactly one next bounded file and validation scope. Do not
   select runtime movement unless the owner set is complete.

## Validation Plan

After V24 Gate A is implemented:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts --maxWorkers=1
```

Continuity should include at least:

```sh
pnpm --filter @dynecho/engine exec vitest run src/post-company-internal-controlled-use-handoff-v1-next-slice-selection-contract.test.ts src/company-internal-controlled-use-handoff-gate-a-contract.test.ts src/post-company-internal-high-accuracy-opening-rehearsal-v1-next-slice-selection-contract.test.ts src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts --maxWorkers=1
```

Then run:

```sh
pnpm calculator:gate:current
git diff --check
```

Use broad `pnpm check` if V24 moves runtime behavior, visible behavior,
shared schemas, API contracts, report/proposal wording, or workbench
input behavior. Known non-fatal `sharp/@img` warnings through
`@turbodocx/html-to-docx` remain unchanged.
