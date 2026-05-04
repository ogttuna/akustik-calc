# Checkpoint - USG Acoustical Assemblies Source Pack Extraction Gate B

Date: 2026-05-02

Slice:

`usg_acoustical_assemblies_source_pack_extraction_v1`

Gate:

`gate_b_mapping_tolerance_decision_no_runtime`

Status:

`usg_gate_b_found_no_runtime_ready_row_selected_closeout`

Next file:

`packages/engine/src/post-usg-acoustical-assemblies-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Next action:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Source locator:

`https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf`

## Result

Gate B compares the six extracted USG SA200 rows against live DynEcho
runtime prerequisites. No row has exact topology, metric policy,
material mapping, tolerance ownership, negative boundaries, and paired
engine/web visible tests ready together. Runtime, support, confidence,
evidence, API, route-card, output-card, proposal/report, output support,
and workbench-input behavior remain frozen.

| Row id | Gate B decision | Current implementation fit | First blocker |
| --- | --- | --- | --- |
| `LEVELROCK_I_JOIST_SRM25_CARPET` | block immediate import | floor row is not a live exact floor catalog topology | Levelrock / I-joist / SRM-25 / carpet topology, `STC` / `IIC` metric policy, tolerance, and visible tests missing |
| `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL` | context only | range metric cannot be collapsed to a single exact value | range policy, floor-finish topology, `STC` / `IIC` owner, and tolerance missing |
| `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE` | context only | SRB board is not SRM-25 mat or generic resilient layer | SRB board material mapping and I-joist floor topology missing |
| `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE` | block immediate import | truss row is not I-joist, open-web, or generated-floor truth | truss-specific topology, ceramic finish, metric policy, tolerance, and generated-floor negatives missing |
| `USG_STEEL_FRAMED_A1` | block immediate import | steel partition row is not the existing LSF anchor | Sheetrock Firecode, steel-stud gauge/spacing, `STC` to `Rw` policy, curve owner, tolerance, and LSF precedence tests missing |
| `USG_STEEL_FRAMED_A8` | block immediate import | RC-channel wall row is not live LSF or triple-leaf truth | Sheetrock Firecode C, Thermafiber SAFB, one-side RC channel, `STC` curve policy, tolerance, and triple-leaf negatives missing |

## Metric And Alias Policy

`STC` is not direct DynEcho `Rw`; `IIC` is not direct DynEcho `Ln,w`;
range rows are not collapsed to exact single values; test numbers are
source locators, not evidence-tier/runtime promotion. Levelrock,
SRM-25, SRB, I-joist, truss, Sheetrock Firecode, Thermafiber SAFB, and
RC channel one-side assemblies remain separate from generic floor
underlayments, generic gypsum, local rockwool, glass fiber, generic
mineral wool, generic resilient bar, and independent-frame routes until
a later gate proves bounded equivalence.

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
`paused_waiting_rights_safe_source_packet`. USG SA200 rows do not fix,
validate, or retune that Uris 2006 / two-cavity rockwool lane.

## Validation

Validation completed on 2026-05-02:

- focused USG Gate B contract: 1 file / 7 tests passed;
- USG Gate B / Gate A / v10 / ROCKWOOL Gate C / ROCKWOOL Gate B /
  ROCKWOOL Gate A / post-British-Gypsum acquisition / v9 /
  route-source-risk continuity: 9 files / 61 tests passed;
- `pnpm calculator:gate:current`: engine 200 files / 1078 tests
  passed, web 47 files / 227 tests passed / 18 skipped, build 5 / 5
  passed with known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect; whitespace guard passed.
