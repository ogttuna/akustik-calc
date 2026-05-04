# Slice Plan - Calculator Source Gap Revalidation V20

Slice id: `calculator_source_gap_revalidation_v20`

Status: SELECTED / GATE A NEXT

Selected by:

`wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`
Gate U

Selection status:

`gate_u_rechecked_uris_2006_rights_safe_source_packet_absent_no_runtime_selected_source_gap_revalidation_v20`

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_uris_2006_acquisition_attempt`

Prior Gate U checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_GATE_U_HANDOFF.md`

Prior Gate U implementation file:

`packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`

## Objective

Re-rank the calculator source/accuracy backlog after the focused Uris
2006 source-packet acquisition attempt confirmed that no runtime-ready
rights-safe packet is available. This is a no-runtime planning gate.

The original split-rockwool triple-leaf defect remains unresolved:
`Rw 41` is still low-confidence `multileaf_screening_blend`, not exact
and not source-validated.

## Gate A Must Produce

- `uris_2006_gate_u_acquisition_closeout_summary`
- `source_packet_absence_and_external_dependency_carry_forward`
- `post_uris_acquisition_source_ready_runtime_candidate_rerank`
- `wrong_lane_and_frequent_combination_monitoring_carry_forward`
- `field_output_alias_hostile_input_curve_provenance_status`
- `selected_next_slice_with_target_gate_file_and_validation_scope`

## Candidate Buckets To Evaluate

1. `source_packet_absence_closeout_or_manual_external_dependency_hold`
   - The Uris 2006 source lane is important, but no runtime work may
     proceed without source-owned curves or an authorized payload.
2. `field_output_lab_screening_leakage_guard`
   - Ensure lab/screening basis does not make `R'w`, `DnT,w`, or
     `L'nT,w` look design-grade.
3. `material_alias_and_near_source_false_promotion_guard`
   - Keep rockwool/glass-fiber, generic gypsum/Type C, MLV/plaster,
     and manufacturer context rows separate unless a source/tolerance
     owner exists.
4. `hostile_input_and_curve_provenance_guard`
   - Unknown, negative, non-finite, or poorly digitized data must remain
     fail-closed.
5. `next_source_ready_wall_or_floor_row`
   - Select only if a concrete source-ready row has topology, metric,
     material mapping, tolerance, negative-boundary, and visible-test
     ownership.
6. `no_runtime_rerank_closeout`
   - Use only if no source-ready candidate or bounded guard fix is
     justified.

## Non-Promotion Rules

v20 must not promote:

- Uris 2006 DOI/Crossref/ScienceDirect metadata;
- Elsevier TDM links without an authorized local payload;
- the reported 7-8 dB behavior as a reusable penalty;
- NRC 2024 graph rows as local rockwool runtime evidence;
- manufacturer STC/IIC/OITC context rows;
- user repro PDFs or unrelated local PDFs;
- generic material aliases without tolerance ownership.

## Validation

Required for v20 Gate A:

1. focused v20 contract:
   `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts --maxWorkers=1`
2. continuity with Gate U, v19, Gate T, Gate S, and route-source risk
   register;
3. `pnpm calculator:gate:current` after adding v20 to the runner;
4. `git diff --check`.
