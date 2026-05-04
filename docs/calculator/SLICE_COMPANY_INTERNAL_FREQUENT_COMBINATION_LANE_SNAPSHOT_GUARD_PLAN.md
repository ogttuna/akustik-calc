# Slice Plan - Company Internal Frequent Combination Lane Snapshot Guard

Slice id: `company_internal_frequent_combination_lane_snapshot_guard_v1`

Status: CLOSED NO-RUNTIME / V22 NEXT

Selected by:

`calculator_source_gap_revalidation_v21` Gate A

Selection status:

`selected_company_internal_frequent_combination_lane_snapshot_guard_after_v21_consumed_field_output_guard_and_kept_rockwool_source_blocked`

Landed Gate A file:

`packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`

Landed Gate A action:

`gate_a_pin_company_internal_frequent_combination_lane_snapshot_matrix_no_runtime`

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_A_HANDOFF.md`

Gate A status:

`company_internal_frequent_combination_snapshot_matrix_landed_no_runtime_selected_visible_gate_b`

Selected Gate B file:

`apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`

Selected Gate B action:

`gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime`

Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_B_HANDOFF.md`

Gate B status:

`company_internal_frequent_combination_visible_guard_landed_no_runtime_selected_gate_c_closeout`

Selected Gate C file:

`packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`

Selected Gate C action:

`gate_c_no_runtime_closeout_and_next_slice_selection`

Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_COMPANY_INTERNAL_FREQUENT_COMBINATION_LANE_SNAPSHOT_GUARD_GATE_C_CLOSEOUT_HANDOFF.md`

Gate C status:

`closed_company_internal_frequent_combination_lane_snapshot_guard_no_runtime_and_selected_source_gap_revalidation_v22`

Selected next slice:

`calculator_source_gap_revalidation_v22`

Selected V22 file:

`packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`

Selected V22 action:

`gate_a_revalidate_source_accuracy_gap_order_after_company_internal_snapshot_guard_closeout`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V21_GATE_A_HANDOFF.md`

## Objective

Create a no-runtime company-internal snapshot guard for frequent wall
and floor combinations before any high-accuracy internal opening. The
guard must catch wrong lane / wrong source / overconfident output
posture early by pinning current family, strategy, support, confidence,
source or origin, warnings, and visible route/output posture for common
stacks.

This slice exists because the project can pass tests while still being
unsafe to market as high-accuracy if common combinations silently fall
into the wrong lane, promote a near-source row, or show finite
screening/field-continuation values too confidently.

## Gate A Landed

Gate A added the no-runtime
`company_internal_frequent_combination_snapshot_matrix` executable
contract. It pins the current family, strategy, support, confidence,
source/origin, warnings, and intended visible posture for frequent
wall/floor combinations. It intentionally does not change runtime
values, support, confidence, evidence, API behavior, route-card values,
output-card status, proposal/report copy, or workbench-input behavior.

Gate A artifacts now present:

- `company_internal_frequent_combination_snapshot_matrix`
- `rockwool_triple_leaf_screening_and_flat_swap_negative_rows`
- `ordinary_lsf_timber_layer_swap_snapshot_rows`
- `masonry_lined_massive_boundary_snapshot_rows`
- `floor_role_inference_duplicate_stack_snapshot_rows`
- `near_source_alias_and_hostile_input_negative_rows`
- `field_outputs_never_design_grade_without_owner`
- `selected_gate_b_visible_or_api_guard_or_no_runtime_closeout`

Rockwool triple-leaf remains not fixed: grouped split-rockwool is still
`Rw 41`, `multileaf_screening_blend`, low confidence, screening only,
not exact, and not source-validated. Uris 2006 remains
`paused_waiting_rights_safe_source_packet`.

Gate A also carries forward the
`standing_lane_misclassification_monitoring_mandate`: every future
implementation pass must keep looking for wrong lane / wrong source /
false exact promotion / field-output leakage in common combinations.
When suspicious behavior appears, follow `note_test_document_or_easy_fix`:
note it, test the repro, document it if it is not immediately fixable,
and only apply a bounded easy fix when the contract is clear.

## Gate B Must Produce

Gate B must make the Gate A snapshot posture visible in web route/output
coverage before any company-internal high-accuracy opening decision.

Selected Gate B file:

`apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`

Selected Gate B action:

`gate_b_add_company_internal_visible_route_output_snapshot_guard_no_runtime`

Gate B must prove frequent rockwool triple-leaf, flat-list swap,
ordinary double-leaf/stud, lined-massive boundary, raw floor role
prompt, near-source alias, hostile input, and field-output continuation
states do not look exact or design-grade in the UI when their engine
posture is screening, fail-closed, needs-input, or context-only.

## Gate B Landed

Gate B added
`apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`
with the `company_internal_visible_route_output_snapshot_guard`. It
keeps runtime values, support, confidence, evidence, API behavior,
route-card values, output-card status, proposal/report copy, and
workbench-input behavior frozen.

Gate B artifacts now present:

- `rockwool_triple_leaf_visible_screening_not_fixed`
- `flat_list_swap_visible_fail_closed`
- `ordinary_double_leaf_stud_lined_boundary_visible_negatives`
- `raw_floor_role_prompt_and_exact_raw_parity_visible_split`
- `near_source_alias_visible_context_only`
- `hostile_input_visible_no_numeric_estimate`
- `field_outputs_never_design_grade_without_owner`

Gate B selected Gate C no-runtime closeout and next-slice selection:

`packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`

`gate_c_no_runtime_closeout_and_next_slice_selection`

## Gate C Landed

