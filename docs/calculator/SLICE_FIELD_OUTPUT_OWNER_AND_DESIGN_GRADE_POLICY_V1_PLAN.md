# Slice Plan - Field Output Owner And Design-Grade Policy V1

Slice id: `field_output_owner_and_design_grade_policy_v1`

Status: CLOSED AT GATE C / SELECTED SOURCE GAP REVALIDATION V23

Selected by:

`calculator_source_gap_revalidation_v22` Gate A

Selection status:

`selected_field_output_owner_design_grade_policy_after_v22_confirmed_rockwool_source_blocked_and_company_snapshot_green`

Selected first file:

`packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts`

Selected first action:

`gate_a_inventory_field_output_owner_design_grade_policy_after_v22_rerank`

Landed Gate A status:

`gate_a_inventoried_field_output_owner_design_grade_policy_no_runtime_selected_visible_policy_gate_b`

Landed Gate A file:

`packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts`

Landed Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A_HANDOFF.md`

Selected Gate B file:

`apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts`

Selected Gate B action:

`gate_b_pin_visible_field_output_design_grade_owner_policy`

Landed Gate B status:

`gate_b_pinned_visible_field_output_design_grade_owner_policy_no_runtime_selected_gate_c_closeout`

Landed Gate B file:

`apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts`

Landed Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_B_HANDOFF.md`

Selected Gate C file:

`packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts`

Selected Gate C action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Landed Gate C status:

`closed_field_output_owner_design_grade_policy_no_runtime_and_selected_source_gap_revalidation_v23`

Landed Gate C file:

`packages/engine/src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts`

Landed Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_C_CLOSEOUT_HANDOFF.md`

Selected next slice:

`calculator_source_gap_revalidation_v23`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V23_PLAN.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A_HANDOFF.md`

Planning surface:

`docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md`

Required carry-forward artifacts:

- `rockwool_rw41_screening_and_uris_packet_status`
- `repeat_uris_acquisition_blocked_without_new_packet`
- `field_output_owner_and_design_grade_policy`
- `field_output_owner_policy_gate_c_closeout_summary`
- `field_output_owner_and_design_grade_policy_closed_carry_forward`
- `pre_company_internal_use_exit_criteria`

## Objective

Define the owner boundary for field-style outputs so finite `R'w`,
`DnT,w`, `L'n,w`, `L'nT,w`, `DnT,A`, and related values cannot be used
as design-grade field measurements unless an explicit owner names the
metric basis, source evidence, geometry, tolerance, visible/report copy,
and negative-boundary tests.

This slice is not a Rockwool triple-leaf exact fix and must not import
a runtime source row. Rockwool grouped split-leaf behavior remains
`Rw 41`, `multileaf_screening_blend`, low confidence, screening-only,
not exact, and not source-validated while Uris 2006 remains
`paused_waiting_rights_safe_source_packet`.

## Why This Is The Next Actionable Step

V22 re-ranked the current blockers and found:

- Rockwool/Uris exact runtime remains the highest visible accuracy
  issue, but it is blocked by missing rights-safe source-owned curve
  payload, local material mapping, tolerance owner, negative boundaries,
  and paired engine/web/report tests.
- Company frequent-combination engine and web guards are green for the
  current bounded cells; no concrete uncovered API/import/proposal path
  was named by V22.
- Near-source aliases remain context-only and hostile inputs remain
  fail-closed.
- Field-output Gate A/B already made finite field outputs visibly
  continuation-based, but there is still no explicit owner policy for
  when those metrics can ever become design-grade.

Therefore this slice is the highest actionable no-runtime correctness
step after V22. It improves calculator honesty and private-use
readiness by making the field-output promotion boundary executable.

## Gate A Must Produce

- `field_output_owner_design_grade_policy_inventory`
- `field_metric_owner_matrix`
- `source_basis_and_tolerance_requirement_matrix`
- `missing_geometry_and_missing_field_input_negative_boundaries`
- `rockwool_screening_field_output_carry_forward`
- `selected_gate_b_visible_policy_or_no_runtime_closeout_with_target_file`

Gate A has landed these artifacts no-runtime. It selected visible Gate B
because the engine-side owner matrix now says finite field-style values
are not design-grade without metric owner, source basis, geometry/room
context, tolerance, negative boundaries, and paired engine/web/report
tests.

