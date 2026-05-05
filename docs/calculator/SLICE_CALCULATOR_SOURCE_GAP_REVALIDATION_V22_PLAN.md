# Slice Plan - Calculator Source Gap Revalidation V22

Slice id: `calculator_source_gap_revalidation_v22`

Status: GATE A LANDED / SELECTED FIELD OUTPUT OWNER NEXT

Selected by:

`company_internal_frequent_combination_lane_snapshot_guard_v1` Gate C

Selection status:

`closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22`

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout`

Landed Gate A status:

`selected_field_output_owner_design_grade_policy_after_v22_confirmed_rockwool_source_blocked_and_company_snapshot_green`

Landed Gate A file:

`packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`

Landed Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V22_GATE_A_HANDOFF.md`

Selected next slice:

`field_output_owner_and_design_grade_policy_v1`

Selected next file:

`packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts`

Selected next action:

`gate_a_inventory_field_output_owner_design_grade_policy_after_v22_rerank`

Selected next planning surface:

`docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Selection validation:

Company Gate C validation completed on 2026-05-04. Focused Gate C
passed 1 file / 6 tests; engine continuity passed 6 files / 38 tests;
`pnpm calculator:gate:current` passed with engine 244 files / 1410
tests, web 51 files / 246 passed + 18 skipped, repo build 5 / 5 tasks,
and whitespace guard green; `pnpm check` passed with lint/typecheck
clean, engine 377 files / 2230 tests, web 163 files / 919 passed + 18
skipped, and build 5 / 5 tasks; `git diff --check` passed after
restoring the generated `apps/web/next-env.d.ts` route-type reference
to `.next-typecheck`. Known non-fatal `sharp/@img` warnings remain
through `@turbodocx/html-to-docx`.

Gate A validation completed on 2026-05-05. Focused V22 Gate A passed 1
file / 7 tests; engine continuity passed 8 files / 52 tests; web
continuity passed 4 files / 22 tests; `pnpm calculator:gate:current`
passed with engine 245 files / 1417 tests, web 51 files / 246 passed +
18 skipped, repo build 5 / 5 tasks, and whitespace guard green. Broad
`pnpm check` passed after the V22 test typecheck issue was fixed:
lint/typecheck clean, engine full suite 378 files / 2237 tests, web
full suite 163 files / 919 passed + 18 skipped, and repo build 5 / 5
tasks.

## Objective

Re-rank the source/accuracy backlog after the company-internal
frequent-combination engine and web guards closed no-runtime. V22 must
decide the next bounded source/accuracy step without hiding the original
rockwool triple-leaf defect and without opening company-internal
high-accuracy use prematurely.

## Inputs From The Closed Guard

`company_internal_gate_c_closeout_summary`

Gate A/B pinned frequent combination engine and web route/output
posture. This is a guard against wrong lane and false exact promotion,
not runtime evidence.

`rockwool_rw41_screening_and_uris_packet_status`

Rockwool triple-leaf remains not fixed: grouped split-rockwool is still
`Rw 41`, `multileaf_screening_blend`, low confidence, screening only,
not exact, and not source-validated. Uris 2006 remains
`paused_waiting_rights_safe_source_packet`.

`repeat_uris_acquisition_blocked_without_new_packet`

Gate U already confirmed Uris 2006 identity and no rights-safe local or
authorized source-owned curve payload. Do not repeat Uris acquisition
unless a new rights-safe packet, page image, authorized TDM payload, or
numeric band-vector packet exists.

`frequent_combination_guard_green_carry_forward`

Carry forward grouped/flat rockwool, ordinary double-leaf/stud,
lined-massive boundary, raw floor role prompt, near-source alias,
hostile input, and field-output continuation guards.

`field_output_near_source_hostile_input_and_curve_provenance_status`

V22 must keep field outputs from looking design-grade without an owner,
must keep near-source rows context-only without mapping/tolerance, must
keep hostile inputs fail-closed, and must require source curve
provenance before any graph-derived runtime path.

`company_internal_high_accuracy_opening_still_blocked`

The calculator can be used only as controlled/caveated internal
screening while these blockers remain. It cannot be described as
company-internal high-accuracy ready until
`pre_company_internal_use_exit_criteria` close.

## Candidate Order For Gate A

Gate A must compare at least:

1. rockwool/Uris source-owned closure or packet-intake readiness;
2. remaining frequent-combination visible/API guardrail gaps;
3. near-source material alias/source promotion ownership;
4. hostile API/import guardrails;
5. field-output owner and design-grade policy;
6. productization/report polish only after correctness blockers are
   controlled.

No candidate may select exact runtime promotion unless topology,
material mapping, metric context, tolerance ownership, negative
boundaries, source/curve provenance, and paired engine/web/report tests
all exist.

## Implementation Check - 2026-05-05

Current repo state after re-reading the active docs and implementation:

- `packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`
  now exists and lands V22 Gate A no-runtime.
- `packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`
  exists and selects V22 with the expected target file and action.
- `tools/dev/run-calculator-current-gate.ts` includes company Gate C,
  Gate B, Gate A, V21, V20, Uris Gate U, field-output Gate A, the
  company blocker, the route/source risk-register contracts, and V22
  Gate A.
- Fresh `pnpm calculator:gate:current` on 2026-05-05 passed: engine
  244 files / 1410 tests, web 51 files / 246 passed + 18 skipped, repo
  build 5 / 5 tasks, and whitespace guard green. Known non-fatal
  `sharp/@img` warnings remain through `@turbodocx/html-to-docx`.
- The current active authority files agree on V22. Some long-form
  historical/backlog documents still carry older resume-order notes;
  they are backlog context only and must not override
  `NEXT_IMPLEMENTATION_PLAN.md`, this V22 plan, the Gate C checkpoint,
  or `AGENTS.md`.

V22 Gate A selects
`field_output_owner_and_design_grade_policy_v1` because Rockwool exact
runtime is still source-blocked, the current frequent-combination guard
cells are green, and field-output design-grade ownership is the next
actionable no-runtime correctness boundary.

## Detailed Gate A Plan

Gate A should be a no-runtime source/accuracy re-rank contract unless
it discovers a narrow bug that can be fixed with complete local
ownership and focused tests. The default output is a selected next slice
or closeout file, not a hidden runtime retune.

1. Create
   `packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`.
2. Import only stable local helpers needed to prove current posture,
   following nearby source-gap revalidation contracts:
   `calculateAssembly`, shared types, `existsSync` / `readFileSync`,
   and any existing triple-leaf/source-packet evaluators if they reduce
   duplicated fixture logic.
3. Define a V22 Gate A status object that freezes runtime, support,
   confidence, evidence, API shape, route-card values, output-card
   statuses, proposal/report copy, and workbench-input behavior unless
   a bounded fix is explicitly selected and tested.
4. Define a candidate matrix with at least these ordered rows:
   `rockwool_uris_source_owned_closure_or_packet_intake`,
   `remaining_frequent_combination_visible_api_guardrails`,
   `near_source_alias_source_promotion_ownership`,
   `hostile_api_import_guardrails`,
   `field_output_owner_and_design_grade_policy`, and
   `productization_report_polish_after_correctness_blockers`.
5. For every candidate, assert `runtimeImportReadyNow: false` unless it
   names exact topology, material mapping, metric context, tolerance,
   negative boundaries, source/curve provenance, and paired
   engine/web/report tests.
6. Recompute the live grouped split-rockwool and flat-list swap
   snapshots in the test. The grouped row must remain `Rw 41`,
   `multileaf_screening_blend`, low confidence, screening-only, not
   exact, and not source-validated; the flat-list swap must remain
   `multileaf_screening_blend_fail_closed_until_grouped_topology`.
7. Carry forward Uris 2006 as
   `paused_waiting_rights_safe_source_packet` and assert that repeating
   acquisition is blocked without a new rights-safe source packet,
   authorized TDM payload, page image, numeric band-vector packet, or
   source-owned curve payload.
8. Assert that field outputs remain continuations, not design-grade
   field measurements, unless a later owner names the field metric,
   source, tolerance, and visible/report copy tests.
9. Assert that hostile API/import inputs stay fail-closed and that
   near-source material aliases stay context-only without owned mapping
   and tolerance boundaries.
10. Select exactly one next bounded step and name its target file,
    validation scope, and non-promotion rules.

## External Source Check - 2026-05-05

The Uris 2006 identity and access signals were rechecked before
detailing Gate A. This does not change Gate U or V22 runtime readiness.

Known public/authorized-access signals:

- DOI route:
  `https://doi.org/10.1016/j.apacoust.2005.11.006`
