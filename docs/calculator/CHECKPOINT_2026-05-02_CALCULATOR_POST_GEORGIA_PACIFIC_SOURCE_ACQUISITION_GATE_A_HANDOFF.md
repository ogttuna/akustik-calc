# Checkpoint - 2026-05-02 - Calculator Post-Georgia-Pacific Source Acquisition Gate A

Slice:

`calculator_post_georgia_pacific_source_acquisition_v1`

Gate landed:

`gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import`

Status:

`selected_pabco_quietrock_sound_design_guide_source_pack_extraction_after_post_georgia_pacific_acquisition_found_official_row_pages_but_no_runtime_ready_import`

Selected next slice:

`pabco_quietrock_sound_design_guide_source_pack_extraction_v1`

Selected next action:

`gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import`

Selected next file:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`

Selected planning surface:

`docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md`

Implementation artifact:

`packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`

Prior v13 status:

`selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime`

## Summary

Gate A acquires and classifies source locators after the post-British
Gypsum official locator chain closed no-runtime through Georgia-Pacific.

The selected next slice is the PABCO Gypsum / QuietRock Sound Design
Guide source pack. It has official row pages and guide context with
`STC`, fire design context, wall thickness, approximate weight, bearing,
product layers, stud type/spacing, resilient channel, insulation, and
test report numbers. It is selected only for no-runtime extraction.

This gate does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

## Source Locator Ranking

Rank 1, selected for no-runtime extraction:

- PABCO Gypsum / QuietRock Sound Design Guide and Sound Assembly Tool:
  `https://go.pabcogypsum.com/tsdg`
  and
  `https://quietrock.com/resources/sound-control-assembly-selector/`
  - examples: `PGD-W-646-16`, `PGD-W-445-16`, `PGD-W-449-24`,
    `PGD-68-534-16`, `PGD-546-407-16`, and `PGD-W6-467-24`;
  - metrics: `STC`, NOAL / NRC test report number, fire design context;
  - first missing requirement: row payload extraction, `STC` -> DynEcho
    metric policy, local material alias mapping, tolerance owner,
    protected negative boundaries, retrieved summary-report payloads,
    and paired visible tests.

Ranked but not selected:

- CertainTeed SilentFX NRC ASTC report and product data:
  `https://publications-cnrc.canada.ca/eng/view/object/?id=f308069f-1b20-4aac-bc6d-e7b174ff21bb`
  and `https://ctonesource.certainteed.com/Products/PDF/CTG-2481.pdf`
  remain context until direct lab metric policy is separated from
  ASTC/field/flanking examples.
- Gypsum Association GA-600-2024:
  `https://gypsumpublications.com/product/fire-resistance-and-sound-control-design-manual-ga-600-2024/`
  remains authoritative context until rights-safe current row payloads
  are available in the calculator corpus.
- The closed ROCKWOOL / USG / National Gypsum / Georgia-Pacific /
  British Gypsum / Knauf source chain and paused Uris 2006 source lane
  remain context only.

## Rockwool Defect Posture

This gate still does not fix or retune the original rockwool reorder /
triple-leaf defect. PABCO rows are useful wall source context, but they
are not the missing Uris 2006 internal-leaf / two-cavity source packet.
The split-rockwool wall answer remains low-confidence
`multileaf_screening_blend` (`Rw 41`) and must not be presented as
fixed, correct, or source-validated. The Uris 2006 lane remains
`paused_waiting_rights_safe_source_packet`.

## Protected Boundaries

- `pabco_quietrock_stc_row_pages_do_not_promote_dyn_echo_rw_or_field_outputs_without_metric_policy`
- `quietrock_es_510_530_545_and_generic_pabco_type_x_do_not_coalesce_with_generic_gypsum_or_mlv_without_material_mapping`
- `pabco_single_staggered_double_stud_rows_do_not_fix_the_uris_2006_split_rockwool_triple_leaf_rw_41_screening_result`
- `pabco_glass_fiber_wood_steel_rc_rows_do_not_reopen_closed_rockwool_usg_national_gypsum_georgia_pacific_british_gypsum_or_knauf_decisions`
- `pabco_summary_report_download_links_are_not_runtime_truth_until_payloads_are_retrieved_and_curve_or_metric_policy_is_owned`

## Frozen Surfaces

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Next Step

Implement:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`

with:

`gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import`

Gate A must extract row locators and blockers. It may only select
runtime work if exact topology, metric owner, tolerance owner, local
material mapping, protected negative boundaries, and paired engine/web
visible tests are named together.

## Validation

Completed on 2026-05-02:

- focused post-Georgia-Pacific Gate A: 1 file / 8 tests;
- continuity with v13, Georgia-Pacific, National Gypsum, USG,
  ROCKWOOL, British Gypsum, and the route-source risk register:
  20 files / 142 tests;
- `pnpm calculator:gate:current`: engine 211 files / 1159 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after the final documentation sync.
