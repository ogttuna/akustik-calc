# Checkpoint - 2026-05-05 - Calculator Source Gap Revalidation V22 Gate A

Slice id: `calculator_source_gap_revalidation_v22`

Status: LANDED / NO-RUNTIME / FIELD OUTPUT OWNER NEXT

Landed gate:

`gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout`

Selection status:

`selected_field_output_owner_design_grade_policy_after_v22_confirmed_rockwool_source_blocked_and_company_snapshot_green`

Selected next slice:

`field_output_owner_and_design_grade_policy_v1`

Selected next file:

`packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts`

Selected next action:

`gate_a_inventory_field_output_owner_design_grade_policy_after_v22_rerank`

Selected planning surface:

`docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md`

## Summary

V22 Gate A re-ranked source and accuracy blockers after the company
frequent-combination snapshot guard closed. It landed no-runtime and did
not change runtime values, support, confidence, evidence, API behavior,
route-card values, output-card status, proposal/report copy, or
workbench-input behavior.

Rockwool remains the highest visible accuracy problem, but it is not
runtime-actionable yet. The grouped split-rockwool answer remains
`Rw 41`, `multileaf_screening_blend`, low confidence, screening-only,
not exact, and not source-validated. Uris 2006 remains
`paused_waiting_rights_safe_source_packet`.

The actionable next correctness step is field-output owner and
design-grade policy. Field-output Gate A/B already kept finite `R'w`,
`DnT,w`, `L'n,w`, and `L'nT,w` values visibly tied to continuation
basis, but there is still no explicit owner policy for when those
metrics can ever be treated as design-grade field measurements.

## Gate A Artifacts

`company_internal_gate_c_closeout_summary`

Company Gate C is consumed as guard evidence only. It is not source or
runtime evidence.

`rockwool_rw41_screening_and_uris_packet_status`

Rockwool grouped triple-leaf remains screening-only. Exact promotion is
blocked until a rights-safe source-owned curve packet, local material
mapping, metric/tolerance owner, negative boundaries, and paired
engine/web/report tests exist.

`repeat_uris_acquisition_blocked_without_new_packet`

The DOI, ScienceDirect, OpenDevEd, and Elsevier TDM access signals are
identity/metadata/access-route signals only. They are not a
rights-safe runtime packet. Do not repeat Uris acquisition without a
new rights-safe packet, authorized TDM payload, page image, numeric
band-vector packet, or source-owned curve payload.

`frequent_combination_guard_green_carry_forward`

Company Gate A/B/C cover the current frequent-combination engine and web
cells. V22 did not find a concrete uncovered API/import/proposal route
that should displace the field-output owner step.

`field_output_near_source_hostile_input_and_curve_provenance_status`

Field outputs remain continuations, near-source aliases remain
context-only, hostile inputs remain fail-closed, and curve provenance is
required before any graph-derived runtime path.

`company_internal_high_accuracy_opening_blocker_status`

`pre_company_internal_use_exit_criteria` remains open. Company-internal
high-accuracy opening is still blocked until Rockwool is exact or
explicitly screening-only, field-output owner policy exists, frequent
lane snapshots stay green, source promotion owns topology/material/
metric/tolerance/negative-boundary/visible tests, hostile inputs fail
closed, and validation is green.

`selected_next_slice_with_target_file_and_validation_scope`

V22 selects `field_output_owner_and_design_grade_policy_v1` with first
file:

`packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts`

## Validation

Completed on 2026-05-05:

- focused V22 Gate A passed 1 file / 7 tests;
- engine continuity with company Gate C/Gate A, V21, company blocker,
  route-source risk register, Uris Gate U, and field-output Gate A
  passed 8 files / 52 tests;
- web continuity with company visible guard, field-output Gate B,
  triple-leaf acceptance rehearsal, and flat-list multileaf route-card
  guard passed 4 files / 22 tests;
- `pnpm calculator:gate:current` passed with engine 245 files / 1417
  tests, web 51 files / 246 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- broad `pnpm check` passed after fixing the V22 test typecheck issue:
  lint and typecheck clean, engine full suite 378 files / 2237 tests,
  web full suite 163 files / 919 passed + 18 skipped, and repo build
  5 / 5 tasks.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`. They do not change calculator behavior.

Commands run:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts --maxWorkers=1`

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts src/calculator-route-source-risk-register-contract.test.ts src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts --maxWorkers=1`

`pnpm --filter @dynecho/web exec vitest run features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts --maxWorkers=1`

`pnpm calculator:gate:current`

`pnpm --filter @dynecho/engine run typecheck`

`pnpm check`

`git diff --check`