- ScienceDirect article page / PII:
  `https://www.sciencedirect.com/science/article/pii/S0003682X05001799`
- OpenDevEd metadata mirror:
  `https://docs.opendeved.net/lib/2ZBKZEYN`
- Elsevier text-and-data-mining user license route:
  `https://www.elsevier.com/tdm/userlicense/1.0/`

Gate A must treat these as identity, metadata, and authorized-access
routing signals only. They are not a rights-safe source-owned runtime
packet. They do not provide, inside this repo, a usable page image,
table/figure locator, octave/third-octave band vector, digitized curve,
rating/tolerance owner, local rockwool/gypsum/MLV/plaster material
mapping, or paired engine/web/report validation.

Therefore `repeat_uris_acquisition_blocked_without_new_packet` remains
active. A future Uris/equivalent-source step is allowed only when the
new input is a concrete rights-safe packet, authorized TDM payload,
page-image packet, numeric band-vector packet, or source-owned curve
payload that can be committed or referenced under its actual rights
boundary.

## Gate A Candidate Decision Table - 2026-05-05

V22 Gate A should encode the following candidate table in data, then
assert the ordering and selection rules.

`rockwool_uris_source_owned_closure_or_packet_intake`

- Current proof: Gate C, V21, Uris Gate U, and the company blocker all
  agree that grouped split-rockwool is still `Rw 41`,
  `multileaf_screening_blend`, low confidence, screening-only, not
  exact, and not source-validated. The flat-list swap stays
  `multileaf_screening_blend_fail_closed_until_grouped_topology`.