## Gate A Test Shape

Create:

`packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts`

Expected assertions:

1. No runtime value, support, confidence, evidence, API, route-card,
   output-card, proposal/report, or workbench-input behavior moves.
2. Every field-style metric is assigned one of:
   `lab_continuation`, `apparent_curve_continuation`,
   `standardized_field_continuation`, `impact_field_continuation`,
   `bound_continuation`, `needs_input`, or `design_grade_owner_absent`.
3. A design-grade field output requires metric owner, source basis,
   geometry/room context, tolerance, negative boundaries, and paired
   engine/web/report tests.
4. Missing receiving-room volume, field K, direct field path, or
   geometry must stay `needs_input` or unsupported rather than silently
   deriving from adjacent live metrics.
5. Low-confidence wall/floor and raw fallback field outputs must remain
   continuation-based and visibly non-design-grade.
6. Rockwool triple-leaf field outputs must carry the `Rw 41` screening
   posture and must not imply the triple-leaf source defect is fixed.

## Non-Promotion Rules

- Do not mark field outputs design-grade because a finite number exists.
- Do not promote `R'w`, `DnT,w`, `L'n,w`, or `L'nT,w` to exact field
  measurements without owner/source/tolerance/visible-test closure.
- Do not use this slice as Uris 2006 or Rockwool exact source evidence.
- Do not loosen hostile-input, near-source alias, or missing-input
  fail-closed behavior.
- Keep `pre_company_internal_use_exit_criteria` open until field-output
  owner policy and Rockwool exact-or-explicit-screening posture are both
  closed with validation.

## Gate A Findings

- `R'w`, `DnT,w`, `DnT,A`, `L'n,w`, `L'nT,w`, and `L'nT,50` now have an
  explicit owner matrix. Current design-grade owner and tolerance owner
  are absent for every row.
- Low-confidence grouped split-rockwool field outputs are
  `apparent_curve_continuation`, not design-grade field measurements.
  The rockwool route still carries `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only,
  not-exact, not-source-validated posture.
- Exact floor rows can expose airborne and impact field companions, but
  Gate A classifies them as standardized/impact field continuations.
  Exact lab source rows do not make the field companions independent
  exact field measurements.
- Missing receiving-room volume, field K, direct field path, or geometry
  stays `needs_input` / unsupported instead of deriving from adjacent
  finite live metrics.

## Gate B Must Produce

- `visible_field_output_design_grade_policy_guard`
- `output_card_owner_policy_copy`
- `proposal_report_owner_policy_copy`
- `needs_input_field_policy_visible_boundaries`
- `rockwool_field_output_screening_policy_carry_forward`
- `selected_gate_c_closeout_or_next_slice_with_target_file`

Gate B has landed these artifacts visible-only. It pins output-card and
proposal/report language so field-style values are visibly scoped to
their current continuation, bound, screening, or needs-input basis and
never read as design-grade without an owner.

## Gate B Findings

- `field-airborne-output`, `simple-workbench-output-model`, and
  `simple-workbench-output-posture` now share explicit owner-policy copy:
  no design-grade field owner is active until source basis, geometry,
  tolerance, negative-boundary, and report-test ownership close.
- Wall `R'w`, `DnT,w`, and `DnT,A` output-card details carry
  `output_card_owner_policy_copy` while keeping the low-confidence
  Rockwool `multileaf_screening_blend` posture visible.
- Exact floor `R'w`, `DnT,w`, `L'n,w`, `L'nT,w`, and `L'nT,50`
  companions remain field continuations in output cards and
  proposal/report coverage. Exact lab source rows do not make those
  companions design-grade field measurements.
- Missing receiving-room volume, missing field K, missing direct field
  path, and missing geometry remain visible `needs_input` boundaries.

## Gate C Must Produce

- `field_output_owner_policy_gate_c_closeout_summary`
- `field_output_owner_and_design_grade_policy_closed_carry_forward`
- `rockwool_rw41_screening_and_uris_packet_status`
- `pre_company_internal_use_exit_criteria`
- `selected_source_gap_revalidation_v23_with_target_file_and_validation_scope`

