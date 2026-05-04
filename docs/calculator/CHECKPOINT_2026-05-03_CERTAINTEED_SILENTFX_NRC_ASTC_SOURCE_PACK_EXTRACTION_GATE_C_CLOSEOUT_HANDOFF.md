# Checkpoint - 2026-05-03 - CertainTeed SilentFX NRC ASTC Source Pack Extraction Gate C Closeout

Slice:

`certainteed_silentfx_nrc_astc_source_pack_extraction_v1`

Gate landed:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Status:

`closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row`

Selected next slice:

`calculator_source_gap_revalidation_v15`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md`

Implementation artifact:

`packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Prior Gate B status:

`certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`

## Summary

Gate C closes the CertainTeed SilentFX / NRC ASTC source pack
no-runtime. Gate B found no row with direct DynEcho `Rw`, `R'w`,
`Dn,w`, `DnT,w`, or `DnT,A` runtime readiness. The NRC ASTC row remains
field / flanking context, not a direct lab metric owner. The
CertainTeed `CTG-2481` product rows remain `STC` locator context
because rights-safe current payload, source-owned band curves, exact
live topology mapping, SilentFX / Type X material mapping, tolerance
ownership, protected negative boundaries, and paired engine/web visible
tests remain incomplete.

This closeout uses the CertainTeed rows as source context and
route/source risk evidence only. It does not select runtime import,
value movement, support promotion, confidence promotion, evidence
promotion, output support movement, API movement, route-card movement,
output-card movement, proposal/report copy movement, or
workbench-input behavior movement.

## Closeout Evidence

- `NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018` remains
  blocked NRC ASTC field / flanking context. Protected boundary:
  `certainteed_nrc_astc_gate_b_high_rise_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`.
- `CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE`
  remains blocked SilentFX U465 product `STC 57` context. Protected
  boundary:
  `certainteed_ctg_2481_u465_gate_b_stc57_login_locator_does_not_replace_existing_lsf_or_generic_gypsum_routes`.
- `CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE`
  remains blocked SilentFX U309 product `STC 51` context. Protected
  boundary:
  `certainteed_ctg_2481_u309_gate_b_stc51_login_locator_does_not_promote_dyn_echo_rw_or_field_outputs`.

## Protected Boundaries

- `certainteed_gate_b_source_rows_are_not_runtime_import_approval`
- `certainteed_gate_b_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`
- `certainteed_gate_b_product_stc_values_do_not_promote_dyn_echo_rw_or_field_outputs`
- `certainteed_gate_b_silentfx_typex_certainteed_typex_generic_gypsum_quietrock_and_pabco_type_x_do_not_coalesce_without_mapping_tolerance`
- `certainteed_gate_b_onesource_login_redirect_blocks_runtime_import_and_confidence_promotion`
- `certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`
- `certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

Family-boundary decisions:

- `certainteed_astc_rows_do_not_promote_lab_rw_dntw_or_field_output_routes`
- `certainteed_product_stc_rows_do_not_replace_existing_lsf_anchors`
- `certainteed_silentfx_and_type_x_rows_do_not_promote_generic_gypsum_or_quietrock_aliases`
- `certainteed_onesource_login_locator_rows_do_not_promote_runtime_truth_without_payload`

Material alias decisions:

- `silentfx_quickcut_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner`
- `certainteed_type_x_does_not_coalesce_with_pabco_type_x_quietrock_type_c_or_generic_gypsum_without_row_policy`
- `certainteed_product_stc_ul_u465_u309_rows_need_full_payload_before_exact_lsf_or_generic_wall_mapping`
- `nrc_astc_25_gauge_steel_stud_high_rise_examples_do_not_replace_existing_lsf_lab_anchors`
- `astc_field_flanking_context_does_not_coalesce_with_lab_rw_or_dntw_outputs`
- `silentfx_context_does_not_coalesce_with_local_mlv_or_uris_2006_triple_leaf_route`

## Rockwool Defect Posture

This closeout does not fix or retune the original rockwool reorder /
triple-leaf defect. The split-rockwool wall answer remains
low-confidence `multileaf_screening_blend` (`Rw 41`) and must not be
presented as fixed, correct, or source-validated. The Uris 2006 source
lane remains `paused_waiting_rights_safe_source_packet`.

CertainTeed SilentFX, Type X, ASTC, and product `STC` context is an
explicit negative boundary for local `rockwool`, local MLV, and
two-cavity Uris 2006 triple-leaf runtime promotion.

## Next Step

Implement:

`packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`

with:

`gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout`

v15 must re-rank the paused Uris 2006 triple-leaf lane, closed
CertainTeed / PABCO / Georgia-Pacific / National Gypsum / USG /
ROCKWOOL / British Gypsum / Knauf rows, Gypsum Association GA-600,
remaining official locators, CLT / mass timber, generated floor,
no-stud, lined-heavy, and historical blockers before any runtime or
visible movement.

## Validation

Completed on 2026-05-03:

- focused CertainTeed Gate C closeout: 1 file / 7 tests;
  `pnpm --filter @dynecho/engine exec vitest run src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1`;
- CertainTeed Gate C / Gate B / Gate A / v14 / PABCO Gate C /
  Gate B / Gate A / post-Georgia-Pacific Gate A / v13 /
  Georgia-Pacific Gate C / route-source risk continuity: 11 files /
  81 tests;
- `pnpm calculator:gate:current`: engine 218 files / 1213 tests; web
  47 files / 227 passed + 18 skipped; repo build 5 / 5 with known
  non-fatal `sharp/@img` warnings; whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after the final documentation sync.
