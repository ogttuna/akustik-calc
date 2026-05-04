# Checkpoint - PABCO QuietRock Sound Design Guide Source Pack Extraction Gate B

Date: 2026-05-03

Slice:

`pabco_quietrock_sound_design_guide_source_pack_extraction_v1`

Landed gate:

`gate_b_mapping_tolerance_decision_no_runtime`

Status:

`pabco_gate_b_found_no_runtime_ready_row_selected_closeout`

Implementation file:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`

Previous gate:

`gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import`

Selected next file:

`packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Planning surface:

`docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md`

## Decision

Gate B keeps every extracted PABCO / QuietRock row context-only and
selects Gate C no-runtime closeout. No row has the complete proof set
needed for runtime movement: downloaded summary-report payload or
source-owned one-third-octave curve, `STC` -> DynEcho `Rw` / field
metric owner, tolerance owner, local material/topology mapping,
protected negative boundaries, and paired engine/web visible tests.

Runtime, support, confidence, evidence, API shape, route-card values,
output-card statuses, proposal/report copy, output support, and
workbench-input behavior stay frozen.

Source locators:

- `https://go.pabcogypsum.com/tsdg`
- `https://quietrock.com/resources/sound-control-assembly-selector/`

## Row Decisions

- `PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-646-16/`
  - Gate B decision: no runtime import.
  - First missing requirement: downloaded summary-report payload or
    source curve, QuietRock ES / PABCO Type X / glass-fiber mapping,
    tolerance owner, and timber-anchor precedence tests.
  - Boundary:
    `pabco_pgd_w_646_16_gate_b_stc41_does_not_replace_existing_timber_or_generic_wood_stud_routes`.
- `PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-445-16/`
  - Gate B decision: no runtime import.
  - First missing requirement: summary-report payload, resilient-channel
    side policy, QuietRock ES / Type X / glass-fiber mapping, metric
    owner, tolerance owner, and visible tests.
  - Boundary:
    `pabco_pgd_w_445_16_gate_b_resilient_channel_stc57_does_not_promote_dyn_echo_rw_or_generic_resilient_bar`.
- `PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-449-24/`
  - Gate B decision: context only.
  - First missing requirement: fresh live row or summary-report payload,
    QuietRock 530 multilayer mapping, NRC TLA locator policy, metric
    owner, tolerance owner, and triple-leaf negative tests.
  - Boundary:
    `pabco_pgd_w_449_24_gate_b_indexed_locator_missing_payload_blocks_runtime_and_confidence_promotion`.
- `PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-68-534-16/`
  - Gate B decision: no runtime import.
  - First missing requirement: summary-report payload, 68 mil steel
    gauge mapping, resilient-channel side policy, QuietRock ES / Type X
    / glass-fiber mapping, metric owner, tolerance owner, and LSF anchor
    precedence tests.
  - Boundary:
    `pabco_pgd_68_534_16_gate_b_68mil_steel_resilient_channel_row_does_not_replace_lsf_anchors`.
- `PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-546-407-16/`
  - Gate B decision: no runtime import.
  - First missing requirement: summary-report payload, 54 mil / 6 in
    steel-stud mapping, resilient-channel and double Type X mapping,
    `STC` metric policy, field-output rejection, tolerance owner, and
    visible tests.
  - Boundary:
    `pabco_pgd_546_407_16_gate_b_stc60_does_not_promote_field_outputs_or_existing_lsf_anchors`.
- `PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w6-467-24/`
  - Gate B decision: no runtime import.
  - First missing requirement: summary-report payload, QuietRock 530 /
    530 RF mapping, 2x6 24 in oc wood-stud mapping, metric policy,
    tolerance owner, and visible tests.
  - Boundary:
    `pabco_pgd_w6_467_24_gate_b_quietrock_530_row_does_not_promote_generic_wood_stud_route`.

## Metric And Alias Boundaries

- `pabco_gate_b_source_rows_are_not_runtime_import_approval`
- `pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `pabco_gate_b_quietrock_es_530_pabco_type_x_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`
- `pabco_gate_b_glass_fiber_does_not_coalesce_with_local_rockwool_or_fix_uris_2006`
- `pabco_gate_b_resilient_channel_stud_depth_spacing_gauge_and_bearing_do_not_promote_generic_routes`
- `pabco_gate_b_pgd_w_449_24_indexed_payload_missing_blocks_runtime_import`
- `pabco_gate_b_rows_do_not_override_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`
- `pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

Family boundaries:

- `pabco_wood_stud_quietrock_rows_do_not_replace_existing_timber_or_generic_wood_stud_routes`
- `pabco_steel_stud_quietrock_rows_do_not_replace_existing_lsf_anchors`
- `pabco_resilient_channel_rows_do_not_promote_generic_resilient_bar_routes`
- `pabco_quietrock_multilayer_rows_do_not_promote_nrc_triple_leaf_or_local_mlv_routes`
- `pabco_high_stc_rows_do_not_promote_field_outputs_without_field_overlay`
- `pabco_indexed_or_summary_report_locator_rows_do_not_promote_runtime_truth_without_payload`

Material alias boundaries:

- `quietrock_es_or_es_mr_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner`
- `quietrock_530_or_530rf_does_not_coalesce_with_generic_gypsum_mlv_or_damped_leaf_without_mapping`
- `pabco_type_x_family_does_not_coalesce_with_generic_type_x_type_c_or_glass_mat_without_row_policy`
- `glass_fiber_does_not_coalesce_with_local_rockwool_or_generic_mineral_wool`
- `resilient_channel_side_spacing_and_attachment_do_not_coalesce_with_generic_resilient_bar`
- `wood_depth_steel_mil_spacing_bearing_and_load_roles_must_remain_explicit`

## Rockwool Defect Posture

This checkpoint still does not fix the original rockwool / triple-leaf
order defect. The Uris 2006 lane remains
`paused_waiting_rights_safe_source_packet`. The split-rockwool grouped
stack still returns low-confidence `multileaf_screening_blend`,
`Rw 41`, and must not be presented as fixed, correct, or
source-validated.

PABCO glass-fiber rows are an explicit negative boundary for local
`rockwool`; QuietRock multilayer rows are not a replacement for NRC
triple-leaf or local MLV / internal-leaf modeling.

## Validation

Completed on 2026-05-03:

- Focused PABCO Gate B: 1 file / 8 tests.
- PABCO Gate B / Gate A / post-Georgia-Pacific / v13 / route-source
  risk continuity: 5 files / 36 tests.
- `pnpm calculator:gate:current`: engine 213 files / 1175 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, whitespace guard passed.
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect.
- `git diff --check` passed.
