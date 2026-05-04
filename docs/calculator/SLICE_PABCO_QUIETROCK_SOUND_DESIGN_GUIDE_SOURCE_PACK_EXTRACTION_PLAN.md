# Slice Plan - PABCO QuietRock Sound Design Guide Source Pack Extraction

Slice id: `pabco_quietrock_sound_design_guide_source_pack_extraction_v1`

Status: GATE C CLOSED / SOURCE GAP REVALIDATION V14 SELECTED

Selected by:

`calculator_post_georgia_pacific_source_acquisition_v1` Gate A

Selection status:

`selected_pabco_quietrock_sound_design_guide_source_pack_extraction_after_post_georgia_pacific_acquisition_found_official_row_pages_but_no_runtime_ready_import`

Selected first file:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`

Selected first action:

`gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import`

Landed Gate A status:

`pabco_quietrock_sound_design_guide_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Landed Gate A checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_A_HANDOFF.md`

Landed Gate B status:

`pabco_gate_b_found_no_runtime_ready_row_selected_closeout`

Landed Gate B file:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`

Landed Gate B action:

`gate_b_mapping_tolerance_decision_no_runtime`

Landed Gate B checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`

Landed Gate C status:

`closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row`

Landed Gate C file:

`packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Landed Gate C action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Landed Gate C checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout`

Selected next slice:

`calculator_source_gap_revalidation_v14`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md`

Prior acquisition file:

`packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`

Selection validation:

`calculator_post_georgia_pacific_source_acquisition_v1` Gate A
validated this selection on 2026-05-02: focused post-Georgia-Pacific
Gate A 1 file / 8 tests; continuity with v13, Georgia-Pacific,
National Gypsum, USG, ROCKWOOL, British Gypsum, and the route-source
risk register 20 files / 142 tests; `pnpm calculator:gate:current`
engine 211 files / 1159 tests, web 47 files / 227 passed + 18 skipped,
build 5 / 5 with known non-fatal `sharp/@img` warnings; and
`apps/web/next-env.d.ts` restored to `.next-typecheck` after the build
side-effect; `git diff --check` passed after the final documentation
sync.

## Objective

Extract PABCO Gypsum / QuietRock Sound Design Guide and Sound Assembly
Tool row context as a no-runtime source pack. The source is useful
because it exposes official row pages with wall assembly identifiers,
`STC`, fire design context, wall thickness, weight, bearing, product
layers, stud type/spacing, resilient channel, insulation, and test
report numbers.

This slice is not allowed to import runtime values or promote support,
confidence, evidence, API shape, route cards, output cards,
proposal/report copy, output support, or workbench-input behavior.

## Source Locators

- PABCO Sound Design Guide landing page:
  `https://go.pabcogypsum.com/tsdg`
- PABCO / QuietRock Sound Assembly Tool:
  `https://quietrock.com/resources/sound-control-assembly-selector/`
- Representative row pages:
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-646-16/`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-445-16/`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-449-24/`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-68-534-16/`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-546-407-16/`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w6-467-24/`

## Why This Slice Is Next

`calculator_post_georgia_pacific_source_acquisition_v1` found the
PABCO Gypsum / QuietRock Sound Design Guide as the next concrete
official source locator after ROCKWOOL, USG, National Gypsum,
Georgia-Pacific, British Gypsum, Knauf, and the paused Uris 2006 lane
had all failed runtime readiness.

The original Uris 2006 rockwool/two-cavity lane remains
`paused_waiting_rights_safe_source_packet`; PABCO rows are adjacent
`STC` source context and do not fix or validate the split-rockwool
`Rw 41` `multileaf_screening_blend` answer.

The PABCO row pages are concrete enough for no-runtime extraction
because they name wall assembly identifiers, products, studs,
insulation, `STC`, and report identifiers. They are not runtime-ready:
the calculator still lacks source-owned `STC` -> DynEcho `Rw` /
field-output policy, local material mapping for QuietRock / PABCO
Type X / glass fiber, tolerance ownership, protected negative
boundaries, retrieved summary-report payloads, and paired engine/web
visible tests.

## Gate A - Extraction Decision

Gate A added:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`

It extracted these no-runtime rows:

- `PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730`
  from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-646-16/`
  with boundary
  `pabco_pgd_w_646_16_stc41_does_not_replace_generic_wood_stud_or_quietrock_runtime_route`.
