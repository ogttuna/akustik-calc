# Slice Plan - Georgia-Pacific Fire & Sound Assemblies Source Pack Extraction

Slice id: `georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1`

Status: GATE C CLOSED / V13 SELECTED

Gate A file:

`packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Gate A action:

`gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import`

Gate A status:

`georgia_pacific_fire_sound_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout`

Gate B file:

`packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Gate B action:

`gate_b_mapping_tolerance_decision_no_runtime`

Gate B status:

`georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout`

Gate C closeout file:

`packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Gate C status:

`closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row`

Selected v13 plan:

`docs/calculator/SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V13_PLAN.md`

Original selection status:

`selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import`

Selected by:

`packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`

## Objective

Extract the Georgia-Pacific Fire & Sound Assemblies source surface as a
no-runtime source-pack slice after `calculator_source_gap_revalidation_v12`
found it is the highest-ranked remaining official locator. This slice
must separate useful locator context from runtime-ready row truth.

The Georgia-Pacific resource is source-acquisition context, not a
runtime import. It can only progress by naming actual directory rows or
test reports and then preserving exact topology, `STC` metric context,
material aliases, tolerance ownership, negative boundaries, and paired
engine/web visible tests.

## Source Locator

Source label:

Georgia-Pacific Fire & Sound Assemblies

Source URL:

`https://www.buildgp.com/resources/assemblies`

Technical guide locators captured by Gate A:

- ToughRock Technical Guide:
  `https://www.buildgp.com/wp-content/uploads/2018/10/Toughrock-Technical-guide.pdf`
- DensGlass Technical Guide:
  `https://www.buildgp.com/wp-content/uploads/2018/11/DensGlass-Technical-Guide.pdf`
- DensGlass Shaftliner Shaftwall/Stairwell Systems Technical Guide:
  `https://www.buildgp.com/wp-content/uploads/2018/11/DensGlass-Shaftliner-shaftwell-stairwell-systems-technical-guide.pdf?x98189=`

Known posture from post-British-Gypsum source acquisition and v12:

- the resource is an official Georgia-Pacific planning / assembly
  context surface;
- it reports or points at `STC` context;
- it explicitly needs actual directory or test-report information
  before complete use;
- exact row payloads, exact assembly topology, source-material mapping,
  tolerance owner, and paired visible tests are not ready.

## Gate A Result

Gate A extracted representative Georgia-Pacific source rows as source
context only:

- `GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103`
- `GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331`
- `GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291`
- `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8`
- `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761`
- `GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363`

These rows cover interior steel partitions, exterior sheathing walls,
area-separation walls, and shaftwall/stairwell context. They name
`STC` ranges or values and report/design locators, but they do not
include complete fire-resistance-directory payloads, complete test
reports, full band curves, local material mapping, tolerance ownership,
or paired visible tests. Therefore Gate A selected Gate B
mapping/tolerance decision with no runtime import.

## Gate A Requirements

Gate A added:

`packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Landed artifacts:

1. `resource_surface_and_actual_directory_or_test_report_locator_capture`.
2. `fire_resistance_directory_and_assembly_payload_retrieval_policy`.
3. `wall_floor_ceiling_roof_family_boundary_matrix`.
4. `stc_metric_context_only_until_mapping_gate`.
5. `gp_material_alias_boundary_capture_for_densglass_toughrock_soundbreak_and_generic_gypsum`.
6. `negative_boundaries_against_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_and_triple_leaf_rows`.
7. `paired_engine_and_web_visible_test_plan_before_any_runtime_or_visible_movement`.
8. `selected_mapping_tolerance_or_closeout_next_slice_with_target_gate_file`.

Gate A extracted representative row candidates only as source context.
It does not treat a planning page, family label, fire design, `STC`
range/value, or report number as an exact runtime-ready acoustic row.

## Gate B Result

Gate B compared every extracted Georgia-Pacific row with the live
runtime and found no runtime-ready row. The resource remains useful
source context, but it still lacks actual directory/test-report
payloads, source-owned full-band curves or explicit metric rejection,
local material/topology mapping, tolerance ownership, and paired
engine/web visible tests.

Rows kept context-only by Gate B:

- `GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103`
- `GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331`
- `GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291`
- `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8`
- `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761`
- `GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363`

Gate B selected:

`packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

