# Checkpoint - USG Acoustical Assemblies Source Pack Extraction Gate A

Date: 2026-05-02

Slice:

`usg_acoustical_assemblies_source_pack_extraction_v1`

Gate:

`gate_a_extract_usg_acoustical_assemblies_rows_without_runtime_import`

Status:

`usg_acoustical_assemblies_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Next file:

`packages/engine/src/usg-acoustical-assemblies-source-pack-extraction-gate-b-contract.test.ts`

Next action:

`gate_b_mapping_tolerance_decision_no_runtime`

Source locator:

`https://www.usg.com/content/dam/USG_Marketing_Communications/united_states/product_promotional_materials/finished_assets/acoustical-assemblies-en-SA200.pdf`

## Result

Gate A extracts representative USG SA200 source rows as source context
only. It does not import `STC`, `IIC`, test-number, range, UL design,
or ARL index data into DynEcho runtime values. Runtime, support,
confidence, evidence, API, route-card, output-card, proposal/report,
output support, and workbench-input behavior remain frozen.

Extracted source rows:

| Row id | Family | Source metric context | Reported metrics | Runtime disposition |
| --- | --- | --- | --- | --- |
| `LEVELROCK_I_JOIST_SRM25_CARPET` | floor/ceiling Levelrock | `STC` / `IIC` | `IIC 77`, `STC 65` | no runtime import |
| `LEVELROCK_I_JOIST_SRM25_SHEET_VINYL` | floor/ceiling Levelrock | `STC` / `IIC` range | `IIC 55-58`, `STC 60-64` | no runtime import |
| `LEVELROCK_I_JOIST_SRB_WOOD_LAMINATE` | floor/ceiling Levelrock | `STC` / `IIC` | `IIC 61`, `STC 65` | no runtime import |
| `LEVELROCK_TRUSS_SRM25_CERAMIC_TILE` | floor/ceiling Levelrock | `STC` / `IIC` | `IIC 56`, `STC 61` | no runtime import |
| `USG_STEEL_FRAMED_A1` | wall steel-framed partition | `STC` + test number | `STC 40`, `USG-860808` | no runtime import |
| `USG_STEEL_FRAMED_A8` | wall steel-framed partition | `STC` + test number | `STC 58`, `RAL-TL-83-215` | no runtime import |

## Metric Policy

`STC` and `IIC` are useful source context, but they are not direct
DynEcho `Rw`, `Ln,w`, `R'w`, `Dn,w`, `DnT,w`, or `DnT,A` imports.
Range rows are not collapsed to exact single values. Gate B must decide
whether each row is rejected or can proceed only after exact topology,
material mapping, metric equivalence, tolerance, negative boundaries,
and paired engine/web visible tests are owned.

## Protected Boundaries

- `usg_stc_iic_rows_do_not_directly_promote_dyn_echo_rw_lnw_or_field_outputs`
- `usg_floor_ceiling_rows_do_not_become_wall_or_triple_leaf_truth`
- `usg_levelrock_srm_srb_i_joist_truss_rows_do_not_promote_generated_floor_without_mapping_tolerance`
- `usg_steel_partition_rows_do_not_override_knauf_rockwool_british_gypsum_or_existing_lsf_anchors`
- `usg_sheetrock_thermafiber_rows_do_not_coalesce_with_generic_gypsum_rockwool_or_glass_fiber_without_mapping`
- `usg_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Original Rockwool Defect Posture

The original split-rockwool grouped stack remains
`multileaf_screening_blend`, `Rw 41`, low confidence, and paused on
`paused_waiting_rights_safe_source_packet`. USG SA200 rows do not fix
or validate the Uris 2006 / two-cavity rockwool triple-leaf lane.

## Validation

Validation completed on 2026-05-02:

- focused USG Gate A contract: 1 file / 6 tests passed;
- USG Gate A / v10 / ROCKWOOL Gate C / ROCKWOOL Gate B / ROCKWOOL Gate A
  / post-British-Gypsum acquisition / v9 / route-source-risk
  continuity: 8 files / 54 tests passed;
- `pnpm calculator:gate:current`: engine 199 files / 1071 tests passed,
  web 47 files / 227 tests passed / 18 skipped, repo build 5 packages
  passed with known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` was restored to `.next-typecheck` after the
  Next build side-effect;
- whitespace guard passed through the current gate.
