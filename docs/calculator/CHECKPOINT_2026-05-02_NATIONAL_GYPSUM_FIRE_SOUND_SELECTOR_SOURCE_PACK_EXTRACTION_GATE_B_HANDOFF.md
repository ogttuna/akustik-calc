# Checkpoint - 2026-05-02 - National Gypsum Fire & Sound Selector Source Pack Extraction Gate B

Slice:

`national_gypsum_fire_sound_selector_source_pack_extraction_v1`

Gate landed:

`gate_b_mapping_tolerance_decision_no_runtime`

Status:

`national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout`

Selected next action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Selected next file:

`packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Implementation artifact:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts`

Prior Gate A status:

`national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

## Summary

Gate B compares the National Gypsum Fire & Sound Selector rows against
the live DynEcho implementation and finds no runtime-ready row. The
rows remain useful source context, but none have the complete set of
exact topology, acoustic metric owner, local material mapping,
tolerance owner, protected negative boundaries, and paired engine/web
visible tests required for runtime or visible movement.

This gate does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

## Row Decisions

- `NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50`:
  no-runtime. `STC 50` and report locator context are not a DynEcho
  `Rw` owner. Fire-Shield, glass fiber, resilient channel, 20 gauge EQ
  stud detail, and LSF-anchor precedence remain unmapped.
  Protected boundary:
  `national_gypsum_v438_gate_b_stc50_does_not_replace_knauf_lsf_or_generic_steel_partition_routes`.
- `NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44`:
  no-runtime. Shaftwall / CT stud / one-side access topology, eXP
  Shaftliner, SoundBreak XP Fire-Shield, glass fiber, metric policy,
  tolerance, and visible tests are missing.
  Protected boundary:
  `national_gypsum_w419_gate_b_shaftwall_stc44_does_not_promote_generic_wall_lsf_or_lined_masonry_routes`.
- `NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51`:
  no-runtime. Load-bearing 16 gauge steel studs, SoundBreak XP
  Fire-Shield, Fire-Shield on resilient channel, glass fiber, field
  policy, and existing non-load-bearing LSF anchor precedence are not
  owned.
  Protected boundary:
  `national_gypsum_w469_gate_b_load_bearing_stc51_does_not_replace_existing_non_load_bearing_lsf_anchors`.
- `NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43`:
  no-runtime. H-studs, shaftliner, Fire-Shield C, dual wood side
  frames, area-separation topology, and triple-leaf/no-stud negative
  tests are missing.
  Protected boundary:
  `national_gypsum_w454_gate_b_area_separation_wall_does_not_promote_simple_stud_no_stud_or_triple_leaf_routes`.
- `NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA`:
  no-runtime negative boundary. `STC N/A` and roof-ceiling topology
  cannot promote floor, wall, roof, or impact outputs.
  Protected boundary:
  `national_gypsum_p540_gate_b_stc_na_roof_ceiling_row_remains_negative_boundary_for_floor_wall_and_impact_outputs`.

## Metric And Mapping Blockers

- `STC` values need explicit metric rejection or source-owned
  one-third-octave curves before any `Rw` derivation.
- Report locators identify rows but do not provide graph payload,
  curve digitization, tolerance, or chain-of-custody evidence.
- `STC N/A` rows are negative boundaries until a source metric and
  topology owner exist.
- Selector rows do not supply field/building context, ISO 12354-style
  overlay, room geometry, or visible field-output policy.
- Fire-Shield, SoundBreak XP Fire-Shield, eXP Shaftliner, glass fiber,
  resilient channel, CT studs, H-studs, load-bearing steel studs, wood
  side frames, and roof truss roles must not coalesce with generic
  local inputs without source/tolerance ownership.

## Protected Boundaries

- `national_gypsum_gate_b_source_rows_are_not_runtime_import_approval`
- `national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `national_gypsum_gate_b_fire_shield_soundbreak_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv`
- `national_gypsum_gate_b_glass_fiber_does_not_coalesce_with_rockwool_or_generic_mineral_wool`
- `national_gypsum_gate_b_resilient_channel_ct_h_stud_load_bearing_and_roof_truss_roles_do_not_promote_generic_routes`
- `national_gypsum_gate_b_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Source Locators

- `https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector`
- `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies`
- `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/v438-u465-358-20eq-m24-rc1`
- `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w419-u499-212-25ga-ct-sb`
- `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w469-358-16ga-metalstuds-16oc-rc1-sb`
- `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w454-3hr-1xinsul`
- `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/p540-steel-truss-roof-58c`

## Rockwool Defect Posture

This gate does not fix or retune the original rockwool reorder /
triple-leaf defect. The split-rockwool wall answer remains
low-confidence `multileaf_screening_blend` (`Rw 41`) and must not be
presented as fixed, correct, or source-validated.

## Next Step

Implement:

`packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

with:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Gate C should close the National Gypsum source-pack extraction slice
no-runtime and select the next honest source-gap revalidation or
source-acquisition step. It must not move runtime or visible behavior.

## Validation

Validation completed on 2026-05-02:

- focused National Gypsum Gate B contract: 1 file / 7 tests passed;
- National Gypsum Gate B / Gate A / v11 / USG Gate C / Gate B /
  Gate A / v10 / ROCKWOOL Gate C / Gate B / Gate A /
  post-British-Gypsum acquisition / v9 / route-source-risk continuity:
  13 files / 89 tests passed;
- `pnpm calculator:gate:current`: engine 204 files / 1106 tests
  passed, web 47 files / 227 tests passed / 18 skipped, build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.