with:

`gate_c_closeout_and_next_slice_selection_no_runtime`

## Protected Boundaries

- `gp_planning_resource_does_not_count_as_a_runtime_ready_stc_source_row`
- `actual_directory_or_test_report_information_is_required_before_complete_use`
- `gp_context_does_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors`
- `georgia_pacific_stc_context_does_not_promote_dyn_echo_rw_or_field_outputs`
- `gp_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`
- `gp_wall_floor_ceiling_roof_context_does_not_cross_promote_route_families`
- `georgia_pacific_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`
- `georgia_pacific_gate_b_actual_directory_or_test_report_payload_missing_blocks_runtime_import`
- `georgia_pacific_gate_b_source_rows_are_not_runtime_import_approval`
- `georgia_pacific_gate_b_stc_ranges_and_sound_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `georgia_pacific_gate_b_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`
- `georgia_pacific_gate_b_exterior_sheathing_shaftliner_area_separation_and_stairwell_rows_do_not_promote_generic_wall_routes`
- `georgia_pacific_gate_b_rows_do_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors`
- `georgia_pacific_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`

Row boundaries:

- `gp_toughrock_interior_stc_range_rows_do_not_replace_existing_lsf_or_timber_routes`
- `gp_densglass_exterior_sheathing_rows_do_not_promote_generic_interior_wall_or_lined_masonry`
- `gp_shaftliner_area_separation_rows_do_not_promote_simple_double_leaf_no_stud_or_triple_leaf_routes`
- `gp_sound_report_numbers_are_locators_not_full_band_curves`
- `gp_stc_ranges_are_not_single_rw_values`
- `gp_toughrock_ul_u465_gate_b_stc_range_does_not_replace_lsf_anchor_or_timber_routes`
- `gp_toughrock_ul_u411_gate_b_stc_range_does_not_promote_dyn_echo_rw_or_field_outputs`
- `gp_toughrock_gp_wa_120_04_gate_b_area_separation_stc66_does_not_promote_simple_double_leaf_or_triple_leaf_routes`
- `gp_densglass_ul_u305_u337_gate_b_exterior_sheathing_stc30_34_does_not_promote_generic_interior_wall_routes`
- `gp_densglass_ul_u425_gate_b_exterior_sheathing_stc55_59_does_not_replace_lsf_or_lined_masonry_anchors`
- `gp_densglass_shaftliner_ul_v473_gate_b_stc48_remains_shaftwall_context_only`

Family boundaries:

- `interior_steel_partition_rows_do_not_replace_existing_lsf_timber_or_triple_leaf_routes`
- `exterior_sheathing_wall_rows_do_not_promote_generic_interior_wall_or_lined_masonry_routes`
- `area_separation_wall_rows_do_not_promote_simple_double_leaf_no_stud_or_triple_leaf_routes`
- `shaftwall_stairwell_rows_do_not_promote_simple_wall_lsf_or_lined_masonry_routes`
- `floor_ceiling_roof_context_from_gp_resources_does_not_promote_lnw_or_impact_outputs`

## Original Rockwool Defect Status

The original split-rockwool grouped stack remains low-confidence
`multileaf_screening_blend`, `Rw 41`, and not source-validated. The
Uris 2006 source lane remains
`paused_waiting_rights_safe_source_packet`.

Georgia-Pacific `STC` or assembly context is not a substitute for the
two-cavity rockwool / internal-board full curve evidence needed to
fix that route.

## Runtime Gate

Runtime import remains blocked until a future gate names all of:

- exact Georgia-Pacific row or test-report locator;
- exact live topology mapping;
- `STC` / `Rw` / field-output metric policy;
- material mapping for Georgia-Pacific-specific products and generic
  local equivalents;
- tolerance owner;
- protected negative boundaries against closed source packs and
  route-family drift;
- paired engine and web visible tests.

Until then, runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, and workbench-input surfaces stay frozen.

## Gate C Result

Gate C closed this source-pack slice no-runtime and selected
`calculator_source_gap_revalidation_v13`. The closeout carries forward
all Gate B blockers and keeps runtime, support, confidence, evidence,
API, route-card, output-card, proposal/report, and workbench-input
surfaces frozen.

## v13 Requirements

Next file:

`packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`

Next action:

`gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout`

v13 must re-rank source readiness after this closeout. Runtime remains
blocked unless all of the following are named for a specific row:

- actual directory listing or test-report payload, not just a planning
  page or guide excerpt;
- exact live route-family mapping;
- `STC` range/value to DynEcho metric policy, including why it can or
  cannot affect `Rw`, `R'w`, `Dn,w`, `DnT,w`, and `DnT,A`;