- Missing ownership: rights-safe Uris 2006 or equivalent curve packet,
  page/table/figure locator, band-vector or digitization payload,
  curve identity, rating metric, tolerance owner, local material
  mappings, negative boundaries, and paired engine/web/report tests.
- Gate A decision: keep as the highest visible accuracy blocker, but do
  not select an exact runtime import unless the missing ownership list
  is complete. Do not repeat source acquisition from metadata only.

`remaining_frequent_combination_visible_api_guardrails`

- Current proof: company Gate A/B/C cover the current engine and web
  frequent-combination cells for grouped/flat rockwool, ordinary double
  leaf/stud, lined-massive boundary, raw floor role prompt,
  near-source alias, hostile input, and field-output continuation
  surfaces.
- Missing ownership: any still-uncovered public API, import, proposal,
  report, or route-card path that can show false exactness or wrong
  lane while bypassing the current visible guards.
- Gate A decision: select this only if V22 names a concrete uncovered
  path and target file. Otherwise carry it as green-but-standing
  monitoring.

`near_source_alias_source_promotion_ownership`

- Current proof: near-source manufacturer/material rows are context
  only and do not fix Uris 2006 or promote rockwool exactness.
- Missing ownership: row-specific source identity, material alias
  mapping, metric context, tolerance, and negative-boundary tests.
- Gate A decision: keep context-only unless a bounded false-promotion
  bug is reproduced.

`hostile_api_import_guardrails`

- Current proof: existing guards require hostile API/import payloads to
  fail closed and not produce design-grade numeric claims.
- Missing ownership: a named uncovered input route or serialization
  shape that bypasses the current fail-closed behavior.
- Gate A decision: do not select a standalone hostile-input slice
  unless V22 finds that concrete uncovered route.

`field_output_owner_and_design_grade_policy`

- Current proof: field-output Gate A/B made finite `R'w`, `DnT,w`,
  `L'n,w`, and `L'nT,w` values visible as continuations from the
  active lab/screening/apparent/bound basis, not independent exact
  field measurements.
- Missing ownership: field metric owner, source basis, tolerance,
  report copy, and route/output visible tests for design-grade use.
- Gate A decision: selected as
  `field_output_owner_and_design_grade_policy_v1`, a policy/visibility
  owner step, not source evidence for exact runtime promotion. It stays
  blocked for company high-accuracy opening until Gate A/B close with
  owner, tolerance, and visible/report tests.

`productization_report_polish_after_correctness_blockers`

- Current proof: productization remains secondary because the calculator
  still carries active correctness blockers.
- Missing ownership: closure or explicit visible screening posture for
  rockwool triple-leaf, field-output owner, frequent lane snapshots,
  source-promotion ownership, hostile-input green status, and full gate
  validation.
- Gate A decision: do not select before correctness blockers are either
  fixed or intentionally exposed as screening-only in every relevant
  output surface.

## Executable Gate A Test Shape

The first implementation step is still this file:

`packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`

Expected test cases:

1. `lands V22 Gate A no-runtime after company internal snapshot guard`
   should assert the selected status, prior Gate C checkpoint, frozen
   runtime/API/route/output/report/workbench behavior, and required V22
   artifacts.
2. `re-ranks source and accuracy candidates without exact promotion`
   should assert the candidate table above and require every runtime
   candidate to name topology, material mapping, metric context,
   tolerance, negative boundaries, source/curve provenance, and paired
   tests before `runtimeImportReadyNow` can become true.
