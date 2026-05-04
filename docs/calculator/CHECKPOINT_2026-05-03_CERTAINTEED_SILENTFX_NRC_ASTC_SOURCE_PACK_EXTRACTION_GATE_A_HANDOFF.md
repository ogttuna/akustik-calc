# Checkpoint - 2026-05-03 - CertainTeed SilentFX NRC ASTC Source Pack Extraction Gate A

Slice:

`certainteed_silentfx_nrc_astc_source_pack_extraction_v1`

Gate landed:

`gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import`

Status:

`certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Selected next action:

`gate_b_mapping_tolerance_decision_no_runtime`

Selected next file:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts`

Implementation artifact:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`

Planning surface:

`docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`

Prior selection status:

`selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`

## Summary

Gate A extracts CertainTeed SilentFX NRC ASTC and product-data source
context without runtime import. The NRC archive is open source context
for a 2018 technical report with 22 high-rise ASTC examples. The
CertainTeed `CTG-2481` product-data URL is an official locator, but the
direct OneSource PDF route redirects to login, so the product `STC`
rows stay indexed context only until a rights-safe current payload is
captured.

No DynEcho `Rw`, `R'w`, `Dn,w`, `DnT,w`, `DnT,A`, support,
confidence, evidence, API, route-card, output-card, proposal/report, or
workbench-input behavior moved.

## Extracted Rows

- `NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018` from
  `https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb`;
  boundary
  `certainteed_nrc_astc_high_rise_examples_do_not_promote_dyn_echo_rw_or_field_outputs`.
- `CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE`
  from `https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf`;
  boundary
  `certainteed_ctg_2481_u465_stc57_product_row_does_not_replace_existing_lsf_or_generic_gypsum_routes`.
- `CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE`
  from `https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf`;
  boundary
  `certainteed_ctg_2481_u309_stc51_product_row_does_not_promote_dyn_echo_rw_or_field_outputs`.

Supporting public pages:

- `https://www.certainteed.com/acoustic-gypsum-board`
- `https://www.certainteed.com/products/drywall-products/silentfx-quickcut-drywall`

## Protected Boundaries

- `certainteed_silentfx_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_or_dntw`
- `certainteed_silentfx_product_stc_examples_do_not_promote_runtime_without_metric_topology_tolerance_and_visible_tests`
- `silentfx_and_generic_gypsum_or_quietrock_do_not_coalesce_without_material_mapping_tolerance_owner`
- `certainteed_context_does_not_fix_uris_2006_split_rockwool_rw_41_screening_result`
- `certainteed_ctg_2481_onesource_login_redirect_blocks_current_product_pdf_payload_runtime_claim`
- `certainteed_astc_and_stc_context_does_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_or_knauf_rows`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Rockwool Defect Posture

This checkpoint does not fix the original rockwool reorder /
triple-leaf defect. The Uris 2006 source lane remains
`paused_waiting_rights_safe_source_packet`, and the split-rockwool
grouped stack remains low-confidence `multileaf_screening_blend`,
`Rw 41`.

## Next Step

Implement:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts`

with:

`gate_b_mapping_tolerance_decision_no_runtime`

Gate B must decide whether the NRC ASTC examples and product-data
`STC` rows are closed no-runtime or need another access/mapping step.
It must keep ASTC / field / flanking leakage, `STC` -> `Rw` leakage,
SilentFX / generic gypsum / QuietRock / PABCO aliasing, and Uris 2006
false-fix boundaries explicit.

## Validation

Completed on 2026-05-03:

- focused CertainTeed Gate A contract: 1 file / 8 tests passed;
- continuity with v14, PABCO Gate C / Gate B / Gate A,
  post-Georgia-Pacific Gate A, v13, Georgia-Pacific Gate C, and the
  route-source risk register: 9 files / 66 tests passed;
- `pnpm calculator:gate:current`: engine 216 files / 1198 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after the final documentation sync.
