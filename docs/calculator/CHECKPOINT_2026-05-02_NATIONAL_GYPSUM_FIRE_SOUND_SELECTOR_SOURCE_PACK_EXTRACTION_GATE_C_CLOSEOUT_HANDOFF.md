# Checkpoint - 2026-05-02 - National Gypsum Fire & Sound Selector Source Pack Extraction Gate C Closeout

Slice:

`national_gypsum_fire_sound_selector_source_pack_extraction_v1`

Gate landed:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Status:

`closed_national_gypsum_fire_sound_selector_source_pack_no_runtime_and_selected_source_gap_revalidation_v12_because_gate_b_found_no_runtime_ready_row`

Next selected slice:

`calculator_source_gap_revalidation_v12`

Next file:

`packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`

Next action:

`gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout`

Implementation artifact:

`packages/engine/src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Prior Gate B status:

`national_gypsum_gate_b_found_no_runtime_ready_row_selected_closeout`

## Result

Gate C closes `national_gypsum_fire_sound_selector_source_pack_extraction_v1`
no-runtime. Gate A extracted representative National Gypsum Fire &
Sound Assembly Selector rows, Gate B proved none of those rows are
runtime-ready, and Gate C now treats the National Gypsum selector pack
as closed context while selecting the next source/accuracy revalidation
pass.

No runtime, support, confidence, evidence, API, route-card, output-card,
proposal/report, output support, or workbench-input behavior moves.

## Gate B Evidence Carried Forward

These National Gypsum rows remain context-only and out of runtime import:

- `NATIONAL_GYPSUM_V438_U465_20EQ_RC1_STC50`: still missing source
  report payload or curve metric owner, Fire-Shield, glass fiber,
  resilient-channel mapping, tolerance, and LSF-anchor precedence tests.
- `NATIONAL_GYPSUM_W419_U499_SHAFTWALL_STC44`: still missing
  shaftwall / CT stud / eXP Shaftliner / SoundBreak / glass-fiber /
  one-side-access mapping, metric policy, tolerance, and visible tests.
- `NATIONAL_GYPSUM_W469_LOAD_BEARING_RC1_STC51`: still missing
  load-bearing 16 ga stud, SoundBreak / Fire-Shield, glass-fiber,
  resilient-channel mapping, metric policy, tolerance, and existing LSF
  anchor precedence tests.
- `NATIONAL_GYPSUM_W454_AREA_SEPARATION_STC43`: still missing H-stud,
  shaftliner, Fire-Shield C, dual wood side-frame area-separation
  topology, metric policy, tolerance, and triple-leaf negative tests.
- `NATIONAL_GYPSUM_P540_ROOF_CEILING_STC_NA`: still a roof-ceiling
  `STC N/A` negative boundary; it cannot promote floor, wall, roof, or
  impact outputs.

## Protected Boundaries

- `national_gypsum_gate_b_source_rows_are_not_runtime_import_approval`
- `national_gypsum_gate_b_stc_report_locators_do_not_promote_dyn_echo_rw_or_field_outputs`
- `national_gypsum_gate_b_fire_shield_soundbreak_shaftliner_do_not_coalesce_with_generic_gypsum_or_mlv`
- `national_gypsum_gate_b_glass_fiber_does_not_coalesce_with_rockwool_or_generic_mineral_wool`
- `national_gypsum_gate_b_resilient_channel_ct_h_stud_load_bearing_and_roof_truss_roles_do_not_promote_generic_routes`
- `national_gypsum_gate_b_rows_do_not_override_usg_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `national_gypsum_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `national_gypsum_v438_gate_b_stc50_does_not_replace_knauf_lsf_or_generic_steel_partition_routes`
- `national_gypsum_w419_gate_b_shaftwall_stc44_does_not_promote_generic_wall_lsf_or_lined_masonry_routes`
- `national_gypsum_w469_gate_b_load_bearing_stc51_does_not_replace_existing_non_load_bearing_lsf_anchors`
- `national_gypsum_w454_gate_b_area_separation_wall_does_not_promote_simple_stud_no_stud_or_triple_leaf_routes`
- `national_gypsum_p540_gate_b_stc_na_roof_ceiling_row_remains_negative_boundary_for_floor_wall_and_impact_outputs`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Original Rockwool Defect Posture

The original split-rockwool grouped stack remains
`multileaf_screening_blend`, `Rw 41`, low confidence, and paused on
`paused_waiting_rights_safe_source_packet`. National Gypsum `STC`,
report-locator, material-name, shaftwall, area-separation, or
roof-ceiling context does not fix, validate, or retune the Uris 2006 /
two-cavity rockwool lane.

## Next Slice

Gate C selects:

`calculator_source_gap_revalidation_v12`

First file:

`packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`

Action:

`gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout`

Required v12 work:

1. Carry forward National Gypsum Gate A / Gate B / Gate C closeout
   evidence.
2. Keep the Uris 2006 split-rockwool lane paused until a rights-safe
   source packet exists.
3. Re-rank closed National Gypsum, USG, ROCKWOOL, British Gypsum, and
   Knauf source rows against Georgia-Pacific / remaining official
   locators and remaining CLT, generated-floor, no-stud, lined-heavy,
   and historical blockers.
4. Select the next narrow slice only if it names exact topology, metric
   policy, material mapping, tolerance, protected negative boundaries,
   and paired engine/web visible tests before runtime or visible
   promotion.

## Validation

Validation completed on 2026-05-02:

- focused National Gypsum Gate C closeout contract: 1 file / 7 tests
  passed;
  `pnpm --filter @dynecho/engine exec vitest run src/post-national-gypsum-fire-sound-selector-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1`;
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
