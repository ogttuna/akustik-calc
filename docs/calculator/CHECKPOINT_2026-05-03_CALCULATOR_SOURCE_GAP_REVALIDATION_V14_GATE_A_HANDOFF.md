# Checkpoint - 2026-05-03 - Calculator Source Gap Revalidation v14 Gate A

Slice:

`calculator_source_gap_revalidation_v14`

Gate landed:

`gate_a_revalidate_source_accuracy_gap_order_after_pabco_source_pack_closeout`

Status:

`selected_certainteed_silentfx_nrc_astc_source_pack_extraction_after_v14_rerank_found_official_astc_product_stc_context_but_no_runtime_ready_import`

Selected next slice:

`certainteed_silentfx_nrc_astc_source_pack_extraction_v1`

Selected next label:

CertainTeed SilentFX NRC ASTC source-pack extraction

Selected next action:

`gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import`

Selected next file:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_CERTAINTEED_SILENTFX_NRC_ASTC_SOURCE_PACK_EXTRACTION_PLAN.md`

Implementation artifact:

`packages/engine/src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts`

Prior closeout status:

`closed_pabco_quietrock_sound_design_guide_source_pack_no_runtime_and_selected_source_gap_revalidation_v14_because_gate_b_found_no_runtime_ready_row`

## Summary

Gate A re-ranks source-readiness and accuracy work after PABCO Gypsum /
QuietRock Sound Design Guide closed no-runtime. PABCO, Georgia-Pacific,
National Gypsum, USG, ROCKWOOL, British Gypsum, and Knauf remain closed
context unless a future slice brings new row payload truth, exact live
topology, metric policy, material mapping, tolerance ownership,
protected negative boundaries, and paired visible tests.

The highest-value concrete locator now is CertainTeed SilentFX NRC ASTC
and product-data context. It is selected only for source-pack
extraction. It is not runtime-ready because ASTC / field / flanking
examples must be separated from lab or product `STC` rows, and the
SilentFX / generic gypsum / QuietRock / PABCO Type X material boundary
has no mapping/tolerance owner.

## Rerank Result

Selected:

`certainteed_silentfx_nrc_astc_source_pack_extraction_v1`

Reason:

PABCO Gate C closed the rank-1 post-Georgia-Pacific locator no-runtime,
so the next concrete official locator is CertainTeed SilentFX NRC ASTC
and product-data context. Its ASTC / field / flanking posture can look
too precise unless Gate A explicitly blocks metric leakage.

## Protected Boundaries

- `certainteed_silentfx_astc_field_flanking_examples_do_not_promote_dyn_echo_rw_or_dntw`
- `certainteed_silentfx_product_stc_examples_do_not_promote_runtime_without_metric_topology_tolerance_and_visible_tests`
- `silentfx_and_generic_gypsum_or_quietrock_do_not_coalesce_without_material_mapping_tolerance_owner`
- `certainteed_context_does_not_fix_uris_2006_split_rockwool_rw_41_screening_result`
- `ga600_current_manual_context_requires_rights_safe_row_payload_before_extraction_or_runtime`
- `pabco_gate_b_source_rows_are_not_runtime_import_approval`
- `closed_manufacturer_rows_remain_context_only`
- `runtime_support_confidence_evidence_api_route_card_output_card_proposal_report_and_workbench_input_surfaces_remain_frozen`

## Rockwool Defect Posture

This checkpoint does not fix or retune the original rockwool reorder /
triple-leaf defect. The Uris 2006 source lane remains
`paused_waiting_rights_safe_source_packet`. The split-rockwool wall
answer remains low-confidence `multileaf_screening_blend`, `Rw 41`,
and must not be presented as fixed, correct, or source-validated.

## Next Step

Implement:

`packages/engine/src/certainteed-silentfx-nrc-astc-source-pack-extraction-gate-a-contract.test.ts`

with:

`gate_a_extract_certainteed_silentfx_nrc_astc_rows_without_runtime_import`

Gate A must extract the CertainTeed SilentFX NRC ASTC and product-data
source context while preserving metric, field-output, material-alias,
GA-600, PABCO, closed-manufacturer, and Uris 2006 negative boundaries.

## Validation

Validation completed on 2026-05-03:

- focused v14 Gate A contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v14-gate-a-contract.test.ts --maxWorkers=1`;
  1 file / 8 tests passed;
- continuity with PABCO Gate C / Gate B / Gate A,
  post-Georgia-Pacific Gate A, v13, Georgia-Pacific Gate C, and the
  route-source risk register: 8 files / 58 tests passed;
- `pnpm calculator:gate:current`: engine 215 files / 1190 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings, and whitespace guard passed;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after the final documentation sync.

Frozen surfaces: runtime, support, confidence, evidence, API,
route-card, output-card, proposal/report, and workbench-input.
