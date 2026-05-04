# Slice Plan - Calculator Source Gap Revalidation v15

Slice id: `calculator_source_gap_revalidation_v15`

Status: GATE A LANDED / SELECTED ROUTE-FAMILY LANE-DRIFT WATCHLIST

Landed first file:

`packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`

Landed first action:

`gate_a_revalidate_source_accuracy_gap_order_after_certainteed_source_pack_closeout`

Selection status:

`closed_certainteed_silentfx_nrc_astc_source_pack_no_runtime_and_selected_source_gap_revalidation_v15_because_gate_b_found_no_runtime_ready_row`

Selected by:

`certainteed_silentfx_nrc_astc_source_pack_extraction_v1` Gate C

Prior CertainTeed Gate C file:

`packages/engine/src/post-certainteed-silentfx-nrc-astc-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Prior CertainTeed Gate B status:

`certainteed_gate_b_found_no_runtime_ready_row_selected_closeout`

Gate A status:

`selected_route_family_lane_drift_common_stack_watchlist_after_v15_rerank_found_no_runtime_ready_source_candidate_and_user_prioritized_rockwool_like_lane_errors`

Selected next slice:

`route_family_lane_drift_common_stack_watchlist_v1`

Selected next file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`

Selected next action:

`gate_a_inventory_common_wall_floor_lane_drift_watchlist_no_runtime`

Selected next planning surface:

`docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`

## Objective

Re-rank source-readiness and accuracy work after the CertainTeed
SilentFX / NRC ASTC source-pack slice closed no-runtime. This is a
no-runtime revalidation gate: it must not move runtime values, support,
confidence, evidence, API shape, route cards, output cards,
proposal/report copy, output support, or workbench-input behavior.

Gate A selected a no-runtime route-family / source-lane drift watchlist
because no source-ready runtime candidate exists and the user priority
is to catch rockwool-like wrong-lane errors on common wall/floor stacks
before any future runtime or source promotion.

## Inputs

- CertainTeed Gate A / Gate B / Gate C closeout summary.
- CertainTeed NRC ASTC field / flanking context, `CTG-2481` product
  `STC` context, OneSource payload gaps, SilentFX / Type X / generic
  gypsum alias blockers, 25 gauge steel-stud high-rise context, and
  `STC` -> DynEcho metric-policy blockers.
- Paused Uris 2006 triple-leaf source-packet lane.
- Closed CertainTeed, PABCO, Georgia-Pacific, National Gypsum, USG,
  ROCKWOOL, British Gypsum, and Knauf source rows and negative
  boundaries.
- Gypsum Association GA-600 and remaining official locator context.
- CLT / mass-timber, generated floor, no-stud, lined-heavy, and
  historical blocked families.

## Gate A Requirements

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts`

Required artifacts:

1. `certainteed_gate_a_gate_b_gate_c_closeout_summary`.
2. `certainteed_astc_stc_onesource_material_alias_and_family_boundary_blockers`.
3. `paused_uris_2006_triple_leaf_source_packet_lane_status`.
4. `closed_certainteed_pabco_georgia_pacific_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh`.
5. `gypsum_association_ga600_remaining_official_locator_rerank_after_certainteed`.
6. `clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank`.
7. `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags`.
8. `selected_next_slice_with_target_gate_file_and_validation_scope`.

Landed artifacts:

- `certainteed_gate_a_gate_b_gate_c_closeout_summary`;
- `paused_uris_2006_triple_leaf_source_packet_lane_status`;
- `standing_lane_misclassification_monitoring_mandate`;
- `note_test_document_or_easy_fix`;
- `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags`;
- selected
  `route_family_lane_drift_common_stack_watchlist_v1` with
  `packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`.

Gate A may select a new source-pack extraction, source-acquisition,
mapping/tolerance, source-packet, or runtime-accuracy slice only if it
names a concrete source locator or rights-safe packet and keeps all
exact-topology, metric, tolerance, material, negative-boundary, and
paired visible-test requirements explicit.

## Protected Boundaries

- The original split-rockwool grouped stack remains low-confidence
  `multileaf_screening_blend`, `Rw 41`, and is not fixed by
  CertainTeed closeout. The Uris 2006 lane remains
  `paused_waiting_rights_safe_source_packet`.
- CertainTeed rows remain context only:
  `NRC_CERTAINTEED_SILENTFX_ASTC_HIGH_RISE_22_EXAMPLES_2018`,
  `CERTAINTEED_CTG_2481_SILENTFX_U465_STC57_PRODUCT_DATA_EXAMPLE`,
  and `CERTAINTEED_CTG_2481_SILENTFX_U309_STC51_PRODUCT_DATA_EXAMPLE`.
- CertainTeed ASTC / field / flanking context, product `STC` values,
  OneSource locators, SilentFX aliases, Type X aliases, generic gypsum
  aliases, QuietRock aliases, PABCO Type X aliases, high-rise
  steel-stud context, and payload gaps do not promote DynEcho `Rw`,
  `R'w`, `Ln,w`, `DnT,w`, `Dn,w`, `DnT,A`, support, confidence,
  evidence, field outputs, route-card values, output-card status, or
  proposal/report copy.
- GA-600 remains authoritative context until rights-safe current row
  payloads are available in the calculator corpus.
- Closed CertainTeed, PABCO, Georgia-Pacific, National Gypsum, USG,
  ROCKWOOL, British Gypsum, and Knauf rows do not reopen from nearby
  locator context alone.
- Runtime, support, confidence, evidence, API, route-card,
  output-card, proposal/report, and workbench-input surfaces remain
  frozen.

Standing boundary:

- `standing_lane_misclassification_monitoring_mandate`: every future
  calculator slice must keep looking for wrong route-family/source-lane
  behavior on frequent stacks. If suspicious behavior is found, use
  `note_test_document_or_easy_fix`: reproduce with a focused test,
  document it when not safe to fix immediately, or fix it with
  regression tests if the change is small and bounded.

Required boundary tokens:

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
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Validation

Completed for Gate A on 2026-05-03:

- focused v15 Gate A contract: 1 file / 9 tests;
- continuity with CertainTeed Gate C, Gate B, Gate A, v14, PABCO Gate
  C / Gate B / Gate A, and the route-source risk register: 9 files /
  67 tests;
- `pnpm calculator:gate:current`: engine 219 files / 1222 tests; web
  47 files / 227 passed + 18 skipped; repo build 5 / 5 with known
  non-fatal `sharp/@img` warnings; whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after final documentation sync.

Focused v15 command:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v15-gate-a-contract.test.ts --maxWorkers=1`
