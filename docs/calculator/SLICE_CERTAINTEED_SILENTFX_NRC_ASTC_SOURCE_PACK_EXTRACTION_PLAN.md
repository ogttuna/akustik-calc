# Slice Plan - CertainTeed SilentFX NRC ASTC Source Pack Extraction

Slice id: `certainteed_silentfx_nrc_astc_source_pack_extraction_v1`

Status: GATE C CLOSED NO-RUNTIME / V15 REVALIDATION NEXT

Selected by:

`calculator_source_gap_revalidation_v14` Gate A

Selection status:

`selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`

Selected first file:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`

Selected first action:

`gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import`

Gate A status:

`certainteed_silentfx_nrc_astc_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Landed Gate A file:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`

Landed Gate B status:

`certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`

Selected Gate B file:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts`

Selected Gate B action:

`gate_b_mapping_tolerance_decision_no_runtime`

Selected Gate C file:

`packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Selected Gate C action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Gate C closeout status:

`closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row`

Selected next slice:

`calculator_source_gap_revalidation_v15`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V15_PLAN.md`

## Objective

Extract the CertainTeed SilentFX NRC ASTC and product-data source
context without runtime import. This slice must separate NRC ASTC /
field / flanking examples from lab or product `STC` rows before any
metric mapping discussion, and it must keep DynEcho `Rw`, `R'w`,
`DnT,w`, `Ln,w`, `Dn,w`, `DnT,A`, support, confidence, evidence,
API, route-card, output-card, proposal/report, and workbench-input
surfaces frozen.

## Source Context

Candidate locators:

- NRC / CertainTeed SilentFX ASTC high-rise context:
  `https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb`
- CertainTeed SilentFX product data context:
  `https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf`

Expected Gate A rows / row families:

- `NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018`
- `CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE`
- `CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE`

Landed Gate A row boundaries:

- `certainteed_nrc_astc_high_rise_examples_do_not_promote_dyn_echo_rw_or_field_outputs`
- `certainteed_ctg_2481_u465_stc57_product_row_does_not_replace_existing_lsf_or_generic_gypsum_routes`
- `certainteed_ctg_2481_u309_stc51_product_row_does_not_promote_dyn_echo_rw_or_field_outputs`

Supporting public source pages:

- `https://www.certainteed.com/acoustic-gypsum-board`
- `https://www.certainteed.com/products/drywall-products/silentfx-quickcut-drywall`

These rows are source context only until metric owner, exact topology,
material mapping, tolerance owner, protected negative boundaries, and
paired engine/web visible tests exist.

## Gate B Decision

Gate B landed no-runtime and selected Gate C closeout. No CertainTeed
or NRC row has the complete payload, metric, material, tolerance,
topology, negative-boundary, and visible-test ownership required for
runtime import.

Gate B row boundaries:

- `certainteed_nrc_astc_gate_b_high_rise_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`
- `certainteed_ctg_2481_u465_gate_b_stc57_login_locator_does_not_replace_existing_lsf_or_generic_gypsum_routes`
- `certainteed_ctg_2481_u309_gate_b_stc51_login_locator_does_not_promote_dyn_echo_rw_or_field_outputs`

Gate B status:

`certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`

Gate B implementation file:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts`

Gate B selected next file:

`packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

## Gate A Requirements

Gate A should add:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`

Required artifacts:

1. `nrc_certainteed_silentfx_astc_report_locator_and_metric_classification`.
2. `certainteed_silentfx_product_data_stc_row_locator_matrix`.
3. `astc_field_flanking_versus_lab_stc_or_rw_metric_policy_or_explicit_rejection`.
4. `local_material_alias_decision_for_silentfx_generic_gypsum_quietrock_and_pabco_type_x_without_coalescing`.
5. `negative_boundaries_for_uris_2006_split_rockwool_pabco_ga600_closed_manufacturer_rows_and_field_output_leakage`.
6. `paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement`.

## Protected Boundaries

- CertainTeed SilentFX NRC ASTC examples are field / flanking context
  unless Gate A proves otherwise; they do not promote DynEcho `Rw`,
  `R'w`, `DnT,w`, `Dn,w`, `DnT,A`, support, confidence, evidence,
  route-card values, output-card status, or proposal/report copy.
- Product `STC` examples do not become runtime truth without exact live
  topology, source metric policy, material mapping, tolerance owner,
  negative boundaries, and paired visible tests.
