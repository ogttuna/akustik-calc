# Checkpoint - USG Acoustical Assemblies Source Pack Extraction Gate C Closeout

Date: 2026-05-02

Slice:

`usg_acoustical_assemblies_source_pack_extraction_v1`

Gate:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Status:

`closed_usg_acoustical_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v11_because_gate_b_found_no_runtime_ready_row`

Next selected slice:

`calculator_source_gap_revalidation_v11`

Next file:

`packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`

Next action:

`gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`

## Result

Gate C closes `usg_acoustical_assemblies_source_pack_extraction_v1`
no-runtime. Gate A extracted the official USG SA200 source rows, Gate B
proved none of those rows are runtime-ready, and Gate C now treats the
USG pack as closed context while selecting the next source/accuracy
revalidation pass.

No runtime, support, confidence, evidence, API, route-card, output-card,
proposal/report, output support, or workbench-input behavior moves.

## Gate B Evidence Carried Forward

These USG rows remain context-only and out of runtime import:

- `LEVELROCK_I_JOIST_SRM25_CARPET`: still missing Levelrock / I-joist /
  SRM-25 / carpet topology, `IIC` / `STC` metric policy, tolerance, and
  paired visible tests.
- `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL`: still a range row
  (`IIC 55-58`, `STC 60-64`) without range-collapse policy or exact
  floor-finish topology.
- `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE`: still missing SRB board
  material mapping, I-joist floor topology, metric policy, tolerance,
  and substitution tests.
- `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE`: still missing truss-specific
  topology, ceramic finish mapping, metric policy, tolerance, and
  generated-floor negative tests.
- `USG_STEEL_FRAMED_A1`: still missing Sheetrock Firecode, steel-stud
  gauge/spacing, `STC` to `Rw` curve owner, tolerance, and LSF anchor
  precedence tests.
- `USG_STEEL_FRAMED_A8`: still missing Sheetrock Firecode C,
  Thermafiber SAFB, one-side RC-channel mapping, `STC` curve policy,
  tolerance, and triple-leaf / near-source negative tests.

## Protected Boundaries

- `usg_gate_b_source_rows_are_not_runtime_import_approval`
- `usg_gate_b_stc_iic_test_numbers_do_not_promote_dyn_echo_rw_lnw_or_field_outputs`
- `usg_gate_b_levelrock_srm_srb_i_joist_truss_do_not_promote_generated_floor_or_wall_routes`
- `usg_gate_b_floor_rows_do_not_override_exact_or_bound_floor_catalog_without_mapping_tolerance`
- `usg_gate_b_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `usg_gate_b_sheetrock_thermafiber_rc_channel_do_not_coalesce_with_generic_gypsum_rockwool_glass_fiber_or_resilient_bar`
- `usg_gate_b_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Original Rockwool Defect Posture

The original split-rockwool grouped stack remains
`multileaf_screening_blend`, `Rw 41`, low confidence, and paused on
`paused_waiting_rights_safe_source_packet`. USG SA200 `STC` / `IIC`
rows do not fix, validate, or retune the Uris 2006 / two-cavity
rockwool lane.

## Next Slice

Gate C selects:

`calculator_source_gap_revalidation_v11`

First file:

`packages/engine/src/calculator-source-gap-revalidation-v11-gate-a-contract.test.ts`

Action:

`gate_a_revalidate_source_accuracy_gap_order_after_usg_source_pack_closeout`

Required v11 work:

1. Carry forward USG Gate A / Gate B / Gate C closeout evidence.
2. Keep the Uris 2006 split-rockwool lane paused until a rights-safe
   source packet exists.
3. Re-rank closed ROCKWOOL, British Gypsum, Knauf, and USG source rows
   against National Gypsum / Georgia-Pacific locators and remaining CLT,
   generated-floor, no-stud, lined-heavy, and historical blockers.
4. Select the next narrow slice only if it names exact topology, metric
   policy, material mapping, tolerance, protected negative boundaries,
   and paired engine/web visible tests before runtime or visible
   promotion.

## Validation

Validation completed on 2026-05-02:

- focused USG Gate C closeout contract: 1 file / 7 tests passed;
  `pnpm --filter @dynecho/engine exec vitest run src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts --maxWorkers=1`;
- USG Gate C / Gate B / Gate A / v10 / ROCKWOOL Gate C / ROCKWOOL Gate B
  / ROCKWOOL Gate A / post-British-Gypsum acquisition / v9 /
  route-source-risk continuity: 10 files / 68 tests passed;
- `pnpm calculator:gate:current`: engine 201 files / 1085 tests passed,
  web 47 files / 227 tests passed / 18 skipped, build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; `git diff --check` passed.
