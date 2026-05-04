# Checkpoint - PABCO QuietRock Sound Design Guide Source Pack Extraction Gate A

Date: 2026-05-03

Slice:

`pabco_quietrock_sound_design_guide_source_pack_extraction_v1`

Landed gate:

`gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import`

Status:

`pabco_quietrock_sound_design_guide_rows_extracted_no_runtime_selected_mapping_tolerance_gate_b`

Implementation file:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`

Selected next file:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-b-contract.test.ts`

Selected next action:

`gate_b_mapping_tolerance_decision_no_runtime`

Planning surface:

`docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md`

## Decision

Gate A extracts PABCO Gypsum / QuietRock Sound Design Guide row context
as a no-runtime source pack. It keeps every source row out of runtime,
support, confidence, evidence, API shape, route-card value, output-card
status, proposal/report copy, output-support, and workbench-input
behavior.

The PABCO Sound Design Guide and Sound Assembly Tool are useful
official locators, but they are not runtime truth for DynEcho until a
later gate owns row payloads, `STC` -> DynEcho `Rw` / field-output
policy, material/topology mapping, tolerance ownership, negative
boundaries, and paired engine/web visible tests together.

Source locators:

- `https://go.pabcogypsum.com/tsdg`
- `https://quietrock.com/resources/sound-control-assembly-selector/`

## Extracted Rows

- `PABCO_PGD_W_646_16_QR_ES_WOOD_2X4_16OC_STC41_NOAL17_0730`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-646-16/`
  - Context: QuietRock ES / ES MR Type X, 2x4 wood studs at 16 in oc,
    R-13 glass fiber, opposite PABCO Type X layer, `STC 41`,
    `NOAL 17-0730`.
  - Boundary:
    `pabco_pgd_w_646_16_stc41_does_not_replace_generic_wood_stud_or_quietrock_runtime_route`.
- `PABCO_PGD_W_445_16_QR_ES_WOOD_2X4_RC_16OC_STC57_NOAL17_0745`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-445-16/`
  - Context: QuietRock ES / ES MR Type X, 2x4 wood studs at 16 in oc,
    R-13 glass fiber, resilient channel, two opposite Type X layers,
    `STC 57`, `NOAL 17-0745`.
  - Boundary:
    `pabco_pgd_w_445_16_stc57_resilient_channel_context_does_not_promote_dyn_echo_rw_or_field_outputs`.
- `PABCO_PGD_W_449_24_QR530_WOOD_2X4_24OC_THREE_LAYERS_STC57_NRC_TLA_04_035`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w-449-24/`
  - Context: indexed QuietRock 530 / 530 RF multilayer locator, 2x4
    wood studs at 24 in oc, R-13 glass fiber, `STC 57`,
    `NRC TLA-04-035`.
  - Boundary:
    `pabco_pgd_w_449_24_indexed_locator_is_not_runtime_truth_until_payload_is_retrieved`.
  - Note: current direct row retrieval did not capture a live row
    payload, so this row stays locator-only until a fresh payload or
    summary report is retrieved.
- `PABCO_PGD_68_534_16_QR_ES_STEEL_68MIL_RC_16OC_STC50_NOAL18_0611`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-68-534-16/`
  - Context: QuietRock ES / ES MR Type X, 3-5/8 in 68 mil steel studs
    at 16 in oc, R-13 glass fiber, resilient channel, Type X layer,
    `STC 50`, `NOAL 18-0611`.
  - Boundary:
    `pabco_pgd_68_534_16_68mil_steel_stud_row_does_not_replace_existing_lsf_anchors`.
- `PABCO_PGD_546_407_16_QR_ES_STEEL_54MIL_RC_16OC_DOUBLE_TYPEX_STC60_NOAL21_0358`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-546-407-16/`
  - Context: QuietRock ES / ES MR Type X, 6 in 54 mil steel studs at
    16 in oc, R-19 glass fiber, resilient channel, two opposite Type X
    layers, `STC 60`, `NOAL 21-0358`.
  - Boundary:
    `pabco_pgd_546_407_16_stc60_is_not_a_dyn_echo_field_or_lsf_runtime_anchor`.
- `PABCO_PGD_W6_467_24_QR530_WOOD_2X6_24OC_STC56_NOAL21_1053`
  - `https://pabcogypsum.com/resources/sound-control-assembly-selector/pgd-w6-467-24/`
  - Context: QuietRock 530 / 530 RF on both sides, 2x6 wood studs at
    24 in oc, R-19 glass fiber, `STC 56`, `NOAL 21-1053`.
  - Boundary:
    `pabco_pgd_w6_467_24_quietrock_530_row_does_not_promote_generic_wood_stud_route`.

## Protected Negative Boundaries

- `pabco_quietrock_stc_row_pages_do_not_promote_dyn_echo_rw_or_field_outputs_without_metric_policy`
- `quietrock_es_510_530_545_and_generic_pabco_type_x_do_not_coalesce_with_generic_gypsum_or_mlv_without_material_mapping`
- `pabco_single_staggered_double_stud_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `pabco_glass_fiber_wood_steel_rc_rows_do_not_reopen_closed_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_or_knauf_decisions`
- `pabco_summary_report_download_links_are_not_runtime_truth_until_payloads_are_retrieved_and_curve_or_metric_policy_is_owned`
- `pabco_pgd_w_449_24_indexed_locator_requires_fresh_payload_before_runtime_or_confidence_promotion`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Rockwool Defect Posture

This checkpoint does not fix the original rockwool / triple-leaf order
defect. The Uris 2006 lane remains
`paused_waiting_rights_safe_source_packet`. The split-rockwool grouped
stack still returns low-confidence `multileaf_screening_blend`,
`Rw 41`, and must not be presented as fixed, correct, or
source-validated.

PABCO glass-fiber, QuietRock, wood-stud, steel-stud, resilient-channel,
and `STC` row context is an adjacent source boundary only. It cannot
replace the local Uris 2006 two-cavity rockwool source packet, cannot
promote local `rockwool` material mapping, and cannot move runtime
confidence.

## Validation

Completed on 2026-05-03:

- Focused PABCO Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts --maxWorkers=1`
  passed 1 file / 8 tests.
- PABCO / post-Georgia-Pacific / v13 / Georgia-Pacific / National
  Gypsum / USG / ROCKWOOL / British Gypsum / route-source risk
  continuity passed 21 files / 150 tests.
- `pnpm calculator:gate:current` passed: engine 212 files / 1167 tests,
  web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
  non-fatal `sharp/@img` warnings, and whitespace guard clean.
- `apps/web/next-env.d.ts` was restored to the repo-local
  `.next-typecheck` path after the build side-effect.
- Final `git diff --check` passed.
