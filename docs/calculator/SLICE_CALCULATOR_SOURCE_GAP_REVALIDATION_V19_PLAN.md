# Slice Plan - Calculator Source Gap Revalidation V19

Slice id: `calculator_source_gap_revalidation_v19`

Status: GATE A LANDED / URIS 2006 SOURCE PACKET ACQUISITION NEXT

Selected by:

`floor_tolerance_edge_promotion_guard_v1` Gate B

Selection status:

`closed_floor_tolerance_edge_promotion_guard_no_runtime_and_selected_source_gap_revalidation_v19`

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_floor_tolerance_edge_closeout`

Prior closeout file:

`packages/engine/src/post-floor-tolerance-edge-promotion-guard-v1-next-slice-selection-contract.test.ts`

Prior checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_FLOOR_TOLERANCE_EDGE_PROMOTION_GUARD_GATE_B_CLOSEOUT_HANDOFF.md`

Latest checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A_HANDOFF.md`

Gate A status:

`selected_uris_2006_rights_safe_source_packet_acquisition_after_v19_rerank_prioritized_unfixed_split_rockwool_and_found_no_runtime_ready_candidate`

Selected next slice:

`wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`

Selected next file:

`packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`

## Objective

Re-rank the source-ready accuracy backlog after the floor tolerance-edge
guard closed no-runtime. The goal is to decide the next highest-value
bounded accuracy slice without promoting source rows, field outputs, or
exact/runtime behavior from nearby evidence alone.

## Planning Refresh - 2026-05-04

This slice is a decision gate, not a runtime integration gate. The
selected first file is intentionally absent until implementation starts.
Gate B floor tolerance evidence must be carried forward as protected
behavior, not used as support/confidence/evidence promotion.

Current confirmed posture:

- `floor_tolerance_edge_promotion_guard_v1` is closed no-runtime.
- No rights-safe Uris 2006 packet or equivalent source-owned rockwool
  two-cavity curve payload is available in the repo.
- No external source research is selected inside v19 unless Gate A
  explicitly selects source acquisition or a rights-safe packet/locator
  is supplied.
- `Rw 41` for the grouped split-rockwool stack remains
  `multileaf_screening_blend`, low confidence, and not fixed.
- Any frequent-combination wrong-lane suspicion must be reproduced,
  traced, and either documented or fixed only with paired engine plus
  visible tests.

## Required Gate A Artifacts

Gate A must produce:

- `floor_tolerance_edge_gate_b_closeout_summary`
- `exact_bound_tolerance_edge_and_visible_wording_carry_forward`
- `post_floor_tolerance_source_ready_runtime_candidate_rerank`
- `rockwool_uris_2006_source_packet_status`
- `field_output_alias_hostile_input_curve_provenance_status`
- `selected_next_slice_with_target_gate_file_and_validation_scope`

## Carry-Forward Inputs

`gate_b_exact_bound_edges_remained_protected_no_support_promotion`

`official_floor_system_id_bypass_must_not_seed_layer_match_proof`

`standing_lane_misclassification_monitoring_mandate`

`note_test_document_or_easy_fix`

`paused_waiting_rights_safe_source_packet`

`multileaf_screening_blend_fail_closed_until_grouped_topology`

`raw_floor_role_inference`

`arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed`

## V19 Re-Rank Rules

Gate A must not treat any of the following as runtime-ready by itself:

- a green source locator without exact live topology, material mapping,
  metric ownership, tolerance ownership, protected negative boundaries,
  and paired visible tests;
- exact/bound floor tolerance-edge tests that only prove existing
  behavior is protected;
- direct `officialFloorSystemId` bypass behavior;
- near-source manufacturer STC/IIC/Rw context rows without DynEcho
  mapping/tolerance ownership;
- finite fail-closed wall or floor screening values.

The rockwool/Uris triple-leaf problem remains:

`paused_waiting_rights_safe_source_packet`

The current `Rw 41` result remains:

`multileaf_screening_blend`

It is not exact, fixed, or source-validated.

## Candidate Buckets To Evaluate

Gate A must write an explicit ranked matrix. Use these buckets as the
minimum candidate set; adding a candidate is allowed only if its missing
requirements and negative boundaries are named.

1. `wall_triple_leaf_uris_2006_source_packet_or_acquisition_lane`
   - Highest user-impact unresolved defect.
   - Runtime-ready only if a rights-safe Uris 2006 packet or equivalent
     measured two-cavity rockwool curve payload exists with band
     vectors, rating derivation, uncertainty, local material mapping,
     grouped topology guard, and paired visible tests.
   - If still missing, Gate A may select a formal source-acquisition
     slice, but must not present `Rw 41` as fixed.
2. `field_output_lab_screening_leakage_guard`
   - Candidate only if v19 finds visible/API/report wording can make
     `R'w`, `DnT,w`, `L'nT,w`, or similar field-style outputs look more
     exact than their lab/screening basis supports.
   - Any movement must be copy/support-policy only and paired with
     visible tests.
3. `material_alias_and_near_source_false_promotion_guard`
   - Candidate for rockwool vs glass-fiber, generic gypsum vs Type C,
     MLV/plaster, or manufacturer context rows.
   - Must stay context-only unless material mapping, tolerance owner,
     source row, and visible tests are all named.
4. `hostile_input_and_curve_provenance_guard`
   - Candidate if NaN/Infinity/negative/unknown-material import paths
     or curve digitization provenance can still create precise-looking
     output.
   - Must remain fail-closed unless the fix is bounded and testable.
5. `no_runtime_source_gap_rerank_closeout`
   - Use this when no candidate is source-ready and no bounded guard is
     justified. It must still select the next target file and validation
     scope.

Gate A should prefer a bounded guard or source-acquisition decision over
speculative runtime promotion. Exact promotion remains illegal without
source topology, local material mapping, metric/tolerance owner,
negative-boundary proof, and paired engine plus web-visible tests.

## Expected Gate A Contract Shape

The first contract should make the decision reproducible:

- define a `V19_RERANK_CANDIDATES` matrix with rank, selected status,
  target file, first missing requirement, runtime eligibility, and
  validation scope;
- snapshot the floor Gate B carry-forward as protected no-runtime
  evidence;
- snapshot grouped and flat-list split-rockwool behavior as screening /
  fail-closed, not fixed;
- assert closed manufacturer/source contexts remain blocked from
  runtime unless exact material, topology, metric, tolerance, and
  visible-test ownership are present;
- assert selected next slice has one target first file and no competing
  selected candidate.

## Validation

Required for Gate A:

1. focused v19 contract:
   `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v19-gate-a-contract.test.ts --maxWorkers=1`
2. continuity with Gate B floor tolerance closeout, Gate A floor
   tolerance, v18, and route-source risk register;
3. `pnpm calculator:gate:current` after adding the v19 file to the
   current-gate runner;
4. `git diff --check`.