3. `keeps rockwool grouped triple-leaf and flat-list swap blocked`
   should recompute the live grouped and flat-list rockwool snapshots
   and prove the `Rw 41` screening / flat-list fail-closed posture is
   still current evidence, not an exact fix.
4. `keeps Uris 2006 acquisition blocked without a new rights-safe
   packet` should assert the DOI/PII identity while rejecting metadata,
   article pages, mirrors, and authorized-access routes as runtime
   packets.
5. `carries forward field-output near-source hostile-input blockers`
   should assert field outputs as continuations, near-source aliases as
   context-only, and hostile API/import rows as fail-closed.
6. `keeps company-internal high-accuracy opening blocked` should assert
   `pre_company_internal_use_exit_criteria` remains open.
7. `keeps active docs aligned with V22` should read
   `NEXT_IMPLEMENTATION_PLAN.md`, this plan, and the Gate C checkpoint
   for the selected status, target file, Uris blocked state, and
   non-promotion rules.

## Gate A Done Criteria

Gate A is done only when all of the following are true:

- the V22 Gate A contract exists and passes focused validation;
- no runtime value, support, confidence, evidence, API, route-card,
  output-card, proposal/report, or workbench-input behavior moved unless
  a bounded fix was explicitly selected and tested;
- the candidate table selects exactly one next bounded step with a
  target file, validation scope, and non-promotion rules;
- the selected next step does not call rockwool triple-leaf fixed unless
  the full source/tolerance/material/negative-boundary/visible-test
  ownership chain exists;
- `tools/dev/run-calculator-current-gate.ts` is updated to include the
  V22 Gate A file after it is created;
- the active docs and checkpoint references agree on the next selected
  file and action.

## Suspicious Result Handling Rule

Every implementation pass from V22 onward must keep looking for wrong
lane, wrong source, false exact promotion, field-output leakage, and
hostile-input leakage in common wall/floor combinations.

When a suspicious result appears:

- If it is a narrow deterministic bug that can be fixed within the
  current selected scope with owned inputs and focused engine/web tests,
  add the test first, apply the bounded fix, and document the runtime or
  visible surface that moved.
- If it requires source evidence, tolerance ownership, material mapping,
  field-output ownership, or broader UI/report coverage, do not patch it
  opportunistically. Add it to the V22 candidate matrix or selected
  follow-up with a concrete target file and validation scope.
- If it is merely surprising but not yet classified, preserve
  `standing_lane_misclassification_monitoring_mandate` and apply
  `note_test_document_or_easy_fix`: note it, reproduce it, test it if
  possible, document it if not immediately fixable, and only select a
  bounded easy fix when the contract is clear.

## Required Gate A Artifacts

- `company_internal_gate_c_closeout_summary`
- `rockwool_rw41_screening_and_uris_packet_status`
- `frequent_combination_guard_green_carry_forward`
- `field_output_near_source_hostile_input_and_curve_provenance_status`
- `company_internal_high_accuracy_opening_blocker_status`
- `selected_next_slice_with_target_file_and_validation_scope`

## Non-Promotion Rules

- Do not mark `Rw 41` rockwool triple-leaf fixed.
- Do not retry Uris acquisition without a new rights-safe packet.
- Do not promote NRC-like, Knauf, British Gypsum, ROCKWOOL, USG,
  National Gypsum, Georgia-Pacific, PABCO, CertainTeed, or similar rows
  from context to exact runtime without row-specific ownership.
- Do not let finite `R'w`, `DnT,w`, `L'n,w`, or `L'nT,w` values look
  design-grade without a field-output owner.
- Keep `standing_lane_misclassification_monitoring_mandate` and
  `note_test_document_or_easy_fix` active for every new suspicious
  common-combination result.

## Validation Plan

Required after Gate A implementation:

1. Focused V22 Gate A test:

   ```sh
   pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts --maxWorkers=1
   ```

2. Engine continuity with the current blockers and handoffs:

   ```sh
   pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts src/company-internal-misclassification-readiness-blocker-contract.test.ts src/calculator-route-source-risk-register-contract.test.ts src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts --maxWorkers=1
   ```

3. Web continuity if V22 touches visible route/output/report behavior
   or selects a visible follow-up:

   ```sh
   pnpm --filter @dynecho/web exec vitest run features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts --maxWorkers=1
   ```

4. Add the V22 Gate A file to
   `tools/dev/run-calculator-current-gate.ts` after the file exists.
5. Run `pnpm calculator:gate:current`.
6. Run `git diff --check`.
7. Run `pnpm check` before any company-internal high-accuracy handoff
   or broad shared/API/web movement.