- `PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745`
  from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-445-16/`
  with boundary
  `pabco_pgd_w_445_16_stc57_resilient_channel_context_does_not_promote_dyn_echo_rw_or_field_outputs`.
- `PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035`
  from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-449-24/`
  with boundary
  `pabco_pgd_w_449_24_indexed_locator_is_not_runtime_truth_until_payload_is_retrieved`.
  Current direct retrieval did not capture a live row payload, so Gate B
  must keep it locator-only unless a fresh payload is retrieved.
- `PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611`
  from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-68-534-16/`
  with boundary
  `pabco_pgd_68_534_16_68mil_steel_stud_row_does_not_replace_existing_lsf_anchors`.
- `PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358`
  from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-546-407-16/`
  with boundary
  `pabco_pgd_546_407_16_stc60_is_not_a_dyn_echo_field_or_lsf_runtime_anchor`.
- `PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053`
  from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w6-467-24/`
  with boundary
  `pabco_pgd_w6_467_24_quietrock_530_row_does_not_promote_generic_wood_stud_route`.

Gate A records product layers, stud type/spacing, resilient channel,
insulation, fire design, `STC`, and test report numbers, then blocks
runtime movement because source-owned `STC` -> DynEcho `Rw` /
field-output policy, local QuietRock / PABCO Type X / glass-fiber /
resilient-channel mapping, tolerance ownership, summary-report
payloads, and paired engine/web visible tests remain missing.

## Gate B - Mapping / Tolerance Decision

Gate B landed no-runtime at:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`

Status:

`pabco_gate_b_found_no_runtime_ready_row_selected_closeout`

Checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_B_HANDOFF.md`

Gate B found no extracted PABCO row runtime-ready. Every row remains
source context only because exact downloaded row/report payloads,
source-owned `STC` -> DynEcho `Rw` / field-output policy, local
QuietRock / PABCO Type X / glass-fiber / resilient-channel /
stud-depth/stud-gauge mapping, tolerance ownership, protected negative
boundaries, and paired engine/web visible tests are not owned together.

Selected next file:

`packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Selected next action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Gate B row boundaries:

- `PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730` from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-646-16/`;
  `pabco_pgd_w_646_16_gate_b_stc41_does_not_replace_existing_timber_or_generic_wood_stud_routes`.
- `PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745` from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-445-16/`;
  `pabco_pgd_w_445_16_gate_b_resilient_channel_stc57_does_not_promote_dyn_echo_rw_or_generic_resilient_bar`.
- `PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035`
  from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-449-24/`;
  `pabco_pgd_w_449_24_gate_b_indexed_locator_missing_payload_blocks_runtime_and_confidence_promotion`.
- `PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611`
  from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-68-534-16/`;
  `pabco_pgd_68_534_16_gate_b_68mil_steel_resilient_channel_row_does_not_replace_lsf_anchors`.
- `PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358`
  from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-546-407-16/`;
  `pabco_pgd_546_407_16_gate_b_stc60_does_not_promote_field_outputs_or_existing_lsf_anchors`.
- `PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053` from
  `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w6-467-24/`;
  `pabco_pgd_w6_467_24_gate_b_quietrock_530_row_does_not_promote_generic_wood_stud_route`.

Gate B material-alias decisions:

- `quietrock_es_or_es_mr_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner`
- `quietrock_530_or_530rf_does_not_coalesce_with_generic_gypsum_mlv_or_damped_leaf_without_mapping`
- `pabco_type_x_family_does_not_coalesce_with_generic_type_x_type_c_or_glass_mat_without_row_policy`
- `glass_fiber_does_not_coalesce_with_local_rockwool_or_generic_mineral_wool`
- `resilient_channel_side_spacing_and_attachment_do_not_coalesce_with_generic_resilient_bar`
- `wood_depth_steel_mil_spacing_bearing_and_load_roles_must_remain_explicit`

Gate B family-boundary decisions:

- `pabco_wood_stud_quietrock_rows_do_not_replace_existing_timber_or_generic_wood_stud_routes`
- `pabco_steel_stud_quietrock_rows_do_not_replace_existing_lsf_anchors`
- `pabco_resilient_channel_rows_do_not_promote_generic_resilient_bar_routes`
- `pabco_quietrock_multilayer_rows_do_not_promote_nrc_triple_leaf_or_local_mlv_routes`
- `pabco_high_stc_rows_do_not_promote_field_outputs_without_field_overlay`
- `pabco_indexed_or_summary_report_locator_rows_do_not_promote_runtime_truth_without_payload`

## Gate C - Closeout / Next-Slice Selection

Gate C landed no-runtime at:

`packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Status:

`closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row`

Checkpoint:

`docs/calculator/CHECKPOINT_2026-05-03_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_GATE_C_CLOSEOUT_HANDOFF.md`

Gate C closes the PABCO row set no-runtime and selects:

`calculator_source_gap_revalidation_v14`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V14_PLAN.md`

v14 must re-rank the paused Uris 2006 triple-leaf lane, closed PABCO /
Georgia-Pacific / National Gypsum / USG / ROCKWOOL / British Gypsum /
Knauf rows, CertainTeed SilentFX / NRC ASTC, GA-600, remaining
official locators, CLT / mass timber, generated floor, no-stud,
lined-heavy, and historical blockers before any runtime or visible
movement.

The Uris 2006 source-packet status stays
`paused_waiting_rights_safe_source_packet` until a rights-safe source
packet with owned curves/table data, provenance, uncertainty, and
metric derivation exists.

## Protected Boundaries

- `pabco_quietrock_stc_row_pages_do_not_promote_dyn_echo_rw_or_field_outputs_without_metric_policy`
- `quietrock_es_510_530_545_and_generic_pabco_type_x_do_not_coalesce_with_generic_gypsum_or_mlv_without_material_mapping`
- `pabco_single_staggered_double_stud_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `pabco_glass_fiber_wood_steel_rc_rows_do_not_reopen_closed_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_or_knauf_decisions`
- `pabco_summary_report_download_links_are_not_runtime_truth_until_payloads_are_retrieved_and_curve_or_metric_policy_is_owned`
- `pabco_pgd_w_449_24_indexed_locator_requires_fresh_payload_before_runtime_or_confidence_promotion`
- `pabco_gate_b_source_rows_are_not_runtime_import_approval`
- `pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `pabco_gate_b_quietrock_es_530_pabco_type_x_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`
- `pabco_gate_b_glass_fiber_does_not_coalesce_with_local_rockwool_or_fix_uris_2006`
- `pabco_gate_b_resilient_channel_stud_depth_spacing_gauge_and_bearing_do_not_promote_generic_routes`
- `pabco_gate_b_pgd_w_449_24_indexed_payload_missing_blocks_runtime_import`
- `pabco_gate_b_rows_do_not_override_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`
- `pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Frozen Surfaces

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Acceptance Rules

Runtime work may be selected only if a later gate names exact source row
payloads, metric owner, tolerance owner, local material mapping,
protected negative boundaries, and paired engine/web visible tests
together. If any one is missing, PABCO stays source-extraction context
only.

## Validation

Gate C validation completed on 2026-05-03:

- Focused PABCO Gate C closeout: 1 file / 7 tests.
- PABCO Gate C / Gate B / Gate A / post-Georgia-Pacific / v13 /
  Georgia-Pacific Gate C / route-source risk continuity: 7 files /
  50 tests.
- `pnpm calculator:gate:current`: engine 214 files / 1182 tests; web
  47 files / 227 passed + 18 skipped; repo build 5 / 5 with known
  non-fatal `sharp/@img` warnings; whitespace guard passed.
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect.
- `git diff --check` passed after the final documentation sync.

Gate B validation completed on 2026-05-03:

- Focused PABCO Gate B: 1 file / 8 tests.
- PABCO Gate B / Gate A / post-Georgia-Pacific / v13 /
  route-source risk continuity: 5 files / 36 tests.
- `pnpm calculator:gate:current`: engine 213 files / 1175 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, whitespace guard passed.
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect.
- `git diff --check` passed.

Gate A validation completed on 2026-05-03:

- Focused PABCO Gate A: 1 file / 8 tests.
- PABCO / post-Georgia-Pacific / v13 / Georgia-Pacific / National
  Gypsum / USG / ROCKWOOL / British Gypsum / route-source risk
  continuity: 21 files / 150 tests.
- `pnpm calculator:gate:current`: engine 212 files / 1167 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect.
- `git diff --check` passed.

Run `pnpm check` only if a later gate selects runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
