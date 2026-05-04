# Slice Plan - Floor Tolerance-Edge Promotion Guard

Slice id: `floor_tolerance_edge_promotion_guard_v1`

Status: GATE B CLOSED NO-RUNTIME / SOURCE-GAP V19 SELECTED

Selected by:

`calculator_source_gap_revalidation_v18` Gate A

Selection status:

`selected_floor_tolerance_edge_promotion_guard_after_v18_rerank_found_no_source_ready_runtime_candidate_and_common_combination_sentinel_closed`

Selected first file:

`packages/engine/src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`

Selected first action:

`gate_a_inventory_exact_floor_tolerance_edges_no_runtime`

Landed Gate A status:

`floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`

Selected next file:

`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_b_no_runtime_closeout_and_next_slice_selection`

Landed Gate B status:

`floor_tolerance_edge_gate_b_closeout_summary`

`closed_floor_tolerance_edge_promotion_guard_no_runtime_and_selected_source_gap_revalidation_v19`

Gate B implementation file:

`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`

Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT_HANDOFF.md`

Selected next implementation slice:

`calculator_source_gap_revalidation_v19`

Selected next first file:

`packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_PLAN.md`

Gate B closeout kept runtime, support, confidence, evidence, API,
route-card, output-card, proposal/report, and workbench-input behavior
frozen. Exact/bound `+2 mm` and `+2.1 mm` tolerance edges stayed
protected with
`gate_b_exact_bound_edges_remained_protected_no_support_promotion`,
raw-role and duplicate-role negatives remained closed, and direct
`officialFloorSystemId` stayed a known-row bypass rather than layer-match
proof.

Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_A_HANDOFF.md`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V18_GATE_A_HANDOFF.md`

Selection validation completed on 2026-05-04: focused v18 Gate A passed
1 file / 9 tests; continuity passed 9 files / 67 tests; `pnpm
calculator:gate:current` passed engine 234 files / 1342 tests, web 49
files / 234 passed + 18 skipped, repo build 5 / 5 successful with
known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
restored to `.next-typecheck`; final `git diff --check` passed.

## Objective

Inventory exact and bound floor rows near tolerance edges before any new
floor support, confidence, evidence, field-output, output-card,
route-card, proposal/report, or workbench-input promotion.

This slice exists because the raw floor role prompt guard and the
common-combination lane sentinel are now active, but exact/bound floor
matching still needs explicit just-inside / just-outside tolerance
corridor tests and visible support wording before future floor rows are
promoted.

Gate A did not move runtime behavior.

## Gate B Closeout Plan - 2026-05-04 Planning Pass, Now Closed

`gate_b_closeout_file_currently_absent_and_next_to_create`

`wrong_measurement_triage_loop`

`frequent_combination_lane_suspicion_reproduce_trace_document_or_bounded_fix`

`external_source_research_deferred_until_source_acquisition_gate_or_source_packet`

`exact_promotion_requires_source_topology_material_metric_tolerance_negative_visible_proof`

The selected next file
`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`
has now landed. Gate B closed this slice no-runtime because it did not
prove a small, bounded floor tolerance / support wording fix that could
justify behavior movement.

Gate B must explicitly decide and document:

- whether any just-inside / just-outside exact or bound floor tolerance
  edge can be promoted without making a finite screening value look
  source-validated;
- whether route-card and output-card wording still clearly separates
  exact floor rows, bound-only floor rows, and screening/family
  estimates;
- whether raw floor role inference, duplicate roles, hostile API/import
  input, and field-output leakage remain blocked;
- whether no-runtime closeout should select the next source-gap
  revalidation rather than a source acquisition or runtime movement.

Wrong-measurement caution for this slice: if a frequent floor
combination changes exact/bound/screening lane after a small thickness,
role, duplicate-stack, or layer-order edit, reproduce the case in the
contract before changing behavior. If it is already fail-closed or
low-confidence, document it as such. If the easy fix is not bounded and
paired with visible tests, do not implement it in Gate B.

No internet/source research is required before this Gate B closeout
because the current decision is not a source-row acquisition. External
research starts only if the closeout selects a source-acquisition gate
or a rights-safe source packet/source locator arrives.

## Gate B Contract Blueprint - Follow-Up Planning Pass

Implementation surfaces inspected:

`inspected_floor_exact_bound_implementation_surfaces`

`gate_b_contract_blueprint_snapshot_matrix`

`exact_bound_screening_visible_surface_parity_check`

`contiguous_duplicate_vs_disjoint_duplicate_role_boundary`

`current_gate_runner_must_include_gate_b_after_creation`

`source_gap_revalidation_v19_candidate_after_floor_closeout`

`no_internet_research_before_gate_b_selects_source_acquisition`

Gate B should create
`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`
with a closeout shape similar to prior no-runtime closeout contracts,
but grounded in the floor implementation:

- use `floor-system-evaluation.ts` as the tolerance/topology source of
  truth: `THICKNESS_TOLERANCE_MM`, split single-entry role schedules,
  ambiguous single-entry role topology, and merge-safe packed role
  behavior;
- use `floor-system-match.ts` and `bound-floor-system-match.ts` for
  exact row vs official bound-only precedence;
- use `impact-lane.ts`, `floor-system-ratings.ts`, and
  `calculate-assembly.ts` for impact/lower-bound/floor-carrier/output
  support and warning assertions;
- use `impact-result-panel.tsx` and `simple-workbench-evidence.ts` as
  the visible wording/evidence surfaces that must not make screening or
  bound-only values look exact.

Required Gate B assertions:

1. Exact inside / exact just-outside snapshots remain as Gate A pinned
   them; just-outside exact rows must stay family/screening, not exact.
2. Bound inside / bound just-outside snapshots remain as Gate A pinned
   them; just-outside bound rows must stay bound-interpolation or
   family/screening, not official bound match.
3. Disjoint duplicate schedules stay blocked from exact and bound-only
   lanes even when the total thickness remains close; contiguous
   merge-safe packed same-material schedules must be named separately so
   future tests do not flatten both cases into one rule.
4. Raw role prompt, duplicate role, hostile API/import, material alias,
   field-output leakage, and curve-provenance boundaries remain closed.
5. Visible warning/evidence wording keeps exact family, official
   bound-only, published family estimate, and low-confidence/screening
   lanes visibly distinct.
6. Once the Gate B file exists, `tools/dev/run-calculator-current-gate.ts`
   must include it. This avoids a green current gate that silently skips
   the active selected closeout.
7. If no bounded fix is selected, close no-runtime and select the next
   source-gap rerank. `calculator_source_gap_revalidation_v19` is the
   natural candidate name after v18, but Gate B must explicitly select
   or reject it in the contract.

### Gate B Preflight Fixture Map

Second-pass implementation read:

`gate_b_preflight_exact_bound_fixture_map`

`gate_b_plus_2mm_inside_plus_2p1mm_outside_boundary`

`direct_floor_system_id_bypass_is_not_layer_match_promotion`

`field_context_warning_copy_not_field_metric_promotion`

`gate_b_validation_order_engine_contract_then_runner_then_current_gate`

`web_visible_changes_deferred_until_gate_b_selects_bounded_fix`

The closeout should start with the smallest source-owned fixtures, not a
new broad fixture generator:

- Exact edge: `tuas_x3_clt140_measured_2026`, `base_structure`,
  CLT `140 mm`. `+2 mm` is still inside
  `THICKNESS_TOLERANCE_MM` and must remain exact (`Rw 49`, `Ln,w 52`,
  `open_measured_floor_system_exact_match`). `+2.1 mm` is outside and
  must drop to `family_general` with no exact `floorSystemMatch`.
- Bound edge: `ubiq_fl33_open_web_steel_300_lab_2026`,
  `base_structure`, open-web steel `300 mm`. `+2 mm` must remain the
  official bound-only row (`Rw 63`, `Ln,w upper bound 51`,
  `official_floor_system_bound_support`). `+2.1 mm` must become
  `bound_interpolation` with
  `predictor_lightweight_steel_bound_interpolation_estimate`.
- Raw-role prompt: raw `tuas_x4_clt140_measured_2026` must not promote
  impact or field outputs before role ownership is explicit.
- Duplicate-role boundary: raw `tuas_r7b_open_box_timber_measured_2026`
  must remain `family_general` when single-entry roles are duplicated.

`officialFloorSystemId` direct resolution is not layer-scored matching.
Gate B may assert the bypass remains explicit, but it must not use that
path as evidence that an ambiguous layer list qualifies for exact or
bound support. Field-context warning checks are also not field-metric
source ownership; they only prove that visible copy stays honest when
the required field inputs are supplied.

Gate B validation order:

1. Create the engine closeout contract and run it with Gate A, v18, and
   the route/source risk-register contract.
2. Add the new Gate B file to `tools/dev/run-calculator-current-gate.ts`.
3. Run `pnpm calculator:gate:current`.
4. Keep web visible behavior frozen unless the closeout explicitly
   selects a bounded visible wording fix with paired tests.

### Gate B Implementation Cross-Check

Third-pass implementation read:

`gate_b_implementation_cross_check_passed`

`gate_b_file_absent_runner_absent_by_design_until_creation`

`gate_a_fixture_ids_verified_in_catalog_and_existing_tests`

`packed_same_role_merge_safe_but_split_single_entry_schedules_blocked`

`official_floor_system_id_bypass_must_not_seed_layer_match_proof`

`gate_b_no_external_research_needed_until_source_acquisition_selected`

`gate_b_next_steps_order_contract_runner_current_gate_then_rerank`

`targeted_gate_a_v18_risk_register_validation_green`

Concrete read results:

- The Gate B file is absent; this is the intended next implementation
  gap, not a hidden runtime defect.
- The current-gate runner includes v18 Gate A, floor tolerance Gate A,
  and the route/source risk register. Add Gate B to the runner as soon
  as the file exists.
- The fixture ids in the preflight map are present in the catalogs and
  already exercised by Gate A and floor-family regression coverage.
- Packed same-role duplicates can be merge-safe when contiguous and
  material-consistent. Split/disjoint single-entry role schedules are
  separately blocked from exact and bound matching; Gate B must not
  collapse these cases into one duplicate rule.
- Direct `officialFloorSystemId` resolution is an explicit known-row
  bypass. It is useful for preset/direct-id behavior but cannot prove
  that an ambiguous layer list earned layer-scored exact support.
- External internet/source research remains deferred. Gate B is about
  closeout/rerank and visible honesty around existing rows, not about
  acquiring new source rows.

Targeted validation for this planning pass passed:
`floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts`,
`calculator-source-gap-revalidation-v18-gate-a-contract.test.ts`, and
`calculator-route-source-risk-register-contract.test.ts` passed 3 files
/ 21 tests; `git diff --check` passed.

### Broad Audit Confirmation

Follow-up broad audit on 2026-05-04:

`broad_check_2026_05_04_toolbar_copy_alignment_passed`

`full_check_found_toolbar_copy_test_drift_not_calculator_runtime_drift`

`wrong_lane_broad_suites_green_no_runtime_movement_selected`

`gate_b_closeout_remains_first_implementation_step_after_broad_check`

`rockwool_uris_status_unchanged_after_broad_check`

Full `pnpm check` passed after the stale toolbar-copy snapshot was
updated to the current labels. Treat that as UI test maintenance, not
calculator behavior movement. The broad wrong-lane protection suites
stayed green across floor order/duplicate/many-layer histories, raw
floor role guards, hostile raw input, dynamic family-boundary scans,
deep hybrid and AAC swap scans, wall flat-list multileaf guards,
grouped-topology route cards, and wall reorder invariance.

Gate B therefore remains a no-runtime closeout decision until the
contract proves otherwise. Do not promote exact/bound support, field
outputs, visible certainty wording, source rows, or rockwool/Uris
runtime behavior from this audit alone.

## Required Gate A Artifacts

Gate A must produce:

- `role_tagged_exact_floor_tolerance_edge_inventory`
- `bound_floor_near_miss_and_exact_drop_snapshot_matrix`
- `just_inside_just_outside_thickness_corridor_tests`
- `raw_role_prompt_and_duplicate_role_negative_boundaries`
- `visible_exact_bound_screening_support_wording_requirements`
- `next_guard_or_closeout_decision_before_any_floor_support_promotion`

Gate A landed all six artifacts and selected no-runtime closeout /
next-slice selection. No floor support promotion, confidence
promotion, evidence promotion, field-output copy, route-card movement,
output-card movement, proposal/report copy, workbench-input behavior,
or runtime value change was selected.

## Gate A Findings

`role_tagged_exact_floor_tolerance_edge_inventory`

- exact floor rows: 173;
- manual exact floor rows: 167;
- bound floor rows: 23;
- manual exact rows with numeric thickness criteria: 167;
- bound rows with numeric thickness criteria: 23.

`bound_floor_near_miss_and_exact_drop_snapshot_matrix`

- `tuas_x3_clt140_measured_2026` remains exact at `+2 mm` on
  `base_structure` and drops to
  `predictor_floor_system_family_general_estimate` at `+2.1 mm`.
- `ubiq_fl33_open_web_steel_300_lab_2026` remains bound at `+2 mm` on
  `base_structure` and drops to
  `predictor_lightweight_steel_bound_interpolation_estimate` at
  `+2.1 mm`.

`just_inside_just_outside_thickness_corridor_tests`

- `THICKNESS_TOLERANCE_MM` is pinned at `2`.
- just-outside exact/bound cases remain finite but are not exact or
  source-validated promotions.

`raw_role_prompt_and_duplicate_role_negative_boundaries`

- `raw_floor_role_inference` remains active.
- `arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`
  remains active.
- raw tagged-drift, duplicate-role, and hostile API/import cases remain
  protected negative boundaries.

`visible_exact_bound_screening_support_wording_requirements`

- `visible_support_wording_must_distinguish_exact_bound_and_screening_floor_outputs`
- `exact_floor_match_wording_must_say_curated_exact_floor_system_match_active`
- `bound_floor_match_wording_must_say_impact_stays_conservative_upper_bound`
- `just_outside_bound_wording_must_say_family_estimate_not_exact_bound_row`
- `field_output_leakage_policy_required_before_rprime_dnt_lprime_copy`

`next_guard_or_closeout_decision_before_any_floor_support_promotion`

Gate A selected:

`gate_b_no_runtime_closeout_and_next_slice_selection`

with:

`floor_tolerance_edge_inventory_landed_no_runtime_selected_closeout_next_slice_selection`

## Carry-Forward Boundaries

`common_combination_gate_b_reprobe_summary`

`sentinel_guard_green_and_fail_closed_boundary_carry_forward`

`post_sentinel_source_ready_runtime_candidate_rerank`

`rockwool_uris_2006_source_packet_status`

`floor_raw_role_field_output_near_source_hostile_input_and_curve_provenance_status`

`gate_b_reprobe_findings`

`floor_tolerance_edge_promotion_guard`

`standing_lane_misclassification_monitoring_mandate`

`note_test_document_or_easy_fix`

`paused_waiting_rights_safe_source_packet`

`multileaf_screening_blend_fail_closed_until_grouped_topology`

`raw_floor_role_inference`

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

## Protected Negative Boundaries

- `new_exact_floor_rows_need_role_tagged_reorder_tests`
- `raw_order_and_duplicate_role_negatives_must_accompany_new_exact_floor_rows`
- `visible_support_wording_must_distinguish_exact_bound_and_screening_floor_outputs`
- `field_output_leakage_policy_required_before_rprime_dnt_lprime_copy`
- `near_source_false_promotion`
- `material_alias_coalescing`
- `hostile_api_input`
- `curve_digitization_provenance`

## Gate A Candidate Rows

Gate A should inspect representative exact and bound floor rows from:

- role-tagged exact open-box timber rows;
- role-tagged exact CLT / mass-timber rows;
- bound floor rows that can look close to exact rows;
- just-inside / just-outside thickness edits around exact rows;
- raw rows that now prompt under `raw_floor_role_inference`;
- duplicate-role and missing-role rows.

## Rockwool Posture

The original rockwool triple-leaf issue is still unresolved. The live
grouped answer remains low-confidence `multileaf_screening_blend`,
`Rw 41`, and must not be presented as fixed, correct, exact, or source
validated.

Uris 2006 remains:

`paused_waiting_rights_safe_source_packet`

The flat-list guard remains:

`multileaf_screening_blend_fail_closed_until_grouped_topology`

## Frozen Surfaces

Gate A freezes:

- runtime
- support
- confidence
- evidence
- API
- route-card
- output-card
- proposal/report
- workbench-input

## Validation

Required for Gate A:

- focused floor tolerance-edge Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/floor-tolerance-edge-promotion-guard-gate-a-contract.test.ts --maxWorkers=1`;
- continuity with v18, common-combination Gate C / Gate B / Gate A,
  floor raw-role Gate C, route-family lane-drift Gate E / Gate F, and
  route-source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Gate A validation completed on 2026-05-04: focused Gate A passed 1
