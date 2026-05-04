# Slice Plan - Calculator Post-Georgia-Pacific Source Acquisition v1

Label: post-Georgia-Pacific source acquisition

Slice id: `calculator_post_georgia_pacific_source_acquisition_v1`

Status: GATE A LANDED / PABCO EXTRACTION SELECTED

Selected first file:

`packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`

Selected first action:

`gate_a_acquire_and_classify_post_georgia_pacific_source_locators_without_runtime_import`

Selection status:

`selected_post_georgia_pacific_source_acquisition_v1_after_v13_rerank_found_no_runtime_ready_candidate_and_post_british_gypsum_official_locators_closed_no_runtime`

Selection validation:

`calculator_source_gap_revalidation_v13` Gate A validated this
selection on 2026-05-02: focused v13 Gate A 1 file / 8 tests;
route-source risk register 1 file / 4 tests; continuity 19 files /
134 tests; `pnpm calculator:gate:current` engine 210 files / 1151
tests, web 47 files / 227 passed + 18 skipped, build 5 / 5 with known
non-fatal `sharp/@img` warnings, whitespace guard passed,
`apps/web/next-env.d.ts` restored to `.next-typecheck`, and
`git diff --check` passed.

Gate A result:

`calculator_post_georgia_pacific_source_acquisition_v1` selected the
PABCO Gypsum / QuietRock Sound Design Guide source pack for no-runtime
extraction:

`pabco_quietrock_sound_design_guide_source_pack_extraction_v1`

Selected next file:

`packages/engine/src/pabco-quietrock-sound-design-guide-source-pack-extraction-gate-a-contract.test.ts`

Selected next action:

`gate_a_extract_pabco_quietrock_sound_design_guide_rows_without_runtime_import`

Selected next planning surface:

`docs/calculator/SLICE_PABCO_QUIETROCK_SOUND_DESIGN_GUIDE_SOURCE_PACK_EXTRACTION_PLAN.md`

Gate A selection status:

`selected_pabco_quietrock_sound_design_guide_source_pack_extraction_after_post_georgia_pacific_acquisition_found_official_row_pages_but_no_runtime_ready_import`

Prior v13 file:

`packages/engine/src/calculator-source-gap-revalidation-v13-gate-a-contract.test.ts`

Prior Georgia-Pacific Gate C status:

`closed_georgia_pacific_fire_sound_assemblies_source_pack_no_runtime_and_selected_source_gap_revalidation_v13_because_gate_b_found_no_runtime_ready_row`

## Objective

Acquire and classify the next source locators or rights-safe source
packets after the post-British-Gypsum official locator chain closed
no-runtime through Georgia-Pacific.

This is not a runtime import slice. Its job is to decide whether any
new source pack, source locator, or rights-safe packet is concrete
enough for a later extraction, mapping/tolerance, source-packet, or
validation slice. It must keep runtime, support, confidence, evidence,
API shape, route cards, output cards, proposal/report copy, output
support, and workbench-input behavior frozen.

## Why This Slice Is Next

`calculator_source_gap_revalidation_v13` found no source-ready runtime
candidate:

- the Uris 2006 triple-leaf / rockwool lane remains paused on
  `paused_waiting_rights_safe_source_packet`;
- the split-rockwool wall answer remains low-confidence
  `multileaf_screening_blend` (`Rw 41`) and must not be presented as
  fixed or source-validated;
- Georgia-Pacific, National Gypsum, USG, ROCKWOOL, British Gypsum, and
  Knauf source rows are closed no-runtime unless new payload truth
  appears;
- CLT / mass timber, generated floor, no-stud double-leaf,
  lined-heavy, field-output, and historical blocked families still
  need new exact topology, metric, tolerance, material mapping,
  protected negative boundaries, and paired visible-test ownership.

Repeating another runtime attempt on this exhausted source set would
create false precision. The next useful accuracy step is a fresh,
bounded source acquisition pass.

## Gate A - Source Locator Acquisition Decision

Gate A should add:

`packages/engine/src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts`

Required records:

1. Official source locator matrix after ROCKWOOL, USG, National
   Gypsum, Georgia-Pacific, British Gypsum, Knauf, and the Uris lane
   closeouts.
2. Rights-safe source packet / URL locator policy for the rockwool
   triple-leaf / two-cavity lane and other high-value families.
3. Candidate eligibility rules for exact topology, metric context,
   tolerance owner, local material mapping, protected negative
   boundaries, and paired visible tests.
4. Search targets for:
   - rockwool / triple-leaf / two-cavity wall rows;
   - CLT / mass timber wall and floor rows;
   - generated floor, steel, open-web, and open-box floor rows;
   - no-stud double-leaf rows;
   - lined-heavy / heavy-core / masonry wall rows;
   - double-board timber or steel stud rows not already closed;
   - field-output metric-policy and report-copy source support.
5. Explicit rejection rules for closed Georgia-Pacific, National
   Gypsum, USG, ROCKWOOL, British Gypsum, Knauf, and historical
   blockers.
6. Selected next extraction, mapping/tolerance, source-packet, or
   revalidation slice only if a concrete locator or packet becomes
   ready.

## Frozen Surfaces

Until a later gate names a fully source-ready runtime candidate, all of
these surfaces stay frozen:

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Acceptance Rules

Gate A may select runtime work only if a candidate already names all of:

- exact source row, exact topology, or bounded family/formula rule;
- metric owner and lab / field context;
- tolerance owner;
- local material/thickness mapping to engine inputs;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime and selects
source extraction, mapping/tolerance, source-packet intake, another
acquisition pass, or another source-gap revalidation step.

## Validation

Completed for Gate A on 2026-05-02:

- focused post-Georgia-Pacific acquisition Gate A contract: 1 file / 8
  tests;
- continuity with v13, Georgia-Pacific Gate C / Gate B / Gate A,
  National Gypsum, USG, ROCKWOOL, British Gypsum, and the route/source
  risk register: 20 files / 142 tests;
- `pnpm calculator:gate:current`: engine 211 files / 1159 tests, web
  47 files / 227 passed + 18 skipped, build 5 / 5 with known non-fatal
  `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  build side-effect;
- `git diff --check` passed after the final documentation sync.

Focused future Gate A command:

`pnpm --filter @dynecho/engine exec vitest run src/calculator-post-georgia-pacific-source-acquisition-gate-a-contract.test.ts --maxWorkers=1`
