# Checkpoint - 2026-05-02 - National Gypsum Fire & Sound Selector Source Pack Extraction Gate A

Slice:

`national_gypsum_fire_sound_selector_source_pack_extraction_v1`

Gate landed:

`gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`

Status:

`national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Selected next action:

`gate_b_mapping_tolerance_decision_no_runtime`

Selected next file:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts`

Implementation artifact:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`

Prior selection status:

`selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import`

## Summary

Gate A extracts National Gypsum Fire & Sound Assembly Selector source
locators and representative row payload context without importing any
values into runtime. The official selector/news pages establish that
the selector covers nearly 350 UL designs, includes examples such as
`V438` and `W419`, and exposes related sound-test report surfaces. The
static selector page and assembly pages give enough context for a
mapping/tolerance decision, but not enough for immediate DynEcho
runtime import.

This gate does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

## Source Locators

Selector and announcement surfaces:

- `https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector`
- `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies`

Representative extracted rows:

- `NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50`
  - source:
    `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/v438-u465-358-20eq-m24-rc1`
  - context: `V438, U465`, steel partition, `STC 50`, 20 gauge EQ
    3-5/8 in studs at 24 in oc, glass fiber, Fire-Shield gypsum board,
    resilient channel one side, acoustical test report locator visible.
- `NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44`
  - source:
    `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w419-u499-212-25ga-ct-sb`
  - context: `W419, U499`, shaftwall, `STC 44`, 25 gauge 2-1/2 in CT
    studs at 24 in oc, glass fiber, eXP Shaftliner, SoundBreak XP
    Fire-Shield, acoustical test report locator visible.
- `NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51`
  - source:
    `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w469-358-16ga-metalstuds-16oc-rc1-sb`
  - context: `W469`, load-bearing steel wall, `STC 51`, 16 gauge
    3-5/8 in studs at 16 in oc, glass fiber, SoundBreak XP Fire-Shield,
    Fire-Shield gypsum board on resilient channel, acoustical test
    report locator visible.
- `NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43`
  - source:
    `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w454-3hr-1xinsul`
  - context: `W454`, area separation wall, `STC 43`, H-studs,
    shaftliner, Fire-Shield C, 2x4 wood studs each side, glass fiber one
    side, acoustical test report locator visible.
- `NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA`
  - source:
    `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/p540-steel-truss-roof-58c`
  - context: `P540`, roof-ceiling assembly, `STC N/A`, steel truss,
    optional insulation, Fire-Shield C ceiling on resilient channel.
    This row is negative-boundary context only.

## Runtime Blockers

- exact acoustical test report payloads, full one-third-octave
  transmission-loss vectors, or source-owned `Rw` derivations are not
  captured;
- `STC` and selector/report locators do not establish DynEcho `Rw`,
  `R'w`, `Dn,w`, `DnT,w`, `DnT,A`, `Ln,w`, or field outputs;
- Gold Bond Fire-Shield, SoundBreak XP Fire-Shield, eXP Shaftliner,
  glass fiber, resilient channel, CT studs, H-studs, load-bearing steel
  studs, wood side studs, and roof truss roles do not yet have local
  material/topology mapping or tolerance owners;
- row-specific negative boundaries and paired engine/web visible tests
  must be named before any runtime or visible behavior moves.

## Protected Boundaries

- `national_gypsum_selector_surface_does_not_count_as_runtime_ready_row_without_report_payload`
- `national_gypsum_stc_rows_do_not_directly_promote_dyn_echo_rw_or_field_outputs`
- `national_gypsum_wall_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `national_gypsum_glass_fiber_does_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `national_gypsum_soundbreak_fire_shield_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv_without_mapping`
- `national_gypsum_roof_ceiling_or_stc_na_rows_do_not_promote_floor_wall_or_triple_leaf_routes`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Rockwool Defect Posture

This gate does not fix or retune the original rockwool reorder /
triple-leaf defect. The split-rockwool wall answer remains
low-confidence `multileaf_screening_blend` (`Rw 41`) and must not be
presented as fixed, correct, or source-validated.

## Next Step

Implement:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-b-contract.test.ts`

with:

`gate_b_mapping_tolerance_decision_no_runtime`

Gate B must decide whether any National Gypsum row can map into a live
DynEcho family. It may only select runtime if exact topology, acoustic
metric owner, local material mapping, tolerance owner, protected
negative boundaries, and paired engine/web visible tests are named
together.

## Validation

Validation completed on 2026-05-02:

- focused National Gypsum Gate A contract: 1 file / 6 tests passed;
- National Gypsum Gate A / v11 / USG Gate C / Gate B / Gate A / v10 /
  ROCKWOOL Gate C / Gate B / Gate A / post-British-Gypsum acquisition /
  v9 / route-source-risk continuity: 12 files / 82 tests passed;
- `pnpm calculator:gate:current`: engine 203 files / 1099 tests
  passed, web 47 files / 227 tests passed / 18 skipped, build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.