file / 7 tests; continuity with v18, common-combination Gate C / Gate
B / Gate A, floor raw-role Gate C, route-family lane-drift Gate E /
Gate F, and route-source risk register passed 9 files / 64 tests;
`pnpm calculator:gate:current` passed engine 235 files / 1349 tests,
web 49 files / 234 passed + 18 skipped, repo build 5 / 5 successful
with known non-fatal `sharp/@img` warnings; `apps/web/next-env.d.ts`
restored to `.next-typecheck`; final `git diff --check` passed.

## General Revalidation Notes - 2026-05-04

The broad review after Gate A keeps the slice direction unchanged:
finish Gate B closeout / next-slice selection before any runtime or
visible support movement. The first `pnpm check` pass found hygiene and
contract drift, not a source-ready candidate:

- strict typecheck required explicit warning callback types in newly
  added engine and web contracts;
- the triple-leaf frequency solver needed complete-topology defaults
  for fields that are already required by the grouped-topology guard;
- the legacy order-sensitivity contract still expected a flat-list
  triple-leaf swap to jump into the double-leaf lane. That expectation
  is now wrong because the route-family guard intentionally keeps the
  same swap fail-closed on low-confidence multileaf screening until
  grouped topology and source validation exist.

After the fixes, broad `pnpm check` passed on 2026-05-04: lint passed,
typecheck passed, engine tests passed 368 files / 2169 tests, web
tests passed 161 files / 908 passed + 18 skipped, and build passed
5 / 5 packages with the known non-fatal `sharp/@img` warnings.

Next implementation steps:

1. Add
   `packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`.
2. Close `floor_tolerance_edge_promotion_guard_v1` no-runtime unless
   a small bounded floor tolerance/support wording fix is proven by the
   closeout contract.
3. Select the next slice by re-ranking source-ready accuracy work,
   always carrying forward wrong-lane monitoring, rockwool Uris 2006
   source-packet blocking, raw floor role inference risk, field-output
   honesty, material-alias boundaries, hostile API/import guards, and
   curve-provenance gates.
