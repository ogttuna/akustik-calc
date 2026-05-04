# Slice Plan - Calculator Source Gap Revalidation v12

Slice id: `calculator_source_gap_revalidation_v12`

Status: GATE A LANDED / SELECTED GEORGIA-PACIFIC SOURCE PACK EXTRACTION

Selected first file:

`packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`

Selected first action:

`gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout`

Selection status:

`selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import`

Prior National Gypsum Gate B status:

`national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout`

Prior National Gypsum Gate C status:

`closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row`

Selected next slice:

`georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1`

Selected next file:

`packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Selected next action:

`gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import`

## Objective

Re-rank source-readiness and accuracy work after the National Gypsum
Fire & Sound Assembly Selector source-pack slice closed no-runtime.
This is a no-runtime revalidation gate: it must not move runtime
values, support, confidence, evidence, API shape, route cards, output
cards, proposal/report copy, output support, or workbench-input
behavior.

## Inputs

- National Gypsum Gate A / Gate B / Gate C closeout summary.
- National Gypsum `STC`, report-locator, `STC N/A`, Fire-Shield,
  SoundBreak, eXP Shaftliner, glass-fiber, resilient-channel, CT-stud,
  H-stud, load-bearing, area-separation, shaftwall, and roof-ceiling
  blockers.
- Paused Uris 2006 triple-leaf source-packet lane.
- Closed USG, ROCKWOOL, British Gypsum, and Knauf source rows and
  negative boundaries.
- Georgia-Pacific / remaining official locator context.
- CLT / mass-timber, generated floor, no-stud, lined-heavy, and
  historical blocked families.

## Gate A Requirements

Gate A should add:

`packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`

Required artifacts:

1. `national_gypsum_gate_a_gate_b_gate_c_closeout_summary`.
2. `national_gypsum_stc_report_locator_stc_na_and_material_alias_blockers`.
3. `paused_uris_2006_triple_leaf_source_packet_lane_status`.
4. `closed_usg_rockwool_british_gypsum_and_knauf_rows_with_negative_boundary_refresh`.
5. `georgia_pacific_remaining_official_locator_and_other_source_acquisition_rerank`.
6. `clt_mass_timber_generated_floor_no_stud_lined_heavy_and_historical_blocker_rerank`.
7. `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags`.
8. `selected_next_slice_with_target_gate_file_and_validation_scope`.

Gate A may select a new source-pack extraction, source-acquisition, or
mapping/tolerance slice only if it names a concrete source locator or
source packet and keeps all exact-topology, metric, tolerance,
material, negative-boundary, and paired visible-test requirements
explicit.

## Gate A Result

Gate A landed no-runtime in:

`packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`

It selected Georgia-Pacific Fire & Sound Assemblies as the next
no-runtime source-pack extraction because it is the highest-ranked
remaining official locator after National Gypsum, USG, ROCKWOOL,
British Gypsum, and Knauf rows all stayed runtime-blocked.

The selected Georgia-Pacific resource is not runtime-ready. The next
Gate A must capture the resource surface, actual directory or
test-report locator policy, family boundaries, `STC` metric context,
Georgia-Pacific material alias boundaries, negative boundaries, and
paired visible-test plan before any runtime or visible movement.

Selected Georgia-Pacific planning surface:

`docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`

Protected v12 result token:

`selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import`

## Protected Boundaries

- The original split-rockwool grouped stack remains low-confidence
  `multileaf_screening_blend`, `Rw 41`, and is not fixed by the
  National Gypsum closeout. The Uris 2006 lane remains
  `paused_waiting_rights_safe_source_packet`.
- `NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50`,
  `NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44`,
  `NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51`,
  `NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43`, and
  `NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA` remain source context
  only.
- National Gypsum `STC`, report locators, and `STC N/A` do not promote
  DynEcho `Rw`, `R'w`, `Ln,w`, `DnT,w`, `Dn,w`, `DnT,A`, support,
  confidence, evidence, field outputs, route-card values, output-card
  status, or proposal/report copy.
- Fire-Shield, SoundBreak, eXP Shaftliner, glass fiber, resilient
  channel, CT studs, H-studs, load-bearing studs, wood side frames, and
  roof-truss rows do not coalesce with generic gypsum, local rockwool,
  glass fiber, generic mineral wool, generic resilient bar, MLV, USG,
  Knauf, British Gypsum, ROCKWOOL, LSF, lined-masonry, no-stud, floor,
  roof, or triple-leaf routes without source/tolerance ownership.
- Closed National Gypsum, USG, ROCKWOOL, British Gypsum, and Knauf rows
  do not reopen from nearby locator context alone.
- Runtime, support, confidence, evidence, API, route-card, output-card,
  proposal/report, and workbench-input surfaces remain frozen.

Required boundary tokens:

- `national_gypsum_gate_b_source_rows_are_not_runtime_import_approval`
- `national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `national_gypsum_gate_b_fire_shield_soundbreak_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv`
- `national_gypsum_gate_b_glass_fiber_does_not_coalesce_with_rockwool_or_generic_mineral_wool`
- `national_gypsum_gate_b_resilient_channel_ct_h_stud_load_bearing_and_roof_truss_roles_do_not_promote_generic_routes`
- `national_gypsum_gate_b_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Validation

Required for Gate A:

- focused v12 Gate A contract;
- continuity with National Gypsum Gate C, Gate B, Gate A, v11, USG Gate
  C, USG Gate B, USG Gate A, v10, ROCKWOOL Gate C, ROCKWOOL Gate B,
  ROCKWOOL Gate A, post-British-Gypsum acquisition, v9, and the
  route/source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Focused v12 command:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts --maxWorkers=1`

Gate A validation completed on 2026-05-02:

- focused v12 Gate A contract: 1 file / 8 tests passed;
- v12 / National Gypsum Gate C / Gate B / Gate A / v11 / USG Gate C /
  Gate B / Gate A / v10 / ROCKWOOL Gate C / Gate B / Gate A /
  post-British-Gypsum acquisition / v9 / route-source-risk continuity:
  15 files / 104 tests passed;
- `pnpm calculator:gate:current`: engine 206 files / 1121 tests
  passed, web 47 files / 227 tests passed / 18 skipped, build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.
