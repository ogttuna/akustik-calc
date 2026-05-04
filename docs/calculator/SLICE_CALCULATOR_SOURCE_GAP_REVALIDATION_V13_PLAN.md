# Slice Plan - Calculator Source Gap Revalidation v13

Slice id: `calculator_source_gap_revalidation_v13`

Status: GATE A LANDED / POST-GEORGIA-PACIFIC ACQUISITION SELECTED

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_georgia_pacific_source_pack_closeout`

Selection status:

`closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row`

Gate A result:

`calculator_source_gap_revalidation_v13` selected the
post-Georgia-Pacific source acquisition slice:

`calculator_post_georgia_pacific_source_acquisition_v1`

Selected next file:

`packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`

Selected next action:

`gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import`

Selected next planning surface:

`docs/calculator/SLICE_CALCULATOR_POST_GEORGIA_PACIFIC_SOURCE_ACQUISITION_V1_PLAN.md`

Gate A selection status:

`selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime`

Selection validation:

Georgia-Pacific Gate C validation completed on 2026-05-02: focused Gate
C closeout 1 file / 7 tests; route-source risk register 1 file / 4
tests; continuity 18 files / 126 tests; `pnpm calculator:gate:current`
engine 209 files / 1143 tests, web 47 files / 227 passed + 18 skipped,
build 5 / 5 with known non-fatal `sharp/@img` warnings, whitespace
guard passed, `apps/web/next-env.d.ts` restored to `.next-typecheck`,
and `git diff --check` passed. v13 Gate A validation completed on
2026-05-02: focused v13 Gate A 1 file / 8 tests; route-source risk
register 1 file / 4 tests; continuity 19 files / 134 tests;
`pnpm calculator:gate:current` engine 210 files / 1151 tests, web 47
files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
`sharp/@img` warnings, whitespace guard passed,
`apps/web/next-env.d.ts` restored to `.next-typecheck`, and
`git diff --check` passed.

Prior Georgia-Pacific Gate B status:

`georgia_pacific_gate_b_found_no_runtime_ready_row_selected_closeout`

Prior Georgia-Pacific Gate C closeout file:

`packages/engine/src/post-georgia-pacific-fire-sound-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

## Objective

Re-rank source-readiness and accuracy work after the Georgia-Pacific
Fire & Sound Assemblies source-pack slice closed no-runtime. This is a
no-runtime revalidation gate: it must not move runtime values, support,
confidence, evidence, API shape, route cards, output cards,
proposal/report copy, output support, or workbench-input behavior.

## Inputs

- Georgia-Pacific Gate A / Gate B / Gate C closeout summary.
- Georgia-Pacific `STC` ranges, single `STC` values, sound-report
  locators, DensGlass / ToughRock / SoundBreak / generic gypsum alias
  blockers, exterior-sheathing / shaftwall / area-separation family
  blockers, and field-output blockers.
- Paused Uris 2006 triple-leaf source-packet lane.
- Closed National Gypsum, USG, ROCKWOOL, British Gypsum, and Knauf
  source rows and negative boundaries.
- Remaining official locator / source-acquisition context after
  Georgia-Pacific.
- CLT / mass-timber, generated floor, no-stud, lined-heavy, and
  historical blocked families.

## Gate A Requirements

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`

Required artifacts:

1. `georgia_pacific_gate_a_gate_b_gate_c_closeout_summary`.
2. `georgia_pacific_stc_range_sound_report_material_alias_and_family_boundary_blockers`.
3. `paused_uris_2006_triple_leaf_source_packet_lane_status`.
4. `closed_national_gypsum_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh`.
5. `remaining_official_locator_and_source_acquisition_rerank_after_georgia_pacific`.
6. `clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank`.
7. `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags`.
8. `selected_next_slice_with_target_gate_file_and_validation_scope`.

Gate A may select a new source-pack extraction, source-acquisition, or
mapping/tolerance slice only if it names a concrete source locator or
source packet and keeps all exact-topology, metric, tolerance,
material, negative-boundary, and paired visible-test requirements
explicit.

## Protected Boundaries

- The original split-rockwool grouped stack remains low-confidence
  `multileaf_screening_blend`, `Rw 41`, and is not fixed by the
  Georgia-Pacific closeout. The Uris 2006 lane remains
  `paused_waiting_rights_safe_source_packet`.
- Georgia-Pacific rows remain context only:
  `GP_TOUGHROCK_INTERIOR_STEEL_UL_U465_STC45_49_RAL_TL99_103`,
  `GP_TOUGHROCK_INTERIOR_STEEL_UL_U411_STC55_59_RAL_TL09_331`,
  `GP_TOUGHROCK_SHAFTLINER_AREA_SEPARATION_GP_WA_120_04_STC66_RAL_TL_10_291`,
  `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U305_U337_STC30_34_OR_64_8`,
  `GP_DENSGLASS_FIREGUARD_SHEATHING_UL_U425_STC55_59_IRC_IR_761`,
  and `GP_DENSGLASS_SHAFTLINER_UL_V473_1HR_RC_STC48_RAL_TL09_363`.
- Georgia-Pacific `STC` ranges, sound-report locators, DensGlass /
  ToughRock / SoundBreak aliases, exterior sheathing, shaftwall, and
  area-separation rows do not promote DynEcho `Rw`, `R'w`, `Ln,w`,
  `DnT,w`, `Dn,w`, `DnT,A`, support, confidence, evidence, field
  outputs, route-card values, output-card status, or proposal/report
  copy.
- Closed Georgia-Pacific, National Gypsum, USG, ROCKWOOL, British
  Gypsum, and Knauf rows do not reopen from nearby locator context
  alone.
- Runtime, support, confidence, evidence, API, route-card,
  output-card, proposal/report, and workbench-input surfaces remain
  frozen.

Required boundary tokens:

- `georgia_pacific_gate_b_actual_directory_or_test_report_payload_missing_blocks_runtime_import`
- `georgia_pacific_gate_b_source_rows_are_not_runtime_import_approval`
- `georgia_pacific_gate_b_stc_ranges_and_sound_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `georgia_pacific_gate_b_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`
- `georgia_pacific_gate_b_exterior_sheathing_shaftliner_area_separation_and_stairwell_rows_do_not_promote_generic_wall_routes`
- `georgia_pacific_gate_b_rows_do_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors`
- `georgia_pacific_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Validation

Required for Gate A:

- focused v13 Gate A contract;
- continuity with Georgia-Pacific Gate C, Gate B, Gate A, v12,
  National Gypsum Gate C / Gate B / Gate A, USG Gate C / Gate B /
  Gate A, ROCKWOOL Gate C / Gate B / Gate A, British Gypsum source
  gates, and the route/source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Focused future v13 command:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts --maxWorkers=1`