Gate C added
`packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`
and closed this slice no-runtime. It keeps runtime values, support,
confidence, evidence, API behavior, route-card values, output-card
status, proposal/report copy, and workbench-input behavior frozen.

Gate C artifacts now present:

- `company_internal_gate_c_closeout_summary`
- `rockwool_rw41_screening_and_uris_packet_status`
- `frequent_combination_guard_green_carry_forward`
- `field_output_near_source_hostile_input_and_curve_provenance_status`
- `repeat_uris_acquisition_blocked_without_new_packet`
- `company_internal_high_accuracy_opening_still_blocked`
- `selected_next_slice_with_target_file_and_validation_scope`

Gate C selected `calculator_source_gap_revalidation_v22` because Gate
A/B made frequent-combination posture visible but no source-ready
runtime candidate or direct rockwool exact fix exists. V22 must re-rank
rockwool/Uris, remaining visible/API guardrails, near-source aliases,
hostile inputs, field-output owner status, and company opening blockers.

## Required Snapshot Cells

The first matrix should cover at least these risk families:

1. rockwool / gypsum / MLV triple-leaf grouped topology and equivalent
   flat-list adjacent swaps;
2. ordinary steel-stud and timber double-board stacks with small layer
   reorder or duplicate-stack perturbations;
3. masonry / lined-massive boundary hybrids including AAC, pumice,
   concrete, board / fill / gap, and furring-like combinations;
4. raw floor stacks without role tags, duplicate impact layers, and
   excessive layers;
5. near-source alias rows such as rockwool vs glass-fiber, generic
   gypsum vs Type C, MLV vs plaster, and manufacturer rows without
   owned mapping/tolerance;
6. hostile API/import payloads: NaN, Infinity, negative thickness,
   unknown material, missing layer id, and very large layer count.

## Non-Promotion Rules

- Do not mark `Rw 41` rockwool triple-leaf fixed unless source packet,
  grouped topology, material mapping, metric/tolerance, negative
  boundaries, and paired visible tests all exist.
- Do not treat the field-output copy guard as a field-output owner.
- Do not promote Knauf, British Gypsum, NRC-like, USG, National Gypsum,
  Georgia-Pacific, PABCO, CertainTeed, ROCKWOOL, or similar rows from
  near-source context to runtime exact without topology/material/metric/
  tolerance/negative-boundary/visible-test ownership.
- Do not claim arbitrary raw floor reorder invariance while raw role
  inference is still a documented risk.
- Do not smooth or retune formulas just to make a snapshot look better;
  if a snapshot exposes nonsense, document the repro and select a
  bounded fix gate.

## Validation

Gate A completed:

1. create
   `packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts`;
2. pin frequent wall/floor family, strategy, support, confidence,
   source/origin, warnings, and visible posture snapshots;
3. preserve runtime values, support, confidence, evidence, API,
   route-card, output-card, proposal/report, and workbench-input
   behavior.

Gate A validation completed on 2026-05-04:

- focused Gate A passed 1 file / 8 tests;
- engine continuity passed 7 files / 50 tests;
- web continuity passed 4 files / 15 tests;
- `pnpm calculator:gate:current` passed with engine 243 files / 1404
  tests, web 50 files / 238 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green.

Gate B completed:

1. create
   `apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts`;
2. assert route/output posture for the Gate A matrix rows;
3. keep runtime values frozen unless a later bounded implementation gate
   is explicitly selected.

Gate B validation completed on 2026-05-04:

- focused web validation passed 1 file / 8 tests;
- engine continuity passed 7 files / 50 tests;
- web continuity passed 6 files / 27 tests;
- `pnpm calculator:gate:current` passed with engine 243 files / 1404
  tests, web 51 files / 246 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- `git diff --check` passed.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`.

Gate C completed:

1. create
   `packages/engine/src/post-company-internal-frequent-combination-lane-snapshot-guard-v1-next-slice-selection-contract.test.ts`;
2. close this slice no-runtime;
3. re-rank rockwool source closure, frequent-combination guardrails,
   source promotion ownership, hostile API/import guardrails, and any
   newly discovered lane/output drift;
4. select the next bounded implementation or research gate without
   promoting exact runtime values unless source/topology/material/
   metric/tolerance/negative-boundary/visible-test ownership exists.

Gate C validation completed on 2026-05-04:

- focused Gate C passed 1 file / 6 tests;
- engine continuity passed 6 files / 38 tests;
- `pnpm calculator:gate:current` passed with engine 244 files / 1410
  tests, web 51 files / 246 passed + 18 skipped, repo build 5 / 5
  tasks, and whitespace guard green;
- `pnpm check` passed with lint/typecheck clean, engine 377 files /
  2230 tests, web 163 files / 919 passed + 18 skipped, and build
  5 / 5 tasks;
- `git diff --check` passed after restoring `apps/web/next-env.d.ts` to
  `.next-typecheck`.

Known non-fatal `sharp/@img` warnings remain through
`@turbodocx/html-to-docx`. `pnpm check` must still be rerun before any
future company-internal high-accuracy handoff.

Required for V22:

1. create
   `packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts`;
2. re-rank using `company_internal_gate_c_closeout_summary`,
   `rockwool_rw41_screening_and_uris_packet_status`,
   `frequent_combination_guard_green_carry_forward`,
   `field_output_near_source_hostile_input_and_curve_provenance_status`,
   and `company_internal_high_accuracy_opening_blocker_status`;
3. preserve `standing_lane_misclassification_monitoring_mandate` and
   `note_test_document_or_easy_fix`;
4. keep `repeat_uris_acquisition_blocked_without_new_packet` active
   unless a new rights-safe packet or authorized source-owned payload
   arrives.
