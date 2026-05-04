# Slice Plan - USG Acoustical Assemblies Source Pack Extraction

Slice id: `usg_acoustical_assemblies_source_pack_extraction_v1`

Status: GATE C CLOSED / SELECTED `calculator_source_gap_revalidation_v11`
(Gate C closed no-runtime 2026-05-02 after Gate B found no
runtime-ready row).

Selected first file:

`packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Selected first action:

`gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import`

Gate A status:

`usg_acoustical_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Gate B implementation file:

`packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Gate B action:

`gate_b_mapping_tolerance_decision_no_runtime`

Gate B status:

`usg_gate_b_found_no_runtime_ready_row_selected_closeout`

Gate C implementation file:

`packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Gate C status:

`closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row`

Selected next slice:

`calculator_source_gap_revalidation_v11`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`

Prior selection status:

`selected_usg_acoustical_assemblies_source_pack_extraction_after_v10_rerank_found_official_floor_wall_stc_iic_rows_but_no_runtime_ready_import`

## Objective

Extract row-level source context from the official USG Acoustical
Assemblies SA200 locator without importing values into runtime. This
slice is about source-row capture, family boundaries, and blocker
ownership only; it must not change runtime, support, confidence,
evidence, API, route-card, output-card, proposal/report, output support,
or workbench-input behavior.

## Source Locator

Primary locator:

`https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf`

Gate A extracted rows:

- `LEVELROCK_I_JOIST_SRM25_CARPET`: floor/ceiling Levelrock row,
  `IIC 77`, `STC 65`.
- `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`: floor/ceiling Levelrock
  range row, `IIC 55-58`, `STC 60-64`.
- `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`: floor/ceiling Levelrock row,
  `IIC 61`, `STC 65`.
- `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`: floor/ceiling Levelrock row,
  `IIC 56`, `STC 61`.
- `USG_STEEL_FRAMED_A1`: steel-framed partition row, `STC 40`, test
  `USG-860808`.
- `USG_STEEL_FRAMED_A8`: steel-framed partition row, `STC 58`, test
  `RAL-TL-83-215`.

Reported metrics:

- `STC`
- `IIC`

These are not direct DynEcho `Rw`, `R'w`, `Ln,w`, `DnT,w`, `Dn,w`, or
`DnT,A` runtime imports. Gate A must keep them as source context until a
later mapping/tolerance gate owns metric policy and exact topology.

## Gate A Requirements

Gate A added:

`packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Required artifacts:

1. `usg_sa200_source_locator_and_retrieval_context`.
2. `wall_floor_ceiling_family_boundary_matrix`.
3. `row_locator_table_for_named_levelrock_i_joist_and_truss_examples`.
4. `stc_iic_metric_policy_context_only_until_mapping_gate`.
5. `levelrock_srm_srb_i_joist_truss_material_and_topology_capture`.
6. `negative_boundaries_for_generated_floor_wall_triple_leaf_rockwool_british_gypsum_and_knauf_rows`.
7. `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags`.
8. `selected_gate_b_mapping_tolerance_or_closeout_next_step_without_runtime_import`.

Gate A now selects Gate B mapping/tolerance:

`packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`

`gate_b_mapping_tolerance_decision_no_runtime`

## Gate B Result

Gate B added:

`packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Gate B keeps all extracted rows context-only:

- `LEVELROCK_I_JOIST_SRM25_CARPET`: blocked from floor/wall import until
  Levelrock / I-joist / SRM-25 / carpet topology, `STC` / `IIC` metric
  policy, tolerance, and visible tests exist.
- `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`: blocked from single-value
  runtime import because `IIC 55-58` / `STC 60-64` is a range without
  range policy.
- `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`: context-only because SRB board
  is not SRM-25 mat or generic resilient-layer truth.
- `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`: context-only because truss
  topology is not I-joist, open-web, or generated-floor truth.
- `USG_STEEL_FRAMED_A1`: context-only because Sheetrock Firecode,
  steel-stud gauge/spacing, `STC` to `Rw` policy, curve owner,
  tolerance, and LSF anchor precedence tests are missing.
- `USG_STEEL_FRAMED_A8`: context-only because Sheetrock Firecode C,
  Thermafiber SAFB, one-side RC channel, `STC` curve policy, tolerance,
  and triple-leaf / near-source negatives are missing.

Gate B selects Gate C closeout:

`packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

`gate_c_closeout_and_next_slice_selection_no_runtime`

## Gate C Result

Gate C added:

`packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C closes the USG source-pack extraction slice no-runtime. Gate A
extracted the source rows, Gate B proved no row is runtime-ready, and
Gate C carries those row blockers forward as closeout evidence rather
than import permission.

Gate C selected:

`calculator_source_gap_revalidation_v11`

First file:

`packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`

First action:

`gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`

V11 must re-rank closed USG / ROCKWOOL / British Gypsum / Knauf rows,
the paused Uris 2006 split-rockwool lane, National Gypsum and
Georgia-Pacific locators, CLT / generated-floor / no-stud / lined-heavy
families, and historical blockers before any runtime or visible
behavior moves.

## Protected Boundaries

- `usg_stc_iic_rows_do_not_directly_promote_dyn_echo_rw_lnw_or_field_outputs`
- `usg_floor_ceiling_rows_do_not_become_wall_or_triple_leaf_truth`
- `usg_levelrock_srm_srb_i_joist_truss_rows_do_not_promote_generated_floor_without_mapping_tolerance`
- `usg_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `usg_sheetrock_thermafiber_rows_do_not_coalesce_with_generic_gypsum_rockwool_or_glass_fiber_without_mapping`
- `usg_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `usg_gate_b_source_rows_are_not_runtime_import_approval`
- `usg_gate_b_stc_iic_test_numbers_do_not_promote_dyn_echo_rw_lnw_or_field_outputs`
- `usg_gate_b_levelrock_srm_srb_i_joist_truss_do_not_promote_generated_floor_or_wall_routes`
- `usg_gate_b_floor_rows_do_not_override_exact_or_bound_floor_catalog_without_mapping_tolerance`
- `usg_gate_b_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `usg_gate_b_sheetrock_thermafiber_rc_channel_do_not_coalesce_with_generic_gypsum_rockwool_glass_fiber_or_resilient_bar`
- `usg_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row`
- The original split-rockwool grouped stack remains
  `multileaf_screening_blend`, `Rw 41`, low confidence, and blocked on
  `paused_waiting_rights_safe_source_packet`.
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Validation

Required for Gate A:

- focused USG Gate A contract;
- continuity with v10, ROCKWOOL Gate C, ROCKWOOL Gate B, ROCKWOOL Gate A,
  post-British-Gypsum acquisition, v9, and the route/source risk
  register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Current selected validation command after Gate A:

`pnpm --filter @dynecho/engine exec vitest run src/usg-acoustical-assemblies-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`

Current selected validation command after Gate B:

`pnpm --filter @dynecho/engine exec vitest run src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1`

Current selected validation command after Gate C:

`pnpm --filter @dynecho/engine exec vitest run src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1`

Validation completed on 2026-05-02:

- focused USG Gate A contract: 1 file / 6 tests passed;
- USG Gate A / v10 / ROCKWOOL Gate C / ROCKWOOL Gate B / ROCKWOOL Gate A
  / post-British-Gypsum acquisition / v9 / route-source-risk
  continuity: 8 files / 54 tests passed;
- `pnpm calculator:gate:current`: engine 199 files / 1071 tests passed,
  web 47 files / 227 tests passed / 18 skipped, build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; whitespace guard passed.

Validation completed for Gate C on 2026-05-02:

- focused USG Gate C closeout contract: 1 file / 7 tests passed;
- USG Gate C / Gate B / Gate A / v10 / ROCKWOOL Gate C / ROCKWOOL Gate B
  / ROCKWOOL Gate A / post-British-Gypsum acquisition / v9 /
  route-source-risk continuity: 10 files / 68 tests passed;
- `pnpm calculator:gate:current`: engine 201 files / 1085 tests
  passed, web 47 files / 227 tests passed / 18 skipped, build 5 / 5
  passed with known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.

Validation completed for Gate B on 2026-05-02:

- focused USG Gate B contract: 1 file / 7 tests passed;
- USG Gate B / Gate A / v10 / ROCKWOOL Gate C / ROCKWOOL Gate B /
  ROCKWOOL Gate A / post-British-Gypsum acquisition / v9 /
  route-source-risk continuity: 9 files / 61 tests passed;
- `pnpm calculator:gate:current`: engine 200 files / 1078 tests
  passed, web 47 files / 227 tests passed / 18 skipped, build 5 / 5
  passed with known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; whitespace guard passed.
