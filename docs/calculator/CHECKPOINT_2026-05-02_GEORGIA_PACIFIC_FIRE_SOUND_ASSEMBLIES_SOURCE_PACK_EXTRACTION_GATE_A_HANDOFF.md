# Checkpoint - Georgia-Pacific Fire & Sound Assemblies Source Pack Extraction Gate A

Date: 2026-05-02

Slice: `georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1`

Gate landed:

`gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import`

Implementation:

`packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Status:

`georgia_pacific_fire_sound_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Selected next file:

`packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Selected next action:

`gate_b_mapping_tolerance_decision_no_runtime`

## What Landed

Gate A extracted the Georgia-Pacific Fire & Sound Assemblies source
surface as no-runtime context. The official planning page and technical
guide rows are useful locator context, but not runtime-ready acoustic
truth.

Primary source page:

`https://www.buildgp.com/resources/assemblies`

Technical guide locators:

- `https://www.buildgp.com/wp-content/uploads/2018/10/Toughrock-Technical-guide.pdf`
- `https://www.buildgp.com/wp-content/uploads/2018/11/DensGlass-Technical-Guide.pdf`
- `https://www.buildgp.com/wp-content/uploads/2018/11/DensGlass-Shaftliner-shaftwell-stairwell-systems-technical-guide.pdf?x98189=`

The official page says the assemblies are planning context and complete
information requires the actual fire-resistance directory or test
report. Gate A therefore keeps every row `no_runtime_import`.

## Extracted Context Rows

Rows captured as context only:

- `GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103`
- `GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331`
- `GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291`
- `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8`
- `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761`
- `GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363`

Covered source families:

- interior steel partitions;
- exterior sheathing walls;
- area-separation walls;
- shaftwall / stairwell systems.

Captured metric context:

- `STC` ranges and individual `STC` values;
- fire rating context;
- UL / ULC / GA / WHI design references;
- sound report or test reference locators.

Missing before any runtime import:

- actual directory listing or test report payload;
- exact live topology mapping;
- full band curves or an owned `STC` to DynEcho metric policy;
- DensGlass / ToughRock / SoundBreak / generic gypsum alias policy;
- insulation, stud, resilient-channel, shaftliner, exterior sheathing,
  and area-separation topology mapping;
- tolerance owner;
- paired engine and web visible tests.

## Protected Boundaries

- `gp_planning_resource_does_not_count_as_a_runtime_ready_stc_source_row`
- `actual_directory_or_test_report_information_is_required_before_complete_use`
- `gp_context_does_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors`
- `georgia_pacific_stc_context_does_not_promote_dyn_echo_rw_or_field_outputs`
- `gp_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`
- `gp_wall_floor_ceiling_roof_context_does_not_cross_promote_route_families`
- `georgia_pacific_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

Row boundaries:

- `gp_toughrock_interior_stc_range_rows_do_not_replace_existing_lsf_or_timber_routes`
- `gp_densglass_exterior_sheathing_rows_do_not_promote_generic_interior_wall_or_lined_masonry`
- `gp_shaftliner_area_separation_rows_do_not_promote_simple_double_leaf_no_stud_or_triple_leaf_routes`
- `gp_sound_report_numbers_are_locators_not_full_band_curves`
- `gp_stc_ranges_are_not_single_rw_values`

## Original Rockwool Defect

The original split-rockwool grouped stack is not fixed by this gate.
It remains:

- `multileaf_screening_blend`;
- `Rw 41`;
- low confidence;
- not source-validated;
- blocked by the missing Uris 2006 source packet and local
  material/effect-model proof.

Georgia-Pacific `STC` context must not be used as a substitute for
two-cavity rockwool triple-leaf curve evidence.

## Runtime / Visible Surface Status

No runtime or visible behavior moved:

- runtime: frozen;
- support: frozen;
- confidence: frozen;
- evidence: frozen;
- API: frozen;
- route-card: frozen;
- output-card: frozen;
- proposal/report: frozen;
- workbench-input: frozen.

## Next Gate

Run Georgia-Pacific Gate B mapping/tolerance decision:

`packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Gate B must either close the slice no-runtime or name a complete
source-owned row, metric policy, material/topology mapping, tolerance
owner, negative boundaries, and paired engine/web visible tests before
any runtime or UI movement.

## Validation

Validation completed on 2026-05-02:

- focused Georgia-Pacific Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`
  passed: 1 file / 8 tests.
- continuity with v12, National Gypsum Gate C / Gate B / Gate A, v11,
  USG Gate C / Gate B / Gate A, v10, ROCKWOOL Gate C / Gate B /
  Gate A, post-British-Gypsum acquisition, v9, and the route/source
  risk register passed: 16 files / 112 tests.
- `pnpm calculator:gate:current` passed: engine 207 files / 1129
  tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed.
- `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  build side-effect.
- `git diff --check` passed.
