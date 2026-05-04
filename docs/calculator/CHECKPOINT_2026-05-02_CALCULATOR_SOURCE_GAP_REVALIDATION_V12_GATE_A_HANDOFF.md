# Checkpoint - Calculator Source Gap Revalidation v12 Gate A

Date: 2026-05-02

Slice: `calculator_source_gap_revalidation_v12`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_national_gypsum_source_pack_closeout`

Implementation:

`packages/engine/src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts`

Status:

`selected_georgia_pacific_fire_sound_assemblies_source_pack_extraction_after_v12_rerank_found_official_planning_context_but_no_runtime_ready_import`

## What Landed

Gate A revalidated the source / accuracy backlog after National Gypsum
Fire & Sound Assembly Selector Gate C closed no-runtime. It keeps every
runtime and visible surface frozen and selects the next no-runtime
source-pack extraction slice:

`georgia_pacific_fire_sound_assemblies_source_pack_extraction_v1`

Selected next file:

`packages/engine/src/georgia-pacific-fire-sound-assemblies-source-pack-extraction-gate-a-contract.test.ts`

Selected next action:

`gate_a_extract_georgia_pacific_fire_sound_assemblies_rows_without_runtime_import`

Selected planning surface:

`docs/calculator/SLICE_GEORGIA_PACIFIC_FIRE_SOUND_ASSEMBLIES_SOURCE_PACK_EXTRACTION_PLAN.md`

## Revalidation Result

The selected remaining official locator is:

Georgia-Pacific Fire & Sound Assemblies

Source URL:

`https://www.buildgp.com/resources/assemblies`

Why selected:

- National Gypsum, USG, ROCKWOOL, British Gypsum, and Knauf concrete
  source rows are closed no-runtime.
- The Uris 2006 split-rockwool / two-cavity lane is still paused on
  `paused_waiting_rights_safe_source_packet`.
- Georgia-Pacific is the highest-ranked remaining official locator
  from the post-British-Gypsum source acquisition pass.
- The Georgia-Pacific resource is not runtime-ready because actual
  directory rows or test reports, exact topology, material mapping,
  tolerance owner, and paired visible tests are still missing.

## Candidate Order

Gate A ranked the candidates as:

1. `georgia_pacific_fire_sound_assemblies` - selected for no-runtime
   source-pack extraction.
2. `wall_triple_leaf_uris_2006_source_packet_lane` - paused until a
   rights-safe source packet exists.
3. `closed_national_gypsum_selector_rows` - closed no-runtime.
4. `closed_usg_levelrock_and_steel_partition_rows` - closed
   no-runtime.
5. `closed_rockwool_iss_iws_ess_rows` - closed no-runtime.
6. `closed_british_gypsum_rows` - closed no-runtime.
7. `closed_knauf_mapping_chain` - closed no-runtime.
8. `clt_mass_timber_generated_floor_no_stud_lined_heavy_followups` -
   still source/metric blocked.
9. `historical_blocked_or_productization_only_work` - lower priority
   than accuracy source extraction.

Every candidate remains `runtimeImportReadyNow: false`.

## Protected Boundaries

- `gp_planning_resource_does_not_count_as_a_runtime_ready_stc_source_row`
- `actual_directory_or_test_report_information_is_required_before_complete_use`
- `gp_context_does_not_override_closed_national_gypsum_usg_rockwool_british_gypsum_knauf_or_existing_lsf_anchors`
- `georgia_pacific_stc_context_does_not_promote_dyn_echo_rw_or_field_outputs`
- `gp_densglass_toughrock_soundbreak_and_generic_gypsum_do_not_coalesce_without_mapping_tolerance`
- `gp_wall_floor_ceiling_roof_context_does_not_cross_promote_route_families`
- `georgia_pacific_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

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

## Validation

Validation completed on 2026-05-02:

- focused v12 Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v12-gate-a-contract.test.ts --maxWorkers=1`
  passed: 1 file / 8 tests.
- continuity with National Gypsum Gate C, Gate B, Gate A, v11, USG
  Gate C, USG Gate B, USG Gate A, v10, ROCKWOOL Gate C, ROCKWOOL Gate
  B, ROCKWOOL Gate A, post-British-Gypsum acquisition, v9, and the
  route/source risk register passed: 15 files / 104 tests.
- `pnpm calculator:gate:current` passed: engine 206 files / 1121
  tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with
  known non-fatal `sharp/@img` warnings, and whitespace guard passed.
- `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  build side-effect.
- `git diff --check` passed.
