# Checkpoint - 2026-05-03 - CertainTeed SilentFX NRC ASTC Source Pack Extraction Gate B

Slice:

`certainteed_silentfx_nrc_astc_source_pack_extraction_v1`

Gate landed:

`gate_b_mapping_tolerance_decision_no_runtime`

Status:

`certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`

Selected next action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Selected next file:

`packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Implementation artifact:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts`

Previous Gate A artifact:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`

Planning surface:

`docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`

Prior selection status:

`selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`

## Summary

Gate B compares the Gate A NRC ASTC row and CertainTeed product-data
`STC` rows against the live calculator implementation. No row is
runtime-ready. The NRC ASTC report remains field / flanking context,
not a direct DynEcho `Rw`, `R'w`, `Dn,w`, `DnT,w`, or `DnT,A` source.
The CertainTeed `CTG-2481` product rows remain `STC` locator context
because the OneSource PDF locator redirects to login and does not
supply a rights-safe current payload, source-owned band curve, metric
policy, material mapping, tolerance owner, or paired visible tests.

No DynEcho numeric runtime, support, confidence, evidence, API,
route-card, output-card, proposal/report, or workbench-input behavior
moved.

## Gate B Row Decisions

- `NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018` stays
  context-only; boundary
  `certainteed_nrc_astc_gate_b_high_rise_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`.
  First missing requirement:
  `nrc_certainteed_astc_high_rise_examples_need_example_level_rights_safe_payload_direct_flanking_split_policy_astc_to_rw_or_explicit_rejection_policy_silentfx_typex_certainteed_typex_25_gauge_steel_stud_mapping_tolerance_owner_and_visible_tests`.
- `CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE`
  stays context-only; boundary
  `certainteed_ctg_2481_u465_gate_b_stc57_login_locator_does_not_replace_existing_lsf_or_generic_gypsum_routes`.
  First missing requirement:
  `ctg_2481_u465_stc57_still_needs_rights_safe_current_pdf_payload_full_ul_u465_layer_fastener_stud_insulation_detail_silentfx_typex_certainteed_typex_material_mapping_stc_to_rw_or_rejection_policy_tolerance_owner_lsf_anchor_precedence_tests_and_visible_tests`.
- `CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE`
  stays context-only; boundary
  `certainteed_ctg_2481_u309_gate_b_stc51_login_locator_does_not_promote_dyn_echo_rw_or_field_outputs`.
  First missing requirement:
  `ctg_2481_u309_stc51_still_needs_rights_safe_current_pdf_payload_full_ul_u309_layer_fastener_stud_insulation_detail_silentfx_typex_certainteed_typex_material_mapping_stc_to_rw_or_rejection_policy_tolerance_owner_runtime_value_or_rejection_pin_and_visible_tests`.

Source locators:

- `https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb`
- `https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf`
- `https://www.certainteed.com/acoustic-gypsum-board`
- `https://www.certainteed.com/products/drywall-products/silentfx-quickcut-drywall`

## Protected Boundaries

- `certainteed_gate_b_source_rows_are_not_runtime_import_approval`
- `certainteed_gate_b_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`
- `certainteed_gate_b_product_stc_values_do_not_promote_dyn_echo_rw_or_field_outputs`
- `certainteed_gate_b_silentfx_typex_certainteed_typex_generic_gypsum_quietrock_and_pabco_type_x_do_not_coalesce_without_mapping_tolerance`
- `certainteed_gate_b_onesource_login_redirect_blocks_runtime_import_and_confidence_promotion`
- `certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`
- `certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

Source-family boundaries:

- `certainteed_astc_rows_do_not_promote_lab_rw_dntw_or_field_output_routes`
- `certainteed_product_stc_rows_do_not_replace_existing_lsf_anchors`
- `certainteed_silentfx_and_type_x_rows_do_not_promote_generic_gypsum_or_quietrock_aliases`
- `certainteed_onesource_login_locator_rows_do_not_promote_runtime_truth_without_payload`
- `certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`

Material alias decisions:

- `silentfx_quickcut_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner`
- `certainteed_type_x_does_not_coalesce_with_pabco_type_x_quietrock_type_c_or_generic_gypsum_without_row_policy`
- `certainteed_product_stc_ul_u465_u309_rows_need_full_payload_before_exact_lsf_or_generic_wall_mapping`
- `nrc_astc_25_gauge_steel_stud_high_rise_examples_do_not_replace_existing_lsf_lab_anchors`
- `astc_field_flanking_context_does_not_coalesce_with_lab_rw_or_dntw_outputs`
- `silentfx_context_does_not_coalesce_with_local_mlv_or_uris_2006_triple_leaf_route`

## Rockwool Defect Posture

This checkpoint does not fix the original rockwool reorder /
triple-leaf defect. The Uris 2006 source lane remains
`paused_waiting_rights_safe_source_packet`, and the split-rockwool
grouped stack remains low-confidence `multileaf_screening_blend`,
`Rw 41`.

## Next Step

Implement:

`packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

with:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Gate C must close the CertainTeed source-pack slice no-runtime and
select the next source-gap revalidation or higher-priority accuracy
step. It must keep ASTC / field / flanking leakage, product `STC` ->
`Rw` leakage, SilentFX / Type X aliasing, OneSource payload gaps, and
Uris 2006 false-fix boundaries explicit.

## Validation

Completed on 2026-05-03:

- focused CertainTeed Gate B contract: 1 file / 8 tests;
- continuity with Gate A, v14, PABCO Gate C / Gate B / Gate A,
  post-Georgia-Pacific Gate A, v13, Georgia-Pacific Gate C, and the
  route-source risk register: 10 files / 74 tests;
- `pnpm calculator:gate:current`: engine 217 files / 1206 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after the final documentation sync.