Gate C has landed these artifacts no-runtime. It closes this slice as a
field-output honesty and design-grade owner boundary, then selects
`calculator_source_gap_revalidation_v23`.

## Gate C Findings

- Field-output owner policy is closed as visible policy, not runtime
  source evidence. Finite field outputs remain non-design-grade.
- `field_output_owner_and_design_grade_policy_closed_carry_forward`
  keeps metric/source/geometry/tolerance/negative-boundary and paired
  engine/web/report ownership as prerequisites before any future
  design-grade field output.
- Rockwool triple-leaf remains not fixed. Grouped split-rockwool is
  still `Rw 41`, `multileaf_screening_blend`, low confidence,
  screening-only, not exact, and not source-validated. Uris 2006
  remains `paused_waiting_rights_safe_source_packet`.
- `pre_company_internal_use_exit_criteria` remains active. This slice
  closes the field-output criterion, but high-accuracy opening remains
  blocked by Rockwool exact-or-explicit-screening, source-promotion
  ownership, hostile-input fail-closed proof, and final validation at
  opening handoff.

## Validation Plan

Gate A validation completed on 2026-05-05:

- focused Gate A passed 1 file / 6 tests;
- engine continuity with V22, field-output Gate A, and company blocker
  passed 4 files / 24 tests;
- web continuity with field-output Gate B, company visible guard, wall
  field continuation, and floor field continuation passed 4 files /
  50 passed + 18 skipped;
- `pnpm calculator:gate:current` passed with engine 246 files / 1423
  tests, web 51 files / 246 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- broad `pnpm check` passed with lint/typecheck clean, engine full
  suite 379 files / 2243 tests, web full suite 163 files / 919 passed +
  18 skipped, and repo build 5 / 5 tasks.

Gate B validation completed on 2026-05-05:

- focused Gate B passed 1 file / 6 tests;
- engine continuity with Gate A, V22, field-output leakage Gate A, and
  company blocker passed 4 files / 24 tests;
- web continuity with field-output owner Gate B, field-output leakage
  Gate B, company visible guard, wall/floor field continuations, output
  model, and output posture passed 7 files / 73 passed + 18 skipped;
- `pnpm calculator:gate:current` passed with engine 246 files / 1423
  tests, web 52 files / 252 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- broad `pnpm check` passed with lint/typecheck clean, engine full
  suite 379 files / 2243 tests, web full suite 164 files / 925 passed +
  18 skipped, and repo build 5 / 5 tasks.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

Gate C validation completed on 2026-05-05:

- focused Gate C passed 1 file / 6 tests;
- engine continuity with Gate C, Gate A, V22, field-output leakage
  Gate A, and company blocker passed 5 files / 30 tests;
- web continuity with field-output owner Gate B, field-output leakage
  Gate B, company visible guard, wall/floor field continuations, output
  model, and output posture passed 7 files / 73 passed + 18 skipped;
- `pnpm calculator:gate:current` passed with engine 247 files / 1429
  tests, web 52 files / 252 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.
- broad `pnpm check` passed with lint/typecheck clean, engine full
  suite 380 files / 2249 tests, web full suite 164 files / 925 passed +
  18 skipped, and repo build 5 / 5 tasks.
- final `git diff --check` was green.

Gate C validation commands:

1. Focused Gate C:

   ```sh
   pnpm --filter @dynecho/engine exec vitest run src/post-field-output-owner-and-design-grade-policy-v1-next-slice-selection-contract.test.ts --maxWorkers=1
   ```

2. Continuity with Gate A, Gate B, field-output Gate B, company visible
   guard, and field-continuation surfaces:

   ```sh
   pnpm --filter @dynecho/engine exec vitest run src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts --maxWorkers=1
   ```

   ```sh
   pnpm --filter @dynecho/web exec vitest run features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts features/workbench/wall-field-continuation-completeness-matrix.test.ts features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts --maxWorkers=1
   ```

3. Run `pnpm calculator:gate:current`.
4. Run `git diff --check`.

Required after V23 implementation:

1. Focused V23:

   ```sh
   pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v23-gate-a-contract.test.ts --maxWorkers=1
   ```

2. Continuity with Gate C, Gate A, Gate B, and company blockers.
3. Run `pnpm calculator:gate:current`.
4. Run `git diff --check`.