- DensGlass / ToughRock / SoundBreak / generic gypsum alias policy;
- insulation, stud, resilient-channel, shaftliner, exterior sheathing,
  and area-separation topology mapping;
- tolerance owner;
- negative boundaries against closed National Gypsum / USG / ROCKWOOL /
  British Gypsum / Knauf rows and the Uris 2006 split-rockwool lane;
- paired engine and web visible tests before runtime or UI movement.

## Validation

Required for Gate B / Gate C:

- focused Georgia-Pacific Gate B contract;
- continuity with Georgia-Pacific Gate A, v12, National Gypsum Gate C /
  Gate B / Gate A, v11,
  USG Gate C / Gate B / Gate A, v10, ROCKWOOL Gate C / Gate B /
  Gate A, post-British-Gypsum acquisition, v9, and the route/source
  risk register;
- `pnpm calculator:gate:current`;
- restore `apps/web/next-env.d.ts` to `.next-typecheck` if the build
  rewrites it;
- `git diff --check`.

Focused v12 selection command:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts --maxWorkers=1`

Focused future Gate A command:

`pnpm --filter @dynecho/engine exec vitest run src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`

Focused Gate B command:

`pnpm --filter @dynecho/engine exec vitest run src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts --maxWorkers=1`

Focused Gate C command:

`pnpm --filter @dynecho/engine exec vitest run src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1`

Gate C validation completed on 2026-05-02:

- focused Gate C closeout contract: 1 file / 7 tests passed;
- route-source risk register contract: 1 file / 4 tests passed;
- continuity with Gate C / Gate B / Gate A / v12 / National Gypsum /
  USG / ROCKWOOL / British Gypsum source gates and the route-source
  risk register: 18 files / 126 tests passed;
- `pnpm calculator:gate:current`: engine 209 files / 1143 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build;
- `git diff --check` passed.

Gate B validation completed on 2026-05-02:

- focused Gate B contract: 1 file / 7 tests passed;
- continuity with Gate B / Gate A / v12 / National Gypsum / USG /
  ROCKWOOL / British Gypsum source gates and the route-source risk
  register: 17 files / 119 tests passed;
- `pnpm calculator:gate:current`: engine 208 files / 1136 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build;
- `git diff --check` passed.

Selection validation was landed by v12:

- focused v12 Gate A contract: 1 file / 8 tests passed;
- continuity suite including National Gypsum / USG / ROCKWOOL /
  British Gypsum source gates and the route-source risk register:
  15 files / 104 tests passed;
- `pnpm calculator:gate:current`: engine 206 files / 1121 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build;
- `git diff --check` passed.

Gate A validation completed on 2026-05-02:

- focused Gate A contract: 1 file / 8 tests passed;
- continuity with v12, National Gypsum / USG / ROCKWOOL / British
  Gypsum source gates, v9, and the route-source risk register:
  16 files / 112 tests passed;
- `pnpm calculator:gate:current`: engine 207 files / 1129 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after build;
- `git diff --check` passed.
