# Slice Plan - Calculator Source Gap Revalidation v14

Slice id: `calculator_source_gap_revalidation_v14`

Status: GATE A LANDED / CERTAINTEED SILENTFX NRC ASTC SELECTED

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout`

Selection status:

`closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row`

Gate A result:

`calculator_source_gap_revalidation_v14` selected the CertainTeed
SilentFX NRC ASTC source-pack extraction slice:

CertainTeed SilentFX NRC ASTC

`certainteed_silentfx_nrc_astc_source_pack_extraction_v1`

Selected next file:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`

Selected next action:

`gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import`

Selected next planning surface:

`docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`

Gate A selection status:

`selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`

Selection validation:

Completed on 2026-05-03: focused v14 Gate A contract
`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts --maxWorkers=1`,
1 file / 8 tests passed; continuity with PABCO Gate C / Gate B /
Gate A, post-Georgia-Pacific Gate A, v13, Georgia-Pacific Gate C, and
the route-source risk register 8 files / 58 tests passed;
`pnpm calculator:gate:current` passed with engine 215 files / 1190
tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
non-fatal `sharp/@img` warnings, and whitespace guard passed;
`apps/web/next-env.d.ts` restored to `.next-typecheck` after the build
side-effect; `git diff --check` passed after the final documentation
sync.

Selected by:

`pabco_quietrock_sound_design_guide_source_pack_extraction_v1` Gate C

Prior PABCO Gate C file:

`packages/engine/src/post-pabco-quietrock-sound-design-guide-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Prior PABCO Gate B status:

`pabco_gate_b_found_no_runtime_ready_row_selected_closeout`

Prior PABCO Gate B file:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`

Prior PABCO Gate A file:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`

## Objective

Re-rank source-readiness and accuracy work after the PABCO Gypsum /
QuietRock Sound Design Guide source-pack slice closed no-runtime. This
is a no-runtime revalidation gate: it must not move runtime values,
support, confidence, evidence, API shape, route cards, output cards,
proposal/report copy, output support, or workbench-input behavior.

## Inputs

- PABCO Gate A / Gate B / Gate C closeout summary.
- PABCO `STC` values, NOAL / NRC report locators, QuietRock ES /
  QuietRock 530 / PABCO Type X / glass-fiber / resilient-channel /
  wood-stud / steel-stud material alias blockers.
- PABCO wood, steel, resilient-channel, indexed multilayer,
  high-STC, and payload family-boundary blockers.
- Paused Uris 2006 triple-leaf source-packet lane.
- Closed PABCO, Georgia-Pacific, National Gypsum, USG, ROCKWOOL,
  British Gypsum, and Knauf source rows and negative boundaries.
- CertainTeed SilentFX / NRC ASTC and Gypsum Association GA-600 context
  from the post-Georgia-Pacific source acquisition pass.
- CLT / mass-timber, generated floor, no-stud, lined-heavy, and
  historical blocked families.

## Gate A Requirements

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts`

Required artifacts:

1. `pabco_gate_a_gate_b_gate_c_closeout_summary`.
2. `pabco_quietrock_stc_report_locator_material_alias_and_family_boundary_blockers`.
3. `paused_uris_2006_triple_leaf_source_packet_lane_status`.
4. `closed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh`.
5. `certainteed_silentfx_nrc_astc_ga600_and_remaining_official_locator_rerank_after_pabco`.
6. `clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank`.
7. `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags`.
8. `selected_next_slice_with_target_gate_file_and_validation_scope`.

Gate A may select a new source-pack extraction, source-acquisition,
mapping/tolerance, source-packet, or runtime-accuracy slice only if it
names a concrete source locator or rights-safe packet and keeps all
exact-topology, metric, tolerance, material, negative-boundary, and
paired visible-test requirements explicit.

## Protected Boundaries

- The original split-rockwool grouped stack remains low-confidence
  `multileaf_screening_blend`, `Rw 41`, and is not fixed by PABCO
  closeout. The Uris 2006 lane remains
  `paused_waiting_rights_safe_source_packet`.
- PABCO rows remain context only:
  `PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730`,
  `PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745`,
  `PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035`,
  `PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611`,
  `PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358`,
  and `PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053`.
- PABCO `STC` values, report locators, QuietRock aliases, generic
  gypsum aliases, glass-fiber aliases, resilient-channel details,
  stud-depth/stud-gauge details, high-STC rows, indexed rows, and
  payload gaps do not promote DynEcho `Rw`, `R'w`, `Ln,w`, `DnT,w`,
  `Dn,w`, `DnT,A`, support, confidence, evidence, field outputs,
  route-card values, output-card status, or proposal/report copy.
- CertainTeed SilentFX / NRC ASTC remains context until v14 separates
  ASTC / field / flanking examples from lab runtime rows and metric
  ownership.
- GA-600 remains authoritative context until rights-safe current row
  payloads are available in the calculator corpus.
- Closed PABCO, Georgia-Pacific, National Gypsum, USG, ROCKWOOL,
  British Gypsum, and Knauf rows do not reopen from nearby locator
  context alone.
- Runtime, support, confidence, evidence, API, route-card,
  output-card, proposal/report, and workbench-input surfaces remain
  frozen.

Required boundary tokens:

- `pabco_gate_b_source_rows_are_not_runtime_import_approval`
- `pabco_gate_b_stc_values_and_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `pabco_gate_b_quietrock_es_530_pabco_type_x_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`
- `pabco_gate_b_glass_fiber_does_not_coalesce_with_local_rockwool_or_fix_uris_2006`
- `pabco_gate_b_resilient_channel_stud_depth_spacing_gauge_and_bearing_do_not_promote_generic_routes`
- `pabco_gate_b_pgd_w_449_24_indexed_payload_missing_blocks_runtime_import`
- `pabco_gate_b_rows_do_not_override_closed_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_anchors`
- `pabco_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `pabco_wood_stud_quietrock_rows_do_not_replace_existing_timber_or_generic_wood_stud_routes`
- `pabco_steel_stud_quietrock_rows_do_not_replace_existing_lsf_anchors`
- `pabco_resilient_channel_rows_do_not_promote_generic_resilient_bar_routes`
- `pabco_quietrock_multilayer_rows_do_not_promote_nrc_triple_leaf_or_local_mlv_routes`
- `pabco_high_stc_rows_do_not_promote_field_outputs_without_field_overlay`
- `pabco_indexed_or_summary_report_locator_rows_do_not_promote_runtime_truth_without_payload`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Validation

Completed for Gate A on 2026-05-03:

- focused v14 Gate A contract;
- continuity with PABCO Gate C, Gate B, Gate A,
  post-Georgia-Pacific Gate A, v13, Georgia-Pacific Gate C / Gate B /
  Gate A, National Gypsum Gate C / Gate B / Gate A, USG Gate C /
  Gate B / Gate A, ROCKWOOL Gate C / Gate B / Gate A, British Gypsum
  source gates, and the route/source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Focused v14 command:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts --maxWorkers=1`