- SilentFX, generic gypsum, QuietRock, PABCO Type X, and local gypsum
  board must not coalesce without an explicit material mapping and
  tolerance owner.
- CertainTeed context does not fix the original Uris 2006
  split-rockwool defect. The source lane remains
  `paused_waiting_rights_safe_source_packet`, and the current answer
  remains low-confidence `multileaf_screening_blend`, `Rw 41`.
- GA-600 remains authoritative context only until rights-safe current
  row payloads are available.
- Runtime, support, confidence, evidence, API, route-card,
  output-card, proposal/report, and workbench-input surfaces remain
  frozen.

Required boundary tokens:

- `certainteed_silentfx_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_or_dntw`
- `certainteed_silentfx_product_stc_examples_do_not_promote_runtime_without_metric_topology_tolerance_and_visible_tests`
- `silentfx_and_generic_gypsum_or_quietrock_do_not_coalesce_without_material_mapping_tolerance_owner`
- `certainteed_context_does_not_fix_uris_2006_split_rockwool_rw_41_screening_result`
- `certainteed_ctg_2481_onesource_login_redirect_blocks_current_product_pdf_payload_runtime_claim`
- `certainteed_astc_and_stc_context_does_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_or_knauf_rows`
- `certainteed_gate_b_source_rows_are_not_runtime_import_approval`
- `certainteed_gate_b_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_dntw_or_field_outputs`
- `certainteed_gate_b_product_stc_values_do_not_promote_dyn_echo_rw_or_field_outputs`
- `certainteed_gate_b_silentfx_typex_certainteed_typex_generic_gypsum_quietrock_and_pabco_type_x_do_not_coalesce_without_mapping_tolerance`
- `certainteed_gate_b_onesource_login_redirect_blocks_runtime_import_and_confidence_promotion`
- `certainteed_gate_b_rows_do_not_override_closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`
- `certainteed_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `certainteed_astc_rows_do_not_promote_lab_rw_dntw_or_field_output_routes`
- `certainteed_product_stc_rows_do_not_replace_existing_lsf_anchors`
- `certainteed_silentfx_and_type_x_rows_do_not_promote_generic_gypsum_or_quietrock_aliases`
- `certainteed_onesource_login_locator_rows_do_not_promote_runtime_truth_without_payload`

Material alias tokens:

- `silentfx_quickcut_type_x_does_not_coalesce_with_generic_gypsum_without_source_tolerance_owner`
- `certainteed_type_x_does_not_coalesce_with_pabco_type_x_quietrock_type_c_or_generic_gypsum_without_row_policy`
- `certainteed_product_stc_ul_u465_u309_rows_need_full_payload_before_exact_lsf_or_generic_wall_mapping`
- `nrc_astc_25_gauge_steel_stud_high_rise_examples_do_not_replace_existing_lsf_lab_anchors`
- `astc_field_flanking_context_does_not_coalesce_with_lab_rw_or_dntw_outputs`
- `silentfx_context_does_not_coalesce_with_local_mlv_or_uris_2006_triple_leaf_route`

## Validation

Selection validation completed on 2026-05-03:

- focused v14 Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts --maxWorkers=1`;
  1 file / 8 tests passed;
- v14 continuity with PABCO Gate C / Gate B / Gate A,
  post-Georgia-Pacific Gate A, v13, Georgia-Pacific Gate C, and the
  route-source risk register: 8 files / 58 tests passed;
- `pnpm calculator:gate:current`: engine 215 files / 1190 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after the final documentation sync.

CertainTeed Gate A validation completed on 2026-05-03:

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

No runtime or visible movement is allowed in this slice.

Focused Gate A command:

`pnpm --filter @dynecho/engine exec vitest run src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`

CertainTeed Gate B validation completed on 2026-05-03:

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

Focused Gate B command:

`pnpm --filter @dynecho/engine exec vitest run src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1`

CertainTeed Gate C validation completed on 2026-05-03:

- focused CertainTeed Gate C closeout: 1 file / 7 tests;
- continuity with CertainTeed Gate B, Gate A, v14, PABCO Gate C /
  Gate B / Gate A, post-Georgia-Pacific Gate A, v13, Georgia-Pacific
  Gate C, and the route-source risk register: 11 files / 81 tests;
- `pnpm calculator:gate:current`: engine 218 files / 1213 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after the final documentation sync.
