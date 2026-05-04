# Slice Plan - National Gypsum Fire & Sound Selector Source Pack Extraction

Slice id: `national_gypsum_fire_sound_selector_source_pack_extraction_v1`

Status: GATE C CLOSED NO-RUNTIME / SELECTED
`calculator_source_gap_revalidation_v12` (Gate C landed 2026-05-02).

Selected first file:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`

Selected first action:

`gate_a_extract_national_gypsum_fire_sound_selector_rows_without_runtime_import`

Gate A status:

`national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Gate C closeout file:

`packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C closeout action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Gate B status:

`national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout`

Gate C status:

`closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row`

Gate C selected next slice:

`calculator_source_gap_revalidation_v12`

Gate C selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`

Gate C selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout`

Prior selection status:

`selected_national_gypsum_fire_sound_selector_source_pack_extraction_after_v11_rerank_found_official_selector_context_but_no_runtime_ready_import`

Prior v11 implementation file:

`packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`

## Objective

Extract National Gypsum Fire & Sound Assembly Selector row payload,
downloadable sound-test report, UL design, metric-context, material, and
family-boundary evidence without importing values into runtime. Gate A
records representative row locators, Gate B finds no runtime-ready
row, and Gate C closes the slice no-runtime before selecting v12
source-gap revalidation. This is
source intake only. It must not move runtime values, support,
confidence, evidence, API shape, route cards, output cards,
proposal/report copy, output support, or workbench-input behavior.

## Source Locator

Primary locator:

`https://www.nationalgypsum.com/newsroom/press-releases/introducing-national-gypsums-fire-sound-assembly-selector`

Selected source label:

National Gypsum Fire & Sound Assembly Selector.

Why selected now:

- ROCKWOOL and USG official source-pack rows are both closed no-runtime.
- The Uris 2006 split-rockwool lane remains
  `paused_waiting_rights_safe_source_packet`.
- National Gypsum is the highest-ranked remaining official locator with
  selector and related sound-test context.
- Georgia-Pacific remains useful context, but its Fire & Sound
  Assemblies resource is still planning-context until the actual
  directory rows or test reports are resolved.

## Gate A Requirements

Gate A should add:

`packages/engine/src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts`

Required artifacts:

1. `selector_surface_and_downloadable_report_locator_capture`.
2. `ul_design_and_sound_test_payload_retrieval_policy`.
3. `wall_floor_ceiling_family_boundary_matrix`.
4. `stc_iic_or_sound_test_metric_context_only_until_mapping_gate`.
5. `national_gypsum_material_alias_and_gold_bond_purple_boundary_capture`.
6. `negative_boundaries_against_closed_usg_rockwool_british_gypsum_knauf_and_triple_leaf_rows`.
7. `runtime_readiness_matrix_with_exact_topology_metric_tolerance_material_and_visible_test_flags`.
8. `selected_gate_b_mapping_tolerance_or_closeout_next_step_without_runtime_import`.

Gate A may select mapping/tolerance only after it names row payloads or
test reports with exact topology, metric owner, material mapping,
tolerance owner, protected negative boundaries, and paired engine/web
visible test ownership. It may not select runtime from selector context
alone.

## Gate A Result

Gate A landed no-runtime and selected Gate B mapping/tolerance decision:

`national_gypsum_fire_sound_selector_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Representative rows:

- `NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50`:
  `V438, U465`, steel partition, `STC 50`, glass fiber,
  Fire-Shield gypsum board, resilient channel one side,
  `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/v438-u465-358-20eq-m24-rc1`.
- `NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44`:
  `W419, U499`, shaftwall, `STC 44`, CT studs, eXP Shaftliner,
  SoundBreak XP Fire-Shield,
  `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w419-u499-212-25ga-ct-sb`.
- `NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51`:
  `W469`, load-bearing steel wall, `STC 51`, SoundBreak XP
  Fire-Shield, Fire-Shield gypsum board on resilient channel,
  `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w469-358-16ga-metalstuds-16oc-rc1-sb`.
- `NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43`:
  `W454`, area separation wall, `STC 43`, H-studs, shaftliner,
  Fire-Shield C, 2x4 wood studs each side,
  `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/w454-3hr-1xinsul`.
- `NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA`:
  `P540`, roof-ceiling negative boundary, `STC N/A`,
  `https://www.nationalgypsum.com/design-resource-center/fire-sound-assemblies/p540-steel-truss-roof-58c`.

Gate A does not capture full acoustical test report payloads,
one-third-octave vectors, source-owned `Rw` derivations, or tolerance
owners. Gate B decided that no row maps to a live family now and closed
every extracted row to context-only.

## Gate B Result

Gate B landed no-runtime and selected Gate C closeout:

`national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout`

Gate C target:

`packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Row decisions:

- `NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50`: blocked because
  `STC 50` / report locator context is not a DynEcho `Rw` owner, and
  Fire-Shield, glass fiber, resilient channel, 20 gauge EQ steel stud
  detail, tolerance, and LSF-anchor precedence remain unmapped.
  Boundary:
  `national_gypsum_v438_gate_b_stc50_does_not_replace_knauf_lsf_or_generic_steel_partition_routes`.
- `NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44`: blocked because
  shaftwall / CT stud / one-side access topology, eXP Shaftliner,
  SoundBreak XP Fire-Shield, glass fiber, metric policy, tolerance, and
  visible tests are missing. Boundary:
  `national_gypsum_w419_gate_b_shaftwall_stc44_does_not_promote_generic_wall_lsf_or_lined_masonry_routes`.
- `NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51`: blocked because
  load-bearing 16 gauge steel studs, SoundBreak XP Fire-Shield,
  Fire-Shield on resilient channel, glass fiber, field policy, and
  existing non-load-bearing LSF anchor precedence are not owned.
  Boundary:
  `national_gypsum_w469_gate_b_load_bearing_stc51_does_not_replace_existing_non_load_bearing_lsf_anchors`.
- `NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43`: blocked because
  H-studs, shaftliner, Fire-Shield C, dual wood side frames,
  area-separation topology, and triple-leaf/no-stud negative tests are
  missing. Boundary:
  `national_gypsum_w454_gate_b_area_separation_wall_does_not_promote_simple_stud_no_stud_or_triple_leaf_routes`.
- `NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA`: blocked as a negative
  boundary because `STC N/A` and roof-ceiling topology cannot promote
  floor, wall, roof, or impact outputs. Boundary:
  `national_gypsum_p540_gate_b_stc_na_roof_ceiling_row_remains_negative_boundary_for_floor_wall_and_impact_outputs`.

## Protected Boundaries

- Selector surfaces do not count as runtime-ready acoustic rows without
  row payload and test-report capture.
- UL/fire design context does not promote DynEcho `Rw`, `R'w`, `Ln,w`,
  `DnT,w`, `Dn,w`, `DnT,A`, support, confidence, evidence, field
  outputs, route-card values, output-card status, or proposal/report
  copy without an acoustic metric owner.
- National Gypsum board or system names do not coalesce with generic
  gypsum, USG, Knauf, British Gypsum, ROCKWOOL, local rockwool, glass
  fiber, generic mineral wool, or generic resilient bar without
  source/tolerance ownership.
- Closed USG, ROCKWOOL, British Gypsum, and Knauf rows remain closed
  no-runtime until a later gate names new exact mapping/tolerance proof.
- The original split-rockwool grouped stack remains
  `multileaf_screening_blend`, `Rw 41`, low confidence, and blocked on
  `paused_waiting_rights_safe_source_packet`.
- Runtime, support, confidence, evidence, API, route-card, output-card,
  proposal/report, output support, and workbench-input surfaces remain
  frozen.
- `national_gypsum_selector_surface_does_not_count_as_runtime_ready_row_without_report_payload`
- `national_gypsum_stc_rows_do_not_directly_promote_dyn_echo_rw_or_field_outputs`
- `national_gypsum_wall_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `national_gypsum_glass_fiber_does_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `national_gypsum_soundbreak_fire_shield_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv_without_mapping`
- `national_gypsum_roof_ceiling_or_stc_na_rows_do_not_promote_floor_wall_or_triple_leaf_routes`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`
- `national_gypsum_gate_b_source_rows_are_not_runtime_import_approval`
- `national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `national_gypsum_gate_b_fire_shield_soundbreak_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv`
- `national_gypsum_gate_b_glass_fiber_does_not_coalesce_with_rockwool_or_generic_mineral_wool`
- `national_gypsum_gate_b_resilient_channel_ct_h_stud_load_bearing_and_roof_truss_roles_do_not_promote_generic_routes`
- `national_gypsum_gate_b_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`

## Validation

Required for Gate A:

- focused National Gypsum Gate A contract;
- continuity with v11, USG Gate C, USG Gate B, USG Gate A, v10,
  ROCKWOOL Gate C, ROCKWOOL Gate B, ROCKWOOL Gate A,
  post-British-Gypsum acquisition, v9, and the route/source risk
  register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Focused Gate A command:

`pnpm --filter @dynecho/engine exec vitest run src/national-gypsum-fire-sound-selector-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`

Gate A validation completed on 2026-05-02:

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

Gate B validation completed on 2026-05-02:

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

## Gate C Result

Gate C closed
`national_gypsum_fire_sound_selector_source_pack_extraction_v1`
no-runtime and selected:

`calculator_source_gap_revalidation_v12`

First file:

`packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`

First action:

`gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout`

Gate C carries the Gate B row decisions forward as context only. It
does not select runtime import, value movement, support promotion,
confidence promotion, evidence promotion, output support movement, API
movement, route-card movement, output-card movement, proposal/report
copy movement, or workbench-input behavior movement.

Gate C validation completed on 2026-05-02:

- focused National Gypsum Gate C closeout contract: 1 file / 7 tests
  passed;
- National Gypsum Gate C / Gate B / Gate A / v11 / USG Gate C / Gate B
  / Gate A / v10 / ROCKWOOL Gate C / Gate B / Gate A /
  post-British-Gypsum acquisition / v9 / route-source-risk continuity:
  14 files / 96 tests passed;
- `pnpm calculator:gate:current`: engine 205 files / 1113 tests
  passed, web 47 files / 227 tests passed / 18 skipped, build 5 / 5
  passed with known non-fatal `sharp/@img` warnings, and whitespace
  guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.
